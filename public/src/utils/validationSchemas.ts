import * as yup from 'yup';

const phoneRegExp =  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const GuestValidationSchema = yup.object().shape({
    NAME:yup.string().required('Required'),
    LAST_NAME:yup.string().required('Required'),
    EMAIL:yup.string().email().required('Email is required'),
    PASSWORD: yup.string().min(4, 'Password must contain as least 4 characters').required('Eneter the password'),
    LOGIN:yup.string().required('Reqired'),
    PATRONYMIC:yup.string().required('Reqired'),
    PHONE:yup.string().required('Reqired').matches(phoneRegExp, 'Phone is not valid')
});

const EmployeValidationSchema = yup.object().shape({
    NAME:yup.string().required('Required'),
    LAST_NAME:yup.string().required('Required'),
    EMAIL:yup.string().email().required('Email is required'),
    PASSWORD: yup.string().min(4, 'Password must contain as least 4 characters').required('Eneter the password'),
    LOGIN:yup.string().required('Reqired'),
    PATRONYMIC:yup.string().required('Reqired'),
    PHONE:yup.string().required('Reqired').matches(phoneRegExp, 'Phone is not valid'),
    POST_ID:yup.string().required(),
    ROLE_ID:yup.string().required(),
    ADDRESS:yup.string()
});

const LoginValidationSchema = yup.object().shape({
    LOGIN: yup.string().required('Required'),
    PASSWORD:yup.string().required('Reqiered')
});


export {GuestValidationSchema, EmployeValidationSchema, LoginValidationSchema};