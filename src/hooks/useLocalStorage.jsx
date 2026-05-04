import { use } from 'react';
import { useState, useEffect } from 'react';
import React from 'react'

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Ошибка чеченца', error);
            return initialValue;
        };
        
    })
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error('Ошибка запси', error);
        }
    }, [key, storedValue])

  return [storedValue, setStoredValue];
}

export default useLocalStorage