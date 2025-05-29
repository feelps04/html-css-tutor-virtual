import React from 'react';
import { UserProfile } from '@html-css-tutor/shared';
import { formatFriendlyDate } from '@html-css-tutor/shared';

interface ProfileCardProps {
  profile: UserProfile;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
          {profile.photoURL ? (
            <img 
              src={profile.photoURL} 
              alt={profile.displayName} 
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-blue-500">
              {profile.displayName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        {/* User info */}
        <div>
          <h2 className="text-xl font-bold">{profile.displayName}</h2>
          <p className="text-gray-600">{profile.email}</p>
          <div className="mt-1 text-sm text-gray-500">
            Membro desde {formatFriendlyDate(profile.createdAt)}
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{profile.level}</div>
          <div className="text-xs text-gray-500 mt-1">Nível</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{profile.completedLessons.length}</div>
          <div className="text-xs text-gray-500 mt-1">Lições Completadas</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{profile.badges.length}</div>
          <div className="text-xs text-gray-500 mt-1">Conquistas</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

