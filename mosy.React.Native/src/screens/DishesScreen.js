import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-navigation';
import { FlatList, Image, View, StyleSheet } from 'react-native';
import { Button, Card, Text, SearchBar } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
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
          containerStyle={{ padding: 7, marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: 7 }}>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "stretch" }}>
            <Image
              style={{ width: 130, height: 130, marginRight: 5 }}
              source={{ uri: "https://media.gettyimages.com/photos/different-types-of-food-on-rustic-wooden-table-picture-id861188910?s=612x612" }} />
            <View>
              <Text h4 style={{ color: "black" }}>{item.name}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    }} />


    <ActionButton
      renderIcon={() => <IoniconsIcon name="ios-color-filter" size={22} color="white" />}
      buttonColor="orange"
      onPress={handleShowFilters}
      style={styles.filtersButton}
    />
    <DishFiltersModal ref={dishFiltersModalRef} />
  </View>;
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