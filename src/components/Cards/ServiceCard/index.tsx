import styles from './styles.module.scss';

interface Props {
    id: string;
    title: string;
    description: string;
    photo?: string;
    price: number;
    duration: number;
    selected?: boolean;
    onClick: any;
}

export function ServiceCard({
    id,
    title,
    description,
    price,
    duration,
    selected,
    onClick
}: Props) {
    return (
        <button onClick={() => onClick()} className={`${styles.card} ${selected ? styles.active : ''}`}>
            <h4>{title}</h4>
            <p>{description}</p>
            <div className="d-flex justify-content-between w-100 mt-4">
                <span>Preço: R$ {price}</span>
                <span>Duração: {duration}min</span>
            </div>
        </button>
    )
}