import { environment } from './../../environments/environment.prod';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromAuth from '../core/login/store/auth.reducer';
import * as fromDashboard from '../views/dashboard/store/dashboard.reducer';

import { storeFreeze } from 'ngrx-store-freeze';

export interface AppState {
  auth: fromAuth.AuthState;
  dashboard: fromDashboard.DashboardState;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  dashboard: fromDashboard.dashboardReducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [storeFreeze]
  : [];
