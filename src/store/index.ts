// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import itemsReducer from './itemsSlice';
import activeProjectReducer from './activeProjectSlice';
import projectsReducer, { setActiveProject } from './projectSlice';
import paperworksReducer from './paperworksSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    items: itemsReducer,
    paperworks: paperworksReducer,
    activeProject: activeProjectReducer,
    projects: projectsReducer,
  },
});

// Récupérer l'état de activeProject depuis localStorage
// Vérifier si nous sommes côté client avant d'accéder à localStorage
if (typeof window !== 'undefined') {
  const activeProject = localStorage.getItem('activeProject');
  if (activeProject) {
    store.dispatch(setActiveProject(JSON.parse(activeProject)));
  }
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
