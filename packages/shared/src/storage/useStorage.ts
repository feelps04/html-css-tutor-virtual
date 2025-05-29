import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useState } from 'react';

export function useStorage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const db = getFirestore();
  const storage = getStorage();
  
  // Upload file to Firebase Storage
  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      
      setLoading(false);
      return downloadUrl;
    } catch (e) {
      setLoading(false);
      const errorMessage = (e as Error).message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Delete file from Firebase Storage
  const deleteFile = async (path: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      
      setLoading(false);
    } catch (e) {
      setLoading(false);
      const errorMessage = (e as Error).message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  return {
    uploadFile,
    deleteFile,
    loading,
    error
  };
}

