import { Injectable } from '@angular/core';
import { formatDate, DatePipe, registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es'; // Registrar locale (usar español al mostrar la fecha)
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';

// Utilizamos el API Observable mediante Reactive Extensions: rxjs
//import { Observable } from 'rxjs/Observable'; // Angular v5
// import { Observable } from 'rxjs'; // Angular v6 en adelante

// import { of } from 'rxjs/observable/of'; // V5
import { of, Observable, throwError } from 'rxjs'; // Angular v6 en adelante
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
/* catchError: Operador para atrapar errores que ocurren cuando se retornan códigos de respuesta de error.
Ejemplo:
  404 Not Found
  500 Internal Server Error */


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
        map((response) => { // Operador map del observable
          let clientes = response as Cliente[];
          return clientes.map(cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
            registerLocaleData(localeES, 'es');
            let datePipe = new DatePipe('es');
            // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US'); // forma 1
            cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy'); // forma 2: Usando DatePipe
            // cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate'); // forma 3
            /*
              dd: Dígitos del día
              EEE: Nombre del día de la semana abreviado
              EEEE: Nombre del día de la semana completo
              MM: Mes en Dígitos
              MMM: Nombre del mes: abreviado
              MMMM: Nombre del mes completo

              CONSTANTES: short, medium, shortDate, mediumDate, longDate, fullDate, shortTime, mediumTime
            */
            // Función formateDate: fecha a cambiar | patrón de formato | locale
            return cliente;
          }); // método map para modificar cada item del array
        })
      );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      // Uso del operador map() para convertir el flujo reactivo y trabajar con Cliente (ya no trabajar con any)
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        // No es necesario redirigir a otra página ya que la idea es permanecer en el formulario para corregir el error

        if (e.status == 400) {
          // Validación de parámetros: Contiene varios errores
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal(e.error.mensaje,
            e.error.error, // Aquí accedemos a la causa del error
            'error');
        return throwError(e); // Se retorna este objeto de error pero convertido en un Observable para mantener el mismo tipo de retorno del método
      })
    );
  }

  getCliente(id: Number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']); // Redirige al listado de clientes ante cualquier error
        console.error(e.error.mensaje);
        swal('Error al editar', e.error.mensaje, 'error');
        return throwError(e); // Se retorna este objeto de error pero convertido en un Observable para mantener el mismo tipo de retorno del método
      })
    );
  }

  update(cliente:Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      // Estamos manejando con un any: Se retorna un Observable any
      catchError(e => {
        // No es necesario redirigir a otra página ya que la idea es permanecer en el formulario para corregir el error

        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e); // Se retorna este objeto de error pero convertido en un Observable para mantener el mismo tipo de retorno del método
      })
    );
  }

  delete(id: Number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        // No es necesario redirigir a otra página ya que la idea es permanecer en el formulario para corregir el error
        console.error(e.error.mensaje);
        swal(e.error.mensaje, e.error.error, 'error');
        return throwError(e); // Se retorna este objeto de error pero convertido en un Observable para mantener el mismo tipo de retorno del método
      })
    );
  }
}
