import * as DashboardActions from './dashboard.actions';

export interface DashboardState {
  tahun: number;
  listKontainerSatuan: any[];
  listKontainerTotal: any[];
}

const initialState: DashboardState = {
  tahun: new Date().getFullYear(),
  listKontainerSatuan: [],
  listKontainerTotal: [],
};

export function dashboardReducer(
  state = initialState,
  action: DashboardActions.DashboardActions
) {
  switch (action.type) {
    case DashboardActions.SET_LIST_KONTAINER_TOTAL:
      return {
        ...state,
        listKontainerTotal: [...action.payload],
      };
    case DashboardActions.SET_LIST_KONTAINER_SATUAN:
      return {
        ...state,
        listKontainerSatuan: [...action.payload],
      };
  }
}
