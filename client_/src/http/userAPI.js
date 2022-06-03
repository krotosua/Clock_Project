import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (email, password,role,name,cities) => {
    const {data} = await $host.post('api/users/registration/', {email, password,role,name,cityId:cities})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
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
export const fetchUsers = async (page, limit = 8) => {
    return await $authHost.get('api/users/', {params: {page, limit}})
}
export const deleteUser = async (id) => {
    await $authHost.delete('api/users/' + id,)


}