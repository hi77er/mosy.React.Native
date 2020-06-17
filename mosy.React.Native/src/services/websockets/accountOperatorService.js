import { AsyncStorage } from 'react-native';
import { hubsConnectivityService } from './hubsConnectivityService';


const invokeAccountsHubConnectedAsAccountOperator = (venueId) => {
  const accountsHubConnection = hubsConnectivityService.getAccountsHubConnection();
  try {
    accountsHubConnection.invoke("ConnectAsAccountOperator", venueId);
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeOrdersHubConnectedAsAccountOperator = (venueId) => {
  const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection();
  try {
    ordersHubConnection.invoke("ConnectAsAccountOperator", venueId);
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeUpdateTableAccountStatus = (bindingModel) => {
  // bindingModel: {tableAccountId: "", newStatus: 0, updaterUsername: "" }
  console.log("invokeUpdateTableAccountStatus");
  const accountsHubConnection = hubsConnectivityService.getAccountsHubConnection();
  try {
    accountsHubConnection
      .invoke("UpdateTableAccountStatus", bindingModel)
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


export const accountOperatorService = {
  invokeOrdersHubConnectedAsAccountOperator,
  invokeAccountsHubConnectedAsAccountOperator,
  invokeUpdateTableAccountStatus,
  invokeUpdateOrderRequestablesStatusAfterAccountStatusChanged,
};
