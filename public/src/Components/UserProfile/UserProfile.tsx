import { FormControl, FormLabel } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import style from './UserProfile.module.scss';
import { Buffer } from "../../types/Buffer";

const columns: GridColDef[] =
[{field: 'ID' , headerName: 'ID', width:150},
{field: 'START_DATE' , headerName: 'Начало', width:250},
{field: 'END_DATE' , headerName: 'Конец', width:250}]

interface UserProfileProps {
    userInfo: any
    meetings:any
    initedMeetings:any
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



export const UserProfile = ({userInfo, meetings, initedMeetings}: UserProfileProps) => {
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
                    <DataGrid onRowDoubleClick={(e) => router.push(`/meetings/${e.id}`)} 
                                columns={columns} 
                                rows = {meetings}/>
                </div>
                <div className={style.BlockWithDt}>
                    <FormLabel >
                        Организованные встречи
                        
                    </FormLabel>
                    <DataGrid onRowDoubleClick={(e) => router.push(`/meetings/${e.id}`)} 
                                columns={columns} 
                                rows = {initedMeetings}/>
                </div>
            </FormControl>
        </div>
    )
}