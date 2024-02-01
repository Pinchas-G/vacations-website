import { useEffect } from 'react';

function useTitle(title: string): void {
    useEffect(() => {
        document.title = 'Wanderlust - ' + title;
    }, [])
}

export default useTitle;