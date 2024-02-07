import { createAction } from '@ngrx/store';
import { Action } from '@ngrx/store';

export const SET_LIST_KONTAINER_TOTAL = '[Dashboard] Set List Kontainer Total';
export const FETCH_LIST_KONTAINER_TOTAL =
  '[Dashboard] Fetch List Kontainer Total';

export const SET_LIST_KONTAINER_SATUAN =
  '[Dashboard] Set List Kontainer Satuan';
export const FETCH_LIST_KONTAINER_SATUAN =
  '[Dashboard] Fetch List Kontainer Satuan';

export class SetListKontainerTotal implements Action {
  readonly type = SET_LIST_KONTAINER_TOTAL;
  constructor(public payload: any[]) {}
}

export class FetchListKontainerTotal implements Action {
  readonly type = FETCH_LIST_KONTAINER_TOTAL;
}

export class SetListKontainerSatuan implements Action {
  readonly type = SET_LIST_KONTAINER_SATUAN;
  constructor(public payload: any[]) {}
}

export class FetchListKontainerSatuan implements Action {
  readonly type = FETCH_LIST_KONTAINER_SATUAN;
}

export type DashboardActions =
  | SetListKontainerTotal
  | FetchListKontainerTotal
  | SetListKontainerSatuan
  | FetchListKontainerSatuan;
