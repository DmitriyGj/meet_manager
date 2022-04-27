import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import { ChangeEvent, FormEvent, MouseEventHandler, useState } from "react";
import style from './addEmploye.module.scss';
import EmployeAPI from '../public/src/API/EmployeAPI';
import PostAPI  from '../public/src/API/PostAPI';
import InitValues from '../public/src/utils/initValues';
import { IPost } from "../public/src/types/Post.model";
import translatorFieldsToRULabels from "../public/src/utils/translatorToRU";
import { getCookie } from "cookies-next";

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
    selectOptions: IPost[]
};

const AddEmployePage = ({employeFields, selectOptions}: AddEmployePageProps) => {
    const [employeInfo, setEmployeInfo] = useState({...employeFields,['POST_ID']:selectOptions[0].ID,});
    const router = useRouter();

    const inputChangeHandler =  ({target}: ChangeEvent<HTMLInputElement>) =>  setEmployeInfo({...employeInfo,[target.name]:target.value})
    const addClickHandler: MouseEventHandler = (e) =>  {
        (async() => {
            try{
                const token = getCookie('token')
                await EmployeAPI.addEmploye(employeInfo, token as string);
            }
            catch(e){
                alert('что-то пошло не так');
            }
            finally{
                router.push('/employes');
            }

        })()
    }
    const onchangeSelectHandler =  ({target}: ChangeEvent<HTMLSelectElement>) => {
        setEmployeInfo({...employeInfo,[target.name]:target.value})
    }

    return(
        <div>
            <form className={style.Form}>
                <fieldset>
                    {Object.keys(employeFields).map((prop) =>  
                    <label  key={prop} >{translatorFieldsToRULabels.Employe[prop]}
                        {prop != 'POST_ID' ?
                            <input  onChange= {inputChangeHandler}
                                name={prop} 
                                type='text'/> 
                            :
                            <select name='POST_ID'
                                    onChange={onchangeSelectHandler}>
                                {selectOptions.map(({ID, POST_NAME}) => {
                                    return <option key = {ID}
                                                value = {ID}>
                                                {POST_NAME}
                                            </option>
                                })}
                            </select>
                        }
                    </label>)
                    }

                </fieldset>
                <div className={style.ButtonBlock}>
                    <button onClick={addClickHandler}>Send</button>
                    <button>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export const getServerSideProps : GetServerSideProps = async() => {
    try{
        const selectOptions = await PostAPI.getPosts();
        return {
            props: {
                employeFields: InitValues.EmployeInfo,
                selectOptions
            }
        }
    }
    catch (e){
        console.log(e);
        return {
            props: {
                employeFields: InitValues.EmployeInfo,
                selectOptions:[]
            }
        }
    }

};

export default AddEmployePage;