import sqlite3
import os
# TODO: import hashlib

from time import sleep
from pathlib import Path

abs_path = Path(os.path.abspath('.'))
database_dir = Path('backend/sqlite/')
database_dir.mkdir(parents=True, exist_ok=True)
database_path = database_dir / 'dank_bank.db'
database_path.touch(exist_ok=True)

print('Attempting to start webserver and database...')


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


while True:
    try:
        # dank bank database
        print('attempting to connect to database at relative path ' + str(database_path))
        con = sqlite3.connect(str(database_path))
        con.row_factory = dict_factory
        print('Connected to sqlite database.')
        break
    except sqlite3.OperationalError:
        print("hmm... we couldn't connect to the database. that sucks.\n"
              "checking path " + str(database_path))
        sleep(1)


# Executes a MySQL query
def run_query(query):
    with con:
        cur = con.cursor()
        cur.execute(query)
        return cur


def check_user_exists(username: str):
    cur = run_query(f"SELECT * FROM users WHERE username = '{username}'")
    user = cur.fetchone()
    if user:
        return True
    return False


# Gets a user using username and password
def get_user(username: str, password: str):
    cur = run_query(f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'")
    return cur.fetchone()


def get_user_with_pin(username: str, pin: int):
    cur = run_query(f"SELECT * FROM users WHERE username = '{username}' AND pin = '{pin}'")
    return cur.fetchone()


# Gets a user using the user id
def get_user_by_id(user_id: int):
    cur = run_query(f"SELECT * FROM users WHERE id = {user_id}")
    return cur.fetchone()


# Created a new user
def create_user(first_name: str, last_name: str, username: str, password: str, email: str, phone_number: str,
                address: str, pin: str):
    run_query(f"INSERT INTO users(first_name, last_name, username, password, email, phone_number, address, pin)"
              f" VALUES ('{first_name}', '{last_name}', '{username}', '{password}',"
              f" '{email}', '{phone_number}', '{address}', '{pin}');")


# Modifies settings for a user
def modify_user(user_id: int, new_first_name: str = None, new_last_name: str = None, new_username: str = None,
                new_password: str = None, new_email: str = None, new_phone: str = None, new_address: str = None,
                new_pin: int = None):
    user = get_user_by_id(user_id)

    new_first_name = new_first_name if new_first_name else user['first_name']
    new_last_name = new_last_name if new_last_name else user['last_name']
    new_username = new_username if new_username else user['username']
    new_password = new_password if new_password else user['password']
    new_email = new_email if new_email else user['email']
    new_phone = new_phone if new_phone else user['phone_number']
    new_address = new_address if new_address else user['address']
    new_pin = new_pin if new_pin else user['pin']

    run_query(
        f"UPDATE users SET first_name = '{new_first_name}', last_name='{new_last_name}', username = '{new_username}',"
        f" password = '{new_password}', email = '{new_email}', phone_number = '{new_phone}', address = '{new_address}',"
        f" pin = '{new_pin}' WHERE id = {user_id}")


# Gets all accounts associated with a given user
def get_accounts(user_id: int):
    cur = run_query(f"SELECT * FROM accounts WHERE user_id = {user_id}")
    return cur.fetchall()


def get_account_by_id(account_id: int):
    cur = run_query(f"SELECT * FROM accounts WHERE account_id = {account_id}")
    return cur.fetchone()


# Adds account that is associated with given token
def create_account(user_id: int, account_type: str, initial_balance=0):
    run_query(
        f"INSERT INTO accounts(user_id, type, balance) VALUES ({user_id}, '{account_type}', 0)")
    account = run_query("SELECT * FROM accounts WHERE account_id = last_insert_rowid()").fetchone()
    if initial_balance > 0:
        execute_transfer(user_id, user_id, account['account_id'], initial_balance, "Initial Deposit.")


# modifies balance of account with a given token
def modify_balance(account_id: int, increment: float):
    run_query(
        f"UPDATE accounts SET balance=balance+{float(increment)} WHERE account_id={account_id}")


def execute_transfer(send_user_id: int, receive_user_id: int, receive_account_id: int,
                     amount: float, description: str, send_account_id: int = 0, ):
    run_query(f"INSERT INTO "
              f"transactions(send_user_id, send_account_id, receive_id, receive_account_id, amount, description) "
              f"VALUES ({send_user_id}, {send_account_id}, {receive_user_id},"
              f" {receive_account_id}, {amount}, '{description}')")

    modify_balance(receive_account_id, amount)
    if send_account_id:
        modify_balance(send_account_id, -amount)


def get_transfers(user_id: int, account_id: int = 0):
    if account_id < 0:
        return None
    if account_id == 0:
        cur = run_query(f"SELECT * FROM transactions "
                             f"WHERE send_user_id={user_id} "
                             f"OR receive_id={user_id}")
    else:
        cur = run_query(f"SELECT * FROM transactions "
                             f"WHERE send_account_id={account_id} "
                             f"OR receive_account_id={account_id}")
    return cur.fetchall()



# Applies uploaded check to database
def apply_check(account_id: int, image_path: str, check_amount: float):
    account = get_account_by_id(account_id)
    user_id = account['user_id']
    execute_transfer(user_id, user_id, account_id, check_amount, "Check Upload.")
    run_query(f"INSERT INTO check_storage(user_id, trans_id, image_path) "
              f"VALUES ( {user_id},last_insert_rowid(), '{image_path}')")


def get_checks(user_id: int):
    cur = run_query(f"SELECT * FROM check_storage WHERE user_id={user_id}")
    return cur.fetchall()


def withdraw_money(account_id: id, amount: float):
    account = get_account_by_id(account_id)
    user_id = account['user_id']
    execute_transfer(user_id, user_id, account_id, -amount, "ATM withdraw.")


# Set up and connect to database
with open("backend/sqlite_setup.sql") as file:
    print('checking database for proper tables...')
    for query in file.read().split(";"):
        try:
            run_query(query)
        except sqlite3.OperationalError:
            pass
