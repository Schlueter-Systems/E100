import("lib_linkedFrame");
import("lib_frame");

resetFrame();

//Wir ben�tigt, da onValidation aus einem unerkl�rlichen Grund 2 Mal ausgef�hrt wird -- zip.onValidation
a.imagevar("$image.validationIsRun", "");

// Schliessen, Speichern, Aktualisieren von Superframe
swreturn();

//babu