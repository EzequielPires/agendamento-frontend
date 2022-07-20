import styles from './styles.module.scss';
import { FaChevronLeft } from "react-icons/fa";
import Link from 'next/link';

export function ButtonBack({link}) {
    return (
        <Link href={`${link}`}>
            <a className={styles.button_back}><FaChevronLeft /></a>
        </Link>
    );
}