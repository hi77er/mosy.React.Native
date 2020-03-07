import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, Card } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { locationHelper } from '../../helpers/locationHelper';


const VenueItem = ({ item, navigation }) => {
  return <Card key={item.id} containerStyle={styles.cardContainerStyle}>
    <View style={styles.cardHeaderContainer}>
      <View style={styles.cardTitleContainer}>
        <Text style={styles.cardH1}>{item["name"]}</Text>
        <Text style={styles.cardH2}>{item.class}</Text>
      </View>
      <View style={styles.cardLabelsContainer}>
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
        {!item.isNew || <Text style={styles.cardLabelBlue}>NEW</Text>}
      </View>
    </View>
    <View style={styles.cardBodyContainer}>
      <Image
        style={styles.cardImage}
        source={{ uri: "https://media.gettyimages.com/photos/different-types-of-food-on-rustic-wooden-table-picture-id861188910?s=612x612" }} />
      <View style={styles.cardDashboardContainer}>
        <View style={styles.cardDashboardInfo}>
          <MaterialCommunityIcon name="map-marker-distance" size={28} color="#666" />
          <Text style={styles.cardDashboardInfoLabel}>{locationHelper.formatDistanceToVenue(item.distanceToDevice)}</Text>
        </View>
        <View style={styles.cardDashboardInfo}>
          <FontAwesome5Icon name="walking" size={28} color="#666" />
          <Text style={styles.cardDashboardInfoLabel}>{locationHelper.formatWalkingTimeToVenue(item.distanceToDevice)}</Text>
        </View>
        <View style={styles.cardDashboardButton}>
          <TouchableOpacity style={styles.cardDashboardButtonTouch} onPress={() => navigation.navigate("Menu")}>
            <Text style={styles.cardDashboardButtonLabel}>MENU</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardDashboardButton}>
          <TouchableOpacity
            style={styles.cardDashboardButtonTouch}
            onPress={() => navigation.navigate("VenueDetails")}>
            <Text style={styles.cardDashboardButtonLabel}>VENUE INFO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Card>
}


const styles = StyleSheet.create({
  cardContainerStyle: {
    paddingLeft: 7,
    paddingBottom: 7,
    paddingTop: 7,
    paddingRight: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 7,
  },
  cardHeaderContainer: { flex: 1, flexDirection: "row" },
  cardTitleContainer: { flex: 5 },
  cardLabelsContainer: { flex: 1 },
  cardH1: { color: "#666", fontSize: 16, fontWeight: "bold" },
  cardH2: { color: "darkgray", fontSize: 13, fontWeight: "bold" },
  cardLabelGreen: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "green" },
  cardLabelLightGreen: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "#7fb800" },
  cardLabelBlue: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "dodgerblue" },
  cardLabelYellow: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "#ffb400" },
  cardLabelRed: { fontSize: 10, color: "white", fontWeight: "bold", textAlign: "center", backgroundColor: "red" },
  cardBodyContainer: { flex: 1, flexDirection: "row", marginRight: 7 },
  cardImage: { width: 100, height: 100, marginRight: 5 },
  cardDashboardContainer: { flex: 1, flexDirection: "row" },
  cardDashboardInfo: { flex: 3, alignItems: "center", justifyContent: "flex-end" },
  cardDashboardInfoLabel: { fontWeight: "bold", color: "#666" },
  cardDashboardButton: { flex: 4, alignItems: "center", justifyContent: "flex-end" },
  cardDashboardButtonTouch: { borderWidth: 2, borderColor: "#90002d", width: 62, height: 62, borderRadius: 7, justifyContent: "center", alignItems: "center" },
  cardDashboardButtonLabel: { textAlign: "center", fontWeight: "bold", color: "#90002d" },
});


export default VenueItem;