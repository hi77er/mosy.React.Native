import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import Spacer from '../components/Spacer';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return <SafeAreaView forceInset={{ top: "always" }}>
    <Spacer>
      <Text h3>SignUp</Text>
    </Spacer>
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
    <Spacer>
      <Button title="Sign up" onPress={() => { }} />
    </Spacer>
    <Spacer>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text>
          Already have an account? Log in instead.
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


export default SignUpScreen;