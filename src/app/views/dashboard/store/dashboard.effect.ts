import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions'
import * as fromApp from '../../../store/app.reducer'
import { switchMap } from 'rxjs/operators';
import { DashboardService } from '../dashboard.service';

@Injectable()
export class DashboardEffects {
    constructor(private actions$: Actions, private dashboardService: DashboardService, private store: Store<fromApp.AppState>) {}

    @Effect()
    fetchKontainerTotal = this.actions$.pipe(
        ofType(DashboardActions.FETCH_LIST_KONTAINER_TOTAL),
        switchMap(() => {
            return this.dashboardService.totalKontainerPerBulan(this.store.)
        })
    )
}