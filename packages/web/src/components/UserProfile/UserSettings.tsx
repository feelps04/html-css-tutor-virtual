import React, { useState } from 'react';
import { UserProfile, UserPreferences } from '@html-css-tutor/shared';

interface UserSettingsProps {
  profile: UserProfile;
  onUpdatePreferences: (preferences: UserPreferences) => Promise<void>;
}

const UserSettings = ({ profile, onUpdatePreferences }: UserSettingsProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>(profile.preferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Handle preference change
  const handlePreferenceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
    
    // Reset saved status when changes are made
    setSaved(false);
  };
  
  // Save preferences
  const savePreferences = async () => {
    setSaving(true);
    try {
      await onUpdatePreferences(preferences);
      setSaved(true);
      
      // Reset saved notification after 3 seconds
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-4">Configurações</h2>
      
      <div className="space-y-4">
        {/* Theme selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tema
          </label>
          <select
            name="theme"
            value={preferences.theme}
            onChange={handlePreferenceChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
            <option value="high-contrast">Alto Contraste</option>
          </select>
        </div>
        
        {/* Difficulty level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nível de Dificuldade
          </label>
          <select
            name="difficulty"
            value={preferences.difficulty}
            onChange={handlePreferenceChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="beginner">Iniciante</option>
            <option value="intermediate">Intermediário</option>
            <option value="advanced">Avançado</option>
          </select>
        </div>
        
        {/* Notifications toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Notificações
          </label>
          <div className="relative inline-block w-10 mr-2 align-middle">
            <input
              type="checkbox"
              name="notifications"
              id="notifications"
              checked={preferences.notifications}
              onChange={handlePreferenceChange}
              className="sr-only"
            />
            <label
              htmlFor="notifications"
              className={`block h-6 w-10 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
                preferences.notifications ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`block h-4 w-4 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white transform ${
                  preferences.notifications ? 'translate-x-4' : ''
                }`}
              />
            </label>
          </div>
        </div>
        
        {/* Study reminders toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Lembretes de Estudo
          </label>
          <div className="relative inline-block w-10 mr-2 align-middle">
            <input
              type="checkbox"
              name="studyReminders"
              id="studyReminders"
              checked={preferences.studyReminders}
              onChange={handlePreferenceChange}
              className="sr-only"
            />
            <label
              htmlFor="studyReminders"
              className={`block h-6 w-10 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
                preferences.studyReminders ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`block h-4 w-4 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white transform ${
                  preferences.studyReminders ? 'translate-x-4' : ''
                }`}
              />
            </label>
          </div>
        </div>
        
        {/* Auto-save code toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Auto-salvar Código
          </label>
          <div className="relative inline-block w-10 mr-2 align-middle">
            <input
              type="checkbox"
              name="autoSaveCode"
              id="autoSaveCode"
              checked={preferences.autoSaveCode}
              onChange={handlePreferenceChange}
              className="sr-only"
            />
            <label
              htmlFor="autoSaveCode"
              className={`block h-6 w-10 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${
                preferences.autoSaveCode ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`block h-4 w-4 mt-1 ml-1 rounded-full transition-transform duration-300 ease-in-out bg-white transform ${
                  preferences.autoSaveCode ? 'translate-x-4' : ''
                }`}
              />
            </label>
          </div>
        </div>
        
        {/* Save button */}
        <div className="mt-6">
          <button
            className={`w-full py-2 rounded-md ${
              saving 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            onClick={savePreferences}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
          
          {saved && (
            <p className="text-green-500 text-center mt-2">
              ✓ Configurações salvas com sucesso!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;

