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
    throw err.response?.data?.message || 'Erro inesperado no login'
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
