import type { GetServerSideProps } from 'next'
import styles from '../../styles/Home.module.css'
import { DataGrid, GridApi, GridColDef, GridColumnMenuContainer, GridColumnMenuProps, GridExportMenuItemProps, gridFilteredSortedRowIdsSelector, GridRowsProp, GridToolbarContainer, GridToolbarExport, GridToolbarExportContainer, gridVisibleColumnFieldsSelector, SortGridMenuItems, useGridApiContext } from '@mui/x-data-grid'
import Button  from '@mui/material/Button'
import { forwardRef,  useRef, useState } from 'react';
import { useRouter } from 'next/router';
import EmployeAPI from '../../public/src/API/EmployeAPI';
import { IEmploye } from '../../public/src/types/Employe.model';
import translatorFieldsToRULabels from '../../public/src/utils/translatorToRU';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { ButtonProps} from '@mui/material/Button';

import {getCookie} from 'cookies-next';
import style from './employesPage.module.scss'
import { MenuItem } from '@mui/material';
interface IEmployesPage {
    rows:  GridRowsProp | any
    columns: GridColDef[] | any
    token: string
}

const CustomExportButton = (props: ButtonProps) => 
    (<GridToolbarExportContainer {...props}>
        <ExcelExportMenuItem/>
    </GridToolbarExportContainer>)

const CustomToolbar = () => 
    (<GridToolbarContainer className={style.Toolbar}>
        <CustomExportButton className={style.ExportBtn} />
    </GridToolbarContainer>)

const getExcel = (apiRef: React.MutableRefObject<GridApi>) => {
    const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
    const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);
    const data = filteredSortedRowIds.map((id) => {
        const row: Record<string, any> = {};
        visibleColumnsField.forEach((field) => row[translatorFieldsToRULabels.Employe[field]] = apiRef.current.getCellParams(id, field).value);
        return row;
    });
    const parsedColimns = visibleColumnsField.map((field) =>{return {field:translatorFieldsToRULabels.Employe[field], width:150} as GridColDef});
    return {data, columns: parsedColimns };
};

const ExcelExportMenuItem = (props: GridExportMenuItemProps<{}>) => {
    const apiRef = useGridApiContext();
    const _export = useRef<ExcelExport | null>(null);
    const excelExport = (rows:any,columns:any) => {
        if (_export.current !== null) {
            console.log(rows,columns)
            _export.current.save(rows,columns);
        }
    };

    const { hideMenu } = props;

    return (
        <MenuItem
        onClick={() => {
            const excelData = getExcel(apiRef);
            console.log(excelData);
            excelExport(excelData.data, excelData.columns);
            hideMenu?.();
        }}
        >
            <ExcelExport ref={_export}>
                Export Excel
            </ExcelExport>
        </MenuItem>
    );
    };

const GridColumnMenu = forwardRef<
                    HTMLUListElement,
                    GridColumnMenuProps
                    >(function GridColumnMenu(props: GridColumnMenuProps, ref) {
                    const { hideMenu, currentColumn } = props;

                    return (
                        <GridColumnMenuContainer ref={ref} {...props}>
                            <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />
                        </GridColumnMenuContainer>
                        );
                    });



const Employes = ({rows, columns, token} : IEmployesPage) => {
    const router = useRouter();
    const gridRef = useRef<any>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const _export = useRef<ExcelExport | null>(null);
    const excelExport = (rows:any,columns:any) => {
        if (_export.current !== null) {
            _export.current.save(rows,columns);
        }
    };
    const clickRemoveHandler = () =>{
        (async () => {
            try{
                if(selectedRow){
                    await EmployeAPI.removeEmploye(selectedRow.toString(), token);
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

            <DataGrid components={{Toolbar: CustomToolbar, ColumnMenu: GridColumnMenu}} 
                ref={gridRef} 
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
            const data = await EmployeAPI.getEmployes(token as string);
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
                    columns.push({field:col, headerName: translatorFieldsToRULabels.Employe[col], width:150})
                }
            });
            const rows = (data as IEmploye[]).map((item) => ({id: item.ID, ...item}))
            return { props: 
                    {rows , columns, token} 
                };
        }
        catch(e){
            console.log(e);
            return {notFound:true }
        }
};

export default Employes
