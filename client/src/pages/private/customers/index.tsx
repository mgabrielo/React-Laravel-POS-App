import React from "react";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

const Customers = () => {
  return (
    <div>
      <h2>Customers</h2>
      <Box>
        <Outlet />
      </Box>
    </div>
  );
};

export default observer(Customers);
