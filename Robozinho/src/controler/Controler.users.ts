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

}

export default UsersController;