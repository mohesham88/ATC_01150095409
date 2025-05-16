// src/types/express/index.d.ts

import { Language } from "../custom.js";

import { UserModel } from "../../modules/users/user.model.js";

// to make the file a module and avoid the TypeScript error
export {};

interface User extends UserModel {
  _id: string;
  id: string;
}

declare module "express-serve-static-core" {
  namespace Express {
    export interface Request {
      language?: Language;
      user?: User;
      admin?: UserModel | undefined;
      session: Session | undefined;
      login(user: any, callback: (err: Error | null) => void): void;
      files: Express.Multer.File[] | undefined;
    }
  }
}
