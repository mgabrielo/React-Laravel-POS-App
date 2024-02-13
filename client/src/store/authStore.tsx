import { action, makeObservable, observable } from "mobx";
import { IRootStore } from "./rootStore";

export default class AuthStore {
  BASE_URL = process.env.REACT_APP_API_URL + "/auth";
  isAuthenticated: boolean = false;
  token: string | null = null;
  private rootStore: IRootStore;
  constructor(rootStore: IRootStore) {
    makeObservable(this, {
      isAuthenticated: observable,
      token: observable,
      setIsAuthenticated: action,
      setIsToken: action,
      login: action,
      logout: action,
    });
    this.rootStore = rootStore;
    this.setIsToken(localStorage.getItem("auth_token"));
    if (this.token) {
      this.isAuthenticated = true;
    }
  }

  setIsAuthenticated = (value: boolean) => {
    this.isAuthenticated = value;
    if (!value) {
      this.setIsToken(null);
    }
  };

  setIsToken = (value: string | null) => {
    if (value) {
      localStorage.setItem("auth_token", value);
    } else {
      localStorage.removeItem("auth_token");
    }
    this.token = value;
  };

  login = async (postData: any) => {
    try {
      const response = await fetch(`${this.BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (response.ok) {
        this.setIsToken(data?.access_token);
        this.setIsAuthenticated(true);
        return Promise.resolve(data);
      } else {
        this.setIsAuthenticated(false);
        return Promise.reject(data);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something Went Wrong", error);
    }
  };

  logout = async () => {
    try {
      const response = await fetch(`${this.BASE_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "Application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        // this.setIsToken(null);
        this.setIsAuthenticated(false);
        return Promise.resolve(data);
      } else {
        this.setIsAuthenticated(false);
        return Promise.reject(data);
      }
    } catch (error) {
      this.rootStore.handleError(419, "Something Went Wrong", error);
    }
  };
}
