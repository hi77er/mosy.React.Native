import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Image, ImageBackground, Linking, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, Card } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import ImagesPreviewModal from '../components/modal/ImagesPreviewModal';
import { Context as VenuesContext } from '../context/VenuesContext';
import venueIndoorBackground from "../../assets/img/venues/indoor-background-paprika.jpg";
import MapView, { Marker } from 'react-native-maps';


const VenueDetailsScreen = ({ navigation }) => {
  const venueId = navigation.state.params.venueId;
  const imagesPreviewModalRef = useRef(null);
  const { state, loadLocation, loadContacts, loadIndoorImageContent } = useContext(VenuesContext);
  const venue =
    state.closestVenues && state.closestVenues.length && state.closestVenues.filter((item) => item.id == venueId).length
      ? state.closestVenues.filter((item) => item.id == venueId)[0]
      : null;

  const handleShowOriginalImage = () => {
    if (venue.indoorImageMeta && venue.indoorImageMeta.contentType && venue.indoorImageMeta.base64x300)
      imagesPreviewModalRef.current.show();
  };

  const handleWebContactClick = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported)
        Linking.openURL(url);
    });
  };

  const handleEmailContactClick = (email) => {
    Linking.openURL(`mailto:${email}`);
  };


  const handlePhoneContactClick = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  useEffect(() => {
    if (venue) {
      loadLocation(venue.id);
      loadContacts(venue.id);
      if (venue.indoorImageMeta) {
        loadIndoorImageContent(venue.id, venue.indoorImageMeta.id, 3);
      }
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: '45%' }}>
        <ImageBackground
          source={
            venue.indoorImageMeta && venue.indoorImageMeta.contentType && venue.indoorImageMeta.base64x300
              ? { uri: `data:${venue.indoorImageMeta.contentType};base64,${venue.indoorImageMeta.base64x300}` }
              : venueIndoorBackground
          }
          style={{ flex: 1, justifyContent: "flex-end" }}
          imageStyle={{ height: "100%", resizeMode: "stretch" }}>
          <LinearGradient
            colors={['transparent', 'transparent', 'rgba(144,0,46,1)']}
            style={{ flex: 1 }}>
            <View style={{ flex: 1, marginLeft: 20, marginBottom: 10, marginRight: 20, alignItems: "flex-end", flexDirection: "row" }}>
              <View style={{ flex: 2 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                  {venue ? venue.name : ''}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
                  {venue ? venue.class : ''}
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end" }}>
                {
                  venue.fboContacts && venue.fboContacts.phone
                    ? (
                      <TouchableOpacity
                        style={{ marginRight: 10, borderWidth: 2, borderColor: "white", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" }}
                        onPress={() => handlePhoneContactClick(venue.fboContacts.phone)}>
                        <MaterialIcon name="call" size={24} color="white" />
                      </TouchableOpacity>
                    )
                    : null
                }
                <TouchableOpacity
                  style={{ borderWidth: 2, borderColor: "white", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" }}
                  onPress={() => { }}>
                  <MaterialIcon name="directions" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>


      <ScrollView style={{ backgroundColor: "#90002d" }}>
        {
          venue.filters && venue.filters.length
            ? (
              <Card containerStyle={{ borderRadius: 5 }}>
                <Text style={{ color: "#90002d", fontSize: 16 }}>
                  Filters
                </Text>
                <Text style={{ color: "silver", }}>
                  {
                    venue && venue.filters && venue.filters.length
                      ? venue.filters.map((item) => item.name).join(', ')
                      : null
                  }
                </Text>
              </Card>
            )
            : null
        }
        {
          venue.fboContacts
            ? (
              <Card containerStyle={{ borderRadius: 5 }}>
                <Text style={{ color: "#90002d", fontSize: 16 }}>
                  Contacts
              </Text>
                {
                  venue.fboContacts.phone
                    ? (
                      <TouchableOpacity onPress={() => handlePhoneContactClick(`${venue.fboContacts.phoneCountryCode}${venue.fboContacts.phone}`)}>
                        <View style={styles.contactContainer} >
                          <EntypoIcon name={"phone"} size={22} color={"#90002d"} style={styles.contactIcon} />
                          <Text style={{ color: "silver", }}>{`${venue.fboContacts.phoneCountryCode} ${venue.fboContacts.phone}`}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                    : null
                }
                {
                  venue.fboContacts.email
                    ? (
                      <TouchableOpacity onPress={() => handleEmailContactClick(venue.fboContacts.email)}>
                        <View style={styles.contactContainer}>
                          <EntypoIcon name={"email"} size={22} color={"#90002d"} style={styles.contactIcon} />
                          <Text style={{ color: "silver", }}>{venue.fboContacts.email}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                    : null
                }
                {
                  venue.fboContacts.webPage
                    ? (
                      <TouchableOpacity onPress={() => handleWebContactClick(venue.fboContacts.webPage)}>
                        <View style={styles.contactContainer}>
                          <MaterialCommunityIcon name={"web"} size={22} color={"#90002d"} style={styles.contactIcon} />
                          <Text style={{ color: "silver", }}>{venue.fboContacts.webPage}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                    : null
                }
                {
                  venue.fboContacts.facebook
                    ? (
                      <TouchableOpacity onPress={() => handleWebContactClick(venue.fboContacts.facebook)}>
                        <View style={styles.contactContainer}>
                          <EntypoIcon name={"facebook"} size={22} color={"#90002d"} style={styles.contactIcon} />
                          <Text style={{ color: "silver", }}>{venue.fboContacts.facebook}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                    : null
                }
                {
                  venue.fboContacts.instagram
                    ? (
                      <TouchableOpacity onPress={() => handleWebContactClick(venue.fboContacts.instagram)}>
                        <View style={styles.contactContainer}>
                          <EntypoIcon name={"instagram"} size={22} color={"#90002d"} style={styles.contactIcon} />
                          <Text style={{ color: "silver", }}>{venue.fboContacts.instagram}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                    : null
                }
              </Card>
            )
            : null
        }
        {
          venue.fboLocation
            ? (
              <Card containerStyle={{ marginBottom: 15, borderRadius: 5, padding: 1 }}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: venue.fboLocation.latitude,
                    longitude: venue.fboLocation.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                  }}>
                  <Marker
                    coordinate={{
                      latitude: venue.fboLocation.latitude,
                      longitude: venue.fboLocation.longitude
                    }}
                    title={venue.name} />
                </MapView>
              </Card>
            )
            : null
        }
      </ScrollView>

      <ImagesPreviewModal
        ref={imagesPreviewModalRef}
        images={[
          {
            url: '',
            props: {
              source: venue.indoorImageMeta && venue.indoorImageMeta.contentType && venue.indoorImageMeta.base64x300
                ? `data:${venue.indoorImageMeta.contentType};base64,${venue.indoorImageMeta.base64x300}`
                : venueIndoorBackground
            }
          }
        ]} />
      {/* {console.log(venue.name)}
      {console.log(venue.indoorImageMeta)} */}
    </View>
  );
};


const styles = StyleSheet.create({
  map: { height: 250 },
  contactContainer: { flexDirection: "row", marginTop: 6 },
  contactIcon: { marginRight: 4 }
});

export default VenueDetailsScreen;