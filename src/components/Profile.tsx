import React, { useState, useEffect } from "react";
import { Box, Modal, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import CustomTextField from "../customComponents/CustomTextField";
import CustomTypography from "../customComponents/CustomTypography";
import CustomButton from "../customComponents/CustomButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { showSnackbar } from "../redux/snackbarSlice";
import theme from "../theme";
import LoginInToContinue from "./LoginInToContinue";
import CryptoJS from "crypto-js";

interface UserProfile {
  name: string;
  email: string;
  phone: string | null;
  dob: string | null;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiState {
  loading: boolean;
  error: string | false;
  data: any;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const userProfile = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  const [userData, setUserData] = useState<UserProfile>({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || null,
    dob: userProfile?.dob || null,
  });
  const [formData, setFormData] = useState<UserProfile>({ ...userData });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [apiState, setApiState] = useState<ApiState>({
    loading: false,
    error: false,
    data: null,
  });

  useEffect(() => {
    const storedData = localStorage.getItem("user");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(parsedData);
      setFormData(parsedData);
    }
  }, []);

  useEffect(() => {
    const hasChangesDetected =
      formData.name !== userData.name ||
      formData.phone !== userData.phone ||
      formData.dob !== userData.dob;
    setHasChanges(hasChangesDetected);
  }, [formData, userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateProfileForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (
      formData.phone &&
      !/^\+?[1-9]\d{1,14}$/.test(formData.phone) &&
      formData.phone.length !== 10
    ) {
      newErrors.phone = "Invalid phone number";
    }
    if (formData?.phone?.length !== 10) {
      newErrors.phone = "Invalid phone number";
    }
    if (formData.dob && !/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
      newErrors.dob = "Invalid date (YYYY-MM-DD)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateProfileForm()) {
      setApiState({ loading: true, error: false, data: null });
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:8000"
          }/api/auth/edit-profile`,
          {
            name: formData.name,
            phone: formData.phone || null,
            dob: formData.dob || null,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApiState({ loading: false, error: false, data: response.data });
        setUserData(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsEditing(false);
        setHasChanges(false);
        dispatch(
          showSnackbar({
            message: "Profile updated successfully",
            severity: "success",
          })
        );
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error || "Something failed, try again later";
        setApiState({ loading: false, error: errorMessage, data: null });
        dispatch(
          showSnackbar({
            message: errorMessage,
            severity: "error",
          })
        );
      }
    }
  };

  const handlePasswordSave = async () => {
    if (validatePasswordForm()) {
      setApiState({ loading: true, error: false, data: null });
      try {
        const token = localStorage.getItem("token");
        // Hash passwords with SHA-256
        const hashedCurrentPassword = CryptoJS.SHA256(
          passwordData.currentPassword
        ).toString(CryptoJS.enc.Hex);
        const hashedNewPassword = CryptoJS.SHA256(
          passwordData.newPassword
        ).toString(CryptoJS.enc.Hex);
        const hashedConfirmPassword = CryptoJS.SHA256(
          passwordData.confirmPassword
        ).toString(CryptoJS.enc.Hex);

        const response = await axios.post(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:8000"
          }/api/auth/change-password`,
          {
            currentPassword: hashedCurrentPassword,
            newPassword: hashedNewPassword,
            confirmPassword: hashedConfirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApiState({ loading: false, error: false, data: response.data });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
        dispatch(
          showSnackbar({
            message: "Password updated successfully",
            severity: "success",
          })
        );
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error || "Something failed, try again later";
        setApiState({ loading: false, error: errorMessage, data: null });
        dispatch(
          showSnackbar({
            message: errorMessage,
            severity: "error",
          })
        );
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    window.location.assign("/");
  };

  const handleClose = () => {
    setShowPasswordForm(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setApiState({ loading: false, error: false, data: null });
  };

  return (
    <>
      {userProfile?.email ? (
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
              borderRadius: "12px",
              px: { xs: 1, sm: 2, md: 3 },
              py: { xs: 2, sm: 3, md: 4 },
              mx: { xs: 1, sm: 2, md: 3 },
              my: { xs: 2, sm: 3, md: 4 },
              maxWidth: "800px",
              width: "100%",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  height: 110,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `2px solid ${theme.palette.grey3}`,
                  transition: "border-color 0.3s ease",
                }}
              >
                <AccountCircleIcon
                  sx={{
                    width: 110,
                    height: 110,
                    color: theme.palette.grey3,
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "2fr 1fr",
                },
                gap: 3,
                alignItems: "flex-start",
                px: { xs: 3, sm: 4 },
                m: "auto",
              }}
            >
              <Box
                sx={{
                  flexDirection: "column",
                  gap: { xs: 2, sm: 3 },
                  p: { xs: 1, sm: 2 },
                  backgroundColor: theme.palette.background.paper,
                  height: "-webkit-fill-available",
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                  },
                  alignItems: "flex-start",
                  borderRight: { md: `1px solid ${theme.palette.grey3}` },
                  borderBottom: {
                    xs: `1px solid ${theme.palette.grey3}`,
                    md: 0,
                  },
                }}
              >
                {isEditing ? (
                  <CustomTextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "64px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <CustomTypography
                      type="subHeading"
                      sx={{ color: theme.palette.grey3 }}
                    >
                      Name
                    </CustomTypography>
                    <CustomTypography
                      type="body"
                      sx={{ color: theme.palette.white }}
                    >
                      {userData.name}
                    </CustomTypography>
                  </Box>
                )}

                <Box
                  sx={{
                    height: "64px",
                    alignItems: { sm: "flex-end", md: "flex-start" },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <CustomTypography
                    type="subHeading"
                    sx={{ color: theme.palette.grey3 }}
                  >
                    Email
                  </CustomTypography>
                  <CustomTypography
                    type="body"
                    sx={{ color: theme.palette.white }}
                  >
                    {userData.email}
                  </CustomTypography>
                </Box>

                {isEditing ? (
                  <CustomTextField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "64px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <CustomTypography
                      type="subHeading"
                      sx={{ color: theme.palette.grey3 }}
                    >
                      Phone Number
                    </CustomTypography>
                    <CustomTypography
                      type="body"
                      sx={{ color: theme.palette.white }}
                    >
                      {userData.phone || "Not provided"}
                    </CustomTypography>
                  </Box>
                )}

                {isEditing ? (
                  <CustomTextField
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={formData.dob || ""}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.dob}
                    helperText={errors.dob}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "64px",
                      alignItems: { sm: "flex-end", md: "flex-start" },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <CustomTypography
                      type="subHeading"
                      sx={{ color: theme.palette.grey3 }}
                    >
                      Date of Birth
                    </CustomTypography>
                    <CustomTypography
                      type="body"
                      sx={{ color: theme.palette.white }}
                    >
                      {userData.dob || "Not provided"}
                    </CustomTypography>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  p: 2,
                  borderRadius: "8px",
                  backgroundColor: theme.palette.background.paper,
                  height: "-webkit-fill-available",
                  width: {
                    xs: "-webkit-fill-available",
                    sm: "50%",
                    md: "-webkit-fill-available",
                  },
                  m: "auto",
                }}
              >
                {isEditing ? (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <CustomButton
                      text="Save"
                      onClick={handleSave}
                      disabled={!hasChanges || apiState.loading}
                      sx={{
                        width: "100%",
                        backgroundColor:
                          hasChanges && !apiState.loading
                            ? theme.palette.primary.main
                            : theme.palette.grey2,
                        color: theme.palette.white,
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    />
                    <CustomButton
                      text="Cancel"
                      onClick={() => {
                        setFormData({ ...userData });
                        setIsEditing(false);
                        setErrors({});
                      }}
                      disabled={apiState.loading}
                      sx={{
                        width: "100%",
                        borderColor: theme.palette.white,
                        color: theme.palette.white,
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                ) : (
                  <CustomButton
                    text="Edit Profile"
                    onClick={() => setIsEditing(true)}
                  />
                )}

                <CustomButton
                  text="Change Password"
                  onClick={() => setShowPasswordForm(true)}
                  sx={{
                    borderRadius: "8px",
                    borderColor: theme.palette.white,
                    color: theme.palette.white,
                  }}
                />
                <CustomButton
                  text="Logout"
                  onClick={handleLogout}
                  sx={{
                    borderRadius: "8px",
                    borderColor: theme.palette.debit.main,
                    color: theme.palette.debit.main,
                  }}
                />
              </Box>
            </Box>

            <Modal
              open={showPasswordForm}
              onClose={handleClose}
              closeAfterTransition
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: "12px",
                  p: { xs: 3, sm: 4 },
                  maxWidth: "500px",
                  outline: "none",
                  mx: 5,
                  width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
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
                    <CircularProgress
                      sx={{ color: theme.palette.primary.main }}
                    />
                  </Box>
                )}

                <CustomTypography
                  type="heading6"
                  sx={{
                    mb: 3,
                    color: theme.palette.white,
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  Change Password
                </CustomTypography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  <CustomTextField
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword}
                    disabled={apiState.loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        borderColor: theme.palette.grey2,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.white,
                        },
                      },
                    }}
                  />
                  <CustomTextField
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    disabled={apiState.loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        borderColor: theme.palette.grey2,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.white,
                        },
                      },
                    }}
                  />
                  <CustomTextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={apiState.loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        borderColor: theme.palette.grey2,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.white,
                        },
                      },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 4,
                    gap: 1.5,
                  }}
                >
                  <CustomButton
                    text="Cancel"
                    onClick={handleClose}
                    disabled={apiState.loading}
                  />
                  <CustomButton
                    text="Change"
                    onClick={handlePasswordSave}
                    disabled={apiState.loading}
                  />
                </Box>
              </Box>
            </Modal>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CustomButton
                text="Go to My Dashboard"
                onClick={() => navigate("/analysis")}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <LoginInToContinue />
        </>
      )}
    </>
  );
};

export default Profile;
