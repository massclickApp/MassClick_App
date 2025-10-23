import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts';
import { Grid, Box, Card, CardContent, Typography } from '@mui/material';
import { getAllBusinessList } from '../redux/actions/businessListAction';

const chartColors = ['#28a745', '#007bff', '#ff9800', '#9c27b0', '#e91e63', '#00bcd4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <Box sx={{
        p: 2,
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: 160,
        pointerEvents: 'none'
      }}>
        <Typography variant="subtitle2" sx={{ color: '#333', mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: data.fill || data.stroke || '#000' }}>
          {data.name}: {data.value}
          {data.payload && data.payload.total
            ? ` (${((data.value / data.payload.total) * 100).toFixed(1)}%)`
            : ''}
        </Typography>
      </Box>
    );
  }
  return null;
};

const aggregateBusinessData = (businessList) => {
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const monthlyDataMap = new Map();
  for(let i=0;i<=currentMonthIndex;i++) monthlyDataMap.set(i, {name: monthNames[i], 'New Businesses':0});

  (businessList||[]).forEach(b=>{
    if(b.createdAt){
      const date = new Date(b.createdAt);
      if(date.getFullYear()===currentYear){
        const idx = date.getMonth();
        if(monthlyDataMap.has(idx)) monthlyDataMap.get(idx)['New Businesses'] += 1;
      }
    }
  });

  const aggregatedData = Array.from(monthlyDataMap.values());
  const maxCount = Math.max(...aggregatedData.map(d=>d['New Businesses']),0);
  const total = aggregatedData.reduce((sum,item)=>sum+item['New Businesses'],0);
  aggregatedData.forEach(d=>d.total=total);
  return {aggregatedData,maxCount};
};

const aggregateBusinessByCategory = (businessList) => {
  const categoryMap = {};
  (businessList||[]).forEach(b=>{
    const cat = b.category || 'Uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const data = Object.entries(categoryMap).map(([category,count])=>({category,count}));
  const total = data.reduce((sum,d)=>sum+d.count,0);
  data.forEach(d=>d.total=total);
  return data;
};

export default function DashboardCharts() {
  const dispatch = useDispatch();
  useEffect(()=>{ dispatch(getAllBusinessList()); },[dispatch]);
  const { businessList = [] } = useSelector(state=>state.businessListReducer||{});

  const { aggregatedData: chart1Data, maxCount: max1 } = useMemo(()=>aggregateBusinessData(businessList), [businessList]);
  const yMax1 = Math.ceil(max1/5)*5||5;
  const chart2Data = useMemo(()=>aggregateBusinessByCategory(businessList), [businessList]);
  const yMax2 = Math.max(...chart2Data.map(d=>d.count),0)+5;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={6}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 25px rgba(0,0,0,0.1)', height: '100%' }}>
          <CardContent sx={{ p:2 }}>
            <Typography variant="h6" sx={{ fontWeight:700, mb:2 }}>Monthly New Business Trend</Typography>
            <ResponsiveContainer width={700} height={350}>
              <AreaChart data={chart1Data} margin={{top:20,right:30,left:0,bottom:0}}>
                <defs>
                  <linearGradient id="colorChart1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors[0]} stopOpacity={0.7}/>
                    <stop offset="100%" stopColor={chartColors[0]} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee"/>
                <XAxis dataKey="name" tickLine={false} axisLine={{stroke:'#ccc'}} tick={{fontSize:13, fill:'#555'}}/>
                <YAxis allowDecimals={false} tickLine={false} axisLine={{stroke:'#ccc'}} tick={{fontSize:13, fill:'#555'}} domain={[0,yMax1]}/>
                <Tooltip content={<CustomTooltip/>}/>
                <ReferenceLine y={Math.ceil(max1/2)} stroke="#ff9800" strokeDasharray="5 5" label={{value:'Average',position:'insideTopRight',fill:'#ff9800'}}/>
                <Area type="monotone" dataKey="New Businesses" stroke={chartColors[0]} fill="url(#colorChart1)" strokeWidth={3} activeDot={{r:7,stroke:'#fff',strokeWidth:2}} isAnimationActive={true} animationDuration={1800}/>
                <Line type="monotone" dataKey="New Businesses" stroke={chartColors[0]} strokeWidth={3} dot={{r:4}} activeDot={{r:8,stroke:'#fff',strokeWidth:2}} isAnimationActive={true} animationDuration={1800}/>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Business Distribution by Category */}
      <Grid item xs={12} sm={12} md={6}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 25px rgba(0,0,0,0.1)', height: '100%' }}>
          <CardContent sx={{ p:2 }}>
            <Typography variant="h6" sx={{ fontWeight:700, mb:2 }}>Business Distribution by Category</Typography>
            <ResponsiveContainer width={700} height={350}>
              <BarChart data={chart2Data} margin={{top:20,right:30,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5"/>
                <XAxis dataKey="category" tickLine={false} axisLine={{stroke:'#ccc'}} tick={{fontSize:13, fill:'#555', angle:-15, textAnchor:'end'}}/>
                <YAxis allowDecimals={false} tickLine={false} axisLine={{stroke:'#ccc'}} tick={{fontSize:13, fill:'#555'}} domain={[0,yMax2]}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend verticalAlign="top" align="right"/>
                <Bar dataKey="count" barSize={28} radius={[8,8,0,0]} fill={({index})=>chartColors[index % chartColors.length]} label={{position:'top', fill:'#333', fontWeight:'bold'}} isAnimationActive={true} animationDuration={1800}/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
