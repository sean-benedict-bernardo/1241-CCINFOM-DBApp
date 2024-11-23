document.addEventListener('DOMContentLoaded', async () => {
    const raceSelect = document.getElementById('race_select');
    const constructorSelect = document.getElementById('constructor_select');
    const form = document.getElementById('constructor_participate_form');

    const fetchRaces = async () => {
        const response = await fetch('http://localhost:3000/race-list');
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

    try {
        const races = await fetchRaces();
        const constructors = await fetchConstructors();

        populateSelect(raceSelect, races, 'race_id', races.map(race => `${race.race_id} | ${race.track_location} ${race.race_season}`));
        populateSelect(constructorSelect, constructors, 'constructor_id', 'name');
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const raceId = raceSelect.value;
        const constructorId = constructorSelect.value;

        if (raceId && constructorId) {
            try {
                const response = await fetch(`http://localhost:3000/constructor-participates-championship`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ race_id: raceId, constructor_id: constructorId })
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.text);
                } else {
                    alert(result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while submitting the participation.');
            }
        }
    });
});