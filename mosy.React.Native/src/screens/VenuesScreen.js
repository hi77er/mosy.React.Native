import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-navigation';
import { FlatList, Image, StyleSheet, Button, View } from 'react-native';
import { Text, SearchBar, Card } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Spacer from '../components/Spacer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import VenueFiltersModal from '../components/modal/VenueFiltersModal';
import ActionButton from 'react-native-action-button';



const VenuesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState();

  const venueFiltersModalRef = useRef(null);

  const handleShowFilters = () => {
    venueFiltersModalRef.current.show();
  };

  const venues = [
    { id: "1", name: "Venue number 1" },
    { id: "2", name: "Venue number 2" },
    { id: "3", name: "Venue number 3" },
    { id: "4", name: "Venue number 4" },
    { id: "5", name: "Venue number 5" },
    { id: "6", name: "Venue number 6" },
    { id: "7", name: "Venue number 7" },
    { id: "8", name: "Venue number 8" },
    { id: "9", name: "Venue number 9" },
    { id: "10", name: "Venue number 10" },
    { id: "11", name: "Venue number 11" },
    { id: "12", name: "Venue number 12" },
  ];


  return <View style={styles.container}>
    <SafeAreaView forceInset={{ top: "always" }} style={{ backgroundColor: "#90002d" }}>
      <SearchBar
        placeholder="Search venues ..."
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

    <FlatList data={venues} renderItem={({ item }) => {
      return <Card
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
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 5 }}>
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
        <View style={{ flex: 1, flexDirection: "row", marginRight: 7 }}>
          <Image
            style={{ width: 130, height: 130, marginRight: 5 }}
            source={{ uri: "https://media.gettyimages.com/photos/different-types-of-food-on-rustic-wooden-table-picture-id861188910?s=612x612" }} />
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 3, alignItems: "center", justifyContent: "flex-end" }}>
              <MaterialCommunityIcons name="map-marker-distance" size={28} color="#666" />
              <Text style={{ fontWeight: "bold", color: "#666" }}>999km</Text>
            </View>
            <View style={{ flex: 3, alignItems: "center", justifyContent: "flex-end" }}>
              <FontAwesome5Icon name="walking" size={28} color="#666" />
              <Text style={{ fontWeight: "bold", color: "#666" }}>38min</Text>
            </View>
            <View style={{ flex: 4, alignItems: "center", justifyContent: "flex-end" }}>
              <TouchableOpacity style={{ borderWidth: 2, borderColor: "#90002d", width: 80, height: 80, borderRadius: 7, justifyContent: "center", alignItems: "center" }} onPress={() => navigation.navigate("Menu")}>
                <Text style={{ textAlign: "center", fontWeight: "bold", color: "#90002d" }}>MENU</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 4, alignItems: "center", justifyContent: "flex-end" }}>
              <TouchableOpacity style={{ borderWidth: 2, borderColor: "#90002d", width: 80, height: 80, borderRadius: 7, justifyContent: "center", alignItems: "center" }} onPress={() => navigation.navigate("VenueDetails")}>
                <Text style={{ textAlign: "center", fontWeight: "bold", color: "#90002d" }}>VENUE INFO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>
    }}>

    </FlatList>

    <ActionButton
      renderIcon={() => <IoniconsIcon name="ios-color-filter" size={22} color="white" />}
      buttonColor="orange"
      onPress={handleShowFilters}
      style={styles.filtersButton}
    />
    <VenueFiltersModal ref={venueFiltersModalRef} />

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



export default VenuesScreen;
