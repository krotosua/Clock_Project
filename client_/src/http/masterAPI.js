import {$authHost, $host} from "./index";


export const createMaster = async (master) => {
    await $authHost.post('api/master/', master)

}

export const fetchMaster = async () => {
    const res = await $host.get('api/master/')
    return res
}

export const deleteMaster = async (id) => {
    await $authHost.delete('api/master/delete', id)

}
export const updateMaster = async () => {
    await $authHost.put('api/master/')
}