package ch.swisstech.stay;
import android.content.Context;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.json.*;
import static org.junit.Assert.*;
@RunWith(AndroidJUnit4.class)
public class StayDatabaseTest {
 @Test public void persistenceAndRollback() throws Exception {
  Context c=InstrumentationRegistry.getInstrumentation().getTargetContext();
  c.deleteDatabase("stay_test_isolated.db");
  StayDatabase db=new StayDatabase(c,"stay_test_isolated.db");
  try {
   JSONObject data=new JSONObject();
   data.put("hotel",new JSONObject().put("name","Test Hotel"));
   for(String k:new String[]{"guests","rooms","bookings","invoices","payments","services","tasks","logs","templates"})data.put(k,new JSONArray());
   assertTrue("Initial database write must succeed",db.save(data.toString()));
   String before=db.load();
   data.getJSONArray("payments").put(new JSONObject().put("id","p").put("invoice","missing").put("amount",10));
   assertFalse("Invalid invoice reference must be rejected",db.save(data.toString()));
   assertEquals(before,db.load());
   db.close();
   db=new StayDatabase(c,"stay_test_isolated.db");
   assertEquals(before,db.load());
  } finally {db.close();c.deleteDatabase("stay_test_isolated.db");}
 }
 @Test public void upgradePreservesExistingHotelData() throws Exception {
  Context c=InstrumentationRegistry.getInstrumentation().getTargetContext();
  String name="stay_test_upgrade.db";
  c.deleteDatabase(name);
  StayDatabase db=new StayDatabase(c,name);
  try {
   JSONObject data=new JSONObject().put("hotel",new JSONObject().put("name","Existing Hotel"));
   for(String k:new String[]{"guests","rooms","bookings","invoices","payments","services","tasks","logs","templates"})data.put(k,new JSONArray());
   data.getJSONArray("guests").put(new JSONObject().put("id","g").put("name","Existing Guest"));
   data.getJSONArray("rooms").put(new JSONObject().put("id","r").put("number","101"));
   data.getJSONArray("bookings").put(new JSONObject().put("id","b").put("guest","g").put("room","r"));
   data.getJSONArray("invoices").put(new JSONObject().put("id","i").put("booking","b").put("total",100));
   data.getJSONArray("payments").put(new JSONObject().put("id","p").put("invoice","i").put("amount",50));
   assertTrue(db.save(data.toString()));
   android.database.sqlite.SQLiteDatabase raw=db.getWritableDatabase();
   for(String k:new String[]{"lostItems","guestWishes","maintenance","handover"})raw.execSQL("DROP TABLE "+k);
   raw.setVersion(1);
   db.close();
   db=new StayDatabase(c,name);
   JSONObject upgraded=new JSONObject(db.load());
   assertEquals(2,db.getReadableDatabase().getVersion());
   assertEquals("Existing Hotel",upgraded.getJSONObject("hotel").getString("name"));
   for(String k:new String[]{"guests","rooms","bookings","invoices","payments"})assertEquals(data.getJSONArray(k).toString(),upgraded.getJSONArray(k).toString());
   for(String k:new String[]{"lostItems","guestWishes","maintenance","handover"})assertEquals(0,upgraded.getJSONArray(k).length());
  } finally {db.close();c.deleteDatabase(name);}
 }
}
