import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { CreateIndicatorComponent } from './key-indicators/create-indicator/create-indicator.component';
import { KeyIndicatorsComponent } from './key-indicators/key-indicators.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'key-indicators', component: KeyIndicatorsComponent },
  { path: 'key-indicators/create', component: CreateIndicatorComponent },
];
