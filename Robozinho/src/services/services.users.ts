import UsersModel from "../model/model.users";


class UsersServices {    
  private model: UsersModel;

  constructor(model: UsersModel) {
    this.model = model;
  }

  async getUsers() {
    try {
        const users = await this.model.getUsers() as unknown as [];
        console.log(users);
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

}

export default UsersServices;