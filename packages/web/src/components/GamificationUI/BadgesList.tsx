import { useState } from 'react';
import { Badge } from '@html-css-tutor/shared';
import { formatFriendlyDate } from '@html-css-tutor/shared';

interface BadgesListProps {
  badges: Badge[];
  unlockedBadges: Badge[];
}

const BadgesList = ({ badges, unlockedBadges }: BadgesListProps) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  
  // Find the ID of unlocked badges
  const unlockedBadgeIds = unlockedBadges.map(badge => badge.id);
  
  // Handle badge click
  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
  };
  
  // Close badge detail
  const closeBadgeDetail = () => {
    setSelectedBadge(null);
  };
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Conquistas</h2>
      
      {/* Badge grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {badges.map(badge => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);
          const unlockedBadge = unlockedBadges.find(b => b.id === badge.id);
          
          return (
            <div 
              key={badge.id} 
              className={`
                relative p-4 border rounded-lg cursor-pointer transition-all 
                ${isUnlocked 
                  ? 'border-green-200 bg-green-50 hover:shadow-md' 
                  : 'border-gray-200 bg-gray-50 opacity-70'
                }
              `}
              onClick={() => handleBadgeClick(isUnlocked ? unlockedBadge || badge : badge)}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-2 relative">
                  <img 
                    src={badge.imageUrl} 
                    alt={badge.name}
                    className={`w-full h-full object-contain ${!isUnlocked ? 'grayscale' : ''}`}
                  />
                  
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">🔒</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-sm font-semibold text-center">{badge.name}</h3>
                
                {isUnlocked && unlockedBadge?.unlockedAt && (
                  <p className="text-xs text-green-600 mt-1">
                    Desbloqueado {formatFriendlyDate(unlockedBadge.unlockedAt)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Badge detail modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedBadge.name}</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={closeBadgeDetail}
              >
                ✕
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-4">
              <img 
                src={selectedBadge.imageUrl} 
                alt={selectedBadge.name}
                className="w-24 h-24 object-contain mb-4"
              />
              
              <p className="text-center text-gray-700">{selectedBadge.description}</p>
              
              {selectedBadge.unlockedAt ? (
                <p className="mt-4 text-sm text-green-600">
                  Desbloqueado em {formatFriendlyDate(selectedBadge.unlockedAt)}
                </p>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  Complete os requisitos para desbloquear esta conquista
                </p>
              )}
            </div>
            
            <div className="text-center">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={closeBadgeDetail}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesList;

