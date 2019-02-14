module.exports = {
    isInstalled(packageName){
        try {
            require.resolve(packageName);
            return true;
        } catch (err) {
            return false;
        }

    }
};
