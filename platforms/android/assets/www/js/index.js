//var macAddress = "F5:79:E1:06:39:86";


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //bind events that need to wait for Cordova to be ready
        disconnectButton.addEventListener('touchstart', bluetooth.disconnect, false);
        connectButton.addEventListener('touchstart', metawearStart, false);
        
        ledButtonred.addEventListener('touchstart', function(){metawear.neopixel(metawear.COLOR.RED); }, false);
        ledButtongreen.addEventListener('touchstart', function(){metawear.neopixel(metawear.COLOR.GREEN); }, false);
        ledButtonblue.addEventListener('touchstart', function(){metawear.neopixel(metawear.COLOR.BLUE); }, false);
        
        playledButton.addEventListener('touchstart', function(){ metawear.play(true); }, false);
        pauseledButton.addEventListener('touchstart', metawear.pause, false);
        stopledButton.addEventListener('touchstart', function(){ metawear.stop(true); }, false);
        
        
        metawearStart();
    }
};


//https://github.com/don/cordova-plugin-ble-central
/*var bluetooth2 = {
    isNotConnected: function(res) {
        //alert("bluetooth wasn't connected so we'll connect");
        //alert('what is cordova platofrm id: ' + cordova.platformId);
        if (cordova.platformId === 'android') { // Android filtering is broken
            ble.scan([], 5, bluetooth.onDiscoverDevice, bluetooth.onError);
        } else {
            ble.scan([MetaWearServices.serviceUUID], 5, bluetooth.onDiscoverDevice, bluetooh.onError);
        }
    },
    onDiscoverDevice : function(device) {
        console.log("com.lisaseacat" + JSON.stringify(device));
       //alert(JSON.stringify(device));
            if (device.name === "MetaWear") {
                console.log("FOUND METAWEAR" + JSON.stringify(device));
                bluetooth.deviceId = device.id;                
                ble.connect(device.id, bluetooth.onConnect, bluetooth.onError);
            } else {
                console.log('not metawear: ' + device.name);   
            }
    },
     onConnect: function(res) {
        alert('bluetooth connected! ' + JSON.stringify(res));
         connectButton.style.display = "none";
         bluetooth.enableButtonFeedback(bluetooth.subscribeForIncomingData, bluetooth.onError);
         //TODO we want to turn on the LED here
         var value = "noidea";
        ble.write(bluetooth.deviceId, MetaWearServices.service_uuid, MetaWearServices.characteristic_uuid, value, bluetooth.onWriteWin, bluetooth.onWriteFail);
    },
    onDisconnect: function(err) {
        alert("bluetooth disconnected: " + JSON.stringify(err)); 
        connectButton.style.display = "";
    },
    onError: function(res) {
        alert('Bluetooth generic error handler: ' + JSON.stringify(res));
        
        //if (JSON.stringify(res) === 'Disconnected'){
            bluetooth.onDisconnect(res);
       // }
    },
    onWriteWin: function(res) {
        alert('onWriteWin' + JSON.stringify(res));
    },
    onWriteFail: function(res) {
        alert('onWriteFail' + JSON.stringify(res));
    }, 
    onData: function(buffer) { // data received from MetaWear
        console.log('data received');
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
    onDataError: function(res) {
        alert('Bluetooth Data Error: ' + JSON.stringify(res));
        console.log(JSON.stringify(res));
    },
    writeData: function(buffer, success, failure) { // to to be sent to MetaWear
        console.log('in writeData');
        if (!success) {
            success = function() {
                console.log("success");
                console.log( "Sent: " + JSON.stringify(new Uint8Array(buffer)) );
            };
        }

        if (!failure) {
            failure = bluetooth.onError;
        }

        console.log('about to call writeCommand');
        ble.writeCommand(bluetooth.deviceId, metawear.serviceUUID, metawear.txCharacteristic, buffer, success, failure);
    },
    subscribeForIncomingData: function() {
        console.log('in subscribeForIncomingData. bluetooth serviceUUID is: ' + metawear.serviceUUID);
        ble.notify(bluetooth.deviceId, metawear.serviceUUID, metawear.rxCharacteristic, bluetooth.onData, bluetooth.onDataError);
    },
    enableButtonFeedback: function(success, failure) {
        console.log('in enableButtonFeedback');
        var data = new Uint8Array(6);
        data[0] = 0x01; // mechanical switch
        data[1] = 0x01; // switch state ops code
        data[2] = 0x01; // enable

        bluetooth.writeData(data.buffer, success, failure);
    },
    onLEDButton: function(event) {
        var data = new Uint8Array(6);
        data[0] = 0x02; // module LED is at position 2  (but neopixel is at 6)
        data[1] = 0x01; // pulse ops code
        data[2] = 0x80; // Motor
        data[3] = pulseWidth & 0xFF; // Pulse Width
        data[4] = pulseWidth >> 8; // Pulse Width
        data[5] = 0x00; // Some magic bullshit

        bluetooth.writeData(data.buffer);
    },
    lisaLED: function(){
        console.log("LED called");
        var data = new Uint8Array(17);        
        data[0] = 0x02; // Color Register
        data[1] = 0x03; // 
        data[2] = 0x00; // 
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
        
        var s = "";
       for(var j=0;j<data.length; j++)  {
           s += "i[" + j + "]=" + (data[j]) + "\n"; 
       }
        alert('bytes to write: ' + s);
        bluetooth.writeData(data.buffer);
    },
    playLED : function(autoplay) {
        console.log("play LED called with autoplay: " + autoplay);
       var data = new Uint8Array(3);        
        data[0] = 0x02; // 
        data[1] = 0x01; // 
        
        //assuming next value is for autoplay
        //TODO which of the 3 location is the autoplay value? data[1] or data[2]??
        var isautoplay = ((autoplay === true) ? 0x02 : 0x01);
        data[2] = isautoplay; // 
        //data[2] = 0x01;
        
        
         bluetooth.writeData(data.buffer);    
    },
    pauseLED : function() {
        console.log("pause LED called");
       var data = new Uint8Array(3);        
        data[0] = 0x02; // 
        data[1] = 0x01; // 
        data[2] = 0x00; // 
        
         bluetooth.writeData(data.buffer);    
    },
    stopLED : function(clearPattern) {
        console.log("stop LED called with clearPattern: " + clearPattern);
       var data = new Uint8Array(3);        
        data[0] = 0x02; // 
        data[1] = 0x02; // 
        // if 0 then just stop. if 1 then cancel the pattern
        data[2] = ((clearPattern === true) ? 0x01 : 0x00); 
        
         bluetooth.writeData(data.buffer);    
    },
    onMotorButton: function(event) {
        var pulseWidth = pulseWidthInput.value;
        var data = new Uint8Array(6);
        data[0] = 0x07; // module
        data[1] = 0x01; // pulse ops code
        data[2] = 0x80; // Motor
        data[3] = pulseWidth & 0xFF; // Pulse Width
        data[4] = pulseWidth >> 8; // Pulse Width
        data[5] = 0x00; // Some magic bullshit

        bluetooth.writeData(data.buffer);
    },
    onBuzzerButton: function(event) {
        var pulseWidth = pulseWidthInput.value;
        var data = new Uint8Array(6);
        data[0] = 0x07; // module
        data[1] = 0x01; // pulse ops code
        data[2] = 0xF8; // Buzzer
        data[3] = pulseWidth & 0xFF; // Pulse Width
        data[4] = pulseWidth >> 8; // Pulse Width
        data[5] = 0x01; // Some magic?

        bluetooth.writeData(data.buffer);
    },
    disconnect: function(event) {
        ble.disconnect(bluetooth.deviceId, bluetooth.onWriteWin, bluetooth.onError);
        bluetooth.deviceId = "";
        
        connectButton.style.display = "";
    },
};*/

