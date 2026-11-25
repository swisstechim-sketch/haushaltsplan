package ch.swisstech.stay;
import android.content.Context;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import org.json.*;
public final class StayDatabase extends SQLiteOpenHelper {
 private static final String[] TABLES={"guests","rooms","bookings","invoices","payments","services","tasks","logs","templates"};
 public StayDatabase(Context c){this(c,"stay_swiss.db");}
 StayDatabase(Context c,String name){super(c,name,null,1);}
 @Override public void onConfigure(SQLiteDatabase db){db.setForeignKeyConstraintsEnabled(true);}
 @Override public void onCreate(SQLiteDatabase db){
 db.execSQL("CREATE TABLE hotel (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL)");
 for(String t:TABLES){
 String refs="";
 switch(t){
 case "bookings": refs=", guest TEXT NOT NULL REFERENCES guests(id), room TEXT NOT NULL REFERENCES rooms(id)";break;
 case "invoices": refs=", booking TEXT NOT NULL REFERENCES bookings(id)";break;
 case "payments": refs=", invoice TEXT NOT NULL REFERENCES invoices(id)";break;
 case "services": refs=", booking TEXT NOT NULL REFERENCES bookings(id)";break;
 case "tasks": refs=", room TEXT NOT NULL REFERENCES rooms(id)";break;
 }
 db.execSQL("CREATE TABLE "+t+" (id TEXT PRIMARY KEY NOT NULL, position INTEGER NOT NULL, payload TEXT NOT NULL"+refs+")");
 }
 for(String pair:new String[]{"bookings guest","bookings room","invoices booking","payments invoice","services booking","tasks room"}){String[] p=pair.split(" ");db.execSQL("CREATE INDEX idx_"+p[0]+"_"+p[1]+" ON "+p[0]+"("+p[1]+")");}
 }
 @Override public void onUpgrade(SQLiteDatabase db,int oldVersion,int newVersion){throw new IllegalStateException("Unsupported database migration");}
 public synchronized String load() throws JSONException {
 SQLiteDatabase db=getReadableDatabase(); JSONObject out=new JSONObject();
 try(Cursor c=db.rawQuery("SELECT payload FROM hotel WHERE id=1",null)){if(!c.moveToFirst())return "";out.put("hotel",new JSONObject(c.getString(0)));}
 for(String t:TABLES){JSONArray a=new JSONArray();try(Cursor c=db.rawQuery("SELECT payload FROM "+t+" ORDER BY position",null)){while(c.moveToNext())a.put(new JSONObject(c.getString(0)));}out.put(t,a);}
 return out.toString();
 }
 public synchronized boolean save(String raw){
 if(raw==null)return false;
 try{
 JSONObject data=new JSONObject(raw);
 SQLiteDatabase db=getWritableDatabase();
 db.beginTransaction();
 try{
 for(int i=TABLES.length-1;i>=0;i--)db.delete(TABLES[i],null,null);
 for(String t:TABLES){JSONArray a=data.getJSONArray(t);for(int i=0;i<a.length();i++){JSONObject row=a.getJSONObject(i);ContentValues v=new ContentValues();v.put("id",row.getString("id"));v.put("position",i);v.put("payload",row.toString());
 switch(t){case "bookings":v.put("guest",row.getString("guest"));v.put("room",row.getString("room"));break;case "invoices":case "services":v.put("booking",row.getString("booking"));break;case "payments":v.put("invoice",row.getString("invoice"));break;case "tasks":v.put("room",row.getString("room"));break;}
 db.insertOrThrow(t,null,v);}}
 ContentValues h=new ContentValues();h.put("id",1);h.put("payload",data.getJSONObject("hotel").toString());if(db.insertWithOnConflict("hotel",null,h,SQLiteDatabase.CONFLICT_REPLACE)<0)throw new IllegalStateException("Hotel write failed");
 db.setTransactionSuccessful();
 }finally{db.endTransaction();}
 return true;
 }catch(Exception e){android.util.Log.e("StayDatabase","Database write rejected",e);return false;}
 }
}