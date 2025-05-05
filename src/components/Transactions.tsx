import React, { useState } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CustomSelect from "../customComponents/CustomSelect";
import theme from "../theme";
import CustomTextField from "../customComponents/CustomTextField";
import { transactions } from "../assets/data";
import CustomTypography from "../customComponents/CustomTypography";

const columns: GridColDef[] = [
  { field: "type", headerName: "Type", width: 100 },
  { field: "amount", headerName: "Amount", width: 100 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "category", headerName: "Category", width: 120 },
  { field: "date", headerName: "Date", width: 120 },
  { field: "method", headerName: "Method", width: 120 },
  { field: "comments", headerName: "Comments", width: 200, flex: 1 },
];

const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Both");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMethod, setFilterMethod] = useState("All");

  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      transaction.amount.toString().includes(searchLower) ||
      transaction.name.toLowerCase().includes(searchLower) ||
      transaction.category.toLowerCase().includes(searchLower) ||
      transaction.method.toLowerCase().includes(searchLower) ||
      (transaction.comments?.toLowerCase() || "").includes(searchLower);

    const matchesType =
      filterType === "Both" || transaction.type === filterType;

    const matchesCategory =
      filterCategory === "All" || transaction.category === filterCategory;

    const matchesMethod =
      filterMethod === "All" || transaction.method === filterMethod;

    return matchesSearch && matchesType && matchesCategory && matchesMethod;
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: "12px",
          px: { xs: 2, sm: 2, md: 4 },
          py: { xs: 1, sm: 2, md: 4 },
          width: {
            xs: "calc(100% - 32px)",
            md: "calc(100% - 64px)",
          },
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        <CustomTypography type="heading6" pb={3}>
          Find all your transactions!
        </CustomTypography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 3fr" },
            columnGap: 5,
            rowGap: 1,
            pb: 3,
            alignItems: "center",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <CustomTextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            name="search"
            step="0.01"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
              columnGap: 2,
              rowGap: 2,
              mt: { xs: 0, sm: 1 },
            }}
          >
            <CustomSelect
              label="Type"
              name="type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as string)}
              options={["Both", "Credit", "Debit"]}
            />
            <CustomSelect
              label="Category"
              name="category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as string)}
              options={[
                "All",
                "Food",
                "Travel",
                "Bills",
                "Entertainment",
                "Shopping",
                "Healthcare",
                "Education",
                "Rent",
                "Utilities",
                "Insurance",
                "Miscellaneous",
              ]}
            />
            <CustomSelect
              label="Method"
              name="method"
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value as string)}
              options={["All", "UPI", "Card", "Cash", "Net Banking"]}
            />
          </Box>
        </Box>
        <Box
          sx={{
            height: { xs: "auto", sm: 600 },
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          <DataGrid
            rows={filteredTransactions}
            columns={columns}
            sx={{
              backgroundColor: theme.palette.background.paper,
              color: "#fff",
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.background.paper,
                cursor: "pointer",
              },
              "& .MuiDataGrid-columnHeader": {
                borderColor: "#424242",
                backgroundColor: theme.palette.background.paper,
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: theme.palette.text.primary, // #E0E0E0
                fontWeight: "bold",
                fontSize: { xs: "12px", sm: "14px" },
              },
              "& .MuiDataGrid-columnSeparator": {
                color: "#424242",
              },
              "& .MuiDataGrid-cell": {
                color: theme.palette.text.primary, // #E0E0E0
                fontSize: { xs: "12px", sm: "14px" },
                borderColor: "#424242",
              },
              "& .MuiDataGrid-footerContainer": {
                borderColor: "#424242",
              },
              "& .MuiTablePagination-root": {
                color: theme.palette.text.primary, // #E0E0E0
              },
              "& .MuiDataGrid-root": {
                borderColor: "#424242",
              },
              "& .MuiIconButton-root.Mui-disabled": {
                color: theme.palette.grey2, // #E0E0E0
              },
              "& .MuiIconButton-root": {
                color: theme.palette.white, // #E0E0E0
              },
              "& .MuiSvgIcon-root": {
                color: theme.palette.white,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Transactions;
