package ch.swisstech.stay;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.JavascriptInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.ClipData;
import android.net.Uri;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.StandardCharsets;
import androidx.core.content.FileProvider;
import android.print.PrintManager;
public class MainActivity extends Activity {
 private WebView web;
 private StayDatabase database;
 @Override public void onCreate(Bundle b){super.onCreate(b); database=new StayDatabase(this); web=new WebView(this); web.getSettings().setJavaScriptEnabled(true); web.getSettings().setDomStorageEnabled(true); web.getSettings().setTextZoom(100); web.getSettings().setAllowFileAccess(false); web.getSettings().setAllowContentAccess(false); web.addJavascriptInterface(new Bridge(),"Stay"); web.setWebChromeClient(new WebChromeClient()); web.setWebViewClient(new WebViewClient(){@Override public boolean shouldOverrideUrlLoading(WebView v,String url){return true;}}); setContentView(web); web.loadUrl("file:///android_asset/index.html");}
 @Override public void onBackPressed(){
  if(web==null){super.onBackPressed();return;}
  web.evaluateJavascript("typeof stayBack==='function' && stayBack()",value->{if("false".equals(value))super.onBackPressed();});
 }
 @Override protected void onDestroy(){if(web!=null){web.removeJavascriptInterface("Stay");web.destroy();web=null;}super.onDestroy();}
 public class Bridge {
 @JavascriptInterface public String qrSvg(String data){
  try {
   if(data==null || data.length()>2000 || !data.startsWith("SPC"))return "";
   java.util.Map<com.google.zxing.EncodeHintType,Object> hints=new java.util.EnumMap<>(com.google.zxing.EncodeHintType.class);
   hints.put(com.google.zxing.EncodeHintType.CHARACTER_SET,"UTF-8");
   hints.put(com.google.zxing.EncodeHintType.ERROR_CORRECTION,com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.M);
   hints.put(com.google.zxing.EncodeHintType.MARGIN,4);
   com.google.zxing.common.BitMatrix m=new com.google.zxing.qrcode.QRCodeWriter().encode(data,com.google.zxing.BarcodeFormat.QR_CODE,0,0,hints);
   int n=m.getWidth();StringBuilder s=new StringBuilder("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 "+n+" "+n+"' shape-rendering='crispEdges'><rect width='100%' height='100%' fill='white'/><path fill='black' d='");
   for(int y=0;y<n;y++)for(int x=0;x<n;x++)if(m.get(x,y))s.append("M").append(x).append(" ").append(y).append("h1v1h-1z");
   return s.append("'/></svg>").toString();
  }catch(Exception e){return "";}
 }

