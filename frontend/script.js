const SERVER = "http://localhost:3000/";

document.addEventListener('DOMContentLoaded', () => {
    console.log("fetching")
    fetch(SERVER, {
        method: 'GET',
        headers: {
            'header-name': 'deez_nuts'
        }
    })
        .then(response => response.json())
        .then(data => { document.write(data.text); });
});