import { useState } from "react";

export interface Timeday {
    start: string;
    end: string;
}

export function useTimeDay() {
    const [value, setValue] = useState<Timeday[]>([]);
    const [error, setError] = useState(false);

    const onChange = (timeday: Timeday) => {
        if(value.length === 1) {
            const date = new Date();
            date.setHours(Number(value[0].end.split(':')[0]));
            date.setMinutes(Number(value[0].end.split(':')[1]));
            date.setSeconds(0);
            const newDate = new Date();
            newDate.setHours(Number(timeday.start.split(':')[0]));
            newDate.setMinutes(Number(timeday.start.split(':')[1]));
            newDate.setSeconds(0);
            if(newDate.getTime() <= date.getTime()) {
                setError(true);
                return;
            }
        }
        if(value.length > 1) {
            const lastDate = new Date();
            lastDate.setHours(Number(value[value.length - 1].end.split(':')[0]));
            lastDate.setMinutes(Number(value[value.length - 1].end.split(':')[1]));
            lastDate.setSeconds(0);

            const newDate = new Date();
            newDate.setHours(Number(timeday.start.split(':')[0]));
            newDate.setMinutes(Number(timeday.start.split(':')[1]));
            newDate.setSeconds(0);
            
            if(newDate.getTime() <= lastDate.getTime()) {
                setError(true);
                return;
            }
        }
        setValue(old => [...old, timeday]);
    }

    return {
        value,
        error,
        setError,
        setValue,
        onChange
    }
}