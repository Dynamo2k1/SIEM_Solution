// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Bar, Pie, Scatter, Line } from 'react-chartjs-2';
// import { Chart as ChartJS, registerables, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js';
// import { FunnelController, TrapezoidElement } from 'chartjs-chart-funnel';
// import { Tabs, Tab, AppBar, Box, Typography, Button, ButtonGroup } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { DataGrid } from '@mui/x-data-grid';

// ChartJS.register(...registerables, FunnelController, TrapezoidElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

// const fetchData = async (table, setData) => {
//   try {
//     const response = await axios.get(`http://localhost:5000/api/${table}`);
//     setData(response.data);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

// const renderPieChart = (data, title) => {
//   const levels = data.reduce((acc, log) => {
//     acc[log.level] = (acc[log.level] || 0) + 1;
//     return acc;
//   }, {});

//   const chartData = {
//     labels: Object.keys(levels),
//     datasets: [
//       {
//         label: title,
//         data: Object.values(levels),
//         backgroundColor: ['green', 'red', 'yellow'],
//       },
//     ],
//   };

//   return (
//     <div style={{ width: '300px', height: '300px', margin: 'auto' }}>
//       <Pie data={chartData} />
//     </div>
//   );
// };

// const renderScatterChart = (data, title) => {
//   const chartData = {
//     datasets: [
//       {
//         label: title,
//         data: data.map(log => ({ x: new Date(log.event_time).getTime(), y: log.event_id })),
//         backgroundColor: 'blue',
//       },
//     ],
//   };

//   return (
//     <div style={{ width: '600px', height: '300px', margin: 'auto' }}>
//       <Scatter data={chartData} />
//     </div>
//   );
// };

// const renderLineChart = (data, title) => {
//   const chartData = {
//     labels: data.map(log => new Date(log.event_time).toLocaleString()),
//     datasets: [
//       {
//         label: title,
//         data: data.map(log => log.event_id),
//         fill: false,
//         borderColor: 'blue',
//       },
//     ],
//   };

//   return (
//     <div style={{ width: '600px', height: '300px', margin: 'auto' }}>
//       <Line data={chartData} />
//     </div>
//   );
// };

// const renderFunnelChart = (data, title) => {
//   const levels = data.reduce((acc, log) => {
//     acc[log.level] = (acc[log.level] || 0) + 1;
//     return acc;
//   }, {});

//   const chartData = {
//     labels: Object.keys(levels),
//     datasets: [
//       {
//         label: title,
//         data: Object.values(levels),
//         backgroundColor: ['green', 'red', 'yellow'],
//       },
//     ],
//   };

//   return (
//     <div style={{ width: '600px', height: '300px', margin: 'auto' }}>
//       <canvas id="funnelChart"></canvas>
//       <ChartJS type="funnel" data={chartData} />
//     </div>
//   );
// };

// const renderTable = (data) => {
//   const columns = Object.keys(data[0] || {}).map((key) => ({
//     field: key,
//     headerName: key.toUpperCase(),
//     width: key === 'message' ? 400 : 150,
//     flex: key === 'message' ? 1 : 0,
//   }));

//   return (
//     <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
//       <DataGrid rows={data} columns={columns} pageSize={5} autoHeight />
//     </div>
//   );
// };

// const LogsSection = ({ title, data }) => {
//   const [chartType, setChartType] = useState('Pie');

//   const renderChart = () => {
//     switch (chartType) {
//       case 'Pie':
//         return renderPieChart(data, title);
//       case 'Scatter':
//         return renderScatterChart(data, title);
//       case 'Line':
//         return renderLineChart(data, title);
//       case 'Funnel':
//         return renderFunnelChart(data, title);
//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       <h2>{title}</h2>
//       <ButtonGroup variant="contained" color="primary" style={{ marginBottom: '20px' }}>
//         <Button onClick={() => setChartType('Pie')}>Pie Chart</Button>
//         <Button onClick={() => setChartType('Scatter')}>Scatter Chart</Button>
//         <Button onClick={() => setChartType('Line')}>Line Chart</Button>
//         <Button onClick={() => setChartType('Funnel')}>Funnel Chart</Button>
//       </ButtonGroup>
//       {renderChart()}
//       {renderTable(data)}
//     </div>
//   );
// };

