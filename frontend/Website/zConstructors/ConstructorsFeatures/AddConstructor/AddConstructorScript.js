document.addEventListener('DOMContentLoaded', async () => {
    const countrySelect = document.getElementById('country_code');
    try {
        const response = await fetch('http://localhost:3000/country-list');
        const countries = await response.json();
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.country_id;
            option.textContent = country.name;
            countrySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching country list:', error);
    }
});

document.getElementById('add-constructor-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    console.log(data)

    try {
        const response = await fetch(`http://localhost:3000/add-constructor?name=${data.name}&year_founded=${data.year_founded}&country_id=${data.country_id}&engine_manufacturer=${data.engine_manufacturer}&constructor_budget=${data.constructor_budget}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.text);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the constructor.');
    }
});