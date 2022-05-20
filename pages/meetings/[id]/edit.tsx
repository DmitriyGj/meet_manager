import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import { MouseEventHandler, useState, useRef, useEffect } from "react";
import style from '../addMeeting.module.scss';
import EmployeAPI from '../../../public/src/API/EmployeAPI';
import GuestAPI from '../../../public/src/API/GeustAPI';
import MeetingsAPI from "../../../public/src/API/MeetingsAPI";
import { getCookie } from "cookies-next";
import { DataGrid, GridApi, GridColDef, GridRowId, GridRowsProp } from "@mui/x-data-grid";
import { IEmploye } from "../../../public/src/types/Employe.model";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Button, FormControl, FormLabel, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import translatorFieldsToRULabels from '../../../public/src/utils/translatorToRU'
import JWT from 'jwt-decode';
import IMeeting from '../../../public/src/types/Meeting.model'
import {isAfter} from 'date-fns'

interface EditMeetingPageProps {
    meetingInfo:IMeeting,
    employesRows: GridRowsProp ,
    guestsRows: GridRowsProp
    columns: string[] | any
};

const columns = [{ field:'ID', headerName: translatorFieldsToRULabels.Employe['ID'], width:150},
    {field:'NAME', headerName: translatorFieldsToRULabels.Employe['NAME'], width:150},
    {field:'LAST_NAME', headerName: translatorFieldsToRULabels.Employe['LAST_NAME'], width:150},
    {field:'PATRONYMIC', headerName: translatorFieldsToRULabels.Employe['PATRONYMIC'], width:150},
    {field:'PHONE', headerName: translatorFieldsToRULabels.Employe['PHONE'], width:150},
    {field:'POST_NAME', headerName: translatorFieldsToRULabels.Employe['POST_NAME'], width:150},
    {field:'DEPART_NAME', headerName: translatorFieldsToRULabels.Employe['DEPART_NAME'], width:150},
    {field:'ADDRESS', headerName: translatorFieldsToRULabels.Employe['ADDRESS'], width:150},
    {field:'EMAIL', headerName: translatorFieldsToRULabels.Employe['EMAIL'], width:150},
]

const columnsGuests = [{ field:'ID', headerName: translatorFieldsToRULabels.Employe['ID'], width:150},
{field:'NAME', headerName: translatorFieldsToRULabels.Employe['NAME'], width:150},
{field:'LAST_NAME', headerName: translatorFieldsToRULabels.Employe['LAST_NAME'], width:150},
{field:'PATRONYMIC', headerName: translatorFieldsToRULabels.Employe['PATRONYMIC'], width:150},
{field:'PHONE', headerName: translatorFieldsToRULabels.Employe['PHONE'], width:150},
{field:'EMAIL', headerName: translatorFieldsToRULabels.Employe['EMAIL'], width:150}]


const EditMeetingPage = ({meetingInfo,employesRows, guestsRows}: EditMeetingPageProps) => {
    const router = useRouter();
    const [currentMeetingInfo, setCurrentMeetingInfo] = useState<IMeeting>(meetingInfo);

    const selectEmployeHandler = (e:any[]) =>{
        setCurrentMeetingInfo({...currentMeetingInfo, MEMBERS: e});
    }

    
    const selectGuestsHandler = (e:any[]) =>{
        setCurrentMeetingInfo({...currentMeetingInfo, GUESTS: e});
    }


    const clickSendHandler: MouseEventHandler = (e) => {
        e.preventDefault();
        if(isAfter(currentMeetingInfo.END_DATE, currentMeetingInfo.START_DATE)){
            (async() => {
                try{
                    const token = getCookie('token')
                    await MeetingsAPI.editMeeting(+meetingInfo?.ID, currentMeetingInfo,token as string);
                }
                catch(e){
                    alert('что-то пошло не так')
                }
                finally{
                    router.push('/meetings')
                }

            })();
        }
    };

    return(<div className={style.main}>
                        <FormControl className={style.Form}>
                            <div className={style.PickersBlock}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} >
                                        <DateTimePicker hideTabs
                                                        showTodayButton
                                                        className={style.Picker} label='Начало встречи' 
                                                        onChange={(date) => {
                                                            if(date){
                                                                setCurrentMeetingInfo({...currentMeetingInfo,START_DATE:date});
                                                            }
                                                        }}  
                                                        value={currentMeetingInfo.START_DATE} 
                                                        renderInput={(props) => <TextField 
                                                                helperText={isAfter(currentMeetingInfo.START_DATE, currentMeetingInfo.END_DATE) && 'Дата начала не может быть позже конца'}
                                                                error={isAfter(currentMeetingInfo.START_DATE, currentMeetingInfo.END_DATE)}
                                                                className={style.inputPicker} {...props}/> } />
                                        
                                        <DateTimePicker label='Конец встречи' 
                                                        onChange={(date) => {
                                                            if(date){
                                                                setCurrentMeetingInfo({...currentMeetingInfo,END_DATE:date});
                                                            }
                                                        }}  
                                                        value={currentMeetingInfo.END_DATE} 
                                                        renderInput={(props) => <TextField className={style.inputPicker} {...props}/> }/>
                                </LocalizationProvider>
                            </div>
                                <FormLabel>
                                    Участники
                                </FormLabel>

                                <div  className={style.dt}>
                                    <DataGrid selectionModel={currentMeetingInfo.MEMBERS}
                                            onSelectionModelChange={selectEmployeHandler}
                                            checkboxSelection
                                            rows={employesRows} 
                                            columns={columns}/>
                                </div>

                                <FormLabel>
                                    Гости
                                </FormLabel>
                                <div  className={style.dt}>
                                    <DataGrid selectionModel={currentMeetingInfo.GUESTS}
                                        onSelectionModelChange={selectGuestsHandler}
                                        checkboxSelection
                                        rows={guestsRows} 
                                        columns={columns}/>
                                </div>
                            <div className={style.ButtonBlock}>
                                <Button variant='contained'
                                    onClick={clickSendHandler}>Send</Button>
                                <Button variant='contained'>Cancel</Button>
                            </div>
                        </FormControl>
                    </div>
    );
}

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    const {id} = ctx.query;
    const {req, res} = ctx;
    const token = getCookie('token',{req,res});
    const employesData = await EmployeAPI.getEmployes(token as string);
    const {MEMBERS, GUESTS, ...rest} = await MeetingsAPI.getMeetingById(id as string, token as string) as IMeeting;
    const {ID, ROLE_NAME} = (JWT(token as string) as {user: {ID:string, ROLE_NAME:string}}).user
    if(employesData === 401 || employesData === 403){
        return {
            redirect: {
                destination: '/login',
                permanent:false
            }
        }
    }
    if(rest.INICIATOR_ID !== ID && ROLE_NAME !== 'ADMIN' ){
        return {
            redirect: {
                destination:`/meetings/${id}`,
                permanent:false
            }
        }
    }
    const guestsData = await GuestAPI.getGuests(token as string);
    const parsedMeetingInfo = {...rest, MEMBERS: MEMBERS.map(id => id.toString()), GUESTS: GUESTS.map(id => id.toString())} as IMeeting;
    const employesRows = (employesData as IEmploye[]).map((item) => ({id: item.ID , ...item}))
    const guestsRows = (guestsData as IEmploye[]).map((item) => ({id: item.ID , ...item}))
    return {
        props: {
            meetingInfo: parsedMeetingInfo, employesRows, guestsRows,token
        }
    }

};

export default EditMeetingPage;