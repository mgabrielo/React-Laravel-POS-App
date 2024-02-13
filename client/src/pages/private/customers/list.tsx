import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useStore } from "../../../store/rootStore";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const CustomerList = () => {
  const {
    rootStore: { customerStore },
  } = useStore();

  useEffect(() => {
    const initTable = async () => {
      try {
        const resData = await customerStore.fetchList();
        console.log(resData);
      } catch (error) {
        console.log(error);
      }
    };
    initTable();
  }, [customerStore]);
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Box sx={{ width: "fit-content" }}>
        <Button
          size="medium"
          component={Link}
          to={"create"}
          sx={{
            backgroundColor: "#0047AB",
            color: "#fff",
            textTransform: "capitalize",
            my: 2,
            ":hover": {
              backgroundColor: "#0047AB",
            },
          }}
        >
          Create
        </Button>
      </Box>
      {customerStore.rowData && customerStore.rowData.length > 0 && (
        <DataGrid
          rows={customerStore.rowData}
          columns={customerStore.columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      )}
    </Box>
  );
};

export default observer(CustomerList);
