import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import { MouseEventHandler, useEffect, useState, useRef } from "react";
import style from './addMeeting.module.scss';
import EmployeAPI from '../../public/src/API/EmployeAPI';
import MeetingsAPI from "../../public/src/API/MeetingsAPI";
import translatorFieldsToRULabels from "../../public/src/utils/translatorToRU";
import { getCookie } from "cookies-next";
import { DataGrid, GridApi, GridColDef, GridRowId, GridRowsProp } from "@mui/x-data-grid";
import { DataGridPro  } from '@mui/x-data-grid-pro';
import { IEmploye } from "../../public/src/types/Employe.model";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Button, FormControl, FormLabel, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useGridApiRef } from '@mui/x-data-grid';

interface IMeeting {
    ID:number
    START_DATE:Date,
    END_DATE:Date;
    members: string[]
}

interface EditMeetingPageProps {
    meetingInfo:IMeeting,
    rows: GridRowsProp ,
    columns: string[] | any
};

const EditMeetingPage = ({meetingInfo, rows, columns}: EditMeetingPageProps) => {
    const router = useRouter();
    const apiRef = useRef<GridApi>(null);
    const [currentMeetingInfo, setMeetingInfo] = useState(meetingInfo);

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
                                <LocalizationProvider dateAdapter={AdapterDateFns} >
                                        <DateTimePicker hideTabs
                                                        showTodayButton
                                                        className={style.Picker} label='Начало встречи' 
                                                        onChange={(date) => {
                                                            if(date){
                                                                setMeetingInfo({...meetingInfo,START_DATE:date});
                                                            }
                                                        }}  
                                                        value={meetingInfo.START_DATE} 
                                                        renderInput={(props) => <TextField className={style.input} {...props}/> } />
                                        
                                        <DateTimePicker label='Конец встречи' 
                                                        onChange={(date) => {
                                                            if(date){
                                                                setMeetingInfo({...meetingInfo,END_DATE:date});
                                                            }
                                                        }}  
                                                        value={meetingInfo.END_DATE} 
                                                        renderInput={(props) => <TextField className={style.input} {...props}/> }/>
                                </LocalizationProvider>
                                <FormLabel>
                                    Участники
                                </FormLabel>
                                <DataGrid selectionModel={meetingInfo.members}
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
    const meetingInfo = await MeetingsAPI.getMeetingById(id as string, token as string) as IMeeting;
    const data = await EmployeAPI.getEmployes(token as string);
    const columns:GridColDef[] = []
    Object.keys(data[0]).forEach((col: string) =>{
        if(!col.includes('_ID')){
            columns.push({field:col, headerName: translatorFieldsToRULabels.Employe[col], width:150})
        }
    });
    const rows = (data as IEmploye[]).map((item) => ({id: item.ID,selected: true, ...item}))
    return {
        props: {
            meetingInfo,rows,columns, token
        }
    }

};

export default EditMeetingPage;