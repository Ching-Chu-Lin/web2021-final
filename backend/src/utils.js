import bcrypt from "bcrypt";

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

export const checkUserIdentity = async (auth, db) => {
  // user exist
  const user = await db.UserModel.findOne({
    username: auth.username,
    identity: auth.identity,
  });
  if (!user) throw new Error("No such user. Authentication failed.");

  // validate password
  const valid = await bcrypt.compare(auth.password, user.password);
  if (!valid) throw new Error("Invalid password. Authentication failed.");

  return user;
};
