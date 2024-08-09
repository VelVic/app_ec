import { Component, OnInit } from '@angular/core';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
})
export class FinancePage implements OnInit {

  constructor(private pdfService: PdfService) { }

  downloadFinancePDF() {
    this.pdfService.downloadFinancePDF('finance-content', 'Reporte_Financiero');
  }
}
