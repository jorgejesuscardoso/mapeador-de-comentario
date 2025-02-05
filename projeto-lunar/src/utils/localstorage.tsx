export const SetTolocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
}

export const GetFromLocalStorage = (key: string) => {
    return localStorage.getItem(key);
}

export const RemoveFromLocalStorage = (key: string) => {
    localStorage.removeItem(key);
}