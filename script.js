document.getElementById('fileInput').addEventListener('change', leerArchivoExcel, false);

let datosJSON = [];
let workbook = null;

function leerArchivoExcel(e) {
    const archivo = e.target.files[0];
    const lector = new FileReader();

    lector.onload = function(evento) {
        const datos = new Uint8Array(evento.target.result);
        workbook = XLSX.read(datos, {type: 'array'});
        const nombrePrimerHoja = workbook.SheetNames[0];
        const hoja = workbook.Sheets[nombrePrimerHoja];
        datosJSON = XLSX.utils.sheet_to_json(hoja, {header: 1});
        mostrarDatosEnHTML(datosJSON);
    };

    lector.readAsArrayBuffer(archivo);
}

function mostrarDatosEnHTML(datos) {
    const tabla = document.createElement('table');
    datos.forEach((fila, index) => {
        const filaHTML = document.createElement('tr');
        fila.forEach(celda => {
            const celdaHTML = document.createElement('td');
            celdaHTML.textContent = celda;
            filaHTML.appendChild(celdaHTML);
        });
        if (index !== 0) {  // Skip header row for delete buttons
            const btnCelda = document.createElement('td');
            const btnBorrar = document.createElement('button');
            btnBorrar.textContent = 'Borrar';
            btnBorrar.onclick = () => borrarFila(index);
            btnCelda.appendChild(btnBorrar);
            filaHTML.appendChild(btnCelda);
        }
        tabla.appendChild(filaHTML);
    });
    const contenedorTabla = document.getElementById('tablaDatos');
    contenedorTabla.innerHTML = '';  // Limpiar cualquier contenido previo
    contenedorTabla.appendChild(tabla);
}

function añadirFila() {
    const nuevaFila = Array(datosJSON[0].length).fill('');
    datosJSON.push(nuevaFila);
    mostrarDatosEnHTML(datosJSON);
}

function modificarFila() {
    const fila = parseInt(document.getElementById('filaInput').value);
    const columna = parseInt(document.getElementById('columnaInput').value);
    const valor = document.getElementById('valorInput').value;

    if (fila < datosJSON.length && columna < datosJSON[0].length) {
        datosJSON[fila][columna] = valor;
        mostrarDatosEnHTML(datosJSON);
    } else {
        alert('Índice de fila o columna inválido');
    }
}

function borrarFila(index) {
    if (index > 0 && index < datosJSON.length) {
        datosJSON.splice(index, 1);
        mostrarDatosEnHTML(datosJSON);
    } else {
        alert('Índice de fila inválido');
    }
}
