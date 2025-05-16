import React from "react";
import { Typography, SxProps, Theme } from "@mui/material";
import theme from "../theme";

type TextVariant =
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading3h"
  | "heading4"
  | "heading5"
  | "heading5h"
  | "heading6"
  | "heading6h"
  | "subHeading"
  | "body"
  | "bodyBold"
  | "subText"
  | "subText2"
  | "listItem"
  | "creditText";

interface CustomTypographyProps {
  type?: TextVariant;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  className?: string;
  [key: string]: any;
}

const CustomTypography: React.FC<CustomTypographyProps> = ({
  type = "body",
  children,
  sx = {},
  className,
  ...props
}) => {
  const textVariants: Record<TextVariant, any> = {
    heading1: {
      variant: "h1",
      fontWeight: 700,
      color: theme.palette.white,
      fontSize: { xs: 38, sm: 42, md: 45, lg: 48 },
    },
    heading2: {
      variant: "h2",
      fontWeight: 700,
      color: theme.palette.white,
      fontSize: { xs: 27, sm: 30, md: 32, lg: 35 },
    },
    heading3: {
      variant: "h3",
      fontWeight: 600,
      color: theme.palette.white,
      fontSize: { xs: 22, sm: 26, md: 27, lg: 29 },
    },
    heading3h: {
      variant: "h3",
      fontWeight: 600,
      color: theme.palette.grey3,
      fontSize: { xs: 22, sm: 26, md: 27, lg: 29 },
    },
    heading4: {
      variant: "h4",
      fontWeight: 600,
      color: theme.palette.white,
      fontSize: { xs: 19, sm: 22, md: 24, lg: 26 },
    },
    heading5: {
      variant: "h5",
      fontWeight: 600,
      color: theme.palette.white,
      fontSize: { xs: 18, sm: 19, md: 21, lg: 22 },
    },
    heading5h: {
      variant: "h5",
      fontWeight: 600,
      color: theme.palette.grey1,
      fontSize: { xs: 18, sm: 19, md: 21, lg: 22 },
    },
    heading6: {
      variant: "h6",
      fontWeight: 600,
      color: theme.palette.white,
      fontSize: { xs: 14, sm: 16, md: 18, lg: 19 },
    },
    heading6h: {
      variant: "h6",
      fontWeight: 600,
      color: theme.palette.grey1,
      fontSize: { xs: 13, sm: 14, md: 16, lg: 18 },
    },
    subHeading: {
      variant: "h6",
      fontWeight: 600,
      color: theme.palette.grey3,
      fontSize: { xs: 11, sm: 12, md: 13, lg: 14 },
    },
    body: {
      variant: "body1",
      fontWeight: 400,
      color: theme.palette.text.primary,
      fontSize: { xs: 12, sm: 13, md: 13, lg: 14 },
    },
    bodyBold: {
      variant: "body1",
      fontWeight: 700,
      color: theme.palette.text.primary,
      fontSize: { xs: 12, sm: 13, md: 13, lg: 14 },
    },
    subText: {
      variant: "body2",
      fontWeight: 400,
      color: theme.palette.text.secondary,
      fontSize: { xs: 10, sm: 11, md: 11, lg: 12 },
    },
    subText2: {
      variant: "body2",
      fontWeight: 300,
      color: theme.palette.text.secondary,
      fontSize: { xs: 10, sm: 11, md: 11, lg: 12 },
    },
    listItem: {
      variant: "body1",
      fontWeight: 300,
      color: theme.palette.debit.main,
      fontSize: { xs: 12, sm: 13, md: 13, lg: 14 },
    },
    creditText: {
      variant: "body1",
      fontWeight: 400,
      color: theme.palette.credit.main,
      fontSize: { xs: 12, sm: 13, md: 13, lg: 14 },
    },
  };

  return (
    <Typography
      sx={{ color: textVariants[type]?.color, ...sx }}
      className={className}
      {...textVariants[type]}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default CustomTypography;
