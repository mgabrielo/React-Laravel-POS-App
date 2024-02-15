import { action, makeObservable, observable } from "mobx";
import { IRootStore } from "./rootStore";
import { GridColDef, GridRowProps } from "@mui/x-data-grid";
import ListItemButton from "@mui/material/ListItemButton";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default class ProductStore {
  BASE_URL = process.env.REACT_APP_API_URL + "/v1/products";
  rowData: GridRowProps[] = [];
  columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: `category`,
      headerName: "Category",
      width: 150,
    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
    },
    {
      field: "stock",
      headerName: "Stock",
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
            to={`edit/${params?.row?.id}`}
          >
            <EditIcon />
          </ListItemButton>
          <ListItemButton
            sx={{ width: 0 }}
            onClick={() => this.deleteDialog(params)}
          >
            <DeleteIcon />
          </ListItemButton>
        </>
      ),
    },
  ];
  private rootStore: IRootStore;
  constructor(rootStore: IRootStore) {
    makeObservable(this, {
      rowData: observable,
      columns: observable,
      setRowData: action,
      fetchList: action,
      createData: action,
      getProductData: action,
      updateData: action,
      deleteDialog: action,
      deleteData: action,
      fetchCategories: action,
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
        this.setRowData(result?.data?.products);
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

  createData = async (data: any) => {
    const response = await fetch(`${this.BASE_URL}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.rootStore.authstore.token}`,
      },
      body: data,
    });
    const result = await response.json();
    if (response.ok) {
      return Promise.resolve(result);
    } else {
      return Promise.reject(result);
    }
  };

  getProductData = async (id: number | string) => {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.rootStore.authstore.token}`,
        "Content-Type": "Application/json",
      },
    });
    const result = await response.json();
    console.log(result);
    if (response.ok) {
      return Promise.resolve(result);
    } else {
      return Promise.reject(result);
    }
  };

  updateData = async (id: any, data: any) => {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.rootStore.authstore.token}`,
      },
      body: data,
    });
    const result = await response.json();
    console.log(result);
    if (response.ok) {
      return Promise.resolve(result);
    } else {
      return Promise.reject(result);
    }
  };
  deleteData = async (id: any) => {
    const response = await fetch(`${this.BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${this.rootStore.authstore.token}`,
        "Content-Type": "Application/json",
      },
    });
    const result = await response.json();
    if (response.ok) {
      this.setRowData(this.rowData.filter((item) => item?.id !== id));
      return Promise.resolve(result);
    } else {
      return Promise.reject(result);
    }
  };

  deleteDialog = async (params: any) => {
    this.rootStore.dialogStore.openDialog({
      confirmFn: () => this.deleteData(params.row.id),
      dialogText: "Are you Sure You Want to Delete This Product ?",
    });
  };

  getList = async (postData: any) => {
    try {
      const response = await fetch(this.BASE_URL + "/get-list", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.rootStore.authstore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (data.error) {
        return Promise.reject(data);
      } else {
        return Promise.resolve(data.data.products);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };
}
