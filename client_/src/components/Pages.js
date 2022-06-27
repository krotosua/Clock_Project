import * as React from 'react';
import {useState} from 'react';
import {Pagination, Stack} from '@mui/material';
import {useDispatch} from "react-redux";


const Pages = ({store, pagesFunction}) => {
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(store.page);
    const pageCount = Math.ceil(store.totalCount / store.limit)
    const handleChange = (event, value) => {
        setCurrentPage(value);
        dispatch(pagesFunction(value))
    };


    return (
        <Stack spacing={2} sx={{my: 2}}>
            <Pagination color='warning'
                        count={pageCount}
                        page={currentPage}
                        onChange={handleChange}/>
        </Stack>

    );
}
export default Pages
