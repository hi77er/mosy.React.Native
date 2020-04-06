import React, { useRef } from 'react';
import { StyleSheet, Image, ImageBackground, Modal, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, Card } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import ImagesPreviewModal from '../components/modal/ImagesPreviewModal';
import { Context as DishesContext } from '../context/DishesContext';


const DishDetailsScreen = ({ navigation }) => {
  const dishId = navigation.state.params.dishId;
  const imagesPreviewModalRef = useRef(null);
  const { state } = useContext(DishesContext);
  const dish =
    state.closestDish && state.closestVenues.length && state.closestVenues.filter((item) => item.id == venueId).length
      ? state.closestVenues.filter((item) => item.id == venueId)[0]
      : null;

  const testImageUrl = "https://img.buzzfeed.com/video-api-prod/assets/d03461e6d185483da8317cf9ee03433e/BFV18861_ChickenTikkaMasala-ThumbA1080.jpg";

  return <View style={{ flex: 1 }}>
    <View style={{ height: '45%' }}>
      <ImageBackground
        source={{ uri: testImageUrl }}
        style={{ flex: 1, justifyContent: "flex-end" }}
        imageStyle={{ height: "100%", resizeMode: "stretch" }}>
        <LinearGradient
          colors={['transparent', 'white']}
          style={{ flex: 1 }}>
          <View style={{ flex: 1, marginLeft: 20, marginBottom: 10, marginRight: 20, alignItems: "flex-end", flexDirection: "row" }}>
            <View style={{ flex: 2, flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-start" }}>
              <TouchableOpacity
                style={{ borderWidth: 2, borderColor: "#90002D", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" }}
                onPress={() => imagesPreviewModalRef.current.show()}>
                <MaterialIcon name="share" size={24} color="#90002D" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end" }}>
              <TouchableOpacity
                style={{ marginRight: 10, borderWidth: 2, borderColor: "#90002D", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" }}
                onPress={() => { }}>
                <MaterialCommunityIcon name="menu" size={24} color="#90002D" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 10, borderWidth: 2, borderColor: "#90002D", width: 50, height: 50, borderRadius: 7, justifyContent: "center", alignItems: "center" }}
                onPress={() => { }}>
                <EntypoIcon name="location" size={24} color="#90002D" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>

    <View style={{ marginLeft: 20, marginRight: 20, marginTop: 5, alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#90002D', textAlign: "center" }}>
        Chicken ticka masala
      </Text>
      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#666', marginLeft: 15, marginRight: 15, textAlign: "center" }}>
        crispy chicken, masala souce, season vegetbles, rice
      </Text>
    </View>

    <ScrollView style={{ backgroundColor: "white" }}>
      <Card containerStyle={{ borderRadius: 5 }}>
        <Text style={{ color: "#666", fontSize: 16 }}>
          Allergens
        </Text>
      </Card>
      <Card containerStyle={{ borderRadius: 5 }}>
        <Text style={{ color: "#666", fontSize: 16 }}>
          Filters
        </Text>
      </Card>
    </ScrollView>

    <ImagesPreviewModal
      ref={imagesPreviewModalRef}
      images={[
        {
          url: '',
          props: {
            source: venue.indoorImageMeta && venue.indoorImageMeta.contentType && venue.indoorImageMeta.base64x300
              ? `data:${venue.indoorImageMeta.contentType};base64,${venue.indoorImageMeta.base64x300}`
              : venueIndoorBackground
          }
        }
      ]} />
  </View>;
};

const styles = StyleSheet.create({});

export default DishDetailsScreen;