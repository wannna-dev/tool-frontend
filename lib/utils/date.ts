export const getDaysAgo = (createdAt: string | Date) => {
    const created = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - created.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays === 0) return "hoy";
    if (diffDays === 1) return "hace 1 día";
  
    return `hace ${diffDays} días`;
  };
  