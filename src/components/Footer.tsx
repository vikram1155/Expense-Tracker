import { Box, Typography } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

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
        backgroundColor: "grey",
        textAlign: "center",
        flexDirection: "row",
        boxShadow: `0px 10px 20px -2px red`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: 1,
        }}
      >
        <Typography>Connect for more!</Typography>
        <LinkedInIcon
          sx={{ fontSize: "16px", cursor: "pointer" }}
          onClick={() =>
            window.open("https://www.linkedin.com/in/vikram1155/", "_blank")
          }
        />
        <GitHubIcon
          sx={{ fontSize: "16px", cursor: "pointer" }}
          onClick={() =>
            window.open("https://github.com/vikram1155/", "_blank")
          }
        />
      </Box>
    </Box>
  );
};

export default Footer;
