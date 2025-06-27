export const generateUserId = (email: string): string => {
    return btoa(email).slice(0, 16); // Простейший пример, лучше использовать crypto
  };