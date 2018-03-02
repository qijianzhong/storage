function codeKV(k, t) {
    return { code: k, topic: t };
}

module.exports = {
    HostOffline: codeKV(100, '主机离线')
};