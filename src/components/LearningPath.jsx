import React from 'react';

const LearningPath = ({ learningTopics, onTopicSelect, currentTopic, userName, userAvatar }) => {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 overflow-x-hidden" role="main" aria-label="Trilha de Aprendizado">
      {/* User Profile Section - Always visible */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-6 sm:mb-8 p-3 sm:p-4 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-sm">
        {userAvatar && (
          <img 
            src={userAvatar} 
            alt="Avatar do Usuário" 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-blue-500 dark:border-blue-400 object-cover"
          />
        )}
        <div className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
            Olá, {userName || 'Estudante'}!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Selecione um tópico abaixo para continuar sua jornada
          </p>
        </div>
      </div>
      
      {/* Learning Path Title - Centered for all screen sizes */}
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
          Sua Trilha de Aprendizado
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Clique em um tópico para começar a aprender
        </p>
      </div>
      
      {/* Mobile View (Stack) - Only shown on small screens */}
      <div className="sm:hidden">
        <div className="space-y-4 relative">
          {/* Vertical Line for mobile - shorter connection line */}
          <div className="absolute left-4 top-2 bottom-2 w-1 bg-blue-200 dark:bg-blue-900 rounded z-0"></div>
          
          {Object.entries(learningTopics).map(([key, topicInfo], index) => (
            <div
              key={key}
              onClick={() => onTopicSelect(key)}
              className={`
                relative ml-8 p-4 rounded-lg shadow-md transition-all duration-300 cursor-pointer z-10
                ${currentTopic === key 
                  ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 transform scale-[1.02]' 
                  : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                }
              `}
              role="button"
              aria-pressed={currentTopic === key ? 'true' : 'false'}
              aria-label={`Tópico: ${topicInfo.name}`}
            >
              {/* Circle marker for mobile */}
              <div className={`
                absolute left-0 top-1/2 transform -translate-x-[16px] -translate-y-1/2 w-6 h-6 rounded-full z-20 flex items-center justify-center
                border-2 border-white dark:border-gray-800
                ${currentTopic === key 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
                }
              `}>
                <span className="text-xs text-white font-bold">{index + 1}</span>
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-1">{topicInfo.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{topicInfo.description}</p>
              {currentTopic === key && (
                <span className="inline-block mt-2 text-xs font-medium bg-blue-500 text-white px-2 py-1 rounded">
                  Tópico Atual
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Desktop View (Timeline) - Only shown on medium screens and up */}
      <div className="hidden sm:block relative pt-4">
        {/* Vertical line for timeline */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 dark:bg-blue-900 rounded"></div>
        
        <div className="space-y-16 relative">
          {Object.entries(learningTopics).map(([key, topicInfo], index) => (
            <div key={key} className="relative" role="listitem">
              {/* Circle marker on timeline */}
              <div className={`
                absolute left-1/2 top-6 transform -translate-x-1/2 -translate-y-1/2 
                w-8 h-8 rounded-full z-10 flex items-center justify-center
                ${currentTopic === key 
                  ? 'bg-blue-500 ring-4 ring-blue-200 dark:ring-blue-900' 
                  : 'bg-gray-300 dark:bg-gray-600'
                }
              `}>
                <span className="text-sm text-white font-bold">{index + 1}</span>
              </div>
              
              {/* Content card - alternating left and right */}
              <div 
                className={`
                  w-5/12 p-5 rounded-lg shadow-md transition-all duration-300 cursor-pointer
                  ${index % 2 === 0 ? 'ml-auto mr-8' : 'mr-auto ml-8'} 
                  ${currentTopic === key 
                    ? 'bg-blue-50 dark:bg-gray-700 border-blue-500 border-2 transform scale-[1.02]' 
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
                onClick={() => onTopicSelect(key)}
                role="button"
                aria-pressed={currentTopic === key ? 'true' : 'false'}
                aria-label={`Tópico: ${topicInfo.name}`}
              >
                <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200">{topicInfo.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{topicInfo.description}</p>
                {currentTopic === key && (
                  <span className="inline-block mt-3 text-sm font-medium bg-blue-500 text-white px-2 py-1 rounded">
                    Tópico Atual
                  </span>
                )}
              </div>
              
              {/* Visual arrow indicator for desktop view */}
              {index % 2 === 0 ? (
                <div className="hidden sm:block absolute left-1/2 top-6 transform -translate-x-1 border-t-8 border-r-8 border-b-8 border-transparent border-r-white dark:border-r-gray-800 -ml-3"></div>
              ) : (
                <div className="hidden sm:block absolute left-1/2 top-6 transform -translate-x-[14px] border-t-8 border-l-8 border-b-8 border-transparent border-l-white dark:border-l-gray-800"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
