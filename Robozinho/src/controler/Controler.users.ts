import UsersServices from "../services/services.users";
import Bcrypt from "../auth/bcrypt";


class UsersController {
    private service: UsersServices;
    private bcrypt: Bcrypt;

  constructor(
      service: UsersServices,
      bcrypt: Bcrypt
    ) {
      this.bcrypt = bcrypt;
      this.service = service
    }

  async createUser(data: any) {
    try {
        const passWord = data.password;
        const hash =  this.bcrypt.hashPassword(passWord);

        console.log(hash);
        data.password = hash;
        const user = await this.service.createUser(data);
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async getUsers(take: number = 10, page: number = 1) {
    try {
        const users = await this.service.getUsers(take, page);
        return users;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async getUserById(id: number) {
    try {
        const user = await this.service.getUserById(id);
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async getDeletedUsers(take: number = 10, page: number = 1) {
    try {
        const users = await this.service.getDeletedUsers(take, page);
        return users;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async getAllUsers() {
    try {
        const users = await this.service.getAllUsers();
        return users;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async searchUser(data: any) {    
    try {
        // Desestruturando os parâmetros da query
        const { search, take, page } = data;

        // Verificando e definindo valores padrões
        const takeNumber = +take > 0 ? +take : 10; // Definindo o 'take' como 10 caso não seja passado ou inválido
        const pageNumber = +page > 0 ? +page : 1; // Definindo o 'page' como 1 caso não seja passado ou inválido

        // Realizando a busca com os parâmetros
        const user = await this.service.searchUser(search, takeNumber, pageNumber);

        return user;
    } catch (error) {
        console.log(error);
        return { error: "Ocorreu um erro ao buscar os usuários" }; // Retornando um erro mais amigável
    }
  }

  async updateUser(id: number, data: any) {
    try {
      const user = await this.service.updateUser(id, data);
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

  async deleteUser(id: number) {
    try {
        const user = await this.service.deleteUser(id);
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
  }

}

export default UsersController;