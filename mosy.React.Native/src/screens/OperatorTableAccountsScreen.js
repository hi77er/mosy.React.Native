import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Spacer from '../components/Spacer';


const OperatorTableAccountsScreen = ({ navigation }) => {
  return (
    <SafeAreaView forceInset={{ top: "always" }}>
      <Spacer>
        <Text h3>
          Table Accounts
        </Text>
      </Spacer>
      <Spacer>
        <Button title="Table 1 orders" onPress={() => navigation.navigate("OperatorTableOrders")} />
      </Spacer>
    </SafeAreaView>
  );
};

export default OperatorTableAccountsScreen;