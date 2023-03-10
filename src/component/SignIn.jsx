import { useCookies } from 'react-cookie';
import { useState } from 'react';
import { Avatar, Button, Checkbox, Container, FormControlLabel, Grid, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { uniAlert } from '../utils/commonUtil';
import { useNavigate } from 'react-router-dom';
import { useAuthDispatch } from '../contexts/authContext';
import { setLocalStorage } from '../utils/localStorage';

const SignIn = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['saveId']);
    const navigate = useNavigate();
    const authDispatch = useAuthDispatch();
    // 초, 분, 시간, 날짜로 계산함.
    const cookieMaxAge = 60 * 60 * 24 * 30;

    const [loginInfo, setLoginInfo] = useState({
        id: cookies.saveId || '',
        pw: '',
    });

    const [isSave, setIsSave] = useState(!!cookies.saveId);
    const { id, pw } = loginInfo;

    /**
     * ID, Pw 입력 시 이벤트
     * @param e
     */
    const onLoginInfoHandler = (e) => {
        setLoginInfo({
            ...loginInfo,
            [e.currentTarget.name]: e.currentTarget.value,
        });
    };

    /**
     * ID 저장하기 체크 이벤트
     * @param e
     */
    const onIdSaveHandler = (e) => {
        const currentCheck = e.target.checked;
        setIsSave(currentCheck);
        if (currentCheck) {
            setCookie('saveId', id, { maxAge: cookieMaxAge });
        } else {
            removeCookie('saveId');
        }
    };

    /**
     * 로그인 버튼 클릭시 이벤트
     * @param e
     */

    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (isSave) setCookie('saveId', id, { maxAge: cookieMaxAge });
        axios.post('/auth/login', { id, pw })
            .then((res) => {
                const responseData = res.data;
                setLocalStorage('token', responseData.returnData.token);
                authDispatch({
                    type    : 'SET_AUTH',
                    authInfo: responseData.returnData.authInfo,
                });
                uniAlert({ returnMessage: responseData.returnMessage, timer: 1000 }, () => {
                    navigate('/');
                });
            })
            .catch(err => console.log(err));
    };

    return (
        <Container maxWidth='xs'>
            <Box
                sx={{
                    marginTop    : 8,
                    display      : 'flex',
                    flexDirection: 'column',
                    alignItems   : 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} />
                <Typography component='h1' variant='h5'>
                    Sign in
                </Typography>
                <Box component='form' noValidate sx={{ mt: 3 }} onSubmit={onSubmitHandler}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant='standard'
                                fullWidth
                                id='id'
                                label='ID'
                                name='id'
                                autoComplete='off'
                                onChange={onLoginInfoHandler}
                                value={id}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant='standard'
                                fullWidth
                                name='pw'
                                label='Password'
                                type='password'
                                id='password'
                                autoComplete='off'
                                onChange={onLoginInfoHandler}
                                value={pw}
                            />
                        </Grid>
                    </Grid>
                    <FormControlLabel
                        control={<Checkbox value='remember' color='primary' />}
                        label='아이디 저장하기' checked={isSave} onChange={onIdSaveHandler}
                    />
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                        disabled={!(id && pw)}
                    >
                        로그인
                    </Button>
                </Box>
            </Box>
        </Container>
    );

};

export default SignIn;