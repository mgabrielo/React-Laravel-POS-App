import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

const Products = () => {
  return (
    <div>
      <h2>Orders</h2>
      <Box>
        <Outlet />
      </Box>
    </div>
  );
};

export default observer(Products);
