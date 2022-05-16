import type { GetServerSideProps, NextPage } from 'next'
import styles from '../../styles/Home.module.css'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import {Button}  from '@mui/material'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MeetingsAPI from '../../public/src/API/MeetingsAPI';
import { getCookie } from 'cookies-next';
import IMeeting from '../../public/src/types/Meeting.model';
import JWT from 'jwt-decode';

interface IMeetingsPage {
    rows:  GridRowsProp | any
    token: string
    ID:number,
    ROLE_NAME:string
}

const columns: GridColDef[] =
[{field: 'ID' , headerName: 'ID', width:150},
{field: 'START_DATE' , headerName: 'Начало', width:500},
{field: 'END_DATE' , headerName: 'Конец', width:500}]

const Meetings = ({rows, token, ID, ROLE_NAME} : IMeetingsPage) => {
    const router = useRouter();
    const [selectedRow, setSelectedRow] = useState<number | null>(null)

    const clickAddHandler = () => {
        router.push(`${router.asPath}/add`);
    }

    const clickChangeHandler = () => {
            if(selectedRow){
                router.push(`${router.asPath}/${selectedRow}/edit`)
        } 
        else{
            alert('Выберите запись');
        }
    }

    const clickRemoveHandler = () => {
        (async () => {
            try{
                if(selectedRow){
                    await MeetingsAPI.removeMeeting(selectedRow.toString(), token);
                }
                else{
                    alert('Выберите запись');
                }
            }
            catch(e){
                console.log(e);
            }
            finally{
                router.reload();
            }
        })();
    }

    return (<div className={styles.container}>
            <h1>Встречи</h1>
            <DataGrid onRowDoubleClick={(e) => router.push(`/meetings/${+e.id}`)}
                        onSelectionModelChange={(e) => {
                            setSelectedRow(+e[0]);
                        }
                    } 
                    rows={rows} columns={columns} />
            <div className = {styles.ButtonContainer}>
                <Button variant='contained'  
                        onClick={clickAddHandler}
                        style={{borderRadius: 35,
                            fontSize: "14px",
                            width: '10%',
                            margin: '0% 1%'}}
                >Добавить</Button>
                {
                    (ROLE_NAME === 'ADMIN' || (rows as IMeeting[]).find(item => +item.INICIATOR_ID === ID && +item.ID === selectedRow)) && 
                    (<><Button variant='contained' 
                    onClick={clickRemoveHandler}
                    style={{borderRadius: 35,
                            fontSize: "14px",
                            width: '10%',
                            margin: '0% 1%'}}
                    >Удалить</Button>
                    <Button variant='contained'
                    onClick = {clickChangeHandler}
                    style={{borderRadius: 35,
                            fontSize: "14px",
                            width: '10%',
                            margin: '0% 1%'
                        }} >Изменить</Button></>)
                }
                                
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps  = async (ctx ) => {
    try{
        const {req,res} = ctx;
        const token = getCookie('token',{req,res});
        const data = await MeetingsAPI.getMeetings(token as string);
        if(data === 401 || data === 403){
            return {
                redirect: {
                    destination:'/login',
                    permanent:false
                }
            }
        }
        const {ID, ROLE_NAME} = (JWT(token as string) as {user: {ID:string, ROLE_NAME:string}}).user
        const rows = (data as IMeeting[]).map((item) => ({id: item.ID, ...item}))
        console.log(rows)
        return { props: 
                {rows ,  token, ID, ROLE_NAME} 
            };
    }
    catch(e){
        console.log(e);
        return {notFound:true }
    }
};

export default Meetings
