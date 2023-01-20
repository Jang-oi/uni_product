import { Container } from '@mui/material';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Loading from './component/Loding';
import Menubar from './component/Menubar';
import Main from './pages/Main';
import SignIn from './component/SignIn';
import PublicRoute from './router/PublicRoute';
import PrivateRoute from './router/PrivateRoute';
import Calendar from './pages/Calendar';
import NotFound from './pages/NotFound';
import License from './pages/License';
import { getLocalStorage } from './utils/localStorage';


const App = () => {

    const [loading, setLoading] = useState(false);
    const token = getLocalStorage('token');
    /**
     * axios then 이나 catch 처리되기 전의 요청 응답의 공통 기능 처리
     */
    axios.interceptors.request.use(
        config => {
            setLoading(true);
            return config;
        },
        error => {
            setLoading(true);
            return Promise.reject(error);
        },
    );
    axios.interceptors.response.use(
        config => {
            setLoading(false);
            return config;
        },
        error => {
            setLoading(false);
            return Promise.reject(error);
        },
    );

    return (
        <Container>
            <Menubar />
            {loading && <Loading />}
            <Routes>
                <Route path='/' element={<PrivateRoute token={token} />}>
                    <Route path='/' element={<Main />} />
                    <Route path='/License' element={<License />} />
                </Route>
                <Route path='/' element={<PublicRoute token={token} />}>
                    <Route path='/sign-in' element={<SignIn />} />
                </Route>
                <Route path='/Calendar' element={<Calendar />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </Container>
    );
};

export default App;