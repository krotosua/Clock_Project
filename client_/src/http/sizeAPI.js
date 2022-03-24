import {$authHost, $host} from "./index";


export const createSize = async (size) => {

    await $authHost.post('api/size/create/', size)

}

export const fetchSize = async (page, limit = 10) => {
    return await $host.get('api/size/getSizes/', {params: {page, limit}})

}

export const deleteSize = async (id) => {
    await $authHost.delete(`api/size/delete/`, {data: {id}})


}
export const updateSize = async (changeInfo) => {
    await $authHost.put('api/size/update/', changeInfo)


}