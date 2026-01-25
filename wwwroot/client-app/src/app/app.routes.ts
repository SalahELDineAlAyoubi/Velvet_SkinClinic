import { Routes } from '@angular/router';
import { PUBLIC_ROUTES } from './modules/public/public.routes';
import { PRIVATE_ROUTES } from './modules/private/private.routes';
import { redirectGuard } from './core/guards/redirect.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'   
  },
  ...PUBLIC_ROUTES,   
  ...PRIVATE_ROUTES,
    {
      path: '**',    
      redirectTo: 'login'
  } 
];
  
//export const routes: Routes = [
//  {
//    path: '',
//    loadChildren: () => import('./modules/public/public.routes').then(r => r.PUBLIC_ROUTES)
//  },
//  {
//    path: '',
//    loadChildren: () => import('./modules/private/private.routes').then(r => r.PRIVATE_ROUTES)
//  } ,
//  //{
//  //  path: '**',
//  //  redirectTo: 'login',
//  //  canActivate: [redirectGuard]
//  //}
//];
