import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, TouchableOpacity, Image, ImageBackground, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';

import { Context as AuthContext } from '../context/AuthContext';
import { Context as UserContext } from '../context/UserContext';
import { authService } from '../services/authService';
import { hubsConnectivityService } from '../services/websockets/hubsConnectivityService';
import backgroundImage from '../../assets/img/login/login_background.jpg';
import logo from '../../assets/img/logo_no_background.png';


const ProfileScreen = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const { signoutUser } = authContext;
  const userContext = useContext(UserContext);
  const { clearUser, loadUserImageContent, setOperationalVenue } = userContext;

  const [isSignOutLoading, setIsSignOutLoading] = useState("");

  const handleChangeSelectedOperationalVenue = (selectedVenueId) => {

    const preselected = userContext.state.selectedOperationalVenue != null
      ? userContext.state.selectedOperationalVenue
      : (
        userContext.state.user.tableRegionUsers && userContext.state.user.tableRegionUsers.length
          ? userContext.state.user.tableRegionUsers[0].tableRegion.fbo
          : null
      );

    let venue = userContext.state.user
      && userContext.state.user.tableRegionUsers.length
      && userContext.state.user.tableRegionUsers.filter(x => x.tableRegion.fbo.id == selectedVenueId).length
      ? userContext.state.user.tableRegionUsers.filter(x => x.tableRegion.fbo.id == selectedVenueId)[0].tableRegion.fbo
      : preselected;

    setOperationalVenue(venue);
  };

  const handleSignOut = async () => {
    setIsSignOutLoading(true);
    hubsConnectivityService.stopAllConnections();
    await signoutUser();
  };

  const getVenuesToSelect = () => {
    const venueIds = userContext.state.user && userContext.state.user.tableRegionUsers && userContext.state.user.tableRegionUsers.length
      ? userContext.state.user.tableRegionUsers.map(x => x.tableRegion.fbo.id)
      : [];

    const distinctVenueIds = [...new Set(venueIds)];

    return distinctVenueIds.map((venueId) => {
      const venue = userContext.state.user.tableRegionUsers.filter(x => x.tableRegion.fbo.id == venueId).map(x => x.tableRegion.fbo)[0];

      return ({ label: `Operated Venue: ${venue.name}`, key: venue.id, value: venue.id });
    });
  };

  useEffect(() => {
    if (!authContext.signoutSuccess
      && userContext.state.user
      && userContext.state.user.profileImage
      && !userContext.state.user.profileImage.base64x300) {

      loadUserImageContent(3);
    }
  }, [userContext.state.user]);

  useEffect(() => {
    if (authContext.state.signoutSuccess) {
      clearUser();
      navigation.navigate("mainFlow");
    }
  }, [authContext.state.signoutSuccess]);

  useEffect(() => {

  }, []);

  return (
    <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.logoutForm}>
          <Image
            style={styles.profileImage}
            source={
              userContext.state.user && userContext.state.user.profileImage && userContext.state.user.profileImage.contentType && userContext.state.user.profileImage.base64x300
                ? { uri: `data:${userContext.state.user.profileImage.contentType};base64,${userContext.state.user.profileImage.base64x300}` }
                : logo
            } />

          <Text style={styles.names}>
            {
              userContext.state.user && [userContext.state.user.firstName || "", userContext.state.user.lastName || ""].join(" ").trim().length
                ? [userContext.state.user.firstName || "", userContext.state.user.lastName || ""].join(" ").trim()
                : userContext.state.user.username
            }
          </Text>

          {
            userContext.state.user && userContext.state.user.roles && userContext.state.user.roles.length
              ? (
                <Text style={styles.roles}>
                  {`(${userContext.state.user.roles.map(x => x.displayName).join(', ')})`}
                </Text>
              )
              : null
          }

          <View style={styles.bottomActionsContainer}>
            {
              userContext.state.user && userContext.state.user.roles && userContext.state.user.roles.length && userContext.state.user.roles.filter(x => x.name == 'TableAccountOperator').length
                && userContext.state.user.tableRegionUsers && userContext.state.user.tableRegionUsers.length
                ? <View style={styles.operationalVenueSelectContainer}>
                  <RNPickerSelect
                    items={getVenuesToSelect()}
                    value={
                      userContext.state.selectedOperationalVenue
                        ? userContext.state.selectedOperationalVenue.id
                        : "Not selected"
                    }
                    onValueChange={handleChangeSelectedOperationalVenue}
                    useNativeAndroidPickerStyle={false}
                    style={pickerSelectStyles} />
                </View>
                : null
            }

            {
              isSignOutLoading
                ? <Button
                  loading
                  title="Sign out"
                  loadingProps={{ color: '#90002D' }}
                  titleStyle={styles.logoutButtonTitle}
                  buttonStyle={styles.logoutButtonContainer} />
                : <Button
                  title="Sign out"
                  loadingProps={{ color: '#90002D' }}
                  onPress={handleSignOut}
                  titleStyle={styles.logoutButtonTitle}
                  buttonStyle={styles.logoutButtonContainer} />
            }
          </View>

        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
    textAlign: 'center',
    justifyContent: 'flex-end',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'white',
    textAlign: 'center',
    justifyContent: 'flex-end',
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", },
  backgroundImage: { flex: 1, resizeMode: 'cover', justifyContent: 'flex-start', paddingBottom: 40 },
  bottomActionsContainer: { flex: 1, justifyContent: "flex-end", },
  profileImage: { alignSelf: 'center', marginTop: 80, width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: 'white', },
  names: { alignSelf: 'center', textAlign: 'center', marginTop: 20, fontSize: 20, color: "white", fontWeight: "bold", },
  roles: { alignSelf: 'center', textAlign: 'center', marginLeft: 30, marginRight: 30, fontSize: 12, color: "white", fontStyle: "italic", },
  logoutForm: { marginLeft: 10, marginRight: 10, flex: 1, },
  logoutButtonContainer: { marginTop: 10, marginHorizontal: 10, backgroundColor: 'white', borderRadius: 20, },
  logoutButtonTitle: { color: '#90002D', },
  operationalVenueSelectContainer: { borderWidth: 2, borderRadius: 25, borderColor: 'white', height: 45, marginHorizontal: 10, marginTop: 10 },
});

export default ProfileScreen;