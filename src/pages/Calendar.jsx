import { useState } from 'react';
import { Button } from '@mui/material';

const Calendar = () => {

    const [test, setTest] = useState(false);
    const testHandler = () => {
        setTest(!test);
    };
    return (
        <div>
            <Button onClick={testHandler}>렌더링 테스트</Button>
        </div>
    );
};

export default Calendar;