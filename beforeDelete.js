var orgid = a.valueof("$comp.orgid");
var relid = a.valueof("$comp.relationid");

var toDel = new Array();
// Rechte
toDel.push(new Array("TABLEACCESS", "TATYPE = 'R' and FRAME_ID = " + a.valueofObj("$image.FrameID") + " and ROW_ID = '" + relid + "'"));
// Orgrelation und Adressrelationen
toDel.push(new Array("RELATION", "RELATION.PERS_ID is null and RELATION.ORG_ID = '" + orgid + "'"));
// Kommunikation
toDel.push( new Array("COMM", "RELATION_ID = '" + relid + "'"));
// Verteilermitgliedschaften
toDel.push( new Array("DISTLISTMEMBER", "RELATION_ID = '" + relid + "'"));
// Kampagnenteilnahme
toDel.push( new Array("CAMPAIGNPARTICIPANT", "RELATION_ID = '" + relid + "'"));
// Objektbeziehung
toDel.push( new Array("OBJECTRELATION", "(SOURCE_OBJECT = 1 and  SOURCE_ID = '" + relid + "') or ( DEST_OBJECT = 1 and DEST_ID = '" + relid + "')"));
// Attribute
toDel.push( new Array("ATTRLINK", "OBJECT_ID = 1 and ROW_ID = '" + relid + "'"));
// Orgrelation und Adressrelationen
toDel.push(new Array("ADDRESS", "RELATION_ID = '" + relid + "'"));


a.sqlDelete(toDel);