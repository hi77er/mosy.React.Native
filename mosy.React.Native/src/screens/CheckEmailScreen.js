import React, { useContext, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, TouchableOpacity, Image, ImageBackground, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { openInbox } from 'react-native-email-link';

import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';
import { navigate } from '../navigationRef';
import { authService } from '../services/authService';
import backgroundImage from '../../assets/img/login/login_background.jpg'
import logo from '../../assets/img/logo_no_background.png';

const CheckEmailScreen = ({ navigation }) => {
  const emailLabel = navigation.state.params.email || "the email you have entered";

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.mainPanel}>
          <Image width={100} height={100} source={logo} style={styles.logo} />

          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            <Text>To confirm your email address, tap the button in the message we sent to </Text>
            <Text style={{ fontWeight: 'bold' }}>{emailLabel}</Text>
          </Text>
          <Text style={styles.subtitle}>PS: Remember to check spam folder if needed (wink).</Text>

          <Text style={styles.question}>Already confirmed your email?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Log in with password</Text>
          </TouchableOpacity>

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
    justifyContent: "flex-end",
    paddingBottom: 40
  },
  logo: {
    alignSelf: 'center',
    width: 200,
    height: 200,
  },
  title: {
    color: "white",
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
  },
  subtitle: {
    color: "white",
    marginLeft: 20,
    marginRight: 20,
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    color: "white",
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15,
    fontWeight: 'bold',
  },
  question: {
    color: "white",
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 120,
  },
  mainPanel: {
    marginLeft: 10,
    marginRight: 10,
  },
  checkButtonContainer: {
    marginTop: 10,
    marginBottom: 80,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: 'white',
    borderRadius: 20,
    width: 140,
  },
  checkButtonTitle: {
    color: '#90002D',
  },
});

export default CheckEmailScreen;