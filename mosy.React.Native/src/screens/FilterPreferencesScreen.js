import React, { useContext, useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, TouchableOpacity, Image, ImageBackground, View, Keyboard } from 'react-native';
import { Button, Input, Text, withTheme } from 'react-native-elements';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';


import { Context as AuthContext } from '../context/AuthContext';
import { Context as UserContext } from '../context/UserContext';

import { hubsConnectivityService } from '../services/websockets/hubsConnectivityService';

import backgroundImage from '../../assets/img/login/login_background.jpg';
import logo from '../../assets/img/logo_no_background.png';

const FilterPreferencesScreen = ({ navigation }) => {
  const goBack = navigation.state.params ? navigation.state.params.goBack : undefined;

 
  const [isLoading, setIsLoading] = useState("");


  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.loginForm}>
          <Image width={100} height={100} source={logo} style={styles.logo} />

         
    
         
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.link}>Skip</Text>
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
    marginBottom: 55,
    width: 200,
    height: 200,
  },
  link: {
    color: "white",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    fontWeight: 'bold',
  },
  errorMessage: {
    fontSize: 13,
    color: "white",
    fontStyle: 'italic',
    marginLeft: 15,
    marginBottom: 30,
  },
  loginForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  loginButtonContainer: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  loginButtonTitle: {
    color: '#90002D',
  },
  input: {
    color: 'white',
  },
  inputUpperContainer: {
    marginBottom: 15,
  },
  inputContainer: {
    borderBottomColor: 'white',
  },
  inputLeftIconContainer: {
    marginRight: 15,
  },
});

export default FilterPreferencesScreen;