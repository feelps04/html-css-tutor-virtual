// Utility functions for localStorage to enable offline capabilities

// Set an item in localStorage with expiration
export const setWithExpiry = (key: string, value: any, ttl: number): void => {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

// Get an item from localStorage with expiration check
export const getWithExpiry = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  
  if (!itemStr) {
    return null;
  }
  
  const item = JSON.parse(itemStr);
  const now = new Date();
  
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  
  return item.value as T;
};

// Save code project to localStorage for offline access
export const saveProjectLocally = (projectId: string, projectData: any): void => {
  // 7 days TTL
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  setWithExpiry(`project_${projectId}`, projectData, sevenDays);
  
  // Update list of offline projects
  const offlineProjects = getOfflineProjects();
  if (!offlineProjects.includes(projectId)) {
    offlineProjects.push(projectId);
    localStorage.setItem('offline_projects', JSON.stringify(offlineProjects));
  }
};

// Get list of offline project IDs
export const getOfflineProjects = (): string[] => {
  const projectsStr = localStorage.getItem('offline_projects');
  return projectsStr ? JSON.parse(projectsStr) : [];
};

// Get offline project data
export const getOfflineProject = (projectId: string): any => {
  return getWithExpiry(`project_${projectId}`);
};

// Remove project from offline storage
export const removeOfflineProject = (projectId: string): void => {
  localStorage.removeItem(`project_${projectId}`);
  
  const offlineProjects = getOfflineProjects();
  const updatedProjects = offlineProjects.filter(id => id !== projectId);
  localStorage.setItem('offline_projects', JSON.stringify(updatedProjects));
};

