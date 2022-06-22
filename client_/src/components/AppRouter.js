import React, {useContext} from 'react';
import {Navigate, Route, Routes} from "react-router-dom"
import {adminRoutes, customerRoutes, masterRoutes, publicRoutes} from "../routes";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {ROLE_LIST} from "../store/UserStore";

const AppRouter = observer(() => {
    const {user} = useContext(Context)

    return (<Routes>
        {user.userRole === ROLE_LIST.ADMIN && adminRoutes.map(({path, Component}) => <Route key={path} path={path}
                                                                                            element={<Component/>}
                                                                                            exact/>)}
        {user.userRole === ROLE_LIST.MASTER && user.isAuth && user.user.isActivated && masterRoutes.map(({
                                                                                                             path,
                                                                                                             Component
                                                                                                         }) => <Route
            key={path} path={path} element={<Component/>} exact/>)}
        {user.userRole === ROLE_LIST.CUSTOMER && user.isAuth && user.user.isActivated && customerRoutes.map(({
                                                                                                                 path,
                                                                                                                 Component
                                                                                                             }) =>
            <Route
                key={path} path={path} element={<Component/>} exact/>)}
        {publicRoutes.map(({path, Component}) => <Route key={path} path={path} element={<Component/>} exact/>)}
        <Route
            path="*"
            element={<Navigate to="/"/>}
        />
    </Routes>);
});

export default AppRouter;