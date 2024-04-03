import jwt from 'jsonwebtoken'

const JWT_SEED = process.env.JWT_SEED ?? 'SEED'

export class JwtAdapter {
    
    static generateToken(payload: any, duration: string = '2h') {

        return new Promise((resolve) => {
            jwt.sign(payload , JWT_SEED , {expiresIn: duration}, (err, token) => {

                if (err) return resolve(null)

                return resolve(token)
            })
        } )
    }

    static validateToken(token: string) {
        throw new Error('Method not implemented.')
    }

}