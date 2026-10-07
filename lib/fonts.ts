import { Cormorant_Garamond, Outfit } from "next/font/google";

export const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--ff-display",
  display: "swap",
});

export const body = Outfit({
  subsets: ["latin"],
  variable: "--ff-body",
  display: "swap",
});
