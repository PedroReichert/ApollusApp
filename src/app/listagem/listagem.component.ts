import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DbService } from '../db.service';
import {Router} from "@angular/router";


export interface opcoesCatalogo {
  status: boolean;
  codigo: string;
  descricao: string;
}


@Component({
  selector: 'app-listagem',
  templateUrl: './listagem.component.html',
  styleUrls: ['./listagem.component.scss']
})
export class ListagemComponent implements OnInit {
  displayedColumns: string[] = ['select','status', 'codigo', 'descricao'];
  dataSource: MatTableDataSource<any[]>;
  selection = new SelectionModel<any[]>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private DB:DbService,private router: Router) {
    var banco = this.DB.getCatalogos();
    this.dataSource = new MatTableDataSource(banco);
    
  }

  ngOnInit() {
    //seta paginação e ordenamento da tabela;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  selecionar(row){
    //permite somente a seleção de um select box na tabela;
    this.selection.clear();
    this.selection.toggle(row);
  }

  applyFilter(filterValue: string) {
    //aplica filtro;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  excluirSelecionados(){
    //excluir catalogo da linha selecionada
    if(this.selection.selected.length !== 0){
      this.DB.delete(this.selection.selected[0]);
      this.refreshTable();
    }
    else{
      alert('Nenhum item selecionado');
    }
    
  }

  refreshTable(){
    //update na view;
    this.selection.clear();
    var banco = this.DB.getCatalogos();
    this.dataSource = new MatTableDataSource(banco);
    this.dataSource._updateChangeSubscription();
  }

  visualizar(){
    //redireciona a linha selecionada para a pagina de cadastro via get
    if(this.selection.selected.length !== 0){
      this.router.navigate(['/cadastro',this.selection.selected[0]['codigo']]);
    }
    else{
      alert('Nenhum item selecionado');
    }
  }

}
