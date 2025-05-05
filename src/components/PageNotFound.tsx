import { Box } from "@mui/material";
import React from "react";
import CustomButton from "../customComponents/CustomButton";
import { useNavigate } from "react-router-dom";
import CustomTypography from "../customComponents/CustomTypography";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CustomTypography type="heading1">404 - Page Not Found</CustomTypography>
      <CustomButton
        text="Go back to Home"
        onClick={() => {
          navigate("/");
        }}
        sx={{
          mt: 4,
          minWidth: "200px",
        }}
      />
    </Box>
  );
};

export default PageNotFound;
