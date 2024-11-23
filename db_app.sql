DROP SCHEMA IF EXISTS dbrace;

CREATE SCHEMA dbrace;

USE dbrace;

CREATE TABLE race (
    race_id INT PRIMARY KEY,
    race_name VARCHAR(45),
    track_location VARCHAR(45),
    race_season INT,
    num_laps INT,
    race_status ENUM('Scheduled', 'Delayed', 'Finished', 'Abandoned'),
    prize_money DECIMAL
);

CREATE TABLE race_stats (
    race_id INT PRIMARY KEY,
    driver_code VARCHAR(3),
    position ENUM('P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 
    'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20', 'DNF'),
    penalty INT,
    remarks VARCHAR(255) DEFAULT "Clean Race"
);

CREATE TABLE REF_points_awarded(
    position ENUM( 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 
    'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20', 'DNF'),
    points INT
);

INSERT INTO
    REF_points_awarded (position, points)
VALUES
    ("P1", 25), ("P2", 18), ("P3", 15), ("P4", 12), ("P5", 10),
    ("P6", 8), ("P7", 6), ("P8", 4), ("P9", 2), ("P10", 1), 
    ("P11", 0), ("P12", 0), ("P13", 0), ("P14", 0), ("P15", 0),
    ("P16", 0), ("P17", 0), ("P18", 0), ("P19", 0), ("P20", 0), ("DNF", 0);

CREATE TABLE driver_info (
    driver_code VARCHAR(3),
    birth_date DATE,
    country_id INT,
    crew_id INT
);

CREATE TABLE race_crew (
    crew_id INT,
    first_name VARCHAR(45),
    last_name VARCHAR(45),
    job_id INT, -- FK
    constructor_id INT, -- FK
    contract_start DATE,
    contract_end DATE
);

CREATE TABLE REF_job (job_id INT, job_title VARCHAR(45));

CREATE TABLE constructor (
    constructor_id INT,
    name VARCHAR(45),
    year_founded INT,
    country_id INT,
    engine_manufacturer VARCHAR(45),
    constructor_budget DECIMAL
);
