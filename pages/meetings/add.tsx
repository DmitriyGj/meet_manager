import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import { MouseEventHandler, useEffect, useState } from "react";
import style from './addMeeting.module.scss';
import { getCookie } from "cookies-next";
import MeetingsAPI from "../../public/src/API/MeetingsAPI";
import EmployeAPI from "../../public/src/API/EmployeAPI";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { IEmploye } from "../../public/src/types/Employe.model";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {Button } from '@mui/material';
import { DataGrid,  GridRowsProp } from "@mui/x-data-grid";
import translatorFieldsToRULabels from "../../public/src/utils/translatorToRU";
import JWT from 'jwt-decode';
import IMeeting from '../../public/src/types/Meeting.model'
import GeustAPI from "../../public/src/API/GeustAPI";
import {isAfter} from 'date-fns'

interface IAddMeetingPage {
    employesRows:  GridRowsProp | any
    guestsRows: GridRowsProp | any
    token: string
}

const employeColumns = [{ field:'ID', headerName: translatorFieldsToRULabels.Employe['ID'], width:150},
    {field:'NAME', headerName: translatorFieldsToRULabels.Employe['NAME'], width:150},
    {field:'LAST_NAME', headerName: translatorFieldsToRULabels.Employe['LAST_NAME'], width:150},
    {field:'PATRONYMIC', headerName: translatorFieldsToRULabels.Employe['PATRONYMIC'], width:150},
    {field:'PHONE', headerName: translatorFieldsToRULabels.Employe['PHONE'], width:150},
    {field:'POST_NAME', headerName: translatorFieldsToRULabels.Employe['POST_NAME'], width:150},
    {field:'DEPART_NAME', headerName: translatorFieldsToRULabels.Employe['DEPART_NAME'], width:150},
    {field:'ADDRESS', headerName: translatorFieldsToRULabels.Employe['ADDRESS'], width:150},
    {field:'EMAIL', headerName: translatorFieldsToRULabels.Employe['EMAIL'], width:150},
]

const gugestColumns = [{ field:'ID', headerName: translatorFieldsToRULabels.Employe['ID'], width:150},
    {field:'NAME', headerName: translatorFieldsToRULabels.Employe['NAME'], width:150},
    {field:'LAST_NAME', headerName: translatorFieldsToRULabels.Employe['LAST_NAME'], width:150},
    {field:'PATRONYMIC', headerName: translatorFieldsToRULabels.Employe['PATRONYMIC'], width:150},
    {field:'PHONE', headerName: translatorFieldsToRULabels.Employe['PHONE'], width:150},
    {field:'EMAIL', headerName: translatorFieldsToRULabels.Employe['EMAIL'], width:150},
]

const AddMeetingPage = ({employesRows, guestsRows , token}: IAddMeetingPage) => {
    const [meetingInfo, setMeetingInfo] = useState({START_DATE:new Date(), END_DATE:new Date(), MEMBERS:[], GUESTS:[]});
    const router = useRouter();

    const addClickHandler: MouseEventHandler = (e) =>  {
        if(!isAfter(meetingInfo.START_DATE,meetingInfo.END_DATE)){
            (async() => {
                try{
                    const {user} = JWT(token) as {user:any}
                    const meeting = await MeetingsAPI.addMeeting({INICIATOR_ID:user.ID  ,...meetingInfo},token);
                    console.log(meeting)
                }
                catch(e){
                    alert('??????-???? ?????????? ???? ??????');
                }
                finally{
                    router.push('/meetings');
                }

            })()
        }
    }
    
    const selectEmployeHandler = (e:any) => {
        setMeetingInfo({...meetingInfo, MEMBERS:e})
    }

    const selectGuestsHandler = (e:any) => {
        setMeetingInfo({...meetingInfo, GUESTS:e})
    }

    useEffect(()=>{
        console.log(isAfter(meetingInfo.START_DATE,meetingInfo.END_DATE))
    })

    return(
        <div className={style.main}>
            <FormControl className={style.Form}>
                <div className={style.PickersBlock}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                            <DateTimePicker 
                                            hideTabs
                                            showTodayButton
                                            className={style.Picker} label='???????????? ??????????????' 
                                            onChange={(date) => {
                                                    if(date){
                                                        setMeetingInfo({...meetingInfo,START_DATE:date});
                                                    }
                                                }} 
                                            value={meetingInfo.START_DATE} 
                                            renderInput={(props) => <TextField
                                                helperText={isAfter(meetingInfo.START_DATE,meetingInfo.END_DATE) && '???????? ???????????? ???? ?????????? ???????? ?????????? ??????????'}
                                                error={isAfter(meetingInfo.START_DATE,meetingInfo.END_DATE)}
                                                className={style.inputPicker} {...props}/> } />
                            
                            <DateTimePicker label='?????????? ??????????????' 
                                            onChange={(date) => {
                                                    if(date){
                                                        setMeetingInfo({...meetingInfo,END_DATE:date});
                                                    }
                                                }}
                                            value={meetingInfo.END_DATE} 
                                            renderInput={(props) => <TextField 
                                                error={isAfter(meetingInfo.START_DATE,meetingInfo.END_DATE)}  
                                                className={style.inputPicker} {...props}/> }/>
                    </LocalizationProvider>
                </div>
                <FormLabel>
                    ??????????????????
                </FormLabel>
                <div className={style.dt}>
                    <DataGrid 
                        onSelectionModelChange={selectEmployeHandler}
                        checkboxSelection
                        rows={employesRows} 
                        columns={employeColumns}/>
                </div>

                
                <FormLabel >
                    ??????????
                </FormLabel>
                <div className={style.dt}>
                    <DataGrid 
                            onSelectionModelChange={selectGuestsHandler}
                            checkboxSelection
                            rows={guestsRows} 
                            columns={gugestColumns}/>

                </div>
                            
                <div className={style.ButtonBlock}>
                    <Button variant='contained'
                        onClick={addClickHandler}>Send</Button>
                    <Button variant='contained'>Cancel</Button>
                </div>
            </FormControl>
        </div>

    );
}

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    try{
        const {res,req } = ctx
        const token = getCookie('token', {req,res})
        const employes = await EmployeAPI.getEmployes(token as string);
        if(employes === 403 || employes === 401){
            return {
                redirect: {
                    destination:'/login',
                    permanent:false
                }
            }
        }
        const {user} = JWT(token as string) as {user: {ID:string, ROLE_NAME:string}};
        if(user.ROLE_NAME === 'GUEST'){
            return {
                redirect: {
                    destination:'/meetings',
                    permanent:false
                }
            }
        }
        const guests = await GeustAPI.getGuests(token as string);

        const employesRows = (employes as IEmploye[]).map((item) => ({id: item.ID, ...item}))
        const guestsRows = (guests as IEmploye[]).map((item) => ({id: item.ID, ...item}))
        return {
            props: {
                employesRows, guestsRows, token
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