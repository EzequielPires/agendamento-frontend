import Link from 'next/link';
import { UserComponent } from 'src/components/UserComponent';
import { useAuth } from 'src/context/AuthContext';
import styles from './styles.module.scss';

export function Navbar({ business }) {
    const { user } = useAuth();
    return (
        <header className={styles.header}>
            <nav className={styles.navbar}>
                <div className="container d-flex justify-content-between align-items-center">
                    <div className={styles.brand}>
                        <img src="https://i.pinimg.com/originals/f8/11/4f/f8114f77e3552579834558dc138417ba.jpg" alt="" />
                        <h4>{business?.name}</h4>
                    </div>
                    <ul className='d-flex gap-4 m-0'>
                        <li>
                            <Link href="/">
                                <a>Serviços</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Colaboradores</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/">
                                <a>Agenda</a>
                            </Link>
                        </li>
                    </ul>
                    {
                        !user ?
                            <div className={styles.user}>
                                <Link href="/login">
                                    <a>Entrar</a>
                                </Link>
                                <Link href="/login">
                                    <a className={styles.button}>Criar Conta</a>
                                </Link>
                            </div> :
                            <UserComponent />
                    }
                </div>
            </nav>
        </header>
    )
}