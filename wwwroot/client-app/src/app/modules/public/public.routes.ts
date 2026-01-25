import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('../../core/layouts/public-layout/public-layout.component')
        .then(c => c.PublicLayoutComponent),
    canActivateChild: [],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component')
            .then(c => c.LoginComponent)
      }
    ]
  }
];

