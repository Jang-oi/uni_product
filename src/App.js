import {Container} from "@mui/material";
import {useState} from "react";
import {Route, Routes} from "react-router-dom";
import axios from "axios";

import Loading from "./component/Loding";
import Menubar from "./component/Menubar";
import Main from "./pages/Main";
import SignIn from "./pages/SignIn";
import PublicRoute from "./router/PublicRoute";
import PrivateRoute from "./router/PrivateRoute";
import Calendar from "./pages/Calendar";

const App = () => {

    const [loading, setLoading] = useState(false);
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
        }
    )
    axios.interceptors.response.use(
        config => {
            setLoading(false);
            return config;
        },
        error => {
            setLoading(false);
            return Promise.reject(error);
        }
    )

    return (
        <Container>
            <Menubar/>
            {loading && <Loading/>}
            <Routes>
                <Route path="/Calendar" element={<Calendar/>}/>
                <Route path="/" element={<PrivateRoute/>}>
                    <Route path="/" element={<Main/>}/>
                </Route>
                <Route path="/" element={<PublicRoute/>}>
                    <Route path="/sign-in" element={<SignIn/>}/>
                </Route>
            </Routes>
        </Container>
    );
}

export default App;