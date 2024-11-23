document.addEventListener('DOMContentLoaded', async () => {
    const raceCountrySelect = document.getElementById('country_id');

    const fetchCountries = async () => {
        const response = await fetch('http://localhost:3000/country-list');
        return await response.json();
    };

    const populateCountrySelect = (countries) => {
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.country_id;
            option.textContent = country.name;
            raceCountrySelect.appendChild(option);
        });
    };

    try {
        const countries = await fetchCountries();
        populateCountrySelect(countries);
    } catch (error) {
        console.error('Error fetching country list:', error);
    }
});

document.getElementById('add-race-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`http://localhost:3000/add-race?race_name=${data.race_name}&track_location=${data.track_location}&country_code=${data.country_id}&race_season=${data.race_season}&num_laps=${data.num_laps}&race_status=${data.race_status}&prize_money=${data.prize_money}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const result = await response.json();
        alert(result.text);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the race.');
    }
});

function goBack() {
    window.history.back();
}