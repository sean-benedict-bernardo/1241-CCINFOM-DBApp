document.addEventListener('DOMContentLoaded', async () => {
    const constructorSelect = document.getElementById('constructor_select');

    try {
        const response = await fetch('http://localhost:3000/constructors-list');
        const constructors = await response.json();

        constructors.forEach(constructor => {
            const option = document.createElement('option');
            option.value = constructor.constructor_id;
            option.textContent = constructor.name;
            constructorSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching constructors:', error);
    }
});

document.getElementById('add-crew-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3000/add-crew', {
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
        alert('An error occurred while adding the crew member.');
    }
});

function goBack() {
    window.history.back();
}