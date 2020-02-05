import React, { useRef } from 'react';
import { SafeAreaView } from 'react-navigation';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { TabView, SceneMap } from 'react-native-tab-view';

import Spacer from '../components/Spacer';
import OpenTableAccountModal from '../components/modal/OpenTableAccountModal';

const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);
const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);
const initialLayout = { width: Dimensions.get('window').width };

const MenuScreen = () => {
  // const openTableAccountModalRef = useRef(null);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  const handleOpenTableAccount = () => {
    openTableAccountModalRef.current.show();
  };

  return <View style={{ flex: 1 }}>
    {/* 
      <Spacer>
        <Text h3>MenuScreen</Text>
      </Spacer> 
    */}

    {/* 
      <Spacer>
        <Button title="Open table account" onPress={handleOpenTableAccount} />
      </Spacer> 
    */}

    <TabView
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={SceneMap({
        first: FirstRoute,
        second: SecondRoute,
      })}
    />

    {/* <OpenTableAccountModal ref={openTableAccountModalRef} /> */}
  </View>;
};


const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

export default MenuScreen;