export const yearOptions = Array.from({ length: 2025 - 2000 + 1 }, (_, i) =>
  (2000 + i).toString()
);
export const monthOptions = [
  "All",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const categoryOptions = [
  "All",
  "Food",
  "Travel",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Education",
  "Rent",
  "Utilities",
  "Insurance",
  "Miscellaneous",
];
export const typeOptions = ["All", "Credit", "Debit"];
export const methodOptions = ["All", "UPI", "Card", "Cash", "Net Banking"];

export const monthToValue = (month: string, year: string) =>
  month === "All"
    ? "All"
    : `${monthOptions.indexOf(month) < 10 ? "0" : ""}${monthOptions.indexOf(
        month
      )}`;
export const valueToMonth = (value: string) =>
  value === "All" ? "All" : monthOptions[parseInt(value)];

export const monthOptionsLine = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const monthsLine = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const monthToValueLine = (month: string) => {
  const index = monthsLine.indexOf(month);
  return index !== -1 ? (index + 1).toString().padStart(2, "0") : "01";
};
export const valueToMonthLine = (value: string) => {
  const index = parseInt(value, 10) - 1;
  return index >= 0 && index < 12 ? monthsLine[index] : "January";
};
