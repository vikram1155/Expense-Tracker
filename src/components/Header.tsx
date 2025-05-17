import { Box, IconButton, Container } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import theme from "../theme";
import CustomTypography from "../customComponents/CustomTypography";
import Logo from "../assets/logo-white.svg";

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.default,
        position: "fixed",
        top: 0,
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
          mx: "auto",
          width: "100%",
          maxWidth: { xs: "100%", sm: "90%", md: "900px", lg: "1000px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Box
            sx={{
              margin: { xs: "0px", sm: "2px", md: "4px" },
            }}
          >
            <img
              src={Logo}
              alt="ExpenseWise"
              style={{
                maxWidth: "20px",
                cursor: "pointer",
              }}
              onClick={() => {
                navigate("/");
              }}
            />
          </Box>
          <CustomTypography
            type="heading6"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/");
            }}
          >
            ExpenseWise
          </CustomTypography>
        </Box>

        <IconButton
          sx={{ p: 0, color: theme.palette.white }}
          onClick={() => navigate("/profile")}
        >
          <AccountCircleIcon />
        </IconButton>
      </Box>
    </Container>
  );
};

export default Header;
