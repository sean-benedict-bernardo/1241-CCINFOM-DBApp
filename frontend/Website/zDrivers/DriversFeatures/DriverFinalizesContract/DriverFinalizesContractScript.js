document.addEventListener('DOMContentLoaded', async () => {
    const driverSelect = document.getElementById('driver_select');
    const constructorSelect = document.getElementById('constructor_select');
    const form = document.getElementById('finalize_contract_form');

    const fetchDrivers = async () => {
        const response = await fetch('http://localhost:3000/drivers-list');
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

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const driverCode = driverSelect.value;
        const constructorId = constructorSelect.value;
        const currentSalary = document.getElementById('current_salary').value;
        const startDate = document.getElementById('start_date').value;
        const endDate = document.getElementById('end_date').value;
        const bonus = document.getElementById('bonus').value;

        if (driverCode && constructorId && currentSalary && startDate && endDate && bonus) {
            try {
                const response = await fetch(`http://localhost:3000/finalize-contract?driver_code=${driverCode}&constructor_id=${constructorId}&current_salary=${currentSalary}&start_date=${startDate}&end_date=${endDate}&bonus=${bonus}`, {
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
                    alert('An error occurred while finalizing the contract.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while finalizing the contract.');
            }
        }
    });

    try {
        const drivers = await fetchDrivers();
        populateSelect(driverSelect, drivers, 'driver_code', 'first_name');

        const constructors = await fetchConstructors();
        populateSelect(constructorSelect, constructors, 'constructor_id', 'name');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function goBack() {
    window.history.back();
}