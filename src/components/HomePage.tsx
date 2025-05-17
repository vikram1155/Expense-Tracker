import { Box } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../customComponents/CustomButton";
import CustomTypography from "../customComponents/CustomTypography";
import theme from "../theme";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        sx={{
          minHeight: "calc(100vh - 176px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
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
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            gap: 4,
            maxWidth: { xs: "100%", sm: "95%", md: "900px", lg: "1000px" },
          }}
        >
          <CustomTypography
            type="heading1"
            fontSize={{ xs: 58, sm: 66, md: 80, lg: 100 }}
          >
            Master Your Money Now
          </CustomTypography>
          <CustomTypography type="subHeading">
            Track expenses effortlessly. Categorize transactions instantly.
            Analyze spending with clarity. Take charge of your finances!
          </CustomTypography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <CustomButton
              text="Add Transaction"
              onClick={() => navigate("/create-transaction")}
            />

            <CustomButton
              text="My Dashboard"
              onClick={() => navigate("/analysis")}
              sx={{ width: "131px" }}
            />
          </Box>

          <CustomButton
            text="Know more"
            onClick={() => navigate("/know-more")}
            sx={{ width: "131px" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
