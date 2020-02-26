import React, { useState, useRef, useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-navigation';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { Text, SearchBar, Card } from 'react-native-elements';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FiltersBar from '../components/nav/top/filters/FiltersBar';
import { requestPermissionsAsync, watchPositionAsync, Accuracy } from 'expo-location';
import { venuesService } from '../services/venuesService';
import { locationHelper } from '../helpers/locationHelper';
import { Context as FiltersContext } from '../context/FiltersContext';

const VenuesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState();
  const [showFilters, setShowFilters] = useState(false);
  const [geolocation, setGeolocation] = useState(null);
  const [closestVenues, setClosestVenues] = useState([]);
  const { state } = useContext(FiltersContext);

  const watchLocation = async () => {
    await requestPermissionsAsync();

    await watchPositionAsync(
      {
        accuracy: Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 10,
      },
      (location) => {
        // console.log("INFO: Acquired LOCATION!");
        // console.log(location);
        setGeolocation(location.coords);
      },
    );
  };

  const loadVenues = () => {
    if (geolocation) {
      const { latitude, longitude } = geolocation;

      venuesService
        .getClosestVenues({ latitude, longitude })
        .then((res) => {
          if (res) {
            // const parsed = JSON.parse(res);
            // console.log(parsed);

            // console.log("INFO: Got VENUES!");
            // console.log(res);
            setClosestVenues(res);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const filters = [
    {
      name: "accessibility",
      label: "Accessibility",
      type: "MULTI_CHOICE",
      items: [
        { id: '92iijs7yta', name: 'Ondo Ondo Ondo', },
        { id: 'a0s0a8ssbsd', name: 'Ogun Ogun', },
        { id: '16hbajsabsd', name: 'Calabar Calabar Calabar', },
        { id: 'nahs75a5sg', name: 'Lagos Lagos', },
        { id: '667atsas', name: 'Maiduguri Maiduguri', },
        { id: 'hsyasajs', name: 'Anambra', },
        { id: 'djsjudksjd', name: 'Benue', },
        { id: 'sdhyaysdj', name: 'Kaduna Kaduna Kaduna', },
        { id: 'suudydjsjd', name: 'Abuja', }
      ],
    },
    {
      name: "availabilit",
      label: "Availability",
      type: "RADIO_BUTTON",
      items: [
        { id: '92iijs7yta', name: 'Ondo Ondo Ondo', },
        { id: 'a0s0a8ssbsd', name: 'Ogun Ogun', },
        { id: '16hbajsabsd', name: 'Calabar Calabar Calabar', },
        { id: 'nahs75a5sg', name: 'Lagos Lagos', },
        { id: '667atsas', name: 'Maiduguri Maiduguri', },
        { id: 'hsyasajs', name: 'Anambra', },
        { id: 'djsjudksjd', name: 'Benue', },
        { id: 'sdhyaysdj', name: 'Kaduna Kaduna Kaduna', },
        { id: 'suudydjsjd', name: 'Abuja', }
      ],
    },
    {
      name: "athmosphere",
      label: "Athmosphere",
      type: "MULTI_CHOICE",
      items: [
        { id: '92iijs7yta', name: 'Ondo Ondo Ondo', },
        { id: 'a0s0a8ssbsd', name: 'Ogun Ogun', },
        { id: '16hbajsabsd', name: 'Calabar Calabar Calabar', },
        { id: 'nahs75a5sg', name: 'Lagos Lagos', },
        { id: '667atsas', name: 'Maiduguri Maiduguri', },
        { id: 'hsyasajs', name: 'Anambra', },
        { id: 'djsjudksjd', name: 'Benue', },
        { id: 'sdhyaysdj', name: 'Kaduna Kaduna Kaduna', },
        { id: 'suudydjsjd', name: 'Abuja', }
      ],
    },
    {
      name: "experienceNotRequired",
      label: "Culture",
      type: "RADIO_BUTTON",
      items: [
        { id: '92iijs7yta', name: 'Ondo Ondo Ondo', },
        { id: 'a0s0a8ssbsd', name: 'Ogun Ogun', },
        { id: '16hbajsabsd', name: 'Calabar Calabar Calabar', },
        { id: 'nahs75a5sg', name: 'Lagos Lagos', },
        { id: '667atsas', name: 'Maiduguri Maiduguri', },
        { id: 'hsyasajs', name: 'Anambra', },
        { id: 'djsjudksjd', name: 'Benue', },
        { id: 'sdhyaysdj', name: 'Kaduna Kaduna Kaduna', },
        { id: 'suudydjsjd', name: 'Abuja', }
      ],
    }
  ];

  useEffect(() => {
    watchLocation().catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    loadVenues();
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
          value={searchQuery}
          onChangeText={setSearchQuery}
          inputStyle={styles.searchInput}
          clearIcon={
            () => <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcon name="clear" size={24} color="white" />
            </TouchableOpacity>
          } />
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          {
            showFilters
              ? <MaterialCommunityIcon style={styles.topNavIconButton} name="check" size={29} color="white" />
              : <MaterialCommunityIcon style={styles.topNavIconButton} name="tune" size={29} color="white" />
          }
        </TouchableOpacity>
      </View>
      {showFilters ? <FiltersBar filters={filters} /> : null}
    </SafeAreaView>

    <FlatList data={closestVenues} renderItem={({ item }) => {
      return <Card key={item.id} containerStyle={styles.cardContainerStyle}>
        <View style={styles.cardHeaderContainer}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardH1}>{item["name"]}</Text>
            <Text style={styles.cardH2}>{item.class}</Text>
          </View>
          <View style={styles.cardLabelsContainer}>
            <Text style={
              item.workingStatus === "Closed"
                ? styles.cardLabelRed
                : (
                  item.workingStatus === "Open"
                    ? styles.cardLabelLightGreen
                    : styles.cardLabelGreen
                )}>
              {item.workingStatus.toUpperCase()}
            </Text>
            {!item.isNew || <Text style={styles.cardLabelBlue}>NEW</Text>}
          </View>
        </View>
        <View style={styles.cardBodyContainer}>
          <Image
            style={styles.cardImage}
            source={{ uri: "https://media.gettyimages.com/photos/different-types-of-food-on-rustic-wooden-table-picture-id861188910?s=612x612" }} />
          <View style={styles.cardDashboardContainer}>
            <View style={styles.cardDashboardInfo}>
              <MaterialCommunityIcon name="map-marker-distance" size={28} color="#666" />
              <Text style={styles.cardDashboardInfoLabel}>{locationHelper.formatDistanceToVenue(item.distanceToDevice)}</Text>
            </View>
            <View style={styles.cardDashboardInfo}>
              <FontAwesome5Icon name="walking" size={28} color="#666" />
              <Text style={styles.cardDashboardInfoLabel}>{locationHelper.formatWalkingTimeToVenue(item.distanceToDevice)}</Text>
            </View>
            <View style={styles.cardDashboardButton}>
              <TouchableOpacity style={styles.cardDashboardButtonTouch} onPress={() => navigation.navigate("Menu")}>
                <Text style={styles.cardDashboardButtonLabel}>MENU</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardDashboardButton}>
              <TouchableOpacity
                style={styles.cardDashboardButtonTouch}
                onPress={() => navigation.navigate("VenueDetails")}>
                <Text style={styles.cardDashboardButtonLabel}>VENUE INFO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>
    }} />
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
