import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Divider, Grow, Modal} from "@mui/material";
import {fetchPhotos} from "../../../http/orderAPI";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    whiteSpace: "pre-line",
    maxHeight: 800,
    overflowY: "auto",
    overflowX: "hidden",
    wordBreak: "break-word"
};
const PhotoList = ({open, onClose, photosId}) => {
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)
    const close = () => {
        onClose()
    }
    useEffect(async () => {
        try {
            const res = await fetchPhotos(photosId)
            if (res.status === 204) {
                setPhotos([])
                setLoading(false)
                return
            }
            setPhotos(res.data[0].photoLinks)
            setLoading(false)
        } catch (e) {
            setLoading(false)
        }
    }, [])
    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>
                    {loading ? <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <CircularProgress/>
                        </Box> :
                        <Box>
                            <h3>Фото:</h3>
                            <Divider/>
                            {photos.length === 0 ? <Box>
                                    Список пуст
                                </Box> :
                                photos.map((photo, index) => {
                                    return (
                                        <Grow in={!!photo} key={index}>
                                            <Box key={index} sx={{mt: 2}}>
                                                <img src={photo} width="450"/>
                                            </Box>
                                        </Grow>
                                    )
                                })
                            }
                        </Box>
                    }</Box>
            </Modal>
        </div>
    );
};

export default PhotoList;
