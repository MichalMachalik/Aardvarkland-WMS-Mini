package cz.aardvarkland.wmsmini;

import android.content.Intent;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.zxing.client.android.Intents;
import com.journeyapps.barcodescanner.ScanIntentResult;
import com.journeyapps.barcodescanner.ScanOptions;

@CapacitorPlugin(name = "WarehouseScanner")
public class WarehouseScannerPlugin extends Plugin {
    @PluginMethod
    public void scan(PluginCall call) {
        ScanOptions options = new ScanOptions()
            .setCaptureActivity(WarehouseCaptureActivity.class)
            .setPrompt(call.getString("hint", ""))
            .setOrientationLocked(false)
            .setBeepEnabled(false)
            .setBarcodeImageEnabled(false)
            .addExtra(Intents.Scan.SHOW_MISSING_CAMERA_PERMISSION_DIALOG, false);

        startActivityForResult(call, options.createScanIntent(getActivity()), "scanResult");
    }

    @ActivityCallback
    private void scanResult(PluginCall call, ActivityResult activityResult) {
        if (call == null) return;

        Intent data = activityResult.getData();
        if (data != null && data.getBooleanExtra(Intents.Scan.MISSING_CAMERA_PERMISSION, false)) {
            call.reject("Camera permission denied", "CAMERA_PERMISSION_DENIED");
            return;
        }

        ScanIntentResult result = ScanIntentResult.parseActivityResult(activityResult.getResultCode(), data);
        JSObject payload = new JSObject();
        if (result.getContents() != null) payload.put("value", result.getContents());
        call.resolve(payload);
    }
}
