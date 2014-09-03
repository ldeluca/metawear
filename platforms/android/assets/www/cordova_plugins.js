cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.megster.cordova.ble/www/ble.js",
        "id": "com.megster.cordova.ble.ble",
        "clobbers": [
            "ble"
        ]
    },
    {
        "file": "plugins/com.lisaseacat.metawear/www/metawear.js",
        "id": "com.lisaseacat.metawear.metawear",
        "clobbers": [
            "metawear"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.megster.cordova.ble": "0.0.1",
    "com.lisaseacat.metawear": "0.0.2"
}
// BOTTOM OF METADATA
});