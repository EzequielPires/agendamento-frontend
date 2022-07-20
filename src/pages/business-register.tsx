import Link from "next/link";
import { ButtonSubmit } from "src/components/Form/ButtonSubmit";
import { Input } from "src/components/Form/Input";
import { useBusiness } from "src/context/BusinessContext";
import { useForm } from "src/hooks/useForm";

import styles from '../styles/pages/login.module.scss';

export default function BusinessRegister() {
    const {create} = useBusiness();

    const name = useForm('');
    const phone = useForm('');
    const email = useForm('');
    const password = useForm('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await create({
            name: name.value,
            phone: phone.value,
            email: email.value,
            password: password.value
        });
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h4 className={styles.title}>Crie seu Negócio</h4>
                <Input 
                    id='name'
                    type='text'
                    title='Nome do seu negócio'
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
                <div className="d-flex justify-content-end w-100">
                    <Link href="/login">
                        <a className={styles.forgot_password}>Esqueceu a senha?</a>
                    </Link>
                </div>
                <ButtonSubmit 
                    title='Entrar'
                />
                <div className="d-flex justify-content-center w-100">
                    <Link href="/login">
                        <a className={styles.forgot_password}><span>Já tem uma conta?</span> <strong>SignIn</strong></a>
                    </Link>
                </div>
            </form>
        </div>
    )
}