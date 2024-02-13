import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStore } from "../../store/rootStore";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("This is an Invalid Email"),
  password: yup
    .string()
    .required("Password is required")
    .min(4, "length must be at least 4 characters"),
});

const Login = () => {
  const {
    rootStore: { authstore },
  } = useStore();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isAuthenticated = authstore?.isAuthenticated;

  console.log(isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to={"/dashboard"} />;
  }

  const onSubmit = async (data: any) => {
    // console.log(data);
    const resData = await authstore.login({
      email: data?.email,
      password: data?.password,
    });
    console.log(resData);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ccc",
      }}
    >
      <Card sx={{ minWidth: 450, justifyContent: "center" }}>
        <Typography
          variant="h2"
          fontSize={20}
          color={"#0047AB"}
          sx={{ textAlign: "center", my: 3, fontWeight: 600 }}
        >
          Log Into Your Account
        </Typography>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  id="email"
                  label="Email"
                  variant="outlined"
                  size="small"
                  error={!!errors.email}
                  helperText={errors.email ? errors?.email?.message : ""}
                  {...field}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  type="password"
                  fullWidth
                  id="password"
                  label="Password"
                  variant="outlined"
                  size="small"
                  error={!!errors.password}
                  helperText={errors.password ? errors?.password?.message : ""}
                  {...field}
                />
              )}
            />

            <Button
              sx={{ mt: 2, backgroundColor: "#0047AB" }}
              variant="contained"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in" : "Login"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </Box>
  );
};

export default observer(Login);
