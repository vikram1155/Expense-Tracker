import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import CustomTypography from "../customComponents/CustomTypography";
import { showSnackbar } from "../redux/snackbarSlice";
import theme from "../theme";
import {
  categoryOptions,
  methodOptions,
  monthOptions,
  monthOptionsLine,
  monthToValue,
  monthToValueLine,
  typeOptions,
  valueToMonth,
  valueToMonthLine,
} from "../assets/data";
import PieChart from "../customComponents/PieChart";
import BarChart from "../customComponents/BarChart";
import LineChart from "../customComponents/LineChart";
import Reports from "../customComponents/Reports";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  name: string;
  category: string;
  date: string;
  method: string;
  comments: string;
}

const Analysis: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      2;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }
        const response = await axios.get(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:8000"
          }/api/transactions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const apiTransactions = response.data.transactions || [];
        const mappedTransactions: Transaction[] = apiTransactions.map(
          (t: any) => ({
            id: t._id,
            type: t.type.charAt(0).toUpperCase() + t.type.slice(1), // debit -> Debit
            amount: t.amount,
            name: t.name,
            category: t.category,
            date: t.date,
            method: t.method.charAt(0).toUpperCase() + t.method.slice(1), // upi -> UPI
            comments: t.comments || "",
          })
        );
        setTransactions(mappedTransactions);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to fetch transactions";
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch(
            showSnackbar({
              message: "Session expired or unauthorized. Please log in again.",
              severity: "error",
            })
          );
          navigate("/");
        } else {
          dispatch(showSnackbar({ message: errorMessage, severity: "error" }));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [dispatch, navigate]);

  // Dynamic Year Options
  const yearOptions = useMemo(() => {
    const years = Array.from(
      new Set(transactions.map((t) => t.date.split("-")[0]))
    );
    return years.length > 0
      ? years.sort((a, b) => Number(b) - Number(a))
      : [new Date().getFullYear().toString()];
  }, [transactions]);

  // Filter States
  const [graph1Filter, setGraph1Filter] = useState<{
    yearSelected: string;
    monthSelected: string;
    categorySelected: string;
    typeSelected: string;
    methodSelected: string;
  }>({
    yearSelected: yearOptions[0] || new Date().getFullYear().toString(),
    monthSelected: "All",
    categorySelected: "All",
    typeSelected: "All",
    methodSelected: "All",
  });

  const [graph2Filter, setGraph2Filter] = useState<{
    yearSelected: string;
    monthSelected: string;
  }>({
    yearSelected: yearOptions[0] || new Date().getFullYear().toString(),
    monthSelected: ("0" + (new Date().getMonth() + 1)).slice(-2), // Current month (01-12)
  });

  const [graph3Filter, setGraph3Filter] = useState<{
    yearSelected: string;
  }>({
    yearSelected: yearOptions[0] || new Date().getFullYear().toString(),
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: { xs: 2, sm: 3, md: 4 },
        mb: 3,
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: "12px",
          p: { xs: 2, sm: 4 },
          width: "100%",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          maxWidth: { xs: "100%", sm: "95%", md: "900px", lg: "1000px" },
        }}
      >
        <Box textAlign="center" maxWidth={"82%"} margin={"auto"} pb={3}>
          <CustomTypography type="bodyBold" pb={3}>
            Dive into your finances with dynamic visualizations! The Pie Chart
            slices your spending by category, the Line Chart compares monthly
            expenses to the yearly average, and the Bar Chart showcases income
            versus spending each month. Analyze and optimize your savings
            effortlessly!
          </CustomTypography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : transactions.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CustomTypography type="body">
              No transactions available to analyze.
            </CustomTypography>
          </Box>
        ) : (
          <>
            <PieChart
              transactions={transactions}
              filter={graph1Filter}
              setFilter={setGraph1Filter}
              yearOptions={yearOptions}
              monthOptions={monthOptions}
              categoryOptions={categoryOptions}
              typeOptions={typeOptions}
              methodOptions={methodOptions}
              monthToValue={monthToValue}
              valueToMonth={valueToMonth}
            />
            <hr
              style={{
                height: "1px",
                borderColor: theme.palette.grey3,
                backgroundColor: theme.palette.grey3,
                borderRadius: "100px",
                width: "90%",
                margin: "40px auto",
              }}
            />
            <LineChart
              transactions={transactions}
              filter={graph2Filter}
              setFilter={setGraph2Filter}
              yearOptions={yearOptions}
              monthOptions={monthOptionsLine}
              monthToValue={monthToValueLine}
              valueToMonth={valueToMonthLine}
            />

            <Reports
              transactions={transactions}
              filter={graph2Filter}
              valueToMonth={valueToMonthLine}
            />
            <hr
              style={{
                height: "1px",
                borderColor: theme.palette.grey3,
                backgroundColor: theme.palette.grey3,
                borderRadius: "100px",
                width: "90%",
                margin: "40px auto",
              }}
            />
            <BarChart
              transactions={transactions}
              filter={graph3Filter}
              setFilter={setGraph3Filter}
              yearOptions={yearOptions}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Analysis;
