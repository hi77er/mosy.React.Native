import { AsyncStorage } from 'react-native';
import { hubsConnectivityService } from './hubsConnectivityService';

const connectingAsVenueHost = "venuehost";

const invokeAccountsHubConnectedAsVenueHost = (venueId) => {
  const accountsHubConnection = hubsConnectivityService.getAccountsHubConnection(connectingAsVenueHost);
  try {
    accountsHubConnection.invoke("ConnectAsVenueHost", venueId);
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeOrdersHubConnectedAsVenueHost = (venueId) => {
  const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection(connectingAsVenueHost);
  try {
    ordersHubConnection.invoke("ConnectAsVenueHost", venueId);
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

const invokeUpdateTableAccountStatus = (bindingModel) => {
  // bindingModel: {tableAccountId: "", newStatus: 0, updaterUsername: "" }
  console.log("invokeUpdateTableAccountStatus");
  const accountsHubConnection = hubsConnectivityService.getAccountsHubConnection(connectingAsVenueHost);
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
  const ordersHubConnection = hubsConnectivityService.getOrdersHubConnection(connectingAsVenueHost);
  try {
    ordersHubConnection
      .invoke("UpdateOrderRequestablesStatusAfterAccountStatusChanged", tableAccountId)
      .catch((err) => console.log(err));
  } catch (err) {
    console.log("Errors invoking SignalR method.");
  }
}

export const venueHostService = {
  invokeAccountsHubConnectedAsVenueHost,
  invokeOrdersHubConnectedAsVenueHost,
  invokeUpdateTableAccountStatus,
  invokeUpdateOrderRequestablesStatusAfterAccountStatusChanged,
};
