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

INSERT INTO 
	race_crew (last_name, first_name, job_id) 
VALUES
	('Hamilton', 'Lewis', 1),
	('Russell', 'George', 1),
	('Verstappen', 'Max', 1),
	('Pérez', 'Sergio', 1),
	('Leclerc', 'Charles', 1),
	('Sainz', 'Carlos', 1),
	('Norris', 'Lando', 1),
	('Piastri', 'Oscar', 1),
	('Alonso', 'Fernando', 1),
	('Stroll', 'Lance', 1),
	('Gasly', 'Pierre', 1),
	('Ocon', 'Esteban', 1),
	('Tsunoda', 'Yuki', 1),
	('Ricciardo', 'Daniel', 1),
	('Hülkenberg', 'Nico', 1),
	('Magnussen', 'Kevin', 1),
	('Bottas', 'Valtteri', 1),
	('Zhou', 'Guanyu', 1),
	('Albon', 'Alex', 1),
	('Sargeant', 'Logan', 1),
	('Wolff', 'Toto', 5), 
	('Horner', 'Christian', 5), 
	('Vasseur', 'Frédéric', 5), 
	('Seidl', 'Andreas', 5),
	('Krack', 'Mike', 5), 
	('Szafnauer', 'Otmar', 5), 
	('Tost', 'Franz', 5), 
	('Alunni Bravi', 'Alessandro', 5), 
	('Steiner', 'Guenther', 5), 
	('Vowles', 'James', 5),
	('Lambiase', 'Gianpiero', 3),
	('Bird', 'Hugh', 3),
	('Bonnington', 'Peter', 3),
	('Dudley', 'Marcus', 3),
	('Bozzi', 'Bryan', 3),
	('Adami', 'Riccardo', 3),
	('Joseph', 'William', 3),
	('Stallard', 'Tom', 3),
	('Cronin', 'Chris', 3),
	('Michell', 'Ben', 3),
	('Howard', 'John', 3),
	('Peckett', 'Josh', 3),
	('Urwin', 'James', 3),
	('Jago', 'Gaetan', 3),
	('Desiderio', 'Ernesto', 3),
	('Hamelin', 'Pierre', 3),
	('Petrik', 'Steven', 3),
	('Bensini', 'Andrea', 3),
	('Slade', 'Mark', 3),
	('Gannon', 'Gary', 3);
    
INSERT INTO 
	driver_info (driver_code, birth_date, country_id, crew_ID) 
VALUES 
('HAM', '1985-01-07', 'GBR', 1), 
('RUS', '1998-02-15', 'GBR', 2),
('VER', '1997-09-30', 'NLD', 3), 
('PER', '1997-01-26', 'MEX', 4), 
('LEC', '1997-10-16', 'MCO', 5), 
('SAI', '1994-09-01', 'ESP', 6),
('NOR', '1999-11-13', 'GBR', 7), 
('PIA', '2001-04-06', 'AUS', 8), 
('ALO', '1981-07-29', 'ESP', 9),
('STR', '1998-10-29', 'CAN', 10),
('GAS', '1996-02-07', 'FRA', 11),
('OCO', '1996-09-17', 'FRA', 12),
('TSU', '2000-05-11', 'JAP', 13),
('RIC', '1989-07-01', 'AUS', 14),
('HUL', '1987-08-19', 'GER', 15),
('MAG', '1992-10-05', 'DEN', 16), 
('BOT', '1989-08-28', 'FIN', 17), 
('ZHO', '1999-05-30', 'CHN', 18), 
('ALB', '1996-03-23', 'THA', 19), 
('SAR', '2000-12-31', 'USA', 20);

INSERT INTO 
	constructor (name, year_founded, country_id, engine_manufacturer, constructor_budget) 
VALUES 
('Ferrari', '1929', 'ITA', 'Ferrari', 10000000), 
('Mercedes', '1926', 'DEU', 'Mercedes', 12000000), 
('Red Bull Racing', '2005', 'AUT', 'Honda', 15000000), 
('McLaren', '1963', 'GBR', 'Mercedes', 13000000), 
('Alpine', '2021', 'FRA', 'Renault', 11000000), 
('Aston Martin', '2009', 'GBR', 'Mercedes', 9000000), 
('Williams', '1977', 'GBR', 'Mercedes', 8000000), 
('AlphaTauri', '2006', 'ITA', 'Honda', 8500000),
('Sauber', '1993', 'ITA', 'Ferrari', 7500000),
('Haas', '2016', 'USA', 'Ferrari', 7000000);

