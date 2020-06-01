import React, { useState, useContext, useEffect, useRef } from 'react';
import { Image, ImageBackground, Linking, ScrollView, Share, StyleSheet, View } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'react-native-best-viewpager';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import Modal from 'react-native-modal';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { LinearGradient } from 'expo-linear-gradient';

import { Context as TableAccountCustomerContext } from '../context/TableAccountCustomerContext';
import { Context as VenuesContext } from '../context/VenuesContext';

import { authService } from '../services/authService';
import { venuesService } from '../services/venuesService';
import { hubsConnectivityService } from '../services/websockets/hubsConnectivityService';

import OrderModal from './Modals/OrderModal';
import SelectTableModal from './Modals/SelectTableModal';

import MenuItem from '../components/menu/MenuItem';
import NewOrderMenuItem from '../components/menu/NewOrderMenuItem';
import ImagesPreviewModal from '../components/modal/ImagesPreviewModal';
import venueIndoorBackground from "../../assets/img/venues/indoor-background-paprika.jpg";


const MenuScreen = ({ navigation }) => {
  const venueId = navigation.state.params.venueId;
  const geolocation = navigation.state.params.geolocation;

  const venuesContext = useContext(VenuesContext);
  const { loadLocation, loadContacts, loadIndoorImageContent } = venuesContext;
  const tableAccountCustomerContext = useContext(TableAccountCustomerContext);
  const { setSelectedTable, setAssignedOperator, placeNewOrder } = tableAccountCustomerContext;

  const venue = venuesContext.state.unbundledClosestVenues
    && venuesContext.state.unbundledClosestVenues.length
    && venuesContext.state.unbundledClosestVenues.filter((venue) => venue.id == venueId).length
    ? venuesContext.state.unbundledClosestVenues.filter((venue) => venue.id == venueId)[0]
    : null;

  const [imageContent, setImageContent] = useState(
    venue && venue.indoorImageMeta && venue.indoorImageMeta.contentType && venue.indoorImageMeta.base64x200
      ? `data:${venue.indoorImageMeta.contentType};base64,${venue.indoorImageMeta.base64x200}`
      : null
  );

  const orderModalRef = useRef(null);
  const selectTableModalRef = useRef(null);

  const [menuLists, setMenuLists] = useState(venue && venue.brochures && venue.brochures.length ? venue.brochures : []);
  const [menuCultures, setMenuCultures] = useState([]);
  const [defaultMenuCulture, setDefaultMenuCulture] = useState(menuCultures && menuCultures.length ? menuCultures[0] : null);
  const [selectedCulture, setSelectedCulture] = useState(menuCultures && menuCultures.length ? menuCultures[0] : "");

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${venue.name} https://www.treatspark.com/venue/${venue.id}`,
        url: `https://www.treatspark.com/venue/${venue.id}`,
        title: venue.name,
        dialogTitle: venue.name,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleForbidden = () => {
    navigation.navigate("Login", { goBack: true });
  };

  const handleOrderModalResult = (
    isPreorderSelected,
    isTableOrderSelected,
    isForHomeSelected,
    isTakeAwaySelected,
    isInPlaceSelected
  ) => {
    if (isTableOrderSelected)
      selectTableModalRef.current.toggleVisible();
  };

  const handleSelectTableModalResult = (selectedTable) => {
    setSelectedTable(selectedTable);
  };


  useEffect(() => {
    setSelectedCulture(
      menuCultures && menuCultures.length
        ? (
          defaultMenuCulture && menuCultures.filter(x => x == defaultMenuCulture).length
            ? menuCultures.filter(x => x == defaultMenuCulture)[0]
            : menuCultures[0]
        )
        : ""
    );
  }, [menuCultures]);

  useEffect(() => {
    if (venue) {
      if (venue.indoorImageMeta) {
        loadIndoorImageContent(venue.id, venue.indoorImageMeta.id, 3);
      }
    }
  }, [venue]);

  useEffect(() => {
    if (tableAccountCustomerContext.state.selectedTable) {
      hubsConnectivityService.connectToAccountsHubAsAccountOpener();
      hubsConnectivityService.connectToOrdersHubAsAccountOpener();
    }
  }, [tableAccountCustomerContext.state.selectedTable]);

  useEffect(() => {
    async function initVenueIndoorImage() {
      if (venue && venue.indoorImageMeta && venue.indoorImageMeta.id && venue.indoorImageMeta.contentType && !venue.indoorImageMeta.base64x200) {
        const image = await venuesService.getImageContent(venue.indoorImageMeta.id, 2);
        setImageContent(`data:${venue.indoorImageMeta.contentType};base64,${image.base64Content}`);
      }
    }
    async function initMenu() {
      if (venue && !venue.brochures && !(menuCultures && menuCultures.length)) {
        const menuResult = await venuesService.getMenu(venueId);
        // console.log(menuResult);

        setDefaultMenuCulture(menuResult.defaultMenuCulture);
        setMenuCultures(menuResult.menuCultures);
        menuResult.brochures = menuResult
          .brochures
          .map((list) => {
            list.activeItemIds = [];
            return list;
          });
        setMenuLists(menuResult.brochures);
      }
    }

    initVenueIndoorImage();
    initMenu();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#90002D' }}>
      {/* {
        console.log(
          hubsConnectivityService.getAllConnections() && hubsConnectivityService.getAllConnections().length
            ? hubsConnectivityService.getAllConnections().map(conn => ` (${conn.connectionId} - ${conn.connectionState} - ${conn.baseUrl})`)
            : 'No connections'
        )
      } */}
      <View style={{ height: '30%' }}>
        <ImageBackground
          source={
            venue && venue.indoorImageMeta && venue.indoorImageMeta.contentType && venue.indoorImageMeta.base64x300
              ? { uri: `data:${venue.indoorImageMeta.contentType};base64,${venue.indoorImageMeta.base64x300}` }
              : venueIndoorBackground
          }
          style={styles.imageBackgroundBorder}
          imageStyle={styles.imageBackgroundContent}>
          <LinearGradient
            colors={['transparent', 'transparent', 'rgba(144,0,46,1)']}
            style={styles.coverGradient}>
            <View style={styles.headerContainer}>
              <View style={{ flex: 2, flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-start" }}>
                <TouchableOpacity
                  style={{ borderWidth: 2, borderColor: "white", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" }}
                  onPress={handleShare}>
                  <MaterialIcon name="share" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View style={styles.actionButtonsContainer}>
                {
                  menuCultures && menuCultures.length > 1
                    ? <View style={{ ...styles.languageHeaderActionButtonContainer, width: 90 }}>
                      <RNPickerSelect
                        items={
                          menuCultures && menuCultures.length
                            ? menuCultures.map((c) => ({ label: c.substring(0, 2), key: c, value: c }))
                            : []
                        }
                        value={selectedCulture}
                        onValueChange={(c) => setSelectedCulture(c ? c : selectedCulture)}
                        useNativeAndroidPickerStyle={false}
                        style={pickerSelectStyles} />
                    </View>
                    : null
                }

                {
                  <View style={styles.headerActionButton}>
                    <TouchableOpacity
                      style={styles.headerActionButtonTouch}
                      onPress={() => navigation.navigate("VenueDetails", { venueId, geolocation })}>
                      <Text style={styles.headerActionButtonLabel}>VENUE INFO</Text>
                    </TouchableOpacity>
                  </View>
                }

                {
                  venue.hasOrdersManagementSubscription
                    ? <View style={styles.orderActionButton}>
                      <TouchableOpacity
                        style={[
                          styles.headerActionButtonTouch,
                          !tableAccountCustomerContext.state.tableAccount
                            ? styles.orderHeaderActionButtonTouch
                            : styles.checkHeaderActionButtonTouch
                        ]}
                        onPress={() => orderModalRef.current.toggleVisible()}>
                        {
                          !tableAccountCustomerContext.state.tableAccount
                            ? <Text style={styles.headerActionButtonLabel}>ORDER</Text>
                            : <Text style={styles.headerActionButtonLabel}>CHECK</Text>
                        }
                      </TouchableOpacity>
                    </View>
                    : null
                }
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      <View style={styles.titleContainer}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: "center" }}>
          {venue ? venue.name : ''}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white', marginLeft: 15, marginRight: 15, textAlign: "center" }}>
          Menu
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <IndicatorViewPager
          style={{ flex: 1, paddingTop: 20, backgroundColor: "#90002D" }}
          indicator={<PagerTitleIndicator trackScroll={true} titles={menuLists.map((menuList) => menuList.name)} />}>
          {
            menuLists.map((menuList, index) => (
              <View key={index}>
                <View>
                  <Text style={{ color: 'white', textAlign: 'center', fontStyle: 'italic', fontSize: 16, marginBottom: 5 }}>
                    {menuList.name}
                  </Text>
                </View>

                {
                  venue.hasOrdersManagementSubscription
                    && (
                      tableAccountCustomerContext.state.selectedTable
                      || (tableAccountCustomerContext.state.newlySelectedItems && tableAccountCustomerContext.state.newlySelectedItems.length)
                    )
                    ? <NewOrderMenuItem />
                    : null
                }

                <FlatList
                  data={menuList.requestables}
                  renderItem={({ item }) => (
                    <MenuItem
                      item={item} key={item.id}
                      selectedCulture={selectedCulture}
                      venueHasOrdersManagementSubscription={venue.hasOrdersManagementSubscription} />
                  )}
                  keyExtractor={item => item.id} />
              </View>
            ))
          }
        </IndicatorViewPager>
      </View>

      {
        venue.hasOrdersManagementSubscription && !tableAccountCustomerContext.state.tableAccount
          ? (
            <React.Fragment>
              <OrderModal
                ref={orderModalRef}
                onModalResult={handleOrderModalResult} />
              <SelectTableModal
                ref={selectTableModalRef}
                venueId={venueId}
                onModalResult={handleSelectTableModalResult}
                onForbiddenError={handleForbidden} />
            </React.Fragment>
          )
          : null
      }
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'white',
    textAlign: 'center',
    justifyContent: 'flex-end',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'white',
    textAlign: 'center',
    justifyContent: 'flex-end',
  },
});


const styles = StyleSheet.create({
  imageBackgroundBorder: { flex: 1, justifyContent: "flex-end" },
  imageBackgroundContent: { height: "100%", resizeMode: "cover" },
  coverGradient: { flex: 1 },
  headerContainer: { flex: 1, marginLeft: 20, marginBottom: 10, marginRight: 20, alignItems: "flex-end", flexDirection: "row" },
  titleContainer: { marginLeft: 20, marginRight: 20, marginTop: 5, alignItems: "center" },
  actionButtonsContainer: { flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end" },
  ringIcon: { marginRight: 8, borderWidth: 2, borderColor: "white", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" },
  directionsIcon: { borderWidth: 2, borderColor: "white", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" },
  orderActionButton: { alignItems: "center", justifyContent: "flex-end" },
  headerActionButton: { marginRight: 10, alignItems: "center", justifyContent: "flex-end" },
  headerActionButtonTouch: { borderWidth: 2, borderColor: "white", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" },
  headerActionButtonLabel: { textAlign: "center", fontWeight: "bold", color: "white", fontSize: 12 },
  orderHeaderActionButtonTouch: { backgroundColor: '#60a860' },
  checkHeaderActionButtonTouch: { backgroundColor: '#aaaae3' },
  languageHeaderActionButton: {},
  languageHeaderActionButtonContainer: {
    marginRight: 10,
    borderWidth: 2,
    borderColor: "white",
    width: 50,
    height: 50,
    borderRadius: 7,
  },
  languageHeaderActionButtonLabel: { fontSize: 14, color: '#90002D' },
  languageHeaderActionButtonItems: { alignItems: 'center', height: 10 },
  languageButton: { backgroundColor: 'transparent', color: 'white' },
});

export default MenuScreen;