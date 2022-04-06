import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import { useState } from "react";
import style from './addEmploye.module.scss';

interface AddEmployePageProps {
    employeFields:{
        NAME: string,
        LAST_NAME: string,
        PATRONYMIC: string,
        ADDRESS: string,
        EMAIL: string,
        PHONE: string,
        POST_ID: number
    },
    selectOptions: {ID:string, POST_NAME:string}[]
};

const AddEmployePage = ({employeFields, selectOptions}: AddEmployePageProps) => {
    const [employeInfo, setEmployeInfo] = useState({...employeFields,['POST_ID']:selectOptions[0].ID,});
    const router = useRouter();
    return(
        <div>
            <form className={style.Form}>
                <fieldset>
                    {Object.keys(employeFields).map(prop => prop != 'POST_ID' ? 
                    <label>{prop}
                    <input  onChange={
                        (e) => {
                            setEmployeInfo({...employeInfo,[e.target.name]:e.target.value})
                        }
                    }
                        key={prop} 
                        name={prop} 
                        type='text'/> </label>
                    :   
                    <label>{prop}
                    <select name='POST_ID'
                            onChange={
                                (e) => {
                                    console.log(e.target.name)
                                    setEmployeInfo({...employeInfo,[e.target.name]:e.target.value})
                                }
                            }>
                        {selectOptions.map(({ID, POST_NAME}) => {
                            return <option key = {ID}
                                        value = {ID}>
                                        {POST_NAME}
                                    </option>
                        })}
                    </select>
                    </label>)
                    }

                </fieldset>
                <div className={style.ButtonBlock}>
                    <button onClick={(e) => {
                        e.preventDefault();
                        (async() => {
                            try{
                                const res = await fetch('http://localhost:8081/api/employes',
                                {
                                    method:'POST',
                                    headers:{
                                        'Content-type':'application/json'
                                    },
                                    body: JSON.stringify(employeInfo)
                                })
                                console.log(res);
                            }
                            catch(e){
                                alert('что-то пошло не так')
                            }
                            finally{
                                router.push('/employes')
                            }

                        })()
                    }}>Send</button>
                    <button>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export const getServerSideProps : GetServerSideProps = async() => {
    const selectOptions = await fetch('http://localhost:8081/api/posts');
    const res = await selectOptions.json();
    console.log(res);

    return {
        props: {
            employeFields: { NAME:'',
                LAST_NAME: '',
                PATRONYMIC: '',
                ADDRESS: '',
                EMAIL: '',
                PHONE: '',
                POST_ID: ''},
            selectOptions:res
        }
    }
};

export default AddEmployePage;