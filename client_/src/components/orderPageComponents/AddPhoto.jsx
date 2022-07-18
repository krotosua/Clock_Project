import React from 'react';
import {Box, Grow, IconButton, Typography} from "@mui/material";
import {PhotoCamera} from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import Button from "@mui/material/Button";
import {useFormContext} from "react-hook-form";

const PHOTO_HEIGHT = 150
const PHOTO_WIDTH = 150
const MAX_PHOTO_SIZE = 1024 * 1024
const ALLOWED_FORMATS = {
    JPEG: "image/jpeg",
    PNG: "image/png"
}
const AddPhoto = ({alertMessage}) => {
    const {watch, setValue} = useFormContext();
    const photos = watch("photos")

    const uploadPhoto = (file) => {
        if (!file) {
            return
        }
        if (file.type !== ALLOWED_FORMATS.JPEG && file.type !== ALLOWED_FORMATS.PNG) {
            alertMessage("Неподходящий формат.Требуется JPEG/PNG", true)
            return
        }
        if (file.size > MAX_PHOTO_SIZE) {
            alertMessage("Фото должно весить меньше 1 мб", true)
            return
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if (photos?.find(photo => photo === reader.result)) {
                alertMessage("Данное фото уже добавленно", true)
                return
            }
            setValue("photos", [...photos, reader.result])
        };
    }
    const removePhoto = (photoDelete) => {
        setValue("photos", [...photos.filter(photo => photo !== photoDelete)])
    }
    return (
        <div>
            <Typography>Можете добавить фото:</Typography>
            <Box sx={{display: 'flex'}}>

                {photos.length !== 0 ? photos.map((photo, index) => {

                    return (
                        <Grow in={!!photo} key={index}>
                            <Box
                                sx={{
                                    opacity: 1,
                                    transition: " 0.55s opacity, 0.55s visibility",
                                    display: 'flex',
                                    backgroundImage: `url(${photo})`,
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    width: PHOTO_WIDTH,
                                    height: PHOTO_HEIGHT,
                                    position: "relative",
                                    ml: 1,
                                }}>
                                <Box sx={{position: "absolute", right: 0, top: 0}}>
                                    <IconButton sx={{color: '#fff'}}
                                                aria-label="upload picture"
                                                component="label"
                                                onClick={() => removePhoto(photo)}>
                                        <ClearIcon/>
                                    </IconButton>
                                </Box>
                            </Box>
                        </Grow>
                    )

                }) : null}
                {photos.length < 5 ?
                    <Button sx={{ml: 2}} variant="outlined" component="label" startIcon={<PhotoCamera/>}>
                        Добавить
                        <input hidden accept={`${Object.values(ALLOWED_FORMATS)}`} type="file"
                               onChange={event => uploadPhoto(event.target.files[0])}/>
                    </Button> : null}

            </Box>
        </div>
    );
};

export default AddPhoto;
