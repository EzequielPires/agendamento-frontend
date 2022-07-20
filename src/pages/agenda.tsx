import { Navbar } from 'src/components/Admin/Navbar';
import { AsideBar } from 'src/components/Admin/AsideBar';
import Calendar from 'react-calendar';

import styles from '../styles/pages/admin.module.scss';
import { useEffect, useState } from 'react';
import { useAuth } from 'src/context/AuthContext';
import { GetServerSideProps } from 'next';
import { api } from 'src/services/api';
import { parseCookies } from 'nookies';
import { Table } from 'react-bootstrap';

export default function Agenda({schedulesData}) {
    const [schedules, setSchedules] = useState(null);
    const {user} = useAuth();
    const data = new Date();
    const [value, onChange] = useState(null);

    useEffect(() => {
        setSchedules(schedulesData);
    }, [schedulesData]);

    useEffect(() => {
    }, [value]);

    useEffect(() => {
        onChange(data);
    }, [user])

    const handleDaySchedules = async (date: Date) => {
        console.log(date.toLocaleDateString())
        onChange(date);
        const schedules = await api.get(`/scheduling?day=${date.getDate()}&month=${date.getMonth()}&year=${date.getFullYear()}&business=${user.business.id}`).then(({ data }) => data.data);
        setSchedules(schedules);
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <AsideBar />
            <div className={styles.content}>
                <div className="d-flex flex-column">
                    <h4 className="mb-3">Agendamentos</h4>
                    {value && <Calendar
                        onChange={handleDaySchedules}
                        value={value}
                        minDate={data}
                    />
                    }
                </div>
                <div className={styles.schedules}>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Serviço</th>
                            <th>Cliente</th>
                            <th>Profissional</th>
                            <th>Início</th>
                            <th>Final</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules?.map((item, index) => (
                            <tr>
                                <td>{index}</td>
                                <td>{item.service.title}</td>
                                <td>{item.client.name}</td>
                                <td>{item.collaborator.name}</td>
                                <td>{item.details.start}</td>
                                <td>{item.details.end}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { 'instabio.token': token, 'instabio.user': user } = parseCookies(ctx);
    if (!token || !user) {
        return {
            redirect: {
                destination: `/login`,
                permanent: false,
            }
        }
    }
    const userFormated = JSON.parse(user);
    if (userFormated.role === 'client') {
        return {
            redirect: {
                destination: `/login`,
                permanent: false,
            }
        }
    }

    
    const date = new Date();
    const schedules = await api.get(`/scheduling?day=${date.getDate()}&month=${date.getMonth()}&year=${date.getFullYear()}&business=${userFormated.business.id}`).then(({ data }) => data.data);

    return {
        props: {
            schedulesData: schedules
        }
    }
}