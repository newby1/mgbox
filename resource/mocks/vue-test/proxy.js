module.exports = {
    "ab": 2,
    _proxy: {

        proxy: {
            // "/jobs/companyAjax.json": "https://www.lagou.com",
            '/mock/(.*)': 'https://getman.cn',
        },
        changeHost: true,
    }
};

