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
        deviceId : "",
    // this is MetaWear's UART service
    serviceUUID: "326a9000-85cb-9195-d9dd-464cfbbae75a",
    txCharacteristic: "326a9001-85cb-9195-d9dd-464cfbbae75a", // transmit is from the phone's perspective
    rxCharacteristic: "326a9006-85cb-9195-d9dd-464cfbbae75a",  // receive is from the phone's perspective
    init: function (successCallback, failureCallback) {
    	console.log('initializing the metawear plugin');
        ble.isConnected(metawear.deviceId, successCallback, function (res) {metawear.isNotConnected(res, successCallback, failureCallback);});
    },
    isNotConnected: function(res, successCallback, failureCallback) {
        if (cordova.platformId === 'android') { // Android filtering is broken
            ble.scan([], 5, function (device) {metawear.onDiscoverDevice(device, successCallback, failureCallback);}, failureCallback);
        } else {
            ble.scan([metawear.serviceUUID], 5, function (device) {metawear.onDiscoverDevice(device, successCallback, failureCallback);}, failureCallback);
        }
    },
    onDiscoverDevice : function(device, successCallback, failureCallback) {
        if (device.name === "MetaWear") {
            console.log("FOUND METAWEAR" + JSON.stringify(device));
            metawear.deviceId = device.id;                
            ble.connect(device.id, successCallback, failureCallback);
            return; //exit out after we find the metawear
        } else {
            //console.log('not metawear: ' + device.name);   
        }
    },
    writeData: function(buffer, success, failure) { // to to be sent to MetaWear
        if (!success) {
            success = function() {
                console.log( "Sent: " + JSON.stringify(new Uint8Array(buffer)) );
            };
        }

        if (!failure) {
            failure = metawear.onError;
        }
        ble.writeCommand(metawear.deviceId, metawear.serviceUUID, metawear.txCharacteristic, buffer, success, failure);
    },
    subscribeForIncomingData: function() {
        console.log(arguments);        
        ble.notify(metawear.deviceId, metawear.serviceUUID, metawear.rxCharacteristic, metawear.onDataReceived, metawear.onDataReceivedError);
    },
    onDataReceived : function(buffer) { // data received from MetaWear
        console.log('data received plugin handler');
        var data = new Uint8Array(buffer);
        console.log('the data is: ' + JSON.stringify(data));
        var message = "";

        if (data[0] === 1 && data[1] === 1) { // module = 1, opscode = 1
            if (data[2] === 1) { // button state
                message = "Button pressed";
            } else {
                message = "Button released";
            }
        }

        alert("MESSAGE FROM ONDATA: " + message);
    },
    onDataReceivedError: function(res) {
        alert('Bluetooth Data Error: ' + JSON.stringify(res));
        console.log(JSON.stringify(res));
    },
    listenForButton : function(failureCallback, onDataReceived, onDataReceivedError){
        if (typeof onDataReceived == 'function'){
            console.log('replacing generic onDataReceived handler');
            //replace the generic one
            metawear.onDataReceived = onDataReceived;   
        }
        if (typeof onDataReceivedError == 'function'){
            console.log('replacing generic onDataReceivedError handler');
            //replace the generic one
            metawear.onDataReceivedError = onDataReceivedError;   
        }
      metawear.enableButtonFeedback( metawear.subscribeForIncomingData, failureCallback);  
    },
    enableButtonFeedback: function(success, failure) {
        var data = new Uint8Array(6);
        data[0] = 0x01; // mechanical switch
        data[1] = 0x01; // switch state ops code
        data[2] = 0x01; // enable

        metawear.writeData(data.buffer, success, failure);
    },
    COLOR : { // 00 is GREEN, 01 is RED, 02 is BLUE
        "RED" : 0x01,
        "GREEN" : 0x00,
        "BLUE" : 0x02
    },
    neopixel: function(color){
        console.log("LED called with color: " + color);
        var data = new Uint8Array(17);        
        data[0] = 0x02; // Color Register
        data[1] = 0x03; // 
        data[2] = ((color !== undefined) ? color : metawear.COLOR.GREEN); // THIS IS THE COLOR SLOT  00 is GREEN, 01 is RED, 02 is BLUE
        data[3] = 0x02; // 
        data[4] = 0x1F; // high intensity  1F for solid
        data[5] = 0x64; // low intensity 64 for solid
        data[6] = 0xF4; // 
        data[7] = 0x01; // 
        data[8] = 0xF4; // 
        data[9] = 0x01; // high intensity
        data[10] = 0xF4; // low intensity
        data[11] = 0x01; // Rise Time
        data[12] = 0xD0; // High Time
        data[13] = 0x07; // Fall time
        data[14] = 0x00; // Pulse Duration 
        data[15] = 0x00; // Pulse Offset 
        data[16] = 0x01; //repeat count

        metawear.writeData(data.buffer);
    },
    play : function(autoplay) {
        console.log("play LED called with autoplay: " + autoplay);
       var data = new Uint8Array(3);        
        data[0] = 0x02; // 
        data[1] = 0x01; // 
        
        //assuming next value is for autoplay
        //TODO which of the 3 location is the autoplay value? data[1] or data[2]??
        var isautoplay = ((autoplay === true) ? 0x02 : 0x01);
        data[2] = isautoplay; // 
        //data[2] = 0x01;
        
        
         metawear.writeData(data.buffer);    
    },
    pause : function() {
        console.log("pause LED called");
       var data = new Uint8Array(3);        
        data[0] = 0x02; // 
        data[1] = 0x01; // 
        data[2] = 0x00; // 
        
         metawear.writeData(data.buffer);    
    },
    stop : function(clearPattern) {
        console.log("stop LED called with clearPattern: " + clearPattern);
       var data = new Uint8Array(3);        
        data[0] = 0x02; // 
        data[1] = 0x02; // 
        // if 0 then just stop. if 1 then cancel the pattern
        data[2] = ((clearPattern === true) ? 0x01 : 0x00); 
        
         metawear.writeData(data.buffer);    
    },
    motor: function(pulseLength) {
        var pulseWidth = pulseLength;
        var data = new Uint8Array(6);
        data[0] = 0x07; // module
        data[1] = 0x01; // pulse ops code
        data[2] = 0x80; // Motor
        data[3] = pulseWidth & 0xFF; // Pulse Width
        data[4] = pulseWidth >> 8; // Pulse Width
        data[5] = 0x00; // Some magic bullshit

        metawear.writeData(data.buffer);
    },
    buzzer: function(pulseLength) {
        var pulseWidth = pulseLength;
        var data = new Uint8Array(6);
        data[0] = 0x07; // module
        data[1] = 0x01; // pulse ops code
        data[2] = 0xF8; // Buzzer
        data[3] = pulseWidth & 0xFF; // Pulse Width
        data[4] = pulseWidth >> 8; // Pulse Width
        data[5] = 0x01; // Some magic?

        metawear.writeData(data.buffer);
    },
    disconnect: function(onSuccess, onError, event) {
        ble.disconnect(metawear.deviceId, onSuccess, onError);
        metawear.deviceId = "";
    }
};
module.exports = metawear;