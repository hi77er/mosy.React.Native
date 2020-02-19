import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Context as AuthContext } from '../context/AuthContext';


const SplashScreen = ({ onInitializationFinished }) => {
  const { signin } = useContext(AuthContext);

  useEffect(() => {
    async function init() {
      await signin({ email: 'webapiadmin@mosy.com', password: '!23Qwe' });

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