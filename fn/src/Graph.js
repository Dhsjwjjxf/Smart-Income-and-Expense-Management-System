import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function ChartsOverviewDemo(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(props.Url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then((response) => {
        const responseData = response.data.data?.[props.Title] || [];
        setData(responseData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.Url, props.update, props.Title]);

  return (
    <Card elevation={3}>
      <CardContent>
        <Box mb={2}>
          <Typography variant="h6" align="center">
            {props.Title} Overview
          </Typography>
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={props.Title} fill="#4b72c2" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
