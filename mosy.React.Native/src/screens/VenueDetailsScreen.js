import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';
import Spacer from '../components/Spacer';

const VenueDetailsScreen = () => {
  return <SafeAreaView forceInset={{ top: "always" }}>
    <Spacer>
      <Text h3>VenueDetailsScreen</Text>
    </Spacer>
  </SafeAreaView>;
};

const styles = StyleSheet.create({});

export default VenueDetailsScreen;