import React, { useState, useContext, useEffect, useRef } from 'react';
import { ImageBackground, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';
import { IndicatorViewPager, PagerTitleIndicator } from 'react-native-best-viewpager';
import { FlatList } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

import { Context as TableAccountCustomerContext } from '../context/TableAccountCustomerContext';
import { Context as VenuesContext } from '../context/VenuesContext';
import { Context as UserContext } from '../context/UserContext';

import { venuesService } from '../services/venuesService';
import { accountOpenerService } from '../services/websockets/accountOpenerService';
import { hubsConnectivityService } from '../services/websockets/hubsConnectivityService';

import OrderModal from './modals/OrderModal';
import SelectTableModal from './modals/SelectTableModal';
import ImagePreviewModal from './modals/ImagePreviewModal';

import MenuItem from '../components/menu/MenuItem';
import NewOrderMenuItem from '../components/menu/NewOrderMenuItem';
import venueIndoorBackground from "../../assets/img/venues/indoor-background-paprika.jpg";
import { authService } from '../services/authService';
import { userService } from '../services/userService';


const MenuScreen = ({ navigation }) => {
  const venueId = navigation.state.params.venueId;
  const geolocation = navigation.state.params.geolocation;
  const imagePreviewModalRef = useRef(null);

  const userContext = useContext(UserContext);
  const venuesContext = useContext(VenuesContext);
  const { loadLocation, loadContacts, loadIndoorImageContent } = venuesContext;
  const tableAccountCustomerContext = useContext(TableAccountCustomerContext);
  const { setSelectedTable, setAssignedOperator, setOrderItem, setTableAccount, loadAccount } = tableAccountCustomerContext;

  const username = userContext.state.user ? userContext.state.user.username : "";

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

  const handleToggleShowOriginalImage = () => {
    if (venue.indoorImageMeta && venue.indoorImageMeta.contentType && venue.indoorImageMeta.base64x300)
      imagePreviewModalRef.current.toggleVisible(venue.indoorImageMeta);
  };

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
    if (isTableOrderSelected || isForHomeSelected || isPreorderSelected)
      selectTableModalRef.current.toggleVisible();
  };

  const handleSelectTableModalResult = (selectedTable) => {
    setSelectedTable(selectedTable);
  };

  // ACCOUNTS HUB
  const handleAccountStatusChanged = (result) => {
    console.log('AccountStatusChanged')
    setTableAccount(result.tableAccount);

    if (result.needsItemsStatusUpdate)
      accountOpenerService.invokeUpdateOrderRequestablesStatusAfterAccountStatusChanged(result.tableAccount.id);

    navigation.navigate("ClientTableOrders", { tableAccount });
    // TODO: Vibrate device for Account Status Update.
  };
  const handleAccountsHubSubscriptions = () => {
    const accountsHubConnection = hubsConnectivityService.getAccountsHubConnection();
    if (accountsHubConnection) {
      accountsHubConnection.on('AccountStatusChanged', handleAccountStatusChanged);
      accountOpenerService.invokeAccountsHubConnectedAsAccountOpener();
    }
  };

  // ORDERS HUB
  // const handleOrdersHubSubscriptions = () => {
  //   const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection();

  //   accountOpenerService.invokeOrdersHubConnectedAsAccountOpener();
  // };

  const handleOrderCheckPressed = () => {
    if (!tableAccountCustomerContext.state.tableAccount)
      orderModalRef.current.toggleVisible();
    else
      navigation.navigate("ClientTableOrders");
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


    handleAccountsHubSubscriptions();
  }, [tableAccountCustomerContext.state.newlySelectedTable]);

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

    if (userService.isUserAuthorized(userContext.state.user))
      loadAccount(venueId, username);
  }, []);

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.headerTouchContainer} onPress={handleToggleShowOriginalImage}>
        <View style={styles.headerContainer}>
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
              <View style={styles.gradientContainer}>
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
                              ? menuCultures.map((c) => ({ label: c.substring(0, 2).toUpperCase(), key: c, value: c }))
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
                          onPress={handleOrderCheckPressed}>
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
      </TouchableOpacity>

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
                    && (tableAccountCustomerContext.state.newlySelectedTable || tableAccountCustomerContext.state.tableAccount)
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

      {
        venue && venue.indoorImageMeta && venue.indoorImageMeta.contentType && venue.indoorImageMeta.base64x300
          ? <ImagePreviewModal ref={imagePreviewModalRef} imageMeta={venue.indoorImageMeta} />
          : null
      }
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { fontSize: 10, paddingHorizontal: 10, paddingVertical: 12, color: 'white', textAlign: 'center', justifyContent: 'flex-end', fontWeight: "bold", },
  inputAndroid: { fontSize: 10, paddingHorizontal: 10, paddingVertical: 12, color: 'white', textAlign: 'center', justifyContent: 'flex-end', fontWeight: "bold", },
});


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#90002D' },
  headerTouchContainer: { height: '30%' },
  headerContainer: { flex: 1 },
  imageBackgroundBorder: { flex: 1, justifyContent: "flex-end" },
  imageBackgroundContent: { height: "100%", resizeMode: "cover" },
  coverGradient: { flex: 1 },
  gradientContainer: { flex: 1, marginLeft: 20, marginBottom: 10, marginRight: 20, alignItems: "flex-end", flexDirection: "row" },
  titleContainer: { marginLeft: 20, marginRight: 20, marginTop: 5, alignItems: "center" },
  actionButtonsContainer: { flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end" },
  ringIcon: { marginRight: 8, borderWidth: 2, borderColor: "white", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" },
  directionsIcon: { borderWidth: 2, borderColor: "white", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" },
  orderActionButton: { alignItems: "center", justifyContent: "flex-end" },
  headerActionButton: { marginRight: 10, alignItems: "center", justifyContent: "flex-end" },
  headerActionButtonTouch: { borderWidth: 2, borderColor: "white", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" },
  headerActionButtonLabel: { textAlign: "center", fontWeight: "bold", color: "white", fontSize: 10 },
  orderHeaderActionButtonTouch: { backgroundColor: '#60a860' },
  checkHeaderActionButtonTouch: { backgroundColor: '#aaaae3' },
  languageHeaderActionButton: {},
  languageHeaderActionButtonContainer: { marginRight: 10, borderWidth: 2, borderColor: "white", width: 50, height: 50, borderRadius: 7, },
  languageHeaderActionButtonLabel: { fontSize: 14, color: '#90002D' },
  languageHeaderActionButtonItems: { alignItems: 'center', height: 10 },
  languageButton: { backgroundColor: 'transparent', color: 'white' },
});

export default MenuScreen;