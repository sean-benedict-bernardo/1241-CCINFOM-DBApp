CREATE TABLE driver (
  driver_code VARCHAR(3) PRIMARY KEY,
  first_name VARCHAR(127),
  last_name VARCHAR(127),
  birth_year DATETIME,
  nationality VARCHAR(64),
  constructor_id INT, -- Foreign Key
  contract_id INT -- Foreign Key
);

CREATE TABLE constructor (
  constructor_id INT PRIMARY KEY,
  name VARCHAR(255),
  year_founded DATETIME,
  base_country VARCHAR(64),
  engine_manufacturer VARCHAR(64),
  constructor_budget FLOAT
);

CREATE TABLE race (
  race_id INT PRIMARY KEY,
  official_name VARCHAR(255),
  track_location VARCHAR(255),
  race_season INT,
  num_laps INT,
  race_status ENUM ("Scheduled", "Delayed", "Finished", "Abandoned"),
  prize_money FLOAT
);

CREATE TABLE race_stats (
  race_id INT PRIMARY KEY,
  driver_code VARCHAR(3),
  points_rewarded INT, -- ENUM(25, 18, 15, 12, 10, 8, 6, 4, 2, 1, 0)
  penalty INT DEFAULT 0,
  remarks VARCHAR(255) 
)