function metawearStart() {
    console.log('metawearStart');
    //ble.isConnected(bluetooth.deviceId, bluetooth.onConnect, bluetooth.isNotConnected);
    metawear.init(bluetooth.onConnect, bluetooth.onError);

}


var bluetooth = {
     onConnect: function(res) {
        alert('bluetooth connected! ' + JSON.stringify(res));
         connectButton.style.display = "none";
         
         //listen for the button on the metawear
         metawear.listenForButton(bluetooth.onError, bluetooth.onData, bluetooth.onDataError);
    },
    onDisconnect: function(err) {
        alert("bluetooth disconnected: " + JSON.stringify(err)); 
        connectButton.style.display = "";
    },
    onData: function(buffer) { // data received from MetaWear
        console.log('data received');
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

        alert("Sample Cordova App... Metawear message received: " + message);
    },
    onDataError: function(res) {
        alert('Bluetooth Data Error: ' + JSON.stringify(res));
        console.log(JSON.stringify(res));
    },
    onError: function(res) {
        alert('Bluetooth generic error handler: ' + JSON.stringify(res));
        
        //if (JSON.stringify(res) === 'Disconnected'){
            bluetooth.onDisconnect(res);
       // }
    },
    disconnect: function(event) {
        metawear.disconnect(bluetooth.onWriteWin, bluetooth.onError, event);
        
        connectButton.style.display = "";
    }
};