import React, { useMemo } from "react";
import { Box } from "@mui/material";
import CustomTypography from "../customComponents/CustomTypography";
import theme from "../theme";

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

interface ReportsProps {
  transactions: Transaction[];
  filter: {
    yearSelected: string;
    monthSelected: string;
  };
  valueToMonth: (value: string) => string;
}

const Reports: React.FC<ReportsProps> = ({
  transactions,
  filter,
  valueToMonth,
}) => {
  const reports = useMemo(() => {
    const validTransactions =
      transactions?.filter(
        (t) => t && t.date && t.type && typeof t.amount === "number"
      ) || [];

    const selectedDate = `${
      filter.yearSelected
    }-${filter.monthSelected.padStart(2, "0")}`;

    const monthDebit = validTransactions
      .filter((t) => t.date.startsWith(selectedDate) && t.type === "Debit")
      .reduce((sum, t) => sum + t.amount, 0);
    const monthCredit = validTransactions
      .filter((t) => t.date.startsWith(selectedDate) && t.type === "Credit")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthsInYear = [
      ...new Set(
        validTransactions
          .filter((t) => t.date.startsWith(filter.yearSelected))
          .map((t) => t.date.slice(0, 7))
      ),
    ];
    const yearDebitTotal = validTransactions
      .filter(
        (t) => t.date.startsWith(filter.yearSelected) && t.type === "Debit"
      )
      .reduce((sum, t) => sum + t.amount, 0);
    const yearDebitAvg =
      monthsInYear.length > 0 ? yearDebitTotal / monthsInYear.length : 0;

    const debitInsight = {
      text:
        monthDebit === 0
          ? "You haven’t spent anything this month, maximizing your savings!"
          : monthDebit > yearDebitAvg
          ? `This month, your spending of Rs. ${monthDebit.toFixed(
              2
            )} exceeded your yearly average of Rs. ${yearDebitAvg.toFixed(
              2
            )}. Consider reviewing your expenses to boost your savings.`
          : `Wonderful! Your spending this month of Rs. ${monthDebit.toFixed(
              2
            )} was below your yearly average of Rs. ${yearDebitAvg.toFixed(
              2
            )}, helping you save more.`,
      color:
        monthDebit > yearDebitAvg
          ? theme.palette.debit.main
          : theme.palette.credit.main,
    };

    const savingsPercent =
      monthCredit > 0 ? ((monthCredit - monthDebit) / monthCredit) * 100 : 0;
    const savingsInsight = {
      text:
        savingsPercent > 70
          ? `Congratulations! You’ve saved over 70% of your income this month!`
          : savingsPercent > 50
          ? `Great job! You’ve saved more than 50% of your income this month.`
          : `This month, your spending was higher. Consider saving a bit more next time to boost your financial goals.`,
      color:
        savingsPercent > 50
          ? theme.palette.credit.main
          : theme.palette.debit.main,
    };

    return [debitInsight, savingsInsight];
  }, [transactions, filter.yearSelected, filter.monthSelected, valueToMonth]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <CustomTypography
        type="heading6"
        sx={{ mb: 3, color: theme.palette.text.primary, textAlign: "center" }}
      >
        Financial Insights
      </CustomTypography>
      {reports.map((report, idx) => (
        <CustomTypography
          key={idx}
          type="body"
          sx={{ mb: 2, color: report.color, textAlign: "center" }}
        >
          {report.text}
        </CustomTypography>
      ))}
    </Box>
  );
};

export default Reports;
