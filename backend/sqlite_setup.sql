/*
Database Setup File
This gets run if the database is not set up beforehand.

Add information here to change the structure of the database.
Be sure to drop old databases before running with a new structure.
 */

create table accounts
(
    account_id integer primary key,
    user_id    int         not null,
    type       varchar(15) not null,
    balance    double      not null
);

create table check_storage
(
    check_id   integer primary key,
    user_id    int          not null,
    trans_id   int          not null,
    image_path varchar(255) not null
);

create table transactions
(
    trans_id           integer primary key,
    send_user_id       int          not null,
    send_account_id    int          null,
    receive_id         int          not null,
    receive_account_id int          not null,
    amount             double       not null,
    description        varchar(255) not null
);

create table users
(
    id       integer primary key,
    first_name varchar(31) not null,
    last_name varchar(31) not null,
    username varchar(31) not null,
    password varchar(31) not null,
    email varchar(127) not null,
    address varchar(255) not null,
    phone_number varchar(31) not null,
    pin integer not null
);