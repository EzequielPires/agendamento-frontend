import styles from './styles.module.scss';

type Props = {
    title: string;
    onClick?: () => {};
}

export function ButtonSubmit({
    title,
    onClick
}: Props) {
    return (
        <button className={styles.button} onClick={onClick}>
            {title}
        </button>
    )
}