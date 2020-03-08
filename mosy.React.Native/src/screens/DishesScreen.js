import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-navigation';
import { ActivityIndicator, FlatList, Image, View, StyleSheet, Alert, RefreshControl } from 'react-native';
import { SearchBar } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { requestPermissionsAsync, watchPositionAsync, Accuracy } from 'expo-location';
import FiltersBar from '../components/nav/top/filters/FiltersBar';
import { dishesService } from '../services/dishesService';
import { Context as FiltersContext } from '../context/FiltersContext';
import DishItem from '../components/dishes/DishItem';


const DishesScreen = ({ navigation }) => {
  const {
    state,
    resetSelectedFilters,
    resetFiltersChanged,
    setDishesSearchQuery
  } = useContext(FiltersContext);

  const [geolocation, setGeolocation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [closestDishes, setClosestDishes] = useState([]);
  const [hasMoreElements, setHasMoreElements] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);



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

  const loadDishes = (count, currentClosestDishes) => {
    if (geolocation) {
      const { latitude, longitude } = geolocation;
      const selectedFilters = state.selectedFilters && state.selectedFilters.length
        ? state.selectedFilters
        : [];

      dishesService
        .getClosestDishes(
          latitude, longitude, count, currentClosestDishes.length, state.dishesSearchQuery,
          selectedFilters.filter(x => x.filterType == 201).map(x => x.id),
          selectedFilters.filter(x => x.filterType == 205).map(x => x.id),
          selectedFilters.filter(x => x.filterType == 202).map(x => x.id),
          selectedFilters.filter(x => x.filterType == 203).map(x => x.id),
          selectedFilters.filter(x => x.filterType == 204).map(x => x.id),
          !state.showRecommendedDishes,
          state.showClosedVenues
        )
        .then((res) => {
          if (res) {
            // console.log(res);
            setClosestDishes([...currentClosestDishes, ...res]);
            setHasMoreElements(res.length == count);
            if (isRefreshing) setIsRefreshing(false);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleSearchFilteredDishes = () => {
    setClosestDishes([]);
    loadDishes(12, []);
    resetFiltersChanged();

    if (showFilters) setShowFilters(false);
  };

  const handleRefresh = () => {
    setClosestDishes([]);
    setIsRefreshing(true);
    loadDishes(12, []);
  }

  const handleLoadMore = () => {
    if (hasMoreElements)
      loadDishes(8, closestDishes);
    else
      console.log("No more Elem!");
  };

  useEffect(() => {
    watchLocation().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (closestDishes == null || closestDishes.length == 0)
      loadDishes(12, []);
  }, [geolocation]);


  return <View style={styles.container}>
    <SafeAreaView forceInset={{ top: "always" }} style={{ backgroundColor: "#90002d" }}>
      <View style={{ flexDirection: "row" }}>
        <SearchBar
          placeholder="Search dishes ..."
          placeholderTextColor="white"
          selectionColor="white"
          searchIcon={() => <MaterialIcon name="search" size={24} color="white" />}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          value={state.dishesSearchQuery}
          onChangeText={setDishesSearchQuery}
          inputStyle={styles.searchInput}
          clearIcon={
            () => <TouchableOpacity onPress={() => { setDishesSearchQuery(""); }}>
              <MaterialIcon name="clear" size={24} color="white" />
            </TouchableOpacity>
          }
        />
        {
          state.filtersChanged
            ? <TouchableOpacity onPress={handleSearchFilteredDishes}>
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
          showFilters && state.areDefaultDishFilters
            ? <TouchableOpacity
              onPress={() => Alert.alert(
                "Reset filters?",
                "",
                [
                  { text: 'Cancel', onPress: () => { } },
                  { text: 'Set default', onPress: () => { resetSelectedFilters(2); handleSearchFilteredDishes(); } }
                ]
              )}>
              <MaterialCommunityIcon style={styles.topNavIconButton} name="playlist-remove" size={29} color="white" />
            </TouchableOpacity>
            : null
        }
      </View>
      {showFilters ? <FiltersBar filteredType={2} /> : null}
    </SafeAreaView>
    {
      closestDishes && closestDishes.length
        ? <FlatList
          data={closestDishes}
          renderItem={({ item }) => <DishItem item={item} navigation={navigation} />}
          onEndReached={handleLoadMore}
          onEndThreshold={0}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />} />
        : <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="white" />
        </View>
    }

  </View>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#90002D" },
  searchContainer: {
    flex: 1,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    backgroundColor: "#90002d",
  },
  searchInputContainer: {
    backgroundColor: "#630017",
    borderRadius: 8,
  },
  topNavIconButton: { marginLeft: 5, marginTop: 12, marginRight: 15, },
  searchInput: {
    color: "white",
    opacity: 0.85,
  },
  filtersButton: {
    position: "absolute",
    bottom: -10,
    right: -10,
  },
  cardLabelGreen: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "green" },
  cardLabelLightGreen: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "#7fb800" },
  cardLabelBlue: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "dodgerblue" },
  cardLabelYellow: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "#ffb400" },
  cardLabelRed: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "red" },
});

export default DishesScreen;