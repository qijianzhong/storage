const sysLevel = 1, serverLevel = 2, serverCode = require('../../config/config').serverCode;

/**
 * codeKV
 * 
 * @param {Number} level  错误级别代码
 * @param {Number} code   具体错误代码
 * @param {String} error  错误信息
 * @return {Object} obj
 *      obj.code   {Number} 错误码
 *      obj.error  {String} 错误信息
 */
function codeKV(level, code, error) {
    var mid = 0;
    switch (level) {
        case sysLevel:
            break;
        case serverLevel:
            mid = serverCode;
            break;
        default: throw (`${level} is invalid`);
    }
    return { code: level * 100000 + mid * 1000 + code, error: error };
}

module.exports = {
    Success: codeKV(1, 0, 'Success'),
    System: codeKV(1, 1, 'System error'),
    ServiceUnavailable: codeKV(1, 2, 'Service unavailable'),
    IllegalRequest: codeKV(1, 3, 'Illegal request'),
    Unknown: codeKV(1, 4, 'Unknown error'),
    Custom: codeKV(1, 5, 'Custom error'),
    DBOperateWrong: codeKV(1, 6, 'DB operate wrong'),

    /** device */
    DevicePushDue: codeKV(2, 101, 'Upload data is delayed'),
    DeviceTypeMismatch: codeKV(2, 201, 'Device type does not match'),
    DeviceInexistence: codeKV(2, 202, 'Device does not exist'),
    DeviceKeyError: codeKV(2, 203, 'Device Key Error'),
    DeviceOffline: codeKV(2, 204, 'Device is offline'),
    AlgorithmFailed: codeKV(2, 300, 'Calculation failed'),
    UnEnterMonitorArea: codeKV(2, 301, 'Un Enter Monitor Area'),
    BeaconNoline: codeKV(2, 401, 'Beacon offline'),
    UnDeployCamera: codeKV(2, 402, 'Does not deploy camera'),
    BuildingInexistence: codeKV(2, 501, 'Building does not exist'),
    BuildingExistence: codeKV(2, 502, 'Building already exists'),
    FloorInexistence: codeKV(2, 511, 'Floor does not exist'),
    FloorExistence: codeKV(2, 512, 'Floor already exists'),
    AreaInexistence: codeKV(2, 521, 'Area does not exist'),
    AreaExistence: codeKV(2, 522, 'Area already exists'),

    /** loc */
    HostRoomUnknown: codeKV(2, 601, 'Unknown host area'),
    MarkInexistence: codeKV(2, 602, 'Beacon does not exist'),
    DevMarkEmpty: codeKV(2, 603, 'Beacon id is empty'),
    AssetInexistence: codeKV(2, 604, 'Asset does not exist'),
    UnAssociateMark: codeKV(2, 605, 'No associated beacons'),
    TagLocationUnfind : codeKV(2, 606,'Beacon location unknown'),
    AssociateInexistence: codeKV(2, 901, '关联物不存在'),
    UnSpecificRoom: codeKV(2, 904, '没有明确的房间'),
    DataPointInexistence: codeKV(2, 1001, '数据点不存在'),
    MarkHostUnkown: codeKV(2, 1002, '信标主机未知'),
    DevMarkAgain: codeKV(2, 1101, '信标重复添加'),
    DevAssetAgain: codeKV(2, 1102, '资产重复注册'),
    UnCamera: codeKV(2, 1200, '非摄像头设备'),
    UnSetCameraIp: codeKV(2, 1201, '未设置摄像头Ip'),
};