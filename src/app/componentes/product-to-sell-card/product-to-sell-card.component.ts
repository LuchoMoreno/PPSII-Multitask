import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DetalladoPublicacionComponent } from '../detallado-publicacion/detallado-publicacion.component';

@Component({
  selector: 'app-product-to-sell-card',
  templateUrl: './product-to-sell-card.component.html',
  styleUrls: ['./product-to-sell-card.component.css']
})
export class ProductToSellCardComponent implements OnInit {

  @Input() publicacion;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog(publicacion) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      publicacion:publicacion,
      esVistaCompleta:true
    }
    const dialogRef = this.dialog.open(DetalladoPublicacionComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
