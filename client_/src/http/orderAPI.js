import {$authHost, $host} from "./index";

export const createOrder = async (order) => {
    await $host.post('api/order/create/', order)


}

export const fetchAlLOrders = async (page, limit = 8) => {
    return await $authHost.get('api/order/allOrders/', {params: {page, limit}})

}
export const fetchUserOrders = async (id, page, limit = 8) => {
    return await $authHost.get('api/order/userOrders/' + id, {params: {page, limit}})
}


export const deleteOrder = async (id) => {
    await $authHost.delete('api/order/delete/', {data: {id}})

}
export const updateOrder = async () => {
    await $authHost.put('api/order/update/')

}
export const sendMessage = async (order) => {
    await $host.post('api/order/message/', order)
}