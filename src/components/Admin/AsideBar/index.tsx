import Link from 'next/link';
import styles from './styles.module.scss';
import { MdCalendarToday, MdHome, MdPeopleAlt } from 'react-icons/md';
import { FaClock, FaCogs, FaHandshake, FaListUl, FaPencilAlt, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { ButtonSubmit } from 'src/components/Form/ButtonSubmit';

export function AsideBar() {
    const router = useRouter();
    return (
        <nav className={styles.asidebar}>
            <div className={styles.links}>
                <Link href={"/admin"}>
                    <a className={`${styles.link} ${router.asPath === "/admin" && styles.link_active}`}>
                        <MdHome />
                        Home
                    </a>
                </Link>
                <Link href={"/agenda"}>
                    <a className={`${styles.link} ${router.asPath === "/agenda" && styles.link_active}`}>
                        <MdCalendarToday />
                        Agenda
                    </a>
                </Link>
                <Link href={"/profissionais"}>
                    <a className={`${styles.link} ${router.asPath === "/profissionais" && styles.link_active}`}>
                        <FaUser />
                        Profissionais
                    </a>
                </Link>
                <Link href={"/clientes"}>
                    <a className={`${styles.link} ${router.asPath === "/clientes" && styles.link_active}`}>
                        <MdPeopleAlt />
                        Clientes
                    </a>
                </Link>
                <Link href={"/servicos"}>
                    <a className={`${styles.link} ${router.asPath === "/servicos" && styles.link_active}`}>
                        <FaHandshake />
                        Serviços
                    </a>
                </Link>
                <Link href={"/horario-atendimento"}>
                    <a className={`${styles.link} ${router.asPath === "/horario-atendimento" && styles.link_active}`}>
                        <FaClock />
                        Horário de atendimento
                    </a>
                </Link>
                {/* <Link href={"/desempenho"}>
                    <a className={`${styles.link} ${router.asPath === "/desempenho" && styles.link_active}`}>
                        <FaPencilAlt />
                        Desempenho
                    </a>
                </Link> */}
                <Link href={"/todos-agendamentos"}>
                    <a className={`${styles.link} ${router.asPath === "/todos-agendamentos" && styles.link_active}`}>
                        <FaListUl />
                        Todos agendamentos
                    </a>
                </Link>
                <Link href={"/configuracoes"}>
                    <a className={`${styles.link} ${router.asPath === "/configuracoes" && styles.link_active}`}>
                        <FaCogs />
                        Configurações
                    </a>
                </Link>
            </div>
        </nav>
    )
}