import { format, formatDistance, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Format date in a friendly way
export const formatFriendlyDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return `Hoje, ${format(dateObj, 'HH:mm')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Ontem, ${format(dateObj, 'HH:mm')}`;
  }
  
  if (isThisWeek(dateObj)) {
    return format(dateObj, "EEEE, 'às' HH:mm", { locale: ptBR });
  }
  
  return format(dateObj, "dd 'de' MMMM 'de' yyyy, 'às' HH:mm", { locale: ptBR });
};

// Format time ago (e.g., "2 hours ago")
export const formatTimeAgo = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true, locale: ptBR });
};

// Format duration in a friendly way
export const formatDuration = (minutes: number): string => {
  if (minutes < 1) {
    return 'menos de um minuto';
  }
  
  if (minutes === 1) {
    return '1 minuto';
  }
  
  if (minutes < 60) {
    return `${minutes} minutos`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 1) {
    if (remainingMinutes === 0) {
      return '1 hora';
    }
    return `1 hora e ${remainingMinutes} ${remainingMinutes === 1 ? 'minuto' : 'minutos'}`;
  }
  
  if (remainingMinutes === 0) {
    return `${hours} horas`;
  }
  
  return `${hours} horas e ${remainingMinutes} ${remainingMinutes === 1 ? 'minuto' : 'minutos'}`;
};

