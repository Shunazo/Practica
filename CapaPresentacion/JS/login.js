function iniciarSesion() {
    const username = document.getElementById('first').value;
    const email = document.getElementById('last').value;
    const password = document.getElementById('password').value;

   
    if (username && password) {
        const data = {
            Usuario: username,
            Email: email,
            Contrasena: password
        };

       
        fetch('http://localhost:5267/api/Persona/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Inicio de sesión fallido');
            }
            return response.json();
        })
        .then(result => {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);
            window.location.href = 'Menu.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Inicio de sesión fallido. Verifica tus credenciales.');
        });
    } else {
        alert('Por favor, completa todos los campos.');
    }
}


document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    iniciarSesion(); 
});


