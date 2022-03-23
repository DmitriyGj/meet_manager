import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import Button  from '@mui/material/Button'


const Meetings: NextPage = () => {
    return (<div className={styles.container}>
            <h1>Встречи</h1>
            <DataGrid rows={rows} columns={columns} />
            <div className = {styles.ButtonContainer}>
                <Button variant='contained' sx = { {width:'10%' } }>Добавить</Button>
                <Button variant='contained' sx = { {width:'10%' } }>Удалить</Button>
                <Button variant='contained' sx = { {width:'10%' } } >Изменить</Button>
                </div>
        </div>
    )
}

export default Meetings
