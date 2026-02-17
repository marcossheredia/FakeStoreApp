import { Routes } from '@angular/router';
import { Forbidden } from './shared/components/forbidden/forbidden';
import { NotFound } from './shared/components/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features//home/home')
        .then(m => m.Home)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
  },

  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.routes')
        .then(m => m.PRODUCTS_ROUTES),
  },

  { path: 'forbidden', component: Forbidden },
  { path: '**', component: NotFound },

];
