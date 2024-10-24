import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { HomeComponent } from '../home/home.component';
import { TestingComponent } from '../testing/testing.component';
import { TableComponent } from '../table/table.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { authGuard } from '../guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
    },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],    
        children: [
            {
                path: 'home',
                component: HomeComponent,
            },
        ]
    },
    {
        path: 'testing',
        component: TestingComponent,    
    },
    {
        path: 'table',
        component: TableComponent        
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    }
];
