document.addEventListener('DOMContentLoaded', async () => {
    const raceSelect = document.getElementById('race_select');
    const raceTableBody = document.querySelector('#race_table tbody');

    const fetchRaces = async () => {
        const response = await fetch('http://localhost:3000/race-list');
        if (!response.ok) {
            throw new Error('Failed to fetch races');
        }
        return await response.json();
    };

    const fetchRaceDetails = async (raceId) => {
        const response = await fetch(`http://localhost:3000/race-details?race_id=${raceId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch race details');
        }
        return await response.json();
    };

    const populateTable = (races) => {
        raceTableBody.innerHTML = '';
        races.forEach(race => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${race.race_name}</td>
                <td>${race.track_location}</td>
                <td>${race.race_season}</td>
                <td>${race.num_laps}</td>
                <td>${race.race_status}</td>
                <td>${race.prize_money}</td>
            `;
            raceTableBody.appendChild(row);
        });
    };

    try {
        const races = await fetchRaces();
        if (!Array.isArray(races)) {
            throw new Error('Invalid data format');
        }

        races.forEach(race => {
            const option = document.createElement('option');
            option.value = race.race_id;
            option.textContent = race.race_name;
            raceSelect.appendChild(option);
        });

        // Populate table with all races initially
        populateTable(races);

        raceSelect.addEventListener('change', async () => {
            const selectedRaceId = raceSelect.value;
            if (selectedRaceId) {
                const raceDetails = await fetchRaceDetails(selectedRaceId);
                populateTable([raceDetails]);
            } else {
                populateTable(races);
            }
        });
    } catch (error) {
        console.error('Error fetching races:', error);
    }
});

function goBack() {
    window.history.back();
}