// store/paperworksSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Paperwork {
  id: string;
  paperwork_name: string;
  // Ajoutez d'autres propriétés du paperwork si nécessaire
}

interface PaperworksState {
  paperworks: Paperwork[];
  loading: boolean;
}

const initialState: PaperworksState = {
  paperworks: [],
  loading: false,
};

const paperworksSlice = createSlice({
  name: 'paperworks',
  initialState,
  reducers: {
    setPaperworks(state, action: PayloadAction<Paperwork[]>) {
      state.paperworks = action.payload;
    },
    addPaperwork(state, action: PayloadAction<Paperwork>) {
      state.paperworks.push(action.payload);
    },
    updatePaperwork(state, action: PayloadAction<Paperwork>) {
      const index = state.paperworks.findIndex(paperwork => paperwork.id === action.payload.id);
      if (index !== -1) {
        state.paperworks[index] = action.payload;
      }
    },
    removePaperwork(state, action: PayloadAction<string>) {
      state.paperworks = state.paperworks.filter(paperwork => paperwork.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setPaperworks, addPaperwork, updatePaperwork, removePaperwork, setLoading } = paperworksSlice.actions;
export default paperworksSlice.reducer;
