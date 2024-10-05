import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import User from '../../models/User';


export interface TokenPayload extends JwtPayload {
  uid: string;
}

export interface CustomRequest extends Request {
  user: User;
 }
