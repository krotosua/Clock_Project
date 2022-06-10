import {$authHost, $host} from "./index";

export const createOrder = async (body) => {
    await $host.post('api/orders/', body)
}

export const fetchAlLOrders = async (page, limit = 8) => {
    return await $authHost.get('api/orders/', {params: {page, limit}})

}
export const fetchCustomerOrders = async (id, page, limit = 8) => {
    return await $authHost.get('api/orders/' + id, {params: {page, limit}})
}
export const fetchMasterOrders = async (id, page, limit = 8) => {
    return await $authHost.get('api/orders/master/' + id, {params: {page, limit}})
}


export const deleteOrder = async (id) => {
    await $authHost.delete('api/orders/' + id,)

}
export const updateOrder = async (order) => {
    await $authHost.put('api/orders/' + order.id, order)
}
export const finishedOrder = async (order) => {
    await $authHost.put('api/orders/finished/' + order.id, order)
}

