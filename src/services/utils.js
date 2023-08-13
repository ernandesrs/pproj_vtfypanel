import { useAppStore } from "@/store/app";

const config = {
    isDarkMode: () => {
        let theme = localStorage.getItem('vtfy_theme_name') ?? 'lightTheme';
        return theme == 'darkTheme';
    }
};

export default {
    app: {
        breadcrumbs: (breadcrumbs = []) => {
            useAppStore().updateBreadcrumbs([
                {
                    title: 'Dashboard',
                    disabled: false,
                    to: { name: 'admin.home' }
                },
                ...breadcrumbs
            ])
        },
        config: config
    }
};