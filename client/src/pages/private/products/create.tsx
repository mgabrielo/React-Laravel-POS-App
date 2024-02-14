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

const schema = yup.object().shape({
  name: yup.string().required("Product Name is required"),
  category_id: yup.string().required("category is required"),
  price: yup.number().required("Price is required").min(0),
  stock: yup.number().required("Stock is required").min(0),
  image: yup
    .mixed()
    .test("required", "image is required", (value: any) => {
      if (!value) {
        return false;
      } else {
        return true;
      }
    })
    .test("fileType", "unsupported file format", (value: any) => {
      if (!value) return true;
      const supportedFormat = ["image/jpeg", "image/png", "image/jpg"];
      return supportedFormat.includes(value.type);
    })
    .test("fileSize", "file too large", (value: any) => {
      if (!value) return true;
      return value.size <= 6000000;
    }),
});

const ProductCreate = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const {
    rootStore: {
      productStore: { createData, fetchCategories },
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
      name: "",
      category_id: "",
      stock: 0,
      price: 0,
      image: "",
    },
  });

  const navigate = useNavigate();
  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      Object.keys(data).map((key) => {
        return formData.append(key, data[key]);
      });
      const resData = await createData(formData);
      if (resData) {
        reset();
        navigate("..");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const resData = await fetchCategories();
        if (resData !== undefined) {
          setCategories(resData?.data?.categories);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadCategories();
  }, [fetchCategories]);
  return (
    <Box sx={{ width: "100%" }}>
      <form>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="name"
                  label="Name"
                  variant="outlined"
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="category_id"
                  label="Category"
                  variant="outlined"
                  size="small"
                  select
                  error={!!errors.category_id}
                  helperText={errors.category_id?.message}
                >
                  {categories.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="price"
                  label="Price"
                  variant="outlined"
                  size="small"
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="stock"
                  label="stock"
                  variant="outlined"
                  size="small"
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            {imageUrl && (
              <Card sx={{ maxWidth: 200, my: 2, objectFit: "cover" }}>
                <CardMedia
                  sx={{
                    height: "fit-content",
                    width: "100%",
                  }}
                  component={"img"}
                  image={imageUrl ? imageUrl : ""}
                  title="img-upload"
                />
              </Card>
            )}
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  id="image"
                  type="file"
                  label="Upload Image"
                  focused
                  variant="outlined"
                  size="small"
                  onChange={(e: any) => {
                    field.onChange(e?.target?.files[0]);
                    e?.target?.files?.length > 0
                      ? setImageUrl(URL.createObjectURL(e.target.files[0]))
                      : setImageUrl(null);
                  }}
                  error={!!errors.image}
                  helperText={errors.image?.message}
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

export default observer(ProductCreate);
