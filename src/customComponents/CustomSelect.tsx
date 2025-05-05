import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
} from "@mui/material";
import theme from "../theme";
// import { theme } from "../utils/theme";

// Define props interface
interface CustomSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>, name: string) => void;
  options: string[];
  [key: string]: any; // For additional props passed to Select
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  sx,
  ...props
}) => {
  return (
    <FormControl
      fullWidth
      sx={{
        "& .MuiInputLabel-root": {
          top: "-7px",
        },
        "& .MuiInputLabel-shrink": {
          top: "2px",
        },
      }}
    >
      <InputLabel
        sx={{
          color: theme.palette.white,
          fontSize: 14,
          "&.Mui-focused": {
            color: theme.palette.white,
          },
        }}
      >
        {label}
      </InputLabel>
      {options?.length && (
        <Select
          value={value}
          onChange={(e) => onChange(e, name)}
          label={label}
          MenuProps={{
            PaperProps: {
              sx: {
                "& .MuiList-root.MuiMenu-list": {
                  backgroundColor: theme.palette.background.default, // #1E1E1E
                  maxHeight: "210px",
                },
              },
            },
          }}
          {...props}
          sx={{
            width: "100%",
            padding: 0,
            "&.MuiInputBase-root": {},
            "&:hover": {
              borderColor: theme.palette.white,
            },
            "& .MuiSelect-select": {
              p: "8.5px",
              backgroundColor: "transparent",
              color: theme.palette.white,
              fontSize: "14px",
            },
            "& .MuiSelect-icon": {
              color: theme.palette.white,
            },
            "& .MuiFormLabel-root": {
              color: theme.palette.white,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.white,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.white,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FFFFFF", // White on hover
            },
            "&.MuiList-root .MuiMenu-list": {
              p: 0,
            },
          }}
        >
          {options.map((option, index) => (
            <MenuItem
              key={index}
              value={option}
              sx={{
                fontSize: "14px",
                color: theme.palette.white,
                "&.MuiMenuItem-root.Mui-selected": {
                  backgroundColor: theme.palette.background.paper,
                },
                "&.MuiMenuItem-root:hover": {
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            >
              {option}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
};

export default CustomSelect;
