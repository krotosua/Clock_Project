import React, {useEffect, useState} from 'react';
import {Box, CircularProgress, Divider, Modal, Rating, TextField, Typography} from "@mui/material";
import {fetchReviews} from "../http/masterAPI";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const ReviewModal = ({open, onClose, masterId}) => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const close = () => {
        onClose()
    }
    useEffect(async () => {
        try {
            const res = await fetchReviews(masterId)
            if (res.data.count === 0) {
                setLoading(false)
                return
            }
            setLoading(false)
            setReviews(res.data.rows)
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
                            <h3>Отзывы:</h3>
                            <Divider/>
                            {reviews.length === 0 ? <Box>
                                    Список пуст
                                </Box> :
                                reviews.map(review => {
                                    return (
                                        <Box key={review.id} sx={{mb: 1}}>
                                            <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                                <Typography variant="h5" gutterBottom component="div">
                                                    {review.user.customer.name}
                                                </Typography>
                                                <Box>{
                                                    <Rating name="read-only" value={review.rating}
                                                            precision={0.5} readOnly/>}
                                                </Box>

                                            </Box>
                                            {review.review ? <TextField
                                                fullWidth
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                variant="standard"
                                                id="review"
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        cursor: "default"
                                                    }
                                                }}
                                                multiline
                                                value={review.review}
                                            /> : null}
                                            <Divider sx={{mt: 1}}/>
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                    }</Box>
            </Modal>
        </div>
    );
};

export default ReviewModal;
