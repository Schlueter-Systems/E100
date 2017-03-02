import("lib_duplicate");
import("lib_attr");
import("lib_keyword");
import("lib_schlueter");
import("lib_textblock");
import("lib_history");
import("schlueter_table_condition");

var relid = a.valueof("$comp.idcolumn");

var ret = checkAddress();
if ( ret  && a.valueof("$sys.workingmode") == a.FRAMEMODE_NEW )
{
    var hasDup = "";
    if (a.valueof("$comp.DUP_CHECK") != "1")
    {
        hasDup = hasOrgDuplicates(a.valueof("$comp.relationid"), getOrgFramePattern());
    }
    if ( hasDup != "" ) //... wenn Dubletten existieren:
    {
        // das Dubletten-Register angezeigen
        a.imagevar("$image.dupids", hasDup);
        a.refresh("$comp.Register_detail");
        a.refresh("$comp.Register_dub");
        ret = false;
    }
    else a.imagevar("$image.dupids", "");
}
// min und max Attribute überprüfen
if ( ret )	ret = checkAttrCount();

//bei qualifizierten Kunden muss eine Telefonnummer angegeben sein
if ( ret && isQualified(a.valueof("$comp.QUALIFICATION")) )
{
    ret = hasTelNr(a.getTableData("$comp.Table_comm", a.ALL));
}

//Sondervereinbarungstext speichern
if( ret && a.hasvar("$image.SV_CONDITION_TEXTBLOCKID") && a.valueof("$comp.memo_SV_Textbaustein") != "" )
{
    var rowid = a.valueof("$image.SV_CONDITION_TEXTBLOCKID");
    var longtext = a.valueof("$comp.memo_SV_Textbaustein");
    if(longtext != "")
    {
        if( rowid != "" )
        {
            var cols = ["LONG_TEXT", "DATE_EDIT", "USER_EDIT"];
            var coltypes = a.getColumnTypes("CONDITION_TEXTBLOCK", cols);
            var vals = [longtext, date.date(), a.valueof("$sys.user")];

            a.sqlUpdate("CONDITION_TEXTBLOCK", cols, coltypes, vals, "CONDITION_TEXTBLOCKID = '" + rowid + "'");
        }
    }
}

//Konditionshistorien sperrend/entsperren
if(ret && a.valueof("$comp.chk_cond_locked") != "")
{
    var locked = a.valueof("$comp.chk_cond_locked");
    var newValue = "KOND";
    if(locked == "Y")
    {
        //Wenn gesperrt wird in die KOND-Spalte der Historie "KOND_LOCKED" geschrieben.
        newValue = "KOND_LOCKED";
    }
    
    var rowID = a.valueof("$comp.relationid");
    var histids = a.sql("select HISTORYID from HISTORY H join HISTORYLINK L on H.HISTORYID = L.HISTORY_ID where ROW_ID = '" + rowID + "'", a.SQL_COLUMN);
    
    //Alle Historien die aus dem Report erstellt wurden sind schon mit "KOND" vorbelegt
    //-> diese werden jetzt aktualisiert
    var histcols = ["DATE_EDIT","USER_EDIT","CONDITION_HIST"];
    var histtypes = a.getColumnTypes("HISTORY", histcols);
    var histvalues = [date.date(), a.valueof("$sys.user"), newValue];
    
    a.sqlUpdate("HISTORY", histcols, histtypes, histvalues, "HISTORYID in ('" + histids.join("','") + "') and CONDITION_HIST in ('KOND', 'KOND_LOCKED')")
}

if( ret )
    ret = checkConditionTable();

if( ret )
    ret = checkConditionProductTable();

if( ret )
    ret = checkConditionTermsOfPaymentTable();

a.rs ( ret );

function checkAddress()
{
    var addresses = a.getTableData("$comp.tbl_ADDRESS", a.ALL);
    if ( addresses.length == 1 )  
    {
        a.setValue("$comp.ADDRESS_ID", addresses[0][0]);
    }
    var standardaddressid = a.valueof("$comp.ADDRESS_ID");
    for ( var i = 0; i < addresses.length; i++)
    {
        if ( addresses[i][0] == standardaddressid )
        {
            return true;
        }
    }	
    a.showMessage("Keine Standardadresse gesetzt !");
    if ( addresses.length == 0 )
    { 
        var id = a.addTableRow("$comp.tbl_ADDRESS");
        a.setValue("$comp.ADDRESS_ID", id);
        a.updateTableCell("$comp.tbl_ADDRESS", id, 2, "-51", "-51");
        a.updateTableCell("$comp.tbl_ADDRESS", id, 3, "1", getKeyName( "1", "AdressTyp"));
    }
    a.setFocus("$comp.Adressen");
    return false;	
}