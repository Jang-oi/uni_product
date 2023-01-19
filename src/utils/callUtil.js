import axios from 'axios';
import { customAlert } from './commonUtil';

// axios.defaults.baseURL = 'http://localhost:4000';

export const tryCatchCall = (fn, errCallBackFn) => {
    try {
        fn();
    } catch (error) {
        customAlert({
            icon : 'error',
            title: 'Oops...',
            text : error.message,
        }).then(() => {
            if (errCallBackFn) errCallBackFn();
        }).catch(() => {
            alert('customAlert 연결 실패!\n서버 담당자에게 연결 부탁드립니다.');
        });
    }
};


/**
 * 서버를 정상적으로 호출하고 난 이후의 이벤트
 * @param response
 * @param callBackFn
 * @param errorCallBackFn
 * @returns {*}
 */
const callThen = (response, callBackFn, errorCallBackFn) => {
    callBackFn(response.data);
};

/**
 * 서버를 정상적으로 호출하지 못하고 난 이후의 이벤트
 * @param error
 * @param errorCallBackFn
 */
const callCatch = (error, errorCallBackFn) => {
    let errorMsg;
    switch (error.code) {
        case 'ERR_NETWORK' :
            errorMsg = '서버 연결 실패!! \n서버 담당자 연결 부탁드립니다.';
            break;
        default :
            errorMsg = '서버 담당자 연결 부탁드립니다.';
            break;
    }
    customAlert({
        icon : 'error',
        title: 'Oops...',
        text : errorMsg,
    }).then(() => {
        if (errorCallBackFn) errorCallBackFn();
    }).catch(() => {
        alert('customAlert 연결 실패!!\n서버 담당자에게 연결 부탁드립니다.');
    });
};


/**
 * 서버 호출 정의
 * @type {{post: serviceCall.post, get: serviceCall.get}}
 * options
 *      url      : 호출 url
 *        String
 *      data     : 보낼 데이터
 *        Object
 *      params   : ?파라미터를 전달
 *        Object  params : { data : 123 } -> url?data=123
 *      headers  : 요청 헤더 설정
 *        Object
 */
export const serviceCall = {
    post: (options, callBackFn, errorCallBackFn) => {
        const { url } = options;
        axios.post(url, options)
            .then(response => callThen(response, callBackFn, errorCallBackFn))
            .catch(error => callCatch(error, errorCallBackFn));
    },

    get: (options, callBackFn, errorCallBackFn) => {
        const { url } = options;
        axios.get(url, options)
            .then(response => callThen(response, callBackFn, errorCallBackFn))
            .catch(error => callCatch(error, errorCallBackFn));
    },

    post2: async (url, options) => {
        const { data } = await axios.post(url, options);
        console.log(data);
        return data;
    },
};