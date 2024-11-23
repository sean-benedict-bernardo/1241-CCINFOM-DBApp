DROP SCHEMA IF EXISTS dbrace;

CREATE SCHEMA dbrace;

USE dbrace;

CREATE TABLE race (
    race_id INT AUTO_INCREMENT PRIMARY KEY,
    race_name VARCHAR(45),
    track_location VARCHAR(45),
    country_id VARCHAR(3), -- FK
    race_season INT,
    num_laps INT,
    race_status ENUM('Scheduled', 'Delayed', 'Finished', 'Abandoned'),
    prize_money DECIMAL
);

CREATE TABLE race_stats (
    race_id INT,
    driver_code VARCHAR(3),
    position ENUM(
        'P1',
        'P2',
        'P3',
        'P4',
        'P5',
        'P6',
        'P7',
        'P8',
        'P9',
        'P10',
        'P11',
        'P12',
        'P13',
        'P14',
        'P15',
        'P16',
        'P17',
        'P18',
        'P19',
        'P20',
        'DNF'
    ),
    penalty INT,
    remarks VARCHAR(255) DEFAULT 'Clean Race'
);

CREATE TABLE REF_points_awarded(
    position ENUM(
        'P1',
        'P2',
        'P3',
        'P4',
        'P5',
        'P6',
        'P7',
        'P8',
        'P9',
        'P10',
        'P11',
        'P12',
        'P13',
        'P14',
        'P15',
        'P16',
        'P17',
        'P18',
        'P19',
        'P20',
        'DNF'
    ),
    points INT
);

INSERT INTO
    REF_points_awarded (position, points)
VALUES
    ('P1', 25),
    ('P2', 18),
    ('P3', 15),
    ('P4', 12),
    ('P5', 10),
    ('P6', 8),
    ('P7', 6),
    ('P8', 4),
    ('P9', 2),
    ('P10', 1),
    ('P11', 0),
    ('P12', 0),
    ('P13', 0),
    ('P14', 0),
    ('P15', 0),
    ('P16', 0),
    ('P17', 0),
    ('P18', 0),
    ('P19', 0),
    ('P20', 0),
    ('DNF', 0);

CREATE TABLE driver_info (
    driver_code VARCHAR(3) PRIMARY KEY,
    birth_date DATE,
    country_id VARCHAR(3),
    crew_id INT
);

CREATE TABLE race_crew (
    crew_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(45),
    last_name VARCHAR(45),
    job_id INT -- FK
);

CREATE TABLE contract (
    constructor_id INT, -- FK
    crew_id INT, -- FK
    contract_start DATE,
    contract_end DATE,
    salary DECIMAL,
    bonus DECIMAL
);

CREATE TABLE REF_job (job_id INT, job_title VARCHAR(45));

INSERT INTO REF_job (job_id, job_title)
VALUES
    (1, 'Driver'),
    (2, 'Mechanic'),
    (3, 'Engineer'),
    (4, 'Pit Crew'),
    (5, 'Team Principal');

CREATE TABLE constructor (
    constructor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(45),
    year_founded INT,
    country_id VARCHAR(3),
    engine_manufacturer VARCHAR(45),
    constructor_budget DECIMAL
);


CREATE TABLE REF_countries (
    country_id VARCHAR(3),
    name VARCHAR(45)
);

INSERT INTO
    REF_countries (country_id, name)
VALUES
    ('AUS', 'Australia'),
    ('AUT', 'Austria'),
    ('BEL', 'Belgium'),
    ('BRA', 'Brazil'),
    ('CAN', 'Canada'),
    ('CHN', 'China'),
    ('FRA', 'France'),
    ('GER', 'Germany'),
    ('HUN', 'Hungary'),
    ('ITA', 'Italy'),
    ('JPN', 'Japan'),
    ('MEX', 'Mexico'),
    ('MON', 'Monaco'),
    ('NLD', 'Netherlands'),
    ('RUS', 'Russia'),
    ('SAU', 'Saudi Arabia'),
    ('SGP', 'Singapore'),
    ('ESP', 'Spain'),
    ('SWE', 'Sweden'),
    ('TUR', 'Turkey'),
    ('UAE', 'United Arab Emirates'),
    ('GBR', 'United Kingdom'),
    ('USA', 'United States of America');