import {$authHost, $host} from "./index";

export const createOrder = async (body) => {
    return await $host.post('api/orders/', body)
}

export const fetchAlLOrders = async (page, limit) => {
    return await $authHost.get('api/orders/', {params: {page, limit}})

}
export const fetchCustomerOrders = async (id, page, limit) => {
    return await $authHost.get('api/orders/' + id, {params: {page, limit}})
}
export const fetchMasterOrders = async (id, page, limit = 8) => {
    return await $authHost.get('api/orders/master/' + id, {params: {page, limit}})
}


export const deleteOrder = async (id) => {
    return await $authHost.delete('api/orders/' + id,)

}
export const updateOrder = async (order) => {
    return await $authHost.put('api/orders/' + order.id, order)
}
export const statusChangeOrder = async (order) => {
    return await $authHost.put('api/orders/statusChange/' + order.id, order)
}
export const payPalChangeOrder = async (order) => {
    return await $host.put('api/orders/payPal/' + order.id, order)
}

