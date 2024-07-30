function registrarUsuario() {
    const username = document.getElementById('first').value;
    const email = document.getElementById('last').value;
    const password = document.getElementById('password').value;

 
    if (username && email && password) {
        const data = {
            Usuario: username,
            Email: email,
            Contrasena: password
        };

       
        fetch('http://localhost:5267/api/Persona/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Registro fallido');
            }
          
            return response.text().then(text => {
                return text ? JSON.parse(text) : {}; 
            });
        })
        .then(result => {
            if (result && result.Mensaje) {
               
                alert(result.Mensaje);
            } else {
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                window.location.href = 'index.html'; 
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Registro fallido. Tu email es invalido o ya existe un usuario con ese nombre de usuario o email. Verifica tus credenciales.');
        });
    } else {
        alert('Por favor, completa todos los campos.');
    }
}


document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    registrarUsuario(); 
});
