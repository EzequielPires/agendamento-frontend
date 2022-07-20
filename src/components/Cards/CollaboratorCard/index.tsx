import styles from './styles.module.scss';

interface Props {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    selected?: boolean;
    onClick: any;
}

export function CollaboratorCard({id, avatar, name, phone, onClick, selected}: Props) {
    return (
        <button onClick={() => onClick()} className={`${styles.card} ${selected ? styles.active : ''}`}>
            <div className={styles.avatar}>
                <img src="https://cursosbellarosa.com.br/wp-content/uploads/2021/05/cabeleireiro-e1621540404666.jpg" alt="" />
            </div>
            <h4>{name}</h4>
            <p>{phone}</p>
        </button>
    )
}