 @JavascriptInterface public String load(){try { String current=database.load(); if(!current.isEmpty())return current; String legacy=getSharedPreferences("stay",MODE_PRIVATE).getString("data",""); if(!legacy.isEmpty()){if(!database.save(legacy))throw new IllegalStateException("Migration failed");getSharedPreferences("stay",MODE_PRIVATE).edit().remove("data").commit();}return legacy; }catch(Exception e){throw new IllegalStateException("Database read failed",e);}}
 @JavascriptInterface public boolean save(String data){return database.save(data);}
 @JavascriptInterface public void print(){runOnUiThread(()->((PrintManager)getSystemService(PRINT_SERVICE)).print("STAY Swiss",web.createPrintDocumentAdapter("STAY Swiss"),null));}
 @JavascriptInterface public void share(String data){runOnUiThread(()->{Intent i=new Intent(Intent.ACTION_SEND);i.setType("text/plain");i.putExtra(Intent.EXTRA_TEXT,data);startActivity(Intent.createChooser(i,"STAY Swiss"));});}
 @JavascriptInterface public void shareCsv(String filename,String csv){
  if(csv==null || csv.length()>5_000_000)return;
  final String safeName=(filename==null?"":filename).replaceAll("[^a-zA-Z0-9._-]","_");
  final String name=(safeName.isEmpty()?"stay-export.csv":safeName.endsWith(".csv")?safeName:safeName+".csv");
  runOnUiThread(()->{
   try {
    File directory=new File(getCacheDir(),"exports");
    if(!directory.exists()&&!directory.mkdirs())throw new java.io.IOException("Exportverzeichnis nicht verfügbar");
    File attachment=new File(directory,name);
    try(FileOutputStream stream=new FileOutputStream(attachment,false)){
     stream.write(csv.getBytes(StandardCharsets.UTF_8));
    }
    Uri uri=FileProvider.getUriForFile(MainActivity.this,getPackageName()+".fileprovider",attachment);
    Intent intent=new Intent(Intent.ACTION_SEND);
    intent.setType("text/csv");
    intent.putExtra(Intent.EXTRA_STREAM,uri);
    intent.setClipData(ClipData.newRawUri(name,uri));
    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    startActivity(Intent.createChooser(intent,"CSV-Datei teilen"));
   } catch(Exception ex){
    android.widget.Toast.makeText(MainActivity.this,"CSV-Export fehlgeschlagen: "+ex.getMessage(),android.widget.Toast.LENGTH_LONG).show();
   }
  });
 }
 @JavascriptInterface public String fillWageCertificate(String json){
  File file=null;
  try {
   if(json==null||json.length()>32000)throw new IllegalArgumentException("Formulardaten ungültig");
   org.json.JSONObject input=new org.json.JSONObject(json);
   java.util.Map<String,String> values=new java.util.LinkedHashMap<>();
   java.util.Iterator<String> keys=input.keys();
   while(keys.hasNext()){String key=keys.next();String value=input.getString(key);if(key.length()>100||value.length()>2000||values.size()>=43)throw new IllegalArgumentException("Formularfeld ungültig");values.put(key,value);}
   if(values.isEmpty())throw new IllegalArgumentException("Formulardaten fehlen");
   File dir=new File(getFilesDir(),"pdf_exports");
   if(!dir.isDirectory()&&!dir.mkdirs())throw new java.io.IOException("Exportordner fehlt");
   try(java.io.InputStream template=getAssets().open("wage-certificate-original.pdf")){
    file=File.createTempFile("Lohnausweis-",".pdf",dir);
    try(FileOutputStream output=new FileOutputStream(file)){WageCertificatePdf.fill(MainActivity.this,template,output,values);output.getFD().sync();}
   }
   return new org.json.JSONObject().put("ok",true).put("name",file.getName()).toString();
  }catch(Exception ex){if(file!=null)file.delete();return "{\"ok\":false,\"error\":\"PDF-Erstellung fehlgeschlagen. Vorlage und Formularfelder prüfen.\"}";}
 }
 @JavascriptInterface public String savePdf(String base64){
  try {
   if(base64==null||base64.length()>14000000)throw new IllegalArgumentException("PDF zu gross");
   byte[] bytes=android.util.Base64.decode(base64,android.util.Base64.DEFAULT);
   if(bytes.length<8||!new String(bytes,0,5,StandardCharsets.US_ASCII).equals("%PDF-"))throw new IllegalArgumentException("Keine PDF-Datei");
   File dir=new File(getFilesDir(),"pdf_exports");
   if(!dir.isDirectory()&&!dir.mkdirs())throw new java.io.IOException("Exportordner fehlt");
   File file=File.createTempFile("Lohnausweis-",".pdf",dir);
   try(FileOutputStream stream=new FileOutputStream(file)){stream.write(bytes);stream.getFD().sync();}
   catch(Exception ex){file.delete();throw ex;}
   return file.getName();
  }catch(Exception ex){return "";}
 }
 @JavascriptInterface public void openPdf(String name){
  runOnUiThread(()->{
   try{
    if(name==null||!name.matches("Lohnausweis-[0-9]+\\.pdf"))throw new IllegalArgumentException("Dateiname");
    File file=new File(new File(getFilesDir(),"pdf_exports"),name);
    if(!file.isFile())throw new java.io.IOException("PDF fehlt");
    Uri uri=FileProvider.getUriForFile(MainActivity.this,getPackageName()+".fileprovider",file);
    Intent intent=new Intent(Intent.ACTION_VIEW);
    intent.setDataAndType(uri,"application/pdf");
    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    intent.setClipData(ClipData.newRawUri(name,uri));
    startActivity(Intent.createChooser(intent,"Lohnausweis öffnen"));
   }catch(Exception ex){android.widget.Toast.makeText(MainActivity.this,"PDF kann nicht geöffnet werden. PDF-App prüfen.",android.widget.Toast.LENGTH_LONG).show();}
  });
 }
 @JavascriptInterface public void sharePdf(String name,String recipient){
  runOnUiThread(()->{
   try{
    if(name==null||!name.matches("Lohnausweis-[0-9]+\\.pdf"))throw new IllegalArgumentException("Dateiname");
    File file=new File(new File(getFilesDir(),"pdf_exports"),name);
    if(!file.isFile())throw new java.io.IOException("PDF fehlt");
    Uri uri=FileProvider.getUriForFile(MainActivity.this,getPackageName()+".fileprovider",file);
    Intent i=new Intent(Intent.ACTION_SEND);
    i.setType("application/pdf");
    i.putExtra(Intent.EXTRA_STREAM,uri);
    i.putExtra(Intent.EXTRA_SUBJECT,"Lohnausweis");
    if(recipient!=null&&!recipient.trim().isEmpty())i.putExtra(Intent.EXTRA_EMAIL,new String[]{recipient.trim()});
    i.setClipData(ClipData.newRawUri(name,uri));
    i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    startActivity(Intent.createChooser(i,"Lohnausweis teilen oder per E-Mail senden"));
   }catch(Exception ex){android.widget.Toast.makeText(MainActivity.this,"PDF-Freigabe fehlgeschlagen",android.widget.Toast.LENGTH_LONG).show();}
  });
 }
 @JavascriptInterface public String countriesJson(){
  org.json.JSONArray countries=new org.json.JSONArray();
  String[] codes=java.util.Locale.getISOCountries();
  java.util.Locale german=java.util.Locale.GERMAN;
  java.util.ArrayList<String[]> list=new java.util.ArrayList<>();
  for(String code:codes){
   java.util.Locale locale=new java.util.Locale("",code);
   String name=locale.getDisplayCountry(german);
   if(name!=null&&!name.isEmpty())list.add(new String[]{code,name});
  }
  java.util.Collections.sort(list,(a,b)->a[1].compareToIgnoreCase(b[1]));
  for(String[] entry:list){
   org.json.JSONArray pair=new org.json.JSONArray();
   pair.put(entry[0]);pair.put(entry[1]);countries.put(pair);
  }
  return countries.toString();
 }
 @JavascriptInterface public void openExternal(String url){
  if(!"https://buymeacoffee.com/swisstech".equals(url))return;
  runOnUiThread(()->{
   try{Intent intent=new Intent(Intent.ACTION_VIEW,android.net.Uri.parse(url));startActivity(intent);}
   catch(android.content.ActivityNotFoundException ex){android.widget.Toast.makeText(MainActivity.this,"Kein Browser verfügbar",android.widget.Toast.LENGTH_LONG).show();}
  });
 }
 @JavascriptInterface public void email(String recipient, String subject, String body){
  final String to=recipient==null?"":recipient.trim();
  final String sub=subject==null?"":subject;
  final String message=body==null?"":body;
  runOnUiThread(()->{
   Intent intent=new Intent(Intent.ACTION_SENDTO);
   intent.setData(android.net.Uri.parse("mailto:"));
   if(!to.isEmpty())intent.putExtra(Intent.EXTRA_EMAIL,new String[]{to});
   intent.putExtra(Intent.EXTRA_SUBJECT,sub);
   intent.putExtra(Intent.EXTRA_TEXT,message);
   try{startActivity(Intent.createChooser(intent,"E-Mail vorbereiten"));}
   catch(android.content.ActivityNotFoundException ex){
    android.widget.Toast.makeText(MainActivity.this,"Keine E-Mail-App installiert",android.widget.Toast.LENGTH_LONG).show();
   }
  });
 }
 }
}