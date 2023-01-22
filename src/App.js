import { Container } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

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
import { useLoadingState } from './contexts/loadingContext';


const App = () => {

    const loadingState = useLoadingState();
    const { loading } = loadingState;
    const token = getLocalStorage('token');

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