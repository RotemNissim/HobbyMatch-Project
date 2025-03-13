type AuthListener = (isLoggedIn: boolean) => void;

const listeners: AuthListener[] = [];

export const getGlobalFlag = (): boolean => {
    return localStorage.getItem('isUserLoggedIn') === 'true';
};

export const setGlobalFlag = (value: boolean) => {
    localStorage.setItem('isUserLoggedIn', value.toString());
    listeners.forEach(listener => listener(value)); // עדכון כל הרכיבים שמאזינים
};

export const subscribeToAuthChanges = (listener: AuthListener) => {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
    };
};
