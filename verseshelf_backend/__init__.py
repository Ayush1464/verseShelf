import pymysql

# Mock mysqlclient using pymysql to avoid binary compilation issues
pymysql.install_as_MySQLdb()
