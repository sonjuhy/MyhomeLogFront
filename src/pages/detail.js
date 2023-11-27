import { useCallback, useMemo, useState, useEffect } from 'react';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { 
  Box, 
  Button, 
  Container, 
  Stack, 
  SvgIcon, 
  Typography,
  FormGroup,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import { useRouter } from 'next/router';

import sendToSpring from 'src/modules/sendToLogSpring';

import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Snackbar from '@mui/material/Snackbar';

const now = new Date();

export default function Main(){
    const router = useRouter();
    const {service} = router.query;
    let title = service + ' Detail Logs';
    let spring_avatar_link = '/assets/avatars/avatar-spring.png';
    let django_avatar_link = '/assets/avatars/avatar-django.png';
    const [selectDate, setSelectDate] = useState(false);
    const [endDatePickerDisable, setEndDatePickerDisable] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState(dayjs(now));
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState('');
    const [type, setType] = useState('none');
    const [searchMode, setSearchMode] = useState('default');
    const [searchButtonClick, setSearchButtonClick] = useState(true);

    const [dataCount, setDataCount] = useState(0);
    const [page, setPage] = useState(0);
    const [pageData, setPageData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);

  
    const handleCloseSnackBar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpenSnackBar(false);
    };

    const handlePageChange = useCallback(
        (event, value) => {
        setPage(value);
        },
        []
    );

    const handleRowsPerPageChange = useCallback(
        (event) => {
        setRowsPerPage(event.target.value);
        },[]
    );
    const getLogData = async(mode) => {
        const pageCount = (rowsPerPage / 10) - 1;
        var url = "/kafka/";
        if(mode === 'default') {
          url += "findByServicePageReverse/"+service+"/"+page+'/'+rowsPerPage;
        }
        else if(mode === 'between'){
          url += "findByServiceAndStartToEndDayPageReverse/"+service+"/"+startDate+"/"+endDate+"/"+page+'/'+rowsPerPage;
        }
        else if(mode === 'type'){
          url += "findByServiceAndTypePageReverse/"+service+"/"+type+"/"+page+'/'+rowsPerPage;
        }
        else if(mode === 'betweenType'){
          url += "findByServiceAndStartToEndDayAndTypePageReverse/"+service+"/"+startDate+"/"+endDate+"/"+type+'/'+page+'/'+rowsPerPage;
        }
        const getLogData = await sendToSpring(url, "GET", "", "");

        const logList = getLogData.data;
        var tmpList = [];
        for(const idx in logList){
            let tmpData = {
                id: logList[idx].id,
                unixTime: logList[idx].unixTime,
                content: logList[idx].content,
                service: logList[idx].service,
                type: logList[idx].type.toString(),
                avatar: logList[idx].sender === 'Spring' ? spring_avatar_link : django_avatar_link,
                createdAt: logList[idx].unixTime,
                time: logList[idx].time
            }
            tmpList.push(tmpData);
        }
        setPageData(tmpList);
    };

    const handleSearchButton = (event) => {      
      if(endDatePickerDisable === false) { // StartToEnd able
        if(type == 'none'){
          setSearchMode('between');
        }
        else{
          setSearchMode('betweenType');
        }
        setSearchButtonClick(!searchButtonClick);
      }
      else{ // startToEnd disabled
        if(type == 'none'){
          setSnackBarMsg("Check any conditions before search.");
          setOpenSnackBar(true);
        }
        else{
          setSearchMode('type');
          setSearchButtonClick(!searchButtonClick);
        }
      }
    };
    const handleTypeChange = (event) => {
      setType(event.target.value);
    };

    const getDataCount = async(mode) => {
      var url = '/kafka/';
      if(mode === 'default' || mode === 'between'){
        url += "countByService/"+service;
      }
      else if(mode === 'type' || mode === 'betweenType'){
        url += "countByServiceAndType/"+service+"/"+type;
      }
      console.log(url);
      const getDataCount = await sendToSpring(url, "GET", "", "");
      setDataCount(getDataCount.data);
    };

    const getStartDate = (value) =>{
        let dateInfo = value.$d;
        let dateStr = dateInfo.getFullYear() + "-" + (dateInfo.getMonth()+1) + "-" + dateInfo.getDate();
        setStartDate(dateStr);
        setEndDatePickerDisable(false);
    };

    const getEndDate = (value) =>{
      let dateInfo = value.$d;
      let dateStr = dateInfo.getFullYear() + "-" + (dateInfo.getMonth()+1) + "-" + dateInfo.getDate();
      let tmpStartDate = new Date(startDate);
      let tmpEndDate = new Date(dateStr);
      if(tmpStartDate > tmpEndDate){
        setSnackBarMsg("Must select end date after start date.");
        setOpenSnackBar(true);
        setEndDate(dayjs(now));
      }
      else{
        setEndDate(dateStr);
      }
    };

    useEffect(()=>{
        getLogData("default");
        getDataCount("default");
    },[]);

    useEffect(()=>{
        getLogData(searchMode);
    },[rowsPerPage]);

    useEffect(()=>{
      getLogData(searchMode);
      getDataCount(searchMode);
  },[searchMode, searchButtonClick]);

    useEffect(()=>{
        getLogData(searchMode);
    },[page]);

      return(
        <DashboardLayout>
          <Snackbar
            open={openSnackBar}
            autoHideDuration={6000}
            onClose={handleCloseSnackBar}
            // message="Must select end date after start date."
            message={snackBarMsg}
          />
            <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  py: 8
                }}
            >
                <Container maxWidth="xl">
                <Stack spacing={3}>
                    <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={4}
                    >
                        <Stack spacing={1}>
                            <Typography variant="h4">
                            {title}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                      <FormGroup>
                        <FormControlLabel control={<Checkbox />} label="Specific Search" onChange={() => {
                          setSelectDate(!selectDate);
                          setEndDatePickerDisable(true);
                          }}/>
                      </FormGroup>
                      {selectDate && (
                        <>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker 
                              label="Start date picker" 
                              onChange={getStartDate} 
                              format="YYYY-MM-DD"
                              shouldDisableDate={day => {
                              return dayjs(dayjs(day).format('YYYY-MM-DD')).isAfter(now);
                            }}/>
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker 
                              label="End date picker"
                              onChange={getEndDate}
                              format="YYYY-MM-DD"
                              disabled={endDatePickerDisable}
                              shouldDisableDate={day => {
                              return dayjs(dayjs(day).format('YYYY-MM-DD')).isAfter(now);
                            }}/>
                        </LocalizationProvider>
                        <FormControl>
                          <InputLabel id="type-select-label">Type</InputLabel>
                          <Select
                            labelId="type-select-label"
                            id="type-select-label"
                            value={type}
                            label="Type"
                            onChange={handleTypeChange}
                          >
                            <MenuItem value={'none'}>None</MenuItem>
                            <MenuItem value={'true'}>True</MenuItem>
                            <MenuItem value={'false'}>False</MenuItem>
                          </Select>
                        </FormControl>
                        <Button
                          size="large"
                          sx={{ mt: 3 }}
                          type="submit"
                          variant="contained"
                          onClick={handleSearchButton}
                        >
                          Search
                        </Button>
                        </>
                      )}
                    </Stack>
                    <CustomersTable
                        count={dataCount}
                        items={pageData}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        page={page}
                        rowsPerPage={rowsPerPage}
                    />
                </Stack>
                </Container>
            </Box>
        </DashboardLayout>
      );
}