// const NetworkingSection = ({ data }) => {
//   const filteredData = data.filter(log => log.event_type === 'Nmap scan' || log.event_type === 'Ping');
//   return (
//     <div>
//       <h2>Networking Logs</h2>
//       {renderPieChart(filteredData, 'Networking')}
//       {renderScatterChart(filteredData, 'Networking')}
//       {renderTable(filteredData)}
//     </div>
//   );
// };

// const App = () => {
//   const [logs, setLogs] = useState([]);
//   const [securityLogs, setSecurityLogs] = useState([]);
//   const [systemLogs, setSystemLogs] = useState([]);
//   const [applicationLogs, setApplicationLogs] = useState([]);
//   const [tabIndex, setTabIndex] = useState(0);

//   useEffect(() => {
//     fetchData('logs', setLogs);
//     fetchData('security_logs', setSecurityLogs);
//     fetchData('system_logs', setSystemLogs);
//     fetchData('application_logs', setApplicationLogs);
//   }, []);

//   const handleTabChange = (event, newValue) => {
//     setTabIndex(newValue);
//   };

//   const theme = createTheme({
//     palette: {
//       mode: 'light',
//     },
//   });

//   return (
//     <ThemeProvider theme={theme}>
//       <div style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', padding: '20px' }}>
//         <h1>SIEM Dashboard</h1>
//         <AppBar position="static">
//           <Tabs value={tabIndex} onChange={handleTabChange}>
//             <Tab label="Logs" />
//             <Tab label="Security Logs" />
//             <Tab label="System Logs" />
//             <Tab label="Application Logs" />
//             <Tab label="Networking" />
//           </Tabs>
//         </AppBar>
//         <TabPanel value={tabIndex} index={0}>
//           <LogsSection title="Logs" data={logs} />
//         </TabPanel>
//         <TabPanel value={tabIndex} index={1}>
//           <LogsSection title="Security Logs" data={securityLogs} />
//         </TabPanel>
//         <TabPanel value={tabIndex} index={2}>
//           <LogsSection title="System Logs" data={systemLogs} />
//         </TabPanel>
//         <TabPanel value={tabIndex} index={3}>
//           <LogsSection title="Application Logs" data={applicationLogs} />
//         </TabPanel>
//         <TabPanel value={tabIndex} index={4}>
//           <NetworkingSection data={logs} />
//         </TabPanel>
//       </div>
//     </ThemeProvider>
//   );
// };

// const TabPanel = (props) => {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`tabpanel-${index}`}
//       aria-labelledby={`tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box p={3}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// };

// export default App;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Scatter, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js';
import { FunnelController, TrapezoidElement } from 'chartjs-chart-funnel';
import { Tabs, Tab, AppBar, Box, Typography, Button, ButtonGroup } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

