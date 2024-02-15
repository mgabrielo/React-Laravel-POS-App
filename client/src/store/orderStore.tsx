import { action, makeObservable, observable } from "mobx";
import { IRootStore } from "./rootStore";
import { GridColDef, GridRowProps } from "@mui/x-data-grid";
import ListItemButton from "@mui/material/ListItemButton";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import DeleteIcon from "@mui/icons-material/Delete";

export default class OrderStore {
  BASE_URL = process.env.REACT_APP_API_URL + "/v1/orders";
  rowData: GridRowProps[] = [];
  columns: GridColDef[] = [
    {
      field: "order_number",
      headerName: "Order Number",
      width: 150,
    },
    {
      field: `customer_name`,
      headerName: "Customer Name",
      width: 150,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 150,
    },
    {
      field: "price",
      headerName: "Total Price",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <ListItemButton
            sx={{ width: 0 }}
            component={Link}
            to={`view/${params?.row?.id}`}
          >
            <VisibilityIcon />
          </ListItemButton>
        </>
      ),
    },
  ];

  private rootStore: IRootStore;
  cartItems: any[] = [];

  constructor(rootStore: IRootStore) {
    makeObservable(this, {
      rowData: observable,
      cartItems: observable,
      columns: observable,
      setRowData: action,
      fetchList: action,
      createData: action,
      getData: action,
      fetchCategories: action,
      setCartItems: action,
      removeFromCart: action,
    });
    this.rootStore = rootStore;
  }

  setRowData(values: GridRowProps[]) {
    this.rowData = values;
  }

  fetchList = async () => {
    try {
      const response = await fetch(`${this.BASE_URL}/list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.rootStore.authstore.token}`,
          "Content-Type": "Application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        this.setRowData(result?.data?.orders);
        return Promise.resolve(result);
      } else {
        return Promise.reject(result);
      }
    } catch (error) {
      this.rootStore.handleError(419, "Something Went Wrong", error);
    }
  };

  fetchCategories = async () => {
    try {
      const response = await fetch(`${this.BASE_URL}/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.rootStore.authstore.token}`,
          "Content-Type": "Application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        return Promise.resolve(result);
      } else {
        return Promise.reject(result);
      }
    } catch (error) {
      this.rootStore.handleError(419, "Something Went Wrong", error);
    }
  };

  getData = async (id: number | string) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.rootStore.authstore.token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data);
      } else {
        const orderItems = data.data.order?.items.map((item: any) => {
          if (item) {
            return {
              product: {
                label: item.product_name,
              },
              quantity: item.product_quantity,
              price: item.product_price,
              discount: item.product_discount,
              total: this.calculateFinalPrice(
                item.product_price,
                item.product_discount,
                item.product_quantity
              ),
            };
          }
          return null;
        });
        this.setCartItems(orderItems);
        return Promise.resolve(data.data.order);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  createData = async (customerData: any) => {
    try {
      const postDataProducts = [...this.cartItems].map((e: any) => {
        return {
          product_id: e.product.id,
          quantity: e.quantity,
          discount: e.discount,
        };
      });
      console.log("createData", postDataProducts);
      const formData = new FormData();
      formData.append("customer_id", customerData.customer?.id);
      postDataProducts.forEach((item: any, i: number) => {
        if (item) {
          return Object.keys(item).map((key: any) => {
            return formData.append(`products[${i}][${key}]`, item[key]);
          });
        }
        return null;
      });
      const response = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.rootStore.authstore.token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log("api-data", data);
      if (data.error) {
        return Promise.reject(data);
      } else {
        return Promise.resolve(data);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  setCartItems = (items: any[]) => {
    this.cartItems = items;
  };
  addToCart = async (value: any): Promise<boolean> => {
    this.cartItems.push(value);
    return Promise.resolve(true);
  };
  removeFromCart = async (index: any) => {
    this.cartItems.splice(index, 1);
  };

  calculateFinalPrice = (
    original: number,
    discount: number,
    quantity: number
  ): number => {
    const finalPrice = original - (original * discount) / 100;
    return finalPrice * quantity;
  };
}
