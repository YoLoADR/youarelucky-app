'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setPaperworks, addPaperwork, updatePaperwork, removePaperwork, setLoading } from '@/store/paperworksSlice';
import {
  Box, Button, Input, Stack, Text, IconButton
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

export default function ProjectPaperworks({ activeProject }) {
  const dispatch = useDispatch();
  const paperworks = useSelector((state: RootState) => state.paperworks.paperworks);
  const loading = useSelector((state: RootState) => state.paperworks.loading);
  const [paperworkName, setPaperworkName] = useState('');
  const [editingPaperwork, setEditingPaperwork] = useState(null);

  useEffect(() => {
    if (activeProject) {
      fetchPaperworks();
    }
  }, [activeProject]);

  const fetchPaperworks = async () => {
    dispatch(setLoading(true));
    if (activeProject) {
      const paperworksSnapshot = await db.collection('projects')
        .doc(activeProject.id)
        .collection('paperworks')
        .get();
  
      const paperworksData = paperworksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      dispatch(setPaperworks(paperworksData));
    } else {
      dispatch(setPaperworks([]));
    }
    dispatch(setLoading(false));
  };

  const handleCreatePaperwork = async () => {
    if (paperworkName && activeProject) {
      const newPaperwork = {
        paperwork_name: paperworkName,
        // Ajoutez d'autres données nécessaires pour le paperwork
      };
  
      const paperworkDocRef = await db.collection('projects')
        .doc(activeProject.id)
        .collection('paperworks')
        .add(newPaperwork);
  
      dispatch(addPaperwork({ id: paperworkDocRef.id, ...newPaperwork }));
      setPaperworkName('');
    }
  };
  

  const handleEditPaperwork = (paperwork) => {
    setEditingPaperwork(paperwork);
    setPaperworkName(paperwork.paperwork_name);
  };

  const handleSavePaperwork = async () => {
    if (editingPaperwork && editingPaperwork.id && activeProject) {
      const paperworkDocRef = db.collection('projects')
        .doc(activeProject.id)
        .collection('paperworks')
        .doc(editingPaperwork.id);
      
      await paperworkDocRef.update({
        paperwork_name: paperworkName,
        // Mettez à jour d'autres données nécessaires pour le paperwork
      });
  
      dispatch(updatePaperwork({ id: editingPaperwork.id, paperwork_name: paperworkName }));
      setEditingPaperwork(null);
      setPaperworkName('');
    }
  };
  

  const handleDeletePaperwork = async (paperworkId) => {
    if (activeProject) {
      await db.collection('projects')
        .doc(activeProject.id)
        .collection('paperworks')
        .doc(paperworkId)
        .delete();
  
      dispatch(removePaperwork(paperworkId));
    }
  };

  return (
    <Box mt={10}>
      <h2>Paperworks for Project: {activeProject.title}</h2>

      {editingPaperwork ? (
        <Box>
          <Input
            placeholder="Paperwork Name"
            value={paperworkName}
            onChange={(e) => setPaperworkName(e.target.value)}
            mb={4}
          />
          <Button onClick={handleSavePaperwork}>Save Paperwork</Button>
        </Box>
      ) : (
        <Box>
          <Input
            placeholder="Paperwork Name"
            value={paperworkName}
            onChange={(e) => setPaperworkName(e.target.value)}
            mb={4}
          />
          <Button onClick={handleCreatePaperwork}>Create Paperwork</Button>
        </Box>
      )}

      <Stack mt={5}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          paperworks.map((paperwork) => (
            <Box
              key={paperwork.id}
              p={5}
              shadow="md"
              borderWidth="1px"
              cursor="pointer"
              onClick={() => handleEditPaperwork(paperwork)}
            >
              <Text fontWeight="bold">{paperwork.paperwork_name}</Text>
              {/* Ajoutez d'autres données du paperwork ici */}
              <IconButton
                aria-label="Delete paperwork"
                icon={<DeleteIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePaperwork(paperwork.id);
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
