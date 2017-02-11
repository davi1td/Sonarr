import { createAction } from 'redux-actions';
import * as types from './actionTypes';
import interactiveImportActionHandlers from './interactiveImportActionHandlers';

export const fetchInteractiveImportItems = interactiveImportActionHandlers[types.FETCH_MANUAL_IMPORT_ITEMS];
export const setInteractiveImportSort = createAction(types.SET_MANUAL_IMPORT_SORT);
export const updateInteractiveImportItem = createAction(types.UPDATE_MANUAL_IMPORT_ITEM);
export const clearInteractiveImport = createAction(types.CLEAR_MANUAL_IMPORT);
export const addRecentFolder = createAction(types.ADD_RECENT_FOLDER);
export const removeRecentFolder = createAction(types.REMOVE_RECENT_FOLDER);
