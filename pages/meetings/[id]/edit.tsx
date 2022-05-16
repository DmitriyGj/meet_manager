import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import { MouseEventHandler, useState, useRef, useEffect } from "react";
import style from '../addMeeting.module.scss';
import EmployeAPI from '../../../public/src/API/EmployeAPI';
import MeetingsAPI from "../../../public/src/API/MeetingsAPI";
import { getCookie } from "cookies-next";
import { DataGrid, GridApi, GridColDef, GridRowId, GridRowsProp } from "@mui/x-data-grid";
import { IEmploye } from "../../../public/src/types/Employe.model";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Button, FormControl, FormLabel, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import translatorFieldsToRULabels from '../../../public/src/utils/translatorToRU'
import JWT from 'jwt-decode';

interface IMeeting {
    ID:number
    START_DATE:Date,
    END_DATE:Date;
    MEMBERS:  string[];
    INICIATOR_ID: string
}

interface EditMeetingPageProps {
    meetingInfo:IMeeting,
    rows: GridRowsProp ,
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


const EditMeetingPage = ({meetingInfo, rows}: EditMeetingPageProps) => {
    const router = useRouter();
    const [currentMeetingInfo, setCurrentMeetingInfo] = useState(meetingInfo);

    const selectEmployeHandler = (e:any[]) =>{
        setCurrentMeetingInfo({...currentMeetingInfo, MEMBERS: e});
    }


    const clickSendHandler: MouseEventHandler = (e) => {
        e.preventDefault();
        (async() => {
            try{
                const token = getCookie('token')
                await MeetingsAPI.editMeeting(+meetingInfo.ID, currentMeetingInfo,token as string);
            }
            catch(e){
                alert('что-то пошло не так')
            }
            finally{
                router.push('/meetings')
            }

        })();
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
                                                        value={meetingInfo.START_DATE} 
                                                        renderInput={(props) => <TextField className={style.inputPicker} {...props}/> } />
                                        
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
                                <DataGrid selectionModel={currentMeetingInfo.MEMBERS}
                                        onSelectionModelChange={selectEmployeHandler}
                                        checkboxSelection
                                        className={style.DataGrid} 
                                        rows={rows} 
                                        columns={columns}/>
                                        
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
    const data = await EmployeAPI.getEmployes(token as string);
    const {MEMBERS, ...rest} = await MeetingsAPI.getMeetingById(id as string, token as string) as IMeeting;
    const {ID, ROLE_NAME} = (JWT(token as string) as {user: {ID:string, ROLE_NAME:string}}).user
    if(data === 401 || data === 403){
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
    const parsedMeetingInfo = {...rest, MEMBERS: MEMBERS.map(id => id.toString())} as IMeeting;
    const rows = (data as IEmploye[]).map((item) => ({id: item.ID , ...item}))
    return {
        props: {
            meetingInfo: parsedMeetingInfo,rows,token
        }
    }

};

export default EditMeetingPage;