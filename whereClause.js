import("lib_grant");

// Leserechte holen
a.rs( getGrantCondition( a.valueof("$sys.currentimagenamewithsuffixandallyouneedaddionally"), 
    "( RELATION.ORG_ID = ORG.ORGID and RELATION.PERS_ID is null and ADDRESS.ADDRESSID = RELATION.ADDRESS_ID )" ));

//test