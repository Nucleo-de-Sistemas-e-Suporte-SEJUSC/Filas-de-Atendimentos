import React from "react"

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
    const [storedValue, setStoredValue] = React.useState<T>(() => {
        if (typeof window === 'undefined') return initialValue

        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error("Erro ao ler localStorage", error)
            return initialValue
        }
    })

    React.useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue))
        } catch (error) {
            console.error("Erro ao salvar no localStorage", error)
        }
    }, [key, storedValue])

    return { storedValue, setStoredValue }
}
