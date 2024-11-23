document.addEventListener('DOMContentLoaded', async () => {
    const constructorSelect = document.getElementById('constructor_select');
    const constructorTableBody = document.querySelector('#constructor_table tbody');

    const fetchConstructors = async () => {
        const response = await fetch('http://localhost:3000/constructors-list');
        return await response.json();
    };

    const populateTable = (constructors) => {
        constructorTableBody.innerHTML = '';
        constructors.forEach(constructor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${constructor.name}</td>
                <td>${constructor.year_founded}</td>
                <td>${constructor.country_id}</td>
                <td>${constructor.engine_manufacturer}</td>
                <td>${constructor.constructor_budget}</td>
            `;
            constructorTableBody.appendChild(row);
        });
    };

    try {
        const constructors = await fetchConstructors();

        constructors.forEach(constructor => {
            const option = document.createElement('option');
            option.value = constructor.constructor_id;
            option.textContent = constructor.name;
            constructorSelect.appendChild(option);
        });

        // Populate table with all constructors initially
        populateTable(constructors);

        constructorSelect.addEventListener('change', async () => {
            const selectedConstructorId = constructorSelect.value;
            if (selectedConstructorId) {
                const constructorResponse = await fetch(`http://localhost:3000/constructor-details?constructor_id=${selectedConstructorId}`);
                const responseText = await constructorResponse.text(); // Get response as text
                try {
                    const constructorDetails = JSON.parse(responseText); // Parse JSON
                    populateTable([constructorDetails]);
                } catch (error) {
                    console.error('Error parsing JSON:', error, responseText); // Log error and response text
                }
            } else {
                populateTable(constructors);
            }
        });
    } catch (error) {
        console.error('Error fetching constructors:', error);
    }
});