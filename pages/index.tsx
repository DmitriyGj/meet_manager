import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import Button  from '@mui/material/Button'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1>Main Page</h1>
    </div>
  )
}

export default Home
