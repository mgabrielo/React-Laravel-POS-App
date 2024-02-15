import { FC, useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { observer } from "mobx-react-lite";

interface AutoCompleteServerSideProps {
  label: string;
  ajaxCallFn: Function;
  onOptionSelect: (option: any) => void;
  error: any;
  field: any;
}

const AutoCompleteServerSide: FC<AutoCompleteServerSideProps> = ({
  label,
  ajaxCallFn,
  onOptionSelect,
  error,
  field,
}) => {
  const [options, setOptions] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchOptions = async () => {
          setLoading(true);
          const response = await ajaxCallFn({ search: inputValue });
          console.log(response);
          setLoading(false);
          return response;
        };
        const response = await fetchOptions();
        setOptions(response);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchData();
  }, [inputValue, onOptionSelect, error]);

  //   const handleKeyUp = (e: any) => {
  //     setInputValue(e.target.value);
  //   };

  return (
    <>
      {options && options.length > 0 && (
        <Autocomplete
          {...field}
          options={options}
          getOptionLabel={(option: any) => option.label ?? ""}
          isOptionEqualToValue={(option: any, value: any) =>
            option.label === value.label
          }
          filterOptions={(x) => x}
          onKeyUp={(e: any) => {
            setInputValue(e.target.value);
          }}
          onChange={(_, newValue) => {
            onOptionSelect(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              variant="outlined"
              fullWidth
              error={!!error}
              helperText={error?.message}
              autoComplete="new-password"
              autoFocus={false}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
    </>
  );
};

export default observer(AutoCompleteServerSide);
