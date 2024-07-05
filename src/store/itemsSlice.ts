// store/itemsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Item {
  id: string;
  item_name: string;
  // Ajoutez d'autres propriétés d'item si nécessaire
}

interface ItemsState {
  items: Item[];
  loading: boolean;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Item[]>) {
      state.items = action.payload;
    },
    addItem(state, action: PayloadAction<Item>) {
      state.items.push(action.payload);
    },
    updateItem(state, action: PayloadAction<Item>) {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setItems, addItem, updateItem, removeItem, setLoading } = itemsSlice.actions;
export default itemsSlice.reducer;
