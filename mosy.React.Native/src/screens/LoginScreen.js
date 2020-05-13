import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, TouchableOpacity, Image, ImageBackground, View } from 'react-native';
import { Button, Input, Text, withTheme } from 'react-native-elements';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';
import { navigate } from '../navigationRef';
import { authService } from '../services/authService';
import backgroundImage from '../../assets/img/login/login_background.jpg';
import logo from '../../assets/img/logo_no_background.png';

const LoginScreen = ({ navigation }) => {
  const { state, signin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const handleSignIn = async () => {
    setIsLoading(true);
    await signin({ email, password: pass });
  };

  // useEffect(() => {
  //   async function init() {

  //   }
  //   init();
  // }, []);

  useEffect(() => {
    if (state.user && state.user.roles && state.user.roles.length && state.user.roles.filter(role => role.name != "WebApiUser").length) {
      if (state.user.roles.filter(role => role.name == "TableAccountOperator").length)
        navigation.navigate("mainOperatorFlow");
      else
        navigation.navigate("mainCustomerFlow");
    }

    return () => { };
  }, [state.user]);


  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.loginForm}>
          <Image width={100} height={100} source={logo} style={styles.logo} />

          <Input
            inputStyle={styles.input}
            containerStyle={styles.inputUpperContainer}
            inputContainerStyle={styles.inputContainer}
            leftIconContainerStyle={styles.inputLeftIconContainer}
            placeholder='Email address'
            placeholderTextColor="rgba(255, 255, 255, .8)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none" autoCorrect={false}
            leftIcon={<MaterialCommunityIcon name='email' size={24} color='white' />} />

          <Input
            inputStyle={styles.input}
            containerStyle={styles.inputUpperContainer}
            inputContainerStyle={styles.inputContainer}
            placeholderTextColor="rgba(255, 255, 255, .8)"
            leftIconContainerStyle={styles.inputLeftIconContainer}
            secureTextEntry
            placeholder='Password'
            value={pass}
            onChangeText={setPass}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<MaterialCommunityIcon name='lock' size={24} color='white' />} />

          {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}

          {
            isLoading
              ? <Button
                loading
                title="Log in"
                loadingProps={{ color: '#90002D' }}
                onPress={handleSignIn}
                titleStyle={styles.loginButtonTitle}
                buttonStyle={styles.loginButtonContainer} />
              : <Button
                title="Log in"
                loadingProps={{ color: '#90002D' }}
                onPress={handleSignIn}
                titleStyle={styles.loginButtonTitle}
                buttonStyle={styles.loginButtonContainer} />
          }

          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.link}>Don't have an account? Sign up instead.</Text>
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

export default LoginScreen;