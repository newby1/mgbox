module.exports = {
    "GET /api/id": (req, res) => {
        return res.json({
            id: 4,
            username: "kenny",
            sex: 6
        })
    },
    "GET /api/hello": (req, res) => {
        return res.json({
            "text": "this is from mock server"
        });
    },
};