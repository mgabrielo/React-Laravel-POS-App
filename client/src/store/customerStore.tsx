import { action, makeObservable, observable } from "mobx";
import { IRootStore } from "./rootStore";
import { GridColDef, GridRowProps } from "@mui/x-data-grid";
import ListItemButton from "@mui/material/ListItemButton";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default class CustomerStore {
  BASE_URL = process.env.REACT_APP_API_URL + "/v1/customers";
  rowData: GridRowProps[] = [];
  columns: GridColDef[] = [
    // {
    //   field: "id",
    //   headerName: "ID",
    //   width: 70,
    // },
    {
      field: "first_name",
      headerName: "First name",
      width: 150,
    },
    {
      field: "last_name",
      headerName: "Last name",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      width: 150,
    },
    {
      field: "zip_code",
      headerName: "Zip Code",
      width: 100,
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
      getData: action,
      updateData: action,
      deleteDialog: action,
      deleteData: action,
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
        this.setRowData(result?.data?.customers);
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
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
    if (response.ok) {
      return Promise.resolve(result);
    } else {
      return Promise.reject(result);
    }
  };

  getData = async (id: number | string) => {
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
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.rootStore.authstore.token}`,
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(data),
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
      dialogText: "Are you Sure You Want to Delete This Customer ?",
    });
  };
}
