document.addEventListener('DOMContentLoaded', async () => {
    const seasonSelect = document.getElementById('season_select');
    const constructorTableBody = document.querySelector('#constructor_table tbody');

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

    const fetchConstructorChampionship = async (season) => {
        const response = await fetch(`http://localhost:3000/constructor-championship?season=${season}`);
        return response.json();
    };

    const displayConstructorChampionship = (constructors) => {
        constructorTableBody.innerHTML = '';

        constructors.forEach(constructor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${constructor.name}</td>
                <td>${constructor.total_points}</td>
            `;
            constructorTableBody.appendChild(row);
        });
    };

    seasonSelect.addEventListener('change', async () => {
        const season = seasonSelect.value;
        if (season) {
            const constructors = await fetchConstructorChampionship(season);
            displayConstructorChampionship(constructors);
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