import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-elements';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { locationHelper } from '../../helpers/locationHelper';

const DishItem = ({ item, navigation }) => {
  return <TouchableOpacity onPress={() => navigation.navigate("DishDetails")}>
    <Card
      key={item.id}
      containerStyle={{
        paddingLeft: 7,
        paddingBottom: 7,
        paddingTop: 7,
        paddingRight: 0,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 7,
      }}>
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "stretch" }}>
        <Image
          style={{ width: 130, height: 130, marginRight: 5 }}
          source={{ uri: "https://media.gettyimages.com/photos/different-types-of-food-on-rustic-wooden-table-picture-id861188910?s=612x612" }} />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 3 }}>
              <Text style={{ color: "#666", fontSize: 16, fontWeight: "bold" }}>{item.name}</Text>
              <Text style={{ color: "darkgray", fontSize: 13, fontWeight: "bold" }}>{item.fboName}</Text>
            </View>
            <View style={{ flex: 1 }}>
              {/* open/close/new/recom */}
              <Text style={
                item.workingStatus === "Closed"
                  ? styles.cardLabelRed
                  : (
                    item.workingStatus === "Open"
                      ? styles.cardLabelLightGreen
                      : styles.cardLabelGreen
                  )}>
                {item.workingStatus.toUpperCase()}
              </Text>
              {!item.isRecommended || <Text style={styles.cardLabelYellow}>RECOM</Text>}
              {!item.isNew || <Text style={styles.cardLabelBlue}>NEW</Text>}
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", flexWrap: "nowrap", alignContent: "center", marginRight: 7 }}>
            {/* distance/time/price */}
            <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
              {/* distance */}
              <MaterialCommunityIcon name="map-marker-distance" size={28} color="#666" />
              <Text style={{ color: "#666", fontWeight: "bold", fontSize: 18 }}>{locationHelper.formatDistanceToVenue(item.distanceToDevice)}</Text>
            </View>
            <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }} >
              {/* arriving in */}
              <FontAwesome5Icon name="walking" size={28} color="#666" />
              <Text style={{ color: "#666", fontWeight: "bold", fontSize: 18 }}>{locationHelper.formatWalkingTimeToVenue(item.distanceToDevice)}</Text>
            </View>
            <View style={{ flex: 3, justifyContent: "center", alignItems: "center" }}>
              {/* price */}
              <IoniconsIcon name="md-pricetag" size={28} color="#666" style={{ transform: [{ scaleX: -1 }] }} />
              <Text style={{ color: "#666", fontWeight: "bold", fontSize: 18 }}>{item.priceDisplayText}</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  </TouchableOpacity>
};



const styles = StyleSheet.create({
  cardLabelGreen: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "green" },
  cardLabelLightGreen: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "#7fb800" },
  cardLabelBlue: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "dodgerblue" },
  cardLabelYellow: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "#ffb400" },
  cardLabelRed: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "red" },
});

export default DishItem;