# js-spielplatz
# ######################################################################
node -version: v12.16.1  

folgende Erweiterungen müssen für die Anwendungen mh und test installiert werden:  
npm install --save xml2json  
npm install --save xml-js  
npm install --save mssql  

# ######################################################################
Module -> Clientside Javascript  

  CSS -> css Datei  
  img -> Bilder für Fitness-Übungsgeräte  
  lib -> Javascript Dateien  

      lib_0 -> Javascript Dateien für Fitness APP  
        ctrl.js -> Steuerung  
        daoXXX.js -> Speicherzpezifische Datenschnittstellen  
        domain -> Geschäftsmodel  

      lib_1 -> Javascript Dateien für Programierhilfe APP  
        siehe lib_0  

      hlp.js -> Hilfe Funktionen  
      init.js -> Inizialisiert die Anwendung  
      view.js -> erzeugt die Darstellung  
      view_h.js -> Hilfe Funktionen für die Darstellung  

  oop.html -> Startet Fitness oder Programierhilfe APP  (Serverseitig -> note_js/mh)  
  test.html -> Startet Test APP (Serverseitig -> note_js/test)  

# ######################################################################
node_js -> Serverside Javascript  

  mh -> Fitness oder Programierhilfe APP  
    dao -> Datenschnitstellen  
    hlp -> Hilfe Funktionen  
    json -> lowDb Dateien  
    xml -> XML Dateien  
    mh.js -> Startet Fitness oder Programierhilfe APP  

  test -> Test APP  
    dao -> Datenschnittstellen  
    json -> lowDb Dateien      
    xml -> XML Dateien  
    test.js -> Startet Test APP  
