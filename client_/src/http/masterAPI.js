import {$authHost, $host} from "./index";


export const createMaster = async (master) => {
    await $authHost.post('api/masters/admin/', master)
}

export const fetchMasters = async (cityId, date, page, limit = 10) => {
    return await $host.get('api/masters/', {params: {cityId, date, page, limit}})
}
export const fetchMastersForOrder = async (cityId, date, time, sizeClock, page, limit) => {
    return await $host.get('api/masters/' + cityId, {params: {cityId, date, time, sizeClock, page, limit}})
}

export const deleteMaster = async (id) => {
    await $authHost.delete('api/masters/' + id,)

}
export const updateMaster = async (master) => {
    await $authHost.put('api/masters/' + master.id, master)

}
export const activateMaster = async (master) => {
    await $authHost.put('api/masters/activate/' + master.id, master)

}