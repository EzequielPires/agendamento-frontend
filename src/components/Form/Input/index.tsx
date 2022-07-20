import styles from './styles.module.scss';

type Props = {
    id: string;
    title: string;
    type: string;
    placeholder?: string;
    value: string;
    onChange: (e) => void;
}

export function Input({
    id,
    type,
    title,
    placeholder,
    value,
    onChange
}: Props) {
    return (
        <div className={styles.input_box}>
            <label htmlFor={id}>{title}</label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}