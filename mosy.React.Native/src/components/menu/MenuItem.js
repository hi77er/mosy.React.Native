import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-elements';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import OcticonsIcon from 'react-native-vector-icons/Octicons';

import { dishesService } from '../../services/dishesService';
import { Context as TableAccountCustomerContext } from '../../context/TableAccountCustomerContext';


const MenuItem = ({ item, selectedCulture, venueHasOrdersManagementSubscription }) => {
  const tableAccountCustomerContext = useContext(TableAccountCustomerContext);
  const { addNewOrderItem, removeNewOrderItem } = tableAccountCustomerContext;

  const [isExpanded, setIsExpanded] = useState(false);
  const [imageContent, setImageContent] = useState(
    item.requestableImageMeta
      && item.requestableImageMeta.contentType
      && item.requestableImageMeta.base64x200
      ? `data:${item.requestableImageMeta.contentType};base64,${item.requestableImageMeta.base64x200}`
      : null
  );

  const handleAddItem = () => {
    addNewOrderItem(item);
  };

  const handleRemoveItem = () => {
    removeNewOrderItem(item.id);
  };

  useEffect(
    () => {
      async function init() {
        if (item.requestableImageMeta
          && item.requestableImageMeta.id
          && item.requestableImageMeta.contentType
          && !item.requestableImageMeta.base64x200) {
          const data = await dishesService.getImageContent(item.requestableImageMeta.id, 2);
          setImageContent(`data:${item.requestableImageMeta.contentType};base64,${data.base64Content}`);
        }
      }
      init();
    }, []);

  return (
    <View style={{ paddingHorizontal: 4, paddingVertical: 2 }}>
      {console.log(item.requestableCultures.filter(x => x.culture == selectedCulture)[0])}

      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <View style={{ flexDirection: "row", paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#4d0018' }}>
          <View style={{ flex: 10, justifyContent: "center", minHeight: 30 }}>
            <Text style={{ color: "white" }}>
              {
                item.requestableCultures.filter(x => x.culture == selectedCulture).length
                  ? item.requestableCultures.filter(x => x.culture == selectedCulture)[0].requestableName
                  : item.requestableCultures[0].requestableName
              }
            </Text>
          </View>
          <View style={{ flex: 4, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginEnd: 5 }}>
            <Text style={{ textAlign: "right", color: 'white', fontStyle: 'italic' }}>{item.priceDisplayText}</Text>
          </View>
          {
            venueHasOrdersManagementSubscription && item.priceDisplayText
              ? <View style={{ flex: 3, flexDirection: "row" }}>
                <TouchableOpacity style={{ marginEnd: 7 }} onPress={handleAddItem}>
                  <OcticonsIcon name="diff-added" color="#991a42" size={30} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRemoveItem}>
                  <OcticonsIcon name="diff-removed" color="#991a42" size={30} />
                </TouchableOpacity>
              </View>
              : null
          }
        </View>
      </TouchableOpacity>
      {
        isExpanded
          ? <View style={{ padding: 10, flexDirection: "row", backgroundColor: '#4d0018' }}>
            <View>
              {
                imageContent
                  ? <Image style={styles.itemImage} source={{ uri: imageContent }} />
                  : <View style={styles.itemImageContainer} >
                    <EntypoIcon name='location' size={63} color={"#90002d"} />
                  </View>
              }
            </View>
            <View style={{ flex: 1, padding: 5 }}>
              {
                item.quantityDisplayText
                  ? <Text style={{ color: 'lightgray', marginBottom: 5 }}>{item.quantityDisplayText} </Text>
                  : null
              }
              {
                item.requestableCultures.filter(x => x.culture == selectedCulture).length
                  && item.requestableCultures.filter(x => x.culture == selectedCulture)[0].ingredients
                  && item.requestableCultures.filter(x => x.culture == selectedCulture)[0].ingredients.length
                  ? (
                    <Text style={{ fontStyle: 'italic', color: 'lightgray', marginBottom: 5 }}>
                      {item.requestableCultures.filter(x => x.culture == selectedCulture)[0].ingredients.map(i => i.name).join(', ')}
                    </Text>
                  )
                  : null
              }
              {
                item.requestableCultures.filter(x => x.culture == selectedCulture).length
                  && item.requestableCultures.filter(x => x.culture == selectedCulture)[0].requestableDescription
                  ? (
                    <Text style={{ color: 'lightgray', marginBottom: 5 }}>
                      {item.requestableCultures.filter(x => x.culture == selectedCulture)[0].requestableDescription}
                    </Text>
                  )
                  : null
              }
            </View>
          </View>
          : null
      }
    </View>
  );
};


const styles = StyleSheet.create({
  itemImage: {
    width: 100,
    height: 100,
    marginEnd: 5,
  },
  itemImageContainer: {
    width: 100,
    height: 100,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    backgroundColor: "#fbeaef"
  },
});


export default MenuItem;