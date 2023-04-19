import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute) { }

  // ngOnInit solo se llama una vez, cuando el componente se inicia
  ngOnInit(): void {
    // Es un evento cuando se inicia el componente
    // Se suscribe o registra el observador a nuestros clientes (Observable)
    // this.clienteService.getClientes4().pipe(
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page'); // Operador '+' convierte el string a number
      if (!page) page = 0;
      this.clienteService.getClientes5(page).pipe(
        tap(response => {
          console.log('ClientesComponent: tap 3');
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);
          });
        })
      )
      .subscribe(response => {
        this.clientes = response.content as Cliente[];
        this.paginador = response;
      });
    });

    // Es lo mismo que arriba
    /*function(clientes) {
      this.clientes = clientes
    }

    (clientes) => {
      this.clientes = clientes
    }
    */
  }

  delete(cliente: Cliente): void {
    swal({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'No, cancelar!',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true
    } as any).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(clienteActual => clienteActual !== cliente); // Se muestra en la lista clientes distintos del que se está eliminando
            swal(
              'Cliente eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success'
            )
          }
        );
      }
    })
  }

}
