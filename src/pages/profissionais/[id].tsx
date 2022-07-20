import { Navbar } from 'src/components/Admin/Navbar';
import { AsideBar } from 'src/components/Admin/AsideBar';

import styles from '../../styles/pages/admin.module.scss';
import { Input } from 'src/components/Form/Input';
import { useForm } from 'src/hooks/useForm';
import { ButtonSubmit } from 'src/components/Form/ButtonSubmit';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { api } from 'src/services/api';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useBusiness } from 'src/context/BusinessContext';
import { ButtonBack } from 'src/components/ButtonBack';
import { useRouter } from 'next/router';

export default function EditProfissionais({ servicesData, collaboratorData }) {
    const { updateCollaborator } = useBusiness();
    const [services, setServices] = useState([]);
    const [arrayServices, setArrayServices] = useState([]);
    const [role, setRole] = useState('collaborator');

    const router = useRouter();
    const {id} = router.query;

    const name = useForm('');
    const email = useForm('');
    const password = useForm('');
    const phone = useForm('phone');

    const serviceOnChange = (service: string) => {
        let exist = false;
        arrayServices.forEach(item => {
            if (item === service) {
                exist = true;
            }
        });
        if (exist) {
            const filter = arrayServices.filter(item => item != service);
            setArrayServices(filter);
        } else {
            setArrayServices([...arrayServices, service])
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        updateCollaborator({
            id: String(id),
            email: email.value,
            name: name.value,
            password: password.value,
            phone: phone.value,
            services: arrayServices,
            role: role
        });
    }

    const isServiceChecked = (item) => {
        return arrayServices?.includes(item);
    }

    useEffect(() => {
        if (servicesData) {
            setServices(servicesData);
        }
    }, [servicesData])

    useEffect(() => {
        if (collaboratorData) {
            if (collaboratorData.services) {
                setArrayServices([]);
                collaboratorData.services.forEach(item => {
                    setArrayServices(old => [...old, item.id]);
                })
            }
            name.setValue(collaboratorData.name ?? '');
            email.setValue(collaboratorData.email ?? '');
            password.setValue('********');
            phone.setValue(collaboratorData.phone ?? '');
            setRole(collaboratorData.role);
        }
    }, [collaboratorData])

    return (
        <div className={styles.container}>
            <Navbar />
            <AsideBar />
            <div className={styles.content}>
                <div className="d-flex gap-3 align-items-center mb-4">
                    <ButtonBack link={'/profissionais'} />
                    <h4 className='mb-0'>Editar Funcionário {collaboratorData.name}</h4>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.avatar}>
                        <input type="file" name="avatar" id="avatar" />
                        <label htmlFor="avatar"></label>
                    </div>
                    <Input
                        id='name'
                        type='text'
                        title='Nome'
                        value={name.value}
                        onChange={name.onChange}
                    />
                    <Input
                        id='phone'
                        type='text'
                        title='Telefone/Celular'
                        value={phone.value}
                        onChange={phone.onChange}
                    />
                    <Input
                        id='email'
                        type='email'
                        title='Email'
                        value={email.value}
                        onChange={email.onChange}
                    />
                    <Input
                        id='password'
                        type='password'
                        title='Password'
                        value={password.value}
                        onChange={password.onChange}
                    />

                    <div className={styles.checkbox_wrapper}>
                        <h5>Selecione o papel do funcionário</h5>
                        <div className="d-flex flex-column gap-2">
                            <div className={styles.radio}>
                                <input type="radio" name={'role'} id={'admin'} checked={role === 'admin'} onChange={(e) => setRole('admin')} />
                                <label htmlFor={'admin'}>Administrador</label>
                            </div>
                            <div className={styles.radio}>
                                <input type="radio" name={'role'} id={'collaborator'} checked={role === 'collaborator'} onChange={(e) => setRole('collaborator')} />
                                <label htmlFor={'collaborator'}>Colaborador</label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.checkbox_wrapper}>
                        <h5>Selecione um ou mais serviço</h5>
                        <div className="d-flex flex-column gap-2">
                            {services?.map((item, index) => (
                                <div className={styles.checkbox} key={item.id + "-" + index}>
                                    <input type="checkbox" name={item.id} id={item.id} onChange={(e) => serviceOnChange(item.id)} checked={isServiceChecked(item.id)} />
                                    <label htmlFor={item.id} className={styles.check}>
                                        <FaCheck />
                                    </label>
                                    <label htmlFor={item.id}>{item.title}</label>
                                </div>
                            ))}
                        </div>
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
    const { id } = ctx.query;
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
    const collaborator = await api.get(`/users/${id}`)
        .then(({ data }) => data.data);

    const services = await api.get(`/services?business=${userFormated.business.id}`)
        .then(({ data }) => data.data);
    return {
        props: {
            servicesData: services,
            collaboratorData: collaborator
        }
    }
}