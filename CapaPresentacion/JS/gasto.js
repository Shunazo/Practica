document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'index.html';
    }
});

function obtenerGastos() {
    const personanombre = localStorage.getItem('username');

    const verificar = prompt('Ingrese su nombre para confirmar:');

    if (verificar !== personanombre) {
        alert('Ese no es su nombre.');
        return;
    }

    const resultadoDiv = document.getElementById('resultado');

    // Fetch categories first
    fetch(`http://localhost:5267/api/Categoria/${personanombre}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener categorías');
            }
            return response.json();
        })
        .then(categorias => {
            // Once categories are fetched, fetch expenses
            return fetch(`http://localhost:5267/api/Gasto/${personanombre}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener gastos');
                    }
                    return response.json();
                })
                .then(gastos => {
                    // Sort gastos by categoriaNombre
                    gastos.sort((a, b) => {
                        if (a.categoriaNombre < b.categoriaNombre) {
                            return -1;
                        }
                        if (a.categoriaNombre > b.categoriaNombre) {
                            return 1;
                        }
                        return 0;
                    });

                    // Clear the existing content in resultadoDiv
                    resultadoDiv.innerHTML = '';

                    // Create table for displaying expenses
                    const tabla = document.createElement('table');
                    tabla.classList.add('table');

                    // Create table header row
                    const tableHeaderRow = tabla.createTHead().insertRow();
                    ['Nombre', 'Monto', 'Descripción', 'Categoría', 'Monto Limite'].forEach(headerText => {
                        const th = document.createElement('th');
                        th.textContent = headerText;
                        th.classList.add('table-header');
                        tableHeaderRow.appendChild(th);
                    });

                    // Keep track of displayed categories and their Monto Limite
                    const displayedCategories = {};

                    // Populate the table with sorted expense data
                    gastos.forEach(gasto => {
                        const row = tabla.insertRow();

                        // Check if category has been displayed
                        if (!displayedCategories[gasto.categoriaNombre]) {
                            // Display Monto Limite for this category
                            const montoLimite = findMontoLimite(categorias, gasto.categoriaNombre);
                            row.innerHTML = `<td>${gasto.nombre}</td><td>${gasto.cantidad}</td><td>${gasto.descripcion}</td><td>${gasto.categoriaNombre}</td><td>${montoLimite}</td>`;
                            displayedCategories[gasto.categoriaNombre] = montoLimite;
                        } else {
                            // Fill in Monto Limite for subsequent entries of the same category
                            row.innerHTML = `<td>${gasto.nombre}</td><td>${gasto.cantidad}</td><td>${gasto.descripcion}</td><td>${gasto.categoriaNombre}</td><td>${displayedCategories[gasto.categoriaNombre]}</td>`;
                        }
                    });

                    // Append the table to resultadoDiv
                    resultadoDiv.appendChild(tabla);
                    resultadoDiv.style.display = 'block';

                    // Display the pie chart
                    displayPieChart(gastos, categorias);
                })
                .catch(error => {
                    console.error('Error al obtener gastos:', error);
                });
        })
        .catch(error => {
            console.error('Error al obtener categorías:', error);
        });
}

function findMontoLimite(categorias, categoriaNombre) {
    const categoria = categorias.find(categoria => categoria.nombre === categoriaNombre);
    return categoria ? categoria.montoLimite : 'No definido';
}


function displayPieChart(gastos, categorias) {
    // Calculate total expenses per category
    const categoryExpenses = {};
    
    gastos.forEach(gasto => {
        const { categoriaNombre, cantidad } = gasto;
        if (categoriaNombre in categoryExpenses) {
            categoryExpenses[categoriaNombre] += parseFloat(cantidad);
        } else {
            categoryExpenses[categoriaNombre] = parseFloat(cantidad);
        }
    });
    
    // Prepare data for the pie chart
    const data = Object.keys(categoryExpenses).map(categoriaNombre => ({
        label: categoriaNombre,
        value: categoryExpenses[categoriaNombre]
    }));
    
    // Check if chart container exists
    const chartContainer = document.querySelector('.chart-container');
    
    if (!chartContainer) {
        // Create a new chart container
        const chartDiv = document.createElement('div');
        chartDiv.classList.add('chart-container');
        
        // Create canvas element for the chart
        const canvas = document.createElement('canvas');
        chartDiv.appendChild(canvas);
        
        // Append the chart div to the flex container
        const flexContainer = document.querySelector('.flex-container');
        flexContainer.appendChild(chartDiv);
        
        // Render the pie chart
        renderPieChart(canvas, data);
    } else {
        // Update the existing pie chart
        const canvas = chartContainer.querySelector('canvas');
        updatePieChart(canvas, data);
    }
}

function updatePieChart(canvas, data) {
    const chart = canvas.chart;
    if (chart) {
        // Update the existing pie chart with new data
        chart.data.labels = data.map(item => item.label);
        chart.data.datasets[0].data = data.map(item => item.value);
        chart.update();
    } else {
        // If the chart instance does not exist on the canvas, render a new chart
        renderPieChart(canvas, data);
    }
}

