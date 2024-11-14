import { Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { HomeComponent } from '../home/home.component';
import { TableComponent } from '../table/table.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { authGuard } from '../guard/auth.guard';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { ConferenceManagementComponent } from '../conference-management/conference-management.component';
import { ConferenceComponent } from '../conference/conference.component';
import { UserComponent } from '../user/user.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/calendar',
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
        path: 'calendar',
        component: LayoutComponent
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
        path: 'admin-dashboard',
        component: AdminDashboardComponent
    },
    {
        path: 'conference-management',
        component: ConferenceManagementComponent,
        canActivate: [authGuard],
        data: { roles: ['AdminRole'] } 
    },
    {
        path: 'conference',
        component: ConferenceComponent,
        canActivate: [authGuard],
        data: { roles: ['AdminRole'] } 
    },
    {
        path: 'user',
        component: UserComponent,
        canActivate: [authGuard],
        data: { roles: ['SuperAdmin'] } 
    }
];
