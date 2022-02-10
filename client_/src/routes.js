import Admin from "./pages/Admin";
import {
    ADMIN_ROUTE,
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

export const authRoutes=[
{
    path:ADMIN_ROUTE,
    Component: Admin
},
    {
        path:USER_ORDER_ROUTE,
        Component: User
}
]
export const publicRoutes= [
        {
            path:START_ROUTE,
            Component: Start
        },
{
    path:ORDER_ROUTE,
    Component: Order
},
{
    path:REGISTRATION_ROUTE,
    Component: Auth
},
{
    path:LOGIN_ROUTE,
    Component: Auth
}

]

