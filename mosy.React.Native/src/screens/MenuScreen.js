import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'react-native-best-viewpager';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Accordion from 'react-native-collapsible/Accordion';


const MenuScreen = () => {
  const data = [
    {
      id: 1,
      title: "Page1",
      items: [
        { id: 5, name: "sdsa 1", price: 54 },
        { id: 6, name: "sdsa 2", price: 54 },
        { id: 7, name: "sdsa 3", price: 54 },
        { id: 8, name: "sdsa 4", price: 54 },
        { id: 9, name: "sdsa 5", price: 54 },
        { id: 10, name: "sdsa 6", price: 54 },
      ],
      activeItemIds: [],
    },
    {
      id: 2,
      title: "Page2",
      items: [
        { id: 1, name: "sdsa", price: 54 },
        { id: 2, name: "sdsa", price: 54 },
        { id: 3, name: "sdsa", price: 54 },
        { id: 4, name: "sdsa", price: 54 },
      ],
      activeItemIds: [],
    },
    {
      id: 3,
      title: "Page3",
      items: [
        { id: 1, name: "sdsa", price: 54 },
        { id: 2, name: "sdsa", price: 54 },
        { id: 3, name: "sdsa", price: 54 },
        { id: 4, name: "sdsa", price: 54 },
        { id: 5, name: "sdsa", price: 54 },
        { id: 6, name: "sdsa", price: 54 },
        { id: 7, name: "sdsa", price: 54 },
        { id: 8, name: "sdsa", price: 54 },
        { id: 9, name: "sdsa", price: 54 },
        { id: 10, name: "sdsa", price: 54 },
      ],
      activeItemIds: [],
    },
    {
      id: 4,
      title: "Page4",
      items: [
        { id: 1, name: "sdsa", price: 54 },
        { id: 2, name: "sdsa", price: 54 },
        { id: 3, name: "sdsa", price: 54 },
        { id: 4, name: "sdsa", price: 54 },
        { id: 5, name: "sdsa", price: 54 },
        { id: 6, name: "sdsa", price: 54 },
        { id: 7, name: "sdsa", price: 54 },
        { id: 8, name: "sdsa", price: 54 },
        { id: 9, name: "sdsa", price: 54 },
        { id: 10, name: "sdsa", price: 54 },
        { id: 11, name: "sdsa", price: 54 },
        { id: 12, name: "sdsa", price: 54 },
        { id: 13, name: "sdsa", price: 54 },
        { id: 14, name: "sdsa", price: 54 },
        { id: 15, name: "sdsa", price: 54 },
      ],
      activeItemIds: [],
    },
    {
      id: 5,
      title: "Page5",
      items: [
        { id: 1, name: "sdsa", price: 54 },
        { id: 2, name: "sdsa", price: 54 },
        { id: 3, name: "sdsa", price: 54 },
      ],
      activeItemIds: [],
    },
  ]
  const [menuLists, setMenuLists] = useState(data);

  const _renderTitleIndicator = () => {
    return <PagerTitleIndicator trackScroll={true} titles={menuLists.map((menuList, key) => <Text key={key}>{menuList.title}</Text>)} />;
  };


  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "flex-end", padding: 15 }}>
        <View style={{ flex: 1 }}>
          <Text h4>Restaurant</Text>
          <Text>Restaurant</Text>
        </View>
        <Image
          style={styles.venueImage}
          source={{ uri: "https://media.gettyimages.com/photos/different-types-of-food-on-rustic-wooden-table-picture-id861188910?s=612x612" }} />
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
                    {menuList.title}
                  </Text>
                </View>

                <FlatList
                  data={menuList.items}
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
                            <Text>{item.price}</Text>
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