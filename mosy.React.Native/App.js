import React, { useState } from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider as DishesProvider } from './src/context/DishesContext';
import { Provider as FiltersProvider } from './src/context/FiltersContext';
import { Provider as TableAccountOperatorProvider } from './src/context/TableAccountOperatorContext';
import { Provider as TableAccountCustomerProvider } from './src/context/TableAccountCustomerContext';
import { Provider as UserProvider } from './src/context/UserContext';
import { Provider as VenuesProvider } from './src/context/VenuesContext';

import CheckEmailScreen from './src/screens/CheckEmailScreen';
import ClientTableOrdersScreen from './src/screens/ClientTableOrdersScreen';
import DishesScreen from './src/screens/DishesScreen';
import DishDetailsScreen from './src/screens/DishDetailsScreen';
import LoginScreen from './src/screens/LoginScreen';
import MenuScreen from './src/screens/MenuScreen';
import OperatorTableAccountsScreen from './src/screens/OperatorTableAccountsScreen';
import OperatorTableOrdersScreen from './src/screens/OperatorTableOrdersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SplashScreen from './src/screens/SplashScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import TabBarButton from './src/components/nav/bottom/TabBarButton';
import VenueDetailsScreen from './src/screens/VenueDetailsScreen';
import VenuesScreen from './src/screens/VenuesScreen';
import FilterPreferencesScreen from './src/screens/FilterPreferencesScreen';



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
    ClientTableOrders: {
      screen: ClientTableOrdersScreen,
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

const profileFlow = createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    FilterPreferences: {
      screen: FilterPreferencesScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    navigationOptions: {
      tabBarLabel: "Profile",
    },
  }
);

const switchNavigator = createSwitchNavigator(
  {
    mainFlow: createBottomTabNavigator(
      {
        dishesFlow,
        venuesFlow,
        Login: LoginScreen,
      },
      {
        initialRouteName: "dishesFlow",
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
        dishesFlow,
        venuesFlow,
        profileFlow,
      },
      {
        initialRouteName: "dishesFlow",
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
        dishesFlow,
        venuesFlow,
        operatorFlow,
        profileFlow,
      },
      {
        initialRouteName: "dishesFlow",
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
          <TableAccountCustomerProvider>
            <TableAccountOperatorProvider>
              <UserProvider>
                <VenuesProvider>
                  {
                    showSplash
                      ? <SplashScreen onInitializationFinished={() => { setShowSplash(false) }} />
                      : <AppContainer ref={(navigator) => { setNavigator(navigator) }} />
                  }
                </VenuesProvider>
              </UserProvider>
            </TableAccountOperatorProvider>
          </TableAccountCustomerProvider>
        </FiltersProvider>
      </DishesProvider>
    </AuthProvider>
  )
};

export default App;
