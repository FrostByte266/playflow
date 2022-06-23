export default function apiRoute(location: string): string {
    return [import.meta.env.VITE_API_BASE, location].join('')
}


export const defaultFetchProps: RequestInit = {
    credentials: 'include',
    mode: 'cors'
}