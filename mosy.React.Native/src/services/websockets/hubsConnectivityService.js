import { AsyncStorage } from 'react-native';
import { HubConnectionBuilder, LogLevel, TransportType } from '@microsoft/signalr';
import { authService } from '../authService';


const ACCOUNTS_HUB_PUBLIC_URL = "https://wsmosy.azurewebsites.net/hubs/accounts";
const ORDERS_HUB_PUBLIC_URL = "https://wsmosy.azurewebsites.net/hubs/orders";

let allConnections = [];

const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getAllConnections = () => allConnections;
const getAccountsHubConnection = () => allConnections
  .filter(conn => conn.connection.baseUrl == ACCOUNTS_HUB_PUBLIC_URL && conn.connection.connectionState == 'Connected').length
  ? allConnections
    .filter(conn => conn.connection.baseUrl == ACCOUNTS_HUB_PUBLIC_URL && conn.connection.connectionState == 'Connected')[0].connection
  : null;
const getOrdersHubConnection = () => allConnections.filter(conn => conn.connection.baseUrl == ORDERS_HUB_PUBLIC_URL && conn.connection.connectionState == 'Connected').length
  ? allConnections.filter(conn => conn.connection.baseUrl == ORDERS_HUB_PUBLIC_URL && conn.connection.connectionState == 'Connected')[0].connection
  : null;
const stopAllConnections = () => allConnections.forEach((conn) => { conn.connection.stop(); });

const connectToAccountsHub = (onConnected) => connectToHub(ACCOUNTS_HUB_PUBLIC_URL, onConnected);
const connectToOrdersHub = (onConnected) => connectToHub(ORDERS_HUB_PUBLIC_URL, onConnected);

const connectToHub = async (hubConnectionUrl, onConnected) => {
  let connection = allConnections
    .filter(conn => conn.connection.baseUrl == hubConnectionUrl && conn.connection.connectionState == 'Connected').length
    ? allConnections
      .filter(conn =>
        conn.connection.baseUrl == hubConnectionUrl
        && conn.connection.connectionState == 'Connected'
      )[0].connection
    : null;

  if (!connection) {
    // FROM DOCS: Without any parameters, withAutomaticReconnect() configures the client to wait 0, 2, 10, and 30 seconds
    // FROM DOCS: respectively before trying each reconnect attempt, stopping after four failed attempts.
    // FROM DOCS: 
    // FROM DOCS: .configureLogging(LogLevel.Debug)
    const newConnection = new HubConnectionBuilder()
      .withUrl(hubConnectionUrl, { accessTokenFactory: () => authService.pickValidAccessToken() })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          const retryInMs = Math.random() * 10000;
          console.log(`WebSockets connection interrupted. Retrying in ${(retryInMs / 1000)} seconds.`);
          return retryInMs;
        }
      })
      .build();

    newConnection
      .onclose(async () => {
        // console.log(`Hub connection closed! (${newConnection.connectionId} - ${newConnection.connectionState} - ${newConnection.baseUrl})`);
        allConnections = allConnections.filter(x => x.id !== newConnection.id);
      });

    while (newConnection.state !== 'Connected') {
      try {
        const result = await newConnection.start();

        allConnections = [...allConnections, { connection: newConnection }];
        if (onConnected) onConnected(); // here are also handled subscriptions to server-sended messages

        break;
      }
      catch (ex) {
        const retryInMs = Math.random() * 10000;
        console.log(`Initial WebSockets connection failed. Reason: ${ex.message}. Retrying in ${(retryInMs / 1000)} seconds.`);
        await timeout(retryInMs);
      }
    }

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
