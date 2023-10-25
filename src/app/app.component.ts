import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Action } from 'rxjs/internal/scheduler/Action';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'crud-funcionario';

  displayedColumns: string[] = [
    'id', 
    'firstName', 
    'lastName', 
    'email', 
    'company', 
    'dob', 
    'education', 
    'gender', 
    'experience', 
    'package',
    'action'  
  ];
  
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatSort) sort!: MatSort
  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(
    private _dialog: MatDialog, 
    private _empService: EmployeeService, 
    private _LiveAnnouncer: LiveAnnouncer,
    private _coreService: CoreService
  ) { }

  ngAfterViewInit() {
    
  } 

  ngOnInit(): void {
      this.getEmployeeList()
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(EmpAddEditComponent)
    dialogRef.afterClosed().subscribe({
      next: (val) =>{
        if(val) {
          this.getEmployeeList()
        }
      }
    })
  }

  getEmployeeList() {
    this._empService.getEmployee().subscribe({
      next: (res) =>{
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      },
      error: console.log,
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if(this.dataSource.paginator) this.dataSource.paginator.firstPage()
  }

  deleteEmployee(id: number) {
    this._empService.deleteEmployee(id).subscribe({
      next: (res) =>{
        this._coreService.openSnackBar('Employee deleted!', 'done')
        this.getEmployeeList()
      },
      error: console.log
    })
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data
    })
    dialogRef.afterClosed().subscribe({
      next: (val) =>{
        if(val) {
          this.getEmployeeList()
        }
      }
    })
  }
}
