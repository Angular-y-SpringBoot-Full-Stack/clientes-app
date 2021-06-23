import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public titulo: string = "Crear Cliente";

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void { // Cuando se inicializa el componente
    this.cargarCliente();
  }

  public cargarCliente() : void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => this.cliente = cliente);
      }
    });
  }

  public create(): void {
    this.clienteService.create(this.cliente)
      // Primera forma: manejar el retorno del Observable como any
      /*.subscribe(json => {
          this.router.navigate(['/clientes']); // Redirige al listado de clientes
          // swal('Nuevo liente', `Cliente ${json.cliente.nombre} creado con éxito!`, 'success'); // primera forma de corregir
          swal('Nuevo cliente', `${json.mensaje}: ${json.cliente.nombre}`, 'success'); // segunda forma de corregir
      }*/

      // Segunda forma: manejar el retorno del Observable como Cilente
      .subscribe(cliente => {
          this.router.navigate(['/clientes']); // Redirige al listado de clientes
          // swal('Nuevo liente', `Cliente ${json.cliente.nombre} creado con éxito!`, 'success'); // primera forma de corregir
          swal('Nuevo cliente', `El cliente ${cliente.nombre} ha sido creado con éxito`, 'success'); // segunda forma de corregir
      }
    );
  }

  public update(): void {
    this.clienteService.update(this.cliente)
      .subscribe(json => {
        // Maneamos como un json del tipo genérico any
        this.router.navigate(['/clientes']); // Redirige al listado de clientes
        swal('Cliente actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success');
      }
    );
  }

}
