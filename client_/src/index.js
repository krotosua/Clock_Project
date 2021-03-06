import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from './store/UserStore';
import OrderStore from "./store/OrderStore";
import CityStore from "./store/CityStore";
import MasterStore from "./store/MasterStore";
import SizeStore from "./store/SizeStore";
import "./style.css"


export const Context = createContext(null)

ReactDOM.render(
    <Context.Provider value={{
        user: new UserStore(),
        orders: new OrderStore(),
        cities: new CityStore(),
        masters: new MasterStore(),
        size: new SizeStore()
    }}>

        <App/>

    </Context.Provider>,

    document.getElementById('root')
);

