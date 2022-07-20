import { Navbar } from 'src/components/Admin/Navbar';
import { AsideBar } from 'src/components/Admin/AsideBar';

import styles from '../styles/pages/admin.module.scss';

export default function Clientes
() {
    return (
        <div className={styles.container}>
            <Navbar />
            <AsideBar />
        </div>
    )
}