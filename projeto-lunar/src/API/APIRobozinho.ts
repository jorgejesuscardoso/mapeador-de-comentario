/* eslint-disable @typescript-eslint/no-explicit-any */

import { UrlBase } from "./UrlBase";

const endPoint = UrlBase.dev;
const token: string | null = localStorage.getItem('token');
const cleanToken = token ? token.replace(/"/g, '') : null;


export const Robozinho = async (wUser: string, wUrl: string) => {
    const controller = new AbortController();
    //const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/getComments`;
    try {
        const body = {
            wUser,
            wUrl
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar comentários.");
    }
}

export const FindBooks = async (id: string) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout    
    const url = `${endPoint}/getBooks/${id}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar livros.");
    } finally {
        clearTimeout(timeout);
    }
}

export const LoginApi = async (user: string, password: string) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/auth`;

    try {
        const body = {
            user,
            password
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar livros.");
    } finally {
        clearTimeout(timeout);
    }
}

export const CreateUser = async (body: any) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/create/users`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanToken}`
            },
            body: JSON.stringify(body),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar livros.");
    } finally {
        clearTimeout(timeout);
    }
}

export const GetUsers = async (qtdItens: number, pagination: number) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/users?take=${qtdItens}&page=${pagination}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanToken}`
            },
            signal: controller.signal
        });
        

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        return data;
    } catch (err) {
        return (err || "Erro ao buscar livros.");
    } finally {
        clearTimeout(timeout);
    }
}

export const GetUsersById = async (id: number) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/users/${id}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar usuário.");
    } finally {
        clearTimeout(timeout);
    }
}

export const GetALlUsersNoPagination = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/users/all`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanToken}`
            },
            signal: controller.signal
        });

        if (response.status === 401) {
            return response;
        }

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar usuário.");
    } finally {
        clearTimeout(timeout);
    }
}

export const GetDeletedUsers = async (qtdItens: number, pagination: number) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/users/deleted?take=${qtdItens}&page=${pagination}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanToken}`
            },
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar usuário.");
    } finally {
        clearTimeout(timeout);
    }
}

export const SearchUser = async (search: string, take: number, page: number) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/search/users?search=${search}&take=${take}&page=${page}`;

    try {

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanToken}`
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar usuário.");
    } finally {
        clearTimeout(timeout);
    }
};

export const UpdateUser = async (id: number, body: any) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/users/${id}`;

    try {      
       
      console.log(body);
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanToken}`
            },
            body: JSON.stringify(body),
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar livros.");
    } finally {
        clearTimeout(timeout);
    }
};

export const DeleteUser = async (id: number) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 40s timeout
    const url = `${endPoint}/users/${id}`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cleanToken}`
            },
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        return (err || "Erro ao buscar livros.");
    } finally {
        clearTimeout(timeout);
    }
};