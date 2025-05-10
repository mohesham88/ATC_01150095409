import {Request , Response } from 'express';
import { Users } from './user.model';




export const createUser = async (userData: {
  username: string;
  email: string;
  password: string;
  profile: {
    fullName: string;
    avatar?: string;
    bio?: string;
  };
}) => {
  const existingUser = await Users.findOne({
    $or: [{ "email.address": userData.email }],
  });

  if (existingUser) {
    throw new Error("User with this Email already exists");
  }

  const user = new Users({
    username: userData.username,
    email: {
      address: userData.email,
      verified: false,
    },
    password: userData.password,
    profile: userData.profile,
  });

  await user.save();
  return user;
};


export const getUser = async (email: string, password: string) => {
  const user = await Users.findOne({ "email.address": email });

  if (!user) {
    throw new Error("User not found");
  }

  return new Promise((resolve, reject) => {
    user.comparePassword(
      password,
      (err: Error | null, isMatch: boolean | null) => {
        if (err) {
          reject(err);
        }
        if (!isMatch) {
          reject(new Error("Invalid password"));
        }
        resolve(user);
      }
    );
  });
};


export const getAllUsers = async function() {
  const users = await Users.find();

  return users;
}