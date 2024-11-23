document.addEventListener('DOMContentLoaded', async () => {
    const crewSelect = document.getElementById('crew_select');
    const attributeSelect = document.getElementById('attribute_select');
    const currentValueInput = document.getElementById('current_value');
    const form = document.getElementById('update_crew_form');

    const fetchCrewMembers = async () => {
        const response = await fetch('http://localhost:3000/crew-list');
        return await response.json();
    };

    const fetchCrewDetails = async (crewId) => {
        const response = await fetch(`http://localhost:3000/crew-details?crew_id=${crewId}`);
        return await response.json();
    };

    const populateCrewSelect = (crewMembers) => {
        crewMembers.forEach(crew => {
            const option = document.createElement('option');
            option.value = crew.crew_id;
            option.textContent = `${crew.first_name} ${crew.last_name}`;
            crewSelect.appendChild(option);
        });
    };

    const updateForm = async () => {
        const selectedCrewId = crewSelect.value;
        const selectedAttribute = attributeSelect.value;

        if (selectedCrewId && selectedAttribute) {
            const crewDetails = await fetchCrewDetails(selectedCrewId);
            currentValueInput.value = crewDetails[selectedAttribute];
        } else {
            currentValueInput.value = '';
        }
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const selectedCrewId = crewSelect.value;
        const selectedAttribute = attributeSelect.value;
        const newValue = document.getElementById('new_value').value;

        if (selectedCrewId && selectedAttribute && newValue) {
            try {
                const response = await fetch('http://localhost:3000/update-crew', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        crew_id: selectedCrewId,
                        attribute: selectedAttribute,
                        new_value: newValue
                    })
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
                    alert('An error occurred while updating the crew member.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating the crew member.');
            }
        }
    });

    try {
        const crewMembers = await fetchCrewMembers();
        populateCrewSelect(crewMembers);
    } catch (error) {
        console.error('Error fetching crew members:', error);
    }

    crewSelect.addEventListener('change', updateForm);
    attributeSelect.addEventListener('change', updateForm);
});

function goBack() {
    window.history.back();
}