import { useState } from 'react';
import { Challenge } from '@html-css-tutor/shared';
import { formatTimeAgo, formatFriendlyDate } from '@html-css-tutor/shared';

interface ChallengesListProps {
  challenges: Challenge[];
  completedChallenges: string[];
  onCompleteChallenge: (challengeId: string) => void;
}

const ChallengesList = ({ 
  challenges, 
  completedChallenges, 
  onCompleteChallenge 
}: ChallengesListProps) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  
  // Calculate time remaining for a challenge
  const getTimeRemaining = (endDate: Date): string => {
    const now = new Date();
    const end = new Date(endDate);
    
    if (now > end) {
      return 'Expirado';
    }
    
    const diffMs = end.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} horas restantes`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} dias restantes`;
  };
  
  // Group challenges by type
  const dailyChallenges = challenges.filter(c => c.type === 'daily');
  const weeklyChallenges = challenges.filter(c => c.type === 'weekly');
  const specialChallenges = challenges.filter(c => c.type === 'special');
  
  // Open challenge detail
  const openChallengeDetail = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };
  
  // Close challenge detail
  const closeChallengeDetail = () => {
    setSelectedChallenge(null);
  };
  
  // Handle challenge completion
  const handleCompleteChallenge = (challengeId: string) => {
    onCompleteChallenge(challengeId);
    setSelectedChallenge(null);
  };
  
  // Challenge difficulty badge
  const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    
    const label = {
      easy: 'Fácil',
      medium: 'Médio',
      hard: 'Difícil'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[difficulty as keyof typeof colors]}`}>
        {label[difficulty as keyof typeof label]}
      </span>
    );
  };
  
  // Render a challenge card
  const renderChallengeCard = (challenge: Challenge) => {
    const isCompleted = completedChallenges.includes(challenge.id);
    
    return (
      <div 
        key={challenge.id}
        className={`
          border rounded-lg p-4 mb-3 cursor-pointer hover:shadow-md transition-all
          ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}
        `}
        onClick={() => openChallengeDetail(challenge)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{challenge.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{challenge.description}</p>
          </div>
          
          <DifficultyBadge difficulty={challenge.difficulty} />
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="text-sm text-gray-500">
            {isCompleted ? (
              <span className="text-green-600">✓ Completado</span>
            ) : (
              <span>{getTimeRemaining(challenge.endDate)}</span>
            )}
          </div>
          
          <div className="text-sm font-medium">
            {challenge.experienceReward} XP
          </div>
        </div>
        
        {challenge.badgeReward && (
          <div className="mt-2 flex items-center text-sm text-blue-600">
            <span className="mr-1">🏆</span>
            <span>Recompensa: {challenge.badgeReward.name}</span>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Desafios</h2>
      
      {/* Daily challenges */}
      {dailyChallenges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Desafios Diários</h3>
          {dailyChallenges.map(renderChallengeCard)}
        </div>
      )}
      
      {/* Weekly challenges */}
      {weeklyChallenges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Desafios Semanais</h3>
          {weeklyChallenges.map(renderChallengeCard)}
        </div>
      )}
      
      {/* Special challenges */}
      {specialChallenges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Desafios Especiais</h3>
          {specialChallenges.map(renderChallengeCard)}
        </div>
      )}
      
      {/* No challenges message */}
      {challenges.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Não há desafios disponíveis no momento.</p>
          <p className="mt-2">Volte mais tarde para novos desafios!</p>
        </div>
      )}
      
      {/* Challenge detail modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{selectedChallenge.title}</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={closeChallengeDetail}
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <DifficultyBadge difficulty={selectedChallenge.difficulty} />
                <span className="text-sm text-gray-500">
                  Termina em {formatFriendlyDate(selectedChallenge.endDate)}
                </span>
              </div>
              
              <p className="text-gray-700 mb-4">{selectedChallenge.description}</p>
              
              <h4 className="font-semibold mb-2">Requisitos:</h4>
              <ul className="list-disc pl-5 mb-4">
                {selectedChallenge.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">{req}</li>
                ))}
              </ul>
              
              <div className="flex justify-between items-center mb-4">
                <div className="text-blue-600 font-medium">
                  Recompensa: {selectedChallenge.experienceReward} XP
                </div>
                
                {selectedChallenge.badgeReward && (
                  <div className="flex items-center">
                    <span className="mr-2">Badge:</span>
                    <img 
                      src={selectedChallenge.badgeReward.imageUrl} 
                      alt={selectedChallenge.badgeReward.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                onClick={closeChallengeDetail}
              >
                Fechar
              </button>
              
              {!completedChallenges.includes(selectedChallenge.id) && (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleCompleteChallenge(selectedChallenge.id)}
                >
                  Marcar como Concluído
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengesList;

