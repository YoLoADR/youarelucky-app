// firebaseServices.js
import { db } from '../firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Create a new project
export async function createProject(project) {
  const projectsCollection = collection(db, 'projects');
  const docRef = await addDoc(projectsCollection, project);
  return docRef.id;
}

// Read all projects
export async function getProjects() {
  const projectsCollection = collection(db, 'projects');
  const projectsSnapshot = await getDocs(projectsCollection);
  const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return projectsList;
}

// Update a project
export async function updateProject(projectId, updatedProject) {
    const projectDoc = doc(db, 'projects', projectId);
    await updateDoc(projectDoc, updatedProject);
}

// Delete a project
export async function deleteProject(projectId) {
  const projectDoc = doc(db, 'projects', projectId);
  await deleteDoc(projectDoc);
}

// Create a new document
export async function createDocument(projectId, document) {
  const documentsCollection = collection(db, `projects/${projectId}/documents`);
  const docRef = await addDoc(documentsCollection, document);
  return docRef.id;
}

// Read all documents in a project
export async function getDocuments(projectId) {
  const documentsCollection = collection(db, `projects/${projectId}/documents`);
  const documentsSnapshot = await getDocs(documentsCollection);
  const documentsList = documentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return documentsList;
}

// Update a document
export async function updateDocument(projectId, documentId, updatedDocument) {
    const documentDoc = doc(db, `projects/${projectId}/documents`, documentId);
    await updateDoc(documentDoc, updatedDocument);
}

// Delete a document
export async function deleteDocument(projectId, documentId) {
  const documentDoc = doc(db, `projects/${projectId}/documents`, documentId);
  await deleteDoc(documentDoc);
}
