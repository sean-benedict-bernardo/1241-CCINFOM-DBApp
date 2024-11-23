document.addEventListener('DOMContentLoaded', async () => {
    const driverSelect = document.getElementById('driver_select');
    const attributeSelect = document.getElementById('attribute_select');
    const currentValueInput = document.getElementById('current_value');
    const newValueInput = document.getElementById('new_value');
    const newValueSelect = document.getElementById('new_value_select');
    const form = document.getElementById('update_driver_form');

    const fetchDrivers = async () => {
        const response = await fetch('http://localhost:3000/drivers-list');
        return await response.json();
    };

    const fetchDriverDetails = async (driverCode) => {
        const response = await fetch(`http://localhost:3000/driver-details?driver_code=${driverCode}`);
        return await response.json();
    };

    const fetchCountries = async () => {
        const response = await fetch('http://localhost:3000/country-list');
        return await response.json();
    };

    const populateDriverSelect = (drivers) => {
        drivers.forEach(driver => {
            const option = document.createElement('option');
            option.value = driver.driver_code;
            option.textContent = `${driver.first_name} ${driver.last_name}`;
            driverSelect.appendChild(option);
        });
    };

    const populateCountrySelect = (countries) => {
        newValueSelect.innerHTML = '<option value="">Select a country</option>';
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.country_id;
            option.textContent = country.name;
            newValueSelect.appendChild(option);
        });
    };

    const updateForm = async () => {
    const selectedDriverCode = driverSelect.value;
    const selectedAttribute = attributeSelect.value;

    if (selectedDriverCode && selectedAttribute) {
        const driverDetails = await fetchDriverDetails(selectedDriverCode);
        let currentValue = driverDetails[selectedAttribute];

        if (selectedAttribute === 'birth_date') {
    currentValue = new Date(currentValue).toLocaleDateString('en-CA'); // Format the date to YYYY-MM-DD
}

        currentValueInput.value = currentValue;

        if (selectedAttribute === 'country_id') {
            newValueInput.style.display = 'none';
            newValueSelect.style.display = 'block';
            const countries = await fetchCountries();
            populateCountrySelect(countries);
        } else {
            newValueInput.style.display = 'block';
            newValueSelect.style.display = 'none';

            if (selectedAttribute === 'birth_date') {
                newValueInput.type = 'date';
            } else {
                newValueInput.type = 'text';
            }
        }
    } else {
        currentValueInput.value = '';
        newValueInput.style.display = 'block';
        newValueSelect.style.display = 'none';
        newValueInput.type = 'text';
    }
};

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const selectedDriverCode = driverSelect.value;
        const selectedAttribute = attributeSelect.value;
        const newValue = selectedAttribute === 'country_id' ? newValueSelect.value : newValueInput.value;

        if (selectedDriverCode && selectedAttribute && newValue) {
            try {
                const response = await fetch('http://localhost:3000/update-driver', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        driver_code: selectedDriverCode,
                        attribute: selectedAttribute,
                        new_value: newValue
                    })
                });

                const responseText = await response.text();
                try {
                    const result = JSON.parse(responseText);
                    if (response.ok) {
                        alert(result.text);
                        await updateForm(); // Update the current value after successful submission
                    } else {
                        alert(result.error);
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error, responseText);
                    alert('An error occurred while updating the driver.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the driver.');
            }
        }
    });

    try {
        const drivers = await fetchDrivers();
        populateDriverSelect(drivers);
    } catch (error) {
        console.error('Error fetching drivers:', error);
    }

    driverSelect.addEventListener('change', updateForm);
    attributeSelect.addEventListener('change', updateForm);
});

function goBack() {
    window.history.back();
}