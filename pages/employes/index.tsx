import type { GetServerSideProps } from 'next'
import styles from '../../styles/Home.module.css'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import Button  from '@mui/material/Button'
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import EmployeAPI from '../../public/src/API/EmployeAPI';

interface IEmployesPage {
    rows:  GridRowsProp | any
    columns: GridColDef[] | any
}

const Employes = ({rows, columns} : IEmployesPage) => {
    const router = useRouter();
    const gridRef = useRef<any>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null)

    const clickRemoveHandler = () =>{
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
        })();
    }

    return (<div className={styles.container}>
            <h1>Работники</h1>
            <DataGrid ref={gridRef} 
                onSelectionModelChange={(e) => {
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
                <Button variant='contained' onClick={clickRemoveHandler}
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

export const getServerSideProps: GetServerSideProps  = async ( ) => {
        try{
            const data = await EmployeAPI.getEmployes();
            const columns = Object.keys(data[0]).map((col: string) =>( {field:col, headerName:col, width:150}));
            const rows = data.map((item: any) => ({id: item.ID, ...item}))
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
