import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { HomeComponent } from '../home/home.component';
import { TestingComponent } from '../testing/testing.component';
import { TableComponent } from '../table/table.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent,
            },
        ]
    },
    {
        path: 'testing',
        component: TestingComponent        
    },
    {
        path: 'table',
        component: TableComponent        
    }
];
