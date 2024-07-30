document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'index.html';
    }
});

function obtenerInformacion () {
    const usuario = localStorage.getItem('username');

    const verificar = prompt('Ingrese su nombre para confirmar:');

    if (verificar !== usuario) {
        alert('Ese no es su nombre.');
        return;
    }

    const resultadoDiv = document.getElementById('resultado');

    fetch(`http://localhost:5267/api/Persona/${usuario}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener información del usuario');
            }
            return response.json();
        })
        .then(usuario => {
            resultadoDiv.innerHTML = '';

            const tabla = document.createElement('table');
            tabla.classList.add('table');

            const tableHeaderRow = tabla.createTHead().insertRow();
            ['Usuario', 'Email', 'Contrasena'].forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                th.classList.add('table-header');
                tableHeaderRow.appendChild(th);
            });

            const row = tabla.insertRow();
            row.innerHTML = `<td>${usuario.usuario}</td><td>${usuario.email}</td><td>${usuario.contrasena}</td>`;

            resultadoDiv.appendChild(tabla);
            resultadoDiv.style.display = 'block';

            const image = document.createElement('img');
            image.src = '../images/kaiformacion.png';
            image.alt = 'User Image';
            document.body.appendChild(image);

            image.style.position = 'fixed';
            image.style.bottom = '0px';
            image.style.right = '0px';
            image.style.width = '370px';
            image.style.height = '500px';
        })
        .catch(error => {
            console.error('Error al obtener información del usuario:', error);
        });
}


function editarInformacion() {
    const usuario = localStorage.getItem('username');

    const verificar = prompt('Ingrese su nombre para confirmar:');

    if (verificar !== usuario) {
        alert('Ese no es su nombre.');
        return;
    }

    const Email = prompt('Ingrese su nuevo email:');
    const Contrasena = prompt('Ingrese su nueva contraseña:');

    if (!Email || !Contrasena) {
        alert('Por favor ingrese un nuevo email y contraseña válidos.');
        return;
    }

    const nuevaPersona = {
        Usuario: usuario,
        Email: Email,
        Contrasena: Contrasena
    };

    fetch(`http://localhost:5267/api/Persona/${usuario}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaPersona)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar información de la cuenta');
        }
        alert('Información de la cuenta actualizada correctamente.');
        return response.json();
    })
    .catch(error => {
        console.error('Error al actualizar información de la cuenta:', error);
        alert('Hubo un error al actualizar la información de la cuenta.');
    });
}


function borrarCuenta() {
    const usuario = localStorage.getItem('username');

    // Prompt for initial confirmation
    const initialConfirmation = confirm('¿Estás seguro de que deseas eliminar tu cuenta?');

    if (!initialConfirmation) {
        return; // User canceled deletion
    }

    // Prompt for double confirmation with name
    const confirmation1 = prompt('Para confirmar, escribe tu nombre:');
    if (confirmation1 !== usuario) {
        alert('El nombre ingresado no coincide. La cuenta no se eliminará.');
        return;
    }

    const confirmation2 = prompt('Escribe tu nombre nuevamente para confirmar la eliminación:');
    if (confirmation2 !== usuario) {
        alert('Los nombres no coinciden. La cuenta no se eliminará.');
        return;
    }

    // Final confirmation
    const finalConfirmation = confirm('Esta acción no se puede deshacer. ¿Estás seguro de eliminar tu cuenta?');
    if (!finalConfirmation) {
        return; // User canceled deletion
    }

    // Perform account deletion
    fetch(`http://localhost:5267/api/Persona/${usuario}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar la cuenta');
        }
        alert('¡Tu cuenta ha sido eliminada correctamente!');

        // Clear local storage upon successful deletion
        localStorage.removeItem('username'); // Clear username
        localStorage.removeItem('email');    // Clear email (if stored)
        
        // Redirect to index.html (login screen)
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Error al eliminar la cuenta:', error);
        alert('Hubo un error al eliminar la cuenta. Inténtalo de nuevo más tarde.');
    });
}

