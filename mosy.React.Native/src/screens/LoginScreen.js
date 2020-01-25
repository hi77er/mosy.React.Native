import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';

import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';
import { navigate } from '../navigationRef';


const LoginScreen = ({ navigation }) => {
  const { state, signin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return <SafeAreaView forceInset={{ top: "always" }}>
    <Text h3>LoginScreen</Text>
    <Spacer>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false} />
    </Spacer>
    <Spacer>
      <Input
        secureTextEntry
        label="Password"
        value={pass}
        onChangeText={setPass}
        autoCapitalize="none"
        autoCorrect={false} />
    </Spacer>
    {state.errorMessage ? <Spacer><Text style={styles.errorMessage}>{state.errorMessage}</Text></Spacer> : null}
    <Spacer>
      <Button title="Log in" onPress={() => signin({ email, pass })} />
    </Spacer>
    <Spacer>
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text>
          Don't have an account? Sign up instead.
        </Text>
      </TouchableOpacity>
    </Spacer>
  </SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 250,
  },
  link: {
    color: "blue",
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginLeft: 15,
    marginTop: 15,
  },
});

export default LoginScreen;