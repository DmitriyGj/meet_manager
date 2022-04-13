import type { GetStaticProps, NextPage } from 'next'
import styles from '../../styles/Home.module.css'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import Button  from '@mui/material/Button'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import EmployeAPI from '../../public/src/API/EmployeAPI';

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
    const router = useRouter();
    const gridRef = useRef<any>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null)

    useEffect(() => {
        console.log(gridRef.current);
    })

    return (<div className={styles.container}>
            <h1>Работники</h1>
            <DataGrid ref={gridRef} 
                onSelectionModelChange={(e) => {
                        console.log(+e[0]);
                        setSelectedRow(+e[0]);
                    }} 
                rows={rows} columns={columns} />
            <div className = {styles.ButtonContainer}>
                <Button variant='contained' onClick={()=>router.push('/addEmployePage')}
                                            style={{borderRadius: 35,
                                                    backgroundColor: "gray",
                                                    fontSize: "14px",
                                                    width: '10%',
                                                    margin: '0% 1%'
                                                }}>Добавить</Button>
                <Button variant='contained' onClick={() =>{
                                            (async () => {
                                                try{
                                                    if(selectedRow){
                                                        await EmployeAPI.removeEmploye(selectedRow.toString());
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
                                            })()

                                    }}
                                            style={{borderRadius: 35,
                                                    backgroundColor: "gray",
                                                    fontSize: "14px",
                                                    width: '10%',
                                                    margin: '0% 1%'
                                                }}>Удалить</Button>
                <Button onClick={
                    () => {
                        router.push(`/employes/${selectedRow}`)
                    }
                }
                    variant='contained'style={{borderRadius: 35,
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
        try{
            const data = await fetch('https://meet-manager-backend.herokuapp.com/api/employes');
            console.log(data)
            const parsedData = await data.json();
            const columns = Object.keys(parsedData[0]).map((col: string) =>( {field:col, headerName:col, width:150}));
            const rows = parsedData.map((item: any) => ({id: item.ID, ...item}))
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
