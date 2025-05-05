import React, { useState, useEffect } from "react";
import { Box, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomTextField from "../customComponents/CustomTextField";
import CustomTypography from "../customComponents/CustomTypography";
import theme from "../theme";
import CustomButton from "../customComponents/CustomButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const userProfile = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  const [userData, setUserData] = useState<UserProfile>({
    name: userProfile?.name,
    email: userProfile?.email,
    phone: userProfile?.phone || "Add Phone number",
    dob: userProfile?.dob || "Add DOB",
  });
  const [formData, setFormData] = useState<UserProfile>({ ...userData });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("userProfile");
    if (storedData) {
      setUserData(JSON.parse(storedData));
      setFormData(JSON.parse(storedData));
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
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (formData.dob && !/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
      newErrors.dob = "Invalid date (YYYY-MM-DD)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      setUserData({ ...formData });
      localStorage.setItem("userProfile", JSON.stringify(formData));
      setIsEditing(false);
      setHasChanges(false);
    }
  };

  const handlePasswordSave = () => {
    const newErrors: { [key: string]: string } = {};
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userProfile");
    navigate("/");
  };

  const handleClose = () => {
    setShowPasswordForm(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
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
          borderRadius: "12px",
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, sm: 3, md: 4 },
          mx: { xs: 1, sm: 2, md: 3 },
          my: { xs: 2, sm: 3, md: 4 },
          maxWidth: "800px",
          width: "100%",
          backgroundColor: theme.palette.background.paper, // #121212
        }}
      >
        {/* Profile Picture */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              //   width: 100,
              height: 110,
              borderRadius: "50%",
              overflow: "hidden",
              border: `2px solid ${theme.palette.grey3}`, // #666666
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

        {/* User Data */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr",
            },
            gap: 3,
            alignItems: "flex-start",
            // mb: 5,
            px: { xs: 3, sm: 4 },
            m: "auto",
          }}
        >
          <Box
            sx={{
              flexDirection: "column",
              gap: { xs: 2, sm: 3 },
              p: { xs: 1, sm: 2 },
              backgroundColor: theme.palette.background.paper, // #121212
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
                  sx={{ color: theme.palette.grey3 }} // #999999
                >
                  Name
                </CustomTypography>
                <CustomTypography
                  type="body"
                  sx={{ color: theme.palette.white }} // #FFFFFF
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
                sx={{ color: theme.palette.grey3 }} // #999999
              >
                Email
              </CustomTypography>
              <CustomTypography
                type="body"
                sx={{ color: theme.palette.white }} // #FFFFFF
              >
                {userData.email}
              </CustomTypography>
            </Box>

            {isEditing ? (
              <CustomTextField
                label="Phone Number"
                name="phone"
                value={formData.phone}
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
                  sx={{ color: theme.palette.grey3 }} // #999999
                >
                  Phone Number
                </CustomTypography>
                <CustomTypography
                  type="body"
                  sx={{ color: theme.palette.white }} // #FFFFFF
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
                value={formData.dob}
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
                  sx={{ color: theme.palette.grey3 }} // #999999
                >
                  Date of Birth
                </CustomTypography>
                <CustomTypography
                  type="body"
                  sx={{ color: theme.palette.white }} // #FFFFFF
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
              backgroundColor: theme.palette.background.paper, // #121212
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
                  disabled={!hasChanges}
                  sx={{
                    width: "100%",
                    backgroundColor: hasChanges
                      ? theme.palette.primary.main // #1976D2
                      : theme.palette.grey2, // #666666
                    color: theme.palette.white, // #FFFFFF
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
                  sx={{
                    width: "100%",
                    borderColor: theme.palette.white, // #FFFFFF
                    color: theme.palette.white, // #FFFFFF
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
                borderColor: theme.palette.white, // #FFFFFF
                color: theme.palette.white, // #FFFFFF
              }}
            />
            <CustomButton
              text="Logout"
              onClick={handleLogout}
              sx={{
                borderRadius: "8px",
                borderColor: theme.palette.credit.main, // #F44336
                color: theme.palette.credit.main, // #F44336
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
            }}
          >
            <CustomTypography
              type="heading6"
              sx={{
                mb: 3,
                color: theme.palette.white, // #FFFFFF
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    borderColor: theme.palette.grey2, // #666666
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.white, // #FFFFFF
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    borderColor: theme.palette.grey2, // #666666
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.white, // #FFFFFF
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    borderColor: theme.palette.grey2, // #666666
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.white, // #FFFFFF
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
              <CustomButton text="Cancel" onClick={handleClose} />
              <CustomButton text="Change" onClick={handlePasswordSave} />
            </Box>
          </Box>
        </Modal>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CustomButton
            text="Go to My Dashboard"
            onClick={() => navigate("/all-transactions")}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
