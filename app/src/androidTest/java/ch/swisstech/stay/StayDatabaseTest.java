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
  Context c=InstrumentationRegistry.getInstrumentation().getContext();
  c.deleteDatabase("stay_swiss.db");
  StayDatabase db=new StayDatabase(c);
  try {
   JSONObject data=new JSONObject();
   data.put("hotel",new JSONObject().put("name","Test Hotel"));
   for(String k:new String[]{"guests","rooms","bookings","invoices","payments","services","tasks","logs","templates"})data.put(k,new JSONArray());
   assertTrue(db.save(data.toString()));
   String before=db.load();
   data.getJSONArray("payments").put(new JSONObject().put("id","p").put("invoice","missing").put("amount",10));
   assertFalse(db.save(data.toString()));
   assertEquals(before,db.load());
   db.close();
   db=new StayDatabase(c);
   assertEquals(before,db.load());
  } finally {db.close();c.deleteDatabase("stay_swiss.db");}
 }
}
