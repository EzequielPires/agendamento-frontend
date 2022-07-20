import { useState } from "react";
import { maskPhone, maskUserName } from "src/helpers/mask";

const types = {
    phone: {
        regex: /^\(\d{2}\) \d{5}-?\d{4}$/,
        mask: maskPhone,
        message: 'Número inválido'
    },
    userName: {
        regex: /^\w{3,20}$/,
        mask: maskUserName,
        message: 'Nome de usuário inválido'
    },
    facebook: {
        regex: /^https:\/\/www.facebook.com\/\w{3,15}/,
        message: 'Perfil do facebook inválido'
    },
    instagram: {
        regex: /^@\w{3,15}$/,
        message: 'Perfil do instagram inválido'
    }
}

export function useForm(type?: string) {
    const [value, setValue] = useState('');
    const [error, setError] = useState(null);

    function validate(value: string) {
        
        if (value.length === 0) {
            setError('Preencha um valor');
            return false;
        } else {
            if(types[type] && !types[type].regex.test(value)) {
                setError(types[type].message);
                return false;
            } else {
                setError(null);
                return true;
            }
        }
    }

    function onChange({ target }) {
        if (error) validate(target.value);
        if (types[type] && types[type].mask) {
            setValue(types[type].mask(target.value));
        } else {
            setValue(target.value);
        }
    }

    return {
        value,
        error,
        setError,
        setValue,
        onChange,
        onBlur: () => validate(value),
        validate: () => validate(value)
    }
}