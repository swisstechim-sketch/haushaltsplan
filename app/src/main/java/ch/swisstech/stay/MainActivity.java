package ch.swisstech.stay;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.JavascriptInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.print.PrintManager;
public class MainActivity extends Activity {
 private WebView web;
 private StayDatabase database;
 @Override public void onCreate(Bundle b){super.onCreate(b); database=new StayDatabase(this); web=new WebView(this); web.getSettings().setJavaScriptEnabled(true); web.getSettings().setDomStorageEnabled(true); web.getSettings().setTextZoom(100); web.getSettings().setAllowFileAccess(false); web.getSettings().setAllowContentAccess(false); web.addJavascriptInterface(new Bridge(),"Stay"); web.setWebViewClient(new WebViewClient(){@Override public boolean shouldOverrideUrlLoading(WebView v,String url){return true;}}); setContentView(web); web.loadUrl("file:///android_asset/index.html");}
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
 }
}