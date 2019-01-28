import {MatButtonModule,MatCheckboxModule} from '@angular/material';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { NgModule } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatBadgeModule} from '@angular/material/badge';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';  
import {MatSnackBarModule} from '@angular/material/snack-bar'; 

var modulos = [MatSnackBarModule,MatSortModule,MatPaginatorModule,MatTableModule,MatDividerModule,MatBadgeModule,MatGridListModule,MatButtonModule,MatCheckboxModule,MatToolbarModule,MatIconModule,MatFormFieldModule,MatInputModule,MatSelectModule];

@NgModule({
    imports: modulos,
    exports: modulos
})

export class MaterialModule{ }