function renderPieChart(canvas, data) {
    const ctx = canvas.getContext('2d');
    
    // Destroy any existing chart instance
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    // Render a new pie chart
    canvas.chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.map(item => item.label),
            datasets: [{
                data: data.map(item => item.value),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66ff66', '#ccffcc', '#00ffcc'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66ff66', '#ccffcc', '#00ffcc']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}






function crearGasto() {
    const personanombre = localStorage.getItem('username');
    const verificar = prompt('Ingrese su nombre para confirmar:');

    if (verificar !== personanombre) {
        alert('Ese no es su nombre.');
        return;
    }

    const nombre = prompt('Nombre del nuevo gasto:');
    const descripcion = prompt('Descripción del nuevo gasto:');
    const cantidad = parseFloat(prompt('Monto del nuevo gasto:'));
    const categoriaNombre = prompt('Nombre de la categoría a asignar el gasto:');

    if (!nombre || !descripcion || isNaN(cantidad) || !categoriaNombre) {
        alert('Datos inválidos. Por favor, complete todos los campos correctamente.');
        return;
    }

    // Obtener todos los gastos existentes para la categoría específica
    fetch(`http://localhost:5267/api/Gasto/${personanombre}/${categoriaNombre}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener gastos');
            }
            return response.json();
        })
        .then(gastos => {
            // Calcular la suma de los montos de los gastos existentes en la misma categoría
            const sumaMontosExistente = gastos.reduce((total, gasto) => total + gasto.cantidad, 0);

            // Obtener el monto límite para la categoría especificada
            fetch(`http://localhost:5267/api/Categoria/${personanombre}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al obtener categorías');
                    }
                    return response.json();
                })
                .then(categorias => {
                    const montoLimite = findMontoLimite(categorias, categoriaNombre);

                    // Verificar si agregar el nuevo gasto excede el monto límite
                    if (montoLimite !== 'No definido' && sumaMontosExistente + cantidad > parseFloat(montoLimite)) {
                        alert(`¡El monto del nuevo gasto excede el límite para la categoría "${categoriaNombre}"!`);
                        return; // Detener el procesamiento adicional
                    }

                    // Proceder a crear el nuevo gasto
                    const nuevoGasto = {
                        nombre: nombre,
                        descripcion: descripcion,
                        cantidad: cantidad,
                        categoriaNombre: categoriaNombre,
                        personaNombre: personanombre,
                    };

                    fetch(`http://localhost:5267/api/Gasto/${personanombre}/${categoriaNombre}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(nuevoGasto)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al crear gasto');
                        }
                        return response.json();
                    })
                    .catch(error => {
                        console.error('Error al crear gasto:', error);
                    });
                })
                .catch(error => {
                    console.error('Error al obtener categorías:', error);
                });
        })
        .catch(error => {
            console.error('Error al obtener gastos existentes:', error);
        });
}

function findMontoLimite(categorias, categoriaNombre) {
    const categoria = categorias.find(categoria => categoria.nombre === categoriaNombre);
    return categoria ? categoria.montoLimite : 'No definido';
}



function editarGasto() {
    const personanombre = localStorage.getItem('username');

    const verificar = prompt('Ingrese su nombre para confirmar:');

    if (verificar !== personanombre) {
        alert('Ese no es su nombre.');
        return;
    }

    const categorianombre = prompt("Por favor, introduzca la categoría del gasto:");
    const nombre = prompt("Por favor, introduzca el nombre del gasto que desea editar:");

    const descripcion = prompt("Por favor, introduzca la nueva descripción del gasto:");
    const cantidad = prompt("Por favor, introduzca la nueva cantidad del gasto:");

    const gasto = {
        Nombre: nombre,
        PersonaNombre: personanombre,
        CategoriaNombre: categorianombre,
        Descripcion: descripcion,
        Cantidad: cantidad
    };

    fetch(`http://localhost:5267/api/Gasto/${personanombre}/${nombre}/${categorianombre}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gasto)
    })
    .then(response => {
        if (response.ok) {
            alert("Gasto actualizado exitosamente.");
        } else {
            alert("Hubo un error al intentar actualizar el gasto.");
        }
    })
    .catch(error => {
        alert("Hubo un error al intentar actualizar el gasto.");
    });
}

function borrarGasto() {
    const personanombre = localStorage.getItem('username');

    const verificar = prompt('Ingrese su nombre para confirmar:');

    if (verificar !== personanombre) {
        alert('Ese no es su nombre.');
        return;
    }

    const nombre = prompt('Nombre del gasto a borrar:');

    if (!nombre) {
        alert('Nombre inválido.');
        return;
    }

    const confirmacion = confirm(`¿Estás seguro de borrar el gasto "${nombre}"?`);

    if (confirmacion) {
        fetch(`http://localhost:5267/api/Gasto/${nombre}/${personanombre}`, {
            method: 'DELETE'
        })
        .then(() => {
            alert('Gasto eliminado exitosamente.');
        })
        .catch(error => {
            console.error('Error al borrar gasto:', error);
        });
    }
}
