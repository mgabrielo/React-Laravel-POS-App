import { createContext, useContext } from "react";
import AuthStore from "./authStore";
import CustomerStore from "./customerStore";
import DialogStore from "./dialogStore";

if (process.env.NODE_ENV === "development") {
  const { enableLogging } = require("mobx-logger");
  enableLogging();
}

export interface IRootStore {
  authstore: AuthStore;
  customerStore: CustomerStore;
  dialogStore: DialogStore;
  handleError: Function;
}

export class RootStore implements IRootStore {
  authstore: AuthStore;
  dialogStore: DialogStore;
  customerStore: CustomerStore;

  constructor() {
    this.authstore = new AuthStore(this);
    this.dialogStore = new DialogStore(this);
    this.customerStore = new CustomerStore(this);
  }

  public handleError = (
    errorCode: number | null = null,
    errorMessage: string,
    errorData: any
  ) => {
    console.error(errorData);
    if (errorCode === 403) {
      this.authstore.setIsAuthenticated(false);
      return null;
    }
  };
}

const rootStoreContext = createContext({
  rootStore: new RootStore(),
});

export const useStore = () => useContext(rootStoreContext);
