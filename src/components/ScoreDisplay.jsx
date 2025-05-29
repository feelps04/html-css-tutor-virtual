    import React from 'react';

    const ScoreDisplay = ({ correctExercisesCount, totalExercisesAttempted }) => {
      // Cálculo da pontuação decimal e conversão para nota de 0 a 10
      const score = totalExercisesAttempted > 0
        ? (correctExercisesCount / totalExercisesAttempted * 10).toFixed(1)
        : "N/A";
      
      // Cálculo da porcentagem para a barra de progresso
      const progressPercentage = totalExercisesAttempted > 0
        ? Math.round((correctExercisesCount / totalExercisesAttempted) * 100)
        : 0;
      
      // Determinação da cor com base na pontuação
      const getScoreColor = () => {
        if (score === "N/A") return "bg-gray-400 dark:bg-gray-600";
        const numScore = parseFloat(score);
        if (numScore >= 7) return "bg-green-500 dark:bg-green-600";
        if (numScore >= 5) return "bg-yellow-500 dark:bg-yellow-600";
        return "bg-red-500 dark:bg-red-600";
      };

      // Texto descritivo do desempenho
      const getScoreText = () => {
        if (score === "N/A") return "Sem avaliações";
        const numScore = parseFloat(score);
        if (numScore >= 7) return "Ótimo";
        if (numScore >= 5) return "Bom";
        return "Precisa melhorar";
      };

      return (
        <div 
          className="score-display p-2 sm:p-3 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm"
          role="status"
          aria-label="Desempenho nos exercícios"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="font-medium">
              Exercícios: <span className="text-blue-600 dark:text-blue-400">{correctExercisesCount}/{totalExercisesAttempted}</span>
            </span>
            
            <div className="hidden sm:flex items-center gap-1">
              <div className="h-1.5 w-20 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getScoreColor()} rounded-full`} 
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{progressPercentage}%</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Nota: <span className={`${parseFloat(score) >= 7 ? 'text-green-600 dark:text-green-400' : parseFloat(score) >= 5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>{score}</span></span>
            <span className="text-xs py-0.5 px-1.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{getScoreText()}</span>
          </div>
        </div>
      );
    };

    export default ScoreDisplay;
    
