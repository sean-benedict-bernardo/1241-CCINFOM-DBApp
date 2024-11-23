document.addEventListener('DOMContentLoaded', async () => {
    const seasonSelect = document.getElementById('season_select');
    const constructorSelect = document.getElementById('constructor_select');
    const constructorTableBody = document.querySelector('#constructor_table tbody');

    const fetchSeasons = async () => {
        const response = await fetch('http://localhost:3000/seasons-list');
        return await response.json();
    };

    const fetchConstructors = async () => {
        const response = await fetch('http://localhost:3000/constructors-list');
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

    const fetchConstructorPerformance = async (constructorId, season) => {
        const response = await fetch(`http://localhost:3000/constructor-performance?constructor_id=${constructorId}&season=${season}`);
        return await response.json();
    };

    const displayConstructorPerformance = (performance) => {
        constructorTableBody.innerHTML = '';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${performance.name}</td>
            <td>${performance.total_points}</td>
            <td>${performance.avg_finish_position}</td>
            <td>${performance.total_laps}</td>
            <td>${performance.num_wins}</td>
            <td>${performance.num_podiums}</td>
            <td>${performance.num_races}</td>
        `;
        constructorTableBody.appendChild(row);
    };

    seasonSelect.addEventListener('change', async () => {
        const constructorId = constructorSelect.value;
        const season = seasonSelect.value;
        if (constructorId && season) {
            const performance = await fetchConstructorPerformance(constructorId, season);
            displayConstructorPerformance(performance);
        }
    });

    constructorSelect.addEventListener('change', async () => {
        const constructorId = constructorSelect.value;
        const season = seasonSelect.value;
        if (constructorId && season) {
            const performance = await fetchConstructorPerformance(constructorId, season);
            displayConstructorPerformance(performance);
        }
    });

    try {
        const seasons = await fetchSeasons();
        populateSelect(seasonSelect, seasons, 'race_season', 'race_season');

        const constructors = await fetchConstructors();
        populateSelect(constructorSelect, constructors, 'constructor_id', 'name');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function goBack() {
    window.history.back();
}