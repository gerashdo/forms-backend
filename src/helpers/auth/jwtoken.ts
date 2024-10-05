import jwt from 'jsonwebtoken'
import User from '../../models/User'
import { TokenPayload } from '../../interfaces/auth/token'


export const generateJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload: TokenPayload = {uid}
    jwt.sign(payload, process.env.JWTSECRET_KEY, {
      expiresIn: '72h'
    }, (error, token) => {
      if(error){
        console.log(error)
        reject('The token could not be generated')
      }else{
        resolve(token)
      }
    })
  })
}

export const verifyToken = async (token?: string): Promise<User | null> => {
  if(!token || token.length < 10){
    return null
  }
  const decoded = jwt.verify(token, process.env.JWTSECRET_KEY)
  const {uid} = decoded as TokenPayload
  const user = await User.findOne({where: {id: uid}})

  if(user){
    return user
  }else{
    return null
  }
}
