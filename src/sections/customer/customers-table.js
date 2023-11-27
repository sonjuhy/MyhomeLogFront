import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Collapse,
  Grid,
  CardContent
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {useState} from 'react';
import { rawListeners } from 'process';

export const CustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0
  } = props;

  const Row = (props) => {
    const {row} = props;
    const customer = row;
    const [open, setOpen] = useState(false);
    const createdAt = format(customer.createdAt, 'yyyy/MM/dd');
    
    return (
      <>
      <TableRow
        hover
        key={customer.id}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Avatar src={customer.avatar}>
            </Avatar>
            <Typography variant="subtitle2">
              {customer.id}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          {customer.type === 'true' && (
            <div style={{color:'blue'}}>
              {customer.type}
            </div>
          )}
          {customer.type === 'false' && (
            <div style={{color:'red'}}>
              {customer.type}
            </div>
          )}
        </TableCell>
        <TableCell>
          <div style={{textOverflow:"ellipsis", whiteSpace:"nowrap", overflow:"hidden", display:"block", width:"40vw"}}>
            {customer.content}
          </div>
        </TableCell>
        <TableCell>
          {createdAt}
        </TableCell>
        <TableCell>
          {customer.time}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Card variant='outlined' style={{marginBottom: 15, marginTop: 15}}>
              <CardContent style={{backgroundColor:'#EDF4FF'}}>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    Specific Info
                  </Typography>
                  <Table size="medium" aria-label="purchases" style={{backgroundColor:'white'}}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Id</TableCell>
                        <TableCell align="center">UnixTime</TableCell>
                        <TableCell align="center">Sender</TableCell>
                        <TableCell align="center">Type</TableCell>
                        <TableCell align="center">Service</TableCell>
                        <TableCell align="center">Day</TableCell>
                        <TableCell align="center">Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow key={customer.unixTime}>
                        <TableCell component="th" scope="row" align="center">
                          {customer.id}
                        </TableCell>
                        <TableCell align="center">{customer.unixTime}</TableCell>
                        <TableCell align="center" style={{display:'flex', justifyContent:'center'}}>{<Avatar src={customer.avatar}/>}</TableCell>
                        <TableCell align="center">{customer.service}</TableCell>
                        <TableCell align="center">{customer.service}</TableCell>
                        <TableCell align="center">{createdAt}</TableCell>
                        <TableCell align="center">{customer.time}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Typography variant="h6" gutterBottom component="div" style={{marginTop:'15px'}}>
                    Specific Content
                  </Typography>
                  <Card
                    variant='outlined'
                  >
                    <CardContent style={{wordBreak:'break-all'}}>
                      {customer.content}
                    </CardContent>
                  </Card>
                </Box>
              </CardContent>
            </Card>
            
          </Collapse>
        </TableCell>
      </TableRow>
      </>
    );
  };
  Row.propTypes = {
    row: PropTypes.shape({
      calories: PropTypes.number.isRequired,
      carbs: PropTypes.number.isRequired,
      fat: PropTypes.number.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          customerId: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
        }),
      ).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      protein: PropTypes.number.isRequired,
    }).isRequired,
  };
  return (
    <>
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>
                  detail
                </TableCell>
                <TableCell>
                  Id
                </TableCell>
                <TableCell>
                  type
                </TableCell>
                <TableCell>
                  content
                </TableCell>
                <TableCell>
                  day
                </TableCell>
                <TableCell>
                  time
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) =>(
                <Row key={customer.id} row={customer}></Row>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10, 50, 100]}
      />
    </Card>
    </>
  );
};

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
