import React, { useRef, useEffect, useState } from 'react';
import './SuggestedQuestions.css';

const SuggestedQuestions = ({
  suggestedQuestions,
  onSuggestedQuestionClick,
  isLoading,
}) => {
  // Referência para o contêiner de perguntas sugeridas para navegação
  const questionsContainerRef = useRef(null);
  // Estado para indicar se há mais conteúdo para scrollar
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  // Estado para detectar dispositivos móveis
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Verificar se existe a necessidade de scrolling e sua direção
  const checkScrollability = () => {
    const container = questionsContainerRef.current;
    if (!container) return;
    
    // Determinar se pode scrollar para esquerda ou direita
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollWidth > container.clientWidth &&
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };
  
  // Efeito para atualizar os indicadores de scroll ao redimensionar ou scrollar
  useEffect(() => {
    const container = questionsContainerRef.current;
    if (!container) return;
    
    // Verificar scrollabilidade inicialmente e em cada resize
    checkScrollability();
    
    // Detectar se é um dispositivo móvel
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 640);
    };
    
    // Executar a verificação inicial
    checkMobileView();
    
    // Verificar durante o scroll
    const handleScroll = () => {
      checkScrollability();
    };
    
    // Verificar após o resize
    const handleResize = () => {
      checkScrollability();
      checkMobileView();
    };
    
    // Função para lidar com o evento de roda do mouse para rolagem horizontal
    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
        checkScrollability();
      }
    };
    
    // Funções aprimoradas para lidar com eventos de toque
    let touchStartX = 0;
    let touchStartTime = 0;
    let lastTouchX = 0;
    let velocity = 0;
    
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      lastTouchX = touchStartX;
      touchStartTime = Date.now();
      // Parar qualquer momentum scroll em andamento
      velocity = 0;
      
      // Adicionar classe de "agarrado" para feedback visual
      container.classList.add('cursor-grabbing');
    };
    
    const handleTouchMove = (e) => {
      const touchX = e.touches[0].clientX;
      const touchDiff = lastTouchX - touchX;
      
      // Calcular velocidade para momentum scroll
      const now = Date.now();
      const elapsed = now - touchStartTime;
      if (elapsed > 0) {
        velocity = touchDiff / elapsed;
      }
      
      container.scrollLeft += touchDiff;
      lastTouchX = touchX;
      
      checkScrollability();
    };
    
    const handleTouchEnd = () => {
      // Remover classe de "agarrado"
      container.classList.remove('cursor-grabbing');
      
      // Aplicar momentum scrolling
      if (Math.abs(velocity) > 0.1) {
        const momentumScroll = () => {
          // Reduzir a velocidade gradualmente
          velocity *= 0.95;
          
          // Aplicar scroll baseado na velocidade
          if (Math.abs(velocity) > 0.01) {
            container.scrollLeft += velocity * 10;
            requestAnimationFrame(momentumScroll);
          }
          
          checkScrollability();
        };
        
        requestAnimationFrame(momentumScroll);
      }
    };
    
    // Adicionar os ouvintes de evento
    window.addEventListener('resize', handleResize);
    container.addEventListener('scroll', handleScroll);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Add better touch feedback for mobile
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('touchstart', () => {
        button.classList.add('scale-95');
      }, { passive: true });
      
      button.addEventListener('touchend', () => {
        button.classList.remove('scale-95');
      }, { passive: true });
    });
    
    // Limpar os ouvintes quando o componente for desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      
      // Clean up button event listeners
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        button.removeEventListener('touchstart', () => {});
        button.removeEventListener('touchend', () => {});
      });
    };
  }, [suggestedQuestions]);
  
  // Função para scrollar manualmente
  const scrollContainer = (direction) => {
    const container = questionsContainerRef.current;
    if (!container) return;
    
    // Determinar a distância de scroll (um terço da largura visível)
    const scrollDistance = container.clientWidth / 3;
    
    // Animar o scroll
    container.scrollBy({
      left: direction === 'left' ? -scrollDistance : scrollDistance,
      behavior: 'smooth'
    });
  };
  
  // Função para truncar texto longo com tamanhos responsivos mais granulares
  const truncateText = (text) => {
    // Ajustar comprimento baseado no tamanho da tela de forma mais granular
    const screenWidth = window.innerWidth;
    let maxLength;
    
    // Em dispositivos móveis, permitimos texto mais longo, pois haverá quebra de linha
    if (screenWidth < 360) {
      maxLength = 30; // Telas muito pequenas (ex: iPhone SE)
    } else if (screenWidth < 480) {
      maxLength = 35; // Smartphones pequenos
    } else if (screenWidth < 640) {
      maxLength = 40; // Smartphones médios
    } else if (screenWidth < 768) {
      maxLength = 34; // Smartphones grandes / tablets pequenos
    } else {
      maxLength = 40; // Tablets e desktops
    }
    
    return text.length > maxLength ? 
      `${text.substring(0, maxLength)}...` : 
      text;
  };
  
  return (
    <div className="relative group sugested-questions-wrapper">
      {/* Container principal com rolagem horizontal */}
      <div 
        className="flex gap-1.5 xs:gap-2 pb-1 overflow-x-auto scrollbar-hide -mx-2 px-2 py-1.5 snap-x scroll-smooth overscroll-x-contain"
        ref={questionsContainerRef}
        role="toolbar"
        aria-label="Perguntas sugeridas"
      >
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSuggestedQuestionClick(question)}
            disabled={isLoading}
            className={`flex-shrink-0 snap-start py-1.5 xs:py-2 px-2.5 xs:px-3 sm:px-4 
                      ${isMobileView ? 'rounded-lg' : 'rounded-full'} 
                      text-xs sm:text-sm 
                      bg-gray-200 hover:bg-gray-300 active:bg-gray-400
                      dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500
                      text-gray-800 dark:text-gray-200 
                      transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                      disabled:opacity-50 disabled:cursor-not-allowed 
                      min-w-[70px] xs:min-w-[80px] sm:min-w-[100px] md:min-w-[120px]
                      max-w-[200px] xs:max-w-[250px] sm:max-w-[300px]
                      ${isMobileView ? 'whitespace-normal' : 'whitespace-nowrap'} overflow-hidden
                      border border-transparent focus:border-blue-500 focus:outline-none
                      shadow-sm touch-manipulation
                      ${isMobileView ? 'min-h-[44px] text-center' : ''}`}
            aria-label={`Perguntar: ${question}`}
            title={question}
          >
            <span className={`block ${isMobileView ? '' : 'truncate'}`}>
              {isMobileView ? question : truncateText(question)}
            </span>
          </button>
        ))}
      </div>
      
      {/* Indicadores de scroll à esquerda e direita - visíveis apenas quando necessário */}
      {canScrollLeft && (
        <button 
          onClick={() => scrollContainer('left')}
          className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-800 to-transparent 
                     flex items-center justify-start pl-1 opacity-0 group-hover:opacity-100 transition-opacity
                     focus:opacity-100 focus:outline-none"
          aria-label="Rolar para a esquerda"
        >
          <span className="h-6 w-6 rounded-full bg-white dark:bg-gray-700 shadow flex items-center justify-center text-sm">
            ←
          </span>
        </button>
      )}
      
      {canScrollRight && (
        <button 
          onClick={() => scrollContainer('right')}
          className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent 
                     flex items-center justify-end pr-1 opacity-0 group-hover:opacity-100 transition-opacity
                     focus:opacity-100 focus:outline-none"
          aria-label="Rolar para a direita"
        >
          <span className="h-6 w-6 rounded-full bg-white dark:bg-gray-700 shadow flex items-center justify-center text-sm">
            →
          </span>
        </button>
      )}
      
    </div>
  );
};

export default SuggestedQuestions;
