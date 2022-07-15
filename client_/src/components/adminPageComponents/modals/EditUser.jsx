import React, {useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputAdornment,
    Modal,
    OutlinedInput,
    TextField,
    Typography
} from "@mui/material";
import {updateUser} from "../../../http/userAPI";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {Controller, useForm} from "react-hook-form";


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
const EditUser = (({open, onClose, userToEdit, alertMessage, getUsers}) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordCheck, setShowPasswordCheck] = useState(false)
    const {
        register,
        handleSubmit,
        trigger,
        setValue,
        control,
        clearErrors,
        getValues,
        formState: {errors, dirtyFields}
    } = useForm();
    const changeUser = async ({email, password}) => {
        const changeInfo = {
            email
        }
        if (password) {
            changeInfo.password = password
        }
        try {
            await updateUser(userToEdit.id, changeInfo)
            await getUsers()
            alertMessage("Успешно измененно", false)
            close()
        } catch (e) {
            alertMessage("Не удалось изменить ", true)
        }
    }
    const close = () => {
        onClose()
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };
    return (
        <Modal
            open={open}
            onClose={close}
        >
            <Box>
                <form onSubmit={handleSubmit(changeUser)}>
                    <Box sx={style}>
                        <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                            Изменить данные пользователя
                        </Typography>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <TextField
                                {...register("email", {
                                    required: "Введите email",
                                    shouldFocusError: false,
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Введите email формата: clock@clock.com"
                                    }
                                })}
                                error={Boolean(errors.email)}
                                sx={{mb: 1}}
                                id="Email"
                                label="Email"
                                variant="outlined"
                                helperText={errors.email?.message}
                                type={"email"}
                                name={"email"}
                                defaultValue={userToEdit.email}
                                required
                                onBlur={() => trigger("email")}
                            />
                            {getValues("editPassword") ?
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <FormControl
                                        error={Boolean(errors.password || errors.passwordCheck?.type === "isSame")}
                                        variant="outlined">
                                        <InputLabel required htmlFor="password">Пароль</InputLabel>
                                        <OutlinedInput
                                            {...register("password", {
                                                required: dirtyFields?.password ? "Введите пароль" : null,
                                                minLength: {
                                                    value: 6,
                                                    message: "Пароль должен вмещать 6 и более символов"
                                                },
                                            })}
                                            autoComplete="new-password"
                                            id="password"
                                            label="Пароль"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            onBlur={() => {
                                                trigger("password")
                                                trigger("passwordCheck")
                                            }}
                                        />
                                        <FormHelperText>{errors.password?.message}</FormHelperText>
                                    </FormControl>
                                    <FormControl sx={{my: 1}} error={Boolean(errors.passwordCheck)}
                                                 variant="outlined">
                                        <InputLabel required htmlFor="passwordCheck">Повторите
                                            пароль</InputLabel>
                                        <OutlinedInput
                                            {...register("passwordCheck", {
                                                required: dirtyFields?.passwordCheck ? "Повторите пароль" : null,
                                                minLength: {
                                                    value: 6,
                                                    message: "Пароль должен вмещать 6 и более символов"
                                                },
                                                validate: {
                                                    isSame: value => dirtyFields?.passwordCheck && dirtyFields?.password ? value === getValues("password") || "Пароли не одинаковые" : null
                                                }
                                            })}
                                            defaultValue=""
                                            autoComplete="new-password"
                                            id="passwordCheck"
                                            label="Повторите пароль"
                                            type={showPasswordCheck ? 'text' : 'password'}
                                            name="passwordCheck"
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                                                        edge="end"
                                                    >
                                                        {showPasswordCheck ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            onBlur={() => {
                                                trigger("passwordCheck")
                                                trigger("password")
                                            }}
                                        />
                                        <FormHelperText>{errors.passwordCheck?.message}</FormHelperText>
                                    </FormControl>
                                </Box> : null}
                            <Box>
                                <FormControlLabel
                                    label="Сменить пароль"
                                    control={
                                        <Controller
                                            name={"editPassword"}
                                            render={({}) => {
                                                return (
                                                    <Checkbox onChange={(e) => {
                                                        setValue("editPassword", e.target.checked)
                                                        setValue("password", null)
                                                        clearErrors(["password", 'passwordCheck'])
                                                    }}/>
                                                );
                                            }}
                                            control={control}
                                        />
                                    }/>
                            </Box>
                            <Box
                                sx={{mt: 2, display: "flex", justifyContent: "space-between"}}
                            >
                                <Button color="success" sx={{flexGrow: 1,}} variant="outlined"
                                        disabled={Object.keys(errors).length !== 0}
                                        type="submit">
                                    Изменить
                                </Button>
                                <Button color="error" sx={{flexGrow: 1, ml: 2}} variant="outlined"
                                        onClick={close}> Закрыть</Button>
                            </Box>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
});

export default EditUser;
