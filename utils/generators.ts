export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const createActivityHistoryEntry = (action: string, observation?: string) => ({
  id: generateId(),
  date: new Date(),
  action,
  observation,
});