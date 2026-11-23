package cz.aardvarkland.wmsmini;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.LuminanceSource;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.RGBLuminanceSource;
import com.google.zxing.Result;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.journeyapps.barcodescanner.Decoder;

import org.junit.Test;

import java.util.Collections;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

public class WarehouseScannerTest {
    @Test
    public void readsOrdinaryAndInvertedQr() throws WriterException {
        LuminanceSource image = imageFor("QA-RESTORE-BOX", BarcodeFormat.QR_CODE);
        assertReads("QA-RESTORE-BOX", BarcodeFormat.QR_CODE, image);
        assertReads("QA-RESTORE-BOX", BarcodeFormat.QR_CODE, image.invert());
    }

    @Test
    public void readsWarehouseLinearCodes() throws WriterException {
        assertReads("QA-CODE-128", BarcodeFormat.CODE_128, imageFor("QA-CODE-128", BarcodeFormat.CODE_128));
        assertReads("1234567890128", BarcodeFormat.EAN_13, imageFor("1234567890128", BarcodeFormat.EAN_13));
    }

    @Test
    public void ignoresBlankFramesInBothModes() {
        Decoder decoder = WarehouseCaptureActivity.warehouseDecoderFactory().createDecoder(Collections.emptyMap());
        LuminanceSource blank = new RGBLuminanceSource(160, 120, new int[160 * 120]);
        assertNull(decoder.decode(blank));
        assertNull(decoder.decode(blank));
    }

    private static void assertReads(String text, BarcodeFormat format, LuminanceSource image) {
        Decoder decoder = WarehouseCaptureActivity.warehouseDecoderFactory().createDecoder(Collections.emptyMap());
        Result result = decoder.decode(image);
        if (result == null) result = decoder.decode(image);
        assertNotNull(result);
        assertEquals(text, result.getText());
        assertEquals(format, result.getBarcodeFormat());
    }

    private static LuminanceSource imageFor(String text, BarcodeFormat format) throws WriterException {
        BitMatrix matrix = new MultiFormatWriter().encode(text, format, 480, 320);
        int width = matrix.getWidth();
        int height = matrix.getHeight();
        int[] pixels = new int[width * height];
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                int shade = (matrix.get(x, y) ? 48 : 208) + (y % 16);
                pixels[y * width + x] = shade * 0x010101;
            }
        }
        return new RGBLuminanceSource(width, height, pixels);
    }
}
