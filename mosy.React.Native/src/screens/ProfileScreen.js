import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, TouchableOpacity, Image, ImageBackground, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';

import { Context as AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import backgroundImage from '../../assets/img/login/login_background.jpg';
import logo from '../../assets/img/logo_no_background.png';


const ProfileScreen = () => {
  const { state, signoutUser, loadUserImageContent } = useContext(AuthContext);
  const [isSignOutLoading, setIsSignOutLoading] = useState("");
  const [selectedOperationalVenue, setSelectedOperationalVenue] = useState(
    state.user && state.user.fboUserRoles && state.user.fboUserRoles.length && state.user.fboUserRoles.filter(x => x.role.name == 'TableAccountOperator').length
      ? state.user.fboUserRoles.filter(x => x.role.name == 'TableAccountOperator').map(x => x.fbo.name)[0]
      : 'Not selected'
  );

  const handleSignOut = async () => {
    setIsSignOutLoading(true);
    await signoutUser();
  };

  useEffect(() => {
    const init = async () => {
      if (state.user && state.user.profileImage && !state.user.profileImage.base64x300) {
        loadUserImageContent(3);
      }
      const isAuthorized = authService.isAuthorized();
      if (!isAuthorized) {
        navigation.navigate("mainFlow");
      }
    };
    init();
  }, [state.user]);

  return (
    <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.logoutForm}>
          <Image
            style={styles.profileImage}
            source={
              state.user && state.user.profileImage && state.user.profileImage.contentType && state.user.profileImage.base64x300
                ? { uri: `data:${state.user.profileImage.contentType};base64,${state.user.profileImage.base64x300}` }
                : logo
            } />

          <Text style={styles.names}>
            {
              state.user && [state.user.firstName || "", state.user.lastName || ""].join(" ").trim().length
                ? [state.user.firstName || "", state.user.lastName || ""].join(" ").trim()
                : state.user.username
            }
          </Text>

          {
            state.user && state.user.roles && state.user.roles.length
              ? (
                <Text style={styles.roles}>
                  {`(${state.user.roles.map(x => x.displayName).join(', ')})`}
                </Text>
              )
              : null
          }

          {
            state.user && state.user.roles && state.user.roles.length && state.user.roles.filter(x => x.name == 'TableAccountOperator').length
              && state.user.fboUserRoles && state.user.fboUserRoles.length && state.user.fboUserRoles.filter(x => x.role.name == 'TableAccountOperator').length
              ? <View style={styles.languageHeaderActionButton}>
                <Dropdown
                  label={`Operational Venue: ${selectedOperationalVenue}`}
                  baseColor="white"
                  value={selectedOperationalVenue}
                  data={state.user.fboUserRoles.filter(x => x.role.name == 'TableAccountOperator').map(x => ({ value: x.fbo.name }))}
                  containerStyle={styles.languageHeaderActionButtonTouch}
                  inputContainerStyle={{ alignItems: 'center' }}
                  labelTextStyle={{ width: '100%', marginTop: 5 }}
                  onChangeText={(v) => setSelectedOperationalVenue(v)} />
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