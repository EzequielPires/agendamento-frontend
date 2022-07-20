import styles from './styles.module.scss';

interface CardProps {
    id: string;
    date: string;
    details: {
        date: string,
        start: string,
        end: string
    };
    service: {
        id: string;
        title: string;
    };
    client: {
        id: string;
        name: string;
    }
    collaborator: {
        id: string;
        name: string;
    }
}

export function CardScheduling({ id, date, details, service, client, collaborator }: CardProps) {
    return (
        <div className={styles.card}>
            <h2>{service.title}</h2>
            <div className={styles.flex}>
                <span>Cliente:</span>
                <strong>{client.name}</strong>
            </div>
            <div className={styles.flex}>
                <span>Colaborador:</span>
                <strong>{collaborator.name}</strong>
            </div>
            <div className={styles.flex}>
                <div className={styles.flex}>
                    <span>Data:</span>
                    <strong>{details.date}</strong>
                </div>
                <div className={styles.flex}>
                    <span>Inicio:</span>
                    <strong>{details.start}</strong>
                </div>
                <div className={styles.flex}>
                    <span>Fim:</span>
                    <strong>{details.end}</strong>
                </div>
            </div>
            <div className={styles.flex}>
                <span>id:</span>
                <strong>{id}</strong>
            </div>
            <button>Detalhes</button>
        </div>
    )
}