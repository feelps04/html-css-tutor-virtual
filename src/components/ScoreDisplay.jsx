    import React from 'react';

    const ScoreDisplay = ({ correctExercisesCount, totalExercisesAttempted }) => {
      const score = totalExercisesAttempted > 0
        ? (correctExercisesCount / totalExercisesAttempted * 10).toFixed(1)
        : "N/A";

      return (
        <div className="score-display">
          <span>Exercícios Corretos: {correctExercisesCount} / {totalExercisesAttempted}</span>
          <span>Pontuação: {score}</span>
        </div>
      );
    };

    export default ScoreDisplay;
    