import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    } from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export interface BarInfo {
    count:number 
    NAME:string 
    LAST_NAME: string 
}

interface ChartProps {
    title: string
    dataset:BarInfo[]
}

const Chart = ({title,dataset}: ChartProps) => {
    const labels = dataset.map(item => `${item.LAST_NAME.trim()} ${item.NAME.trim()}`);
    const options = {
        responsive: true,
        plugins: {
            legend: {
            position: 'top' as const,
            },
        title: {
            display: true,
            text: title,
            },
        },
    };

    const data = {
        labels,
        datasets: [
        {   
            label:'Работники',
            data: dataset.map(item => item.count),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }]
    };

    return (<Bar options={options} data={data} />);
}

export default Chart;