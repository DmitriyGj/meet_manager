import type { GetServerSideProps } from 'next'
import { DataGrid, GridApi, GridColDef, GridColumnMenuContainer, GridColumnMenuProps, GridExportMenuItemProps, gridFilteredSortedRowIdsSelector, GridRowsProp, GridToolbarContainer, GridToolbarExport, GridToolbarExportContainer, gridVisibleColumnFieldsSelector, SortGridMenuItems, useGridApiContext } from '@mui/x-data-grid'
import {Button}  from '@mui/material'
import { forwardRef,  useRef, useState } from 'react';
import { useRouter } from 'next/router';
import GuestAPI from '../../public/src/API/GeustAPI';
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
    token: string
    ROLE_NAME: string
}

const columns = [{ field:'ID', headerName: translatorFieldsToRULabels.Employe['ID'], width:150},
    {field:'NAME', headerName: translatorFieldsToRULabels.Employe['NAME'], width:150},
    {field:'LAST_NAME', headerName: translatorFieldsToRULabels.Employe['LAST_NAME'], width:150},
    {field:'PATRONYMIC', headerName: translatorFieldsToRULabels.Employe['PATRONYMIC'], width:150},
    {field:'PHONE', headerName: translatorFieldsToRULabels.Employe['PHONE'], width:150},
    {field:'EMAIL', headerName: translatorFieldsToRULabels.Employe['EMAIL'], width:150},
]

const CustomExportButton = (props: ButtonProps) => 
    (<GridToolbarExportContainer {...props}>
        <ExcelExportMenuItem/>
    </GridToolbarExportContainer>)

const getExcel = (apiRef: React.MutableRefObject<GridApi>) => {
    const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
    const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);
    const data = filteredSortedRowIds.map((id) => {//fix
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

const Employes = ({rows, token, ROLE_NAME} : IEmployesPage) => {
    const router = useRouter();
    const gridRef = useRef<any>(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null)
    const [showStats, setShowStats] = useState(false);
    const [chartInfo, setChartInfo] = useState<BarInfo[]>([]);

    const clickStatsHandler = () => {
        (async() => {
            //fix const chartInfoRes = await GuestAPI.getEmployeChartInfo();
            // setChartInfo(chartInfoRes || []);
        })()
        setShowStats(true);
    }

    const clickChangeHandler = () => {
        if(selectedRow){
            router.push(`/guests/${selectedRow}/edit`)
        } 
        else{
            alert('Выберите запись');
        }
    }

    const clickRemoveHandler = () =>{
        (async () => {
            try{
                if(selectedRow){
                    await GuestAPI.removeGuest(selectedRow.toString(), token);
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
                <h1>Гости</h1>
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
                    onRowDoubleClick={e=> router.push(`/guests/${e.id}`)}
                    onSelectionModelChange={(e) => {
                            setSelectedRow(+e[0]);
                        }} 
                    rows={rows} columns={columns} />
                    { ROLE_NAME !== 'GUEST' && <div className = {style.ButtonContainer}>
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
            const data = await GuestAPI.getGuests(token as string);
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
            const rows = (data as IEmploye[]).map((item) => ({id: item.ID, ...item}))
            return { props: 
                    {rows , token, ROLE_NAME:ROLE_NAME.trim()} 
                };
        }
        catch(e){
            console.log(e);
            return {notFound:true }
        }
};

export default Employes
