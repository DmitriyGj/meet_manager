import type { GetServerSideProps } from 'next'
import { DataGrid, GridApi, GridColDef, GridColumnMenuContainer, GridColumnMenuProps, GridExportMenuItemProps, gridFilteredSortedRowIdsSelector, GridRowsProp, GridToolbarContainer, GridToolbarExport, GridToolbarExportContainer, gridVisibleColumnFieldsSelector, SortGridMenuItems, useGridApiContext } from '@mui/x-data-grid'
import {Button}  from '@mui/material'
import { forwardRef,  useRef, useState } from 'react';
import { useRouter } from 'next/router';
import EmployeAPI from '../../public/src/API/EmployeAPI';
import { IEmploye } from '../../public/src/types/Employe.model';
import translatorFieldsToRULabels from '../../public/src/utils/translatorToRU';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { ButtonProps} from '@mui/material/Button';
import EmployeChart, { BarInfo } from '../../public/src/Components/Charts/EmployeChart/EmployeChart'
import ShowChart from '@mui/icons-material/ShowChart'
import {getCookie} from 'cookies-next';
import style from './employesPage.module.scss'
import { MenuItem } from '@mui/material';
import {ModalWindow} from '../../public/src/Components/ModalWindow//ModalWindow'
import JWT from 'jsonwebtoken';

interface IEmployesPage {
    rows:  GridRowsProp | any
    columns: GridColDef[] | any
    token: string
    ROLE_NAME: string
}

const CustomExportButton = (props: ButtonProps) => 
    (<GridToolbarExportContainer {...props}>
        <ExcelExportMenuItem/>
    </GridToolbarExportContainer>)

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
            _export.current.save(rows,columns);
        }
    };

    const { hideMenu } = props;

    return (
        <MenuItem
        onClick={() => {
            const excelData = getExcel(apiRef);
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

const Employes = ({rows, columns, token, ROLE_NAME} : IEmployesPage) => {
    const router = useRouter();
    const gridRef = useRef<any>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [showStats, setShowStats] = useState(false);
    const [chartInfo, setChartInfo] = useState<BarInfo[]>([]);

    const clickStatsHandler = () => {
        (async() => {
            const chartInfoRes = await EmployeAPI.getEmployeChartInfo();
            setChartInfo(chartInfoRes || []);
        })()
        setShowStats(true);
    }

    const clickChangeHandler = () => {
        if(selectedRow){
            router.push(`/employes/${selectedRow}/edit`)
        } 
        else{
            alert('Выберите запись');
        }
    }

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

    const CustomToolbar = () => 
    (<GridToolbarContainer className={style.Toolbar}>
        <CustomExportButton className={style.ExportBtn} />
        <Button onClick={clickStatsHandler} className={style.ExportBtn}><ShowChart/> Stats</Button>
    </GridToolbarContainer>)

    return (<div className={style.container}>
                <h1>Работники</h1>
                {showStats &&
                    <ModalWindow title='Статистика' visible={showStats} onClose={() => {
                                setChartInfo([]);
                                setShowStats(false);
                            }}>
                        <EmployeChart title ='Количество встреч' dataset={chartInfo}/>
                    </ModalWindow> }
                <DataGrid components={{Toolbar: CustomToolbar, 
                                        ColumnMenu: GridColumnMenu}} 
                    ref={gridRef} 
                    onSelectionModelChange={(e) => {
                            setSelectedRow(+e[0]);
                        }} 
                    rows={rows} columns={columns} />
                    { ROLE_NAME === 'ADMIN' && <div className = {style.ButtonContainer}>
                    <Button variant='contained' onClick={()=>router.push(`${router.asPath}/add`)}
                                                style={{borderRadius: 35,
                                                        fontSize: "14px",
                                                        width: '8%',
                                                        margin: '0% 1%'
                                                    }}>Добавить</Button>
                    <Button variant='contained' onClick={clickRemoveHandler}
                                                style={{borderRadius: 35,
                                                        fontSize: "14px",
                                                        width: '10%',
                                                        margin: '0% 1%'
                                                    }}>Удалить</Button>
                    <Button onClick={clickChangeHandler}
                        variant='contained'style={{borderRadius: 35,
                                                        fontSize: "14px",
                                                        width: '10%',
                                                        margin: '0% 1%'
                                                    }} >Изменить</Button>
                    </div>}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps  = async (ctx ) => {
        try{
            const {req,res} = ctx;
            const token = getCookie('token',{req,res});
            const data = await EmployeAPI.getEmployes(token as string);
            console.log(data)
            if(data === 401 || data === 403){
                return { 
                    redirect: {
                        destination:'/login',
                        permanent:false    
                    }
                }
            }
            const {ROLE_NAME} = (JWT.decode(`${token}`)as {user:{ROLE_NAME: string}}).user;
            console.log(ROLE_NAME.trim())
            const columns:GridColDef[] = []
            Object.keys(data[0]).forEach((col: string) =>{
                if(!col.includes('_ID')){
                    columns.push({field:col, headerName: translatorFieldsToRULabels.Employe[col], width:150})
                }
            });
            const rows = (data as IEmploye[]).map((item) => ({id: item.ID, ...item}))

            return { props: 
                    {rows , columns, token, ROLE_NAME:ROLE_NAME.trim()} 
                };
        }
        catch(e){
            console.log(e);
            return {notFound:true }
        }
};

export default Employes
