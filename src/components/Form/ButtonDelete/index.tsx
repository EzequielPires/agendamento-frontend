import styles from './styles.module.scss';

type Props = {
    title: string;
    onClick?: (e) => {};
}

export function ButtonDelete({
    title,
    onClick
}: Props) {
    return (
        <button className={styles.button} onClick={onClick}>
            {title}
        </button>
    )
}