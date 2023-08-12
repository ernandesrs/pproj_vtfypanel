import { useAppStore } from "@/store/app";

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
        }
    }
};