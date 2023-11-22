import Head from 'next/head';
import { useEffect, useState, useRef } from "react";
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';

import sendToSpring from 'src/modules/sendToLogSpring';

const now = new Date();

export default function Main(){
  const [logData, setLogData] = useState([]);
  const [totalTypeCount, setTotalTypeCount] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [diffTodayYesterdayType, setDiffTodayYesterdayType] = useState(false);
  const [diffTodayYesterdayCount, setDiffTodayYesterdayCount] = useState(0.0);
  const [daysTrueCount, setDaysTrueCount] = useState([]);
  const [daysFalseCount, setDaysFalseCount] = useState([]);
  const [daysList, setDaysList] = useState([]);

  const [logDataLoadingFinished, setLogDataLoadingFinished] = useState(false);
  const [totalTypeCountLoadingFinished, setTotalTypeCountLoadingFinished] = useState(false);  
  const [daysTypeCountLoadingFinished, setDaysTypeCountLoadingFinished] = useState(false);
  const [todayCountLoadingFinished, setTodayCountLoadingFinished] = useState(false);
  const loadFinishedCount = useRef(0);
  
  const GetTodayCount = async() => {
    const pastDays = new Date(now);
    let day = pastDays.toISOString().substring(0,10);
    const getTodayCountData = await sendToSpring("/kafka/countByDay/"+day, "GET", "", "");
    setTodayCount(getTodayCountData.data.toString());

    pastDays.setDate(pastDays.getDate() - 1);
    let yesterday = pastDays.toISOString().substring(0,10);
    const getYesterDayCountData = await sendToSpring("/kafka/countByDay/"+yesterday, "GET", "", "");
    let todayNum = getTodayCountData.data;
    let yesterdayNum = getYesterDayCountData.data;
    if(todayNum > yesterdayNum && yesterdayNum !== 0) {
      setDiffTodayYesterdayType(true);
      let diffNum = Math.floor((todayNum - yesterdayNum) / yesterdayNum * 100);
      setDiffTodayYesterdayCount(diffNum);
    }
    else if(todayNum !== 0){
      let diffNum = Math.floor((yesterdayNum - todayNum) / todayNum * 100);
      setDiffTodayYesterdayCount(diffNum);
    }
    
    setTodayCountLoadingFinished(true);
  };

  const GetTotalTypeCount = async() => { // total count of type chart
      const getTotalTypeCount = await sendToSpring("/kafka/countByType", "GET", "", "");
      const countList = getTotalTypeCount.data;
      let sumCount = countList[0] + countList[1];
      if(sumCount !== 0){
          let trueCount = Number((countList[0] / (countList[0]+countList[1])*100).toFixed(2));
          let falseCount = Number((countList[1] / (countList[0] + countList[1])*100).toFixed(2));
          setTotalTypeCount([trueCount, falseCount]);
          setTotalCount(countList[0]+countList[1]);
      }
      else{
          setTotalTypeCount([0,0]);
      }
      setTotalTypeCountLoadingFinished(true);
  };

  // const GetLogData = async() => { // bottom log data chart
  //     const getLogData = await sendToSpring("/kafka/findByServicePageReverse/cloudCheck/1", "GET", "", "");
  //     var tmpList = [];
  //     for(const idx in getLogData.data){
  //         let tmpData = {
  //             id: getLogData.data[idx].id,
  //             ref: getLogData.data[idx].day,
  //             amount : 0,
  //             customer: {
  //                 name: getLogData.data[idx].sender,
  //                 content: getLogData.data[idx].content,
  //             },
  //             createdAt: getLogData.data[idx].unix_time,
  //             status: getLogData.data[idx].type ? 'true' : 'false'
  //         }
  //         tmpList.push(tmpData);
  //     }
  //     setLogData(tmpList);
  //     setLogDataLoadingFinished(true);
  // };

  const GetDaysTypeCount = async() =>{ // stick chart
      var tmpTrueList = [], tmpFalseList = [], tmpDayList = [];
      const pastDays = new Date(now);
      pastDays.setDate(pastDays.getDate() - 9);
      for(let i = 0; i < 10; i++) {
          let day = pastDays.toISOString().substring(0,10);
          const getDayTrue = await sendToSpring("/kafka/countByDayAndType/"+day, "GET", "", "");
          const countList = getDayTrue.data;
          tmpTrueList.push(countList[0]);
          tmpFalseList.push(countList[1]);
          tmpDayList.push(day);
          pastDays.setDate(pastDays.getDate() + 1);
      }
      setDaysTrueCount(tmpTrueList);
      setDaysFalseCount(tmpFalseList);
      setDaysList(tmpDayList);
      
  };

  useEffect(() => {
      GetTodayCount();
      GetTotalTypeCount();
      GetDaysTypeCount();
      // GetLogData();
  }, []);

  useEffect(() => {
      loadFinishedCount.current = loadFinishedCount.current + 1;
      if(loadFinishedCount.current === 3){
          setTimeout(()=> setDaysTypeCountLoadingFinished(true), 100);
      }
  },[daysTrueCount, daysFalseCount, daysList]);
  return(
    <DashboardLayout>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={3}
          >
            {/**budget */}
            {totalTypeCountLoadingFinished && (
              <Grid
                xs={12}
                sm={6}
                lg={6}
              >
                <OverviewBudget
                  // difference={12}
                  positive
                  sx={{ height: '100%' }}
                  value={totalCount}
                />
              </Grid>
            )}
            
            {/**total customers */}
            {todayCountLoadingFinished && (
              <Grid
                xs={12}
                sm={6}
                lg={6}
              >
                <OverviewTotalCustomers
                  difference={diffTodayYesterdayCount}
                  positive={diffTodayYesterdayType}
                  sx={{ height: '100%' }}
                  value={todayCount}
                />
              </Grid>
            )}
            
            {/**task progress */}
            {/* <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <OverviewTasksProgress
                sx={{ height: '100%' }}
                value={75.5}
              />
            </Grid> */}
            {/**total profit */}
            {/* <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <OverviewTotalProfit
                sx={{ height: '100%' }}
                value="$15k"
              />
            </Grid> */}
            {/**Traffic Source */}
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
            {/** LatestProducts */}
            {/* <Grid
              xs={12}
              md={6}
              lg={4}
            >
              <OverviewLatestProducts
                products={[
                  {
                    id: '5ece2c077e39da27658aa8a9',
                    image: '/assets/products/product-1.png',
                    name: 'Healthcare Erbology',
                    updatedAt: subHours(now, 6).getTime()
                  },
                  {
                    id: '5ece2c0d16f70bff2cf86cd8',
                    image: '/assets/products/product-2.png',
                    name: 'Makeup Lancome Rouge',
                    updatedAt: subDays(subHours(now, 8), 2).getTime()
                  },
                  {
                    id: 'b393ce1b09c1254c3a92c827',
                    image: '/assets/products/product-5.png',
                    name: 'Skincare Soja CO',
                    updatedAt: subDays(subHours(now, 1), 1).getTime()
                  },
                  {
                    id: 'a6ede15670da63f49f752c89',
                    image: '/assets/products/product-6.png',
                    name: 'Makeup Lipstick',
                    updatedAt: subDays(subHours(now, 3), 3).getTime()
                  },
                  {
                    id: 'bcad5524fe3a2f8f8620ceda',
                    image: '/assets/products/product-7.png',
                    name: 'Healthcare Ritual',
                    updatedAt: subDays(subHours(now, 5), 6).getTime()
                  }
                ]}
                sx={{ height: '100%' }}
              />
            </Grid> */}
            {/** Latest Orders */}
            {/* {logDataLoadingFinished && (
                <Grid
                    xs={12}
                    md={12}
                    lg={12}
                >
                    <OverviewLatestOrders
                    orders={logData}
                    sx={{ height: '100%' }}
                    />
                </Grid>
            )} */}
          </Grid>
        </Container>
      </Box>
    </DashboardLayout>
  );
}
