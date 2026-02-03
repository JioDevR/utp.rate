async function cargarnotas() {
    let respuesta = await fetch('cursos.json');
    let cursos = await respuesta.json();
    let contenedor = document.getElementById('contenidocursos');
    let fechadocumento = document.getElementById('fechahora');
    
    fechadocumento.innerText = new Date().toLocaleString();
    contenedor.innerHTML = '';

    cursos.forEach(c => {
        let cursohtml = `
            <div class="mb-8 text-[13px] p-4 border-b border-gray-50">
                <div class="flex justify-between items-baseline">
                    <h3 class="text-md font-bold">${c.nombre}</h3>
                </div>
                <p class="font-semibold mb-2 text-blue-800">Aprobado | Promedio: ${c.promedio}</p>
                
                <div class="grid grid-cols-2 gap-1 mb-4 text-gray-700">
                    <p><strong>Docente:</strong> ${c.docente || 'No asignado'}</p>
                    <p><strong>Horario:</strong> ${c.horario}</p>
                    <p><strong>Modalidad:</strong> ${c.modalidad}</p>
                </div>

                <div class="flex justify-between border-t border-b border-gray-200 py-2 mb-2 text-gray-500 bg-gray-50 px-2">
                    <span>Horas semanales: ${parseFloat(c.horas).toFixed(1)}</span>
                    <span>Créditos: ${parseFloat(c.creditos).toFixed(2)}</span>
                    <span>Nro vez: 1</span>
                    <span>Sección: ${c.seccion}</span>
                </div>

                <div class="flex justify-between font-bold text-gray-800 px-2">
                    <span>Promedio: ${c.promedio}</span>
                    <span class="text-green-700">Aprobado</span>
                </div>
            </div>
        `;
        contenedor.innerHTML += cursohtml;
    });
}

async function generarpdf() {
    const { jsPDF } = window.jspdf;
    let elemento = document.getElementById('reporte');
    
    // Capturamos el contenido completo
    let canvas = await html2canvas(elemento, {
        scale: 2,
        useCORS: true,
        logging: false
    });
    
    let imgdata = canvas.toDataURL('image/png');
    let pdf = new jsPDF('p', 'mm', 'a4');
    
    let pdfancho = pdf.internal.pageSize.getWidth();
    let pdfalto = pdf.internal.pageSize.getHeight();
    let imgancho = canvas.width;
    let imgalto = canvas.height;
    
    // Calculamos la altura de la imagen en relación al ancho del PDF
    let raltopdf = (imgalto * pdfancho) / imgancho;
    let altopaginaleido = 0;

    // Lógica para añadir páginas si el contenido es muy largo
    while (altopaginaleido < raltopdf) {
        let posicion = altopaginaleido * -1;
        pdf.addImage(imgdata, 'PNG', 0, posicion, pdfancho, raltopdf);
        altopaginaleido += pdfalto;
        
        // Si todavía queda contenido, añadimos una nueva página
        if (altopaginaleido < raltopdf) {
            pdf.addPage();
        }
    }
    
    pdf.save('Reporte_Final_UTP.pdf');
}

cargarnotas();