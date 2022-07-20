import { Navbar } from 'src/components/Admin/Navbar';
import { AsideBar } from 'src/components/Admin/AsideBar';

import styles from '../styles/pages/admin.module.scss';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { api } from 'src/services/api';

export default function Admin() {
    return (
        <div className={styles.container}>
            <Navbar />
            <AsideBar />
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

    return {
        props: {
        }
    }
}