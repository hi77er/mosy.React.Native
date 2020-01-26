import React, { useContext } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-elements'


import Spacer from '../components/Spacer';
import { Context as AuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
  const { state, signout } = useContext(AuthContext);


  return (
    <SafeAreaView forceInset={{ top: "always" }}>
      <Spacer>
        <Text h3>Profile</Text>
      </Spacer>
      <Spacer>
        <Button title="Sign out" onPress={signout} />
      </Spacer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 250,
  },
});

export default ProfileScreen;