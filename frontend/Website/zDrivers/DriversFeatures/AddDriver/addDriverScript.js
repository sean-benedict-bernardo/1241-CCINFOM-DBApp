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

document.getElementById('add-driver-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`http://localhost:3000/add-driver?driver_code=${data.driver_code}&first_name=${data.first_name}&last_name=${data.last_name}&birth_date=${data.birth_date}&country_code=${data.country_code}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.text);
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the driver.');
    }
});