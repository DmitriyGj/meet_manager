import { useRouter } from "next/router"
import {GetServerSideProps } from 'next';
import { ChangeEvent, FormEvent, MouseEventHandler, useEffect, useState } from "react";
import style from './addMeeting.module.scss';
import { getCookie } from "cookies-next";
import MeetingsAPI from "../../public/src/API/MeetingsAPI";
import EmployeAPI from "../../public/src/API/EmployeAPI";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { IEmploye } from "../../public/src/types/Employe.model";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {Button } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import translatorFieldsToRULabels from "../../public/src/utils/translatorToRU";

interface IMeeting {
    START_DATE:Date,
    END_DATE:Date;
    members: number[] | []
}

interface IAddMeetingPage {
    rows:  GridRowsProp | any
    columns: GridColDef[] | any
    token: string
}

const AddMeetingPage = ({rows, columns,token}: IAddMeetingPage) => {
    const [meetingInfo, setMeetingInfo] = useState<IMeeting >({START_DATE:new Date(), END_DATE:new Date(), members:[]});
    const router = useRouter();

    const addClickHandler: MouseEventHandler = (e) =>  {
        (async() => {
            try{
                const res = await MeetingsAPI.addMeeting(meetingInfo,token);
            }
            catch(e){
                alert('что-то пошло не так');
            }
            finally{
                router.push('/meetings');
            }

        })()
    }
    
    const selectEmployeHandler = (e:any) => {
        setMeetingInfo({...meetingInfo, members:[...e.map((item:string) => {ID:+item})]})
    }
    return(
        <div className={style.main}>
            <FormControl className={style.Form}>
                <div className={style.PickersBlock}>
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
                                            renderInput={(props) => <TextField className={style.inputPicker} {...props}/> } />
                            
                            <DateTimePicker label='Конец встречи' 
                                            onChange={(date) => {
                                                if(date){
                                                    setMeetingInfo({...meetingInfo,END_DATE:date});
                                                }
                                            }}  
                                            value={meetingInfo.END_DATE} 
                                            renderInput={(props) => <TextField className={style.inputPicker} {...props}/> }/>
                    </LocalizationProvider>
                </div>

                    <FormLabel>
                        Участники
                    </FormLabel>
                    <DataGrid 
                            onSelectionModelChange={selectEmployeHandler}
                            checkboxSelection
                            className={style.DataGrid} 
                            rows={rows} 
                            columns={columns}/>

                            
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
        const data = await EmployeAPI.getEmployes(token as string);
        const columns:GridColDef[] = []
        Object.keys(data[0]).forEach((col: string) =>{
            if(!col.includes('_ID')){
                columns.push({field:col, headerName: translatorFieldsToRULabels.Employe[col], width:150})
            }
        });
        const rows = (data as IEmploye[]).map((item) => ({id: item.ID, ...item}))
        return {
            props: {
                rows,columns, token
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