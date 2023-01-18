import { Box, Button, TextField, Typography } from '@mui/material';
import { serviceCall, tryCatchCall } from '../utils/callUtil';
import { Fragment, useState } from 'react';

const Main = () => {

    const [url, setUrl] = useState('');

    const onSubmitHandler = (e) => {
        e.preventDefault();
        tryCatchCall(() => {
            /*            const options = {
                            url,
                            params : {id : 1234, bbbb : '1234'}
                        }
                        serviceCall.get(options);*/
            const options = {
                url,
                params: { id: 1234, bbbb: '1234' },
                data  : { aaaa: 1234 },
            };
            serviceCall.post(options);
        });
    };
    /**
     * URL 입력 시 이벤트
     * @param e
     */
    const onUrlHandler = (e) => {
        setUrl(e.currentTarget.value);
    };

    return (
        <Fragment>
            <Typography variant='h5' component='div' style={{ textAlign: 'center', marginTop: '20px' }}>
                서버 URL
            </Typography>
            <Box
                component='form'
                onSubmit={onSubmitHandler}
                sx={{
                    display      : 'flex',
                    flexDirection: 'column',
                    alignItems   : 'center',
                }}
            >
                <TextField variant='standard' autoFocus fullWidth label='URL을 입력해주세요.' value={url}
                           onChange={onUrlHandler} />
                <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }} disabled={!url}>확인</Button>
            </Box>
        </Fragment>
    );
};

export default Main;