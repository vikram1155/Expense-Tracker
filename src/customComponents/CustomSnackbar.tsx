import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "../redux/snackbarSlice";
import { RootState } from "../redux/store";
import theme from "../theme";

const CustomSnackbar: React.FC = () => {
  const { open, message, severity } = useSelector(
    (state: RootState) => state.snackbar
  );
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      message={message}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{
        "& .MuiSnackbarContent-root": {
          backgroundColor:
            severity === "success"
              ? theme.palette.success.main
              : theme.palette.error.main,
          minWidth: "fit-content",
          px: "40px",
          borderRadius: "8px",
        },
        "& .MuiSnackbarContent-message": {
          display: "flex",
          justifyContent: "center",
          color: theme.palette.white,
          fontWeight: 600,
        },
      }}
    />
  );
};

export default CustomSnackbar;
