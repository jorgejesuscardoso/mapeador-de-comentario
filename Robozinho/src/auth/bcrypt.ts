import bcrypt from 'bcryptjs';
class Bcrypt {
    private bcrypt: any;
    constructor(
    ) {
        this.bcrypt = bcrypt;
    }

    public async hashPassword(password: string): Promise<string> {
        return this.bcrypt.hash(password, 10);
    }

    public async comparePassword(password: string, hash: string): Promise<boolean> {
        return this.bcrypt.compare(password, hash);
    }

}

export default Bcrypt;