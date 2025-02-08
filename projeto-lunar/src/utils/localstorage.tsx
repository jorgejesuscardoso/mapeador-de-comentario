export const SetTolocalStorage = (key: string, value: object) => {
    localStorage.setItem(key, JSON.stringify(value));
}

export const GetFromLocalStorage = (key: string) => {
    return localStorage.getItem(key);
}

export const RemoveFromLocalStorage = (key: string) => {
    localStorage.removeItem(key);
}