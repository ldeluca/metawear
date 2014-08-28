/*
 * @author Lisa Seacat DeLuca
 * @email  lisa@lisaseacat.com
 */

package com.lisaseacat.metawear.led;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.util.Log;

import com.mbientlab.metawear.api.MetaWearBleService;
import com.mbientlab.metawear.api.MetaWearController;
import com.mbientlab.metawear.api.controller.LED;
import com.mbientlab.metawear.api.controller.LED.ColorChannel;

public class MetawearLED extends CordovaPlugin {

    private static final String LOG_TAG = "MetawearLED";
    private LED ledController;
    protected MetaWearController mwController;
    private MetaWearBleService mwService;
    
    private  final short RISE_TIME= 500, HIGH_TIME= 500, FALL_TIME= 500, DURATION= 2000;
    private static final byte REPEAT_COUNT= 10;
    private ColorChannel currentChannel= ColorChannel.GREEN;
    
    /**
     * Constructor.
     */
    public MetawearLED() {
       //ledController= (LED)this.mwController.getModuleController(Module.LED);
    }


    /**
     * Executes the request.
     *
     * @param action          The action to execute.
     * @param args            JSONArry of arguments for the plugin.
     * @param callbackContext The callback context used when calling back into JavaScript.
     * @return True if the action was valid, false if not.
     * @throws JSONException
     */
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        Log.d(LOG_TAG, ">>> execute (" + action + "," + args + ")");
        if (action.equals("initLED")) {
            Log.d(LOG_TAG, "initLED called********************");
            final String applicationID = args.getString(0);
            
            //Initialize the SDK
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    
                    callbackContext.success();
                }
            });

            return true;
        } else if (action.equals("play")) {
            Log.d(LOG_TAG, "****************play called");

            final boolean autoplay = args.getBoolean(0);
            Log.d(LOG_TAG, "going to play.  Is autoplay?: " + autoplay);
             ledController.play(autoplay);
            return true;
        } else if (action.equals("pause")) {
            Log.d(LOG_TAG, "pause called");

            if (false) { //error
                Log.e(LOG_TAG, "The bluemix object name must be passed in inorder to query specific objects.");
                callbackContext.error("The bluemix object name must be passed in inorder to query specific objects.");
                return false;
            }
            
             ledController.pause();
            
            return true;
        } else if (action.equals("stop")) {
            Log.d(LOG_TAG, "stop called : " + args.toString());
            final boolean resetChannels = args.getBoolean(0);
            Log.d(LOG_TAG, "going to stop.  reset channels? " + resetChannels);
            ledController.stop(resetChannels);
            return true;
        } else if (action.equals("setColorChannel")) {
            Log.d(LOG_TAG, "setColorChannel called");
            
            byte highintensity = 6;
            byte lowintensity = 1;
            ledController.setColorChannel(currentChannel).withHighIntensity(highintensity)
                        .withLowIntensity(lowintensity)
                        .withRiseTime(RISE_TIME).withHighTime(HIGH_TIME).withFallTime(FALL_TIME)
                        .withPulseDuration(DURATION).withRepeatCount(REPEAT_COUNT).commit();
        }
        return false;
    }
}