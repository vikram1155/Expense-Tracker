import { Drawer, Box, IconButton, Container } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import theme from "../theme";
import CustomTypography from "../customComponents/CustomTypography";

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
          // px: 3,
          mx: "auto",
          width: "100%",
          maxWidth: { xs: "100%", sm: "90%", md: "900px", lg: "1000px" },
        }}
      >
        <CustomTypography
          type="heading6"
          onClick={() => {
            navigate("/");
          }}
          sx={{ cursor: "pointer" }}
        >
          Expense Tracker
        </CustomTypography>
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
