import React, { useState } from "react";
import { Box, SelectChangeEvent, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import CustomSelect from "../customComponents/CustomSelect";
import CustomTextField from "../customComponents/CustomTextField";
import { useNavigate } from "react-router-dom";
import theme from "../theme";
import CustomButton from "../customComponents/CustomButton";
import CustomTypography from "../customComponents/CustomTypography";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log("a-e.target", e.target);

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
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    if (errors[name as keyof TransactionForm]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionForm, string>> = {};
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.method) newErrors.method = "Method is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const transaction = {
        id: uuidv4(),
        ...formData,
      };
      console.log("Submitted Transaction:", transaction);
      setTimeout(() => {
        navigate("/all-transactions");
      }, 3000);
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
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: { xs: 2, sm: 3, md: 4 },
        mb: 5,
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
        }}
      >
        <CustomTypography type="heading6" pb={3}>
          Add your transactions - income, expense and more!
        </CustomTypography>

        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              columnGap: 2,
            }}
          >
            <Box>
              <CustomTextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <Typography color="error" sx={{ fontSize: "12px" }}>
                  {errors.name}
                </Typography>
              )}
            </Box>
            <Box>
              <Box mt={2} />
              <CustomSelect
                label="Type"
                name="type"
                value={formData.type}
                onChange={(e, name) => handleSelectChange(e, name)}
                options={["Credit", "Debit"]}
              />
              {errors.type && (
                <Typography color="error" sx={{ fontSize: "12px" }}>
                  {errors.type}
                </Typography>
              )}
            </Box>
            <Box>
              <CustomTextField
                label="Amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount > 0 ? String(formData.amount) : ""}
                onChange={handleChange}
              />
              {errors.amount && (
                <Typography color="error" sx={{ fontSize: "12px" }}>
                  {errors.amount}
                </Typography>
              )}
            </Box>
            <Box>
              <Box mt={2} />
              <CustomSelect
                label="Category"
                name="category"
                value={formData.category}
                onChange={(e, name) => handleSelectChange(e, name)}
                options={[
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
              {errors.category && (
                <Typography color="error" sx={{ fontSize: "12px" }}>
                  {errors.category}
                </Typography>
              )}
            </Box>
            <Box>
              <CustomTextField
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              {errors.date && (
                <Typography color="error" sx={{ fontSize: "12px" }}>
                  {errors.date}
                </Typography>
              )}
            </Box>
            <Box>
              <Box mt={2} />
              <CustomSelect
                label="Method"
                name="method"
                value={formData.method}
                onChange={(e, name) => handleSelectChange(e, name)}
                options={["UPI", "Card", "Cash", "Net Banking"]}
              />

              {errors.method && (
                <Typography color="error" sx={{ fontSize: "12px" }}>
                  {errors.method}
                </Typography>
              )}
            </Box>
          </Box>

          <Box>
            <CustomTextField
              label="Comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Box>

          <Box
            sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "center" }}
          >
            <CustomButton text="Reset Values" onClick={handleReset} />
            <CustomButton
              type="submit"
              text="Add Transaction"
              onClick={() => navigate("/create-transaction")}
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CreateTransactions;
