document.addEventListener('DOMContentLoaded', async () => {
    const raceSelect = document.getElementById('race_select');
    const driverSelect = document.getElementById('driver_select');
    const form = document.getElementById('driver_participate_form');

    const fetchRaces = async () => {
        const response = await fetch('http://localhost:3000/race-list');
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

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const raceId = raceSelect.value;
        const driverCode = driverSelect.value;
        const position = document.getElementById('position').value;
        const penaltyPoints = document.getElementById('penalty_points').value;
        let remarks = document.getElementById('remarks').value;
        remarks = (remarks == "") ? "Clean Race" : remarks;

        if (raceId && driverCode && position && penaltyPoints) {
            try {
                const response = await fetch(`http://localhost:3000/driver-participates-race?race_id=${raceId}&driver_code=${driverCode}&position=${position}&penalty=${penaltyPoints}&remarks=${remarks}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
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
                    alert('An error occurred while updating the participation.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the participation.');
            }
        }
    });

    try {
        const races = await fetchRaces();
        populateSelect(raceSelect, races, 'race_id', 'race_name');

        const drivers = await fetchDrivers();
        populateSelect(driverSelect, drivers, 'driver_code', 'first_name');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function goBack() {
    window.history.back();
}