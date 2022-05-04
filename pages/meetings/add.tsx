import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import { ChangeEvent, FormEvent, MouseEventHandler, useEffect, useState } from "react";
import style from './addEmploye.module.scss';
import PostAPI  from '../../public/src/API/PostAPI';
import InitValues from '../../public/src/utils/initValues';
import translatorFieldsToRULabels from "../../public/src/utils/translatorToRU";
import { getCookie } from "cookies-next";
import MeetingsAPI from "../../public/src/API/MeetingsAPI";
import EmployeAPI from "../../public/src/API/EmployeAPI";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { TextField } from "@mui/material";
import { IEmploye } from "../../public/src/types/Employe.model";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
interface IMeeting {
    START_DATE:Date,
    END_DATE:Date;
    members: number[] | []
}

interface IAddMeetingPage {
    employes : IEmploye[]
}

const AddMeetingPage = ({employes}: IAddMeetingPage) => {
    const [meetingInfo, setMeetingInfo] = useState<IMeeting >({START_DATE:new Date(), END_DATE:new Date(), members:[]});
    const router = useRouter();

    const inputChangeHandler =  ({target}: ChangeEvent<HTMLInputElement>) =>  setMeetingInfo({...meetingInfo,[target.name]:target.value})
    const addClickHandler: MouseEventHandler = (e) =>  {
        (async() => {
            try{
                await MeetingsAPI.addMeeting(meetingInfo);
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
        setMeetingInfo({...meetingInfo,[target.name]:target.value})
    }
    useEffect(() => {
        console.log(meetingInfo.START_DATE)
    })

    return(
        <div>
            <form className={style.Form}>
                <fieldset>
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                        <DateTimePicker onChange={(date) => {
                            console.log(date)
                            if(date){
                                meetingInfo.START_DATE = date
                            }
                        }}  value={meetingInfo.START_DATE} 
                        renderInput={(props) => <TextField {...props}/> } 
                        />
                    </LocalizationProvider>

                </fieldset>
                <div className={style.ButtonBlock}>
                    <button onClick={addClickHandler}>Send</button>
                    <button>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    try{
        const {res,req } = ctx
        const token = getCookie('token', {req,res})
        const employes = await EmployeAPI.getEmployes(token as string);
        return {
            props: {
                employes
            }
        }
    }
    catch (e){
        console.log(e);
        return {
            props: {
                
            }
        }
    }

};

export default AddMeetingPage;