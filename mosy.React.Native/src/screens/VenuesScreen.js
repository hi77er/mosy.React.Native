import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-navigation';
import { ActivityIndicator, FlatList, StyleSheet, View, Alert, RefreshControl } from 'react-native';
import { SearchBar } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FiltersBar from '../components/nav/top/filters/FiltersBar';
import { requestPermissionsAsync, watchPositionAsync, Accuracy } from 'expo-location';
import { Context as FiltersContext } from '../context/FiltersContext';
import { Context as VenuesContext } from '../context/VenuesContext';
import VenueItem from '../components/venues/VenueItem';


const VenuesScreen = ({ navigation }) => {
  const filtersContext = useContext(FiltersContext);
  const { resetSelectedFilters, resetFiltersChanged, setVenuesSearchQuery } = filtersContext;
  const filtersState = filtersContext.state;
  const venuesContext = useContext(VenuesContext);
  const { loadVenues, startRefreshingClosestVenues } = venuesContext;
  const venuesState = venuesContext.state;


  const [showFilters, setShowFilters] = useState(false);
  const [geolocation, setGeolocation] = useState(null);


  const watchLocation = async () => {
    await requestPermissionsAsync();

    await watchPositionAsync(
      {
        accuracy: Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 10,
      },
      (location) => {
        setGeolocation(location.coords);
      },
    );
  };

  const handleSearchFilteredVenues = () => {
    if (geolocation) {
      const { selectedFilters, searchQuery, showClosedVenues } = filtersState;
      const { latitude, longitude } = geolocation;

      loadVenues(12, [], latitude, longitude, selectedFilters, searchQuery, showClosedVenues, true);
      resetFiltersChanged();

      if (showFilters) setShowFilters(false);
    }
  };

  const handleRefresh = () => {
    if (geolocation) {
      startRefreshingClosestVenues();

      const { selectedFilters, searchQuery, showClosedVenues } = filtersState;
      const { latitude, longitude } = geolocation;

      loadVenues(12, [], latitude, longitude, selectedFilters, searchQuery, showClosedVenues, true);
    }
  }


  const handleLoadMore = () => {
    if (venuesState.hasMoreClosestVenueResults)
      if (geolocation) {
        const { selectedFilters, searchQuery, showClosedVenues } = filtersState;
        const { closestVenues } = venuesState;
        const { latitude, longitude } = geolocation;

        loadVenues(8, closestVenues, latitude, longitude, selectedFilters, searchQuery, showClosedVenues, false);
      }
      else
        console.log("No more Elem!");
  };

  useEffect(() => {
    watchLocation().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if ((!venuesState.closestVenues || !venuesState.closestVenues.length) && geolocation) {
      const { selectedFilters, searchQuery, showClosedVenues } = filtersState;
      const { latitude, longitude } = geolocation;

      loadVenues(15, [], latitude, longitude, selectedFilters, searchQuery, showClosedVenues, false);
    }
  }, [geolocation]);

  return <View style={styles.container}>
    <SafeAreaView forceInset={{ top: "always" }} style={{ backgroundColor: "#90002d" }}>
      <View style={{ flexDirection: "row" }}>
        <SearchBar
          placeholder="Search venues ..."
          placeholderTextColor="white"
          selectionColor="white"
          searchIcon={() => <MaterialIcon name="search" size={24} color="white" />}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          value={filtersState.venuesSearchQuery}
          onChangeText={setVenuesSearchQuery}
          inputStyle={styles.searchInput}
          clearIcon={
            () => <TouchableOpacity onPress={() => setVenuesSearchQuery("")}>
              <MaterialIcon name="clear" size={24} color="white" />
            </TouchableOpacity>
          } />
        {
          filtersState.filtersChanged
            ? <TouchableOpacity onPress={handleSearchFilteredVenues}>
              <MaterialCommunityIcon style={styles.topNavIconButton} name="check" size={29} color="white" />
            </TouchableOpacity>
            : null
        }
        {
          !showFilters
            ? <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
              <MaterialCommunityIcon style={styles.topNavIconButton} name="tune" size={29} color="white" />
            </TouchableOpacity>
            : null
        }
        {
          showFilters && filtersState.areDefaultVenueFilters
            ? <TouchableOpacity
              onPress={() => Alert.alert(
                "Reset filters?",
                "",
                [
                  { text: 'Cancel', onPress: () => { } },
                  { text: 'Set default', onPress: () => { resetSelectedFilters(1); handleSearchFilteredVenues(); } }
                ]
              )}>
              <MaterialCommunityIcon style={styles.topNavIconButton} name="playlist-remove" size={29} color="white" />
            </TouchableOpacity>
            : null
        }
      </View>
      {showFilters ? <FiltersBar filteredType={1} /> : null}
    </SafeAreaView>

    {
      venuesState.closestVenues && venuesState.closestVenues.length
        ? (
          <FlatList
            data={venuesState.closestVenues}
            renderItem={({ item }) => <VenueItem item={item} navigation={navigation} />}
            onEndReached={handleLoadMore}
            onEndThreshold={0}
            refreshControl={<RefreshControl refreshing={venuesState.isRefreshingClosestVenues} onRefresh={handleRefresh} />} />
        )
        : (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )
    }

  </View >;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#90002D" },
  searchContainer: {
    flex: 1,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    backgroundColor: "#90002d",
  },
  searchInputContainer: { backgroundColor: "#630017", borderRadius: 8, },
  searchInput: { color: "white", },
  topNavIconButton: { marginLeft: 5, marginTop: 12, marginRight: 15, },
  cardContainerStyle: {
    paddingLeft: 7,
    paddingBottom: 7,
    paddingTop: 7,
    paddingRight: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 7,
  },
  cardHeaderContainer: { flex: 1, flexDirection: "row" },
  cardTitleContainer: { flex: 5 },
  cardLabelsContainer: { flex: 1 },
  cardH1: { color: "#666", fontSize: 16, fontWeight: "bold" },
  cardH2: { color: "darkgray", fontSize: 13, fontWeight: "bold" },
  cardLabelGreen: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "green" },
  cardLabelLightGreen: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "#7fb800" },
  cardLabelBlue: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "dodgerblue" },
  cardLabelYellow: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "#ffb400" },
  cardLabelRed: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "red" },
  cardBodyContainer: { flex: 1, flexDirection: "row", marginRight: 7 },
  cardImage: { width: 100, height: 100, marginRight: 5 },
  cardDashboardContainer: { flex: 1, flexDirection: "row" },
  cardDashboardInfo: { flex: 3, alignItems: "center", justifyContent: "flex-end" },
  cardDashboardInfoLabel: { fontWeight: "bold", color: "#666" },
  cardDashboardButton: { flex: 4, alignItems: "center", justifyContent: "flex-end" },
  cardDashboardButtonTouch: { borderWidth: 2, borderColor: "#90002d", width: 62, height: 62, borderRadius: 7, justifyContent: "center", alignItems: "center" },
  cardDashboardButtonLabel: { textAlign: "center", fontWeight: "bold", color: "#90002d" },
});


export default VenuesScreen;
