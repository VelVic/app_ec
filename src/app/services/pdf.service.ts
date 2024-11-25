import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  async downloadPDF(elementId: string, fileName: string) {
    const data = document.getElementById(elementId);

    if (data) {
      try {
        // Captura el contenido del elemento como un canvas
        const canvas = await html2canvas(data, { scale: 3 });
        const imgWidth = 210; // Ancho A4 en mm
        const pageHeight = 295; // Altura A4 en mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const pdf = new jsPDF('p', 'mm', 'a4'); // Tamaño A4

        // Cargar y convertir la imagen de fondo a base64
        const imgData = await this.loadBackgroundImage();

        // Agregar la imagen de fondo en la primera página
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, pageHeight);

        let position = 0;

        // Añadir la imagen del contenido
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 35, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Añadir más páginas si es necesario
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, pageHeight); // Imagen de fondo en cada página
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 30, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Guardar el PDF con el nombre proporcionado
        pdf.save(`${fileName}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    } else {
      console.error('Element not found:', elementId);
    }
  }

  // Función para cargar y convertir una imagen de fondo a base64
  private loadBackgroundImage(): Promise<string> {
    const backgroundImg = '../../../../assets/img/hec.jpg';
    const backgroundImage = new Image();
    backgroundImage.src = backgroundImg;

    return new Promise<string>((resolve, reject) => {
      backgroundImage.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = backgroundImage.width;
          canvas.height = backgroundImage.height;
          ctx.drawImage(backgroundImage, 0, 0);
          resolve(canvas.toDataURL('image/jpeg'));
        } else {
          reject('Canvas context not available');
        }
      };
      backgroundImage.onerror = reject;
    });
  }
}


/* import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  async downloadPDF(elementId: string, fileName: string) {
    const data = document.getElementById(elementId);

    if (data) {
      try {
        // Capturar el contenido del elemento como un canvas
        const canvas = await html2canvas(data, { scale: 2 });
        const imgWidth = 210; // Ancho A4 en mm
        const pageHeight = 295; // Altura A4 en mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;

        const pdf = new jsPDF('p', 'mm', 'a4'); // Tamaño A4
        let position = 0;

        // Añadir imagen del contenido
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Añadir más páginas si es necesario
        while (heightLeft > 0) {
          pdf.addPage();
          position = heightLeft - imgHeight; // Ajustar la posición para la nueva página
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // Guardar el PDF con el nombre proporcionado
        pdf.save(`${fileName}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    } else {
      console.error('Element not found:', elementId);
    }
  }
} */

