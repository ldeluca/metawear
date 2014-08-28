/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var cordova = require('cordova'),
    exec = require('cordova/exec');

var metawear = {
    // this is MetaWear's UART service
    serviceUUID: "326a9000-85cb-9195-d9dd-464cfbbae75a",
    txCharacteristic: "326a9001-85cb-9195-d9dd-464cfbbae75a", // transmit is from the phone's perspective
    rxCharacteristic: "326a9006-85cb-9195-d9dd-464cfbbae75a",  // receive is from the phone's perspective
    init: function (successCallback, failureCallback, metawearID) {
    	alert('init called with metawearID: ' + metawearID);
        exec(successCallback, failureCallback, "MetawearLED", "initLED", [metawearID]);
    },
    play: function (successCallback, failureCallback, autoplay) {
        exec(successCallback, failureCallback, "MetawearLED", "play", [autoplay]);
    },
    pause: function (successCallback, failureCallback) {
        exec(successCallback, failureCallback, "MetawearLED", "pause", []);
    },
    setColorChannel: function (successCallback, failureCallback, color) {
        exec(successCallback, failureCallback, "MetawearLED", "setColorChannel", [color]);
    },
    stop: function (successCallback, failureCallback, resetChannels) {
        exec(successCallback, failureCallback, "MetawearLED", "stop", [resetChannels]);
    }
};
module.exports = metawear;