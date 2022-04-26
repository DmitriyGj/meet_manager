import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import { ChangeEvent, MouseEventHandler, useState } from "react";
import style from './addEmploye.module.scss';
import EmployeAPI from '../../public/src/API/EmployeAPI';
import PostAPI from "../../public/src/API/PostAPI";
import translatorFieldsToRULabels from "../../public/src/utils/translatorToRU";

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

    const clickSendHandler: MouseEventHandler = (e) => {
        e.preventDefault();
        (async() => {
            try{
                await EmployeAPI.editEmploye(+employeInfo.ID, currentEmployeInfo);
            }
            catch(e){
                alert('что-то пошло не так')
            }
            finally{
                router.push('/employes')
            }

        })();
    };
    const changeInputHandler = (key:string) => ({target}:ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEmployeInfo({...currentEmployeInfo,[key]:target?.value})
    }

    
    const router = useRouter();
    return(
        <div>
            <form className={style.Form}>
                <fieldset>
                    {Object.entries(currentEmployeInfo).map(([key,value]) =>{
                        return(
                            (key !== 'ID') && (
                            <label>{translatorFieldsToRULabels.Employe[key]}
                            {   key != 'POST_ID' ? 
                                <input value={ value }
                                    onChange={changeInputHandler(key)}
                                    key={key} 
                                    name={key} 
                                    type='text'/> 
                                :   
                                <select  value={currentEmployeInfo[key]}
                                        name='POST_ID'
                                        onChange={changeInputHandler(key)}>
                                    {selectOptions.map(({ID, POST_NAME}) => {
                                        return <option key = {ID}
                                                    value = {ID}>
                                                    {POST_NAME}
                                                </option>
                                    })}
                                </select>
                                }
                            </label>))
                            }
                        )
                    }
                </fieldset>
                <div className={style.ButtonBlock}>
                    <button onClick={ clickSendHandler}>Send</button>
                    <button>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    const {id} = ctx.query;
    const selectOptions = await PostAPI.getPosts();
    const employeInfo = await EmployeAPI.getEmployeById(id as string);

    return {
        props: {
            employeInfo,
            selectOptions
        }
    }
};

export default AddEmployePage;