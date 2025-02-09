import UsersModel from "../model/model.users";


class UsersServices {    
  private model: UsersModel;

  constructor(model: UsersModel) {
    this.model = model;
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

  async getAdms() {
    try {
        const users = await this.model.getAdms();
        
        return users;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async updateAdm(id: number, data: any) {
    try {
      
      const sanitizedData = {
        name: data.name,
        phone: data.phone,
        age: data.age && +data.age,
        userWtp: data.userWtp,
        user: data.user,
        points: data.points && +data.points,
      }
        const user = await this.model.updateAdm(id, sanitizedData);
        
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
          user: data.user,
          points: data.points && +data.points,
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