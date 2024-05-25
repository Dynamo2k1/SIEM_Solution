# I am currently working on this project
- For installation and configuration of ```Agent.py``` and ```MySQL database```, go to siem-frontend

# Security Information and Event Management(SIEM) Solution

## Overview

This report details the implementation of a Security Information and Event Management (SIEM) dashboard using a React front-end, an Express.js back-end with a MySQL database, and a Python script to collect system usage data.

### Components

1. **Front-End (React)**
2. **Back-End (Express.js)**
3. **Data Collection Agent (Python)**

## Front-End (React)

### `App.js`

The React application fetches data from an API and displays it in various chart formats (Pie, Scatter, Line, Funnel) and a DataGrid table. Users can navigate through different log categories using tabs.

#### Key Functions and Components

1. **`fetchData`**: This function is designed to fetch data from the API endpoint corresponding to the provided `table` parameter and then update the state using the `setData` function.

    ```javascript
    const fetchData = async (table, setData) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/${table}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    ```

    - **Parameters**:
        - `table`: A string representing the name of the table from which data is to be fetched.
        - `setData`: A function used to update the state with the fetched data.

    - **Functionality**:
        - This function utilizes Axios, a promise-based HTTP client for JavaScript, to make an asynchronous GET request to the specified API endpoint.
        - Upon receiving a successful response, it extracts the data from the response object and updates the state using the `setData` function.
        - In case of any errors during the fetch operation, it logs the error to the console for debugging purposes.

2. **Chart Rendering Functions**: These functions render different types of charts based on the provided data and title.

    ```javascript
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
    ```

    - **Parameters**:
        - `data`: An array of log data used to generate the chart.
        - `title`: A string representing the title of the chart.

    - **Functionality**:
        - These functions generate chart data based on specific criteria (e.g., counting occurrences of each level).
        - The chart data is structured according to the format expected by the corresponding chart component (e.g., Pie chart).
        - Each function returns JSX code that renders the chart component with the generated chart data.

    - **Usage**:
        - These functions are invoked with appropriate data and title parameters to render specific types of charts within the application.


3. **`renderTable`**: This function generates a DataGrid component to display logs data in tabular format.

    ```javascript
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
    ```

    - **Parameters**:
        - `data`: An array containing log data to be displayed in the table.

    - **Functionality**:
        - This function dynamically generates table columns based on the keys of the first log object in the provided data array.
        - Each column's field name is set to the corresponding key in the log object.
        - Column headers are derived from the keys and are converted to uppercase.
        - The `message` column is given a larger width (400px) compared to other columns (150px).
        - The DataGrid component is rendered with the generated columns and the log data rows.
        - Pagination is enabled with a page size of 5 rows.
        - The table adjusts its height automatically based on its content.

    - **Usage**:
        - Invoke this function with an array of logs data to render the corresponding DataGrid table.
4. **`LogsSection`**: This component renders logs data along with a chart type selector and a DataGrid table.

    ```javascript
    const LogsSection = ({ title, data }) => {
      const [chartType, setChartType] = useState('Pie');

      const renderChart = () => {
        switch (chartType) {
          case 'Pie': return renderPieChart(data, title);
          case 'Scatter': return renderScatterChart(data, title);
          case 'Line': return renderLineChart(data, title);
          case 'Funnel': return renderFunnelChart(data, title);
          default: return null;
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
    ```

    - **Props**:
        - `title`: Title of the logs section.
        - `data`: Array of log data to be displayed.

    - **Functionality**:
        - This component displays a title for the logs section.
        - It provides buttons to select different types of charts (Pie, Scatter, Line, Funnel).
        - The selected chart type determines the type of chart displayed for the log data.
        - It renders a DataGrid table to display the log data in a tabular format.

    - **Usage**:
        - Include this component in the main App component, passing the title and data props to display logs with chart and table.
