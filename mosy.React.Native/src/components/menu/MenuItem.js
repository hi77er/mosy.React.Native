import React, { useContext, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-elements';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import OcticonsIcon from 'react-native-vector-icons/Octicons';

import ImagePreviewModal from '../../screens/modals/ImagePreviewModal';
import { dishesService } from '../../services/dishesService';
import { Context as TableAccountCustomerContext } from '../../context/TableAccountCustomerContext';


const MenuItem = ({ item, selectedCulture, venueHasOrdersManagementSubscription }) => {
  const tableAccountCustomerContext = useContext(TableAccountCustomerContext);
  const { addNewOrderItem, removeNewOrderItem } = tableAccountCustomerContext;

  const imagePreviewModalRef = useRef(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [image300, setImage300] = useState(false);
  const [imageContent, setImageContent] = useState(
    item.requestableImageMeta
      && item.requestableImageMeta.contentType
      && item.requestableImageMeta.base64x200
      ? `data:${item.requestableImageMeta.contentType};base64,${item.requestableImageMeta.base64x200}`
      : null
  );

  const handleToggleShowImage = () => {
    if (item.requestableImageMeta && item.requestableImageMeta.contentType && !item.requestableImageMeta.base64x200)
      imagePreviewModalRef.current.toggleVisible({ ...item.requestableImageMeta, base64x300: image300 ? image300.base64Content : null });
  };

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
          && item.requestableImageMeta.contentType) {

          if (!item.requestableImageMeta.base64x200) {
            const data = await dishesService.getImageContent(item.requestableImageMeta.id, 2);
            setImageContent(`data:${item.requestableImageMeta.contentType};base64,${data.base64Content}`);
          }
          if (!item.requestableImageMeta.base64x300) {
            const imageMeta300 = await dishesService.getImageContent(item.requestableImageMeta.id, 3);
            setImage300(imageMeta300);
          }
        }
      }
      init();
    }, []);

  return (
    <View style={styles.itemContainer}>

      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleLabel}>
              {
                item.requestableCultures.filter(x => x.culture == selectedCulture).length
                  ? item.requestableCultures.filter(x => x.culture == selectedCulture)[0].requestableName
                  : item.requestableCultures[0].requestableName
              }
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>{item.priceDisplayText}</Text>
          </View>
          {
            venueHasOrdersManagementSubscription
              && item.priceDisplayText
              && (tableAccountCustomerContext.state.newlySelectedTable || tableAccountCustomerContext.state.tableAccount)
              ? <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.preLastAction} onPress={handleAddItem}>
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
          ? <View style={styles.expandContainer}>
            <View>
              {
                imageContent
                  ? <TouchableOpacity onPress={handleToggleShowImage}>
                    <Image style={styles.itemImage} source={{ uri: imageContent }} />
                  </TouchableOpacity>
                  : <View style={styles.itemImageContainer} >
                    <EntypoIcon name='location' size={63} color={"#90002d"} />
                  </View>
              }
            </View>
            <View style={styles.descriptionContainer}>
              {
                item.quantityDisplayText
                  ? <Text style={styles.quantityLabel}>{item.quantityDisplayText} </Text>
                  : null
              }
              {
                item.requestableCultures.filter(x => x.culture == selectedCulture).length
                  && item.requestableCultures.filter(x => x.culture == selectedCulture)[0].ingredients
                  && item.requestableCultures.filter(x => x.culture == selectedCulture)[0].ingredients.length
                  ? (
                    <Text style={styles.ingredientsLabel}>
                      {item.requestableCultures.filter(x => x.culture == selectedCulture)[0].ingredients.map(i => i.name).join(', ')}
                    </Text>
                  )
                  : null
              }
              {
                item.requestableCultures.filter(x => x.culture == selectedCulture).length
                  && item.requestableCultures.filter(x => x.culture == selectedCulture)[0].requestableDescription
                  ? (
                    <Text style={styles.descriptionLabel}>
                      {item.requestableCultures.filter(x => x.culture == selectedCulture)[0].requestableDescription}
                    </Text>
                  )
                  : null
              }
            </View>
          </View>
          : null
      }

      {
        item.requestableImageMeta && item.requestableImageMeta.contentType && !item.requestableImageMeta.base64x200
          ? <ImagePreviewModal ref={imagePreviewModalRef} imageMeta={item.requestableImageMeta} />
          : null
      }
    </View>
  );
};


const styles = StyleSheet.create({
  itemContainer: { paddingHorizontal: 4, paddingVertical: 2 },
  headerContainer: { flexDirection: "row", paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#4d0018' },
  titleContainer: { flex: 10, justifyContent: "center", minHeight: 30 },
  titleLabel: { color: "white" },
  itemImage: { width: 100, height: 100, marginEnd: 5, },
  itemImageContainer: { width: 100, height: 100, marginRight: 5, alignItems: "center", justifyContent: "center", borderRadius: 3, backgroundColor: "#fbeaef" },
  descriptionContainer: { flex: 1, padding: 5 },
  expandContainer: { padding: 10, flexDirection: "row", backgroundColor: '#4d0018' },
  actionsContainer: { flex: 3, flexDirection: "row" },
  quantityLabel: { color: 'lightgray', marginBottom: 5 },
  priceContainer: { flex: 4, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginEnd: 5 },
  priceLabel: { textAlign: "right", color: 'white', fontStyle: 'italic' },
  preLastAction: { marginEnd: 7 },
  ingredientsLabel: { fontStyle: 'italic', color: 'lightgray', marginBottom: 5 },
  descriptionLabel: { color: 'lightgray', marginBottom: 5 },
});


export default MenuItem;