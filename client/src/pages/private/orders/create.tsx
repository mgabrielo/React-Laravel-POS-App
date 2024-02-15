import { observer } from "mobx-react-lite";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../store/rootStore";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { useEffect, useState } from "react";
import { MenuItem } from "@mui/material";
import AutoCompleteServerSide from "../../../components/autocomplete/AutoCompleteServerSide";
import AddNewItemForm from "./addNewItemForm";
import AllItemsList from "./allItemsList";

const schema = yup.object().shape({
  customer: yup
    .object()
    .shape({
      id: yup.string().required("id is required"),
      label: yup.string().required("label is required"),
    })
    .required("customer is required"),
});

const OrderCreate = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const {
    rootStore: { orderStore, customerStore },
  } = useStore();

  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      customer: {
        id: "",
        label: "",
      },
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const resData = await orderStore.createData(data);
      if (resData) {
        reset({
          customer: { id: "", label: "" },
        });
        orderStore.setCartItems([]);
        navigate("..");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <form>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Controller
              name="customer"
              control={control}
              render={({ field }) => (
                <AutoCompleteServerSide
                  label="Select a Customer"
                  ajaxCallFn={customerStore?.getList}
                  onOptionSelect={(option) => field.onChange(option)}
                  error={errors?.customer ?? errors.customer}
                  field={field}
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
      <AddNewItemForm />
      <AllItemsList editMode={true} />
      <Box gap={2} sx={{ display: "flex" }}>
        <Button
          sx={{ my: 2 }}
          variant="contained"
          color="success"
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Button
          sx={{ my: 2 }}
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default observer(OrderCreate);
