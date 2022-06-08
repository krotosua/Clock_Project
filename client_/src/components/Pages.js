import * as React from 'react';
import {Pagination, Stack} from '@mui/material';
import {observer} from "mobx-react-lite";
import {useState} from "react";


const Pages = observer(({context}) => {
    const [currentPage, setCurrentPage] = useState(context.page);
    const pageCount = Math.ceil(context.totalCount / context.limit)
    const handleChange = (event, value) => {
        setCurrentPage(value);
        context.setPage(value)
    };


    return (
        <Stack spacing={2} sx={{my: 2}}>
            <Pagination color='warning'
                        count={pageCount}
                        page={currentPage}
                        onChange={handleChange}/>
        </Stack>

    );
})
export default Pages
