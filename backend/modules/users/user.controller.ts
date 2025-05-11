import { Express, Router, Request, Response, NextFunction } from "express";
import { getAllUsers } from "./user.service";
import { UserModel, Users } from "./user.model";
import { IsOptional, IsString, IsUrl } from "class-validator";
import { validationMiddleware } from "../../middlewares/validate";
import { profile } from "console";

const app: Router = Router();

class updateUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsUrl()
  @IsOptional()
  avatar: String; // url

  @IsString()
  @IsOptional()
  bio: String;
}

app
  .route("/profile")
  .get((req: Request, res: Response) => {
    delete (req.user as any).password;
    return res.status(200).json(req.user);
  })
  .patch(
    validationMiddleware(updateUserDto),
    async (req: Request, res: Response) => {
      const user = req.user as UserModel;
      const updatedAttributes = {
        username: req.body.username || user.username,
        profile: {
          fullName: req.body.fullName || user.profile.fullName,
          avatar: req.body.avatar || user.profile.avatar,
          bio: req.body.bio || user.profile.bio,
        },
      };
      const updatedUser = await Users.findByIdAndUpdate(
        user._id,
        updatedAttributes,
        {
          returnOriginal: false,
        }
      );

      return res.status(200).json(updatedUser);
    }
  );

app.get("/all", async (req: Request, res: Response) => {
  let users = await getAllUsers();
  const otherUsers = users.filter(
    (user) => user.id.toString() !== req.user?._id
  );
  return res.status(200).json(otherUsers);
});

export default app;
