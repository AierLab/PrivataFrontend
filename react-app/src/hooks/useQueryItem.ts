import { useSearchParams } from "react-router-dom";

type SetValueFunction = (value: string | null) => void

export function useQueryItem(name: string, fallback?: string): [string | null, SetValueFunction] {
    const [query, setQuery] = useSearchParams()
    const setValue = (value: string | null) => {
        if(value === null) query.delete(name)
        else query.set(name, value)

        setQuery(query)
    }

    let value = query.get(name)
    if(value === null) value = fallback || null

    return [value, setValue]
}
