import {$authHost, $host} from "./index";

export const createOrder = async (order, message) => {
    await $host.post('api/orders/', {order, message})


}

export const fetchAlLOrders = async (page, limit = 8) => {
    return await $authHost.get('api/orders/', {params: {page, limit}})

}
export const fetchUserOrders = async (id, page, limit = 8) => {
    return await $authHost.get('api/orders/' + id, {params: {page, limit}})
}


export const deleteOrder = async (id) => {
    await $authHost.delete('api/orders/' + id,)

}
export const updateOrder = async (order) => {
    await $authHost.put('api/orders/' + order.id, order)

}
