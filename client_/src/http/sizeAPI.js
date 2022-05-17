import {$authHost, $host} from "./index";


export const createSize = async (size) => {

    await $authHost.post('api/sizes/', size)

}

export const fetchSize = async (page, limit = 10) => {
    return await $host.get('api/sizes/', {params: {page, limit}})

}

export const deleteSize = async (id) => {
    await $authHost.delete(`api/sizes/` + id,)


}
export const updateSize = async (changeInfo) => {
    await $authHost.put('api/sizes/' + changeInfo.id, changeInfo)


}