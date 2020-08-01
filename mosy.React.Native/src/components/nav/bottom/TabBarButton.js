import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

const TabBarButton = ({ onPress, routeName, focused, accessibilityLabel }) => {
  const iconsMap = {
    venuesFlow: <EntypoIcon name="location" size={20} color="white" />, // <FontistoIcon name="shopping-store" size={20} color="white" />, 
    dishesFlow: <MaterialCommunityIcon name="food" size={26} color="white" />,
    operatorFlow: <FeatherIcon name="activity" size={20} color="white" />,
    profileFlow: <MaterialIcon name="person" size={20} color="white" />,
    Login: <MaterialIcon name="lock-open" size={20} color="white" />,
  };


  const title = accessibilityLabel && accessibilityLabel.split(",") && accessibilityLabel.split(",").length
    ? accessibilityLabel.split(",")[0]
    : routeName;

  return <View style={{ flex: 1 }}>
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}>
      {iconsMap[routeName]}
      {focused ? <Text style={{ color: "white", fontSize: 10, }}>{title}</Text> : null}
    </TouchableOpacity>
  </View>;
};

export default TabBarButton;
