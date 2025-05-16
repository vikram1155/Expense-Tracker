import React, { useState, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { PieChart as MuiPieChart } from "@mui/x-charts";
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

interface PieChartProps {
  transactions: Transaction[];
  filter: {
    yearSelected: string;
    monthSelected: string;
    categorySelected: string;
    typeSelected: string;
    methodSelected: string;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      yearSelected: string;
      monthSelected: string;
      categorySelected: string;
      typeSelected: string;
      methodSelected: string;
    }>
  >;
  yearOptions: string[];
  monthOptions: string[];
  categoryOptions: string[];
  typeOptions: string[];
  methodOptions: string[];
  monthToValue: (month: string, year: string) => string;
  valueToMonth: (value: string) => string;
}

const PieChart: React.FC<PieChartProps> = ({
  transactions,
  filter,
  setFilter,
  yearOptions,
  monthOptions,
  categoryOptions,
  typeOptions,
  methodOptions,
  monthToValue,
  valueToMonth,
}) => {
  const [pieData, setPieData] = useState<
    { id: number; value: number; label: string; color: string }[]
  >([]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const dateYear = t.date.split("-")[0];
      const datePrefix =
        filter.monthSelected === "All"
          ? filter.yearSelected
          : `${filter.yearSelected}-${filter.monthSelected}`;
      return (
        t.date.startsWith(datePrefix) &&
        (filter.categorySelected === "All" ||
          t.category === filter.categorySelected) &&
        (filter.typeSelected === "All" || t.type === filter.typeSelected) &&
        (filter.methodSelected === "All" || t.method === filter.methodSelected)
      );
    });
  }, [
    transactions,
    filter.yearSelected,
    filter.monthSelected,
    filter.categorySelected,
    filter.typeSelected,
    filter.methodSelected,
  ]);

  // Pie Chart data
  useEffect(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "Credit")
      .reduce((sum, t) => sum + t.amount, 0);
    const expensesByCategory = filteredTransactions
      .filter((t) => t.type === "Debit")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    const data = [
      {
        id: 0,
        value: income,
        label: "Income",
        color: theme.palette.credit.main,
      },
      ...Object.entries(expensesByCategory).map(([cat, value], idx) => ({
        id: idx + 1,
        value,
        label: cat,
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
      })),
    ].filter((d) => d.value > 0);

    setPieData(data);
  }, [filteredTransactions]);

  return (
    <Box>
      <CustomTypography
        type="heading6"
        sx={{ mb: 4, color: theme.palette.text.primary, textAlign: "center" }}
      >
        Income vs Expenses
      </CustomTypography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "200px auto" },
          alignItems: "start",
          gap: 2,
          mb: 4,
        }}
      >
        {/* Filters */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "1fr",
            },
            gap: 2,
          }}
        >
          <Box>
            <CustomSelect
              name="graph1Year"
              label="Year"
              value={filter.yearSelected}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  yearSelected: e.target.value as string,
                  monthSelected: "All",
                })
              }
              options={yearOptions}
            />
          </Box>
          <Box>
            <CustomSelect
              name="graph1Month"
              label="Month"
              value={valueToMonth(filter.monthSelected)}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  monthSelected: monthToValue(
                    e.target.value as string,
                    filter.yearSelected
                  ),
                })
              }
              options={monthOptions}
            />
          </Box>
          <Box>
            <CustomSelect
              name="graph1Category"
              label="Category"
              value={filter.categorySelected}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  categorySelected: e.target.value as string,
                })
              }
              options={categoryOptions}
            />
          </Box>
          <Box>
            <CustomSelect
              name="graph1Type"
              label="Type"
              value={filter.typeSelected}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  typeSelected: e.target.value as string,
                })
              }
              options={typeOptions}
            />
          </Box>
          <Box>
            <CustomSelect
              name="graph1Method"
              label="Method"
              value={filter.methodSelected}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  methodSelected: e.target.value as string,
                })
              }
              options={methodOptions}
            />
          </Box>
        </Box>
        {/* Pie Chart */}
        <Box sx={{ height: { xs: 300, sm: 350 }, minWidth: 0 }}>
          <MuiPieChart
            series={[
              {
                data: pieData,
                innerRadius: 20,
                outerRadius: 120,
                paddingAngle: 3,
                cornerRadius: 5,
              },
            ]}
            slotProps={{
              legend: {
                labelStyle: { fill: theme.palette.text.primary, fontSize: 12 },
              },
            }}
            sx={{
              "& .MuiChartsAxis-tickLabel": {
                fill: theme.palette.text.primary,
              },
            }}
            height={350}
            margin={{ bottom: 80 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default PieChart;
