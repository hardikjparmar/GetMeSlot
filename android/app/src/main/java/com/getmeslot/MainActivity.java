package com.getmeslot;

import com.facebook.react.ReactActivity;

import android.content.Intent;
import android.os.Build;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "GetMeSlot";
  }

  @Override
  protected void onStart() {
    super.onStart();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            //log("Starting the service in >=26 Mode from a BroadcastReceiver")
            getApplicationContext().stopService(new Intent(getApplicationContext(), GetMeSlotService.class));
            getApplicationContext().startForegroundService(new Intent(getApplicationContext(), GetMeSlotService.class));
            return;
        }
        getApplicationContext().stopService(new Intent(getApplicationContext(), GetMeSlotService.class));
        //log("Starting the service in < 26 Mode from a BroadcastReceiver")
        getApplicationContext().startService(new Intent(getApplicationContext(), GetMeSlotService.class));
      } 
}
