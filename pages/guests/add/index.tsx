import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import {   ChangeEventHandler,  MouseEventHandler, ReactNode, useState } from "react";
import style from '../addEmploye.module.scss';
import GuestInfo from '../../../public/src/API/GeustAPI';
import InitValues from '../../../public/src/utils/initValues';
import translatorFieldsToRULabels from "../../../public/src/utils/translatorToRU";
import { getCookie } from "cookies-next";
import { FormGroup, FormLabel, TextField, FormControl , Button } from "@mui/material";
import {IEmployeResonseData } from '../../../public/src/types/Employe.model';
import JWT from 'jwt-decode'

interface AddEmployePageProps {
    employeFields:IEmployeResonseData
    token: string
};

const AddEmployePage = ({employeFields, token}: AddEmployePageProps) => {
    const [guestInfo, setGuestInfo] = useState<IEmployeResonseData>({...employeFields});
    const router = useRouter();

    const inputChangeHandler:ChangeEventHandler<HTMLInputElement> =  ({target}) =>  {
        setGuestInfo({...guestInfo,[target.name]:target.value})
    };
    
    const addClickHandler: MouseEventHandler = (e) =>  {
        (async() => {
            try{
                await GuestInfo.addGuest(guestInfo, token);
            }
            catch(e){
                alert('что-то пошло не так');
            }
            finally{
                router.push('/guests')
            }

        })()
    }

    return(
                <FormControl className={style.Form}>
                        {Object.keys(guestInfo).map((prop:string) =>  
                            <FormLabel className={style.label}  
                                key={prop}
                                htmlFor={prop}>
                                {translatorFieldsToRULabels.Employe[prop]}
                                    <TextField className={style.input}  
                                        onChange= {inputChangeHandler}
                                        value={guestInfo[prop]}
                                        name={prop} 
                                        type='text'/> 
                            </FormLabel>)
                        }
                    <FormGroup className={style.ButtonBlock}>
                        <Button className={style.Button} variant='contained' onClick={addClickHandler}>Send</Button>
                        <Button className={style.Button} variant='contained'> Cancel</Button>
                    </FormGroup>
                </FormControl>

    );
}

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    try{
        const {req, res} = ctx;
        const token = getCookie('token',{req,res});
        const {ROLE_NAME} = (JWT(token as string) as {user:{ROLE_NAME:string}}).user

        if(ROLE_NAME === 'GUEST'){
            return {
                redirect: {
                    destination: '/guests',
                    permanent:false
                }
            }
        }
        return {
            props: {
                employeFields: InitValues.GuestInfo,
                token
            }
        }
    }
    catch (e){
        console.log(e);
        return {
            props: {
                employeFields: InitValues.GuestInfo,
            }
        }
    }

};

export default AddEmployePage;