import {$authHost, $host} from "./index";
import jwt_decode from "jwt-decode";

export const registration = async (userData) => {
    await $host.post('api/users/registration/', userData)

}
export const registrationFromAdmin = async (userData) => {
    await $host.post('api/users/registrationAdmin/', userData)

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
    return await $host.get('api/users/checkEmail/', {params: {email: email}})

}
export const fetchUsers = async (page, limit) => {
    return await $authHost.get('api/users/', {params: {page, limit}})
}
export const deleteUser = async (id) => {
    await $authHost.delete('api/users/' + id,)
}
export const updateUser = async (userId, data) => {
    await $authHost.put('api/users/' + userId, data)
}
export const activateUser = async (user) => {
    await $authHost.put('api/users/activate/' + user.id, user)

}