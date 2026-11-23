package cz.aardvarkland.wmsmini;

import android.os.Bundle;

import com.google.zxing.DecodeHintType;
import com.journeyapps.barcodescanner.BarcodeView;
import com.journeyapps.barcodescanner.CaptureActivity;
import com.journeyapps.barcodescanner.DecoratedBarcodeView;
import com.journeyapps.barcodescanner.DefaultDecoderFactory;
import com.journeyapps.barcodescanner.DecoderFactory;

import java.util.Collections;

public class WarehouseCaptureActivity extends CaptureActivity {
    private static final int MIXED_SCAN = 2;

    private BarcodeView barcodeView;

    static DecoderFactory warehouseDecoderFactory() {
        return new DefaultDecoderFactory(null, Collections.singletonMap(DecodeHintType.TRY_HARDER, true),
            null, MIXED_SCAN);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // CaptureActivity applies the Intent settings before the camera starts.
        barcodeView.setDecoderFactory(warehouseDecoderFactory());
    }

    @Override
    protected DecoratedBarcodeView initializeContent() {
        DecoratedBarcodeView scanner = super.initializeContent();
        barcodeView = scanner.getBarcodeView();
        barcodeView.getCameraSettings().setContinuousFocusEnabled(true);
        barcodeView.setMarginFraction(0.04d);
        return scanner;
    }
}
