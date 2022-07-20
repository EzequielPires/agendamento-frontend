import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { AsideBar } from "src/components/Admin/AsideBar";
import { Navbar } from "src/components/Admin/Navbar";
import { ButtonBack } from "src/components/ButtonBack";
import { ButtonSubmit } from "src/components/Form/ButtonSubmit";
import { Input } from "src/components/Form/Input";
import { useBusiness } from "src/context/BusinessContext";
import { useForm } from "src/hooks/useForm";
import { api } from "src/services/api";
import styles from '../../styles/pages/admin.module.scss';

export default function CreateService({serviceData}) {
    const { updateService } = useBusiness();
    const router = useRouter();
    const {id} = router.query;


    const title = useForm('');
    const description = useForm('');
    const price = useForm('');
    const duration = useForm('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateService({
            id: String(id),
            description: description.value,
            duration: Number(duration.value),
            price: Number(price.value),
            title: title.value
        });
    }

    useEffect(() => {
        if(serviceData) {
            title.setValue(serviceData.title);
            description.setValue(serviceData.description);
            price.setValue(serviceData.price);
            duration.setValue(serviceData.duration);
        }
    }, [serviceData]);

    if(!serviceData) {
        return null;
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <AsideBar />
            <div className={styles.content}>
                <div className="d-flex gap-3 align-items-center mb-4">
                    <ButtonBack link={'/servicos'} />
                    <h4 className="mb-0">Editar serviço {title.value}</h4>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <Input
                        id='title'
                        type='text'
                        title='Nome do serviço'
                        value={title.value}
                        onChange={title.onChange}
                    />
                    <Input
                        id='description'
                        type='text'
                        title='Descrição do serviço'
                        value={description.value}
                        onChange={description.onChange}
                    />
                    <div className="d-flex gap-2">
                        <Input
                            id='price'
                            type='number'
                            title='Preço do serviço (R$)'
                            value={price.value}
                            onChange={price.onChange}
                        />
                        <Input
                            id='duration'
                            type='number'
                            title='Duração do serviço (min)'
                            value={duration.value}
                            onChange={duration.onChange}
                        />
                    </div>
                    <ButtonSubmit
                        title="Salvar"
                    />
                </form>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { 'instabio.token': token, 'instabio.user': user } = parseCookies(ctx);
    if (!token || !user) {
        return {
            redirect: {
                destination: `/login`,
                permanent: false,
            }
        }
    }
    const userFormated = JSON.parse(user);
    if (userFormated.role === 'client') {
        return {
            redirect: {
                destination: `/login`,
                permanent: false,
            }
        }
    }

    const { id } = ctx.query;
    const service = await api.get(`/services/${id}`)
        .then(({ data }) => data.data);

    return {
        props: {
            serviceData: service,
        }
    }
}