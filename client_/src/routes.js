import Admin from "./pages/Admin";
import {
    ADMIN_CITY_LIST_ROUTE, ADMIN_MASTER_LIST_ROUTE, ADMIN_ORDER_LIST_ROUTE,
    ADMIN_ROUTE, ADMIN_SIZES_ROUTE, ADMIN_USERS_ROUTE,
    LOGIN_ROUTE,
    ORDER_ROUTE,
    REGISTRATION_ROUTE,
    START_ROUTE,
    MASTER_ORDER_ROUTE,
    CUSTOMER_ORDER_ROUTE,ACTIVATED_ROUTE
} from "./utils/consts";
import Customer from "./pages/Customer";
import Start from "./pages/Start";
import Order from "./pages/Order";
import Auth from "./pages/Auth";
import Master from "./pages/Master";
import Activated from "./pages/Activated";


export const adminRoutes = [{
    path: ADMIN_ROUTE,
    Component: Admin
}, {
    path: ADMIN_CITY_LIST_ROUTE,
    Component: Admin
}, {
    path: ADMIN_MASTER_LIST_ROUTE,
    Component: Admin
}, {
    path: ADMIN_ORDER_LIST_ROUTE,
    Component: Admin
},
    {
        path: ADMIN_USERS_ROUTE,
        Component: Admin
    }, {
        path: ADMIN_SIZES_ROUTE,
        Component: Admin
    }
]

export const masterRoutes = [

    {
        path: MASTER_ORDER_ROUTE + '/:id',
        Component: Master
    },

]
export const customerRoutes = [

    {
        path: CUSTOMER_ORDER_ROUTE + '/:id',
        Component: Customer
    },

]
export const publicRoutes = [
    {
        path: START_ROUTE,
        Component: Start
    },
    {
        path: ORDER_ROUTE,
        Component: Order
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: ACTIVATED_ROUTE,
        Component: Activated
    }

]

