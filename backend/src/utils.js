import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

export const APP_SECRET = process.env.APP_SECRET;

export const saltRounds = 10;

export const WEEKDAY_DICT = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};
