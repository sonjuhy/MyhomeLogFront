import PropTypes from 'prop-types';
import ComputerDesktopIcon from '@heroicons/react/24/solid/ComputerDesktopIcon';
import DeviceTabletIcon from '@heroicons/react/24/solid/DeviceTabletIcon';
import PhoneIcon from '@heroicons/react/24/solid/PhoneIcon';

import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import ExclamationIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  SvgIcon,
  Typography,
  useTheme
} from '@mui/material';
import { Chart } from 'src/components/chart';
import Image from 'next/image';

const useChartOptions = (labels) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent'
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.success.main,
      theme.palette.warning.main
    ],
    dataLabels: {
      enabled: false
    },
    labels,
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        expandOnClick: false
      }
    },
    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      fillSeriesColor: false
    }
  };
};

const iconMap = {
  True: (
    <SvgIcon>
      <CheckIcon />
    </SvgIcon>
  ),
  False: (
    <SvgIcon>
      <ExclamationIcon />
    </SvgIcon>
  ),
  NaN: (
    <SvgIcon>
      <XMarkIcon />
    </SvgIcon>
  )
};

export const OverviewTraffic = (props) => {
  const { chartSeries, labels, sx } = props;
  const chartOptions = useChartOptions(labels);

  return (
    <Card sx={sx}>
      <CardHeader title="Total True & False Count" />
      <CardContent>
        {(chartSeries[0] === 0 && chartSeries[1] === 0) && (
          <Box
            key={'NaN'}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            height={300}
          >
            <Image
              src={'/assets/logos/noData.png'}
              alt="cloud image"
              width={250}
              height={250}
              style={{width:'90%', height:'90%'}}
              loading="lazy"
            />
            <Typography
              sx={{ my: 1 }}
              variant="h6"
            >
              {'NaN'}
            </Typography>
          </Box>
        )}
        {!(chartSeries[0] === 0 && chartSeries[1] === 0) && (
          <Chart
            height={300}
            options={chartOptions}
            series={chartSeries}
            type="donut"
            width="100%"
          />
        )}
        
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          {chartSeries.map((item, index) => {
            const label = labels[index];

            return (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {iconMap[label]}
                <Typography
                  sx={{ my: 1 }}
                  variant="h6"
                >
                  {label}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                >
                  {item}%
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTraffic.propTypes = {
  chartSeries: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
  sx: PropTypes.object
};
