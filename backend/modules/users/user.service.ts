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


export const getUserByEmail = async (email: string) => {
  const user = await Users.findOne({ "email.address": email });
  return user;
};


export const updateUser = async (userId: string, userData: any) => {
  const user = await Users.findByIdAndUpdate(userId, userData, { new: true });
  return user;
};




export const getAllUsers = async function() {
  const users = await Users.find();

  return users;
}