import jwt from "jsonwebtoken";
import { APP_SECRET } from "../utils";

export const authenticate = async (resolve, root, args, context, info) => {
  /* 
  let token;
  try {
    token = jwt.verify(context.request.get("Authorization"), "secret");
  } catch (e) {
    return new AuthenticationError("Not authorised");
  }
  const result = await resolve(root, args, context, info);
  return result;
  */

  const authHeader = context.request.get("Authorization");
  if (!authHeader) return await resolve(root, args, context, info);

  const token = authHeader.split(" ")[1]; // ["Bearer", "<token>"]
  if (!token) return await resolve(root, args, context, info);

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, APP_SECRET);
  } catch (error) {
    return await resolve(root, args, context, info);
  }

  if (!decodedToken) return await resolve(root, args, context, info);

  // user object
  const user = await context.db.UserModel.findOne({
    _id: decodedToken._id,
  });
  if (!user) throw new Error("No such user. Authentication failed.");
  context.request.user = user;
  console.log("user:", user);
  const result = await resolve(root, args, context, info);
  return result;
};
