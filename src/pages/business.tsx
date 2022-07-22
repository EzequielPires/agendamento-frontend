import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CalendarComponent } from 'src/components/CalendarComponent';
import { ServiceCard } from 'src/components/Cards/ServiceCard';
import { Navbar } from 'src/components/site/Navbar';
import { api } from 'src/services/api';
import styles from '../styles/pages/business.module.scss';
import { CollaboratorCard } from 'src/components/Cards/CollaboratorCard';
import { useBusiness } from 'src/context/BusinessContext';
import { useAuth } from 'src/context/AuthContext';
import { useNotification } from 'src/hooks/useNotification';

export default function Business({ businessData, schedulesData }) {
    const {user} = useAuth();
    const notification = useNotification();
    const { availableTimes } = useBusiness();
    const router = useRouter();
    const { id } = router.query;

    const [times, setTimes] = useState([]);
    const [time, setTime] = useState('');
    const [business, setBusiness] = useState(null);
    const [service, setService] = useState('');
    const [collaborator, setCollaborator] = useState('');
    const now = new Date();
    const [date, onChange] = useState(now);


    const handleSubmitSerach = async () => {
        const [day, month, year] = date.toLocaleDateString().split('/');
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

    const handleCreateScheduling = async () => {
        const response = await api.post('/scheduling', {
            date: date.toLocaleDateString(),
            time,
            business: business.id,
            client: user.id,
            service,
            collaborator
        }).then(res => {
            return res.data;
        });

        if(response.success) {
            notification.execute('success', `Agendamento realizado com sucesso!`);
            setTime('');
            setTimes([]);
        } else {
            notification.execute('danger', `Erro ao realizar agendamento, tente novamente!`);
        }

    }

    useEffect(() => {
        setTime('');
    }, [date]);

    useEffect(() => {
        setBusiness(businessData);
    }, [businessData]);

    if (!business) {
        return <p>carregando...</p>
    }

    return (
        <>
            <Navbar
                business={business}
            />
            <div className={styles.container + " container"}>
                <h4>Selecione um serviço</h4>
                <div className="d-flex flex-wrap justify-content-center gap-4 mb-4 w-100">
                    {business?.services.map(item => (
                        <ServiceCard
                            id={item.id}
                            selected={service === item.id}
                            onClick={() => setService(item.id)}
                            title={item.title}
                            description={item.description}
                            duration={item.duration}
                            price={item.price}
                        />
                    ))}
                </div>
                <h4>Selecione um colaborador</h4>
                <div className="d-flex flex-wrap justify-content-center gap-4 mb-4 w-100">
                    {business?.collaborators.map(item => (
                        <CollaboratorCard
                            id={item.id}
                            selected={collaborator === item.id}
                            onClick={() => setCollaborator(item.id)}
                            name={item.name}
                            avatar={item.avatar}
                            phone={item.phone}
                        />
                    ))}
                </div>
                <CalendarComponent
                    value={date}
                    onChange={onChange}
                />
                <button className={styles.button} onClick={handleSubmitSerach}>Buscar</button>
                <div className={styles.times}>
                    {times.length > 0 ? <h4>Horários disponíveis</h4> : null}
                    <div className={styles.flex}>
                        {times.map(item => (
                            <button
                                key={item.start + '' + item.end}
                                onClick={() => setTime(item.start)}
                                className={time === item.start ? styles.active : null}
                            >
                                {item.start} - {item.end}
                            </button>
                        ))}
                    </div>
                </div>
                {time ? <button className={styles.button} onClick={handleCreateScheduling}>Agendar</button> : null}
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const business = await api.get(`/business?id=${ctx.query.id}`).then(({ data }) => data);
    const schedules = await api.get(`/scheduling?business=${ctx.query.id}`).then(({ data }) => data);
    return {
        props: {
            businessData: business.data[0] ?? null,
            schedulesData: schedules.data
        }
    }
}