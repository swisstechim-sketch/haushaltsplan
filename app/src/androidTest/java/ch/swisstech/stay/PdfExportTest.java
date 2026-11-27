package ch.swisstech.stay;

import android.graphics.pdf.PdfDocument;
import android.graphics.pdf.PdfRenderer;
import android.os.ParcelFileDescriptor;
import android.util.Base64;
import androidx.core.content.FileProvider;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.core.app.ActivityScenario;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.io.ByteArrayOutputStream;
import java.io.File;
import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public class PdfExportTest {
 @Test public void rejectsInvalidPdf() {
  try(ActivityScenario<MainActivity> scenario=ActivityScenario.launch(MainActivity.class)){
   scenario.onActivity(a->{
    assertEquals("",a.new Bridge().savePdf(null));
    assertEquals("",a.new Bridge().savePdf(Base64.encodeToString(new byte[]{1,2,3},Base64.NO_WRAP)));
   });
  }
 }
 @Test public void savesReadablePdfWithScopedUri() {
  try(ActivityScenario<MainActivity> scenario=ActivityScenario.launch(MainActivity.class)){
   scenario.onActivity(a->{
    try{
     byte[] bytes;
     PdfDocument pdf=new PdfDocument();
     try(ByteArrayOutputStream out=new ByteArrayOutputStream()){
      PdfDocument.Page page=pdf.startPage(new PdfDocument.PageInfo.Builder(595,842,1).create());
      pdf.finishPage(page);pdf.writeTo(out);bytes=out.toByteArray();
     }finally{pdf.close();}
     String name=a.new Bridge().savePdf(Base64.encodeToString(bytes,Base64.NO_WRAP));
     assertFalse(name.isEmpty());
     File file=new File(new File(a.getFilesDir(),"pdf_exports"),name);
     try{
      assertEquals(bytes.length,file.length());
      android.net.Uri uri=FileProvider.getUriForFile(a,a.getPackageName()+".fileprovider",file);
      assertEquals("content",uri.getScheme());
      try(ParcelFileDescriptor fd=a.getContentResolver().openFileDescriptor(uri,"r");PdfRenderer renderer=new PdfRenderer(fd)){
       assertEquals(1,renderer.getPageCount());
       PdfRenderer.Page page=renderer.openPage(0);
       try{assertEquals(595,page.getWidth());assertEquals(842,page.getHeight());}finally{page.close();}
      }
     }finally{file.delete();}
    }catch(Exception ex){throw new AssertionError(ex);}
   });
  }
 }
}
