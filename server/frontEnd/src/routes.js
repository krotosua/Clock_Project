import Admin from "./pages/Admin";
import {
    ADMIN_CITY_LIST_ROUTE, ADMIN_MASTER_LIST_ROUTE, ADMIN_ORDER_LIST_ROUTE,
    ADMIN_ROUTE, ADMIN_SIZES_ROUTE, ADMIN_USERS_ROUTE,
    LOGIN_ROUTE,
    ORDER_ROUTE,
    REGISTRATION_ROUTE,
    START_ROUTE,
    USER_ORDER_ROUTE
} from "./utils/consts";
import User from "./pages/User";
import Start from "./pages/Start";
import Order from "./pages/Order";
import Auth from "./pages/Auth";

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
export const authRoutes = [

    {
        path: USER_ORDER_ROUTE + '/:id',
        Component: User
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
    }

]

