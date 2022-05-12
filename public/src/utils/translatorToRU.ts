import {Buffer} from '../types/Buffer';
const translatorFieldsToRULabels: Buffer<Buffer<string>> = {
    Employe:{
    'LOGIN':'Логин',
    'PASSWORD':'Пароль',
    'ROLE_ID':'Роль',
    'ID':'ID',
    'POST_NAME':'Должность',
    'POST_ID': 'Должность',
    'LAST_NAME': 'Фамилия',
    'NAME': 'Имя',
    'PATRONYMIC': 'Отчество',
    'ADDRESS': 'Адрес',
    'EMAIL' : 'Email',
    'PHONE' : 'Номер телефона',
    'DEPART_NAME': 'Подразделение'
    },
    Meeting: {
        'ID':'ID',
        'START_DATE':'Начало',
        'END_DATE':'Конец'
    }
}

export default translatorFieldsToRULabels;