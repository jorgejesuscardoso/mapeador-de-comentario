import UsersModel from "../model/model.users";
import Bcrypt from "../auth/bcrypt";


class UsersServices {    
  private model: UsersModel;
  bcrypt: Bcrypt

  constructor(
    model: UsersModel,
    bcrypt: Bcrypt
  ) {
    this.model = model;
    this.bcrypt = bcrypt;
  }

  async createUser(data: any) {
    try {
        
      const passWord = data.password;
      const hash = await  this.bcrypt.hashPassword(passWord);

      data.password = hash;
      const user = await this.model.createUser(data);
        
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async getUsers(take: number, page: number) {
    try {
        
        const users = await this.model.getUsers(take, page) as unknown as [];
       
        return users;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async getUserById(id: number) {
    try {
        const user = await this.model.getUserById(id);
        
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async getDeletedUsers(take: number, page: number) {
    try {
        const users = await this.model.getDeletedUsers(take, page) as unknown as [];
        
        return users;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getAllUsers() {
    try {
        const users = await this.model.getAllUsers() as unknown as [];
        
        return users;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async searchUser(search: string, take: number, page: number) {
    try {

        const user = await this.model.searchUser(search, take, page);
        if (!user) {
            return { message: "User not found" };
        }
        
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async updateUser(id: number, data: any) {
    try {
      
        const sanitizedData = {
          name: data.name,
          phone: data.phone,
          age: data.age && +data.age,
          userWtp: data.userWtp,
          user: typeof(data.user) === 'string' ? data.user : undefined,
          points: data.points && +data.points,
          subRole: data.subRole,
          role: data.role,
          password: data.password,
          subs: data.subs,
          isDeleted: data.isDeleted,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
        
        const user = await this.model.updateUser(id, sanitizedData);
        
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async deleteUser(id: number) {
    try {
        const user = await this.model.deleteUser(id);
        
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

}

export default UsersServices;