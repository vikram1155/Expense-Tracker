import { Box } from "@mui/material";
import React from "react";
import CustomButton from "../customComponents/CustomButton";
import { useNavigate } from "react-router-dom";
import CustomTypography from "../customComponents/CustomTypography";
import theme from "../theme";

const LoginInToContinue: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 176px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: 2, sm: 4 },
        background: theme.palette.background.default,
        color: "white",
        mx: { xs: 2, sm: 3, md: 4 },
        my: { xs: 7, sm: 7, md: 7 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CustomTypography type="body">
          You have not been authenticated yet. Please login to continue!
        </CustomTypography>
        <CustomButton
          text="Login Here!"
          onClick={() => {
            navigate("/login");
          }}
          sx={{
            mt: 4,
            minWidth: "200px",
          }}
        />
      </Box>
    </Box>
  );
};

export default LoginInToContinue;
