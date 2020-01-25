import React, { useRef } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import Spacer from '../components/Spacer';
import OpenTableAccountModal from '../components/modal/OpenTableAccountModal';

const MenuScreen = () => {
  const openTableAccountModalRef = useRef(null);

  const handleOpenTableAccount = () => {
    openTableAccountModalRef.current.show();
  };

  return <SafeAreaView forceInset={{ top: "always" }}>
    <Spacer>
      <Text h3>MenuScreen</Text>
    </Spacer>
    <Spacer>
      <Button title="Open table account" onPress={handleOpenTableAccount} />
    </Spacer>

    <OpenTableAccountModal ref={openTableAccountModalRef} />
  </SafeAreaView>;
};

const styles = StyleSheet.create({});

export default MenuScreen;