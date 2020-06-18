import React, { useContext, useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, TouchableOpacity, Image, ImageBackground, View, Keyboard } from 'react-native';
import { Button, Input, Text, withTheme } from 'react-native-elements';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Spacer from '../components/Spacer';
import { navigate } from '../navigationRef';

import { Context as AuthContext } from '../context/AuthContext';
import { Context as UserContext } from '../context/UserContext';

import { authService } from '../services/authService';
import { hubsConnectivityService } from '../services/websockets/hubsConnectivityService';

import backgroundImage from '../../assets/img/login/login_background.jpg';
import logo from '../../assets/img/logo_no_background.png';

const LoginScreen = ({ navigation }) => {
  const goBack = navigation.state.params ? navigation.state.params.goBack : undefined;

  const authContext = useContext(AuthContext);
  const { signin, signinClear } = useContext(AuthContext);

  const userContext = useContext(UserContext);
  const { clearUser, loadUser } = userContext;

  const emailInputRef = useRef(null);
  const passInputRef = useRef(null);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const handleSignIn = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    await clearUser();
    await signin({ email, password: pass });
  };

  useEffect(() => {
    setIsLoading(false);
  }, [authContext.state.errorMessage]);

  useEffect(() => {
    if (authContext.state.signinSuccess
      && userContext.state.user
      && userContext.state.user.roles
      && userContext.state.user.roles.length
      && userContext.state.user.roles.filter(role => role.name != "WebApiUser").length) {


      hubsConnectivityService.connectToAccountsHub();
      hubsConnectivityService.connectToOrdersHub();


      if (userContext.state.user.roles.filter(role => role.name == "TableAccountOperator").length && userContext.state.selectedOperationalVenue)
        navigation.navigate("mainOperatorFlow");
      else
        navigation.navigate("mainCustomerFlow");

      // if (goBack && (typeof goBack) == 'string') navigation.navigate(goBack);
      // else if (goBack && (typeof goBack) == 'boolean') navigation.goBack();
    }

    signinClear();
  }, [userContext.state.user]);

  useEffect(() => {
    if (authContext.state.signinSuccess && !userContext.state.user)
      loadUser();
  }, [authContext.state.signinSuccess]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.loginForm}>
          <Image width={100} height={100} source={logo} style={styles.logo} />

          <Input
            ref={emailInputRef}
            inputStyle={styles.input}
            containerStyle={styles.inputUpperContainer}
            inputContainerStyle={styles.inputContainer}
            leftIconContainerStyle={styles.inputLeftIconContainer}
            placeholder='Email address'
            returnKeyType="next"
            onSubmitEditing={() => passInputRef.current.focus()}
            placeholderTextColor="rgba(255, 255, 255, .8)"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none" autoCorrect={false}
            leftIcon={<MaterialCommunityIcon name='email' size={24} color='white' />} />

          <Input
            ref={passInputRef}
            inputStyle={styles.input}
            containerStyle={styles.inputUpperContainer}
            inputContainerStyle={styles.inputContainer}
            placeholderTextColor="rgba(255, 255, 255, .8)"
            leftIconContainerStyle={styles.inputLeftIconContainer}
            secureTextEntry
            placeholder='Password'
            returnKeyType="go"
            enablesReturnKeyAutomatically={!(email && pass)}
            onSubmitEditing={handleSignIn}
            value={pass}
            onChangeText={setPass}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<MaterialCommunityIcon name='lock' size={24} color='white' />} />

          {authContext.state.errorMessage ? <Text style={styles.errorMessage}>{authContext.state.errorMessage}</Text> : null}

          {
            isLoading
              ? <Button
                loading
                disabled
                title="Log in"
                loadingProps={{ color: '#90002D' }}
                onPress={handleSignIn}
                titleStyle={styles.loginButtonTitle}
                buttonStyle={styles.loginButtonContainer} />
              : <Button
                // disabled={!(email && pass)}
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