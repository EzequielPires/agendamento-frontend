import Link from 'next/link';
import { useState } from 'react';
import { ButtonSubmit } from 'src/components/Form/ButtonSubmit';
import { Input } from 'src/components/Form/Input';
import { useAuth } from 'src/context/AuthContext';
import { useForm } from 'src/hooks/useForm';

import styles from '../styles/pages/login.module.scss';

export default function Login() {
    const { signIn } = useAuth();
    const email = useForm('');
    const password = useForm('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        await signIn({
            email: email.value,
            password: password.value
        })
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSignIn}>
                <h4 className={styles.title}>Login</h4>
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
                    <Link href="/business-register">
                        <a className={styles.forgot_password}><span>Não tem uma conta?</span> <strong>SignUp</strong></a>
                    </Link>
                </div>
            </form>
        </div>
    )
}