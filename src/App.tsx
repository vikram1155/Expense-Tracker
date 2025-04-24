import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <Router>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/expenses" element={<div>My Expenses</div>} />
          <Route
            path="/create-expense"
            element={<div>Create an Expense</div>}
          />
          <Route path="/analysis" element={<div>Analysis</div>} />
          <Route path="/about" element={<div>About Us</div>} />
        </Routes>
        <Footer />
      </Box>
    </Router>
  );
};

export default App;
