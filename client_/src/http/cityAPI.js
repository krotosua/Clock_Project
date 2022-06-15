import {$authHost, $host} from "./index";


export const createCity = async (city) => {
    await $authHost.post('api/cities/', city)

}

export const fetchCity = async (page, limit = 10) => {
    return await $host.get('api/cities/', {params: {page, limit}})

}

export const deleteCity = async (id) => {
    await $authHost.delete(`api/cities/` + id)


}
export const updateCity = async (cityInfo) => {
    await $authHost.put('api/cities/' + cityInfo.id, cityInfo)
}