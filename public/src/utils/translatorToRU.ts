interface Buffer<T> {
    [name:string]:T
}

const translatorFieldsToRULabels: Buffer<Buffer<string>> = {
    Employe:{
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
}}

export default translatorFieldsToRULabels;