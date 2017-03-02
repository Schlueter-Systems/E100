import("lib_grant");
import("lib_frame");

if(tools.hasRole(a.valueof("$sys.user"), "PROJECT_Keyuser"))
{
    //Personen oder Historien vorhanden oder Datensatz aus ERP?
    //Ticket #271: ERP Firmen nicht löschen
    var orgid = a.valueof("$comp.orgid");
    var relid = a.valueof("$comp.relationid");
    var personen = a.sql("select RELATION.RELATIONID from RELATION where PERS_ID is not null and ORG_ID = '" + orgid + "'", a.SQL_COLUMN);
    var historie = a.sql("select HISTORYLINK.HISTORYLINKID from HISTORYLINK where OBJECT_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + relid + "'", a.SQL_COLUMN);

    var isERP = a.valueof("$comp.SOURCE_ERP");
    if (personen.length > 0 || historie.length > 0 || isERP == "Y") 
    {
        a.rs("false");
    }
    else
    {
        // Recht für Löschen
        //a.rs( isgranted( "delete", a.valueof("$comp.idcolumn")));
        if( tools.hasRole(a.valueof("$sys.user"), "PROJECT_Keyuser") )
            a.rs("true");
    }
}
else
    a.rs(false);