import {$authHost, $host} from "./index";


export const createCity = async (city) => {
    await $authHost.post('api/city/create/', city)

}

export const fetchCity = async (page, limit = 10) => {
    return await $host.get('api/city/allCity/', {params: {page, limit}})

}

export const deleteCity = async (id) => {
    await $authHost.delete(`api/city/delete/`, {data: {id}})


}
export const updateCity = async ({id, name}) => {
    await $authHost.put('api/city/update/', {id, name})
}