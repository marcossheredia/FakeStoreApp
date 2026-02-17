import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/list/list').then(m => m.List),
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
    canActivate: [adminGuard]
  }
];
