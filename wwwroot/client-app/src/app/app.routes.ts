import { Routes } from '@angular/router';

export const routes: Routes = [

  // 🌍 Public
  //{
  //  path: '',
  //  loadChildren: () =>
  //    import('./modules/public/public.routes')
  //      .then(r => r.PUBLIC_ROUTES)
  //},

  // 🔐 Private
  {
    path: '',
    loadChildren: () =>
      import('./modules/private/private.routes')
        .then(r => r.PRIVATE_ROUTES)
  }

  // ❌ 404
  //{
  //  path: '**',
  //  loadComponent: () =>
  //    import('./shared/not-found/not-found.component')
  //      .then(c => c.NotFoundComponent)
  //}
];
