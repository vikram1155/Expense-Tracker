import { Box } from "@mui/material";
import React from "react";
import CustomButton from "../customComponents/CustomButton";

const HomePage: React.FC = () => {
  return (
    <Box>
      HomePage
      <CustomButton text="Add Expense" onClick={() => alert("Clicked!")} />
    </Box>
  );
};

export default HomePage;
