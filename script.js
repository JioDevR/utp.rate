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
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfancho = pdf.internal.pageSize.getWidth();
    const pdfalto = pdf.internal.pageSize.getHeight();
    const margen = 10; // Margen en mm
    
    // 1. Capturamos la cabecera (logo/periodo) por separado
    const cabecera = document.querySelector('.flex.justify-between.items-start');
    const canvascabecera = await html2canvas(cabecera, { scale: 2 });
    const imgcabecera = canvascabecera.toDataURL('image/png');
    const altocabecerapdf = (canvascabecera.height * pdfancho) / canvascabecera.width;

    // 2. Obtenemos todos los bloques de cursos
    const bloquescursos = document.querySelectorAll('#contenidocursos > div');
    let posiciony = margen;

    // Función interna para añadir cabecera a nuevas páginas
    const añadirheader = (y) => {
        pdf.addImage(imgcabecera, 'PNG', 0, y, pdfancho, altocabecerapdf);
        return y + altocabecerapdf + 5;
    };

    posiciony = añadirheader(posiciony);

    for (const bloque of bloquescursos) {
        const canvasbloque = await html2canvas(bloque, { scale: 2 });
        const imgbloque = canvasbloque.toDataURL('image/png');
        const altobloquepdf = (canvasbloque.height * pdfancho) / canvasbloque.width;

        // ¿El curso cabe en la página actual?
        if (posiciony + altobloquepdf > pdfalto - margen) {
            pdf.addPage();
            posiciony = margen;
            posiciony = añadirheader(posiciony);
        }

        pdf.addImage(imgbloque, 'PNG', 0, posiciony, pdfancho, altobloquepdf);
        posiciony += altobloquepdf;
    }

    pdf.save('Reporte_Notas_UTP_Mejorado.pdf');
}

cargarnotas();