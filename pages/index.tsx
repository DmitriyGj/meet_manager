import type { GetServerSideProps, NextPage } from 'next'
import style from './index.module.scss';
import JWT from 'jwt-decode';
import { FormControl, FormGroup, FormLabel, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MeetingsAPI from '../public/src/API/MeetingsAPI';
import EmployeAPI from '../public/src/API/EmployeAPI';
import IMeeting from '../public/src/types/Meeting.model';
import { useRouter } from 'next/router';
import { Buffer } from '../public/src/types/Buffer';

const columns: GridColDef[] =
[{field: 'ID' , headerName: 'ID', width:150},
{field: 'START_DATE' , headerName: 'Начало', width:250},
{field: 'END_DATE' , headerName: 'Конец', width:250}]

interface UserPageProps {
    userInfo: any
    meetings:any
}

const TranslateToRuLables:Buffer<Buffer<string>> = {
    UserInfo: {
        'ADDRESS' : 'Адрес',
        'PHONE' : 'Номер телефона',
        'LOGIN': 'Логин',
        'EMAIL': 'Почта',
        'ROLE_NAME':'Уровень доступа',
        'DEPART_NAME':'Подразделение',
        'POST_NAME':'Должность'
    }
}

const excludeToShow = ['POST_ID', 'ROLE_ID', 'ID', 'USER_ID', 'NAME', 'LAST_NAME', 'PATRONYMIC', 'PASSWORD', 'ROLE_NAME', "DEPART_ID"]

const UserPage = ({userInfo, meetings}: UserPageProps) => {
    const {NAME, LAST_NAME, ID, USER_ID, ROLE_NAME, PATRONYMIC} = userInfo;
    const router = useRouter();

    return (<div className={style.container}>
            <FormControl className={style.FormInfo} >
                <FormLabel className={style.Header}>
                    {ROLE_NAME}: {LAST_NAME} {NAME} {PATRONYMIC} #{ID}#{USER_ID} 
                </FormLabel>
                <div className={style.ExtendInfo}>
                    <FormLabel className={style.Header}>Полная информация</FormLabel>
                    <div className={style.content}>
                        {Object.entries(userInfo).map(([key,value]) => 
                            !excludeToShow.includes(key) && 
                            <FormLabel className={style.FormLabel} key={key}>{TranslateToRuLables['UserInfo'][key]}: {value}</FormLabel>)
                        }
                    </div>
                </div>
                
                <div className={style.BlockWithDt}>
                    <FormLabel>
                        Встречи
                    </FormLabel>
                    <DataGrid onRowDoubleClick={(e) => router.push(`/meetings/{+e[0]}`)} 
                                columns={columns} 
                                rows = {meetings}/>
                </div>
                <div className={style.BlockWithDt}>
                    <FormLabel >
                        Организованные встречи
                        
                    </FormLabel>
                    <DataGrid onRowDoubleClick={(e) => router.push(`/meetings/{+e[0]}`)} 
                                columns={columns} 
                                rows = {meetings}/>
                </div>
            </FormControl>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    if(!ctx.req.cookies['token'] ){
        return {
            redirect: {
                destination:'/login',
                permanent:false
            }
        }
    }
    const token = ctx.req.cookies['token']
    const {user} = JWT(token) as {user: any};
    console.log(user)
    const {ID} = user;
    const userInfo = await EmployeAPI.getEmployeById(ID, token)
    console.log(userInfo)
    const meetings = await EmployeAPI.getMeetingsOfEmploye(user.ID as string)
    const rows = (meetings as IMeeting[]).map((item) => ({id: item.ID, ...item}))
    console.log(rows)
    return {props: {userInfo, meetings:rows}}
}

export default UserPage
