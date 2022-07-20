import { useRouter } from "next/router";
import { createContext, useContext } from "react";
import { useNotification } from "src/hooks/useNotification";
import { Timeday } from "src/hooks/useTimeDay";
import { api } from "src/services/api";
import { useAuth } from "./AuthContext";
import { useLoading } from "./LoadingContext";

interface RequereBusiness {
    name: string;
    email: string;
    password: string;
    phone: string;
}
interface RequereBusinessHours {
    days: {
        segunda?: Timeday[],
        terca?: Timeday[],
        quarta?: Timeday[],
        quinta?: Timeday[],
        sexta?: Timeday[],
        sabado?: Timeday[],
        domingo?: Timeday[]
    }
}

interface RequereCollaborator {
    id?: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    services: Array<string>;
    role: string;
}

interface RequereService {
    id?: string;
    title: string;
    description: string;
    price: number;
    duration: number;
}

interface BusinessProps {
    create: ({ email, name, password, phone }: RequereBusiness) => Promise<void>;
    createService: ({ description, duration, price, title }: RequereService) => Promise<void>;
    createCollaborator: ({ email, name, password, phone, services }: RequereCollaborator) => Promise<void>;
    createBusinessHours: ({ days }: RequereBusinessHours) => Promise<void>;
    updateCollaborator: ({ id, name, phone, email, services, role }: RequereCollaborator) => Promise<void>;
    updateService: ({id, description, duration, price, title }: RequereService) => Promise<void>;
    availableTimes: ({day, month, year, id, collaborator, service}) => Promise<Array<any>>;
}

const BusinessContext = createContext({} as BusinessProps);

function BusinessProvider({ children }) {
    const { user } = useAuth();
    const { handleHiddenLoading, handleShowLoading } = useLoading();
    const notificationHook = useNotification();
    const router = useRouter();

    async function create({ email, name, password, phone }: RequereBusiness) {
        try {
            handleShowLoading();

            const business = await api.post('/business', {
                email,
                name,
                password,
                phone
            }).then(res => res.data);

            if (!business || business.success === false) {
                notificationHook.execute('danger', `Falha ao cadastrar o negócio`);
            } else {
                notificationHook.execute('success', `O seu negócio ${business.data.name} foi cadastrado com sucesso.`);
            }
        } catch (error) {
            notificationHook.execute('danger', `Falha ao cadastrar o negócio`);
        } finally {
            handleHiddenLoading();
        }
    }

    async function createService({ description, duration, price, title }: RequereService) {
        try {
            handleShowLoading();

            const service = await api.post('/services', {
                title,
                description,
                duration,
                price,
                business: user.business.id,
            }).then(res => res.data);

            if (!service || service.success === false) {
                notificationHook.execute('danger', `Falha ao cadastrar o serviço`);
            } else {
                notificationHook.execute('success', `O serviço ${service.data.title} foi cadastrado com sucesso.`);
                router.push('/servicos');
            }
        } catch (error) {
            notificationHook.execute('danger', `Falha ao cadastrar o serviço`);
        } finally {
            handleHiddenLoading();
        }
    }

    async function updateService({ id, description, duration, price, title }: RequereService) {
        try {
            handleShowLoading();

            const service = await api.patch(`/services/${id}`, {
                title,
                description,
                duration,
                price,
            }).then(res => res.data);

            if (!service || service.success === false) {
                notificationHook.execute('danger', `Falha ao cadastrar o serviço`);
            } else {
                notificationHook.execute('success', `O serviço ${service.data.title} foi cadastrado com sucesso.`);
                router.push('/servicos');
            }
        } catch (error) {
            notificationHook.execute('danger', `Falha ao cadastrar o serviço`);
        } finally {
            handleHiddenLoading();
        }
    }

    async function createCollaborator({ name, phone, email, password, services, role }: RequereCollaborator) {
        try {
            handleShowLoading();
            const collaborator = await api.post('/users/register', {
                name,
                phone,
                email,
                password,
                business: user.business.id,
                services,
                role
            }).then(res => res.data);

            if (!collaborator || collaborator.success === false) {
                notificationHook.execute('danger', `Falha ao cadastrar o profissional`);
            } else {
                notificationHook.execute('success', `O profissional ${collaborator.data.title} foi cadastrado com sucesso.`);
                router.push('/profissionais');
            }
        } catch (error) {
            notificationHook.execute('danger', `Falha ao cadastrar o serviço`);
        } finally {
            handleHiddenLoading();
        }
    }

    async function updateCollaborator({ id, name, phone, email, services, role }: RequereCollaborator) {
        try {
            handleShowLoading();
            const collaborator = await api.put(`/users/${id}`, {
                name,
                phone,
                email,
                business: user.business.id,
                services,
                role
            }).then(res => res.data);

            if (!collaborator || collaborator.success === false) {
                notificationHook.execute('danger', `Falha ao cadastrar o profissional`);
            } else {
                notificationHook.execute('success', `O profissional ${collaborator.data.title} foi cadastrado com sucesso.`);
                router.push('/profissionais');
            }
        } catch (error) {
            notificationHook.execute('danger', `Falha ao cadastrar o serviço`);
        } finally {
            handleHiddenLoading();
        }
    }

    async function createBusinessHours({ days }: RequereBusinessHours) {
        try {
            handleShowLoading();
            const service = await api.post('/business-hours', {
                days: ["DOM", "SEG"],
                start: "2022-07-01T08:00:00Z",
                end: "2022-07-01T17:00:00Z",
                business: user.business.id,
                ...days
            }).then(res => res.data);

            if (!service || service.success === false) {
                notificationHook.execute('danger', `Falha ao cadastrar o horário`);
            } else {
                notificationHook.execute('success', `O horário foi cadastrado com sucesso.`);
            }
        } catch (error) {
            notificationHook.execute('danger', `Falha ao cadastrar o horário`);
        } finally {
            handleHiddenLoading();
        }
    }

    async function availableTimes({day, month, year, id, collaborator, service}) {
        const { data } = await api.get(
            `/scheduling/available-times?day=${day}&month=${month}&year=${year}&business=${id}&collaborator=${collaborator}&service=${service}`
        );
        if(!data.success) {
            notificationHook.execute('danger', data.message);
        }
        return data.data ?? [];
    }

    return (
        <BusinessContext.Provider value={{
            create,
            createService,
            createCollaborator,
            createBusinessHours,
            updateCollaborator,
            updateService,
            availableTimes
        }}>
            {children}
        </BusinessContext.Provider>
    );
}

function useBusiness() {
    const context = useContext(BusinessContext);

    return context;
}

export { useBusiness, BusinessProvider }