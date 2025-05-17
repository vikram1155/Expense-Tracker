import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  CircularProgress,
  IconButton,
  Modal,
  SelectChangeEvent,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import CustomSelect from "../customComponents/CustomSelect";
import CustomTextField from "../customComponents/CustomTextField";
import CustomTypography from "../customComponents/CustomTypography";
import CustomButton from "../customComponents/CustomButton";
import { showSnackbar } from "../redux/snackbarSlice";
import theme from "../theme";
import TransactionFields from "../customComponents/TransactionFields";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  name: string;
  category: string;
  date: string;
  method: string;
  comments: string;
  editTransaction: (id: string) => void;
  deleteTransaction: (id: string, name: string) => void;
}

interface TransactionForm {
  type: string;
  amount: number;
  name: string;
  category: string;
  date: string;
  method: string;
  comments: string;
}

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", width: 150 },
  { field: "amount", headerName: "Amount", width: 100 },
  { field: "category", headerName: "Category", width: 120 },
  { field: "type", headerName: "Type", width: 100 },
  { field: "date", headerName: "Date", width: 120 },
  { field: "method", headerName: "Method", width: 120 },
  { field: "comments", headerName: "Comments", width: 200, flex: 1 },
  {
    field: "actions",
    headerName: "Actions",
    width: 120,
    renderCell: (params) => (
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton
          onClick={() => params.row.editTransaction(params.row.id)}
          sx={{
            color: theme.palette.text.primary,
            "&:hover": { color: theme.palette.primary.main },
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() =>
            params.row.deleteTransaction(params.row.id, params.row.name)
          }
          sx={{
            color: theme.palette.text.primary,
            "&:hover": { color: theme.palette.error.main },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  },
];

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Both");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMethod, setFilterMethod] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [formData, setFormData] = useState<TransactionForm>({
    type: "",
    amount: 0,
    name: "",
    category: "",
    date: "",
    method: "",
    comments: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof TransactionForm, string>>
  >({});

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/transactions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const apiTransactions = response.data.transactions || [];
      const mappedTransactions: Transaction[] = apiTransactions
        .sort(
          (
            a: { date: string | number | Date },
            b: { date: string | number | Date }
          ) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .map((t: any) => ({
          id: t._id,
          type: t.type.charAt(0).toUpperCase() + t.type.slice(1),
          amount: t.amount,
          name: t.name,
          category: t.category,
          date: t.date,
          method: t.method,
          comments: t.comments || "",
          editTransaction,
          deleteTransaction,
        }));
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

  const fetchTransaction = async (id: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/transactions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const t = response.data.transaction;
      setFormData({
        type: t.type.charAt(0).toUpperCase() + t.type.slice(1),
        amount: t.amount,
        name: t.name,
        category: t.category,
        date: t.date.split("T")[0],
        method: t.method,
        comments: t.comments || "",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch transaction";
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
      setOpenModal(false);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string, name: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      dispatch(
        showSnackbar({
          message: `Transaction "${name}" deleted successfully.`,
          severity: "success",
        })
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to delete transaction";
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

  const editTransaction = (id: string) => {
    setSelectedTransactionId(id);
    fetchTransaction(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTransactionId(null);
    setFormData({
      type: "",
      amount: 0,
      name: "",
      category: "",
      date: "",
      method: "",
      comments: "",
    });
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
    if (errors[name as keyof TransactionForm]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
    if (errors[name as keyof TransactionForm]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionForm, string>> = {};
    if (!formData.type || !["Debit", "Credit"].includes(formData.type)) {
      newErrors.type = 'Type must be "Debit" or "Credit"';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.category || !formData.category.trim()) {
      newErrors.category = "Category is required";
    }
    if (!formData.date || !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) {
      newErrors.date = "Date is required (YYYY-MM-DD)";
    }
    if (!formData.method) {
      newErrors.method = "Method is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && selectedTransactionId) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/transactions/${selectedTransactionId}`,
          {
            type: formData.type.toLowerCase() as "debit" | "credit",
            amount: formData.amount,
            name: formData.name,
            category: formData.category.trim(),
            date: formData.date,
            method: formData.method,
            comments: formData.comments ? formData.comments.trim() : undefined,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedTransaction = response.data.transaction;
        setTransactions((prev) =>
          prev.map((t) =>
            t.id === selectedTransactionId
              ? {
                  ...t,
                  type:
                    updatedTransaction.type.charAt(0).toUpperCase() +
                    updatedTransaction.type.slice(1),
                  amount: updatedTransaction.amount,
                  name: updatedTransaction.name,
                  category: updatedTransaction.category,
                  date: updatedTransaction.date,
                  method: updatedTransaction.method,
                  comments: updatedTransaction.comments || "",
                }
              : t
          )
        );

        dispatch(
          showSnackbar({
            message: "Transaction updated successfully",
            severity: "success",
          })
        );
        handleCloseModal();
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to update transaction";
        dispatch(
          showSnackbar({
            message: errorMessage,
            severity: "error",
          })
        );
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [dispatch, navigate]);

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        transaction.amount.toString().includes(searchLower) ||
        transaction.name.toLowerCase().includes(searchLower) ||
        transaction.date.toLowerCase().includes(searchLower) ||
        (transaction.comments?.toLowerCase() || "").includes(searchLower);

      const matchesType =
        filterType === "Both" || transaction.type === filterType;

      const matchesCategory =
        filterCategory === "All" || transaction.category === filterCategory;

      const matchesMethod =
        filterMethod === "All" || transaction.method === filterMethod;

      return matchesSearch && matchesType && matchesCategory && matchesMethod;
    });
    setFilteredTransactions(filtered);
  }, [searchTerm, transactions, filterType, filterCategory, filterMethod]);

  return (
    <Box
      sx={{
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
          width: { xs: "calc(100% - 32px)", md: "calc(100% - 64px)" },
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        <CustomTypography type="heading6" pb={3}>
          Find all your transactions!
        </CustomTypography>
        {loading && !openModal ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
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
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
                <CustomSelect
                  label="Method"
                  name="method"
                  value={filterMethod}
                  onChange={(e) => setFilterMethod(e.target.value as string)}
                  options={["All", "upi", "card", "cash", "net banking"]}
                  disabled={loading}
                />
              </Box>
            </Box>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: 3,
                minHeight:
                  filteredTransactions.length === 0
                    ? 155
                    : filteredTransactions.length * 52 + 112 > 318
                    ? 318
                    : filteredTransactions.length * 52 + 112,
                maxHeight: filteredTransactions.length * 52 + 112,
                height: { xs: "auto", sm: "calc(100vh - 420px)" },
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
                    color: theme.palette.text.primary,
                    fontWeight: "bold",
                    fontSize: { xs: "12px", sm: "14px" },
                  },
                  "& .MuiDataGrid-columnSeparator": {
                    color: "#424242",
                  },
                  "& .MuiDataGrid-cell": {
                    color: theme.palette.text.primary,
                    fontSize: { xs: "12px", sm: "14px" },
                    borderColor: "#424242",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderColor: "#424242",
                  },
                  "& .MuiTablePagination-root": {
                    color: theme.palette.text.primary,
                  },
                  "& .MuiDataGrid-root": {
                    borderColor: "#424242",
                  },
                  "& .MuiIconButton-root.Mui-disabled": {
                    color: theme.palette.grey2,
                  },
                  "& .MuiIconButton-root": {
                    color: theme.palette.white,
                  },
                  "& .MuiSvgIcon-root": {
                    color: theme.palette.white,
                  },
                }}
              />
            </Box>
          </>
        )}

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="edit-transaction-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 600 },
              bgcolor: theme.palette.background.paper,
              borderRadius: "12px",
              boxShadow: 24,
              p: 4,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: theme.palette.primary.main }} />
              </Box>
            ) : (
              <>
                <CustomTypography type="heading6" pb={3}>
                  Edit Transaction
                </CustomTypography>
                <form onSubmit={handleSubmit}>
                  <TransactionFields
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    loading={loading}
                    isEditable={true}
                    handleChange={handleChange}
                    handleSelectChange={handleSelectChange}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 3,
                      justifyContent: "center",
                    }}
                  >
                    <CustomButton
                      text="Cancel"
                      onClick={handleCloseModal}
                      disabled={loading}
                    />
                    <CustomButton
                      type="submit"
                      text="Update Transaction"
                      disabled={loading}
                    />
                  </Box>
                </form>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Transactions;
