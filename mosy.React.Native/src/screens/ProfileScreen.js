import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, TouchableOpacity, Image, ImageBackground, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { Context as AuthContext } from '../context/AuthContext';
import backgroundImage from '../../assets/img/login/login_background.jpg';
import logo from '../../assets/img/logo_no_background.png';
import { authService } from '../services/authService';


const ProfileScreen = () => {
  const { state, signoutUser } = useContext(AuthContext);
  const [isSignOutLoading, setIsSignOutLoading] = useState("");


  const handleSignOut = async () => {
    setIsSignOutLoading(true);
    await signoutUser();
  };

  useEffect(() => {
    const init = async () => {
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
          <Image source={logo} style={styles.profileImage} />
          <Text style={styles.names}>
            {
              state.user && [state.user.firstName || "", state.user.lastName || ""].join(" ").trim().length
                ? [state.user.firstName || "", state.user.lastName || ""].join(" ").trim()
                : state.user.email
            }
          </Text>
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
  container: {
    flex: 1,
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    justifyContent: 'flex-start',
    paddingBottom: 40
  },
  bottomActionsContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  profileImage: {
    alignSelf: 'center',
    marginTop: 100,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'white',
  },
  names: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  logoutForm: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
  },
  logoutButtonContainer: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  logoutButtonTitle: {
    color: '#90002D',
  },
});

export default ProfileScreen;