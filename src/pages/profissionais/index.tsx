import { Navbar } from 'src/components/Admin/Navbar';
import { AsideBar } from 'src/components/Admin/AsideBar';

import styles from '../../styles/pages/admin.module.scss';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { api } from 'src/services/api';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Link from 'next/link';
import { FaEdit } from 'react-icons/fa';

export default function Profissionais({ collaboratorsData }) {
    const [collaborators, setCollaborators] = useState([]);

    useEffect(() => {
        if (collaboratorsData) {
            setCollaborators(collaboratorsData);
        }
    }, [collaboratorsData])

    if (!collaboratorsData) {
        return <p>carregando</p>
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <AsideBar />
            <div className={styles.content}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4>Funcionários</h4>
                    <Link href={'/profissionais/cadastrar'}>
                        <a className={styles.btn_add}>Cadastrar</a>
                    </Link>
                </div>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            <th>Função</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collaborators?.map((item, index) => (
                            <tr key={item.id}>
                                <td>
                                    <Link href={`/profissionais/${item.id}`}>
                                        <a className="d-flex align-items-center justify-content-center h-100 w-100">
                                            <FaEdit />
                                        </a>
                                    </Link>
                                </td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                                <td>{item.role}</td>
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

    const collaborators = await api.get(`/users/list?business=${userFormated.business.id}&role=collaborator`)
        .then(({ data }) => data.data);

    return {
        props: {
            collaboratorsData: collaborators
        }
    }
}