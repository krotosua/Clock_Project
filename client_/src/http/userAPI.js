import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (email, password, isMaster,name,cities) => {
  await $host.post('api/users/registration/', {email, password,isMaster,name,cityId:cities})
    return
}
export const registrationFromAdm = async (email, password, isMaster,isActivated,name,cities,) => {
      await $host.post('api/users/registrationAdm/', {email, password,isMaster,name,cityId:cities,isActivated})
    return
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/users/login/', {email, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/users/auth/')
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}
export const checkEmail = async (email) => {

     let result = await $host.get('api/users/checkEmail/', {params: {email: email}})
    return result
}
export const fetchUsers = async (page, limit = 8) => {
    return await $authHost.get('api/users/', {params: {page, limit}})
}
export const deleteUser = async (id) => {
    await $authHost.delete('api/users/' + id,)
}
export const updateUser = async (userId,data) => {

    await $authHost.put('api/users/' + userId,data)
}