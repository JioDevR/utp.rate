// Función para cargar los datos del JSON
async function cargarnotas() {
    let respuesta = await fetch('cursos.json');
    let cursos = await respuesta.json();
    let contenedor = document.getElementById('contenidocursos');
    let fechadocumento = document.getElementById('fechahora');
    
    // Seteamos la fecha actual similar al PDF original [cite: 1, 35, 74]
    fechadocumento.innerText = new Date().toLocaleString();

    contenedor.innerHTML = '';

    cursos.forEach(c => {
        let cursohtml = `
            <div class="mb-8 text-[13px]">
                <div class="flex justify-between items-baseline">
                    <h3 class="text-md font-bold">${c.nombre}</h3>
                </div>
                <p class="font-semibold mb-2">Aprobado | Promedio: ${c.promedio}</p>
                
                <div class="grid grid-cols-1 gap-1 mb-4 text-gray-700">
                    <p>Docente: (Ver en portal)</p>
                    <p>Modalidad de curso: ${c.modalidad}</p>
                    <p>Horario: ${c.horario}</p>
                </div>

                <div class="flex justify-between border-t border-b border-gray-200 py-2 mb-2 text-gray-600">
                    <span>Horas semanales: ${c.horas.toFixed(1)}</span>
                    <span>Créditos: ${c.creditos.toFixed(2)}</span>
                    <span>Nro vez: 1</span>
                    <span>Sección: ${c.seccion}</span>
                </div>

                <div class="flex justify-between font-bold text-gray-800">
                    <span>Promedio: ${c.promedio}</span>
                    <span class="text-sm">Aprobado</span>
                </div>
            </div>
        `;
        contenedor.innerHTML += cursohtml;
    });
}

// Función para generar el PDF imitando el formato original
async function generarpdf() {
    const { jsPDF } = window.jspdf;
    let elemento = document.getElementById('reporte');
    
    let canvas = await html2canvas(elemento, {
        scale: 2,
        useCORS: true
    });
    
    let imgdata = canvas.toDataURL('image/png');
    let pdf = new jsPDF('p', 'mm', 'a4');
    let ancho = pdf.internal.pageSize.getWidth();
    let alto = (canvas.height * ancho) / canvas.width;

    pdf.addImage(imgdata, 'PNG', 0, 0, ancho, alto);
    pdf.save('Mis_Notas_UTP.pdf');
}

// Iniciar carga
cargarnotas();