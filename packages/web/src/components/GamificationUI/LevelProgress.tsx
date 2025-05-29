import React from 'react';

interface LevelProgressProps {
  level: number;
  experience: number;
  nextLevelExperience: number;
}

const LevelProgress = ({ level, experience, nextLevelExperience }: LevelProgressProps) => {
  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.floor((experience / nextLevelExperience) * 100),
    100
  );
  
  // Experience remaining to next level
  const remainingXP = nextLevelExperience - experience;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">Nível {level}</h3>
        <span className="text-sm text-gray-600">
          {experience} / {nextLevelExperience} XP
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="mt-2 text-sm text-gray-500">
        {remainingXP > 0 
          ? `Faltam ${remainingXP} XP para o próximo nível`
          : 'Você atingiu o nível máximo!'
        }
      </div>
    </div>
  );
};

export default LevelProgress;

