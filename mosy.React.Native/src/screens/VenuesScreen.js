import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, Button, View } from 'react-native';
import { Text, SearchBar } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Spacer from '../components/Spacer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import VenueFiltersModal from '../components/modal/VenueFiltersModal';
import ActionButton from 'react-native-action-button';



const VenuesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState();

  const venueFiltersModalRef = useRef(null);

  const handleShowFilters = () => {
    venueFiltersModalRef.current.show();
  };

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
    <Spacer>
      <Text h3>Venues</Text>
    </Spacer>
    <Spacer>
      <Button title="Details" onPress={() => navigation.navigate("VenueDetails")} />
    </Spacer>
    <Spacer>
      <Button title="Menu" onPress={() => navigation.navigate("Menu")} />
    </Spacer>

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
  container: { flex: 1 },
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
