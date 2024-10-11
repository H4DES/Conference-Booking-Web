import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { HomeComponent } from '../home/home.component';

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
    }
];
