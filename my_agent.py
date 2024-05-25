# from scapy.all import *
# import mysql.connector
# from datetime import datetime
# import subprocess
# import re
# import socket
#
#
# MYSQL_USER = 'dynamo2k1'
# MYSQL_PASSWORD = '1590'
# MYSQL_HOST = '192.168.171.206'
# MYSQL_DATABASE = 'siem_solution'
#
# # PowerShell command to get security event logs
# security_command = "Get-WinEvent -LogName Security -MaxEvents 100 | Group-Object Id | ForEach-Object { $_.Group[0] }"
#
# # PowerShell command to get system event logs
# system_command = "Get-WinEvent -LogName System -MaxEvents 100 | Group-Object Id | ForEach-Object { $_.Group[0] }"
#
# # PowerShell command to get application event logs
# application_command = " Get-WinEvent -LogName Application -MaxEvents 50 | Group-Object Id | ForEach-Object { $_.Group[0] }"
#
# def connect_db():
#     try:
#         db = mysql.connector.connect(
#             host=MYSQL_HOST,
#             user=MYSQL_USER,
#             password=MYSQL_PASSWORD,
#             database=MYSQL_DATABASE
#         )
#         return db
#     except mysql.connector.Error as e:
#         print(f"Error connecting to the MySQL database: {e}")
#         return None
#
# def insert_log(connection, ip, destination_ip, event_type, message):
#     try:
#         cursor = connection.cursor()
#         timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
#         query = '''INSERT INTO logs (timestamp, source_ip, destination_ip, event_type, user_name, message)
#                    VALUES (%s, %s, %s, %s, %s, %s)'''
#         values = (timestamp, ip, destination_ip, event_type, 'Unknown', message)
#         cursor.execute(query, values)
#         connection.commit()
#     except mysql.connector.Error as e:
#         print(f"Error inserting log into MySQL: {e}")
#
# # IP address and port of the manager
# hostname = socket.gethostname()
# destination_ip = socket.gethostbyname(hostname)
#
# # Initialize a set to store IP addresses (to avoid duplicates)
# attacking_ips = set()
#
# # Define a function to analyze packets
# def analyze_packet(packet):
#     if IP in packet:
#         src_ip = packet[IP].src
#
#         if packet.haslayer(ICMP):
#             message = "Ping detected"
#             insert_log(db_connection, src_ip, destination_ip, "Ping", message)
#
#         if packet.haslayer(TCP):
#             if packet[TCP].flags == 0x02:  # SYN flag set (Nmap scan)
#                 message = "Nmap scan detected"
#                 insert_log(db_connection, src_ip, destination_ip, "Nmap scan", message)
#             elif packet[TCP].dport == 22 and packet[TCP].flags == 0x12:  # SSH brute force
#                 message = "SSH brute force detected"
#                 insert_log(db_connection, src_ip, destination_ip, "SSH brute force", message)
#
# # Function to continuously monitor the network and log issues
# def monitor_network():
#     while True:
#         sniff(prn=analyze_packet, filter="ip", timeout=100)  # Set a timeout to avoid running indefinitely
#
# # Function to extract event log data from PowerShell output
# def extract_event_logs(powershell_command):
#     try:
#         powershell_output = subprocess.check_output(["powershell.exe", "-Command", powershell_command], universal_newlines=True)
#     except subprocess.CalledProcessError as e:
#         print(f"Error running PowerShell command: {e}")
#         return []
#
#     pattern = r"(\d{1,2}/\d{1,2}/\d{4} \d{1,2}:\d{1,2}:\d{1,2} [AP]M)\s+(\d+)\s+(\w+)\s+(.*)"
#     matches = re.findall(pattern, powershell_output)
#     return matches
#
# # Connect to the MySQL database
# db_connection = connect_db()
# if db_connection:
#     print("Connected to Database!")
#
#     # Clear existing data in the tables
#     cursor = db_connection.cursor()
#     # Create tables with LONGTEXT for message column
#     cursor.execute("""
#         CREATE TABLE IF NOT EXISTS security_logs (
#             id INT AUTO_INCREMENT PRIMARY KEY,
#             event_time DATETIME,
#             event_id INT,
#             level VARCHAR(50),
#             message LONGTEXT
#         )
#     """)
#
#     cursor.execute("""
#         CREATE TABLE IF NOT EXISTS system_logs (
#             id INT AUTO_INCREMENT PRIMARY KEY,
#             event_time DATETIME,
#             event_id INT,
#             level VARCHAR(50),
#             message LONGTEXT
#         )
#     """)
#
#     cursor.execute("""
#         CREATE TABLE IF NOT EXISTS application_logs (
#             id INT AUTO_INCREMENT PRIMARY KEY,
#             event_time DATETIME,
#             event_id INT,
#             level VARCHAR(50),
#             message LONGTEXT
#         )
#     """)
#
#     cursor.execute("""
#         CREATE TABLE IF NOT EXISTS logs (
#             id INT AUTO_INCREMENT PRIMARY KEY,
#             timestamp DATETIME,
#             source_ip VARCHAR(255),
#             destination_ip VARCHAR(255),
#             event_type VARCHAR(255),
#             user_name VARCHAR(255),
#             message TEXT
#             )
#     """)
#     cursor.execute("TRUNCATE TABLE security_logs")
#     cursor.execute("TRUNCATE TABLE system_logs")
#     cursor.execute("TRUNCATE TABLE application_logs")
#
#     # Extract and store security event logs
#     security_logs = extract_event_logs(security_command)
#     for event_time, event_id, level, message in security_logs:
#         event_datetime = datetime.strptime(event_time, "%m/%d/%Y %I:%M:%S %p")
#         sql = "INSERT INTO security_logs (event_time, event_id, level, message) VALUES (%s, %s, %s, %s)"
#         values = (event_datetime, event_id, level, message)
#         cursor.execute(sql, values)
#
#     # Extract and store system event logs
#     system_logs = extract_event_logs(system_command)
#     for event_time, event_id, level, message in system_logs:
#         event_datetime = datetime.strptime(event_time, "%m/%d/%Y %I:%M:%S %p")
#         sql = "INSERT INTO system_logs (event_time, event_id, level, message) VALUES (%s, %s, %s, %s)"
#         values = (event_datetime, event_id, level, message)
#         cursor.execute(sql, values)
#
#     # Extract and store application event logs
#     application_logs = extract_event_logs(application_command)
#     for event_time, event_id, level, message in application_logs:
#         event_datetime = datetime.strptime(event_time, "%m/%d/%Y %I:%M:%S %p")
#         sql = "INSERT INTO application_logs (event_time, event_id, level, message) VALUES (%s, %s, %s, %s)"
#         values = (event_datetime, event_id, level, message)
#         cursor.execute(sql, values)
#
#     db_connection.commit()
#     print("Event log data updated in the MySQL database.")
#
#     # Start monitoring the network
#     print("Starting network monitoring...")
#     monitor_network()
#
# else:
#     print("Failed to connect to the database. Exiting...")



