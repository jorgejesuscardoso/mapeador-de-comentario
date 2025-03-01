import UsersServices from "../services/services.users";


class UsersController {
    private service: UsersServices;

  constructor(service: UsersServices) {
    this.service = service
  }

  async createUser(data: any) {
    try {
        const user = await this.service.createUser(data);
        return user;
    } catch (error) {
        console.log(error);
        return error;
    }
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

  async getUserById(id: number) {
    try {
        const user = await this.service.getUserById(id);
        return user;
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