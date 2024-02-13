import { observer } from "mobx-react-lite";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../../store/rootStore";
import { useEffect } from "react";

const schema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("last_name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("This is an Invalid Email"),
  phone_number: yup
    .string()
    .required("phone_number is required")
    .min(10, "Must be at at least 10 digits")
    .max(10, "Must be at at least 10 digits"),
  zip_code: yup
    .string()
    .required("zip_code is required")
    .min(6, "Must be at at least 6 characters")
    .max(6, "Must be at at least 6 characters"),
});

const CustomerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    rootStore: {
      customerStore: { getData, updateData },
    },
  } = useStore();
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      zip_code: "",
    },
  });

  const initForm = async () => {
    try {
      if (id) {
        const resData = await getData(id);
        if (resData.data) {
          reset(resData?.data?.customer);
        }
      } else {
        navigate(-1);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (id) {
      initForm();
    }
  }, [id]);
  const onSubmit = async (data: any) => {
    try {
      const resData = await updateData(id, data);
      if (resData) {
        reset();
        navigate("..");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <h3>Edit Customer Data</h3>
      <form>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="first_name"
                  label="First Name"
                  variant="outlined"
                  size="small"
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  variant="outlined"
                  size="small"
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="email"
                  label="Email"
                  variant="outlined"
                  size="small"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="phone_number"
                  label="Phone Number"
                  variant="outlined"
                  size="small"
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="zip_code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="zip_code"
                  label="Zip Code"
                  variant="outlined"
                  size="small"
                  error={!!errors.zip_code}
                  helperText={errors.zip_code?.message}
                />
              )}
            />
          </Grid>
        </Grid>
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
      </form>
    </Box>
  );
};

export default observer(CustomerEdit);
