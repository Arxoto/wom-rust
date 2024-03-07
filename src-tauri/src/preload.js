window.wom = {
    /**
     * system notification
     * @param {string} s - something will notify
     */
    notify: async (s) => {
        const notification = window.__TAURI__.notification;
        let permissionGranted = await notification.isPermissionGranted();
        if (!permissionGranted) {
            const permission = await notification.requestPermission();
            permissionGranted = permission === 'granted';
        }
        if (permissionGranted) {
            notification.sendNotification(s);
        } else {
            throw new Error("no Granted Notification Permission");
        }
    },
    /**
     * 
     * @param {string} s path or url
     * @returns {Promise<void>}
     */
    shellOpen: (s) => window.__TAURI__.shell.open(s),
    // shellSelect: shellSelect,
}