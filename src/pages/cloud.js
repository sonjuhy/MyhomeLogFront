import { useEffect, useState, useRef } from "react";
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import { subDays, subHours } from 'date-fns';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';

import sendToSpring from 'src/modules/sendToLogSpring';

/**
 * 날짜 단위 : 최근 10일
 * Sales : 날짜 단위 기준으로 True, False 로 그래프
 * Traffic Source : True, False 기준
 * Latest Orders : 최초는 날짜 단위 기준 0페이지 (day, sender, content, type)
 */
const now = new Date();

export default function Main(){
    const [logData, setLogData] = useState([]);
    const [totalTypeCount, setTotalTypeCount] = useState([]);
    const [daysTrueCount, setDaysTrueCount] = useState([]);
    const [daysFalseCount, setDaysFalseCount] = useState([]);
    const [daysList, setDaysList] = useState([]);
    const [logDataLoadingFinished, setLogDataLoadingFinished] = useState(false);
    const [totalTypeCountLoadingFinished, setTotalTypeCountLoadingFinished] = useState(false);
    const [daysTypeCountLoadingFinished, setDaysTypeCountLoadingFinished] = useState(false);
    const loadFinishedCount = useRef(0);
    

    const GetTotalTypeCount = async() => {
        const getTotalTypeTrueCount = await sendToSpring("/kafka/countByServiceAndType/cloud/true", "GET", "", "");
        const getTotalTypeFalseCount = await sendToSpring("/kafka/countByServiceAndType/cloud/false", "GET", "", "");
        let sumCount = getTotalTypeTrueCount.data + getTotalTypeFalseCount.data;
        if(sumCount !== 0){
            let trueCount = Number((getTotalTypeTrueCount.data / (getTotalTypeTrueCount.data + getTotalTypeFalseCount.data)*100).toFixed(2));
            let falseCount = Number((getTotalTypeFalseCount.data / (getTotalTypeTrueCount.data + getTotalTypeFalseCount.data)*100).toFixed(2));
            setTotalTypeCount([trueCount, falseCount]);
        }
        else{
            setTotalTypeCount([0,0]);
        }
        setTotalTypeCountLoadingFinished(true);
    };

    const GetLogData = async() => {
        const getLogData = await sendToSpring("/kafka/findByServicePageReverse/cloud/0/10", "GET", "", "");
        var tmpList = [];
        for(const idx in getLogData.data){
            let tmpData = {
                id: getLogData.data[idx].id,
                ref: getLogData.data[idx].day,
                amount : 0,
                customer: {
                    name: getLogData.data[idx].sender,
                    content: getLogData.data[idx].content,
                },
                createdAt: getLogData.data[idx].unixTime,
                status: getLogData.data[idx].type ? 'true' : 'false'                
            }
            tmpList.push(tmpData);
        }
        setLogData(tmpList);
        setLogDataLoadingFinished(true);
    };

    const GetDaysTypeCount = async() =>{
        var tmpTrueList = [], tmpFalseList = [], tmpDayList = [];
        const pastDays = new Date(now);
        pastDays.setDate(pastDays.getDate() - 9);
        for(let i = 0; i < 10; i++) {
            let day = pastDays.toISOString().substring(0,10);
            const getDayTrue = await sendToSpring("/kafka/countByServiceAndDayAndType/cloud/"+day+"/true", "GET", "", "");
            const getDayFalse = await sendToSpring("/kafka/countByServiceAndDayAndType/cloud/"+day+"/false", "GET", "", "");
            tmpTrueList.push(getDayTrue.data);
            tmpFalseList.push(getDayFalse.data);
            tmpDayList.push(day);
            pastDays.setDate(pastDays.getDate() + 1);
        }
        setDaysTrueCount(tmpTrueList);
        setDaysFalseCount(tmpFalseList);
        setDaysList(tmpDayList);
        
    };

    useEffect(() => {
        GetTotalTypeCount();
        GetLogData();
        GetDaysTypeCount();
    }, []);
    useEffect(() => {
        loadFinishedCount.current = loadFinishedCount.current + 1;
        console.log("Load finished : " + loadFinishedCount.current);
        if(loadFinishedCount.current === 3){
            setTimeout(()=> setDaysTypeCountLoadingFinished(true), 100);
        }
    },[daysTrueCount, daysFalseCount, daysList]);
    return (
        <DashboardLayout>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
                >
                <Container maxWidth="lg">
                    <Grid
                        container
                        spacing={3}
                        >
                        {totalTypeCountLoadingFinished && (
                            <Grid
                            xs={12}
                            md={6}
                            lg={4}
                        >
                            <OverviewTraffic
                            chartSeries={totalTypeCount}
                            labels={['True', 'False']}
                            sx={{ height: '100%' }}
                            />
                        </Grid>
                        )}
                        {/**Sales */}
                        {daysTypeCountLoadingFinished && (
                            <Grid
                                xs={12}
                                lg={8}
                            >
                                <OverviewSales
                                chartSeries={[
                                    {
                                    name: 'True',
                                    data: daysTrueCount
                                    },
                                    {
                                    name: 'False',
                                    data: daysFalseCount
                                    }
                                ]}
                                locationCall='cloud'
                                dayList={daysList}
                                sx={{ height: '100%' }}
                                />
                            </Grid>
                        )}
                        {!daysTypeCountLoadingFinished && (
                            <Grid
                                xs={12}
                                lg={8}
                            >
                                <OverviewSales
                                chartSeries={[
                                    {
                                    name: 'True',
                                    data: []
                                    },
                                    {
                                    name: 'False',
                                    data: []
                                    }
                                ]}
                                dayList={[]}
                                sx={{ height: '100%' }}
                                />
                            </Grid>
                        )}
                        {/** list table */}
                        {logDataLoadingFinished && (
                            <Grid
                                xs={12}
                                md={12}
                                lg={12}
                            >
                                <OverviewLatestOrders
                                orders={logData}
                                service='cloud'
                                sx={{ height: '100%' }}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </Box>
            
            
        </DashboardLayout>
    );
}