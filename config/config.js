/**
 * config
 */
module.exports = {
    host: {
        collector : "http://192.168.1.23:8901",
        location  : "http://10.10.38.217:8902",
        outprefix : "https://demo.beaconice.com.cn/storage"
    },
    mongodb: {
        url1: 'mongodb://10.10.38.216/niot',
        url2: 'mongodb://10.10.38.216/storage',
    },
    express: {
        port: 8605
    },
    session: {
        url: 'mongodb://10.10.38.216/usersystem',
    }
}