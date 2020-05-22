import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, TouchableOpacity, Image, ImageBackground, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';

import { Context as AuthContext } from '../context/AuthContext';
import { Context as UserContext } from '../context/UserContext';
import { authService } from '../services/authService';
import backgroundImage from '../../assets/img/login/login_background.jpg';
import logo from '../../assets/img/logo_no_background.png';


const ProfileScreen = ({ navigation }) => {
  const authContext = useContext(AuthContext);
  const { signoutUser } = authContext;
  const userContext = useContext(UserContext);
  const { clearUser, loadUserImageContent, setOperationalVenue } = userContext;

  const [isSignOutLoading, setIsSignOutLoading] = useState("");

  const handleSignOut = async () => {
    setIsSignOutLoading(true);
    await signoutUser();
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

          {
            userContext.state.user && userContext.state.user.roles && userContext.state.user.roles.length && userContext.state.user.roles.filter(x => x.name == 'TableAccountOperator').length
              && userContext.state.user.fboUserRoles && userContext.state.user.fboUserRoles.length && userContext.state.user.fboUserRoles.filter(x => x.role.name == 'TableAccountOperator').length
              ? <View style={styles.languageHeaderActionButton}>
                <Dropdown
                  label={
                    `Operational Venue: ${
                    userContext.state.selectedOperationalVenue
                      ? userContext.state.selectedOperationalVenue.name
                      : "Not selected"
                    }`
                  }
                  baseColor="white"
                  value={
                    userContext.state.selectedOperationalVenue
                      ? userContext.state.selectedOperationalVenue.name
                      : "Not selected"
                  }
                  data={
                    userContext.state.user && userContext.state.user.fboUserRoles.length
                      ? userContext.state.user.fboUserRoles
                        .filter(x => x.role.name == 'TableAccountOperator')
                        .map(x => ({ value: x.fbo.name, venueId: x.fbo.id }))
                      : []
                  }
                  containerStyle={styles.languageHeaderActionButtonTouch}
                  inputContainerStyle={{ alignItems: 'center' }}
                  labelTextStyle={{ width: '100%', marginTop: 5 }}
                  onChangeText={(v) => setOperationalVenue(v)} />
              </View>
              : null
          }

          <View style={styles.bottomActionsContainer}>
            {
              isSignOutLoading
                ? <Button
                  loading
                  title="Sign out"
                  loadingProps={{ color: '#90002D' }}
                  onPress={handleSignOut}
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


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", },
  backgroundImage: { flex: 1, resizeMode: 'cover', justifyContent: 'flex-start', paddingBottom: 40 },
  bottomActionsContainer: { flex: 1, justifyContent: "flex-end", },
  profileImage: { alignSelf: 'center', marginTop: 80, width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: 'white', },
  names: { alignSelf: 'center', textAlign: 'center', marginTop: 20, fontSize: 20, color: "white", fontWeight: "bold", },
  roles: { alignSelf: 'center', textAlign: 'center', marginLeft: 30, marginRight: 30, fontSize: 12, color: "white", fontStyle: "italic", },
  logoutForm: { marginLeft: 10, marginRight: 10, flex: 1, },
  logoutButtonContainer: { marginTop: 10, marginLeft: 10, marginRight: 10, backgroundColor: 'white', borderRadius: 20, },
  logoutButtonTitle: { color: '#90002D', },
  languageHeaderActionButton: { alignItems: "center", justifyContent: "center" },
  languageHeaderActionButtonTouch: { marginTop: 135, borderWidth: 2, borderColor: "white", width: 320, height: 45, borderRadius: 25, justifyContent: "center", alignItems: "center" },
});

export default ProfileScreen;