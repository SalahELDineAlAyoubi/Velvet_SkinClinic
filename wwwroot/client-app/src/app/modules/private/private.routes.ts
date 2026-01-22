import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../core/layouts/private-layout/private-layout.component')
        .then(c => c.PrivateLayoutComponent),
    canActivateChild: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component')
            .then(c => c.DashboardComponent)
      },
      {
        path: 'statistics',
        loadComponent: () =>
          import('./monthly-states/monthly-states.component')
            .then(c => c.MonthlyStatesComponent)
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./services/services.component')
            .then(c => c.ServicesComponent)
      },
      {
        path: 'clients/:id',
        loadComponent: () =>
          import('./details-client/details-client.component')
            .then(c => c.DetailsClientComponent)
      },
      //{
      //  path: 'profile',
      //  loadComponent: () =>
      //    import('./profile/profile.component')
      //      .then(c => c.ProfileComponent)
      //}
    ]
  }
];

