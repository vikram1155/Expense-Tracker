import React, { useEffect } from "react";
import {  Tabs, Tab, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import theme from "../theme";

interface SelectedTabProps {
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
}

const SelectedTab: React.FC<SelectedTabProps> = ({
  selectedTab,
  setSelectedTab,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("a-selectedTab", selectedTab);

  useEffect(() => {
    switch (location.pathname) {
      case "/create-transaction":
        setSelectedTab(0);
        break;
      case "/all-transactions":
        setSelectedTab(1);
        break;
      case "/analysis":
        setSelectedTab(2);
        break;
      default:
        setSelectedTab(0);
    }
  }, [location.pathname, setSelectedTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    switch (newValue) {
      case 0:
        navigate("/create-transaction");
        break;
      case 1:
        navigate("/all-transactions");
        break;
      case 2:
        navigate("/analysis");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: "90%", md: "900px", lg: "1000px" },
        mt: 8,
        px: { xs: 2, sm: 2, md: 3, lg: "0 !important" },
      }}
    >
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          "& .MuiTab-root": {
            fontSize: { xs: "12px", sm: "14px" },
            textTransform: "none",
            minWidth: { xs: 80, sm: 100 },
            padding: "12px 8px 12px 8px",
            mr: 2,
            color: theme.palette.tabs.inactive,
          },
          "& .Mui-selected": {
            color: `${theme.palette.tabs.active} !important`,
            fontWeight: "bold",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.tabs.active,
          },
          "& .MuiButtonBase-root": {
            width: { xs: "110px", sm: "130px" },
            p: 0,
            m: 0,
            minWidth: 0,
            mr: 0,
          },
        }}
      >
        <Tab label="Create Transaction" />
        <Tab label="All Transactions" sx={{ ml: "8px !important" }} />
        <Tab label="Trends & Analysis" />
      </Tabs>
    </Container>
  );
};

export default SelectedTab;
