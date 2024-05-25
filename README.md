# SIEM Solution Report

## Overview
This project is a Security Information and Event Management (SIEM) solution that monitors network traffic, extracts event logs, and tracks CPU and RAM usage. The system is built using Python and interacts with a MySQL database to store and analyze the collected data.

## Key Features
1. **Network Monitoring**: The system continuously monitors network traffic using the Scapy library. It detects specific events like ping, Nmap scans, and SSH brute-force attacks, and logs them in the MySQL database[1].

2. **Event Log Extraction**: The system extracts event logs from Windows using PowerShell commands. It retrieves the 50 most recent security events, 50 most recent system events, and 20 most recent application events, and stores them in separate tables in the MySQL database[1].

3. **CPU and RAM Usage Tracking**: The system periodically checks the CPU and RAM usage of the system using the `psutil` library. The usage data is stored in the `usage_data` table of the MySQL database[1].

4. **Database Integration**: The system uses the `mysql.connector` library to establish a connection to a MySQL database hosted on `192.168.171.206`. It creates the necessary tables if they don't exist and clears any existing data before inserting new data[1].

## Architecture
The project consists of two main components:

1. **Python Script (`agent.py`)**: This script is responsible for network monitoring, event log extraction, and CPU/RAM usage tracking. It uses various libraries like Scapy, `mysql.connector`, and `subprocess` to perform its tasks[1].

2. **Express Server (`server.py`)**: This component sets up an Express server in Node.js to interact with the MySQL database. It defines API endpoints to fetch data from the database and sends JSON responses[1].

## Database Schema
The MySQL database used in this project has the following tables:

1. **`logs`**: Stores network monitoring logs with fields like timestamp, source IP, destination IP, event type, user name, and message[1].

2. **`security_logs`**, **`system_logs`**, **`application_logs`**: Store event logs of different types with fields like event time, event ID, level, and message[1].

3. **`usage_data`**: Stores CPU and RAM usage data with fields like timestamp, CPU usage, and RAM usage[1].

## Future Improvements
1. **Enhance Event Log Extraction**: Expand the event log extraction capabilities to include more types of logs and provide more detailed information.

2. **Implement Real-Time Alerts**: Add functionality to generate real-time alerts when specific events or anomalies are detected, such as sending notifications to administrators.

3. **Improve Data Visualization**: Enhance the data visualization features by adding more chart types and customization options to better analyze the collected data.

4. **Implement User Authentication**: Introduce user authentication and authorization mechanisms to secure access to the SIEM dashboard and prevent unauthorized access.

5. **Expand Networking Monitoring**: Enhance the network monitoring capabilities to detect a wider range of threats and provide more detailed information about detected events.

## Conclusion
This SIEM solution provides a comprehensive approach to monitoring network traffic, extracting event logs, and tracking system performance. By integrating with a MySQL database, the system can store and analyze large amounts of data, enabling administrators to identify potential security threats and optimize system performance. With further improvements and enhancements, this solution can become a powerful tool for maintaining a secure and efficient IT infrastructure.
