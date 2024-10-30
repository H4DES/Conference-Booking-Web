import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { HomeComponent } from '../home/home.component';
import { TestingComponent } from '../testing/testing.component';
import { TableComponent } from '../table/table.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { authGuard } from '../guard/auth.guard';
import { AdminComponent } from '../admin/admin.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AdminDashboardComponent,
        canActivate: [authGuard],
        data: { roles: ['UserRole'] },
        children: [
            {
                path: 'home',
                component: HomeComponent,
            }
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
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [authGuard],
        data: { roles: ['AdminRole'] } 
    }
];
