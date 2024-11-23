document.addEventListener('DOMContentLoaded', async () => {
    const crewSelect = document.getElementById('crew_select');
    const crewTableBody = document.querySelector('#crew_table tbody');

    const fetchCrewMembers = async () => {
        const response = await fetch('http://localhost:3000/crew-list');
        return await response.json();
    };

    const populateTable = (crewMembers) => {
        crewTableBody.innerHTML = '';
        crewMembers.forEach(crew => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${crew.first_name}</td>
                <td>${crew.last_name}</td>
                <td>${crew.crew_role}</td>
                <td>${crew.constructor_name}</td>
            `;
            crewTableBody.appendChild(row);
        });
    };

    try {
        const crewMembers = await fetchCrewMembers();

        crewMembers.forEach(crew => {
            const option = document.createElement('option');
            option.value = crew.crew_id;
            option.textContent = `${crew.first_name} ${crew.last_name}`;
            crewSelect.appendChild(option);
        });

        // Populate table with all crew members initially
        populateTable(crewMembers);

        crewSelect.addEventListener('change', async () => {
            const selectedCrewId = crewSelect.value;
            if (selectedCrewId) {
                const crewResponse = await fetch(`http://localhost:3000/crew-details?crew_id=${selectedCrewId}`);
                const responseText = await crewResponse.text(); // Get response as text
                try {
                    const crewDetails = JSON.parse(responseText); // Parse JSON
                    populateTable([crewDetails]);
                } catch (error) {
                    console.error('Error parsing JSON:', error, responseText); // Log error and response text
                }
            } else {
                populateTable(crewMembers);
            }
        });
    } catch (error) {
        console.error('Error fetching crew members:', error);
    }
});

function goBack() {
    window.history.back();
}