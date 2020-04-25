import React, { useState, useContext, useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'react-native-best-viewpager';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { Context as VenuesContext } from '../context/VenuesContext';
import { venuesService } from '../services/venuesService';





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



  const _renderTitleIndicator = () => {
    return <PagerTitleIndicator trackScroll={true} titles={menuLists.map((menuList, key) => <Text key={key}>{menuList.name}</Text>)} />;
  };

  useEffect(
    () => {
      //console.log(venue);
      async function initVenueIndoorImage() {
        if (venue && venue.indoorImageMeta && venue.indoorImageMeta.id && venue.indoorImageMeta.contentType && !venue.indoorImageMeta.base64x200) {
          const image = await venuesService.getImageContent(venue.indoorImageMeta.id, 2);
          setImageContent(`data:${venue.indoorImageMeta.contentType};base64,${image.base64Content}`);
        }
      }
      async function initMenu() {
        if (venue && !venue.brochures) {
          const result = await venuesService.getMenu(venueId);
          //console.log(result.brochures);
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
          indicator={_renderTitleIndicator()}>
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
                  renderItem={({ item }) => (
                    <View key={index} style={{ padding: 5 }}>
                      <TouchableOpacity onPress={() => setMenuLists(
                        menuLists.map((list) => {
                          if (list.id == menuList.id) {
                            list.activeItemIds = list.activeItemIds.includes(item.id)
                              ? list.activeItemIds.filter(x => x != item.id)
                              : list.activeItemIds = [...list.activeItemIds, item.id];
                          }
                          return list;
                        })
                      )}>
                        <View style={{ height: 30, padding: 5, backgroundColor: 'lightblue' }}>
                          <Text>{item.name}</Text>
                        </View>
                      </TouchableOpacity>
                      {
                        menuList.activeItemIds && menuList.activeItemIds.includes(item.id)
                          ? <View style={{ height: 50, padding: 5, backgroundColor: 'gray' }}>
                            <Text>{item.priceDisplayText}</Text>
                          </View>
                          : null
                      }
                    </View>
                  )}
                  keyExtractor={item => item.id}
                />
              </View>
            ))
          }

        </IndicatorViewPager>
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