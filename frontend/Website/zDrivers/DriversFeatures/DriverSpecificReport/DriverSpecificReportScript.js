document.addEventListener('DOMContentLoaded', async () => {
    const seasonSelect = document.getElementById('season_select');
    const driverSelect = document.getElementById('driver_select');
    const driverTableBody = document.querySelector('#driver_table tbody');

    const fetchSeasons = async () => {
        const response = await fetch('http://localhost:3000/seasons-list');
        return await response.json();
    };

    const fetchDrivers = async () => {
        const response = await fetch('http://localhost:3000/drivers-list');
        return await response.json();
    };

    const populateSelect = (selectElement, items, valueKey, textKey) => {
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueKey];
            option.textContent = item[textKey];
            selectElement.appendChild(option);
        });
    };

    const fetchDriverPerformance = async (driverCode, season) => {
        const response = await fetch(`http://localhost:3000/driver-performance?driver_code=${driverCode}&season=${season}`);
        return await response.json();
    };

    const displayDriverPerformance = (performance) => {
        driverTableBody.innerHTML = '';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${performance.full_name}</td>
            <td>${performance.constructor_name}</td>
            <td>${performance.total_points}</td>
            <td>${performance.average_position}</td>
            <td>${performance.total_laps_finished}</td>
            <td>${performance.wins}</td>
            <td>${performance.podiums}</td>
            <td>${performance.total_races}</td>
        `;
        driverTableBody.appendChild(row);
    };

    seasonSelect.addEventListener('change', async () => {
        const driverCode = driverSelect.value;
        const season = seasonSelect.value;
        if (driverCode && season) {
            const performance = await fetchDriverPerformance(driverCode, season);
            displayDriverPerformance(performance);
        }
    });

    driverSelect.addEventListener('change', async () => {
        const driverCode = driverSelect.value;
        const season = seasonSelect.value;
        if (driverCode && season) {
            const performance = await fetchDriverPerformance(driverCode, season);
            displayDriverPerformance(performance);
        }
    });

    try {
        const seasons = await fetchSeasons();
        populateSelect(seasonSelect, seasons, 'race_season', 'race_season');

        const drivers = await fetchDrivers();
        populateSelect(driverSelect, drivers, 'driver_code', 'first_name');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function goBack() {
    window.history.back();
}