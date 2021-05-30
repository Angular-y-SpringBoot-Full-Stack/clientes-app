import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';

// Utilizamos el API Observable mediante Reactive Extensions: rxjs
//import { Observable } from 'rxjs/Observable'; // Angular v5
// import { Observable } from 'rxjs'; // Angular v6 en adelante

// import { of } from 'rxjs/observable/of'; // V5
import { of, Observable } from 'rxjs'; // Angular v6 en adelante

/*
  of: Método de construcción para crear el objeto Observable
  Observable: Es la clase o Tipo de dato que representa nuestro flujo reactivo
*/

@Injectable()
export class ClienteService {

  constructor() { }
  /* Observable: Está basado en el patrón de diseño Observador, es decir, que tenemos un sujeto que es Observable, en este caso sería el Cliente y
  tenemos también observadores que están escuchando un posible cambio en el sujeto (Cliente). Estos observadores se suscriben al sujeto (Observable) y
  cuando cambia su estado se notifica a los observadores y se gatilla algún tipo de proceso/tarea/evento. */
  getClientes(): Observable<Cliente[]> {
    // Convertimos/creamos nuestro flujo Observable a partir de los objetos CLIENTES
    return of(CLIENTES);
  }
}
