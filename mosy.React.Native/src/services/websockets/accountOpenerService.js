import { AsyncStorage } from 'react-native';
import { authService } from '../authService';
import { hubsConnectivityService } from '../websockets/hubsConnectivityService';

const connectingAsAccountOpener = "accountopener";

const invokeAccountsHubConnectedAsAccountOpener = (accountId) => {
  const accountsHubConnection = hubsConnectivityService.getAccountsHubConnection(connectingAsAccountOpener);
  try {
    accountsHubConnection.invoke("ConnectAsAccountOpener", accountId);
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeOrdersHubConnectedAsAccountOpener = (accountId) => {
  const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection(connectingAsAccountOpener);
  try {
    ordersHubConnection.invoke("ConnectAsAccountOpener", accountId);
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeCreateTableAccountRequest = (bindingModel) => {
  // bindingModel: {openerUsername: "", assignedOperatorUsername: "", fboTableId: "", requestableIds: ["",""] }
  console.log("invokeCreateTableAccountRequest");
  const accountsHubConnection = hubsConnectivityService.getAccountsHubConnection(connectingAsAccountOpener);
  try {
    accountsHubConnection
      .invoke("CreateTableAccountRequest", bindingModel)
      .catch((err) => console.log(err));
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeUpdateOrderRequestablesStatusAfterAccountStatusChanged = (tableAccountId) => {
  console.log("invokeUpdateOrderRequestablesStatusAfterAccountStatusChanged", tableAccountId);
  const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection(connectingAsAccountOpener);
  try {
    ordersHubConnection
      .invoke("UpdateOrderRequestablesStatusAfterAccountStatusChanged", tableAccountId)
      .catch((err) => console.log(err));
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}


export const accountOpenerService = {
  invokeAccountsHubConnectedAsAccountOpener,
  invokeOrdersHubConnectedAsAccountOpener,
  invokeCreateTableAccountRequest,
  invokeUpdateOrderRequestablesStatusAfterAccountStatusChanged,
};
