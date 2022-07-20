export const maskPhone = (value: string) => {
    value = value.replace(/\D/g, "");
    if (value.length > 10) {
        value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else {
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    }
    return value;
}
export const maskUserName = (value: string) => {
    value = value.replace(' ', '');
    value = value.replace(/[}{,.^@#$%&>\(\)\[\];:'"!?~=+\-_\/*\-+.\|]/g, "");
    return value;
}