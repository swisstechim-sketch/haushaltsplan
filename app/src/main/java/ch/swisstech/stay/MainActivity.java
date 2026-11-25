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
 @Override public void onCreate(Bundle b){super.onCreate(b); database=new StayDatabase(this); web=new WebView(this); web.getSettings().setJavaScriptEnabled(true); web.getSettings().setDomStorageEnabled(true); web.getSettings().setAllowFileAccess(false); web.getSettings().setAllowContentAccess(false); web.addJavascriptInterface(new Bridge(),"Stay"); web.setWebViewClient(new WebViewClient(){@Override public boolean shouldOverrideUrlLoading(WebView v,String url){return true;}}); setContentView(web); web.loadUrl("file:///android_asset/index.html");}
 public class Bridge {
 @JavascriptInterface public String load(){try { String current=database.load(); if(!current.isEmpty())return current; String legacy=getSharedPreferences("stay",MODE_PRIVATE).getString("data",""); if(!legacy.isEmpty()){if(!database.save(legacy))throw new IllegalStateException("Migration failed");getSharedPreferences("stay",MODE_PRIVATE).edit().remove("data").commit();}return legacy; }catch(Exception e){throw new IllegalStateException("Database read failed",e);}}
 @JavascriptInterface public boolean save(String data){return database.save(data);}
 @JavascriptInterface public void print(){runOnUiThread(()->((PrintManager)getSystemService(PRINT_SERVICE)).print("STAY Swiss",web.createPrintDocumentAdapter("STAY Swiss"),null));}
 @JavascriptInterface public void share(String data){runOnUiThread(()->{Intent i=new Intent(Intent.ACTION_SEND);i.setType("text/plain");i.putExtra(Intent.EXTRA_TEXT,data);startActivity(Intent.createChooser(i,"STAY Swiss"));});}
 }
}