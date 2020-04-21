import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from 'react-native-best-viewpager';
import { FlatList } from 'react-native-gesture-handler';
import Accordion from 'react-native-collapsible/Accordion';


const MenuScreen = () => {
  const menuLists = [
    {
      title: "Page1",
      items: [
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 }
      ],
    },
    {
      title: "Page2",
      items: [
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
      ],
    },
    {
      title: "Page3",
      items: [
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
      ],
    },
    {
      title: "Page4",
      items: [
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
      ],
    },
    {
      title: "Page5",
      items: [
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
        { name: "sdsa", price: 54 },
      ],
    },
  ]

  const [activeItems, setActiveItems] = useState([]);

  const _renderTitleIndicator = () => {
    return <PagerTitleIndicator trackScroll={true} titles={menuLists.map((menuList) => menuList.title)} />;
  };


  return <View style={{ flex: 1 }}>
    {/* 
      <Spacer>
        <Text h3>MenuScreen</Text>
      </Spacer> 
    */}

    {/* 
      <Spacer>
        <Button title="Open table account" onPress={handleOpenTableAccount} />
      </Spacer> 
    */}
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
          menuLists.map((menuList) => (
            <View style={{ padding: 30 }}>
              <Text style={{ color: "grey", fontSize: 18, textAlign: "center", marginBottom: 20 }}>{menuList.title}</Text>
              <ScrollView>
                <Accordion
                  sections={menuList.items}
                  activeSections={activeItems}
                  onChange={setActiveItems}
                  /*
                  renderSectionTitle={(item) => {
                    return (
                      <View style={styles.content}>
                        <Text>{item.price}</Text>
                      </View>
                    );
                  }}
                  */
                  renderHeader={(item) => {
                    return (
                      <View style={styles.header}>
                        <Text style={styles.headerText}>{item.name}</Text>
                      </View>
                    );
                  }}
                  renderContent={(item) => {
                    return (
                      <View style={styles.content}>
                        <Text>{item.price}</Text>
                      </View>
                    );
                  }}
                />
              </ScrollView>
              {/*
              <FlatList
                data={menuList.items}
                renderItem={({ item }) => (
                  <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 10 }}>
                    <Text style={{ flex: 1, fontSize: 16 }}>{item.name}</Text>
                    <Text style={{ width: 50, fontSize: 16, textAlign: "right" }}>{item.price}</Text>
                  </View>
                )} /> 
                */}
            </View>
          ))
        }


      </IndicatorViewPager>
    </View>

  </View>;
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