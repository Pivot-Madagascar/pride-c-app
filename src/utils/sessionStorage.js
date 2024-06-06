const checkSessionStorage = (key) => {
    return sessionStorage.getItem(key) !== null;
}

const setSessionStorage = ({ key, data }) => {
    const value = JSON.stringify(data)
    sessionStorage.setItem(key, value)
}

const getSessionStorageValue = (key) => {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

export { checkSessionStorage, setSessionStorage, getSessionStorageValue }