from scapy.all import *
import mysql.connector
from datetime import datetime
import subprocess
import re
import socket
import time
import psutil


MYSQL_USER = 'dynamo2k1'
MYSQL_PASSWORD = '1590'
MYSQL_HOST = '192.168.171.206'
MYSQL_DATABASE = 'siem_solution'

# PowerShell command to get security event logs
security_command = "Get-WinEvent -LogName Security -MaxEvents 50 | Group-Object Id | ForEach-Object { $_.Group[0] }"

# PowerShell command to get system event logs
system_command = "Get-WinEvent -LogName System -MaxEvents 50 | Group-Object Id | ForEach-Object { $_.Group[0] }"

# PowerShell command to get application event logs
application_command = " Get-WinEvent -LogName Application -MaxEvents 20 | Group-Object Id | ForEach-Object { $_.Group[0] }"

def connect_db():
    try:
        db = mysql.connector.connect(
            host=MYSQL_HOST,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE
        )
        return db
    except mysql.connector.Error as e:
        print(f"Error connecting to the MySQL database: {e}")
        return None

def insert_log(connection, ip, destination_ip, event_type, message):
    try:
        cursor = connection.cursor()
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        query = '''INSERT INTO logs (timestamp, source_ip, destination_ip, event_type, user_name, message)
                   VALUES (%s, %s, %s, %s, %s, %s)'''
        values = (timestamp, ip, destination_ip, event_type, 'Unknown', message)
        cursor.execute(query, values)
        connection.commit()
    except mysql.connector.Error as e:
        print(f"Error inserting log into MySQL: {e}")

# IP address and port of the manager
hostname = socket.gethostname()
destination_ip = socket.gethostbyname(hostname)

# Initialize a set to store IP addresses (to avoid duplicates)
attacking_ips = set()

# Define a function to analyze packets
def analyze_packet(packet):
    if IP in packet:
        src_ip = packet[IP].src

        if packet.haslayer(ICMP):
            message = "Ping detected"
            insert_log(db_connection, src_ip, destination_ip, "Ping", message)

        if packet.haslayer(TCP):
            if packet[TCP].flags == 0x02:  # SYN flag set (Nmap scan)
                message = "Nmap scan detected"
                insert_log(db_connection, src_ip, destination_ip, "Nmap scan", message)
            elif packet[TCP].dport == 22 and packet[TCP].flags == 0x12:  # SSH brute force
                message = "SSH brute force detected"
                insert_log(db_connection, src_ip, destination_ip, "SSH brute force", message)

