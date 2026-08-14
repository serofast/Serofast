export const formatINR = (value) => {
  const n = Number(value) || 0;
  return `₹${n.toLocaleString("en-IN")}`;
};
