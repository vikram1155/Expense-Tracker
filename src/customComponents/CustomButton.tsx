import { Button, ButtonProps, SxProps } from "@mui/material";
import theme from "../theme";

interface CustomButtonProps extends Omit<ButtonProps, "sx" | "onClick"> {
  text?: string;
  variant?: "text" | "outlined" | "contained";
  sx?: SxProps;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text = "Click Me",
  variant = "outlined",
  sx = {},
  onClick = () => {},
  icon,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      sx={{
        px: 1.5,
        py: "6.5px",
        borderRadius: 2,
        transition: "transform 0.4s ease",
        textTransform: "none",
        color: theme.palette.button.text,
        backgroundColor: theme.palette.button.background,
        borderColor: theme.palette.button.border,
        fontWeight: 400,
        fontSize: "14px",
        height: "fit-content",
        ":hover": {
          transform: "scale(1.03)",
        },
        "&.Mui-disabled": {
          borderColor: theme.palette.button.borderDisabled,
          backgroundColor: theme.palette.button.backgroundDisabled,
          color: theme.palette.button.textDisabled,
        },
        ...sx,
      }}
      onClick={onClick}
      {...props}
    >
      {text}&nbsp; {icon}
    </Button>
  );
};

export default CustomButton;
