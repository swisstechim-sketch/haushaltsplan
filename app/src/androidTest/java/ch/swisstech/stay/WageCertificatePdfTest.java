package ch.swisstech.stay;

import android.content.Context;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import com.tom_roush.pdfbox.android.PDFBoxResourceLoader;
import com.tom_roush.pdfbox.pdmodel.PDDocument;
import com.tom_roush.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.io.*;
import java.util.*;
import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public class WageCertificatePdfTest {
 @Test public void originalFieldsAndRoundTrip() throws Exception {
  Context context=InstrumentationRegistry.getInstrumentation().getTargetContext();
  PDFBoxResourceLoader.init(context);
  JSONObject config;
  try(InputStream in=context.getAssets().open("wage-certificate-fields.json"); ByteArrayOutputStream out=new ByteArrayOutputStream()){
   byte[] buffer=new byte[4096];int n;while((n=in.read(buffer))!=-1)out.write(buffer,0,n);
   config=new JSONObject(out.toString("UTF-8"));
  }
  JSONObject mapping=config.getJSONObject("mapping");
  try(InputStream in=context.getAssets().open("wage-certificate-original.pdf");PDDocument doc=PDDocument.load(in)){
   assertEquals(1,doc.getNumberOfPages());
   PDAcroForm form=doc.getDocumentCatalog().getAcroForm();assertNotNull(form);
   Iterator<String> keys=mapping.keys();
   while(keys.hasNext()){String name=mapping.getString(keys.next());assertNotNull(name,form.getField(name));assertFalse(name,form.getField(name).isReadOnly());}
   org.json.JSONArray manual=config.getJSONArray("manualFields");
   for(int i=0;i<manual.length();i++){String name=manual.getString(i);assertNotNull(name,form.getField(name));}
  }
  Map<String,String> values=new LinkedHashMap<>();
  values.put(mapping.getString("1"),"60000");
  values.put(mapping.getString("8"),"60000");
  values.put(mapping.getString("9"),"4000");
  values.put(mapping.getString("11"),"56000");
  values.put(mapping.getString("A"),"Ja");
  values.put(mapping.getString("F"),"Nein");
  ByteArrayOutputStream output=new ByteArrayOutputStream();
  try(InputStream in=context.getAssets().open("wage-certificate-original.pdf")){
   WageCertificatePdf.fill(context,in,output,values);
  }
  try(PDDocument doc=PDDocument.load(new ByteArrayInputStream(output.toByteArray()))){
   assertEquals(1,doc.getNumberOfPages());
   PDAcroForm form=doc.getDocumentCatalog().getAcroForm();
   for(String key:Arrays.asList("1","8","9","11"))assertEquals(values.get(mapping.getString(key)),form.getField(mapping.getString(key)).getValueAsString());
   assertTrue(((com.tom_roush.pdfbox.pdmodel.interactive.form.PDCheckBox)form.getField(mapping.getString("A"))).isChecked());
   assertFalse(((com.tom_roush.pdfbox.pdmodel.interactive.form.PDCheckBox)form.getField(mapping.getString("F"))).isChecked());
  }
 }
}
