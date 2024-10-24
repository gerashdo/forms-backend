import { Request, Response } from "express";
import { getUsers, loginUser, registerUser, updateUser, getUserById } from '../services/authService';
import { handleControllerError } from "../helpers/errorHandler";
import { ALLOWED_USER_ORDER_BY, ALLOWED_USER_ORDER_BY_FIELDS } from "../constants/user";
import { PatchUserBody } from "../interfaces/auth/user";


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
            blocked: user.blocked,
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

export const getUserByIdController = async(req: Request, res: Response) => {
  const {id} = req.params;
  try {
      const user = await getUserById(Number(id));
      res.status(200).json({
        ok: true,
        data: user,
      });
  } catch (error) {
      handleControllerError(res, error);
  }
}

export const updateUserController = async(req: Request, res: Response) => {
  const {id} = req.params;
  const data: PatchUserBody = req.body;
  try {
      const user = await updateUser(Number(id), data);
      res.status(200).json({
        ok: true,
        data: user,
      });
  } catch (error) {
      handleControllerError(res, error);
  }
}