5. **`NetworkingSection`**: This section is specialized for displaying networking logs filtered to include only 'Nmap scan' and 'Ping' events.

    ```javascript
    const NetworkingSection = ({ data }) => {
      const filteredData = data.filter(log => log.event_type === 'Nmap scan' || log.event_type === 'Ping');
      return (
        <div>
          <h2>Networking Logs</h2>
          {renderPieChart(filteredData, 'Networking')}
          {renderScatterChart(filteredData, 'Networking')}
          {renderTable(filteredData)}
        </div>
      );
    };
    ```

    - **Props**:
        - `data`: Array of log data to be filtered and displayed.

    - **Functionality**:
        - This component filters the input log data to include only 'Nmap scan' and 'Ping' events.
        - It displays the filtered networking logs using a Pie chart, Scatter chart, and DataGrid table.
        - The Pie chart represents the distribution of events, the Scatter chart shows event time vs. event ID, and the DataGrid table presents detailed log information.

    - **Usage**:
        - Include this component in the main App component to display filtered networking logs.
6. **`App`**: This is the main component responsible for managing state and rendering different sections based on the selected tab.

    ```javascript
    const App = () => {
      const [logs, setLogs] = useState([]);
      const [securityLogs, setSecurityLogs] = useState([]);
      const [systemLogs, setSystemLogs] = useState([]);
      const [applicationLogs, setApplicationLogs] = useState([]);
      const [tabIndex, setTabIndex] = useState(0);

      useEffect(() => {
        fetchData('logs', setLogs);
        fetchData('security_logs', setSecurityLogs);
        fetchData('system_logs', setSystemLogs);
        fetchData('application_logs', setApplicationLogs);
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
                <Tab label="Networking" />
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
              <NetworkingSection data={logs} />
            </TabPanel>
          </div>
        </ThemeProvider>
      );
    };
    ```

    - **State**:
        - `logs`: State variable to store logs data.
        - `securityLogs`: State variable to store security logs data.
        - `systemLogs`: State variable to store system logs data.
        - `applicationLogs`: State variable to store application logs data.
        - `tabIndex`: State variable to keep track of the currently selected tab index.

    - **Effects**:
        - The `useEffect` hook is used to fetch data for different log types when the component mounts.

    - **Functions**:
        - `handleTabChange`: Function to handle tab changes and update the selected tab index.

    - **Theme**:
        - The component uses the Material-UI `createTheme` function to set the light mode theme.

    - **Rendering**:
        - The component renders a Material-UI AppBar with tabs for different log types.
        - Based on the selected tab, it renders the corresponding section using `LogsSection` or `NetworkingSection`.

### `TabPanel` Component

A helper component to manage tab content display.

```javascript
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
```

## Back-End (Express.js)

### `server.js`

The Express server connects to a MySQL database, providing routes to fetch data from different tables. It supports CORS and handles JSON requests and responses.

#### MySQL Database Connection

```javascript
const db = mysql.createConnection({
    host: '192.168.171.206',
    user: 'dynamo2k1',
    password: '1590',
    database: 'siem_solution'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database');
    }
});
```

#### Routes

- **Generic Route to Fetch Data from Any Table**

    ```javascript
    app.get('/api/:table', (req, res) => {
        const table = req.params.table;
        const query = `SELECT * FROM ??`;
        db.query(query, [table], (err, results) => {
            if (err) {
                console.error('Error fetching data from table:', table, err);
                res.status(500).send('Server error');
            } else {
                res.json(results);
            }
        });
    });
    ```

- **Specific Route to Fetch Data from the `usage_data` Table**

    ```javascript
    app.get('/api/usage_data', (req, res) => {
        const query = `SELECT * FROM usage_data`;
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching data from usage_data table:', err);
                res.status(500).send('Server error');
            } else {
                res.json(results);
            }
        });
    });
    ```

#### Server Listening on Port 5000

```javascript
const PORT = 5000;
app.listen(PORT, () => {
    console

.log(`Server running on port ${PORT}`);
});
```


### Data Collection Agent (Python)

#### `agent.py`

The Python script collects system usage data (CPU, memory, disk usage) and network details, then inserts this data into a MySQL database.

##### Importing Required Libraries

```python
import psutil
import requests
import datetime
import time
import mysql.connector
import logging
import os
```

##### Setting Up Logging

```python
# Setting up logging
logging.basicConfig(filename='agent.log', level=logging.INFO, 
                    format='%(asctime)s %(levelname)s %(message)s')
```

##### MySQL Database Connection

