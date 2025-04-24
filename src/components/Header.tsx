import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const menuItems = [
    { text: "My Expenses", path: "/expenses" },
    { text: "Create an Expense", path: "/create-expense" },
    { text: "Analysis", path: "/analysis" },
    { text: "About Us", path: "/about" },
  ];

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          "& .MuiDrawer-paper": {
            bgcolor: "red",
            color: "white",
            height: "56px",
            position: "fixed",
            top: 0,
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            width: "100%",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "calc(100% - 40px)",
            py: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleMenu}
              sx={{ mr: 2 }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" component="div">
              Expense Tracker
            </Typography>
          </Box>
          <IconButton color="inherit" sx={{ p: 0 }}>
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Drawer>
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={toggleMenu}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 250 },
            bgcolor: "teal",
            color: "white",
          },
        }}
      >
        <List>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              pl: 2.5,
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleMenu}
              sx={{ mr: 1 }}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" component="div">
              Expense Tracker
            </Typography>
          </Box>
          <Box pl={2.5}>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                onClick={toggleMenu}
                sx={{ color: "#fff", "&:hover": { bgcolor: "teal.700" } }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </Box>
        </List>
      </Drawer>
      <Box sx={{ mt: "64px" }} />
    </>
  );
};

export default Header;
