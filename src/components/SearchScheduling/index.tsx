import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from 'src/context/AuthContext';
import { useBusiness } from 'src/context/BusinessContext';
import { api } from 'src/services/api';
import { CalendarComponent } from '../CalendarComponent';
import styles from './styles.module.scss';

interface Props {
    date: Date;
    services: any;
    collaborators: any;
}

export function SearchScheduling({
    date,
    services,
    collaborators
}: Props) {
    const {availableTimes} = useBusiness();
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [times, setTimes] = useState([]);
    const [time, setTime] = useState('');
    const [service, setService] = useState('');
    const [collaborator, setCollaborator] = useState('');

    const router = useRouter();
    const { id } = router.query;
    const {user} = useAuth();


    const handleSubmitSerach = async () => {
        const times = await availableTimes({
            day,
            month,
            year,
            collaborator,
            service,
            id,
        });
        setTimes(times);
    }

    useEffect(() => {
        if(date) {
            setTimes([]);
            const [day, month, year] = date.toLocaleDateString().split('/');
            setDay(day);
            setMonth(month);
            setYear(year);
        }
    }, [date]);

    useEffect(() => {
        if (services.length > 0) {
            setService(services[0].id);
        }
    }, [services]);

    useEffect(() => {
        if (collaborators.length > 0) {
            setCollaborator(collaborators[0].id);
        }
    }, [collaborators]);

    
    const createScheduling = async () => {
        const { data } = await api.post('/scheduling', {
            date: date.toLocaleDateString(),
            time: time,
            business: id,
            collaborator,
            service,
            client: user.role === 'client' && user.id,
        });
        if (data.success) {
            router.reload();
        }
    }

    return (
        <div className={styles.container}>
           {/*  <div className="d-flex flex-column align-items-center w-100">
                <h4>Selecione um serviço</h4>
                <div className={styles.flex}>
                    {services.map(item => (
                        <button
                            className={service === item.id ? styles.button_select_active : styles.button_select}
                            onClick={() => setService(item.id)}
                            key={item.id}
                        >
                            {item.title}
                        </button>
                    ))}
                </div>
            </div> */}
            {/* <div className="d-flex flex-column align-items-center w-100">
                <h4>Selecione um profissional</h4>
                <div className={styles.flex}>
                    {collaborators.map(item => (
                        <button
                            className={collaborator === item.id ? styles.button_select_active : styles.button_select}
                            onClick={() => setCollaborator(item.id)}
                            key={item.id}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div> */}
            
            
            <button onClick={createScheduling}>Cria agendamento</button>
        </div>
    )
}