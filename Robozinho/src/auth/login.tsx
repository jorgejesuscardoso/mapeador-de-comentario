import { PrismaClient } from "@prisma/client";

class Auth {
    prisma: PrismaClient;
  
    constructor() {
        this.prisma = new PrismaClient();
  }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findFirst({
        where: {
            password,
        },
        });
    
        if (!user) {
        throw new Error("User not found");
        }
    
        return user;
    }
}