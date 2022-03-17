import {$authHost, $host} from "./index";


export const createMaster = async (master) => {

    await $authHost.post('api/master/', master)

}

export const fetchMaster = async (cityId, date) => {
    const res = await $host.get('api/master/', {params: {cityId, date}})
    return res
}

export const deleteMaster = async (id) => {
    await $authHost.delete('api/master/delete', {data: {id}})

}
export const updateMaster = async (master) => {
    await $authHost.put('api/master/', master)

}