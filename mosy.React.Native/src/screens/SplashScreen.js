import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MOSY_WEBAPI_USER, MOSY_WEBAPI_PASS } from 'react-native-dotenv';

import { Context as AuthContext } from '../context/AuthContext';
import { Context as FiltersContext } from '../context/FiltersContext';


const SplashScreen = ({ onInitializationFinished }) => {
  const { signin } = useContext(AuthContext);
  const { loadFilters } = useContext(FiltersContext);

  useEffect(() => {
    async function init() {
      await signin({ email: MOSY_WEBAPI_USER, password: MOSY_WEBAPI_PASS });
      await loadFilters();

      if (onInitializationFinished) onInitializationFinished();
    }
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#90002D',
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SplashScreen;