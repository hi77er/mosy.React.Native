import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-navigation';
import { FlatList, Image, View, StyleSheet } from 'react-native';
import { Button, Card, Text, SearchBar } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DishFiltersModal from '../components/modal/DishFiltersModal';
import ActionButton from 'react-native-action-button';
// MaterialCommunityIcons - map-maker-distance
// FontAwesome - walking || MaterialCommunityIons - time-sand
// Ionicons - md-pricetag

import Spacer from '../components/Spacer';

const DishesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState();

  const dishFiltersModalRef = useRef(null);

  const dishes = [
    { id: "1", name: "Dish 1" },
    { id: "2", name: "Dish 2" },
    { id: "3", name: "Dish 3" },
    { id: "4", name: "Dish 4" },
    { id: "5", name: "Dish 5" },
    { id: "6", name: "Dish 6" },
    { id: "7", name: "Dish 7" },
    { id: "8", name: "Dish 8" },
    { id: "9", name: "Dish 9" },
    { id: "10", name: "Dish 10" },
    { id: "11", name: "Dish 11" },
    { id: "12", name: "Dish 12" },
  ];

  const handleShowFilters = () => {
    dishFiltersModalRef.current.show();
  };

  return <View style={styles.container}>
    <SafeAreaView forceInset={{ top: "always" }} style={{ backgroundColor: "#90002d" }}>
      <SearchBar
        placeholder="Search dishes ..."
        placeholderTextColor="white"
        selectionColor="white"
        searchIcon={() => <MaterialIcon name="search" size={24} color="white" />}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        value={searchQuery}
        onChangeText={setSearchQuery}
        inputStyle={styles.searchInput}
        clearIcon={
          () => <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialIcon name="clear" size={24} color="white" />
          </TouchableOpacity>
        }
      />
    </SafeAreaView>

    <FlatList data={dishes} renderItem={({ item }) => {
      return <TouchableOpacity onPress={() => navigation.navigate("DishDetails")}>
        <Card
          key={item.id}
          containerStyle={{
            paddingLeft: 7,
            paddingBottom: 7,
            paddingTop: 7,
            paddingRight: 0,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 7,
          }}>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "stretch" }}>
            <Image
              style={{ width: 130, height: 130, marginRight: 5 }}
              source={{ uri: "https://media.gettyimages.com/photos/different-types-of-food-on-rustic-wooden-table-picture-id861188910?s=612x612" }} />
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 3 }}>
                  <Text style={{ color: "#666", fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
                  <Text style={{ color: "darkgray", fontSize: 13, fontWeight: "bold" }}>{item.name}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  {/* open/close/new/recom */}
                  <Text style={{ fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "#7fb800" }}>CLOSED</Text>
                  <Text style={{ fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "#ffb400" }}>RECOM</Text>
                  <Text style={{ fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "dodgerblue" }}>NEW</Text>
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "nowrap", alignContent: "center", marginRight: 7 }}>
                {/* distance/time/price */}
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                  {/* distance */}
                  <MaterialCommunityIcons name="map-marker-distance" size={28} color="#666" />
                  <Text style={{ color: "#666", fontWeight: "bold", fontSize: 18 }}>999m</Text>
                </View>
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }} >
                  {/* arriving in */}
                  <FontAwesome5Icon name="walking" size={28} color="#666" />
                  <Text style={{ color: "#666", fontWeight: "bold", fontSize: 18 }}>38min</Text>
                </View>
                <View style={{ flex: 3, justifyContent: "center", alignItems: "center" }}>
                  {/* price */}
                  <IoniconsIcon name="md-pricetag" size={28} color="#666" style={{ transform: [{ scaleX: -1 }] }} />
                  <Text style={{ color: "#666", fontWeight: "bold", fontSize: 18 }}>999,99лв.</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    }} />


    < ActionButton
      renderIcon={() => <IoniconsIcon name="ios-color-filter" size={22} color="white" />}
      buttonColor="orange"
      onPress={handleShowFilters}
      style={styles.filtersButton}
    />
    <DishFiltersModal ref={dishFiltersModalRef} />
  </View >;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#90002D" },
  searchContainer: {
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    backgroundColor: "#90002d",
  },
  searchInputContainer: {
    backgroundColor: "#630017",
    borderRadius: 8,
  },
  searchInput: {
    color: "white",
    opacity: 0.85,
  },
  filtersButton: {
    position: "absolute",
    bottom: -10,
    right: -10,
  }
});

export default DishesScreen;