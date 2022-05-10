import type { GetServerSideProps, NextPage } from 'next'
import styles from '../../styles/Home.module.css'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import Button  from '@mui/material/Button'
import { useRouter } from 'next/router';
import { useState } from 'react';
import MeetingsAPI from '../../public/src/API/MeetingsAPI';
import { getCookie } from 'cookies-next';
import translatorFieldsToRULabels from '../../public/src/utils/translatorToRU';
import IMeeting from '../../public/src/types/Meeting.model';

interface IMeetingsPage {
    rows:  GridRowsProp | any
    columns: GridColDef[] | any
    token: string
}


const Meetings = ({rows,columns, token} : IMeetingsPage) => {
    const router = useRouter();
    const [selectedRow, setSelectedRow] = useState<number | null>(null)

    const clickAddHandler = () => {
        router.push(`${router.asPath}/add`);
    }

    const clickChangeHandler = () => {
        router.push(`${router.asPath}/${selectedRow}`);
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
            <DataGrid onSelectionModelChange={(e) => {
                setSelectedRow(+e[0]);
            }} rows={rows} columns={columns} />
            <div className = {styles.ButtonContainer}>
                <Button variant='contained'  
                        onClick={clickAddHandler}
                        style={{borderRadius: 35,
                            fontSize: "14px",
                            width: '10%',
                            margin: '0% 1%'}}
                >Добавить</Button>
                <Button variant='contained' 
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
                            }} >Изменить</Button>
                </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps  = async (ctx ) => {
    try{
        const {req,res} = ctx;
        const token = getCookie('token',{req,res});
        if(!token){
            return {
                redirect: {
                    destination: '/login',
                    permanent:false,
                }
            } 
        }
        const data = await MeetingsAPI.getMeetings(token as string);
        console.log(data)
        if(data.status === 403){
            return {
                redirect: {
                    destination: '/login',
                    permanent:false,
                }
            }
        }
        const columns:GridColDef[] = []
        Object.keys(data[0]).forEach((col: string) =>{
            if(!col.includes('_ID')){
                columns.push({field:col, headerName: translatorFieldsToRULabels.Meeting[col], width:250})
            }
        });
        const rows = (data as IMeeting[]).map((item) => ({id: item.ID, ...item}))
        return { props: 
                {rows , columns, token} 
            };
    }
    catch(e){
        console.log(e);
        return {notFound:true }
    }
};

export default Meetings
