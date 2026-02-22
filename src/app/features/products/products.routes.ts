import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';
import { authGuard } from '../../core/guards/auth-guard';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/list/list').then(m => m.List),
    canActivate: [authGuard]
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/create/create').then(m => m.Create),
    canActivate: [authGuard]
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/detail/detail').then(m => m.Detail),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/edit/edit').then(m => m.Edit),
    canActivate: [authGuard, adminGuard]
  }
];
