import * as React from 'react';
import {Link, useNavigate} from "react-router-dom";

import Box from "@mui/material/Box";
import {Container} from "@mui/material";

const Activated = () => {
    const navigate = useNavigate()
    return (

        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Container
                maxWidth="xl"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: window.innerHeight - 60,
                }}
            >
          <Box sx={{mt:5}}>
              Поздравляем вы успешно активировали почту
          </Box>
            </Container>
        </Box>

    );
};

export default Activated