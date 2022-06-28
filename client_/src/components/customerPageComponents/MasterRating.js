import React, {useState} from 'react';
import {Box, Button, Modal, Rating, TextField, Typography} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import {ratingMaster} from "../../http/masterAPI";

const labels = {
    0.5: "😡",
    1: '😖',
    1.5: '😠',
    2: '😞',
    2.5: '😒',
    3: '😑',
    3.5: '😌',
    4: '😋',
    4.5: '😇',
    5: '🙀',
};
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

const getLabelText = (value) => {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const MasterRating = ({open, onClose, dataForEdit, getOrders, alertMessage}) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(-1);
    const [review, setReview] = useState("")
    const sendRating = async () => {
        const post = {
            rating: rating,
            review: review,
            orderId: dataForEdit.orderId,
            masterId: dataForEdit.masterId,
            userId: dataForEdit.userId,
        }
        try {
            await ratingMaster(post)
            getOrders()
            alertMessage('Отзыв отправлен', false)
            close()
        } catch (e) {
            alertMessage('Не удалось отправить отзыв', true)
        }
    }

    const close = () => {
        setRating(0)
        onClose()
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={close}
            >
                <Box sx={style}>
                    <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                        Оценить работу мастера
                    </Typography>
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <Box
                            sx={{
                                width: 200,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Rating
                                name="hover-feedback"
                                size="large"
                                value={rating}
                                precision={0.5}
                                getLabelText={getLabelText}
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                }}
                                emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
                            />
                            {!rating && (
                                <Box sx={{ml: 2, fontSize: 25}}>{labels[hover !== -1 ? hover : rating]}</Box>
                            )}
                        </Box>
                        <TextField
                            fullWidth
                            error={1000 < review.length}
                            rows={4}
                            id="review"
                            label="Оставьте свой комментарий"
                            helperText={`Символов осталось: ${1000 - review.length}`}
                            multiline
                            value={review}
                            onChange={(e) => 1000 > review.length
                            || e.nativeEvent.inputType === "deleteContentBackward" ? setReview(e.target.value) : null}
                        />
                    </Box>
                    <Box
                        sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                    >
                        <Button color="success" disabled={1000 < review.length} sx={{flexGrow: 1}} variant="outlined"
                                onClick={sendRating}
                        > Отправить отзыв</Button>
                        <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                onClick={close}> Закрыть</Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default MasterRating;
