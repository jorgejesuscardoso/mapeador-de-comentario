/* eslint-disable @typescript-eslint/no-explicit-any */
import { UrlBase } from './Base.url'
import axios from 'axios'

const endPoint = UrlBase.prod

export type TRegister = {
  user: string,
  password: string,
  name: string,
  age: number
}

export const Login = async (user: string, password: string) => {
  try {
    const controller = new AbortController()
    const data = { user, password }

    const response = await axios(`${endPoint}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
      signal: controller.signal,
    })

    return response.data

  } catch (err: any) {
    // Se o backend envia uma mensagem de erro, ela será capturada aqui
    const msg = err?.response?.data?.error || 'Erro inesperado no login'
    throw new Error(msg)
  }
}


export const Register = async (data: TRegister) => {
  try {
    const controller = new AbortController()

    const response = await axios(`${endPoint}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
      signal: controller.signal,
    })
    console.log(response)
    return response.data
  } catch (err: any) {
    throw err.response?.data?.message || 'Erro inesperado no login'
  }
}

export const tokenValidate = async (token: string) => {
  try {
    const controller = new AbortController()

    const response = await axios(`${endPoint}/auth?token=${token}`)    

    return response
  } catch (err: any) {
    throw err.response?.data?.message || 'Erro ao validar token!'
  }
}

export const getUser = async () => {
  try {
    const controller = new AbortController()

    const response = await axios(`${endPoint}/users/`)

    return response.data
  } catch (err: any) {
    throw err.response?.data?.message || 'Erro inesperado'
  }
}


export const getUserWtpd = async (id: string) => {
  try {
    const controller = new AbortController()

    const response = await axios(`${endPoint}/users/wtpd/${id}`, {
      method: 'GET',
      signal: controller.signal,
    })

    return response.data
  } catch (err: any) {
    throw err.response?.data?.message || 'Erro inesperado'
  }
}

export const getUserById = async (id: string) => {
  try {
    const controller = new AbortController()

    const response = await axios(`${endPoint}/users/${id}`, {
      method: 'GET',
      signal: controller.signal,
    })

    return response.data
  } catch (err: any) {
    throw err.response?.data?.message || 'Erro inesperado'
  }
}

export const updateTierPoints = async (user: string, points: number, type: any) => {
  try {
    const controller = new AbortController()
    const plusOrMinus = type === 'plus' ? "tierPointsPlus" : 'tierPointsMinus'
    const data = {
      [plusOrMinus]: points
    }
    const response = await axios(`${endPoint}/users/${user}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
      signal: controller.signal,
    })

    return response.data

  } catch (err: any) {
    // Se o backend envia uma mensagem de erro, ela será capturada aqui
    const msg = err?.response?.data?.error || 'Erro inesperado no login'
    throw new Error(msg)
  }
}

export const updatePromotionalTierPoints = async (user: string) => {
  try {
    const controller = new AbortController()
    const data = {
      tierPointsPlus: 10,
      promo: 'start'
    }
    const response = await axios(`${endPoint}/users/promo/${user}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
      signal: controller.signal,
    })

    return response.data

  } catch (err: any) {
    // Se o backend envia uma mensagem de erro, ela será capturada aqui
    const msg = err?.response?.data?.error || 'Erro inesperado no login'
    throw new Error(msg)
  }
}

export const updateUser = async (user: string, data: any) => {
  try {
    const controller = new AbortController()
    const payload = {data}
    const response = await axios(`${endPoint}/users/${user}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
      signal: controller.signal,
    })

    return response.data

  } catch (err: any) {
    // Se o backend envia uma mensagem de erro, ela será capturada aqui
    const msg = err?.response?.data?.error || 'Erro inesperado no login'
    throw new Error(msg)
  }
}

export const deleteUser = async (user: string, adminUser: string) => {
  try {
    const controller = new AbortController()

    const response = await axios(`${endPoint}/users/${user}`, {
      method: "DELETE",
      signal: controller.signal,
      headers: {
        "x-user": adminUser, // 👈 passa o nome/id do admin aqui
      },
    })

    return response.data
  } catch (err: any) {
    throw err.response?.data?.message || "Erro inesperado"
  }
}

export const RequestPasswordReset = async (user: string) => {
  try {
    const controller = new AbortController()
    const data = { user }
    const response = await axios(`${endPoint}/auth/request`, {
      method: 'POST',
      headers: {  
        'Content-Type': 'application/json',
      },
      data: data,
      signal: controller.signal,
    })
    console.log(response)
    return response
  } catch (err: any) {
    const msg = err?.response?.data?.error || 'Erro inesperado ao solicitar código'
    throw new Error(msg)
  }
}

export const ResetPassword = async (user: string, code: string, newPassword: string) => {
  try {
    const controller = new AbortController()
    const data = { user, code, newpassword: newPassword } // ⚡ nome do campo do backend
    
    const response = await axios(`${endPoint}/auth/reset`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
      signal: controller.signal,
    })

    return response.data
  } catch (err: any) {
    const msg = err?.response?.data?.error || 'Erro inesperado ao redefinir senha'
    throw new Error(msg)
  }
}

