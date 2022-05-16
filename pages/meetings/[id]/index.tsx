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

interface IMeeting {
    ID:number
    START_DATE:Date,
    END_DATE:Date;
    MEMBERS:  string[]
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

    return(<div className={style.main}>
                        <FormControl className={style.Form}>
                            <div className={style.PickersBlock}>
                                <LocalizationProvider dateAdapter={AdapterDateFns} >
                                        <DateTimePicker hideTabs
                                                        showTodayButton
                                                        className={style.Picker} label='Начало встречи' 
                                                        disabled
                                                        onChange={(date) => {
                                                            if(date){
                                                                setCurrentMeetingInfo({...currentMeetingInfo,START_DATE:date});
                                                            }
                                                        }}  
                                                        value={meetingInfo.START_DATE} 
                                                        renderInput={(props) => <TextField className={style.inputPicker} {...props}/> } />
                                        
                                        <DateTimePicker label='Конец встречи' 
                                                        disabled
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
                                <DataGrid onRowDoubleClick={(e) =>  router.push(`/employes/${e.id}`)}
                                        selectionModel={currentMeetingInfo.MEMBERS}
                                        checkboxSelection
                                        className={style.DataGrid} 
                                        rows={rows} 
                                        columns={columns}/>
                                        
                        </FormControl>
                    </div>
    );
}

export const getServerSideProps : GetServerSideProps = async(ctx) => {
    const {id} = ctx.query;
    const {req, res} = ctx;
    const token = getCookie('token',{req,res});
    const meeting = await MeetingsAPI.getMeetingById(id as string, token as string) as IMeeting;
    if(!meeting){
        return {
            notFound:true
        }
    }
    const {MEMBERS, ...rest} = meeting;
    const parsedMeetingInfo = {...rest, MEMBERS: MEMBERS.map(id => id.toString())} as IMeeting;
    if(!parsedMeetingInfo){
        return {
            notFound:true
        }
    }
    const data = await EmployeAPI.getEmployes(token as string);
    const rows = (data as IEmploye[]).map((item) => ({id: item.ID , ...item}))
    return {
        props: {
            meetingInfo: parsedMeetingInfo,rows,token
        }
    }

};

export default EditMeetingPage;