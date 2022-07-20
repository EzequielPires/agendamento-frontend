import { FaBell, FaFonticons } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';
import { UserComponent } from 'src/components/UserComponent';
import { useAuth } from 'src/context/AuthContext';
import styles from './styles.module.scss';

export function Navbar() {
    const { user } = useAuth();

    return (
        <nav className={styles.navbar}>
            <div className={styles.brand}>
                <h4 className={styles.brand_name}>{user?.business?.name ?? ''}</h4>
                <button>
                    <MdMenu />
                </button>
            </div>
            <UserComponent />
        </nav>
    )
}