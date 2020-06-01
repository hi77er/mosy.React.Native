import { AsyncStorage } from 'react-native';
import { authService } from '../authService';
import { hubsConnectivityService } from '../websockets/hubsConnectivityService';

const invokeAccountsHubConnectedAsAccountOpener = (accountId) => {
  console.log("invokeAccountsHubConnectedAsAccountOpener");
  const accountsHubConnection = hubsConnectivityService.getAccountsHubConnection();
  try {
    accountsHubConnection.invoke("ConnectAsAccountOpener", accountId);
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeOrdersHubConnectedAsAccountOpener = (accountId) => {
  console.log("invokeOrdersHubConnectedAsAccountOpener");
  const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection();
  try {
    ordersHubConnection.invoke("ConnectAsAccountOpener", accountId);
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeCreateTableAccountRequest = () => {

  return null;
}




export const accountOpenerService = {
  invokeAccountsHubConnectedAsAccountOpener,
  invokeOrdersHubConnectedAsAccountOpener,
  invokeCreateTableAccountRequest,
};
