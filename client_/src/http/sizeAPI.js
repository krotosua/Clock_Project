import {$authHost, $host} from "./index";


export const createSize = async (size) => {

    await $authHost.post('api/size/', size)

}

export const fetchSize = async () => {
    const res = await $host.get('api/size/')
    return res
}

export const deleteSize = async (id) => {
    await $authHost.delete(`api/size/delete/`, {data: {id}})


}
export const updateSize = async ({id, name}) => {

    await $authHost.put('api/size/', {id, name})


}