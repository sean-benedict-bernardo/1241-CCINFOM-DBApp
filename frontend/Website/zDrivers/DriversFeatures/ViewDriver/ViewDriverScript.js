document.addEventListener('DOMContentLoaded', async () => {
    const driverSelect = document.getElementById('driver_select');
    const driverTableBody = document.querySelector('#driver_table tbody');

    const fetchDrivers = async () => {
        const response = await fetch('http://localhost:3000/drivers-list');
        return await response.json();
    };

    const populateTable = (drivers) => {
        driverTableBody.innerHTML = '';
        drivers.forEach(driver => {
            const row = document.createElement('tr');
            const birthDate = new Date(driver.birth_date).toLocaleDateString('en-CA');
            row.innerHTML = `
                <td>${driver.first_name}</td>
                <td>${driver.last_name}</td>
                <td>${birthDate}</td>
                <td>${driver.country_id}</td>
                <td>${driver.driver_code}</td>
            `;
            driverTableBody.appendChild(row);
        });
    };

    try {
        const drivers = await fetchDrivers();

        drivers.forEach(driver => {
            const option = document.createElement('option');
            option.value = driver.driver_code;
            option.textContent = `${driver.first_name} ${driver.last_name}`;
            driverSelect.appendChild(option);
        });

        // Populate table with all drivers initially
        populateTable(drivers);

        driverSelect.addEventListener('change', async () => {
            const selectedDriverCode = driverSelect.value;
            if (selectedDriverCode) {
                const driverResponse = await fetch(`http://localhost:3000/driver-details?driver_code=${selectedDriverCode}`);
                const responseText = await driverResponse.text(); // Get response as text
                try {
                    const driverDetails = JSON.parse(responseText); // Parse JSON
                    populateTable([driverDetails]);
                } catch (error) {
                    console.error('Error parsing JSON:', error, responseText); // Log error and response text
                }
            } else {
                populateTable(drivers);
            }
        });
    } catch (error) {
        console.error('Error fetching drivers:', error);
    }
});