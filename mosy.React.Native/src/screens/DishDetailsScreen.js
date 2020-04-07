import React, { useRef, useEffect, useContext } from 'react';
import { StyleSheet, Image, ImageBackground, Modal, ScrollView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, Card } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import ImagesPreviewModal from '../components/modal/ImagesPreviewModal';
import venueIndoorBackground from "../../assets/img/venues/indoor-background-paprika.jpg";
import { Context as DishesContext } from '../context/DishesContext';


const DishDetailsScreen = ({ navigation }) => {
  const dishId = navigation.state.params.dishId;
  const imagesPreviewModalRef = useRef(null);
  const { state, loadImageContent } = useContext(DishesContext);
  const dish =
    state.closestDishes && state.closestDishes.length && state.closestDishes.filter((item) => item.id == dishId).length
      ? state.closestDishes.filter((item) => item.id == dishId)[0]
      : null;


  const testImageUrl = "https://img.buzzfeed.com/video-api-prod/assets/d03461e6d185483da8317cf9ee03433e/BFV18861_ChickenTikkaMasala-ThumbA1080.jpg";

  useEffect(() => {
    if (dish.requestableImageMeta) {
      loadImageContent(dish.id, dish.requestableImageMeta.id, 3);
    }
  }, [])

  return <View style={{ flex: 1 }}>
    <View style={{ height: '45%' }}>
      {console.log(dish)}
      <ImageBackground
        source={
          dish.requestableImageMeta && dish.requestableImageMeta.contentType && dish.requestableImageMeta.base64x300
            ? { uri: `data:${dish.requestableImageMeta.contentType};base64, ${dish.requestableImageMeta.base64x300}` }
            : venueIndoorBackground
        }
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
        {dish.name}
      </Text>
      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#666', marginLeft: 15, marginRight: 15, textAlign: "center" }}>
        {
          dish.ingredients && dish.ingredients.length
            ? dish.ingredients.map((item) => item.name).join(', ')
            : null
        }
      </Text>
    </View>

    <ScrollView style={{ backgroundColor: "white" }}>
      <Card containerStyle={{ borderRadius: 5 }}>
        <Text style={{ color: "#666", fontSize: 16 }}>
          Allergens
        </Text>
        <Text style={{ color: "silver", }}>
          {
            dish && dish.filters && dish.filters.length && dish.filters.filter((item) => item.filterType == 204).length
              ? dish.filters.filter((item) => item.filterType == 204).map((item) => item.name).join(', ')
              : 'No allergens mentioned.'
          }
        </Text>
      </Card>
      <Card containerStyle={{ borderRadius: 5 }}>
        <Text style={{ color: "#666", fontSize: 16 }}>
          Filters
        </Text>
        <Text style={{ color: "silver", }}>
          {
            dish && dish.filters && dish.filters.length && dish.filters.filter((item) => item.filterType != 204).length
              ? dish.filters.filter((item) => item.filterType != 204).map((item) => item.name).join(', ')
              : 'No filters assigned.'
          }
        </Text>
      </Card>
    </ScrollView>

    <ImagesPreviewModal
      ref={imagesPreviewModalRef}
      images={[
        {
          url: '',
          props: {
            source: dish.requestableImageMeta && dish.requestableImageMeta.contentType && dish.requestableImageMeta.base64x300
              ? `data:${dish.requestableImageMeta.contentType};base64,${dish.requestableImageMeta.base64x300}`
              : venueIndoorBackground
          }
        }
      ]} />
  </View>;
};

const styles = StyleSheet.create({});

export default DishDetailsScreen;