INSERT INTO contract (constructor_id, crew_id, contract_start, contract_end, salary, bonus) VALUES
(2, 1, '2023-01-01', '2025-12-31', 50000000, 5000000),
(2, 2, '2023-01-01', '2025-12-31', 40000000, 4000000),
(3, 3, '2023-01-01', '2024-12-31', 60000000, 6000000),
(3, 4, '2023-01-01', '2024-12-31', 30000000, 3000000),
(1, 5, '2023-01-01', '2024-12-31', 45000000, 4500000),
(1, 6, '2023-01-01', '2024-12-31', 40000000, 4000000),
(4, 7, '2023-01-01', '2025-12-31', 35000000, 3500000),
(4, 8, '2023-01-01', '2025-12-31', 20000000, 2000000),
(6, 9, '2023-01-01', '2024-12-31', 38000000, 3800000),
(6, 10, '2023-01-01', '2024-12-31', 30000000, 3000000),
(5, 11, '2023-01-01', '2024-12-31', 30000000, 3000000),
(5, 12, '2023-01-01', '2024-12-31', 25000000, 2500000),
(8, 13, '2023-01-01', '2024-12-31', 20000000, 2000000),
(8, 14, '2023-01-01', '2024-12-31', 18000000, 1800000),
(9, 17, '2023-01-01', '2024-12-31', 17000000, 1700000),
(9, 18, '2023-01-01', '2024-12-31', 15000000, 1500000),
(7, 19, '2023-01-01', '2024-12-31', 16000000, 1600000),
(7, 20, '2023-01-01', '2024-12-31', 14000000, 1400000);

INSERT INTO 
race (race_name, track_location, country_id, race_season, num_laps, race_status, prize_money) 
VALUES 
('Australian Grand Prix', 'Melbourne', 'AUS', 2024, 58, 'Scheduled', 10000000),
('Bahrain Grand Prix', 'Sakhir', 'BHR', 2024, 57, 'Scheduled', 9500000),
('Saudi Arabian Grand Prix', 'Jeddah', 'SAU', 2024, 50, 'Scheduled', 9000000),
('Chinese Grand Prix', 'Shanghai', 'CHN', 2024, 56, 'Scheduled', 9800000),
('Azerbaijan Grand Prix', 'Baku', 'AZE', 2024, 51, 'Scheduled', 10500000),
('Spanish Grand Prix', 'Barcelona', 'ESP', 2024, 66, 'Scheduled', 11000000),
('Monaco Grand Prix', 'Monaco', 'MCO', 2024, 78, 'Scheduled', 15000000),
('Canadian Grand Prix', 'Montreal', 'CAN', 2024, 70, 'Scheduled', 9500000),
('Austrian Grand Prix', 'Spielberg', 'AUT', 2024, 71, 'Scheduled', 10000000),
('British Grand Prix', 'Silverstone', 'GBR', 2024, 52, 'Scheduled', 11000000),
('Hungarian Grand Prix', 'Budapest', 'HUN', 2024, 70, 'Scheduled', 9500000),
('Belgian Grand Prix', 'Spa-Francorchamps', 'BEL', 2024, 44, 'Scheduled', 9700000),
('Dutch Grand Prix', 'Zandvoort', 'NLD', 2024, 72, 'Scheduled', 9200000),
('Italian Grand Prix', 'Monza', 'ITA', 2024, 53, 'Scheduled', 10500000),
('Singapore Grand Prix', 'Singapore', 'SGP', 2024, 61, 'Scheduled', 10000000),
('Japanese Grand Prix', 'Suzuka', 'JPN', 2024, 53, 'Scheduled', 9800000),
('United States Grand Prix', 'Austin', 'USA', 2024, 56, 'Scheduled', 9200000),
('Mexican Grand Prix', 'Mexico City', 'MEX', 2024, 71, 'Scheduled', 9000000),
('Brazilian Grand Prix', 'Sao Paulo', 'BRA', 2024, 71, 'Scheduled', 9500000),
('Las Vegas Grand Prix', 'Las Vegas', 'USA', 2024, 50, 'Scheduled', 10500000),
('Abu Dhabi Grand Prix', 'Abu Dhabi', 'ARE', 2024, 58, 'Scheduled', 12000000),
('Qatar Grand Prix', 'Doha', 'QAT', 2024, 57, 'Scheduled', 10000000),
('Philippine Grand Prix', 'Oriental', 'PHL', 2024, 57, 'Scheduled', 10000000),
('Australian Grand Prix', 'Melbourne', 'AUS', 2023, 58, 'Finished', 10000000), 
('Bahrain Grand Prix', 'Sakhir', 'BHR', 2023, 57, 'Finished', 9500000), 
('Saudi Arabian Grand Prix', 'Jeddah', 'SAU', 2023, 50, 'Finished', 9000000), 
('Miami Grand Prix', 'Miami', 'USA', 2023, 56, 'Finished', 9800000), 
('Azerbaijan Grand Prix', 'Baku', 'AZE', 2023, 51, 'Finished', 10500000), 
('Spanish Grand Prix', 'Barcelona', 'ESP', 2023, 66, 'Finished', 11000000), 
('Monaco Grand Prix', 'Monaco', 'MCO', 2023, 78, 'Finished', 15000000), 
('Canadian Grand Prix', 'Montreal', 'CAN', 2023, 70, 'Finished', 9500000), 
('Austrian Grand Prix', 'Spielberg', 'AUT', 2023, 71, 'Finished', 10000000), 
('British Grand Prix', 'Silverstone', 'GBR', 2023, 52, 'Finished', 11000000), 
('Hungarian Grand Prix', 'Budapest', 'HUN', 2023, 70, 'Finished', 9500000), 
('Belgian Grand Prix', 'Spa-Francorchamps', 'BEL', 2023, 44, 'Finished', 9700000), 
('Dutch Grand Prix', 'Zandvoort', 'NLD', 2023, 72, 'Finished', 9200000), 
('Italian Grand Prix', 'Monza', 'ITA', 2023, 53, 'Finished', 10500000), 
('Singapore Grand Prix', 'Singapore', 'SGP', 2023, 61, 'Finished', 10000000), 
('Japanese Grand Prix', 'Suzuka', 'JPN', 2023, 53, 'Finished', 9800000), 
('United States Grand Prix', 'Austin', 'USA', 2023, 56, 'Finished', 9200000), 
('Mexican Grand Prix', 'Mexico City', 'MEX', 2023, 71, 'Finished', 9000000), 
('Brazilian Grand Prix', 'Sao Paulo', 'BRA', 2023, 71, 'Finished', 9500000), 
('Las Vegas Grand Prix', 'Las Vegas', 'USA', 2023, 50, 'Finished', 10500000), 
('Abu Dhabi Grand Prix', 'Abu Dhabi', 'ARE', 2023, 58, 'Finished', 12000000), 
('Qatar Grand Prix', 'Doha', 'QAT', 2023, 57, 'Finished', 10000000), 
('Emilia Romagna Grand Prix', 'Imola', 'ITA', 2023, 55, 'Abandoned', 10000000);