```python
# MySQL database connection
db_config = {
    'user': 'dynamo2k1',
    'password': '1590',
    'host': '192.168.171.206',
    'database': 'siem_solution'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)
```

##### Collecting System Usage Data

1. **`get_cpu_usage`**: Collects CPU usage.

    ```python
    def get_cpu_usage():
        return psutil.cpu_percent(interval=1)
    ```

2. **`get_memory_usage`**: Collects memory usage.

    ```python
    def get_memory_usage():
        memory = psutil.virtual_memory()
        return memory.percent
    ```

3. **`get_disk_usage`**: Collects disk usage.

    ```python
    def get_disk_usage():
        disk = psutil.disk_usage('/')
        return disk.percent
    ```

4. **`get_network_usage`**: Collects network usage.

    ```python
    def get_network_usage():
        net_io = psutil.net_io_counters()
        return {
            'bytes_sent': net_io.bytes_sent,
            'bytes_recv': net_io.bytes_recv
        }
    ```

##### Saving Data to MySQL

1. **`save_data_to_mysql`**: Inserts collected data into the MySQL database.

    ```python
    def save_data_to_mysql(data):
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            query = """
                INSERT INTO usage_data (cpu_usage, memory_usage, disk_usage, bytes_sent, bytes_recv, timestamp)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            cursor.execute(query, (
                data['cpu_usage'], data['memory_usage'], data['disk_usage'],
                data['bytes_sent'], data['bytes_recv'], data['timestamp']
            ))
            conn.commit()
        except mysql.connector.Error as err:
            logging.error(f"Error: {err}")
        finally:
            cursor.close()
            conn.close()
    ```
This function takes a dictionary `data` containing various usage metrics and saves it into a MySQL database table named `usage_data`. The function consists of the following steps:

1. Establishes a connection to the MySQL database using `get_db_connection()` function.
2. Creates a cursor object to execute SQL queries.
3. Constructs an SQL `INSERT` query to insert data into the `usage_data` table.
4. Executes the query using cursor's `execute()` method with data values as parameters.
5. Commits the transaction to persist changes to the database.
6. Handles any exceptions that may occur during the execution, logging the error.
7. Closes the cursor and connection to release resources.
##### Main Loop

The main loop continuously collects data at specified intervals and saves it to the database.

```python
while True:
    data = {
        'cpu_usage': get_cpu_usage(),
        'memory_usage': get_memory_usage(),
        'disk_usage': get_disk_usage(),
        'bytes_sent': get_network_usage()['bytes_sent'],
        'bytes_recv': get_network_usage()['bytes_recv'],
        'timestamp': datetime.datetime.now().isoformat()
    }
    save_data_to_mysql(data)
    logging.info(f"Data collected and saved: {data}")
    time.sleep(60)  # Collect data every 60 seconds
```
The main loop continuously collects usage data at specified intervals and saves it to the MySQL database using the `save_data_to_mysql()` function. The loop follows these steps:

1. Collects various usage metrics such as CPU usage, memory usage, disk usage, bytes sent, bytes received, and current timestamp using respective functions (`get_cpu_usage()`, `get_memory_usage()`, `get_disk_usage()`, `get_network_usage()`, and `datetime.datetime.now().isoformat()`).
2. Constructs a dictionary `data` containing these metrics.
3. Calls `save_data_to_mysql(data)` to save the collected data into the database.
4. Logs the information about the collected and saved data using the `logging` module.
5. Pauses execution for 60 seconds using `time.sleep(60)` before collecting data again.


   
This section of the `agent.py` script illustrates how system metrics (CPU, memory, disk, and network usage) are collected and stored in a MySQL database. The script uses the `psutil` library to gather system statistics, the `mysql.connector` library to interact with the MySQL database, and the `logging` module to log the process.
## Conclusion

This SIEM dashboard efficiently visualizes and manages security logs through a user-friendly interface. The React front-end interacts seamlessly with the Express back-end to fetch and display data from a MySQL database. The Python agent collects and sends system usage data to the backend, ensuring up-to-date monitoring.

### Future Enhancements

- Implement authentication and authorization for the dashboard.
- Add more sophisticated data filtering and searching capabilities.
- Enhance the visualization with additional chart types and customization options.
- Optimize performance for handling large datasets.
