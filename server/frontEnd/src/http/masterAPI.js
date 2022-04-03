import {$authHost, $host} from "./index";


export const createMaster = async (master) => {
    await $authHost.post('api/master/create/', master)
}

export const fetchMaster = async (cityId, date, page, limit = 10) => {
    return await $host.get('api/master/getAll/', {params: {cityId, date, page, limit}})
}

export const deleteMaster = async (id) => {
    await $authHost.delete('api/master/delete/', {data: {id}})

}
export const updateMaster = async (master) => {
    await $authHost.put('api/master/update/', master)

}