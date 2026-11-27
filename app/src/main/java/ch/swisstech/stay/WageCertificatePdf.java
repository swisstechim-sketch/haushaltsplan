package ch.swisstech.stay;

import android.content.Context;
import com.tom_roush.pdfbox.android.PDFBoxResourceLoader;
import com.tom_roush.pdfbox.pdmodel.PDDocument;
import com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm;
import com.tom_roush.pdfbox.pdmodel.interactive.form.PDField;
import com.tom_roush.pdfbox.pdmodel.interactive.form.PDCheckBox;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.IOException;
import java.util.Map;

public final class WageCertificatePdf {
    private WageCertificatePdf() {}

    public static void fill(Context context, InputStream template, OutputStream output,
                            Map<String, String> values) throws IOException {
        PDFBoxResourceLoader.init(context.getApplicationContext());
        try (PDDocument document = PDDocument.load(template)) {
            PDAcroForm form = document.getDocumentCatalog().getAcroForm();
            if (form == null) throw new IOException("PDF-Formularfelder fehlen");
            for (Map.Entry<String, String> entry : values.entrySet()) {
                PDField field = form.getField(entry.getKey());
                if (field == null) throw new IOException("Unbekanntes PDF-Feld: " + entry.getKey());
                if (field.isReadOnly()) throw new IOException("PDF-Feld ist schreibgeschützt: " + entry.getKey());
                String value = entry.getValue();
                if (value == null) throw new IOException("PDF-Feldwert fehlt");
                if (field instanceof PDCheckBox) {
                    PDCheckBox box = (PDCheckBox) field;
                    if ("Ja".equals(value)) box.check();
                    else if ("Nein".equals(value)) box.unCheck();
                    else throw new IOException("Kontrollkästchen: Ja oder Nein erforderlich");
                } else {
                    field.setValue(value);
                }
            }
            form.refreshAppearances();
            form.setNeedAppearances(false);
            document.save(output);
        }
    }
}
