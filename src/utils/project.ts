// utils.js

import { db } from '@/firebase';

export const calculateProgress = (item) => {
  const totalFields = Object.keys(item).filter(key => !['id', 'image', 'progress'].includes(key)).length;
  const filledFields = Object.keys(item).filter(key => !['id', 'image', 'progress'].includes(key) && item[key] !== '' && item[key] !== null).length;
  return Math.floor((filledFields / totalFields) * 100);
};

export const synchronizeContextWithTemplates = (context, templates) => {
  return templates.map(template => {
    const updatedTemplate = { ...template };
    Object.keys(context).forEach(key => {
      if (updatedTemplate.hasOwnProperty(key)) {
        updatedTemplate[key] = context[key];
      }
    });
    updatedTemplate.progress = calculateProgress(updatedTemplate);
    return updatedTemplate;
  });
};

export const fetchTemplatesFromFirestore = async () => {
  const templatesSnapshot = await db.collection('templates').get();
  return templatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateProjectContextInFirestore = async (projectId, context) => {
  try {
    await db.collection('projects').doc(projectId).update({
      context: context
    });
    console.log('Project context updated successfully');
  } catch (error) {
    console.error('Error updating project context: ', error);
  }
};

export const fetchProjectsFromFirestore = async (user) => {
  const projectsSnapshot = await db.collection('projects')
    .where('users', 'array-contains', user.uid)
    .get();
  return projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
