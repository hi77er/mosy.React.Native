import React, { useRef, useEffect, useContext } from 'react';
import { StyleSheet, ImageBackground, ScrollView, Share, TouchableOpacity, View } from 'react-native';
import { Text, Card } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import ImagePreviewModal from './modals/ImagePreviewModal';
import venueIndoorBackground from "../../assets/img/venues/indoor-background-paprika.jpg";
import { Context as DishesContext } from '../context/DishesContext';


const DishDetailsScreen = ({ navigation }) => {
  const dishId = navigation.state.params.dishId;
  const imagePreviewModalRef = useRef(null);
  const { state, loadImageContent } = useContext(DishesContext);
  const dish =
    state.unbundledClosestDishes && state.unbundledClosestDishes.length && state.unbundledClosestDishes.filter((item) => item.id == dishId).length
      ? state.unbundledClosestDishes.filter((item) => item.id == dishId)[0]
      : null;

  const handleToggleShowOriginalImage = () => {
    if (dish.requestableImageMeta && dish.requestableImageMeta.contentType && dish.requestableImageMeta.base64x300)
      imagePreviewModalRef.current.toggleVisible(dish.requestableImageMeta);
  };

  const handleShareClick = async () => {
    try {
      const result = await Share.share({
        message: `${dish.name} https://www.treatspark.com/item/${dish.id}`,
        url: `https://www.treatspark.com/item/${dish.id}`,
        title: dish.name,
        dialogTitle: dish.name,
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

  useEffect(() => {
    if (dish.requestableImageMeta) {
      loadImageContent(dish.id, dish.requestableImageMeta.id, 3);
    }
  }, [])

  return (
    <View style={{ flex: 1 }}>

      <TouchableOpacity style={{ height: '45%' }} onPress={handleToggleShowOriginalImage}>
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={
              dish && dish.requestableImageMeta && dish.requestableImageMeta.contentType && dish.requestableImageMeta.base64x300
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
                    onPress={handleShareClick}>
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
      </TouchableOpacity>

      <View style={{ marginLeft: 20, marginRight: 20, marginTop: 5, alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#90002D', textAlign: "center" }}>
          {dish.name}
        </Text>
        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#666', marginLeft: 15, marginRight: 15, textAlign: "center" }}>
          {
            dish.requestableCultures
              && dish.requestableCultures.length
              && dish.requestableCultures.filter((item) => item.culture == 'en-US').length
              && dish.requestableCultures.filter((item) => item.culture == 'en-US')[0].ingredients
              && dish.requestableCultures.filter((item) => item.culture == 'en-US')[0].ingredients.length
              ? dish.requestableCultures.filter((item) => item.culture == 'en-US')[0].ingredients.map((item) => item.name).join(', ')
              : null
          }
        </Text>
      </View>

      <ScrollView style={{ backgroundColor: "white" }}>
        <Card containerStyle={{ borderRadius: 5 }}>
          <Text style={{ color: "#666", fontSize: 16 }}>Allergens</Text>
          <Text style={{ color: "silver", }}>
            {
              dish && dish.filters && dish.filters.length && dish.filters.filter((item) => item.filterType == 204).length
                ? dish.filters.filter((item) => item.filterType == 204).map((item) => item.name).join(', ')
                : 'No allergens mentioned.'
            }
          </Text>
        </Card>
        <Card containerStyle={{ borderRadius: 5 }}>
          <Text style={{ color: "#666", fontSize: 16 }}>Filters</Text>
          <Text style={{ color: "silver", }}>
            {
              dish && dish.filters && dish.filters.length && dish.filters.filter((item) => item.filterType != 204).length
                ? dish.filters.filter((item) => item.filterType != 204).map((item) => item.name).join(', ')
                : 'No filters assigned.'
            }
          </Text>
        </Card>
      </ScrollView>

      {
        dish && dish.requestableImageMeta && dish.requestableImageMeta.contentType && dish.requestableImageMeta.base64x300
          ? <ImagePreviewModal ref={imagePreviewModalRef} imageMeta={dish.requestableImageMeta} />
          : null
      }
    </View>
  );
};

const styles = StyleSheet.create({});

export default DishDetailsScreen;