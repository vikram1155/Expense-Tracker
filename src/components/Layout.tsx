import { Box, Container } from "@mui/material";
import React from "react";
import SelectedTab from "./SelectedTab";

interface LayoutProps {
  children: React.ReactNode;
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  selectedTab,
  setSelectedTab,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100%",
      }}
    >
      <SelectedTab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: "90%", md: "900px", lg: "1000px" },
          px: { xs: 2, sm: 2, md: 3, lg: "0 !important" },
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