ChartJS.register(...registerables, FunnelController, TrapezoidElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const fetchData = async (table, setData) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/${table}`);
    setData(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const renderLineChart = (data, title, key) => {
  const chartData = {
    labels: data.map(log => new Date(log.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: title,
        data: data.map(log => log[key]),
        fill: false,
        borderColor: 'blue',
      },
    ],
  };

  return (
    <div style={{ width: '600px', height: '300px', margin: 'auto' }}>
      <Line data={chartData} />
    </div>
  );
};

const UsageSection = ({ title, data }) => {
  return (
    <div>
      <h2>{title}</h2>
      {renderLineChart(data, `${title} - CPU Usage`, 'cpu_usage')}
      {renderLineChart(data, `${title} - RAM Usage`, 'ram_usage')}
    </div>
  );
};

const App = () => {
  const [logs, setLogs] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [applicationLogs, setApplicationLogs] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    fetchData('logs', setLogs);
    fetchData('security_logs', setSecurityLogs);
    fetchData('system_logs', setSystemLogs);
    fetchData('application_logs', setApplicationLogs);
    fetchData('usage_data', setUsageData);
    
    const interval = setInterval(() => {
      fetchData('usage_data', setUsageData);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', padding: '20px' }}>
        <h1>SIEM Dashboard</h1>
        <AppBar position="static">
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Logs" />
            <Tab label="Security Logs" />
            <Tab label="System Logs" />
            <Tab label="Application Logs" />
            <Tab label="Usage Data" />
          </Tabs>
        </AppBar>
        <TabPanel value={tabIndex} index={0}>
          <LogsSection title="Logs" data={logs} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <LogsSection title="Security Logs" data={securityLogs} />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <LogsSection title="System Logs" data={systemLogs} />
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          <LogsSection title="Application Logs" data={applicationLogs} />
        </TabPanel>
        <TabPanel value={tabIndex} index={4}>
          <UsageSection title="Usage Data" data={usageData} />
        </TabPanel>
      </div>
    </ThemeProvider>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const LogsSection = ({ title, data }) => {
  const [chartType, setChartType] = useState('Pie');

  const renderPieChart = (data, title) => {
    const levels = data.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {});

    const chartData = {
      labels: Object.keys(levels),
      datasets: [
        {
          label: title,
          data: Object.values(levels),
          backgroundColor: ['green', 'red', 'yellow'],
        },
      ],
    };

    return (
      <div style={{ width: '300px', height: '300px', margin: 'auto' }}>
        <Pie data={chartData} />
      </div>
    );
  };

  const renderScatterChart = (data, title) => {
    const chartData = {
      datasets: [
        {
          label: title,
          data: data.map(log => ({ x: new Date(log.event_time).getTime(), y: log.event_id })),
          backgroundColor: 'blue',
        },
      ],
    };

    return (
      <div style={{ width: '600px', height: '300px', margin: 'auto' }}>
        <Scatter data={chartData} />
      </div>
    );
  };

  const renderLineChart = (data, title) => {
    const chartData = {
      labels: data.map(log => new Date(log.event_time).toLocaleString()),
      datasets: [
        {
          label: title,
          data: data.map(log => log.event_id),
          fill: false,
          borderColor: 'blue',
        },
      ],
    };

    return (
      <div style={{ width: '600px', height: '300px', margin: 'auto' }}>
        <Line data={chartData} />
      </div>
    );
  };

  const renderFunnelChart = (data, title) => {
    const levels = data.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {});

    const chartData = {
      labels: Object.keys(levels),
      datasets: [
        {
          label: title,
          data: Object.values(levels),
          backgroundColor: ['green', 'red', 'yellow'],
        },
      ],
    };

    return (
      <div style={{ width: '600px', height: '300px', margin: 'auto' }}>
        <canvas id="funnelChart"></canvas>
        <ChartJS type="funnel" data={chartData} />
      </div>
    );
  };

  const renderTable = (data) => {
    const columns = Object.keys(data[0] || {}).map((key) => ({
      field: key,
      headerName: key.toUpperCase(),
      width: key === 'message' ? 400 : 150,
      flex: key === 'message' ? 1 : 0,
    }));

    return (
      <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
        <DataGrid rows={data} columns={columns} pageSize={5} autoHeight />
      </div>
    );
  };

  const renderChart = () => {
    switch (chartType) {
      case 'Pie':
        return renderPieChart(data, title);
      case 'Scatter':
        return renderScatterChart(data, title);
      case 'Line':
        return renderLineChart(data, title);
      case 'Funnel':
        return renderFunnelChart(data, title);
      default:
        return null;
    }
  };

  return (
    <div>
      <h2>{title}</h2>
      <ButtonGroup variant="contained" color="primary" style={{ marginBottom: '20px' }}>
        <Button onClick={() => setChartType('Pie')}>Pie Chart</Button>
        <Button onClick={() => setChartType('Scatter')}>Scatter Chart</Button>
        <Button onClick={() => setChartType('Line')}>Line Chart</Button>
        <Button onClick={() => setChartType('Funnel')}>Funnel Chart</Button>
      </ButtonGroup>
      {renderChart()}
      {renderTable(data)}
    </div>
  );
};

export default App;
