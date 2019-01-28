import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DbService } from '../db.service';
import { ActivatedRoute, Router } from '@angular/router';


export interface opcoesCatalogo {
  status: boolean;
  codigo: string;
  descricao: string;
}


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {
  displayedColumns: string[] = ['acao', 'status', 'codigo', 'descricao'];
  dataSource: MatTableDataSource<any[]>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  formulario = new FormGroup({
    status: new FormControl(''),
    codigo: new FormControl(''),
    descricao: new FormControl('')
  });

  opcoes = new FormGroup({
    status: new FormControl(''),
    codigo: new FormControl(''),
    descricao: new FormControl('')
  });

  codigo: string;
  


  constructor(private DB: DbService, private route: ActivatedRoute, private router: Router) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    // get no codigo caso rota venha de listagem, caso exista preencha a view com as informações do catalogo escolhido
    this.codigo = this.route.snapshot.paramMap.get("codigo");

    if (this.codigo) {
      var catalogo = this.DB.getCatalogo(this.codigo);
      this.formulario.patchValue({ 'status': catalogo['status'], 'codigo': catalogo['codigo'], 'descricao': catalogo['descricao'] })
      this.dataSource.data = catalogo['opcoes'];
      this.dataSource._updateChangeSubscription();
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  
  updateTable() {
    //refresh na view
    this.dataSource._updateChangeSubscription();
  }

  applyFilter(filterValue: string) {
    //aplica o filtro
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addOpcao() {
    //adiciona do formulário para o array fonte da view e da refresh nela;
    //caso já exista uma opção no array, atualiza ela. Se não, adiciona;
    //depois limpa os campos do formulario;
    if (this.verificaOpcao(this.opcoes.value)) {
      this.dataSource.data.push(this.opcoes.value);
      this.dataSource._updateChangeSubscription();
    }
    else{
      this.updateOpcao(this.opcoes.value);
    }
    this.opcoes.reset();
  }

  deleteOpcao(codigo) {
    //deleta opção do array fonte;
    var i = 0;
    var d = null;
    this.dataSource.data.forEach(function (valor) {
      if (valor['codigo'] == codigo) {
        d = i;
      }
      i++;
    });
    this.dataSource.data.splice(d, 1);
    this.updateTable();
  }

  prepareUpdateOpcao(codigo) {
    //seta os campos do formulario de opções com a linha escolhida;
    var tmp = null;
    this.dataSource.data.forEach(function (valor) {
      if (valor['codigo'] == codigo) {
        tmp = valor;
      }
    });
    this.opcoes.patchValue({ 'status': tmp['status'], 'codigo': tmp['codigo'], 'descricao': tmp['descricao'] });
  }

  updateOpcao(opcao) {
    //modifica a opção e recarrega a view;
    var i = 0;
    var u = null;
    this.dataSource.data.forEach(function (valor) {
      if (valor['codigo'] == opcao.codigo) {
        u = i;
      }
      i++;
    });
    this.dataSource.data[u] = opcao;
    this.updateTable();
  }

  save() {
    //adiciona as opção do array fonte no formulário para salvar tudo como um único objeto
    this.formulario.value.opcoes = this.dataSource.data;
    var navigate = true;
    
    //se o código estava setado, significa que é uma atualização
    if (this.codigo) {
      this.DB.update(this.formulario.value);
    }
    //se não é uma adição
    else {
      //se o catalogo ainda não existe, adiciona-o
      if (this.verifica(this.formulario.value)) {
        this.DB.add(this.formulario.value);
      }
      // se não, pergunta se quer atualiza-lo em vez isso.
      else {
        var c = confirm('Já existe um catalogo com esse código, gostaria de atualizá-lo com estas informações?');
        // se sim, atuliza
        if (c) {
          this.DB.update(this.formulario.value);
        }
        // se não, não faz nada;
        else {
          navigate = false;
          return false;
        }
      }
    }

    if (navigate) {
      // se houve alteração, redireciona para listagem
      alert('Dados salvos com sucesso');
      this.router.navigate(['/']);
    }

  }


  verifica(catalogo) {
    //verifica se catálogo já existe no banco
    var banco = this.DB.getCatalogos();
    var r = true;
    banco.forEach(function (valor) {
      if (valor.codigo == catalogo.codigo) {
        r = false;
      }
    });
    return r;
  }

  verificaOpcao(opcao) {
     //verifica se opção já existe no banco
    var r = true;
    this.dataSource.data.forEach(function (valor) {
      if (valor['codigo'] == opcao.codigo) {
        r = false;
      }
    });
    return r;
  }



}