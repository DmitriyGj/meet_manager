import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import Button  from '@mui/material/Button'
import { useEffect } from 'react';

const rows: GridRowsProp = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns: GridColDef[] = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
];

const Guests: NextPage = () => {
    useEffect(() => {
        (async() => {
            console.log('posting')
            const res = await fetch('http://localhost:8081/api/departaments',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({NAME:'Test otdel'})
            })
            console.log(res);
        })()
    })

    return (<div className={styles.container}>
            <h1>Гости</h1>
            <DataGrid rows={rows} columns={columns} />
            <div className = {styles.ButtonContainer}>
                <Button variant='contained'  style={{ borderRadius: 35,
                                                    backgroundColor: "gray",
                                                    fontSize: "14px",
                                                    width: '10%',
                                                    margin: '0% 1%'
                                                }}>Добавить</Button>
                <Button variant='contained' style={{borderRadius: 35,
                                                    backgroundColor: "gray",
                                                    fontSize: "14px",
                                                    width: '10%',
                                                    margin: '0% 1%'
                                                }}>Удалить</Button>
                <Button variant='contained'style={{borderRadius: 35,
                                                    backgroundColor: "gray",
                                                    fontSize: "14px",
                                                    width: '10%',
                                                    margin: '0% 1%'
                                                }} >Изменить</Button>
                </div>
        </div>
    )
}

export default Guests
