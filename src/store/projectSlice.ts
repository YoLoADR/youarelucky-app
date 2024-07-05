// store/activeProjectSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Project {
  id: string;
  title?: string;
  description?: string;
  created_at?: string;
  paperworks?: [];
  // Ajoutez d'autres propriétés du projet si nécessaire
}

interface ProjectsState {
  activeProject: Project | null;
  projects: Project[];
}

const initialState: ProjectsState = {
  activeProject: null,
  projects: [],
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setActiveProject(state, action: PayloadAction<Project | null>) {
      state.activeProject = action.payload;
      if (action.payload) {
        localStorage.setItem('activeProject', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('activeProject');
      }
    },
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
    addProject(state, action: PayloadAction<Project>) {
      state.projects.push(action.payload);
    },
    removeProject(state, action: PayloadAction<string>) {
      state.projects = state.projects.filter(project => project.id !== action.payload);
    },
    updateProject(state, action: PayloadAction<Project>) {
      const index = state.projects.findIndex(project => project.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
  },
});

export const { setActiveProject, setProjects, addProject, removeProject, updateProject } = projectsSlice.actions;
export default projectsSlice.reducer;
