import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { MOSY_WEBAPI_USER, MOSY_WEBAPI_PASS } from 'react-native-dotenv';
import * as Splash from 'expo-splash-screen';

import { Context as AuthContext } from '../context/AuthContext';
import { Context as FiltersContext } from '../context/FiltersContext';
import { Context as UserContext } from '../context/UserContext';

import splashImage from '../../assets/splash.png';

const SplashScreen = ({ onInitializationFinished }) => {
  const authContext = useContext(AuthContext);
  const filtersContext = useContext(FiltersContext);
  const userContext = useContext(UserContext);

  const { signin, signinClear } = authContext;
  const { loadFilters } = filtersContext;
  const { loadUser } = userContext;

  useEffect(() => {
    // prevents the out-of-the-box expo splash screen from hiding while work is done.
    Splash.preventAutoHideAsync();

    async function init() {
      await signin({ email: MOSY_WEBAPI_USER, password: MOSY_WEBAPI_PASS });
      await loadFilters();

      // hides the SplashScreen screen component
      if (onInitializationFinished) onInitializationFinished();
      // hides the out-of-the-box expo splash screen (image)
      Splash.hideAsync();
    }
    init();
  }, []);

  useEffect(() => {
    if (!userContext.state.user)
      loadUser();

    signinClear();
  }, [authContext.state.signinSuccess]);

  return (
    <View style={styles.container}>
      <Image source={splashImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#90002D',
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SplashScreen;