import { Box } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import theme from "../theme";
import CustomTypography from "../customComponents/CustomTypography";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pt: 1,
        pb: 1.5,
        position: "fixed",
        bottom: "0",
        width: "100%",
        zIndex: 1201,
        backgroundColor: theme.palette.background.default,
        textAlign: "center",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: 1,
          maxWidth: { xs: "100%", sm: "95%", md: "900px", lg: "1000px" },
        }}
      >
        <CustomTypography type="subText">Connect for more!</CustomTypography>
        <LinkedInIcon
          sx={{
            fontSize: "16px",
            cursor: "pointer",
            color: theme.palette.text.secondary,
          }}
          onClick={() =>
            window.open("https://www.linkedin.com/in/vikram1155/", "_blank")
          }
        />
        <GitHubIcon
          sx={{
            fontSize: "16px",
            cursor: "pointer",
            color: theme.palette.text.secondary,
          }}
          onClick={() =>
            window.open("https://github.com/vikram1155/", "_blank")
          }
        />
      </Box>
    </Box>
  );
};

export default Footer;
