import React, {useContext} from 'react';
import {Routes, Route, Navigate} from "react-router-dom"
import {adminRoutes, customerRoutes, masterRoutes, publicRoutes} from "../routes";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const AppRouter = observer(() => {
    const {user} = useContext(Context)

    return (
        <Routes>
            {user.userRole === 'ADMIN' && adminRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component/>} exact/>
            )}
            {user.userRole === 'MASTER'&&user.isAuth &&user.user.isActivated && masterRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component/>} exact/>
            )}
            {user.userRole === 'CUSTOMER'&&user.isAuth &&user.user.isActivated && customerRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component/>} exact/>
            )}
            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component/>} exact/>
            )}
            <Route
                path="*"
                element={<Navigate to="/"/>}
            />
        </Routes>
    );
});

export default AppRouter;