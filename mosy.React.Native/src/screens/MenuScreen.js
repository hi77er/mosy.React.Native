import React, { useState, useContext, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'react-native-best-viewpager';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { Context as VenuesContext } from '../context/VenuesContext';
import { venuesService } from '../services/venuesService';
import MenuItem from '../components/menu/MenuItem';
import { Dropdown } from 'react-native-material-dropdown';


const MenuScreen = ({ navigation }) => {
  const venueId = navigation.state.params.venueId;
  const { state, loadLocation, loadContacts, loadIndoorImageContent } = useContext(VenuesContext);
  const venue =
    state.closestVenues && state.closestVenues.length && state.closestVenues.filter((venue) => venue.id == venueId).length
      ? state.closestVenues.filter((venue) => venue.id == venueId)[0]
      : null;

  const [imageContent, setImageContent] = useState(
    venue && venue.indoorImageMeta && venue.indoorImageMeta.contentType && venue.indoorImageMeta.base64x200
      ? `data:${venue.indoorImageMeta.contentType};base64,${venue.indoorImageMeta.base64x200}`
      : null
  );

  const [menuLists, setMenuLists] = useState(venue && venue.brochures && venue.brochures.length ? venue.brochures : []);
  const [menuCultures, setMenuCultures] = useState([]);
  const [defaultMenuCulture, setDefaultMenuCulture] = useState(menuCultures && menuCultures.length ? menuCultures[0] : null);
  const [selectedCulture, setSelectedCulture] = useState(menuCultures && menuCultures.length ? menuCultures[0] : "");



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
    //console.log(venue);
    async function initVenueIndoorImage() {
      if (venue && venue.indoorImageMeta && venue.indoorImageMeta.id && venue.indoorImageMeta.contentType && !venue.indoorImageMeta.base64x200) {
        const image = await venuesService.getImageContent(venue.indoorImageMeta.id, 2);
        setImageContent(`data:${venue.indoorImageMeta.contentType};base64,${image.base64Content}`);
      }
    }
    async function initMenu() {
      if (venue && !venue.brochures && !(menuCultures && menuCultures.length)) {
        const result = await venuesService.getMenu(venueId);
        setDefaultMenuCulture(result.defaultMenuCulture);
        setMenuCultures(result.menuCultures);
        result.brochures = result
          .brochures
          .map((list) => {
            list.activeItemIds = [];
            return list;
          });
        setMenuLists(result.brochures);
      }
    }
    initVenueIndoorImage();
    initMenu();

  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-end", padding: 15 }}>
        <View style={{ flex: 1 }}>
          <Text h4>{venue.name}</Text>
          <Text>{venue.class}</Text>
        </View>
        {
          imageContent
            ? <Image style={styles.venueImage} source={{ uri: imageContent }} />
            : <View style={styles.venueImageContainer} >
              <EntypoIcon name='location' size={63} color={"#90002d"} />
            </View>
        }

      </View>

      <View style={{ flex: 1 }}>
        <IndicatorViewPager
          style={{ flex: 1, paddingTop: 20, backgroundColor: 'white' }}
          indicator={
            <PagerTitleIndicator trackScroll={true} titles={menuLists.map((menuList) => menuList.name)} />
          }>
          {
            menuLists.map((menuList, index) => (
              <View key={index}>
                <View>
                  <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 5 }}>
                    {menuList.name}
                  </Text>
                </View>

                <FlatList
                  data={menuList.requestables}
                  renderItem={({ item }) => <MenuItem item={item} key={item.id} />}
                  keyExtractor={item => item.id} />
              </View>
            ))
          }

        </IndicatorViewPager>
        {
          menuCultures && menuCultures.length > 1
            ? <View style={{ height: 100 }}>
              <Dropdown
                value={selectedCulture}
                data={menuCultures.filter(c => c != selectedCulture).map(c => ({ value: c }))}
                onChangeText={(v) => setSelectedCulture(v)} />
            </View>
            : null
        }
      </View>

    </View >
  );
};


const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  venueImage: {
    width: 120,
    height: 120,
  },
  venueImageContainer: {
    width: 100,
    height: 100,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    backgroundColor: "#fbeaef"
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default MenuScreen;