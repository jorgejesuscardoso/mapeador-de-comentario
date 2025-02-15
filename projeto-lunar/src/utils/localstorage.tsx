export const SetTolocalStorage = (key: string, value: object) => {
    localStorage.setItem(key, JSON.stringify(value));
}

export const GetFromLocalStorage = (key: string) => {
    const get = localStorage.getItem(key);
    const parsed = get ? JSON.parse(get) : null;
    return parsed;
}

export const RemoveFromLocalStorage = (key: string) => {
    localStorage.removeItem(key);
}