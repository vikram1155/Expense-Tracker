import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";
import Layout from "./components/Layout";
import CreateTransactions from "./components/CreateTransactions";
import Transactions from "./components/Transactions";
import Analysis from "./components/Analysis";
import { useState } from "react";
import Profile from "./components/Profile";
import Login from "./components/Login";
import LoginInToContinue from "./components/LoginInToContinue";
import theme from "./theme";
import PageNotFound from "./components/PageNotFound";
import CustomSnackbar from "./customComponents/CustomSnackbar";
import EditTransaction from "./components/EditTransaction";

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const userFromLocal = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  return (
    <>
      <Router>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<div>About Us</div>} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/create-transaction"
              element={
                userFromLocal ? (
                  <Layout
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                  >
                    <CreateTransactions />
                  </Layout>
                ) : (
                  <LoginInToContinue />
                )
              }
            />
            <Route
              path="/edit-transactions/:id"
              element={
                userFromLocal ? (
                  <Layout
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                  >
                    <EditTransaction />
                  </Layout>
                ) : (
                  <LoginInToContinue />
                )
              }
            />
            <Route
              path="/all-transactions"
              element={
                userFromLocal ? (
                  <Layout
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                  >
                    <Transactions />
                  </Layout>
                ) : (
                  <LoginInToContinue />
                )
              }
            />
            <Route
              path="/analysis"
              element={
                userFromLocal ? (
                  <Layout
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                  >
                    <Analysis />
                  </Layout>
                ) : (
                  <LoginInToContinue />
                )
              }
            />

            <Route
              path="*"
              element={
                <Box
                  sx={{
                    minHeight: "calc(100vh - 176px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    p: { xs: 2, sm: 4 },
                    background: theme.palette.background.default,
                    color: "white",
                    mx: { xs: 2, sm: 3, md: 4 },
                    my: { xs: 7, sm: 7, md: 7 },
                  }}
                >
                  <PageNotFound />
                </Box>
              }
            />
          </Routes>
          <Footer />
        </Box>
      </Router>
      <CustomSnackbar />
    </>
  );
};

export default App;
