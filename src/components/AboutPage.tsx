import React from "react";
import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomTypography from "../customComponents/CustomTypography";
import TableImage from "../assets/Table.png";
import IncomeVsExpenses from "../assets/IncomeVsExpenses.png";
import MonthVsYearlyExpenses from "../assets/MonthVsYearlyExpenses.png";
import MonthlyIncomeVsExpense from "../assets/MonthlyIncomeVsExpense.png";
import CustomButton from "../customComponents/CustomButton";
import { useNavigate } from "react-router-dom";

const AboutPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "calc(100vh - 176px)",
        color: theme.palette.text.primary,
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            width: { xs: "100%", sm: "80%" },
            mx: "auto",
            textAlign: "center",
            mb: { xs: 6, sm: 8 },
          }}
        >
          <CustomTypography
            type="heading1"
            sx={{
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Discover ExpenseWise
          </CustomTypography>
          <CustomTypography
            type="body"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              color: theme.palette.text.secondary,
            }}
          >
            ExpenseWise helps you take control of your finances with powerful
            tracking, insightful visualizations, and secure user management.
            Monitor your expenses and income effortlessly.
          </CustomTypography>
        </Box>

        {/* Dashboard Overview Section */}
        <Box
          sx={{
            width: { xs: "100%", sm: "80%" },
            mx: "auto",
            mb: { xs: 6, sm: 8 },
          }}
        >
          <CustomTypography type="heading3" sx={{ textAlign: "center", mb: 8 }}>
            Your Dashboard at a Glance
          </CustomTypography>

          {/* Pie Chart: Description (Left), Screenshot (Right) on md+ */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "center" },
              mb: 10,
              gap: 4,
            }}
          >
            <Box
              sx={{
                flex: 1,
                width: { xs: "100%", md: "30%" },
                textAlign: { xs: "center", md: "right" },
              }}
            >
              <CustomTypography type="heading5" sx={{ mb: 2 }}>
                Pie Chart: Spending by Category
              </CustomTypography>
              <CustomTypography type="body">
                Visualize your spending distribution across categories like
                Food, Travel, and Bills. Identify where your money goes at a
                glance with this intuitive pie chart.
              </CustomTypography>
            </Box>
            <Box
              sx={{
                flex: 1.5,
                width: { xs: "100%", md: "70%" },
                textAlign: "center",
              }}
            >
              <img
                src={IncomeVsExpenses}
                alt="Pie chart showing spending distribution across categories"
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          </Box>

          {/* Bar Chart: Screenshot (Left), Description (Right) on md+ */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row-reverse" },
              alignItems: { xs: "center", md: "center" },
              mb: 10,
              gap: 4,
            }}
          >
            <Box
              sx={{
                flex: 1,
                width: { xs: "100%", md: "50%" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <CustomTypography type="heading5" sx={{ mb: 2 }}>
                Bar Chart: Monthly Spending Comparison
              </CustomTypography>
              <CustomTypography type="body">
                Compare your spending across months, such as January vs.
                February, to spot trends and seasonal patterns with this clear
                bar chart.
              </CustomTypography>
            </Box>
            <Box
              sx={{
                flex: 1.5,
                width: { xs: "100%", md: "50%" },
                textAlign: "center",
              }}
            >
              <img
                src={MonthlyIncomeVsExpense}
                alt="Bar chart comparing monthly spending"
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          </Box>

          {/* Line Chart: Description (Left), Screenshot (Right) on md+ */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "center" },
              mb: 10,
              gap: 4,
            }}
          >
            <Box
              sx={{
                flex: 1,
                width: { xs: "100%", md: "50%" },
                textAlign: { xs: "center", md: "right" },
              }}
            >
              <CustomTypography type="heading5" sx={{ mb: 2 }}>
                Line Chart: Spending Trends Over Time
              </CustomTypography>
              <CustomTypography type="body">
                Track your spending trends over the past year, showing daily or
                monthly changes to reveal long-term financial habits with this
                insightful line chart.
              </CustomTypography>
            </Box>
            <Box
              sx={{
                flex: 1.5,
                width: { xs: "100%", md: "50%" },
                textAlign: "center",
              }}
            >
              <img
                src={MonthVsYearlyExpenses}
                alt="Line chart showing spending trends over time"
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          </Box>

          {/* Table: Screenshot (Left), Description (Right) on md+ */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row-reverse" },
              alignItems: { xs: "center", md: "center" },
              mb: 10,
              gap: 4,
            }}
          >
            <Box
              sx={{
                flex: 1,
                width: { xs: "100%", md: "50%" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              <CustomTypography type="heading5" sx={{ mb: 2 }}>
                Transaction Table with Search & Filters
              </CustomTypography>
              <CustomTypography type="body" sx={{ mb: 2 }}>
                View all your transactions in an interactive table, along with
                edit and delete options. Easily search for specific transactions
                and filter them by Type, Category, and Method fields.
              </CustomTypography>
            </Box>
            <Box
              sx={{
                flex: 1.5,
                width: { xs: "100%", md: "50%" },
                textAlign: "center",
              }}
            >
              <img
                src={TableImage}
                alt="Table showing transactions with search bar and filter dropdowns"
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Features Section */}
        <Box
          sx={{
            width: { xs: "100%", sm: "80%" },
            mx: "auto",
            mb: { xs: 6, sm: 8 },
          }}
        >
          <CustomTypography type="heading3" sx={{ textAlign: "center", mb: 4 }}>
            Additional Features
          </CustomTypography>
          <Box
            sx={{
              gap: 2,
              justifyContent: "center",
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                lg: "1fr 1fr 1fr 1fr",
              },
            }}
          >
            {[
              {
                title: "Multi-User Login",
                description:
                  "Securely log in with multiple accounts, each with personalized dashboards and settings.",
                color: theme.palette.primary.main,
              },
              {
                title: "Profile Management",
                description:
                  "Edit your profile details and change your password anytime, with full control over your account.",
                color: theme.palette.secondary.main,
              },
              {
                title: "Secure & Reliable",
                description:
                  "Your data is protected with securely hashed passwords, ensuring safety and privacy.",
                color: theme.palette.credit.main,
              },
              {
                title: "Smart Insights",
                description:
                  "Get insights like whether you’ve spent more or less than your yearly average, with tips to save.",
                color: theme.palette.debit.main,
              },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  //   maxWidth: {
                  //     xs: "100%",
                  //     sm: "calc(50% - 12px)",
                  //     lg: "calc(25% - 18px)",
                  //   },

                  p: { xs: 1, sm: 1.5 },
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: "12px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                  textAlign: "center",
                }}
              >
                <CustomTypography
                  type="heading6"
                  sx={{ color: feature.color, mb: 1 }}
                >
                  {feature.title}
                </CustomTypography>
                <CustomTypography type="subText">
                  {feature.description}
                </CustomTypography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Call to Action */}
        <Box
          sx={{
            width: { xs: "100%", sm: "80%" },
            mx: "auto",
            textAlign: "center",
          }}
        >
          <CustomTypography
            type="heading4"
            sx={{ mb: 3, color: theme.palette.white }}
          >
            Ready to Take Control of Your Finances?
          </CustomTypography>

          <CustomButton
            text="Sign Up"
            onClick={() => navigate("/login")}
            sx={{
              mt: 4,
              minWidth: "200px",
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
