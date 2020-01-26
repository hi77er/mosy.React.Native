import React from 'react';
import { StyleSheet, Image, ImageBackground, ScrollView, View } from 'react-native';
import { Text, Card } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

const VenueDetailsScreen = () => {
  return <View style={{ flex: 1 }}>
    <View style={{ height: '45%' }}>
      <ImageBackground
        source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ZA0bTmaUt-QTjm7n9AtFUJPBNANfKS79cWjyBgXGSJEAHST1ug&s" }}
        style={{ flex: 1, justifyContent: "flex-end" }}
        imageStyle={{ height: "100%", resizeMode: "stretch" }}>
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(144,0,46,1)']}
          style={{ flex: 1 }}>
          <View style={{ flex: 1, margin: 20, justifyContent: "flex-end" }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', zIndex: 1000 }}>
              Barista
            </Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white', zIndex: 1000 }}>
              Co-working cafe
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>

    <ScrollView style={{ backgroundColor: "#90002d" }}>
      <Card>
        <Text>
          Test
        </Text>
      </Card>
      <Card>
        <Text>
          Test
        </Text>
      </Card>
      <Card>
        <Text>
          Test
        </Text>
      </Card>
    </ScrollView>
  </View >;
};

const styles = StyleSheet.create({});

export default VenueDetailsScreen;