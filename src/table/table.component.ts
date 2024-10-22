import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  products: any[] = [
    { code: 'P001', name: 'Product 1', category: 'Electronics', quantity: Math.floor(Math.random() * 100) + 1 },
    { code: 'P002', name: 'Product 2', category: 'Clothing', quantity: Math.floor(Math.random() * 100) + 1 },
    { code: 'P003', name: 'Product 3', category: 'Food', quantity: Math.floor(Math.random() * 100) + 1 },
    { code: 'P004', name: 'Product 4', category: 'Books', quantity: Math.floor(Math.random() * 100) + 1 },
    { code: 'P005', name: 'Product 5', category: 'Electronics', quantity: Math.floor(Math.random() * 100) + 1 },
    { code: 'P006', name: 'Product 6', category: 'Clothing', quantity: Math.floor(Math.random() * 100) + 1 },
    { code: 'P007', name: 'Product 7', category: 'Food', quantity: Math.floor(Math.random() * 100) + 1 },
    { code: 'P008', name: 'Product 8', category: 'Books', quantity: Math.floor(Math.random() * 100) + 1 },
    { code: 'P009', name: 'Product 9', category: 'Electronics', quantity: Math.floor(Math.random() * 100) + 1 },
    { code: 'P010', name: 'Product 10', category: 'Clothing', quantity: Math.floor(Math.random() * 100) + 1 }
  ];

}
