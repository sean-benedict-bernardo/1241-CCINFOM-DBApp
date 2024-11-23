document.addEventListener('DOMContentLoaded', async () => {
    const constructorSelect = document.getElementById('constructor_select');
    const attributeSelect = document.getElementById('attribute_select');
    const currentValueInput = document.getElementById('current_value');
    const newValueInput = document.getElementById('new_value');
    const newValueSelect = document.getElementById('new_value_select');
    const form = document.getElementById('update_constructor_form');

    const fetchConstructors = async () => {
        const response = await fetch('http://localhost:3000/constructors-list');
        return await response.json();
    };

    const fetchConstructorDetails = async (constructorId) => {
        const response = await fetch(`http://localhost:3000/constructor-details?constructor_id=${constructorId}`);
        return await response.json();
    };

    const fetchCountries = async () => {
        const response = await fetch('http://localhost:3000/country-list');
        return await response.json();
    };

    const populateConstructorSelect = (constructors) => {
        constructors.forEach(constructor => {
            const option = document.createElement('option');
            option.value = constructor.constructor_id;
            option.textContent = constructor.name;
            constructorSelect.appendChild(option);
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
        const selectedConstructorId = constructorSelect.value;
        const selectedAttribute = attributeSelect.value;

        if (selectedConstructorId && selectedAttribute) {
            const constructorDetails = await fetchConstructorDetails(selectedConstructorId);
            currentValueInput.value = constructorDetails[selectedAttribute];

            if (selectedAttribute === 'country_id') {
                newValueInput.style.display = 'none';
                newValueInput.required = false;
                newValueSelect.style.display = 'block';
                newValueSelect.required = true;
                const countries = await fetchCountries();
                populateCountrySelect(countries);
            } else {
                newValueInput.style.display = 'block';
                newValueInput.required = true;
                newValueSelect.style.display = 'none';
                newValueSelect.required = false;
            }
        } else {
            currentValueInput.value = '';
            newValueInput.style.display = 'block';
            newValueInput.required = true;
            newValueSelect.style.display = 'none';
            newValueSelect.required = false;
        }
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const selectedConstructorId = constructorSelect.value;
        const selectedAttribute = attributeSelect.value;
        const newValue = selectedAttribute === 'country_id' ? newValueSelect.value : newValueInput.value;

        if (selectedConstructorId && selectedAttribute && newValue) {
            try {
                const response = await fetch('http://localhost:3000/update-constructor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        constructor_id: selectedConstructorId,
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
                    alert('An error occurred while updating the constructor.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the constructor.');
            }
        }
    });

    try {
        const constructors = await fetchConstructors();
        populateConstructorSelect(constructors);
    } catch (error) {
        console.error('Error fetching constructors:', error);
    }

    constructorSelect.addEventListener('change', updateForm);
    attributeSelect.addEventListener('change', updateForm);
});