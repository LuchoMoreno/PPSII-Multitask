import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/clases/usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

// IMPORTO EL TIMER:
import { Observable, timer } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormularioDePagoComponent } from 'src/app/componentes/formulario-de-pago/formulario-de-pago.component';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.css']
})
export class TiendaComponent implements OnInit {
  publicacionObjetivo;
  mostrarMiListaDeproductos = false;
  mostrarFormularioPublicar = false;
  mostrar;
  user: Usuario;
  currentUser$: Observable<Usuario>;
  listadoDePublicaciones: any[] = [];
  listadoDePublicacionesAMostrar = [];
  inputSearch;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private formBuilder: FormBuilder) {
    this.inputSearch = this.formBuilder.group({
      textoABuscar: ['', [Validators.required]]
    });
  }
  mostrarListaDeProductos(publicacionObjetivo) {
    this.publicacionObjetivo = publicacionObjetivo;
    this.mostrarMiListaDeproductos = true;
  }
  buscarCoincidencias() {
    let textoABuscar = this.inputSearch.controls['textoABuscar'].value.toLocaleLowerCase();
    let listaAuxiliar = [];

    this.listadoDePublicaciones.forEach((publicacion) => {
      if (publicacion.descripcion.toLocaleLowerCase().includes(textoABuscar) || publicacion.titulo.toLocaleLowerCase().includes(textoABuscar)) {
        listaAuxiliar.push(publicacion);
      }
    });
    this.listadoDePublicacionesAMostrar = listaAuxiliar;
  }
  ngOnInit(): void {

    this.currentUser$ = this.authService.obtenerUsuario$();
    this.currentUser$.subscribe(usuarios => {
      this.user = usuarios;
    });
    this.authService.actualizarUsuario();

    this.listadoDePublicaciones = this.cargarPublicacionesActivas();
    this.listadoDePublicacionesAMostrar = this.listadoDePublicaciones;




  }


  // Esta funcion carga las publicaciones de la base de datos. Incoporar estado.
  cargarPublicacionesActivas(): any {
    var listaPublicaciones = [];
    this.firestore.collection("publicaciones").get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {
        //if (doc.data()['tipo'] != tipoUsuario) 
        let publicacion = doc.data();
        publicacion['id'] = doc.id;
        listaPublicaciones.push(publicacion);

      })
    })
    return listaPublicaciones;
  }




  mostrarFormDePago(publicacion) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      // publicacion: publicacion,
      width:'100vw',
      height:'100vh',
      margin:'0'
    }
    const dialogRef = this.dialog.open(FormularioDePagoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
            alert("COMPRO!");

      switch (result) {
        case 'permutar':
          // this.dialog.open(SeleccionarMisArticulosComponent,dialogConfig);
          break;
        case 'comprar':
          break;
        default:
          //no hacemos nada!
          break;
      }
    });
  }

}

