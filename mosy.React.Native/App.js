import React, { useState } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as DishesProvider } from './src/context/DishesContext';
import { Provider as FiltersProvider } from './src/context/FiltersContext';
import { Provider as TableAccountsProvider } from './src/context/TableAccountsContext';
import { Provider as UserProvider } from './src/context/UserContext';
import { Provider as VenuesProvider } from './src/context/VenuesContext';

import DishesScreen from './src/screens/DishesScreen';
import VenuesScreen from './src/screens/VenuesScreen';
import DishDetailsScreen from './src/screens/DishDetailsScreen';
import VenueDetailsScreen from './src/screens/VenueDetailsScreen';
import MenuScreen from './src/screens/MenuScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import CheckEmailScreen from './src/screens/CheckEmailScreen';
import OperatorTableAccountsScreen from './src/screens/OperatorTableAccountsScreen';
import OperatorTableOrdersScreen from './src/screens/OperatorTableOrdersScreen';
import SplashScreen from './src/screens/SplashScreen';
import TabBarButton from './src/components/nav/bottom/TabBarButton';



import { setNavigator } from './src/navigationRef';


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
    Menu: {
      screen: MenuScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    SignUp: {
      screen: SignUpScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    CheckEmail: {
      screen: CheckEmailScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
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
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    SignUp: {
      screen: SignUpScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    CheckEmail: {
      screen: CheckEmailScreen,
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
    OperatorTableAccounts: {
      screen: OperatorTableAccountsScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    OperatorTableOrders: {
      screen: OperatorTableOrdersScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    navigationOptions: {
      tabBarLabel: "Operations",
    },
  }
);

const switchNavigator = createSwitchNavigator(
  {
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
    mainCustomerFlow: createBottomTabNavigator(
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
      <DishesProvider>
        <FiltersProvider>
          <TableAccountsProvider>
            <UserProvider>
              <VenuesProvider>
                {
                  showSplash
                    ? <SplashScreen onInitializationFinished={() => { setShowSplash(false) }} />
                    : <AppContainer ref={(navigator) => { setNavigator(navigator) }} />
                }
              </VenuesProvider>
            </UserProvider>
          </TableAccountsProvider>
        </FiltersProvider>
      </DishesProvider>
    </AuthProvider>
  )
};

export default App;
