import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';
import { Typography } from '@mui/material';



export default function PieActiveArc(props) {

    const [data, setData] = React.useState([])
    React.useEffect(() => {

        let filterPiChartData = props.filteredArr.map((ele, index) => ({ label: ele["Category"], id: index + 1, value: ele[props.type] }))
        setData(filterPiChartData)

    }, [props.filteredArr, props.update])

    return (
        <>
            <Typography variant="h5" align="center">This is {props.type} Pi Chart</Typography>
            <PieChart
                series={[
                    {
                        data,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                ]}
                height={200}
            />
        </>
    );
}