document.addEventListener('DOMContentLoaded', async () => {
    const raceSelect = document.getElementById('race_select');
    const attributeSelect = document.getElementById('attribute_select');
    const currentValueInput = document.getElementById('current_value');
    const form = document.getElementById('update_race_form');

    const fetchRaces = async () => {
        const response = await fetch('http://localhost:3000/race-list');
        return await response.json();
    };

    const fetchRaceDetails = async (raceId) => {
        const response = await fetch(`http://localhost:3000/race-details?race_id=${raceId}`);
        return await response.json();
    };

    const populateRaceSelect = (races) => {
        races.forEach(race => {
            const option = document.createElement('option');
            option.value = race.race_id;
            option.textContent = race.race_name;
            raceSelect.appendChild(option);
        });
    };

    const updateForm = async () => {
        const selectedRaceId = raceSelect.value;
        const selectedAttribute = attributeSelect.value;

        if (selectedRaceId && selectedAttribute) {
            const raceDetails = await fetchRaceDetails(selectedRaceId);
            currentValueInput.value = raceDetails[selectedAttribute];
        } else {
            currentValueInput.value = '';
        }
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const selectedRaceId = raceSelect.value;
        const selectedAttribute = attributeSelect.value;
        const newValue = document.getElementById('new_value').value;

        if (selectedRaceId && selectedAttribute && newValue) {
            try {
                const response = await fetch('http://localhost:3000/update-race', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        race_id: selectedRaceId,
                        attribute: selectedAttribute,
                        new_value: newValue
                    })
                });

                const responseText = await response.text();
                try {
                    const result = JSON.parse(responseText);
                    if (response.ok) {
                        alert(result.text);
                    } else {
                        alert(result.error);
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error, responseText);
                    alert('An error occurred while updating the race.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the race.');
            }
        }
    });

    try {
        const races = await fetchRaces();
        populateRaceSelect(races);
    } catch (error) {
        console.error('Error fetching races:', error);
    }

    raceSelect.addEventListener('change', updateForm);
    attributeSelect.addEventListener('change', updateForm);
});

function goBack() {
    window.history.back();
}