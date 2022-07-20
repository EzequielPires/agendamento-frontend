import { Navbar } from 'src/components/Admin/Navbar';
import { AsideBar } from 'src/components/Admin/AsideBar';

import styles from '../styles/pages/admin.module.scss';
import { MdCalendarToday } from 'react-icons/md';
import { InputTimeday } from 'src/components/Form/InputTimeday';
import { ButtonSubmit } from 'src/components/Form/ButtonSubmit';
import { useTimeDay } from 'src/hooks/useTimeDay';
import { useBusiness } from 'src/context/BusinessContext';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { api } from 'src/services/api';
import { useEffect } from 'react';

export default function HorarioAtendimento({businessHours}) {
    const {createBusinessHours} = useBusiness();

    const domingo = useTimeDay();
    const segunda = useTimeDay();
    const terca = useTimeDay();
    const quarta = useTimeDay();
    const quinta = useTimeDay();
    const sexta = useTimeDay();
    const sabado = useTimeDay();

    useEffect(() => {
        if(businessHours) {
            domingo.setValue(businessHours.domingo);
            segunda.setValue(businessHours.segunda);
            terca.setValue(businessHours.terca);
            quarta.setValue(businessHours.quarta);
            quinta.setValue(businessHours.quinta);
            sexta.setValue(businessHours.sexta);
            sabado.setValue(businessHours.sabado);
        }
    }, [businessHours])

    const handleSubmit = async () => {
        await createBusinessHours({
            days: {
                segunda: segunda.value,
                terca: terca.value,
                quarta: quarta.value,
                quinta: quinta.value,
                sexta: sexta.value,
                sabado: sabado.value,
                domingo: domingo.value
            }
        });
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <AsideBar />
            <div className={styles.content}>
                <div className="d-flex align-items-center gap-1 mb-3">
                    <MdCalendarToday />
                    <h4 className="mb-0">Horários de Atendimento</h4>
                </div>
                <p>Configure os horários de atendimento. Informe a hora incial e a hora final. O sistema vai criar as opções de agendamento entre esses dois horários.</p>
                <div className={styles.opening_hours}>
                    <InputTimeday
                        title='Segunda-Feira'
                        {...segunda}
                    />
                    <hr />
                    <InputTimeday
                        title='Terça-Feira'
                        {...terca}
                    />
                    <hr />
                    <InputTimeday
                        title='Quarta-Feira'
                        {...quarta}
                    />
                    <hr />
                    <InputTimeday
                        title='Quinta-Feira'
                        {...quinta}
                    />
                    <hr />
                    <InputTimeday
                        title='Sexta-Feira'
                        {...sexta}
                    />
                    <hr />
                    <InputTimeday
                        title='Sábado'
                        {...sabado}
                    />
                    <hr />
                    <InputTimeday
                        title='Domingo'
                        {...domingo}
                    />
                    <hr />
                    <ButtonSubmit
                        title='Salvar horários'
                        onClick={() => handleSubmit()}
                    />
                </div>
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

    const businessHours = await api.get(`/business-hours?business=${userFormated.business.id}`).then(({ data }) => data.data);

    return {
        props: {
            businessHours: businessHours[0] ?? null
        }
    }
}