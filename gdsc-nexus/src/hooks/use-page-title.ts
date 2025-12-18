import { useEffect } from "react";

export function usePageTitle(title: string) {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = `${title} | GDSC Nexus`;
        return () => {
            document.title = previousTitle;
        };
    }, [title]);
}