INSERT INTO race_stats (race_id, driver_code, position, penalty, remarks) 
VALUES
    (1, 'VER', 'P1', 0, 'Clean Race'),
    (1, 'PER', 'P2', 0, 'Clean Race'),
    (1, 'ALO', 'P3', 0, 'Clean Race'),
    (1, 'HAM', 'P4', 5, 'Track Limits Violation'),
    (1, 'LEC', 'P5', 0, 'Clean Race'),
    (1, 'RUS', 'P6', 10, 'Unsafe Release in Pit Lane'),
    (1, 'SAI', 'P7', 0, 'Clean Race'),
    (1, 'NOR', 'P8', 0, 'Clean Race'),
    (1, 'PIA', 'P9', 0, 'Clean Race'),
    (1, 'GAS', 'P10', 0, 'Clean Race'),
    (1, 'OCO', 'P11', 0, 'Clean Race'),
    (1, 'BOT', 'P12', 0, 'Clean Race'),
    (1, 'ZHO', 'P13', 0, 'Clean Race'),
    (1, 'MAG', 'P14', 0, 'Clean Race'),
    (1, 'HUL', 'P15', 0, 'Clean Race'),
    (1, 'TSU', 'P16', 5, 'Collision with Another Driver'),
    (1, 'RIC', 'P17', 0, 'Clean Race'),
    (1, 'ALB', 'P18', 0, 'Clean Race'),
    (1, 'SAR', 'P19', 0, 'Clean Race'),
    (1, 'STR', 'DNF', 0, 'Mechanical Failure'),
    (2, 'VER', 'P1', 0, 'Clean Race'),
    (2, 'PER', 'P2', 0, 'Clean Race'),
    (2, 'LEC', 'P3', 0, 'Clean Race'),
    (2, 'ALO', 'P4', 0, 'Clean Race'),
    (2, 'HAM', 'P5', 5, 'Track Limits Violation'),
    (2, 'RUS', 'P6', 0, 'Clean Race'),
    (2, 'NOR', 'P7', 0, 'Clean Race'),
    (2, 'PIA', 'P8', 0, 'Clean Race'),
    (2, 'SAI', 'P9', 0, 'Clean Race'),
    (2, 'OCO', 'P10', 5, 'Speeding in Pit Lane'),
    (2, 'GAS', 'P11', 0, 'Clean Race'),
    (2, 'BOT', 'P12', 0, 'Clean Race'),
    (2, 'ZHO', 'P13', 0, 'Clean Race'),
    (2, 'ALB', 'P14', 0, 'Clean Race'),
    (2, 'HUL', 'P15', 0, 'Clean Race'),
    (2, 'MAG', 'P16', 0, 'Clean Race'),
    (2, 'TSU', 'P17', 0, 'Clean Race'),
    (2, 'RIC', 'P18', 0, 'Clean Race'),
    (2, 'SAR', 'P19', 0, 'Clean Race'),
    (2, 'STR', 'DNF', 0, 'Collision with Another Driver');