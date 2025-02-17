import UsersModel from "../model/model.users";


class UsersServices {    
  private model: UsersModel;

  constructor(model: UsersModel) {
    this.model = model;
  }

  async createUser(data: any) {
    try {
        const user = await this.model.createUser(data);
        
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async getUsers() {
    try {
        const users = await this.model.getUsers() as unknown as [];
       
        return users;
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
          user: data.user,
          points: data.points && +data.points,
          subRole: data.subRole,
          role: data.role,
          password: data.password,
          subs: data.subs,
        }
        const user = await this.model.updateUser(id, sanitizedData);
        
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

}

export default UsersServices;