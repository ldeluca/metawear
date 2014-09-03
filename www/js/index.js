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
        
        ledButtonred.addEventListener('touchstart', function(){metawear.setLED(metawear.COLOR.RED); }, false);
        ledButtongreen.addEventListener('touchstart', function(){metawear.setLED(metawear.COLOR.GREEN); }, false);
        ledButtonblue.addEventListener('touchstart', function(){metawear.setLED(metawear.COLOR.BLUE); }, false);
        
        playledButton.addEventListener('touchstart', function(){ metawear.play(true); }, false);
        pauseledButton.addEventListener('touchstart', metawear.pause, false);
        stopledButton.addEventListener('touchstart', function(){ metawear.stop(true); }, false);
        
        
        metawearStart();
    }
};

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
         metawear.listenForButton(bluetooth.onError);
    },
    onDisconnect: function(err) {
        alert("bluetooth disconnected: " + JSON.stringify(err)); 
        connectButton.style.display = "";
    },
    /*onData: function(buffer) { // data received from MetaWear
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
    },*/
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