import React, { useContext, useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, TouchableOpacity, Image, ImageBackground, View, Keyboard } from 'react-native';
import { Button, Input, Text, withTheme } from 'react-native-elements';
import MultiSelect from 'react-native-multiple-select';


import { Context as AuthContext } from '../context/AuthContext';
import { Context as UserContext } from '../context/UserContext';

import { hubsConnectivityService } from '../services/websockets/hubsConnectivityService';

import backgroundImage from '../../assets/img/login/login_background.jpg';
import logo from '../../assets/img/logo_no_background.png';

const FilterPreferencesScreen = ({ navigation }) => {
  const goBack = navigation.state.params ? navigation.state.params.goBack : undefined;
  const [selectedItems, setSelectedItems] = useState([]);

  const onSelectedItemsChange = (selItems) => {
    setSelectedItems(selItems);
  };

  const items = [{
    id: '92iijs7yta',
    name: 'Ondo'
  }, {
    id: 'a0s0a8ssbsd',
    name: 'Ogun'
  },
  ]



  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={{ flex: 6, justifyContent: "center" }}>
          <Text style={styles.headerText}>Tell us what you are into</Text>
        </View>
        <View style={{ flex: 8, paddingHorizontal: 40 }}>
          <MultiSelect
            select
            items={items}
            uniqueKey="id"
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText="Pick preference"
            searchInputPlaceholderText="Search perferences..."
            onChangeInput={(text) => console.log(text)}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#CCC' }}
            submitButtonColor="#CCC"
            submitButtonText="Ok"
          />
        </View>

        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 45 }}>
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            <TouchableOpacity onPress={() => { navigation.goBack(); navigation.navigate("dishesFlow") }}>
              <Text style={styles.link}>Skip</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={() => { }}>
              <Text style={styles.linkBold}>Save</Text>
            </TouchableOpacity>
          </View>
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
  headerText: {
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkBold: {
    color: "white",
    fontWeight: 'bold',
  },
  link: {
    color: "white",
  },
  errorMessage: {
    fontSize: 13,
    color: "white",
    fontStyle: 'italic',
    marginLeft: 15,
    marginBottom: 30,
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

export default FilterPreferencesScreen;