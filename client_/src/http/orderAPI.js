import {$authHost, $host} from "./index";

export const createOrder = async (order) => {
    await $authHost.post('api/order/', order)


}

export const fetchAlLOrders = async () => {
    const data = await $authHost.get('api/order/')
    return data
}
export const fetchUserOrders = async (id) => {
    const data = await $authHost.get('api/order/' + id)
    return data
}


export const deleteOrder = async (id) => {
    await $authHost.delete('api/order/', {data: {id}})

}
export const updateOrder = async () => {
    await $authHost.put('api/order/')

}