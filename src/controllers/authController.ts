import { Request, Response } from "express";
import { getUsers, loginUser, registerUser } from "../services/authService";
import { handleControllerError } from "../helpers/errorHandler";
import { ALLOWED_USER_ORDER_BY, ALLOWED_USER_ORDER_BY_FIELDS } from "../constants/user";


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

export const getUsersController = async(req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    orderBy = ALLOWED_USER_ORDER_BY_FIELDS.createdAt,
    order = ALLOWED_USER_ORDER_BY.DESC,
  } = req.query;
  try {
      const result = await getUsers(
        Number(page),
        Number(limit),
        orderBy as ALLOWED_USER_ORDER_BY_FIELDS,
        order as ALLOWED_USER_ORDER_BY
      );
      res.status(200).json({
        ok: true,
        data: result.rows,
        meta: {
          total: result.count,
          page: Number(page),
          elementsPerPage: Number(limit),
          totalPages: Math.ceil(result.count / Number(limit)),
        }
      });
  } catch (error) {
      handleControllerError(res, error);
  }
}
