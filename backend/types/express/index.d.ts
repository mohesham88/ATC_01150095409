// src/types/express/index.d.ts

import { Language } from "../custom.js";

import {UserModel} from '../../users/user.model.js'

// to make the file a module and avoid the TypeScript error
export {}

declare module "express-serve-static-core" {
  namespace Express {
    export interface Request {
      language?: Language;
      user?: UserModel;
      login(user: any, callback: (err: Error | null) => void): void;
    }
  }
}