import React from "react";
import { TextField, SxProps } from "@mui/material";
import theme from "../theme";

interface CustomTextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: SxProps;
  [key: string]: any;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  name,
  value,
  onChange,
  sx,
  ...props
}) => {
  return (
    <TextField
      margin="normal"
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      sx={{
        "& .MuiInputBase-input[type='date']::-webkit-calendar-picker-indicator":
          {
            filter: "invert(1)",
          },
        "& .MuiOutlinedInput-input": {
          color: `${theme.palette.white} !important`,
          fontSize: "14px",
          backgroundColor: "transparent",
          borderRadius: "4px",
          padding: "10px 12px",
        },
        "& .MuiInputLabel-root": {
          color: `${theme.palette.white} !important`,
          fontSize: "14px",
          top: "-7px",
        },
        "& .MuiInputLabel-outlined": {
          color: `${theme.palette.white} !important`,
        },
        "& .MuiInputLabel-shrink": {
          color: `${theme.palette.white} !important`,
          top: "2px",
        },
        "& .Mui-focused.MuiInputLabel-root": {
          color: theme.palette.white,
          top: "2px",
        },
        "& .Mui-disabled": {
          color: `${theme.palette.white} !important`,
          WebkitTextFillColor: `${theme.palette.white} !important`,
          opacity: "0.5",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: `${theme.palette.white} !important`,
        },
        "& input:-webkit-autofill": {
          WebkitBoxShadow: `0 0 0 1000px transparent inset`,
          WebkitTextFillColor: `${theme.palette.white}`,
          transition: "background-color 5000s ease-in-out 0s",
        },
        "& input:-internal-autofill-selected": {
          appearance: "none",
          backgroundColor: "red !important",
          color: "#000 !important",
        },
        "&.MuiInputAdornment-root .MuiSvgIcon-root": {
          color: theme.palette.white, // #F44336 (red for calendar icon)
          fillOpacity: theme.palette.white, // #F44336 (red for calendar icon)
        },
        "& .MuiOutlinedInput-root": {
          p: 0,
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default CustomTextField;
