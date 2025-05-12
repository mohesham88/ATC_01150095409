import { loginUser } from "../auth/auth.service";
import { BadRequestError } from "rest-api-errors";




export const loginAdmin = async (email: string, password: string) => {
  const user = await loginUser(email, password);

  if (user?.role !== "admin") {
    throw new BadRequestError("Not authorized as admin");
  }

  return user;
};