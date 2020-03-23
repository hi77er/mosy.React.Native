import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Image, ImageBackground, Modal, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, Card } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ImagesPreviewModal from '../components/modal/ImagesPreviewModal';
import { Context as VenuesContext } from '../context/VenuesContext';


const VenueDetailsScreen = ({ navigation }) => {
  const venueId = navigation.state.params.venueId;
  const imagesPreviewModalRef = useRef(null);
  const testImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ZA0bTmaUt-QTjm7n9AtFUJPBNANfKS79cWjyBgXGSJEAHST1ug&s";
  const { state, getVenue } = useContext(VenuesContext);
  const venue =
    state.detailedVenues && state.detailedVenues.length && state.detailedVenues.filter((item) => item.id == venueId).length
      ? state.detailedVenues.filter((item) => item.id == venueId)[0]
      : null;

  useEffect(() => {
    if (!venue) {
      async function init() {
        console.log('vliza');
        await getVenue(venueId);
      };
      init();
    }
  }, []);

  return <View style={{ flex: 1 }}>
    {console.log("in view1: ", venue)}
    <View style={{ height: '45%' }}>
      <ImageBackground
        source={{ uri: testImageUrl }}
        style={{ flex: 1, justifyContent: "flex-end" }}
        imageStyle={{ height: "100%", resizeMode: "stretch" }}>
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(144,0,46,1)']}
          style={{ flex: 1 }}>
          <View style={{ flex: 1, marginLeft: 20, marginBottom: 10, marginRight: 20, alignItems: "flex-end", flexDirection: "row" }}>
            <View style={{ flex: 2 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
                {venue.name}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>
                {venue.class}
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={{ marginRight: 10, borderWidth: 2, borderColor: "white", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" }}
                onPress={() => imagesPreviewModalRef.current.show()}>
                <MaterialIcon name="call" size={24} color="white" />
              </TouchableOpacity>
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
      <Card containerStyle={{ borderRadius: 5 }}>
        <Text style={{ color: "#90002d", fontSize: 16 }}>
          Filters
        </Text>
      </Card>
      <Card containerStyle={{ height: 100, borderRadius: 5 }}>
        <Text style={{ color: "#90002d", fontSize: 16 }}>
          Contacts
        </Text>
      </Card>
      <Card containerStyle={{ height: 300, marginBottom: 15, borderRadius: 5 }}>
        <Text style={{ color: "#90002d", fontSize: 16 }}>
          Location
        </Text>
      </Card>
    </ScrollView>

    <ImagesPreviewModal ref={imagesPreviewModalRef} imageUrls={[{ url: testImageUrl }]} />
  </View>;
};


const styles = StyleSheet.create({});

export default VenueDetailsScreen;