# How to run this project

# Siem Deployment Guide

## Introduction

This guide provides instructions for deploying and configuring this Siem including agent for monitoring Windows systems and also about the setting of mysql database.

## Prerequisites

- Windows operating system
- Access to a MySQL database
- Node.js installed on the system

## Installation

### 1. Clone the SIEM_Solution repository from GitHub:
```sh
   git clone https://github.com/Dynamo2k1/SIEM_Solution.git
```

### 2. Navigate to the SIEM_Solution directory:
   ```sh
   cd SIEM_Solution
   ```

### 3. Copy the agent.py file to windows system and install these dependencies using pip:
   ```sh
   pip install scapy mysql-connector-python psutil
   ```
### 4. After that configure these lines in agent.py:
```
    "host": "your-server-ip",
    "user": "mysql-usename",
    "password": "mysql-password",
    "database": "database-name"
```

## Setting up MySQL on Kali Linux

### 1. Installing MySQL

To install MySQL on Kali Linux, you can use the following command:

```bash
sudo apt-get update
sudo apt-get install mariadb-server
```

### 2. Starting the MySQL Service

After installation, start the MySQL service using:

```bash
sudo service mysql start
```

### 3. Creating a MySQL User and Database

You can create a new MySQL user, grant it all privileges, and create a database using the following commands:

```sql
-- Log in to MySQL as the root user
sudo mysql -u root -p

-- Create a new user with all privileges and a password
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'username'@'localhost' IDENTIFIED BY 'password' WITH GRANT OPTION;

--Apply the chhanges
FLUSH PRIVILEGES;

-- Create a new database
CREATE DATABASE dbname;

-- Exit the MySQL shell
exit;
```

### 4. Granting Access to MySQL Server from Anywhere

To allow connections to the MySQL server from any client, modify the MySQL user to allow connections from any host:

```sql
-- Log in to MySQL as the user you created:
sudo mysql -u root -p

-- Grant permission to the user from any host
GRANT ALL PRIVILEGES ON *.* TO 'username'@'%' IDENTIFIED BY 'password' WITH GRANT OPTION;

-- Apply the changes
FLUSH PRIVILEGES;

-- Exit the MySQL shell
exit;
```

### 5. Setting up MySQL Configuration

Edit the MySQL configuration file `mariadb.cnf` to specify the bind address:

```bash
sudo nano /etc/mysql/mariadb.cnf
```

Find the `bind-address` line and change it to:

```cnf
bind-address = 0.0.0.0
```

If bind address line is not found add these lines:
```cnf
[mysqld]
bind-address = 0.0.0.0
```

Save the file and exit the text editor.

### Conclusion

You have now successfully set up MySQL on your Kali Linux system. You can proceed to use it for your applications and projects.
```
## Configuration

1. Open the `config.json` file in the agent directory.
2. Update the MySQL credentials with your database connection details.

```json
{
  "mysql": {
    "host": "your-server-ip",
    "user": "mysql-usename",
    "password": "mysql-password",
    "database": "database-name"
  }
}
```

## Running the Agent

Start the agent by running the following command:
```sh
node agent.js
```

## Monitoring and Management

- View logs in the console or log files for troubleshooting.
- Use task manager or process monitoring tools to ensure the agent is running smoothly.
```