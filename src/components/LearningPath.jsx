import React from 'react';

const LearningPath = ({ learningTopics, onTopicSelect, currentTopic }) => {
  return (
    <div className="learning-path-container">
      <h2>Sua Trilha de Aprendizado</h2>
      <div className="path-line"></div> {/* Linha visual da trilha */}
      <div className="topic-cards-wrapper">
        {Object.entries(learningTopics).map(([key, topicInfo], index) => (
          <div
            key={key}
            className={`topic-card ${currentTopic === key ? 'active' : ''} ${index % 2 === 0 ? 'left-aligned' : 'right-aligned'}`}
            onClick={() => onTopicSelect(key)}
          >
            <h3>{topicInfo.name}</h3>
            <p>{topicInfo.description}</p>
            {currentTopic === key && <span className="current-topic-indicator">Tópico Atual</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPath;
