import { AsyncStorage } from 'react-native';
import { authService } from '../authService';
import { hubsConnectivityService } from '../websockets/hubsConnectivityService';


const invokeAccountsHubConnectedAsAccountOpener = (accountId) => {
  const accountsHubConnection = hubsConnectivityService.getAccountsHubConnection();
  try {
    accountsHubConnection.invoke("ConnectAsAccountOpener", accountId || null);
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeOrdersHubConnectedAsAccountOpener = (accountId) => {
  const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection();
  try {
    ordersHubConnection.invoke("ConnectAsAccountOpener", accountId || null);
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeCreateTableAccountRequest = (bindingModel) => {
  // bindingModel: {openerUsername: "", assignedOperatorUsername: "", fboTableId: "", requestableIds: ["",""] }
  console.log("invokeCreateTableAccountRequest");
  const accountsHubConnection = hubsConnectivityService.getAccountsHubConnection();
  try {
    accountsHubConnection
      .invoke("CreateTableAccountRequest", bindingModel)
      .catch((err) => console.log(err));
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeCreateOrderRequest = (bindingModel) => {
  // bindingModel: {creatorUsername: "", tableAccountId: "", requestableIds: ["",""] }
  console.log("invokeCreateOrderRequest");
  const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection();
  try {
    ordersHubConnection
      .invoke("CreateOrderRequest", bindingModel)
      .catch((err) => console.log(err));
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeUpdateOrderRequestablesStatusAfterAccountStatusChanged = (tableAccountId) => {
  console.log("invokeUpdateOrderRequestablesStatusAfterAccountStatusChanged", tableAccountId);
  const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection();
  try {
    ordersHubConnection
      .invoke("UpdateOrderRequestablesStatusAfterAccountStatusChanged", tableAccountId)
      .catch((err) => console.log(err));
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeUpdateTableAccountStatus = (bindingModel) => {
  // bindingModel: {tableAccountId: "", newStatus: 0, updaterUsername: "" }
  // console.log("invokeUpdateTableAccountStatus");
  const accountsHubConnection = hubsConnectivityService.getAccountsHubConnection();
  try {
    accountsHubConnection
      .invoke("UpdateTableAccountStatus", bindingModel)
      .catch((err) => { console.log(err); console.log(err.message); });
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}


export const accountOpenerService = {
  invokeAccountsHubConnectedAsAccountOpener,
  invokeOrdersHubConnectedAsAccountOpener,
  invokeCreateTableAccountRequest,
  invokeCreateOrderRequest,
  invokeUpdateOrderRequestablesStatusAfterAccountStatusChanged,
  invokeUpdateTableAccountStatus,
};
