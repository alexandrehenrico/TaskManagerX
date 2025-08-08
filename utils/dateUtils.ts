export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const isOverdue = (deadline: Date): boolean => {
  return new Date() > deadline;
};

export const getDaysUntilDeadline = (deadline: Date): number => {
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return '#6B7280'; // Gray
    case 'started':
      return '#2563EB'; // Blue
    case 'completed':
      return '#059669'; // Green
    case 'overdue':
      return '#DC2626'; // Red
    default:
      return '#6B7280';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'started':
      return 'Iniciada';
    case 'completed':
      return 'Concluída';
    case 'overdue':
      return 'Atrasada';
    default:
      return status;
  }
};