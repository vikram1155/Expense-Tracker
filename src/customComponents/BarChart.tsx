import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { BarChart as MuiBarChart } from "@mui/x-charts";
import CustomTypography from "../customComponents/CustomTypography";
import CustomSelect from "../customComponents/CustomSelect";
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

interface BarChartProps {
  transactions: Transaction[];
  filter: {
    yearSelected: string;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      yearSelected: string;
    }>
  >;
  yearOptions: string[];
}

const BarChart: React.FC<BarChartProps> = ({
  transactions,
  filter,
  setFilter,
  yearOptions,
}) => {
  const [barData, setBarData] = useState<{
    xAxis: { data: string[]; scaleType: "band" }[];
    series: { label: string; data: number[]; color: string; stack: string }[];
  }>({
    xAxis: [
      {
        data: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        scaleType: "band",
      },
    ],
    series: [],
  });

  // Calculate Bar Chart data
  useEffect(() => {
    const months = Array.from(
      { length: 12 },
      (_, i) => `${filter.yearSelected}-${(i + 1).toString().padStart(2, "0")}`
    );
    const categories = [...new Set(transactions.map((t) => t.category))].sort();
    const series = [
      ...categories.map((cat, idx) => ({
        label: cat,
        data: months.map((month) =>
          transactions
            .filter(
              (t) =>
                t.date.startsWith(month) &&
                t.type === "Debit" &&
                t.category === cat
            )
            .reduce((sum, t) => sum + t.amount, 0)
        ),
        color: [
          theme.palette.debit.main,
          theme.palette.primary.main,
          theme.palette.warning.main,
          theme.palette.secondary.main,
          theme.palette.error.main,
          theme.palette.info.main,
          theme.palette.success.main,
          theme.palette.primary.dark,
          theme.palette.warning.dark,
          theme.palette.secondary.dark,
        ][idx % 10],
        stack: "expenses",
      })),
      {
        label: "Income",
        data: months.map((month) =>
          transactions
            .filter((t) => t.date.startsWith(month) && t.type === "Credit")
            .reduce((sum, t) => sum + t.amount, 0)
        ),
        color: theme.palette.credit.main, 
        stack: "income",
      },
    ].filter((s) => s.data.some((d) => d !== 0));

    setBarData({
      xAxis: [
        {
          data: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          scaleType: "band",
        },
      ],
      series,
    });
  }, [transactions, filter.yearSelected]);

  return (
    <Box mb={10}>
      <CustomTypography
        type="heading6"
        sx={{ mb: 4, color: theme.palette.text.primary, textAlign: "center" }}
      >
        Monthly Expenses and Income
      </CustomTypography>
      <Box maxWidth={180} mb={4} mx="auto">
        <CustomSelect
          name="graph3Year"
          label="Year"
          value={filter.yearSelected}
          onChange={(e) =>
            setFilter({
              yearSelected: e.target.value as string,
            })
          }
          options={yearOptions}
        />
      </Box>
      <Box sx={{ height: { xs: 400, sm: 450 }, minWidth: 0 }}>
        <MuiBarChart
          {...barData}
          sx={{
            "& .MuiChartsAxis-tickLabel": {
              fill: theme.palette.text.primary,
            },
            "& .MuiChartsAxis-label": {
              fill: theme.palette.text.primary,
            },
          }}
          yAxis={[
            {
              label: "Amount (Rs.)",
              labelStyle: { fill: theme.palette.text.primary },
              valueFormatter: (value: number) =>
                `Rs. ${Math.abs(value).toFixed(0)}`,
              width: 90,
            },
          ]}
          height={450}
          margin={{ bottom: 80 }}
        />
      </Box>
    </Box>
  );
};

export default BarChart;
