import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';

// Utilizamos el API Observable mediante Reactive Extensions: rxjs
//import { Observable } from 'rxjs/Observable'; // Angular v5
// import { Observable } from 'rxjs'; // Angular v6 en adelante

// import { of } from 'rxjs/observable/of'; // V5
import { of, Observable, throwError } from 'rxjs'; // Angular v6 en adelante
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

/*
  of: Método de construcción para crear el objeto Observable
  Observable: Es la clase o Tipo de dato que representa nuestro flujo reactivo
*/

@Injectable()
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:8081/api/clientes';

  // Cabecera Http
  private httpHeaders = new HttpHeaders({'ContentType': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }
  /* Observable: Está basado en el patrón de diseño Observador, es decir, que tenemos un sujeto que es Observable, en este caso sería el Cliente y
  tenemos también observadores que están escuchando un posible cambio en el sujeto (Cliente). Estos observadores se suscriben al sujeto (Observable) y
  cuando cambia su estado se notifica a los observadores y se gatilla algún tipo de proceso/tarea/evento. */
  getClientes(): Observable<Cliente[]> {
    // Convertimos/creamos nuestro flujo Observable a partir de los objetos CLIENTES
    // return of(CLIENTES);

    return this.http.get<Cliente[]>(this.urlEndPoint); // Primera forma
  }

  getClientes2(): Observable<Cliente[]> {
      return this.http.get(this.urlEndPoint).pipe( // Segunda form
        map((response) => response as Cliente[])
      );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders});
  }

  getCliente(id: Number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']); // Redirige al listado de clientes ante cualquier error
        console.error(e.error.mensaje);
        swal('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente:Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders});
  }

  delete(id: Number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders});
  }
}
