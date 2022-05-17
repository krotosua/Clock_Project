import {$authHost, $host} from "./index";


export const createMaster = async (master) => {
    await $authHost.post('api/masters/', master)
}

export const fetchMaster = async (cityId, date, page, limit = 10) => {
    return await $host.get('api/masters/', {params: {cityId, date, page, limit}})
}
export const fetchMastersOrder = async (cityId, date, time, endTime, page, limit) => {
    return await $host.get('api/masters/' + cityId, {params: {cityId, date, time, endTime, page, limit}})
}

export const deleteMaster = async (id) => {
    await $authHost.delete('api/masters/' + id,)

}
export const updateMaster = async (master) => {
    await $authHost.put('api/masters/' + master.id, master)

}