import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import {  ChangeEventHandler, MouseEventHandler, ReactNode, useEffect, useState } from "react";
import style from '../addEmploye.module.scss';
import EmployeAPI from '../../../public/src/API/EmployeAPI';
import translatorFieldsToRULabels from "../../../public/src/utils/translatorToRU";
import { getCookie } from "cookies-next";
import { Button, FormControl, FormGroup, FormLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { IEmployeResonseData } from "../../../public/src/types/Employe.model";
import JWT from 'jwt-decode';
import GeustAPI from "../../../public/src/API/GeustAPI";

interface EditGUestPageProps {
    guestInfo:IEmployeResonseData,
    ID:string
    ROLE_NAME:string
};

const excludeToShow= ['ID', 'USER_ID' ,'ROLE_NAME', 'ROLE_ID']

const AddEmployePage = ({guestInfo}: EditGUestPageProps) => {
    const [currentGuestInfo, setGuestInfo] = useState(guestInfo);

    const clickSendHandler: MouseEventHandler = (e) => {
        e.preventDefault();
        (async() => {
            try{
                const token = getCookie('token')
                await GeustAPI.editGuest(+guestInfo.ID, currentGuestInfo,token as string);
            }
            catch(e){
                alert('что-то пошло не так')
            }
            finally{
                router.push('/guests')
            }

        })();
    };
    const inputChangeHandler:ChangeEventHandler<HTMLInputElement> =  ({target}) =>  {
        setGuestInfo({...currentGuestInfo,[target.name]:target.value})
    };

    const router = useRouter();
    return(
            <FormControl className={style.Form}>
                    {Object.keys(guestInfo).map((prop:string) =>  
                        !excludeToShow.includes(prop) && <FormLabel className={style.label}  
                            key={prop}
                            htmlFor={prop}>
                            {translatorFieldsToRULabels.Employe[prop]}
                                <TextField className={style.input}  
                                    onChange= {inputChangeHandler}
                                    value={currentGuestInfo[prop]}
                                    name={prop} 
                                    type='text'/> 
                        </FormLabel>)
                    }
                <FormGroup className={style.ButtonBlock}>
                    <Button className={style.Button} variant='contained' onClick={clickSendHandler}>Send</Button>
                </FormGroup>
            </FormControl>
    );
}

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    const {id} = ctx.query;
    const {req, res} = ctx;
    const token = getCookie('token',{req,res});
    const data: IEmployeResonseData | number = await EmployeAPI.getEmployeById(id as string, token as string);
    const {ROLE_NAME, ID} = (JWT(token as string) as {user:{ROLE_NAME:string, ID:string}}).user
    if(ROLE_NAME === 'GUEST'){
        return {
            redirect: {
                destination: '/guests',
                permanent:false
            }
        }
    }


    if(data === 401 || data === 403){
        return {
            redirect: {
                destination:'/login',
                permanent:false
            }
        }
    }

    return {
        props: {
            ID,
            ROLE_NAME,
            geustInfo: {...(data as IEmployeResonseData), PASSWORD:''},
        }
    }
};

export default AddEmployePage;