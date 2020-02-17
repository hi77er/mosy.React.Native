import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { requestPermissionsAsync, watchPositionAsync, Accuracy } from 'expo-location';

import { Context as AuthContext } from '../context/AuthContext';
import { Context as LocationContext } from '../context/LocationContext';


const SplashScreen = ({ onInitializationFinished }) => {
  const { signin } = useContext(AuthContext);
  const { state, setLocation } = useContext(LocationContext);

  const watchLocation = async () => {
    await requestPermissionsAsync();

    await watchPositionAsync(
      {
        accuracy: Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 10,
      },
      (location) => {
        if (state && !state.lastDetectedLocation)
          console.log("INFO: acquired LOCATION.");
        setLocation(location);
      }
    );
  };

  useEffect(() => {
    async function init() {
      await signin({ email: "webapiadmin@mosy.com", pass: "!23Qwe" });
      await watchLocation();

      if (onInitializationFinished) onInitializationFinished();
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TreatSpark</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#90002d",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
});

export default SplashScreen;
