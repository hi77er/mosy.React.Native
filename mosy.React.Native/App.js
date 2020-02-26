import React, { useState } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as FilterProvider } from './src/context/FiltersContext';

import DishesScreen from './src/screens/DishesScreen';
import VenuesScreen from './src/screens/VenuesScreen';
import DishDetailsScreen from './src/screens/DishDetailsScreen';
import VenueDetailsScreen from './src/screens/VenueDetailsScreen';
import MenuScreen from './src/screens/MenuScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import OperatorTableAccountsScreen from './src/screens/OperatorTableAccountsScreen';
import OperatorTableOrdersScreen from './src/screens/OperatorTableOrdersScreen';
import OperatorVenuesScreen from './src/screens/OperatorVenuesScreen';
import SplashScreen from './src/screens/SplashScreen';
import TabBarButton from './src/components/nav/bottom/TabBarButton';



import { setNavigator } from './src/navigationRef';

const loginFlow = createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen,
});

const venuesFlow = createStackNavigator(
  {
    Venues: {
      screen: VenuesScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    VenueDetails: {
      screen: VenueDetailsScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Menu: MenuScreen,
  },
  {
    navigationOptions: {
      tabBarLabel: "Venues",
    },
  }
);

const dishesFlow = createStackNavigator(
  {
    Dishes: {
      screen: DishesScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    DishDetails: {
      screen: DishDetailsScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    navigationOptions: {
      tabBarLabel: "Dishes",
    },
  }
);

const operatorFlow = createStackNavigator(
  {
    OperatorVenues: {
      screen: OperatorVenuesScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    OperatorTableAccounts: OperatorTableAccountsScreen,
    OperatorTableOrders: OperatorTableOrdersScreen,
  },
  {
    navigationOptions: {
      tabBarLabel: "Operations",
    },
  }
);

const switchNavigator = createSwitchNavigator(
  {
    loginFlow,
    mainFlow: createBottomTabNavigator(
      {
        venuesFlow,
        dishesFlow,
        Login: LoginScreen,
      },
      {
        initialRouteName: "venuesFlow",
        defaultNavigationOptions: ({ navigation }) => ({
          tabBarButtonComponent: (props) => <TabBarButton routeName={navigation.state.routeName} {...props} />
        }),
        tabBarOptions: {
          style: {
            backgroundColor: "#90002d",
            borderTopColor: "transparent",
          },
        },
      }
    ),
    mainAuthorizedFlow: createBottomTabNavigator(
      {
        venuesFlow,
        dishesFlow,
        Profile: ProfileScreen,
      },
      {
        initialRouteName: "venuesFlow",
        defaultNavigationOptions: ({ navigation }) => ({
          tabBarButtonComponent: (props) => <TabBarButton routeName={navigation.state.routeName} {...props} />
        }),
        tabBarOptions: {
          style: {
            backgroundColor: "#90002d",
            borderTopColor: "transparent",
          },
        },
      }
    ),
    mainOperatorFlow: createBottomTabNavigator(
      {
        venuesFlow,
        dishesFlow,
        operatorFlow,
        Profile: ProfileScreen,
      },
      {
        initialRouteName: "venuesFlow",
        defaultNavigationOptions: ({ navigation }) => ({
          tabBarButtonComponent: (props) => <TabBarButton routeName={navigation.state.routeName} {...props} />
        }),
        tabBarOptions: {
          style: {
            backgroundColor: "#90002d",
            borderTopColor: "transparent",
          },
        },
      }
    ),
  },
  {
    initialRouteName: 'mainFlow',
  },
);

const AppContainer = createAppContainer(switchNavigator);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AuthProvider>
      <FilterProvider>
        {
          showSplash
            ? <SplashScreen onInitializationFinished={() => { setShowSplash(false) }} />
            : <AppContainer ref={(navigator) => { setNavigator(navigator) }} />
        }
      </FilterProvider>
    </AuthProvider>
  )
};

export default App;
