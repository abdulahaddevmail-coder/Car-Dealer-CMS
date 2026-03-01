import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { Currency, OdoUnit } from "./generated/prisma/enums";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice({ price, currency }: { price: number | null; currency: Currency | null }) {
  if (!price) return "0";

  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    ...(currency && { currency }),
    maximumFractionDigits: 0,
  });

  return formatter.format(price);
}

export function formatNumber(num: number | null, options?: Intl.NumberFormatOptions) {
  if (!num) return "0";

  return new Intl.NumberFormat("en-GB", options).format(num);
}

export function formatOdometerUnit(unit: OdoUnit) {
  return unit === OdoUnit.MILES ? "mi" : "km";
}

export function formatText(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export const generateDateOptions = () => {
  const today = new Date();
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      label: format(date, "dd MMM yyyy"),
      value: format(date, "dd MMM yyyy"),
    });
  }
  return dates;
};

export const generateTimeOptions = () => {
  const times = [];
  const startHour = 8;
  const endHour = 18;

  for (let hour = startHour; hour < endHour; hour++) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(hour);
    date.setMinutes(0);

    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    times.push({
      label: formattedTime,
      value: formattedTime,
    });
  }
  return times;
};
