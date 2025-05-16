import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { LineChart as MuiLineChart } from "@mui/x-charts";
import CustomTypography from "../customComponents/CustomTypography";
import CustomSelect from "../customComponents/CustomSelect";
import theme from "../theme";
import { monthToValueLine, valueToMonthLine } from "../assets/data";

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

interface LineChartProps {
  transactions: Transaction[];
  filter: {
    yearSelected: string;
    monthSelected: string;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      yearSelected: string;
      monthSelected: string;
    }>
  >;
  yearOptions: string[];
  monthOptions: string[];
  monthToValue: (month: string) => string;
  valueToMonth: (value: string) => string;
}

const LineChart: React.FC<LineChartProps> = ({
  transactions,
  filter,
  setFilter,
  yearOptions,
  monthOptions,
}) => {
  const [lineData, setLineData] = useState<{
    xAxis: { data: string[]; scaleType: "band" }[];
    series: {
      label: string;
      data: number[];
      color: string;
      curve: string;
      lineStyle?: { strokeDasharray: string };
    }[];
  }>({
    xAxis: [{ data: [], scaleType: "band" }],
    series: [
      {
        label: "",
        data: [],
        color: theme.palette.primary.main,
        curve: "natural",
      },
      {
        label: "Year's Average",
        data: [],
        color: theme.palette.secondary.main,
        curve: "natural",
        lineStyle: { strokeDasharray: "5 5" },
      },
    ],
  });

  // Line Chart data
  useEffect(() => {
    const validTransactions =
      transactions?.filter(
        (t) => t && t.date && t.type && typeof t.amount === "number"
      ) || [];

    const selectedDate = `${
      filter.yearSelected
    }-${filter.monthSelected.padStart(2, "0")}`;
    const monthSpending = validTransactions.filter(
      (t) => t.date.startsWith(selectedDate) && t.type === "Debit"
    );

    const categories = [
      ...new Set(
        validTransactions
          .filter((t) => t.category !== "Income" && t.type === "Debit")
          .map((t) => t.category)
      ),
    ].sort();

    const monthTotal = categories.map((cat) =>
      monthSpending
        .filter((t) => t.category === cat)
        .reduce((sum, t) => sum + t.amount, 0)
    );

    const monthsInYear =
      validTransactions
        .filter((t) => t.date.startsWith(filter.yearSelected))
        .map((t) => t.date.slice(0, 7))
        .filter((value, index, self) => self.indexOf(value) === index).length ||
      12;

    const yearlyAvg = categories.map((cat) => {
      const catTxns = validTransactions.filter(
        (t) =>
          t.date.startsWith(filter.yearSelected) &&
          t.category === cat &&
          t.type === "Debit"
      );
      return catTxns.length
        ? catTxns.reduce((sum, t) => sum + t.amount, 0) / monthsInYear
        : 0;
    });

    const monthName = valueToMonthLine(filter.monthSelected);
    setLineData({
      xAxis: [{ data: categories, scaleType: "band" }],
      series: [
        {
          label: `${monthName} ${filter.yearSelected} Spending`,
          data: monthTotal,
          color: theme.palette.warning.main,
          curve: "natural",
        },
        {
          label: "Year's Average",
          data: yearlyAvg,
          color: theme.palette.error.main,
          curve: "natural",
          lineStyle: { strokeDasharray: "5 5" },
        },
      ],
    });
  }, [
    transactions,
    filter.yearSelected,
    filter.monthSelected,
    valueToMonthLine,
  ]);

  return (
    <Box mb={6}>
      <CustomTypography
        type="heading6"
        sx={{ mb: 4, color: theme.palette.text.primary, textAlign: "center" }}
      >
        Monthly Expenses vs Yearly Average
      </CustomTypography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          mb: 4,
          maxWidth: 400,
          mx: "auto",
        }}
      >
        <CustomSelect
          name="graph2Year"
          label="Year"
          value={filter.yearSelected}
          onChange={(e) =>
            setFilter({
              ...filter,
              yearSelected: e.target.value as string,
              monthSelected: "01",
            })
          }
          options={yearOptions}
        />
        <CustomSelect
          name="graph2Month"
          label="Month"
          value={valueToMonthLine(filter.monthSelected)}
          onChange={(e) =>
            setFilter({
              ...filter,
              monthSelected: monthToValueLine(e.target.value as string),
            })
          }
          options={monthOptions}
        />
      </Box>
      <Box sx={{ height: { xs: 300, sm: 350 }, minWidth: 0 }}>
        <MuiLineChart
          {...lineData}
          slotProps={{
            legend: {
              labelStyle: { fill: theme.palette.text.primary, fontSize: 12 },
            },
          }}
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
            },
          ]}
          height={400}
          margin={{ bottom: 80 }}
        />
      </Box>
    </Box>
  );
};

export default LineChart;
