import React from "react";
import { Box, SelectChangeEvent } from "@mui/material";
import CustomSelect from "../customComponents/CustomSelect";
import CustomTextField from "../customComponents/CustomTextField";
import theme from "../theme";

interface TransactionForm {
  type: string;
  amount: number;
  name: string;
  category: string;
  date: string;
  method: string;
  comments: string;
}

interface TransactionFieldsProps {
  formData: TransactionForm;
  setFormData: React.Dispatch<React.SetStateAction<TransactionForm>>;
  errors: Partial<Record<keyof TransactionForm, string>>;
  loading: boolean;
  isEditable: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (e: SelectChangeEvent<string>, name: string) => void;
}

const TransactionFields: React.FC<TransactionFieldsProps> = ({
  formData,
  setFormData,
  errors,
  loading,
  isEditable,
  handleChange,
  handleSelectChange,
}) => {
  return (
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
          disabled={loading}
          error={!!errors.name}
          helperText={errors.name}
        />
      </Box>
      <Box>
        <Box mt={2} />
        <CustomSelect
          label="Type"
          name="type"
          value={formData.type}
          onChange={(e, name) => handleSelectChange(e, name)}
          options={["Credit", "Debit"]}
          disabled={loading}
          error={!!errors.type}
          helperText={errors.type}
        />
      </Box>
      <Box>
        <CustomTextField
          label="Amount"
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount > 0 ? String(formData.amount) : ""}
          onChange={handleChange}
          disabled={loading}
          error={!!errors.amount}
          helperText={errors.amount}
        />
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
            "Income",
            "Miscellaneous",
          ]}
          disabled={loading}
          error={!!errors.category}
          helperText={errors.category}
        />
      </Box>
      <Box>
        <CustomTextField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          disabled={loading}
          error={!!errors.date}
          helperText={errors.date}
        />
      </Box>
      <Box>
        <Box mt={2} />
        <CustomSelect
          label="Method"
          name="method"
          value={formData.method}
          onChange={(e, name) => handleSelectChange(e, name)}
          options={["upi", "card", "cash", "net banking"]}
          disabled={loading}
          error={!!errors.method}
          helperText={errors.method}
        />
      </Box>
      <Box sx={{ gridColumn: { xs: "1", sm: "1 / 3" } }}>
        <CustomTextField
          label="Comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          multiline
          rows={3}
          disabled={loading}
          error={!!errors.comments}
          helperText={errors.comments}
        />
      </Box>
    </Box>
  );
};

export default TransactionFields;
