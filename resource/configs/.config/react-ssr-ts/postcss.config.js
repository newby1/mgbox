module.exports = ({env, file, options}) => {
    if (options.env === "development"){
        return {
            plugins: [
                require("autoprefixer")()
            ]
        }

    }else{
        return {
            plugins: [
                require("autoprefixer")(),
                require("cssnano")({
                    preset: "default"
                })
            ]
        }
    }
};
