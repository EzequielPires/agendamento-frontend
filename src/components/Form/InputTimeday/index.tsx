import { useEffect, useState } from 'react';
import { FaArrowRight, FaClock } from 'react-icons/fa';
import styles from './styles.module.scss';
import VMasker from "vanilla-masker/build/vanilla-masker.min";
import { Timeday } from 'src/hooks/useTimeDay';

interface Props {
    title: string;
    value: Timeday[];
    onChange: any;
    error: boolean;
    setError: any;
}

export function InputTimeday({ title, value, onChange, error, setError }: Props) {
    
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');


    function replaceBadInputs(val: string) {
        val = val.replace(/^[^0-2]/, "");
        val = val.replace(/^([2-9])[4-9]/, "$1");
        val = val.replace(/^(\d{2}[:h])[^0-5]/, "$1");
        val = val.replace(/^(\d{2}h)./, "$1");
        val = val.replace(/^(\d{2}:[0-5])[^0-9]/, "$1");
        val = val.replace(/^(\d{2}:\d[0-9])./, "$1");

        val = VMasker.toPattern(val, "99:99")

        return val;
    }

    const onChangeStart = ({ target }) => {
        if(error) {
            setError(false);
        }
        setStart(replaceBadInputs(target.value));
    }
    const onChangeEnd = ({ target }) => {
        if(error) {
            setError(false);
        }
        setEnd(replaceBadInputs(target.value));
    }

    const addTimeday = () => {
        const timeday = {
            start,
            end
        }
        onChange(timeday);
        setStart('');
        setEnd('');
    }

    return (
        <div className={styles.timeday}>
            <div className="d-flex align-items-center gap-1 mb-2">
                <FaClock />
                <h4 className='mb-0'>{title}</h4>
            </div>
            <div className="d-flex gap-2 align-items-end">
                <div className={styles.input_box}>
                    <label htmlFor="">HORA INCIAL</label>
                    <input type="text" placeholder='00:00' value={start} onChange={onChangeStart} />
                </div>
                <div className={styles.input_box}>
                    <label htmlFor="">HORA FINAL</label>
                    <input type="text" placeholder='00:00' value={end} onChange={onChangeEnd} />
                </div>
                <button onClick={addTimeday}>Adicionar</button>
            </div>
            {error && <span>Horário inválido!</span>}
            <ul className='mt-3'>
                <span>Horários</span>
                {value?.map((item, index) => (
                    <li key={index}>
                        <FaArrowRight /> <span>{item.start} - {item.end}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}