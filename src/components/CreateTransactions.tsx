import React, { useState } from "react";
import { Box, SelectChangeEvent, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import CustomButton from "../customComponents/CustomButton";
import CustomTypography from "../customComponents/CustomTypography";
import { showSnackbar } from "../redux/snackbarSlice";
import theme from "../theme";
import TransactionFields from "../customComponents/TransactionFields";

interface TransactionForm {
  type: string;
  amount: number;
  name: string;
  category: string;
  date: string;
  method: string;
  comments: string;
}

const CreateTransactions: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const [loading, setLoading] = useState(false);

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
    if (validateForm()) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await axios.post(
          `${
            import.meta.env.VITE_API_URL
          }/api/transactions`,
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
        if (response) {
          dispatch(
            showSnackbar({
              message: "Transaction created successfully",
              severity: "success",
            })
          );

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
          navigate("/all-transactions");
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to create transaction";
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

  const handleReset = () => {
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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: { xs: 2, sm: 3, md: 4 },
        mb: 5,
        position: "relative",
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: "12px",
          px: { xs: 2, sm: 2, md: 4 },
          py: { xs: 1, sm: 2, md: 4 },
          width: "100%",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "12px",
              zIndex: 1,
            }}
          >
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
          </Box>
        )}

        <CustomTypography type="heading6" pb={3}>
          Add your transactions - income, expense and more!
        </CustomTypography>

        <form onSubmit={handleSubmit}>
          <TransactionFields
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            loading={loading}
            isEditable={false}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
          />
          <Box
            sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "center" }}
          >
            <CustomButton
              text="Reset Values"
              onClick={handleReset}
              disabled={loading}
            />
            <CustomButton
              type="submit"
              text="Add Transaction"
              disabled={loading}
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CreateTransactions;
