import { AsyncStorage } from 'react-native';
import { HubConnectionBuilder, LogLevel, TransportType } from '@microsoft/signalr';

import { authService } from '../authService';


const ACCOUNTS_HUB_PUBLIC_URL = "https://wsmosy.azurewebsites.net/hubs/accounts";
const ORDERS_HUB_PUBLIC_URL = "https://wsmosy.azurewebsites.net/hubs/orders";

let allConnections = [];

const getAllConnections = () => allConnections;
const stopAllConnections = () => allConnections.forEach((conn) => { conn.stop(); });

const connectToAccountsHubAsVenueHost = () => connectToHub(
  ACCOUNTS_HUB_PUBLIC_URL,
  (connection) => { accountsHubConnectedAsVenueHost(connection); }
);
const connectToOrdersHubAsVenueHost = () => connectToHub(
  ORDERS_HUB_PUBLIC_URL,
  (connection) => { ordersHubConnectedAsVenueHost(connection); }
);
const connectToAccountsHubAsAccountOpener = () => connectToHub(
  ACCOUNTS_HUB_PUBLIC_URL,
  (connection) => { accountsHubConnectedAsAccountOpener(connection); }
);
const connectToOrdersHubAsAccountOpener = () => connectToHub(
  ORDERS_HUB_PUBLIC_URL,
  (connection) => { ordersHubConnectedAsAccountOpener(connection); }
);
const connectToAccountsHubAsAccountOperator = () => connectToHub(
  ACCOUNTS_HUB_PUBLIC_URL,
  (connection) => { accountsHubConnectedAsAccountOperator(connection); }
);
const connectToOrdersHubAsAccountOperator = () => connectToHub(
  ORDERS_HUB_PUBLIC_URL,
  (connection) => { ordersHubConnectedAsAccountOperator(connection); }
);

const accountsHubConnectedAsVenueHost = (accountsHubConnection) => {
  accountsHubConnection.on('PongClient', (data) => { console.log('PongClient'); });
  accountsHubConnection.on('AccountStatusChanged', (data) => { console.log('AccountStatusChanged'); });

  // this.accountsHubConnection.send("ConnectAsVenueHost", venueId);
};
const ordersHubConnectedAsVenueHost = (ordersHubConnection) => {
  ordersHubConnection.on('PongClient', (data) => { console.log('PongClient'); });
  ordersHubConnection.on('AccountHasItemStatusChanged', (data) => { console.log('AccountHasItemStatusChanged'); });

  // this.ordersHubConnection.send("ConnectAsVenueHost", venueId);
};

const accountsHubConnectedAsAccountOpener = (accountsHubConnection) => {
  accountsHubConnection.on('PongClient', (data) => { console.log('PongClient'); });
  accountsHubConnection.on('AccountStatusChanged', (data) => { console.log('AccountStatusChanged'); });

  // this.accountsHubConnection.send("ConnectAsAccountOpener", accountId);
};
const ordersHubConnectedAsAccountOpener = (ordersHubConnection) => {
  ordersHubConnection.on('PongClient', (data) => { console.log('PongClient'); });
  ordersHubConnection.on('OrderItemStatusChanged', (data) => { console.log('OrderItemStatusChanged'); });

  // this.ordersHubConnection.send("ConnectAsAccountOpener", accountId);
};

const accountsHubConnectedAsAccountOperator = (accountsHubConnection) => {
  accountsHubConnection.on('PongClient', (data) => { console.log('PongClient'); });

  // this.accountsHubConnection.send("ConnectAsAccountOperator", venueId);
};
const ordersHubConnectedAsAccountOperator = (ordersHubConnection) => {
  ordersHubConnection.on('PongClient', (data) => { console.log('PongClient'); });
  ordersHubConnection.on('OrderItemStatusChanged', (data) => { console.log('OrderItemStatusChanged'); });

  // this.ordersHubConnection.send("ConnectAsAccountOperator", venueId);
};

const connectToHub = (hubConnectionUrl, handleProcessSubscriptions) => {
  let connection = allConnections.filter(conn => conn.baseUrl == hubConnectionUrl && conn.connectionState == 'Connected').length
    ? allConnections.filter(conn => conn.baseUrl == hubConnectionUrl && conn.connectionState == 'Connected')[0]
    : null;

  if (!connection) {
    // FROM DOCS: Without any parameters, withAutomaticReconnect() configures the client to wait 0, 2, 10, and 30 seconds
    // FROM DOCS: respectively before trying each reconnect attempt, stopping after four failed attempts.
    // FROM DOCS: 
    // FROM DOCS: .configureLogging(LogLevel.Debug)
    // FROM DOCS: .withAutomaticReconnect({
    // FROM DOCS:   nextRetryDelayInMilliseconds: retryContext => {
    // FROM DOCS:     if (retryContext.elapsedMilliseconds < 60000) {
    // FROM DOCS:       // If we've been reconnecting for less than 60 seconds so far,
    // FROM DOCS:       // wait between 0 and 10 seconds before the next reconnect attempt.
    // FROM DOCS:       return Math.random() * 10000;
    // FROM DOCS:     } else {
    // FROM DOCS:       // If we've been reconnecting for more than 60 seconds so far, stop reconnecting.
    // FROM DOCS:       return null;
    // FROM DOCS:     }
    // FROM DOCS:   }
    // FROM DOCS: })
    const newConnection = new HubConnectionBuilder()
      .withUrl(hubConnectionUrl, { accessTokenFactory: () => authService.pickValidAccessToken() })
      .withAutomaticReconnect()
      .build();

    newConnection
      .onclose(async () => {
        // console.log(`Hub connection closed! (${newConnection.connectionId} - ${newConnection.connectionState} - ${newConnection.baseUrl})`);
        allConnections = allConnections.filter(x => x.id === newConnection.id);
      });

    newConnection
      .start()
      .then((result) => {
        // console.log(`Connected to Hub! (${newConnection.connectionId} - ${newConnection.connectionState} - ${newConnection.baseUrl})`);
        allConnections = [...allConnections, newConnection];
      })
      .catch(e => console.log(e));

    if (handleProcessSubscriptions) handleProcessSubscriptions(newConnection);
    connection = newConnection;
  }

  return connection;
};


export const hubsConnectivityService = {
  stopAllConnections,
  getAllConnections,
  connectToAccountsHubAsVenueHost,
  connectToAccountsHubAsAccountOpener,
  connectToAccountsHubAsAccountOperator,
  connectToOrdersHubAsVenueHost,
  connectToOrdersHubAsAccountOpener,
  connectToOrdersHubAsAccountOperator,
};
