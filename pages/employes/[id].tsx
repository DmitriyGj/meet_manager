import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import { useState } from "react";
import style from './addEmploye.module.scss';

interface EditEmployePageProps {
    employeInfo:{
        ID:string,
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

const AddEmployePage = ({employeInfo, selectOptions}: EditEmployePageProps) => {
    const [currentEmployeInfo, setEmployeInfo] = useState(employeInfo);
    const router = useRouter();
    return(
        <div>
            <form className={style.Form}>
                <fieldset>
                    {Object.entries(currentEmployeInfo).map(([key,value]) =>{
                        return(
                            (key !== 'ID') && (
                            key != 'POST_ID' ? 
                            <label>{key}
                            <input
                                value={ value }
                                onChange={
                                (e) => {
                                    setEmployeInfo({...currentEmployeInfo,[key]:e.target.value})
                                }
                            }
                                key={key} 
                                name={key} 
                                type='text'/> </label>
                            :   
                            <label>{key}
                            <select  value={currentEmployeInfo[key]}
                                    name='POST_ID'
                                    onChange={
                                        (e) => {
                                            setEmployeInfo({...currentEmployeInfo,[e.target.name]:e.target.value})
                                        }
                                    }>
                                {selectOptions.map(({ID, POST_NAME}) => {
                                    return <option key = {ID}
                                                value = {ID}>
                                                {POST_NAME}
                                            </option>
                                })}
                            </select>
                            </label>))
                            }
                        )
                    }
                </fieldset>
                <div className={style.ButtonBlock}>
                    <button onClick={(e) => {
                        e.preventDefault();
                        (async() => {
                            try{
                                const res = await fetch(`http://localhost:8081/api/employes/${+employeInfo.ID}`,
                                {
                                    method:'PUT',
                                    headers:{
                                        'Content-type':'application/json'
                                    },
                                    body: JSON.stringify(currentEmployeInfo)
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

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    const {id} = ctx.query;
    const selectRes = await fetch('http://localhost:8081/api/posts');
    const empRes = await fetch(`http://localhost:8081/api/employes/${id}`);
    const selectOptions = await selectRes.json();
    const employeInfo = (await empRes.json())[0];

    return {
        props: {
            employeInfo,
            selectOptions
        }
    }
};

export default AddEmployePage;