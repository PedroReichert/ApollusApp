import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor() { }

  getCatalogos() {
    var catalogo = (localStorage.getItem('catalogo') !== null) ? JSON.parse(localStorage.getItem('catalogo')) : [];
    return catalogo;
  }

  getCatalogo(codigo) {
    var catalogos = this.getCatalogos();
    var retorno = false;
    catalogos.forEach(function (valor) {
      if (valor.codigo == codigo) {
        retorno = valor;
      }
    });
    return retorno;
  }

  add(catalogo) {
    var banco = this.getCatalogos();
    banco.push(catalogo);
    localStorage.setItem('catalogo', JSON.stringify(banco));
  }

  update(catalogo) {
    var banco = this.getCatalogos();
    var i = 0;
    banco.forEach(function (valor) {
      if (valor.codigo == catalogo.codigo) {
        banco[i] = catalogo;
        console.log(catalogo);
      }
      i++;
    });
    localStorage.setItem('catalogo', JSON.stringify(banco));
  }

  save(catalogos) {
    localStorage.setItem('catalogo', JSON.stringify(catalogos));
  }

  delete(catalogo) {
    var i = 0;
    var catalogos = this.getCatalogos();
    catalogos.forEach(function (valor) {
      if (valor.codigo == catalogo.codigo) {
        catalogos.splice(i, 1);
      }
      i++;
    });
    this.save(catalogos);
  }

}
