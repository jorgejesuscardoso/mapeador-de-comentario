import jwt from 'jsonwebtoken'


class Jwt {
    private secret: string
    private expiresIn: number

    constructor(
        secret: string,
        expiresIn: number
    ) {
        this.secret = secret
        this.expiresIn = expiresIn
    }

    sign(payload: any) {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn })
    }

    verify(token: string) {
        return jwt.verify(token, this.secret)
    }

    decode(token: string) {
        return jwt.decode(token)
    }
}

export default Jwt;