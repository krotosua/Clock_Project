import {$authHost, $host} from "./index";


export const createCity = async (city) => {
    await $authHost.post('api/city/', city)

}

export const fetchCity = async () => {
    const res = await $host.get('api/city/')
    return res
}

export const deleteCity = async (id) => {
    await $authHost.delete('api/city/delete', id)


}
export const updateCity = async ({id, name}) => {

    await $authHost.put('api/city/', {id, name})


}