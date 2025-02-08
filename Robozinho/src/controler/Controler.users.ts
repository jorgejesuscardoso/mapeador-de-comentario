import UsersServices from "../services/services.users";


class UsersController {
    private service: UsersServices;

  constructor(service: UsersServices) {
    this.service = service
  }

  async getUsers() {
    try {
        const users = await this.service.getUsers();
        return users;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async getAdms() {
    try {
        const users = await this.service.getAdms();
        return users;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async updateAdm(id: number, data: any) {
    try {
        const user = await this.service.updateAdm(id, data);
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async updateUser(id: number, data: any) {
    try {
        const user = await this.service.updateUser(id, data);
        console.log(user);
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

}

export default UsersController;