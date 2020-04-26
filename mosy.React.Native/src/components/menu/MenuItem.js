import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, Card } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { dishesService } from '../../services/dishesService';


const MenuItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageContent, setImageContent] = useState(
    item.requestableImageMeta
      && item.requestableImageMeta.contentType
      && item.requestableImageMeta.base64x200
      ? `data:${item.requestableImageMeta.contentType};base64,${item.requestableImageMeta.base64x200}`
      : null
  );

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
    <View style={{ padding: 5 }}>
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <View style={{ flexDirection: "row", padding: 5, backgroundColor: 'lightblue' }}>
          <View style={{ flex: 3 }}>
            <Text>{item.requestableCultures[0].requestableName}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ textAlign: "right" }}>{item.priceDisplayText}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {
        isExpanded
          ? <View style={{ padding: 5, flexDirection: "row" }}>
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
              <Text style={{ fontStyle: 'italic', color: 'gray' }}>
                {
                  item.requestableCultures[0].ingredients && item.requestableCultures[0].ingredients.length
                    ? item.requestableCultures[0].ingredients.map(i => i.name).join(', ')
                    : null
                }
              </Text>
            </View>
          </View>
          : null
      }
    </View>
  );
};


const styles = StyleSheet.create({
  itemImage: {
    width: 120,
    height: 120,
  },
  itemImageContainer: {
    width: 120,
    height: 120,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
    backgroundColor: "#fbeaef"
  },
});


export default MenuItem;