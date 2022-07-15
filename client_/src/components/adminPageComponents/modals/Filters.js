import React, {useEffect, useState} from 'react';
import {fetchMasters} from "../../../http/masterAPI";

const Filters = () => {
    const [mastersList, setMastersList] = useState([])
    useEffect(async () => {
        try {
            const res = await fetchMasters(null, null, null, null, null)
            if (res.status === 204) {
                setMastersList([])
                return
            }
            setMastersList(res.data.rows)
        } catch (e) {
            setMastersList([])
        }
    }, [])
    return (
        <div>

        </div>
    );
};

export default Filters;
