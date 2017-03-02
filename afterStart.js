import("lib_calendar");
import("lib_frame");
import("lib_frameSearch");
import("lib_keyword");

//Damit Suchpattern beim Öffnen einer Firma nicht nochmal gesetzt u. ausgeführt wird
var wm = a.valueof("$sys.workingmode");

// Vorbelegung der Filter für TASK und EVENT
initFilters();

if(wm == a.FRAMEMODE_TABLE && a.hasvar("$image.setSearchPattern") && a.valueof("$image.setSearchPattern") == "true" )
{
    //Frame-Titel
    var frametitle = a.translate("Umkreis") + ": " + a.valueof("$image.RADIUS") + " km";
    a.imagevar("$image.frametitle", frametitle);
    
    var pattern = "";
    var addPattern = "";
    var parentid = "";
    var baseid = getBaseID();
    var group = [];
    
    var attrid_qual = "bd76c85a-5264-4d82-9dea-eca8debe596b"; //Qualifikation
    var attrid_qual_exists = "2a6a26b3-0beb-4642-84e1-756f1f5e0588"; //Qualifikation vorhanden
    var attrid_uks = "add32677-b3da-4b90-a12d-ca0b6c73185d"; //Umkreissuche
    var attrid_uks_y = "528cfbf7-c67f-43c2-9e09-749401b8cee7"; // Umkreissuche Ja
    var attrid_ssh = "6a44460b-a775-46e5-9db2-95dca761118f"; //SSH-Betrieb
    var attrid_bsf = "c5ec961e-f1db-42b3-b28e-259a7b96a48c"; //BSF
    
    switch(a.valueof("$image.RECTYPE"))
    {
        case "1"://Handwerkerempfehlung
        {
            group = addGroupToSearchXML( [["; comp.cbx_attrvalue; " + attrid_qual + "; " + attrid_qual_exists + "; "
                                        , "Qualifikation / Qualifikation vorhanden", attrid_ssh, "GLEICH"]
                                    ,["; comp.cbx_attrvalue; " + attrid_qual + "; " + attrid_qual_exists + "; "
                                        , "Qualifikation / Qualifikation vorhanden", attrid_bsf, "GLEICH"]]
                                    , baseid, "OR", 2, "");

            pattern += group[1];

            addPattern += createSearchBlockElement(0, false, baseid, "comp.STATUS"
                                            , "Status", "1", "GLEICH");
            addPattern += createSearchBlockElement(1, false, baseid, "; comp.cbx_attrvalue; " + attrid_qual + "; " + attrid_uks + "; "
                                            , "Qualifikation / Umkreissuche", attrid_uks_y, "GLEICH");
                                            
            pattern = finalize(pattern, addPattern, baseid);
        }
            break;
        case "2"://Händlerempfehlung
        {
            pattern = createSearchBlock( [["comp.STATUS", "Status", "1", "GLEICH"]
                                         ,["comp.ORGTYPE", "Firmentyp", getKeyValue("Händler", "ORGTYPE"), "GLEICH"]
                                         ,["; comp.cbx_attrvalue; " + attrid_qual + "; " + attrid_uks + "; "
                                          , "Qualifikation / Umkreissuche", attrid_uks_y, "GLEICH"]] );
        }
            break;
        default:
        {
            pattern = null;
        }
    }

    a.setSearchPattern(pattern, frametitle);
    a.doAction(ACTION.FRAME_RUNSELECTION_TABLE);
}
else
{
    //Meldung und Frame schliessen wenn kein Datensatz selektiert werden konnte 
    checkRowCount();
}

//Damit Berechtigungslogik sauber ausgeführt wird
if(wm != a.FRAMEMODE_TABLE)
    a.refresh();