import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    // Es un evento cuando se inicia el componente
    // Se suscribe o registra el observador a nuestros clientes (Observable)
    this.clienteService.getClientes().subscribe(
        clientes => this.clientes = clientes
    );
      // Es lo mismo que arriba
      /*function(clientes) {
        this.clientes = clientes
      }

      (clientes) => {
        this.clientes = clientes
      }
      */
  }

}
