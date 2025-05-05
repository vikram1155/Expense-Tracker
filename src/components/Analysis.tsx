import React, { useState, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { PieChart, LineChart, BarChart } from "@mui/x-charts";
import CustomTypography from "../customComponents/CustomTypography";
import CustomSelect from "../customComponents/CustomSelect";
import theme from "../theme";
import {
  categoryOptions,
  methodOptions,
  monthOptions,
  monthOptionsLine,
  monthToValue,
  monthToValueLine,
  transactions,
  typeOptions,
  valueToMonth,
  valueToMonthLine,
  yearOptions,
} from "../assets/data";

const Analysis: React.FC = () => {
  // graph 1 pie
  const [graph1Filter, setGraph1Filter] = useState<{
    yearSelected: string;
    monthSelected: string;
    categorySelected: string;
    typeSelected: string;
    methodSelected: string;
  }>({
    yearSelected: "2025",
    monthSelected: "All",
    categorySelected: "All",
    typeSelected: "All",
    methodSelected: "All",
  });

  // graph 2 line
  const [graph2Filter, setGraph2Filter] = useState<{
    yearSelected: string;
    monthSelected: string;
  }>({
    yearSelected: "2025",
    monthSelected: "05", // Maps to "May"
  });

  // graph 3 bar
  const [graph3Filter, setGraph3Filter] = useState<{
    yearSelected: string;
  }>({
    yearSelected: "2025",
  });
  console.log("a-graph1Filter", graph1Filter);
  console.log("a-graph2Filter", graph2Filter);
  console.log("a-graph3Filter", graph3Filter);

  const [pieData, setPieData] = useState<
    { id: number; value: number; label: string; color: string }[]
  >([]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const dateYear = t.date.split("-")[0];
      const datePrefix =
        graph1Filter.monthSelected === "All"
          ? graph1Filter.yearSelected
          : `${graph1Filter.yearSelected}-${graph1Filter.monthSelected}`;
      return (
        t.date.startsWith(datePrefix) &&
        (graph1Filter.categorySelected === "All" ||
          t.category === graph1Filter.categorySelected) &&
        (graph1Filter.typeSelected === "All" ||
          t.type === graph1Filter.typeSelected) &&
        (graph1Filter.methodSelected === "All" ||
          t.method === graph1Filter.methodSelected)
      );
    });
  }, [
    graph1Filter.yearSelected,
    graph1Filter.monthSelected,
    graph1Filter.categorySelected,
    graph1Filter.typeSelected,
    graph1Filter.methodSelected,
  ]);

  // Pie Chart: Income vs Expenses
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
        color: theme.palette.debit.main, 
      },
      ...Object.entries(expensesByCategory).map(([cat, value], idx) => ({
        id: idx + 1,
        value,
        label: cat,
        color: [
          theme.palette.credit.main, 
          "#2196F3", // Blue
          "#FFC107", // Amber
          "#9C27B0", // Purple
          "#FF5722", // Deep Orange
          "#00BCD4", // Cyan
          "#E91E63", // Pink
          "#4CAF50", // Green
          "#FF9800", // Orange
          "#673AB7", // Deep Purple
        ][idx % 10],
      })),
    ].filter((d) => d.value > 0);

    setPieData(data);
  }, [filteredTransactions]);

  // Line Chart: May 2025 Spending vs Year's Average by Category
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
        color: theme.palette.credit.main,
        curve: "natural",
        lineStyle: { strokeDasharray: "5 5" },
      },
    ],
  });

  useEffect(() => {
    const monthSpending = transactions.filter(
      (t) =>
        t.date.startsWith(
          `${graph2Filter.yearSelected}-${graph2Filter.monthSelected}`
        ) && t.type === "Debit"
    );
    const categories = [...new Set(transactions.map((t) => t.category))];
    const monthTotal = categories.map((cat) =>
      monthSpending
        .filter((t) => t.category === cat)
        .reduce((sum, t) => sum + t.amount, 0)
    );
    const yearlyAvg = categories.map((cat) => {
      const catTxns = transactions.filter(
        (t) =>
          t.date.startsWith(graph2Filter.yearSelected) &&
          t.category === cat &&
          t.type === "Debit"
      );
      return catTxns.length
        ? catTxns.reduce((sum, t) => sum + t.amount, 0) / 12
        : 0; // 12 months
    });

    const monthName = valueToMonth(graph2Filter.monthSelected);
    setLineData({
      xAxis: [{ data: categories, scaleType: "band" }],
      series: [
        {
          label: `${monthName} ${graph2Filter.yearSelected} Spending`,
          data: monthTotal,
          color: theme.palette.primary.main,
          curve: "natural",
        },
        {
          label: "Year's Average",
          data: yearlyAvg,
          color: theme.palette.credit.main, // #F44336
          curve: "natural",
          lineStyle: { strokeDasharray: "5 5" },
        },
      ],
    });
  }, [graph2Filter]);

  // Stacked Bar Chart: Spending by Category and Income by Month
  const [barData, setBarData] = useState<{
    xAxis: { data: string[]; scaleType: "band" }[];
    series: { label: string; data: number[]; color: string; stack: string }[];
  }>({
    xAxis: [{ data: [], scaleType: "band" }],
    series: [],
  });

  useEffect(() => {
    const months = Array.from(
      { length: 12 },
      (_, i) =>
        `${graph3Filter.yearSelected}-${(i + 1).toString().padStart(2, "0")}`
    ); 
    const categories = [...new Set(transactions.map((t) => t.category))];
    const series = [
      ...categories.map((cat, idx) => ({
        label: cat,
        data: months.map(
          (month) =>
            -transactions
              .filter(
                (t) =>
                  t.date.startsWith(month) &&
                  t.type === "Debit" &&
                  t.category === cat
              )
              .reduce((sum, t) => sum + t.amount, 0)
        ),
        color: [
          theme.palette.credit.main, // #F44336
          "#2196F3",
          "#FFC107",
          "#9C27B0",
          "#FF5722",
          "#00BCD4",
          "#E91E63",
          "#4CAF50",
          "#FF9800",
          "#673AB7",
          theme.palette.debit.main, // #4CAF50
        ][idx % 11],
        stack: "expenses",
      })),
      {
        label: "Income",
        data: months.map((month) =>
          transactions
            .filter((t) => t.date.startsWith(month) && t.type === "Credit")
            .reduce((sum, t) => sum + t.amount, 0)
        ),
        color: theme.palette.debit.main, // #4CAF50
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
  }, [graph3Filter]);

  // Analytical Reports
  const reports = useMemo(() => {
    const may2025Debit = transactions
      .filter((t) => t.date.startsWith("2025-05") && t.type === "Debit")
      .reduce((sum, t) => sum + t.amount, 0);
    const may2025Credit = transactions
      .filter((t) => t.date.startsWith("2025-05") && t.type === "Credit")
      .reduce((sum, t) => sum + t.amount, 0);
    const otherMonthsDebit =
      transactions
        .filter((t) => !t.date.startsWith("2025-05") && t.type === "Debit")
        .reduce((sum, t) => sum + t.amount, 0) / 4; // 4 months (Jan-Apr)
    const topCategory = [...new Set(transactions.map((t) => t.category))]
      .map((cat) => ({
        category: cat,
        may: transactions
          .filter(
            (t) =>
              t.date.startsWith("2025-05") &&
              t.type === "Debit" &&
              t.category === cat
          )
          .reduce((sum, t) => sum + t.amount, 0),
        other:
          transactions
            .filter(
              (t) =>
                !t.date.startsWith("2025-05") &&
                t.type === "Debit" &&
                t.category === cat
            )
            .reduce((sum, t) => sum + t.amount, 0) / 4,
      }))
      .sort((a, b) => b.may - a.may)[0];

    return [
      {
        text:
          topCategory.may > topCategory.other
            ? `You spent more this month on ${topCategory.category} ($${
                topCategory.may
              }) compared to your average of $${topCategory.other.toFixed(2)}.`
            : `You spent less this month on ${topCategory.category} ($${
                topCategory.may
              }) compared to your average of $${topCategory.other.toFixed(2)}.`,
        color:
          topCategory.may > topCategory.other
            ? theme.palette.credit.main
            : theme.palette.debit.main,
      },
      {
        text:
          may2025Debit > 0.5 * may2025Credit
            ? `Your expense ($${may2025Debit}) is above 50% of your income ($${may2025Credit}) this month, try to reduce it.`
            : `Your expense ($${may2025Debit}) is below 50% of your income ($${may2025Credit}) this month, well done!`,
        color:
          may2025Debit > 0.5 * may2025Credit
            ? theme.palette.credit.main
            : theme.palette.debit.main,
      },
      {
        text:
          may2025Debit > otherMonthsDebit
            ? `Your total spending this month ($${may2025Debit}) is higher than your yearly average of $${otherMonthsDebit.toFixed(
                2
              )}.`
            : `You spent less this month ($${may2025Debit}), congrats! Your yearly average is $${otherMonthsDebit.toFixed(
                2
              )}.`,
        color:
          may2025Debit > otherMonthsDebit
            ? theme.palette.credit.main
            : theme.palette.debit.main,
      },
    ];
  }, []);

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
        <Box textAlign={"center"} mb={4}>
          <CustomTypography type="heading6" pb={3}>
            Explore your income, expenses and see where your money flows!
          </CustomTypography>

          <CustomTypography type="body" pb={3}>
            Dive into your finances with dynamic data visualizations!<br></br>
            The Pie chart slices your spending by category, the Line chart
            tracks how your monthly expenses stack up against the year’s
            average, and the Bar chart showcases income versus spending each
            month.<br></br>Analyze, optimize, and grow your savings effortlessly
            based on the insights of your cash flow!
          </CustomTypography>
        </Box>

        {/* Graphs */}
        <Box>
          {/* Graph 1 */}
          <CustomTypography
            type="heading6"
            sx={{ mb: 4, color: theme.palette.white, textAlign: "center" }}
          >
            Income vs Expenses
          </CustomTypography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "160px auto" },
              alignItems: "center",
            }}
          >
            {/* Filters */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "1fr",
                },
                gap: 2,
              }}
            >
              <Box maxWidth={160}>
                <CustomSelect
                  name="graph1Year"
                  label="Select Year"
                  value={graph1Filter.yearSelected || "2025"}
                  onChange={(e) =>
                    setGraph1Filter({
                      ...graph1Filter,
                      yearSelected: e.target.value as string,
                    })
                  }
                  options={yearOptions.sort((a, b) => Number(b) - Number(a))}
                />
              </Box>
              <Box maxWidth={160}>
                <CustomSelect
                  name="graph1Month"
                  label="Select Month"
                  value={valueToMonth(graph1Filter.monthSelected)}
                  onChange={(e) =>
                    setGraph1Filter({
                      ...graph1Filter,
                      monthSelected: monthToValue(
                        e.target.value as string,
                        graph1Filter.yearSelected
                      ),
                    })
                  }
                  options={monthOptions}
                />
              </Box>
              <Box maxWidth={160}>
                <CustomSelect
                  name="graph1Category"
                  label="Select Category"
                  value={graph1Filter.categorySelected}
                  onChange={(e) =>
                    setGraph1Filter({
                      ...graph1Filter,
                      categorySelected: e.target.value as string,
                    })
                  }
                  options={categoryOptions}
                />
              </Box>
              <Box maxWidth={160}>
                <CustomSelect
                  name="graph1Type"
                  label="Select Type"
                  value={graph1Filter.typeSelected}
                  onChange={(e) =>
                    setGraph1Filter({
                      ...graph1Filter,
                      typeSelected: e.target.value as string,
                    })
                  }
                  options={typeOptions}
                />
              </Box>
              <Box maxWidth={160}>
                <CustomSelect
                  name="graph1Method"
                  label="Select Method"
                  value={graph1Filter.methodSelected}
                  onChange={(e) =>
                    setGraph1Filter({
                      ...graph1Filter,
                      methodSelected: e.target.value as string,
                    })
                  }
                  options={methodOptions}
                />
              </Box>
            </Box>
            {/* Graph - Pie */}
            <Box>
              <Box sx={{ height: 300 }}>
                <PieChart
                  series={[
                    {
                      data: pieData,
                      innerRadius: 10,
                      outerRadius: 100,
                      paddingAngle: 2,
                      cornerRadius: 5,
                    },
                  ]}
                  slotProps={{
                    legend: { labelStyle: { fill: theme.palette.white } },
                  }}
                  sx={{
                    "& .MuiChartsAxis-tickLabel": {
                      fill: theme.palette.white,
                    },
                  }}
                  height={300}
                />
              </Box>
            </Box>
          </Box>

          <hr
            style={{
              height: "0.5px",
              borderColor: theme.palette.grey3,
              backgroundColor: theme.palette.grey3,
              borderRadius: "100px",
              width: "90%",
              margin: "60px auto",
            }}
          />

          {/* Graph 2 */}
          <Box mb={6}>
            <Box>
              <CustomTypography
                type="heading6"
                sx={{ mb: 4, color: theme.palette.white, textAlign: "center" }}
              >
                Monthly expenses vs Yearly Average
              </CustomTypography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                  mb: 2,
                  maxWidth: 300,
                }}
              >
                <CustomSelect
                  name="graph2Year"
                  label="Select Year"
                  value={graph2Filter.yearSelected}
                  onChange={(e) =>
                    setGraph2Filter({
                      ...graph2Filter,
                      yearSelected: e.target.value as string,
                    })
                  }
                  options={yearOptions}
                />
                <CustomSelect
                  name="graph2Month"
                  label="Select Month"
                  value={valueToMonthLine(graph2Filter.monthSelected)}
                  onChange={(e) =>
                    setGraph2Filter({
                      ...graph2Filter,
                      monthSelected: monthToValueLine(e.target.value as string),
                    })
                  }
                  options={monthOptionsLine}
                />
              </Box>
              <Box sx={{ height: 300 }}>
                <LineChart
                  {...lineData}
                  slotProps={{
                    legend: { labelStyle: { fill: theme.palette.white } },
                  }}
                  sx={{
                    "& .MuiChartsAxis-tickLabel": {
                      fill: theme.palette.white,
                    },
                  }}
                  height={300}
                />
              </Box>
            </Box>
          </Box>

          <hr
            style={{
              height: "0.5px",
              borderColor: theme.palette.grey3,
              backgroundColor: theme.palette.grey3,
              borderRadius: "100px",
              width: "90%",
              margin: "60px auto",
            }}
          />

          {/* Graph 3 */}
          <Box mb={10}>
            <Box>
              <CustomTypography
                type="heading6"
                sx={{ mb: 4, color: theme.palette.white, textAlign: "center" }}
              >
                Monthly Expenses and Income for every year
              </CustomTypography>

              <Box maxWidth={160} mb={4}>
                <CustomSelect
                  name="graph3Year"
                  label="Select Year"
                  value={graph3Filter.yearSelected}
                  onChange={(e) =>
                    setGraph3Filter({
                      yearSelected: e.target.value as string,
                    })
                  }
                  options={yearOptions}
                />
              </Box>
              <Box sx={{ height: 400 }}>
                <BarChart
                  {...barData}
                  // slotProps={{
                  //   legend: { labelStyle: { fill: theme.palette.white } },
                  // }}
                  sx={{
                    "& .MuiChartsAxis-tickLabel": {
                      fill: theme.palette.white,
                    },
                  }}
                  height={400}
                  yAxis={[
                    {
                      width: 90,
                      label: "Amount ($)",
                      labelStyle: { fill: theme.palette.white },
                    },
                  ]}
                  // yAxis={[{ width: 120, max: 10000 }]}
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <hr
          style={{
            height: "0.5px",

            borderColor: theme.palette.grey3,
            backgroundColor: theme.palette.grey3,
            borderRadius: "100px",
            margin: "60px",
          }}
        />
        {/* Reports */}
        <Box sx={{ mt: 4 }}>
          <CustomTypography
            type="heading6"
            sx={{ mb: 2, color: theme.palette.white, textAlign: "center" }}
          >
            Financial Insights
          </CustomTypography>
          {reports.map((report, idx) => (
            <CustomTypography
              key={idx}
              type="body"
              sx={{ mb: 1, color: report.color, textAlign: "center" }}
            >
              {report.text}
            </CustomTypography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Analysis;
