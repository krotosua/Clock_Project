import {$authHost, $host} from "./index";

export const createOrder = async (body) => {
    return await $host.post('api/orders/', body)
}

export const fetchAlLOrders = async (page, limit, sorting, ascending, filters) => {
    return await $authHost.get('api/orders/', {params: {page, limit, sorting, ascending, filters}})

}
export const fetchCustomerOrders = async (id, page, limit, sorting, ascending, filters) => {
    return await $authHost.get('api/orders/' + id, {params: {page, limit, sorting, ascending, filters}})
}
export const fetchMasterOrders = async (id, page, limit, sorting, ascending, filters) => {
    return await $authHost.get('api/orders/master/' + id, {params: {page, limit, sorting, ascending, filters}})
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

