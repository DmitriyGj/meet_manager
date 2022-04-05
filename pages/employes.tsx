import type { GetStaticProps, NextPage } from 'next'
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

interface IEmployesPage {
    rows:  GridRowsProp | any
    columns: GridColDef[] | any
}

const Employes = ({rows, columns} : IEmployesPage) => {
    return (<div className={styles.container}>
            <h1>Работники</h1>
            <DataGrid rows={rows} columns={columns} />
            <div className = {styles.ButtonContainer}>
                <Button variant='contained'  style={{borderRadius: 35,
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

export const getStaticProps: GetStaticProps  = async ( ) => {

        // const rows: GridRowsProp = [
        //     { id: 1, col1: 'Hello', col2: 'World' },
        //     { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
        //     { id: 3, col1: 'MUI', col2: 'is Amazing' },
        // ];
        
        // const columns: GridColDef[] = [
        //     { field: 'col1', headerName: 'Column 1', width: 150 },
        //     { field: 'col2', headerName: 'Column 2', width: 150 },
        // ];
        try{
            const data = await fetch('http://localhost:8081/api/employes');
            const parsedData = await data.json();
            const columns = Object.keys(parsedData[0]).map((col: string) =>( {field:col.toLowerCase(), headerName:col.toLowerCase(), width:225}));
            const rows = parsedData.map((item: any) => {
                const rowItem: any = {};
                Object.keys(item).forEach((key:string) => rowItem[key.toLowerCase()] = item[key] );
                return rowItem;
            })
            return { props: 
                    {rows , columns} 
                };
        }
        catch(e){
            console.log(e);
            return {notFound:true }
        }
};

export default Employes
