import React, { useContext, useState, useEffect } from 'react';
//import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, TouchableOpacity, Image, ImageBackground, View, WebView } from 'react-native';
import { Button, Input, Text, withTheme } from 'react-native-elements';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';

import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';
import { navigate } from '../navigationRef';
import { authService } from '../services/authService';
import backgroundImage from '../../assets/img/login/login_background.jpg'
import logo from '../../assets/img/logo_no_background.png';

const SignUpScreen = ({ navigation }) => {
  const { state, signup, signin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const handleSignUp = async () => {
    setIsLoading(true);
    await signup({ email, password: pass, confirmPassword: repeatPass, recaptchaResponseToken: "recaptchaResponseToken" });
  };

  useEffect(() => {
    setIsLoading(false);
  }, [state.message, state.errorMessage]);

  useEffect(() => {
    if (state.user && state.user.roles && state.user.roles.length && state.user.roles.filter(role => role.name != "WebApiUser").length) {
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

          <Input
            inputStyle={styles.input}
            containerStyle={styles.inputUpperContainer}
            inputContainerStyle={styles.inputContainer}
            placeholderTextColor="rgba(255, 255, 255, .8)"
            leftIconContainerStyle={styles.inputLeftIconContainer}
            secureTextEntry
            placeholder='Repeat password'
            value={repeatPass}
            onChangeText={setRepeatPass}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<MaterialCommunityIcon name='lock' size={24} color='white' />} />

          {state.errorMessage ? <Text style={styles.errorMessage}>{state.errorMessage}</Text> : null}
          {state.message ? <Text style={styles.message}>{state.message}</Text> : null}

          {
            !state.message
              ? (
                isLoading
                  ? <Button
                    loading
                    title="Sign up"
                    loadingProps={{ color: '#90002D' }}
                    onPress={handleSignUp}
                    titleStyle={styles.loginButtonTitle}
                    buttonStyle={styles.loginButtonContainer} />
                  : <Button
                    title="Sign up"
                    loadingProps={{ color: '#90002D' }}
                    onPress={handleSignUp}
                    titleStyle={styles.loginButtonTitle}
                    buttonStyle={styles.loginButtonContainer} />
              )
              : null
          }

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Already have an account? Log in instead.</Text>
          </TouchableOpacity>

          {/*<WebView source={{ uri: "https://facebook.github.io/react-native/" }} />

          {/*https://www.google.com/recaptcha/api/siteverify */}
          <ReCaptchaV3
            onReceiveToken={(key) => console.log(key)}
            captchaDomain={"treatsparkweb.azurewebsite.net"}
            siteKey={"6LfX_rgUAAAAALk9lAtnvEVUOEqjLm06gXkawVLu"}
          />
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
  message: {
    fontSize: 13,
    color: "lightgreen",
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

export default SignUpScreen;