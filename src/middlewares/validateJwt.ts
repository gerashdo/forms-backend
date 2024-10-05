import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/auth/jwtoken";
import { CustomRequest } from "../interfaces/auth/token";


export const validateJWT = async( req: Request, res: Response, next: NextFunction ) => {
  const tokenHeader = req.header('Authorization')?.replace('Bearer ', '')
  try {
    const user = await verifyToken(tokenHeader)
    if(!user){
      res.status( 401 ).json({
        ok: false,
        errors: {token: {msg: 'Invalid token'}}
      })
    } else {
      (req as CustomRequest).user = user
      next()
    }
  } catch (error) {
    res.status( 401 ).json({
      msg: 'Invalid token'
    })
  }
}
