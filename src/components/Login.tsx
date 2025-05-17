import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import CustomTextField from "../customComponents/CustomTextField";
import CustomTypography from "../customComponents/CustomTypography";
import CustomButton from "../customComponents/CustomButton";
import { showSnackbar } from "../redux/snackbarSlice";
import theme from "../theme";
import CryptoJS from "crypto-js";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  dob: string;
}

interface ApiState {
  loading: boolean;
  error: string | false;
  data: any;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [signupData, setSignupData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiState, setApiState] = useState<ApiState>({
    loading: false,
    error: false,
    data: null,
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateLogin = () => {
    const newErrors: { [key: string]: string } = {};
    if (!loginData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = "Invalid email format";
    }
    if (!loginData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors: { [key: string]: string } = {};
    if (!signupData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!signupData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = "Invalid email format";
    }
    if (signupData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (signupData.phone && !/^\+?[1-9]\d{1,14}$/.test(signupData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (signupData.phone && signupData.phone.length !== 10) {
      newErrors.phone = "Invalid phone number";
    }
    if (signupData.dob && !/^\d{4}-\d{2}-\d{2}$/.test(signupData.dob)) {
      newErrors.dob = "Invalid date (YYYY-MM-DD)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const delayNavigation = (path: string) => {
    setTimeout(() => {
      setApiState((prev) => ({ ...prev, loading: false }));
      navigate(path);
      window.location.reload();
    }, 1000);
  };

  // Hash password with SHA-256
  const hashPassword = (password: string): string => {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  };
  console.log("a-process.env.VITE_API_URL", import.meta.env.VITE_API_URL);

  const handleLoginSubmit = async () => {
    if (validateLogin()) {
      setApiState({ loading: true, error: false, data: null });
      try {
        const hashedPassword = hashPassword(loginData.password);
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
          {
            email: loginData.email,
            password: hashedPassword,
          }
        );
        setApiState({ loading: true, error: false, data: response.data });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        dispatch(
          showSnackbar({
            message: "You have successfully logged in",
            severity: "success",
          })
        );
        delayNavigation("/");
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error || "Something failed, try again later";
        setApiState({ loading: false, error: errorMessage, data: null });
        console.error("Login error:", errorMessage);
        dispatch(
          showSnackbar({
            message: errorMessage,
            severity: "error",
          })
        );
      }
    }
  };

  const handleSignupSubmit = async () => {
    if (validateSignup()) {
      setApiState({ loading: true, error: false, data: null });
      try {
        const hashedPassword = hashPassword(signupData.password);
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/signup`,
          {
            name: signupData.name,
            email: signupData.email,
            password: hashedPassword,
            phone: signupData.phone || undefined,
            dob: signupData.dob || undefined,
          }
        );
        setApiState({ loading: true, error: false, data: response.data });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        dispatch(
          showSnackbar({
            message: "You have successfully signed up",
            severity: "success",
          })
        );
        delayNavigation("/");
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error || "Something failed, try again later";
        setApiState({ loading: false, error: errorMessage, data: null });
        console.error("Signup error:", errorMessage);
        dispatch(
          showSnackbar({
            message: errorMessage,
            severity: "error",
          })
        );
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 176px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: 2, sm: 4 },
        background: theme.palette.background.default,
        color: "white",
        mx: { xs: 2, sm: 3, md: 4 },
        my: { xs: 7, sm: 7, md: 7 },
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: "12px",
          p: { xs: 3, sm: 3 },
          maxWidth: "500px",
          width: { xs: "calc(100% - 32px)", sm: "calc(100% - 48px)" },
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        {apiState.loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "12px",
              zIndex: 1,
            }}
          >
            <CircularProgress sx={{ color: theme.palette.primary.main }} />
          </Box>
        )}

        <CustomTypography
          type="heading5"
          sx={{
            textAlign: "center",
            mb: 3,
            是中国: theme.palette.white,
            fontWeight: 600,
          }}
        >
          Hello👋
        </CustomTypography>

        {errors.form && (
          <CustomTypography
            type="body"
            sx={{
              color: theme.palette.credit.main,
              textAlign: "center",
              mb: 2,
            }}
          >
            {errors.form}
          </CustomTypography>
        )}

        {isLogin ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "350px",
              m: "auto",
            }}
          >
            <CustomTextField
              label="Email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={apiState.loading}
            />
            <CustomTextField
              label="Password"
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleLoginChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={apiState.loading}
            />
          </Box>
        ) : (
          <Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: { xs: 0, sm: 2 },
              }}
            >
              <CustomTextField
                label="Name"
                name="name"
                value={signupData.name}
                onChange={handleSignupChange}
                error={!!errors.name}
                helperText={errors.name}
                disabled={apiState.loading}
              />
              <CustomTextField
                label="Email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={apiState.loading}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: { xs: 0, sm: 2 },
              }}
            >
              <CustomTextField
                label="Phone Number (Optional)"
                name="phone"
                value={signupData.phone}
                onChange={handleSignupChange}
                error={!!errors.phone}
                helperText={errors.phone}
                disabled={apiState.loading}
              />
              <CustomTextField
                label="Date of Birth (Optional)"
                name="dob"
                type="date"
                value={signupData.dob}
                onChange={handleSignupChange}
                InputLabelProps={{ shrink: true }}
                error={!!errors.dob}
                helperText={errors.dob}
                disabled={apiState.loading}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: { xs: 0, sm: 2 },
              }}
            >
              <CustomTextField
                label="Password"
                name="password"
                type="password"
                value={signupData.password}
                onChange={handleSignupChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={apiState.loading}
              />
              <CustomTextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={apiState.loading}
              />
            </Box>
          </Box>
        )}

        <Box sx={{ width: "fit-content", m: "auto" }}>
          {isLogin ? (
            <CustomButton
              text="Login"
              onClick={handleLoginSubmit}
              sx={{
                mt: 4,
                minWidth: "200px",
              }}
              disabled={apiState.loading}
            />
          ) : (
            <CustomButton
              text="Sign Up"
              onClick={handleSignupSubmit}
              sx={{
                mt: 4,
                minWidth: "200px",
              }}
              disabled={apiState.loading}
            />
          )}
        </Box>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <CustomTypography type="body" sx={{ color: theme.palette.grey3 }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </CustomTypography>
          <Box>
            <CustomTypography
              type="body"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setLoginData({ email: "", password: "" });
                setSignupData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  phone: "",
                  dob: "",
                });
                setApiState({ loading: false, error: false, data: null });
              }}
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 500,
                width: "fit-content",
                m: "auto",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {isLogin ? "Sign up" : "Login"} here
            </CustomTypography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
