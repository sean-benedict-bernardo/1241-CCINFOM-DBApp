document.addEventListener('DOMContentLoaded', async () => {
    const seasonSelect = document.getElementById('season_select');
    const driverTableBody = document.querySelector('#driver_table tbody');

    const fetchSeasons = async () => {
        const response = await fetch('http://localhost:3000/seasons-list');
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

    const fetchDriverChampionship = async (season) => {
        const response = await fetch(`http://localhost:3000/driver-championship?season=${season}`);
        return await response.json();
    };

    const displayDriverChampionship = (drivers) => {
        driverTableBody.innerHTML = '';
        drivers.forEach(driver => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${driver.driver_code}</td>
                <td>${driver.full_name}</td>
                <td>${driver.team}</td>
                <td>${driver.country}</td>
                <td>${driver.total_points}</td>
            `;
            driverTableBody.appendChild(row);
        });
    };

    seasonSelect.addEventListener('change', async () => {
        const season = seasonSelect.value;
        if (season) {
            const drivers = await fetchDriverChampionship(season);
            displayDriverChampionship(drivers);
        }
    });

    try {
        const seasons = await fetchSeasons();
        populateSelect(seasonSelect, seasons, 'race_season', 'race_season');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function goBack() {
    window.history.back();
}