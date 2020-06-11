import { AsyncStorage } from 'react-native';
import { HubConnectionBuilder, LogLevel, TransportType } from '@microsoft/signalr';
import { authService } from '../authService';


const ACCOUNTS_HUB_PUBLIC_URL = "https://wsmosy.azurewebsites.net/hubs/accounts";
const ORDERS_HUB_PUBLIC_URL = "https://wsmosy.azurewebsites.net/hubs/orders";

let allConnections = [];

const getAllConnections = () => allConnections;
const getAccountsHubConnection = (connectedAs) => allConnections
  .filter(conn =>
    conn.connection.baseUrl == ACCOUNTS_HUB_PUBLIC_URL
    && conn.connection.connectionState == 'Connected'
    && conn.connectedAs.valueOf() == connectedAs.valueOf()
  ).length
  ? allConnections
    .filter(conn =>
      conn.connection.baseUrl == ACCOUNTS_HUB_PUBLIC_URL
      && conn.connection.connectionState == 'Connected'
      && conn.connectedAs.valueOf() == connectedAs.valueOf()
    )[0].connection
  : null;
const getOrdersHubConnection = (connectedAs) => allConnections
  .filter(conn =>
    conn.connection.baseUrl == ORDERS_HUB_PUBLIC_URL
    && conn.connection.connectionState == 'Connected'
    && conn.connectedAs.valueOf() == connectedAs.valueOf()
  ).length
  ? allConnections.filter(conn =>
    conn.connection.baseUrl == ORDERS_HUB_PUBLIC_URL
    && conn.connection.connectionState == 'Connected'
    && conn.connectedAs.valueOf() == connectedAs.valueOf()
  )[0].connection
  : null;
const stopAllConnections = () => allConnections.forEach((conn) => { conn.connection.stop(); });

const connectToAccountsHub = (onConnected, connectedAs) => connectToHub(
  ACCOUNTS_HUB_PUBLIC_URL,
  onConnected,
  connectedAs
);
const connectToOrdersHub = (onConnected, connectedAs) => connectToHub(
  ORDERS_HUB_PUBLIC_URL,
  onConnected,
  connectedAs
);

const connectToHub = (hubConnectionUrl, onConnected, connectedAs) => {
  let connection = allConnections
    .filter(conn =>
      conn.connection.baseUrl == hubConnectionUrl
      && conn.connection.connectionState == 'Connected'
      && conn.connectedAs.valueOf() == connectedAs.valueOf()
    ).length
    ? allConnections
      .filter(conn =>
        conn.connection.baseUrl == hubConnectionUrl
        && conn.connection.connectionState == 'Connected'
        && conn.connectedAs.valueOf() == connectedAs.valueOf()
      )[0].connection
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
        allConnections = allConnections.filter(x => x.id !== newConnection.id);
      });

    newConnection
      .start()
      .then((result) => {
        // console.log(`Connected to Hub! (${newConnection.connectionId} - ${newConnection.connectionState} - ${newConnection.baseUrl})`);
        allConnections = [...allConnections, { connection: newConnection, connectedAs }];

        if (onConnected) onConnected(); // here are also handled subscriptions to server-sended messages
      })
      .catch(e => console.log(e));

    connection = newConnection;
  }

  return connection;
};


export const hubsConnectivityService = {
  stopAllConnections,
  getAllConnections,
  getOrdersHubConnection,
  getAccountsHubConnection,
  connectToAccountsHub,
  connectToOrdersHub,
};
