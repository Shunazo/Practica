document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'index.html';
    }
});


function obtenerCategorias(callback) {
    const personanombre = localStorage.getItem('username');

    const verificar = prompt('Ingrese su nombre para confirmar:');

    if (verificar !== personanombre) {
        alert('Ese no es su nombre.');
        return;
    }

    fetch(`http://localhost:5267/api/Categoria/${personanombre}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener categorías');
            }
            return response.json();
        })
        .then(categorias => {
         
            callback(categorias);
        })
        .catch(error => {
            console.error('Error al obtener categorías:', error);
        });
}


function obtenerCategorias() {
    const personanombre = localStorage.getItem('username');

    const verificar = prompt('Ingrese su nombre para confirmar:');

    if (verificar !== personanombre) {
        alert('Ese no es su nombre.');
        return;
    }

    const resultadoDiv = document.getElementById('resultado');

    fetch(`http://localhost:5267/api/Categoria/${personanombre}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener categorías');
            }
            return response.json();
        })
        .then(categorias => {
           
            resultadoDiv.innerHTML = '';

         
            const tabla = document.createElement('table');
            tabla.classList.add('table'); 
            const tableHeaderRow = tabla.createTHead().insertRow();
            ['Nombre', 'MontoLimite', 'Descripción'].forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                th.classList.add('table-header');
                tableHeaderRow.appendChild(th);
            });

            categorias.forEach(categoria => {
                const row = tabla.insertRow();
                row.innerHTML = `<td>${categoria.nombre}</td><td>${categoria.montoLimite}</td><td>${categoria.descripcion}</td>`;
            });

            resultadoDiv.appendChild(tabla);

           
            resultadoDiv.style.display = 'block';
        })
        .catch(error => {
            console.error('Error al obtener categorías:', error);
        });
}

function crearCategoria() {

    const verificar = localStorage.getItem('username'); 

    const personanombre = prompt("Ingresa tu nombre:");
    const nombre = prompt("Nombre de la nueva categoría:");
    const descripcion = prompt("Descripción de la nueva categoría:");

    let montolimite;

do {
    const montolimiteInput = prompt("Monto de la nueva categoría:");

   
    if (!montolimiteInput) {
        alert("El monto de la categoría no puede estar vacío.");
        return;
    }

    
    montolimite = parseFloat(montolimiteInput);

    if (isNaN(montolimite)) {
        alert("Por favor, ingresa un número válido para el monto.");
    }
} while (isNaN(montolimite));



    if (verificar !== personanombre) {
        alert('Ese no es su nombre.');
        return;
    }
    
    if (!nombre) {
        alert("El nombre de la categoría no puede estar vacío.");
        return;
    }

    if (!montolimite) {
        alert("El monto de la categoría no puede estar vacío.");
        return;
    }

    if (!descripcion) {
        alert("La descripción de la categoría no puede estar vacía.");
        return;
    }
    
    const nuevaCategoria = {
        nombre: nombre,
        descripcion: descripcion,
        montolimite: montolimite,
        personanombre: personanombre
    };

    fetch('http://localhost:5267/api/Categoria/${personanombre}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaCategoria)
    })
    .then(() => {
        alert('Categoría creada exitosamente.');
    })
    .catch(error => {
        console.error('Error al crear categoría:', error);
    });
}


function editarCategoria() {

    const verificar = localStorage.getItem('username'); 

    const personanombre = prompt("Ingresa tu nombre:");
    const nombre = prompt("Nombre de la categoría a editar:");
    const descripcion = prompt("Nueva descripción:");

    let montolimite;

do {
    const nuevomontoInput = prompt("Monto de la nueva categoría:");

   
    if (!nuevomontoInput) {
        alert("El monto de la categoría no puede estar vacío.");
        return;
    }

    
    montolimite = parseFloat(nuevomontoInput);

    if (isNaN(montolimite)) {
        alert("Por favor, ingresa un número válido para el monto.");
    }
} while (isNaN(montolimite));

     if (verificar !== personanombre) {
        alert('Ese no es su nombre.');
        return;
    }
    
    if (!nombre) {
        alert("El nombre de la categoría no puede estar vacío.");
        return;
    }

    if (!montolimite) {
        alert("El monto de la categoría no puede estar vacío.");
        return;
    }

    if (!descripcion) {
        alert("La descripción de la categoría no puede estar vacía.");
        return;
    }

    const categoriaEditada = {
        nombre: nombre,
        montolimite: montolimite,
        descripcion: descripcion,
        personanombre: personanombre
    };

    fetch(`http://localhost:5267/api/Categoria/${nombre}/${personanombre}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoriaEditada)
    })
    .then(() => {
        alert('Categoría editada exitosamente.');
    })
    .catch(error => {
        console.error('Error al editar categoría:', error);
    });
}


function borrarCategoria() {

    const verificar = localStorage.getItem('username'); 

    const personanombre = prompt("Ingresa tu nombre:");
    const nombre = prompt("Nombre de la categoría a borrar:");

    if (verificar !== personanombre) {
        alert('Ese no es su nombre.');
        return;
    }
    
    const confirmacion = confirm(`¿Estás seguro de borrar la categoría "${nombre}", ${personanombre}?`);

    if (confirmacion) {
        fetch(`http://localhost:5267/api/Categoria/${nombre}/${personanombre}`, {
            method: 'DELETE'
        })
        .then(() => {
            alert('Categoría eliminada exitosamente.');
        })
        .catch(error => {
            console.error('Error al borrar categoría:', error);
        });
    }
}



    