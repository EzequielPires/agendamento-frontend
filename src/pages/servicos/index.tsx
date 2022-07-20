import { Navbar } from 'src/components/Admin/Navbar';
import { AsideBar } from 'src/components/Admin/AsideBar';

import styles from '../../styles/pages/admin.module.scss';
import { Table } from 'react-bootstrap';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { api } from 'src/services/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';

export default function Servicos({servicesData}) {
    const [services, setServices] = useState([]);

    useEffect(() => {
        if (servicesData) {
            setServices(servicesData);
        }
    }, [servicesData])

    if (!servicesData) {
        return <p>carregando</p>
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <AsideBar />
            <div className={styles.content}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4>Serviços</h4>
                    <Link href={'/servicos/cadastrar'}>
                        <a className={styles.btn_add}>Cadastrar</a>
                    </Link>
                </div>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Título</th>
                            <th>Descrição</th>
                            <th>Preço</th>
                            <th>Duração</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services?.map((item, index) => (
                            <tr>
                                <td>
                                    <Link href={`/servicos/${item.id}`}>
                                        <a className="d-flex align-items-center justify-content-center h-100 w-100">
                                            <FaEdit />
                                        </a>
                                    </Link>
                                </td>
                                <td>{item.title}</td>
                                <td>{item.description}</td>
                                <td>R$ {item.price}</td>
                                <td>{item.duration} min</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
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

    const services = await api.get(`/services?business=${userFormated.business.id}`)
        .then(({ data }) => data.data);

    return {
        props: {
            servicesData: services
        }
    }
}