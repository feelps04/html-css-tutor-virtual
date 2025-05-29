import { useState } from 'react';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc, updateDoc, orderBy, limit } from 'firebase/firestore';
import { CodeProject } from '../types';

export function useCodeProjects() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const db = getFirestore();
  const projectsCollection = collection(db, 'codeProjects');
  
  // Create a new code project
  const createProject = async (project: Omit<CodeProject, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views'>): Promise<CodeProject> => {
    try {
      setLoading(true);
      setError(null);
      
      const newProjectRef = doc(projectsCollection);
      const now = new Date();
      
      const newProject: CodeProject = {
        ...project,
        id: newProjectRef.id,
        createdAt: now,
        updatedAt: now,
        likes: 0,
        views: 0
      };
      
      await setDoc(newProjectRef, newProject);
      
      setLoading(false);
      return newProject;
    } catch (e) {
      setLoading(false);
      const errorMessage = (e as Error).message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Get a code project by ID
  const getProject = async (id: string): Promise<CodeProject | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const projectRef = doc(projectsCollection, id);
      const projectSnap = await getDoc(projectRef);
      
      setLoading(false);
      
      if (projectSnap.exists()) {
        return projectSnap.data() as CodeProject;
      } else {
        return null;
      }
    } catch (e) {
      setLoading(false);
      const errorMessage = (e as Error).message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Update a code project
  const updateProject = async (id: string, updates: Partial<CodeProject>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const projectRef = doc(projectsCollection, id);
      
      // Add updatedAt timestamp
      const updatedData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(projectRef, updatedData);
      
      setLoading(false);
    } catch (e) {
      setLoading(false);
      const errorMessage = (e as Error).message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Delete a code project
  const deleteProject = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const projectRef = doc(projectsCollection, id);
      await deleteDoc(projectRef);
      
      setLoading(false);
    } catch (e) {
      setLoading(false);
      const errorMessage = (e as Error).message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Get user's projects
  const getUserProjects = async (userId: string): Promise<CodeProject[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(
        projectsCollection, 
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const projects: CodeProject[] = [];
      
      querySnapshot.forEach(doc => {
        projects.push(doc.data() as CodeProject);
      });
      
      setLoading(false);
      return projects;
    } catch (e) {
      setLoading(false);
      const errorMessage = (e as Error).message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Get public projects for community
  const getPublicProjects = async (limitCount = 10): Promise<CodeProject[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(
        projectsCollection, 
        where('isPublic', '==', true),
        orderBy('likes', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const projects: CodeProject[] = [];
      
      querySnapshot.forEach(doc => {
        projects.push(doc.data() as CodeProject);
      });
      
      setLoading(false);
      return projects;
    } catch (e) {
      setLoading(false);
      const errorMessage = (e as Error).message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Increment view count
  const incrementViews = async (id: string): Promise<void> => {
    try {
      const projectRef = doc(projectsCollection, id);
      await updateDoc(projectRef, {
        views: updateDoc.increment(1)
      });
    } catch (e) {
      // Silent fail for view increments
      console.error('Failed to increment views:', e);
    }
  };
  
  // Like a project
  const likeProject = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const projectRef = doc(projectsCollection, id);
      await updateDoc(projectRef, {
        likes: updateDoc.increment(1)
      });
      
      setLoading(false);
    } catch (e) {
      setLoading(false);
      const errorMessage = (e as Error).message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  return {
    createProject,
    getProject,
    updateProject,
    deleteProject,
    getUserProjects,
    getPublicProjects,
    incrementViews,
    likeProject,
    loading,
    error
  };
}

