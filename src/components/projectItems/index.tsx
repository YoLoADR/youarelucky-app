'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setItems, addItem, updateItem, removeItem, setLoading } from '@/store/itemsSlice';
import {
  Box, Button, Input, Stack, Text, IconButton
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

export default function ProjectItems({ activeProject }) {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.items.items);
  const loading = useSelector((state: RootState) => state.items.loading);
  const [itemName, setItemName] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (activeProject) {
      fetchItems();
    }
  }, [activeProject]);

  const fetchItems = async () => {
    dispatch(setLoading(true));
    if (activeProject) {
      const itemsSnapshot = await db.collection('projects')
        .doc(activeProject.id)
        .collection('items')
        .get();
  
      const itemsData = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dispatch(setItems(itemsData));
    } else {
      dispatch(setItems([]));
    }
    dispatch(setLoading(false));
  };

  const handleCreateItem = async () => {
    if (itemName && activeProject) {
      const newItem = {
        item_name: itemName,
        // Ajoutez d'autres données nécessaires pour l'item
      };
  
      const itemDocRef = await db.collection('projects')
        .doc(activeProject.id)
        .collection('items')
        .add(newItem);
  
      dispatch(addItem({ id: itemDocRef.id, ...newItem }));
      setItemName('');
    }
  };
  

  const handleEditItem = (item) => {
    setEditingItem(item);
    setItemName(item.item_name);
  };

  const handleSaveItem = async () => {
    if (editingItem && editingItem.id && activeProject) {
      const itemDocRef = db.collection('projects')
        .doc(activeProject.id)
        .collection('items')
        .doc(editingItem.id);
      
      await itemDocRef.update({
        item_name: itemName,
        // Mettez à jour d'autres données nécessaires pour l'item
      });
  
      dispatch(updateItem({ id: editingItem.id, item_name: itemName }));
      setEditingItem(null);
      setItemName('');
    }
  };
  

  const handleDeleteItem = async (itemId) => {
    if (activeProject) {
      await db.collection('projects')
        .doc(activeProject.id)
        .collection('items')
        .doc(itemId)
        .delete();
  
      dispatch(removeItem(itemId));
    }
  };

  return (
    <Box mt={10}>
      <h2>Items for Project: {activeProject.title}</h2>

      {editingItem ? (
        <Box>
          <Input
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            mb={4}
          />
          <Button onClick={handleSaveItem}>Save Item</Button>
        </Box>
      ) : (
        <Box>
          <Input
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            mb={4}
          />
          <Button onClick={handleCreateItem}>Create Item</Button>
        </Box>
      )}

      <Stack mt={5}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          items.map((item) => (
            <Box
              key={item.id}
              p={5}
              shadow="md"
              borderWidth="1px"
              cursor="pointer"
              onClick={() => handleEditItem(item)}
            >
              <Text fontWeight="bold">{item.item_name}</Text>
              {/* Ajoutez d'autres données de l'item ici */}
              <IconButton
                aria-label="Delete item"
                icon={<DeleteIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id);
                }}
                ml={2}
              />
            </Box>
          ))
        )}
      </Stack>
    </Box>
  );
}
