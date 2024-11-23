const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors'); // allows any web client to call this basically

const app = express()
app.use(cors())
const port = 3000

const pool = mysql.createPool({
    host: "localhost", user: "root", password: "NewPassword",
    database: 'dbrace', waitForConnections: true, connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0, enableKeepAlive: true, keepAliveInitialDelay: 0,
});

const validateQuery = (req, params = []) => {
    // if params is a single string, convert it to an array
    if (typeof params === 'string') params = [params]

    // returns false if any of the query parameters are missing
    for (let i = 1; i < params.length; i++) {
        if (!req.query[params[i]])
            return false;
    }

    return true;
}

app.get('/', async (req, res) => {
    res.send("I'm gonna blow up the moon!")
})

// View informations
app.post('/add-driver', async (req, res) => {
    // sample request
    // http://localhost:3000/register-driver?driver_code=VER&first_name=Max&last_name=Verstappen&birth_date=1997-09-30&nationality=Dutch&constructor_id=CONSTRUCTOR_ID&contract_id=CONTRACT_ID

    const performQuery = async (driver_code, first_name, last_name, birth_date, country_id) => {
        const conn = await pool.getConnection();
        try {
            const query1 = `
            INSERT INTO race_crew (first_name, last_name, job_id) VALUES ( '${first_name}', '${last_name}', '${country_id}');
            SET @race_crew_id = LAST_INSERT_ID();

            INSERT INTO driver_info (driver_code, birth_date, country_id, crew_id) VALUES ('${driver_code}', '${birth_date}', '${country_id}', @race_crew_id);
            `

        } catch (err) {
            return { error: "Driver cannot be registered!" }
        }
    }


    if (validateQuery(req, ['driver_code', 'first_name', 'last_name', 'birth_date', 'country_id'])) {
        const data = await performQuery(req.query.driver_code, req.query.first_name, req.query.last_name, req.query.birth_date, req.query.country_id);
        res.status((data.error) ? 404 : 200).send((data.error) ? "" : { text: req.query.first_name + ' ' + req.query.last_name + ' has been registered' })
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
})

app.get('/drivers-list', async (req, res) => {
    const performQuery = async () => {
        const conn = await pool.getConnection();
        try {
            const query = `
                    SELECT  rc.crew_id, rc.first_name, rc.last_name, di.birth_date, di.country_id
                    FROM driver_info di
                    JOIN race_crew ON rc.crew_id = di.crew_id
                    JOIN contract c ON c.contract_id = di.contract_id
                    JOIN constructor co ON co.constructor_id = c.constructor_id; `;
            const [rows] = await conn.query(query);
            return rows;
        } catch (err) {
            return { error: "Drivers cannot be retrieved!" }
        }
    }

    if (validateQuery(req)) {
        const data = await performQuery()
        res.status((data.error) ? 404 : 200).send(data)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
})

app.post('/add-constructor', async (req, res) => {
    // sample request
    // http://localhost:3000/register-constructor?name=Red%20Bull%20Racing&country_id=1&budget=1000000

    const performQuery = async (name, country_id, budget) => {
        const conn = await pool.getConnection();
        try {
            const query = `
            INSERT INTO constructor (name, country_id, budget) 
            VALUES('${name}', '${country_id}', ${budget}); `;
            await conn.query(query);
        } catch (err) {
            return { error: "Constructor cannot be registered!" }
        }

        if (validateQuery(req, ['name', 'country_id', 'budget'])) {
            res.status(200).send({ text: req.query.name + ' has been registered' })
        } else {
            res.status(404).send({ text: "Missing parameters" })
        }
    }
});

app.get('/constructors-list', async (req, res) => {
    const performQuery = async () => {
        const conn = await pool.getConnection();
        try {
            const query = `
                    SELECT  c.constructor_id, c.name, c.country_id
                    FROM    constructor c; `;
            const [rows] = await conn.query(query);
            return rows;
        } catch (err) {
            return { error: "Constructors cannot be retrieved!" }
        }
    }

    if (validateQuery(req)) {
        const data = await performQuery()
        res.status((data.error) ? 404 : 200).send(data)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

app.post('/add-race', async (req, res) => {
    const performQuery = async (race_name, track_location, country_id, race_season, num_laps, race_status, prize_money) => {
        const conn = await pool.getConnection();
        try {
            const query = `
            INSERT INTO race (race_name, track_location, country_id, race_season, num_laps, race_status, prize_money) 
            VALUES ('${race_name}', '${track_location}', '${country_id}', ${race_season}, ${num_laps}, '${race_status}', ${prize_money}); `;
            await conn.query(query);
            return { text: "Race was registered successfully" }
        } catch (err) {
            return { error: "Race cannot be registered!" }
        }
    }

    if (validateQuery(req, ['race_name', 'track_location', 'country_id', 'race_season', 'num_laps', 'race_status', 'prize_money'])) {
        const data = await performQuery(req.query.race_name, req.query.track_location, req.query.country_id, req.query.race_season, req.query.num_laps, req.query.race_status, req.query.prize_money)
        res.status((data.error) ? 404 : 200).send(data)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
})

app.get('/race-list', async (req, res) => {
    const performQuery = async (race_season) => {
        const conn = await pool.getConnection();
        try {
            const query = `
            SELECT r.race_id, r.name, r.track_location,
                r.country_id, r.race_season
            FROM    race r
            WHERE
            r.race_season = ${race_season}; `

            const [rows] = await conn.query(query);
            return rows;
        } catch (err) {
            return { error: "Race list cannot be retrieved!" }
        }
    }

    if (validateQuery(req, race_season)) {
        const data = await performQuery(req.params.race_season)
        res.status((data.error) ? 404 : 200).send(data)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

app.get('/country-list', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const query = `
                SELECT  country_id, name
                FROM    REF_countries; `;
        const [rows] = await conn.query(query);
        res.status(200).send(rows)
    } catch (err) {
        res.status(404).send({ text: "Countries cannot be retrieved!" })
    }
});

app.get('/race-details', async (req, res) => {
    const performQuery = async (race_id) => {
        const conn = await pool.getConnection();
        try {
            const query1 = `
            SELECT
            r.name,
                r.track_location,
                r.race_season,
                r.num_laps,
                r.race_status,
                r.prize_money
            FROM
                    race r
            WHERE
            r.race_id = ${race_id}; `

            const race_details = await conn.query(query1);
            let race_obj = race_details[0]

            const query2 = `
            SELECT
            d.position,
                d.driver_code,
                CONCAT(UPPER(d.last_name), ', ', d.first_name) AS driver_name
            FROM
                    race_stats rs
                    JOIN driver d ON rs.driver_code = d.driver_code
            WHERE
            rs.race_id = $ { raceId }
                ORDER BY
            FIELD(rs.position, "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19", "P20", "DNF"); `

            const positions = await conn.query(query2);
            race_obj.positions = positions;

            return race_obj;
        } catch (error) {
            return { error: "Race details cannot be retrieved" }
        }
    }


    if (validateQuery(req, 'race_id')) {
        const data = await performQuery(req.params.race_id)
        res.status((data.error) ? 404 : 200).send(data)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

// Transactions
app.post('/finalize-contract', async (req, res) => {
    const performQuery = async (crew_id, constructor_id, start_date, end_date, salary, bonus) => {
        const conn = await pool.getConnection();
        try {
            const query = `
            INSERT INTO
            contract (${crew_id}, ${constructor_id}, '${start_date}', '${end_date}', ${salary}, ${bonus})
            UPDATE
            constructor 
            SET budget = budget -
                (SELECT SUM(salary + bonus) 
                FROM contract 
                WHERE constructor_id = constructor.constructor_id) 
                WHERE constructor_id = ${constructor_id})
            AND budget >=
    (SELECT SUM(salary + bonus) 
                FROM contract 
                WHERE constructor_id = constructor.constructor_id); `

            await conn.query(query);
            // return this if the query is successful
            return { text: "Contract finalized!" };
        } catch (err) {
            return { error: "Contract cannot be finalized!" }
        }
    }

    if (validateQuery(req, ['crew_id', 'constructor_id', 'start_date', 'end_date', 'salary', 'bonus'])) {
        const data = await performQuery(req.query.crew_id, req.query.constructor_id, req.query.start_date, req.query.end_date, req.query.salary, req.query.bonus)
        res.status((data.error) ? 404 : 200).send((data.error) ? data : { text: "Contract finalized!" })
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

// race winnings are done here as well
app.post('/drivers-participate-race', async (req, res) => {

    // what should be sent is an entire array of driver codes
    const performQuery = async (race_id, resultsList) => {
        const conn = await pool.getConnection();
        try {
            const query = `
            INSERT INTO race_stats(race_id, driver_code, position) 
            VALUES ${resultsList.map((result) => `(${race_id}, '${result.driver_code}', '${result.position}')`).join(', ')};

            UPDATE race r
            SET r.status = 'Finished'
            WHERE r.race_id = ${race_id};`;
            const [rows] = await conn.query(query);
            return rows;
        } catch (err) {
            return { error: "Error with encoding race results" }
        }
    }

    if (validateQuery(req, ['race_id', 'resultsList'])) {
        const data = await performQuery(req.params.race_id, req.params.resultsList)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

app.post('/constructor-participates-championship', async (req, res) => {
    const performQuery = async (constructor_id, season) => {
        const conn = await pool.getConnection();
        try {
            const query1 = `
SELECT
SUM(pa.points) AS total_points
                FROM REF_points_awarded pa
                JOIN race_stats rs ON pa.position = rs.position
                JOIN driver_info di ON rs.driver_id = di.driver_id
                JOIN race r ON rs.race_id = r.race_id 
                JOIN race_crew rc ON di.crew_id = rc.crew_id
                JOIN constructor c ON rc.constructor_id = c.constructor_id
                WHERE r.race_season = ${season} AND constructor_id = ${constructor_id};
                ORDER BY total_points DESC; `

            const [results] = await conn.query(query1);

            // find index of the constructor in the results
            const constructorIndex = results.findIndex((result) => result.constructor_id === constructor_id);

            const new_budget = constructorIndex * 1000000;
            const query2 = `
                    UPDATE  constructor
                    SET     constructor_budget = ${new_budget}
                    WHERE   constructor_id = ${constructor_id};
                    UPDATE race_crew rc
                    JOIN constructor c ON rc.constructor_id = c.constructor_id
                    SET rc.salary = rc.salary + ${bonus}
                    WHERE constructor_id = ${constructor_id}
`
            await conn.query(query2);

            return { text: "Constructor budgets have been updated!" };
        } catch (err) { }
    }

    if (validateQuery(req, ['constructor_id', 'season'])) {
        const data = await performQuery(req.params.constructor_id, req.params.season)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});


// Reports

app.get('/driver-perfromance', async (req, res) => {
    const performQuery = async (driverCode) => {
        const conn = await pool.getConnection();
        try {
            const query = `
SELECT
CONCAT(rc.first_name, ' ', rc.last_name) AS full_name,
    ctry.country_name, c.name AS constructor_name,
        SUM(pa.points_scored) AS total_points,
            AVG(rs.position) AS average_position,
                SUM(rs.laps_completed) AS total_laps_finished,
                    SUM(rs.position = 'P1') AS wins,
                        SUM(rs.position IN('P1', 'P2', 'P3')) AS podiums,
                            COUNT(*) AS total_races,
                                SUM(
                                    CASE WHEN rs.position < (SELECT MIN(rs2.position) FROM race_stats rs2 
                JOIN 
                driver_info di2 ON rs2.driver_code = di2.driver_code 
                WHERE 
                rs2.race_id = rs.race_id AND di2.crew_id != di.crew_id AND di2.constructor_id = c.constructor_id) THEN 1 ELSE 0 END) AS higher_position_than_teammate
FROM 
                REF_points_awarded pa
JOIN 
                race_stats rs ON pa.position = rs.position
JOIN 
                driver_info di ON rs.driver_code = di.driver_code
JOIN 
                race r ON rs.race_id = r.race_id
JOIN 
                race_crew rc ON di.crew_id = rc.crew_id
JOIN 
                contract ct ON rc.crew_id = ct.crew_id
JOIN 
                constructor c ON ct.constructor_id = c.constructor_id
WHERE
rs.position != 'DNF' 
                GROUP BY
di.driver_code, rc.first_name, rc.last_name, ctry.country_name, c.name;
`;
            const [rows] = await conn.query(query);
            return rows;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
});

app.get('/constructor-performance', async (req, res) => {
    const performQuery = async (constructorId) => {
        const conn = await pool.getConnection();
        try {
            const query = `
SELECT
c.name,
    SUM(rs.points) AS total_points,
        SUM(
            CASE
                    WHEN rs.podium_finish = 'P1' THEN 1
                    ELSE 0
                    END
        ) AS num_wins,
            SUM(
                CASE
                    WHEN rs.podium_finish IN('P1', 'P2', 'P3') THEN 1
                    ELSE 0
                    END
            ) AS num_podiums,
                SUM(rs.laps_completed) AS total_laps,
                    AVG(
                        CASE
                    WHEN rs.podium_finish = 'P1' THEN 1
                    WHEN rs.podium_finish = 'P2' THEN 2
                    WHEN rs.podium_finish = 'P3' THEN 3
                    WHEN rs.podium_finish = 'P4' THEN 4
                    WHEN rs.podium_finish = 'P5' THEN 5
                    WHEN rs.podium_finish = 'P6' THEN 6
                    WHEN rs.podium_finish = 'P7' THEN 7
                    WHEN rs.podium_finish = 'P8' THEN 8
                    WHEN rs.podium_finish = 'P9' THEN 9
                    WHEN rs.podium_finish = 'P10' THEN 10
                    WHEN rs.podium_finish = 'P11' THEN 11
                    WHEN rs.podium_finish = 'P12' THEN 12
                    WHEN rs.podium_finish = 'P13' THEN 13
                    WHEN rs.podium_finish = 'P14' THEN 14
                    WHEN rs.podium_finish = 'P15' THEN 15
                    WHEN rs.podium_finish = 'P16' THEN 16
                    WHEN rs.podium_finish = 'P17' THEN 17
                    WHEN rs.podium_finish = 'P18' THEN 18
                    WHEN rs.podium_finish = 'P19' THEN 19
                    WHEN rs.podium_finish = 'P20' THEN 20
                    ELSE 21
                    END
                    ) AS avg_finish_position
FROM
                    constructor c
                    JOIN driver d ON c.constructor_id = d.constructor_id
                    JOIN race_stats rs ON d.driver_code = rs.driver_code
                    JOIN race r ON rs.race_id = r.race_id
                    AND r.season = $ { 2024 }
                    GROUP BY
c.constructor_id
                    ORDER BY
                    total_points DESC;
`
            const [rows] = await conn.query(query);
            return rows;
        } catch (err) {
        }
    }
});

app.get('/driver-championship', async (req, res) => {
    const performQuery = async (season) => {
        const conn = await pool.getConnection();
        try {
            const query = `
            SELECT CONCAT(rc.first_name, ', ', rc.last_name) AS full_name, ctry.country_name, c.name, SUM(pa.points_scored) AS total_points
            FROM REF_points_awarded pa
            JOIN race_stats rs ON pa.position = rs.position
            JOIN driver_info di ON rs.driver_code = di.driver_code
            JOIN REF_country ctry ON di.country_id = ctry.country_id
            JOIN race r ON rs.race_id = r.race_id 
            JOIN race_crew rc ON di.crew_id = rc.crew_id
            JOIN constructor c ON rc.constructor_id = c.constructor_id
            WHERE r.year = ${season}
            GROUP BY driver_code
            ORDER BY total_points DESC; `

            const [rows] = await conn.query(query);
            return rows;
        } catch (err) { }
    }

    if (validateQuery(req, ['season'])) {
        const data = await performQuery(req.params.season)
        res.status((data.error) ? 404 : 200).send(data)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

app.get('/constructor-championship', async (req, res) => {
    const performQuery = async (season) => {
        const conn = await pool.getConnection();
        try {
            const query = `
            SELECT c.constructor_id, c.name, SUM(pa.points_scored) AS total_points
            FROM REF_points_awarded pa
            JOIN race_stats rs ON pa.position = rs.position
            JOIN driver_info di ON rs.driver_code = di.driver_code
            JOIN race r ON rs.race_id = r.race_id 
            JOIN race_crew rc ON di.crew_id = rc.crew_id
            JOIN constructor c ON rc.constructor_id = c.constructor_id
            WHERE r.year = ${season}
            GROUP BY constructor_id
            ORDER BY total_points DESC; `

            const [rows] = await conn.query(query);
            return rows;
        } catch (err) { }
    }

    if (validateQuery(req, ['season'])) {
        const data = await performQuery(req.params.season)
        res.status((data.error) ? 404 : 200).send(data)
    } else {
        res.status(404).send({ text: "Missing parameters" })
    }
});

// Server loop basically
app.listen(port, () => {
    console.log(`FormulaDB is listening on port ${port} `)
})