import vuetify from "@/plugins/vuetify";

const themeConfigKey = 'vtfy_theme_name';
const themeDarkName = 'darkTheme';
const themeLightName = 'lightTheme';

const config = {
    /**
     * Dark theme toggle
     */
    themeToggleDark: () => {
        config.themeSet(vuetify.theme.global.current.value.dark ? themeLightName : themeDarkName);
    },

    /**
     * Set dark theme
     * @param {null|String} themeName 
     */
    themeSet: (themeName = null) => {
        const definedThemeName = localStorage.getItem(themeConfigKey);

        if (!themeName) {
            if (!definedThemeName) {
                themeName = themeLightName;
            } else {
                themeName = definedThemeName;
            }
        }

        localStorage.setItem(themeConfigKey, themeName);
        vuetify.theme.global.name.value = themeName;
    },

    /**
     * Check if theme is dark
     * @returns {Boolean}
     */
    themeIsDark: () => {
        let theme = localStorage.getItem(themeConfigKey) ?? themeLightName;
        return theme == 'darkTheme';
    }
};

export default {
    app: {
        config: config
    },
};