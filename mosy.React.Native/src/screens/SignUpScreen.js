import React, { useContext, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, TouchableOpacity, Image, ImageBackground, View, Keyboard } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';
import { navigate } from '../navigationRef';
import { authService } from '../services/authService';
import backgroundImage from '../../assets/img/login/signup_background.jpg'
import logo from '../../assets/img/logo_no_background.png';

const SignUpScreen = ({ navigation }) => {
  const { state, signup, signupClear } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const emailInputRef = useRef(null);
  const passInputRef = useRef(null);
  const repeatPassInputRef = useRef(null);

  const handleSignUp = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    await signup({ email, password: pass, confirmPassword: repeatPass });
  };

  useEffect(() => {
    setIsLoading(false);
  }, [state.message, state.errorMessage]);

  useEffect(() => {
    if (state.signupSuccess) {
      navigation.navigate("CheckEmail", { email: email });
      signupClear();
    }
  }, [state.signupSuccess]);

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
            placeholderTextColor="rgba(255, 255, 255, .8)"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => passInputRef.current.focus()}
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
            returnKeyType="next"
            onSubmitEditing={() => repeatPassInputRef.current.focus()}
            placeholder='Password'
            value={pass}
            onChangeText={setPass}
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<MaterialCommunityIcon name='lock' size={24} color='white' />} />

          <Input
            ref={repeatPassInputRef}
            inputStyle={styles.input}
            containerStyle={styles.inputUpperContainer}
            inputContainerStyle={styles.inputContainer}
            placeholderTextColor="rgba(255, 255, 255, .8)"
            leftIconContainerStyle={styles.inputLeftIconContainer}
            secureTextEntry
            placeholder='Repeat password'
            returnKeyType="go"
            enablesReturnKeyAutomatically={false}
            onSubmitEditing={handleSignUp}
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
                    disabled
                    title="Sign up"
                    loadingProps={{ color: '#90002D' }}
                    onPress={handleSignUp}
                    titleStyle={styles.loginButtonTitle}
                    buttonStyle={styles.loginButtonContainer} />
                  : <Button
                    disabled={!(email && pass && repeatPass)}
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