# Function to continuously monitor the network and log issues
def get_cpu_ram_usage():
    cpu_usage = psutil.cpu_percent(interval=1)
    ram_usage = psutil.virtual_memory().percent
    return cpu_usage, ram_usage

# Function to store CPU and RAM usage in the MySQL database
def store_usage_in_db(cpu_usage, ram_usage, db_connection):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    try:
        cursor = db_connection.cursor()
        query = '''INSERT INTO usage_data (timestamp, cpu_usage, ram_usage)
                   VALUES (%s, %s, %s)'''
        cursor.execute(query, (timestamp, cpu_usage, ram_usage))
        db_connection.commit()
        print("Usage data stored successfully")
    except mysql.connector.Error as e:
        print(f"Error inserting data into MySQL: {e}")

# Modified monitor_network function to include storing CPU and RAM usage
def monitor_network(db_connection):
    while True:
        sniff(prn=analyze_packet, filter="ip", timeout=100)  # Set a timeout to avoid running indefinitely
        cpu_usage, ram_usage = get_cpu_ram_usage()
        store_usage_in_db(cpu_usage, ram_usage, db_connection)
        time.sleep(5)
# Function to extract event log data from PowerShell output
def extract_event_logs(powershell_command):
    try:
        powershell_output = subprocess.check_output(["powershell.exe", "-Command", powershell_command], universal_newlines=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running PowerShell command: {e}")
        return []

    pattern = r"(\d{1,2}/\d{1,2}/\d{4} \d{1,2}:\d{1,2}:\d{1,2} [AP]M)\s+(\d+)\s+(\w+)\s+(.*)"
    matches = re.findall(pattern, powershell_output)
    return matches

# Connect to the MySQL database
# Create the usage_data table if it doesn't exist
def create_usage_table(db_connection):
    try:
        cursor = db_connection.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS usage_data (
                id INT AUTO_INCREMENT PRIMARY KEY,
                timestamp DATETIME,
                cpu_usage FLOAT,
                ram_usage FLOAT
            )
        ''')
        db_connection.commit()
        print("Table 'usage_data' is ready.")
    except mysql.connector.Error as e:
        print(f"Error creating table: {e}")

# Connect to the MySQL database
db_connection = connect_db()
if db_connection:
    print("Connected to Database!")
    create_usage_table(db_connection)
    # Clear existing data in the tables
    cursor = db_connection.cursor()
    # Create tables with LONGTEXT for message column
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS security_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            event_time DATETIME,
            event_id INT,
            level VARCHAR(50),
            message LONGTEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS system_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            event_time DATETIME,
            event_id INT,
            level VARCHAR(50),
            message LONGTEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS application_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            event_time DATETIME,
            event_id INT,
            level VARCHAR(50),
            message LONGTEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            timestamp DATETIME,
            source_ip VARCHAR(255),
            destination_ip VARCHAR(255),
            event_type VARCHAR(255),
            user_name VARCHAR(255),
            message TEXT
            )
    """)
    cursor.execute("TRUNCATE TABLE security_logs")
    cursor.execute("TRUNCATE TABLE system_logs")
    cursor.execute("TRUNCATE TABLE application_logs")

    # Extract and store security event logs
    security_logs = extract_event_logs(security_command)
    for event_time, event_id, level, message in security_logs:
        event_datetime = datetime.strptime(event_time, "%m/%d/%Y %I:%M:%S %p")
        sql = "INSERT INTO security_logs (event_time, event_id, level, message) VALUES (%s, %s, %s, %s)"
        values = (event_datetime, event_id, level, message)
        cursor.execute(sql, values)

    # Extract and store system event logs
    system_logs = extract_event_logs(system_command)
    for event_time, event_id, level, message in system_logs:
        event_datetime = datetime.strptime(event_time, "%m/%d/%Y %I:%M:%S %p")
        sql = "INSERT INTO system_logs (event_time, event_id, level, message) VALUES (%s, %s, %s, %s)"
        values = (event_datetime, event_id, level, message)
        cursor.execute(sql, values)

    # Extract and store application event logs
    application_logs = extract_event_logs(application_command)
    for event_time, event_id, level, message in application_logs:
        event_datetime = datetime.strptime(event_time, "%m/%d/%Y %I:%M:%S %p")
        sql = "INSERT INTO application_logs (event_time, event_id, level, message) VALUES (%s, %s, %s, %s)"
        values = (event_datetime, event_id, level, message)
        cursor.execute(sql, values)

    db_connection.commit()
    print("Event log data updated in the MySQL database.")

    # Start monitoring the network
    print("Starting network monitoring and usage tracking...")
    monitor_network(db_connection)

else:
    print("Failed to connect to the database. Exiting...")