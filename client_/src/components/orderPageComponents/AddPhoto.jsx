import React from 'react';
import {Box, Grow, IconButton, Typography} from "@mui/material";
import {PhotoCamera} from "@mui/icons-material";
import ClearIcon from '@mui/icons-material/Clear';
import Button from "@mui/material/Button";
import {useFormContext} from "react-hook-form";
import _ from "lodash";

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


    const uploadPhoto = async (files) => {
        if (!files) {
            return
        }
        const readerArr = []
        for (let i = 0; readerArr.length + photos.length < 5 && i < files.length; i++) {
            if (!Object.values(ALLOWED_FORMATS).includes(files[i].type)) {
                alertMessage("Неподходящий формат.Требуется JPEG/PNG", true)
                return
            }
            if (files[i].size > MAX_PHOTO_SIZE) {
                alertMessage("Фото должно весить меньше 1 мб", true)
            } else {
                let reader = new FileReader();
                readerArr.push(new Promise(resolve => {
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(files[i]);
                }))
            }
        }
        const allLinks = await Promise.all(readerArr);
        const validLinks = _.difference(allLinks, photos)
        if (allLinks.length !== validLinks.length) {
            alertMessage("Некоторые фотографии уже добавлены", true)
        }
        setValue("photos", [...photos, ...validLinks])
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
                        <input hidden multiple accept={`${Object.values(ALLOWED_FORMATS)}`} type="file"
                               onChange={event => uploadPhoto(event.target.files)}/>
                    </Button> : null}

            </Box>
        </div>
    );
};

export default AddPhoto;
