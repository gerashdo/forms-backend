import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";
import { handleControllerError } from "../helpers/errorHandler";


export const loginController = async(req: Request, res: Response) => {
  const {email, password} = req.body;
  try {
      const {user, token} = await loginUser(email, password);
      res.status(200).json({
        data: {
          user: {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
          token,
        }
      });
  } catch (error) {
      handleControllerError(res, error);
  }
}

export const signUpController = async(req: Request, res: Response) => {
  const {name, lastName, email, password} = req.body;
  try {
      const user = await registerUser(name, lastName, email, password);
      res.status(201).json({
        ok: true,
        user: {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        }
      });
  } catch (error) {
      handleControllerError(res, error);
  }
}
