# js-spielplatz
--------------------------------------------------------------------------  

**Anforderung:**  
* Eine Struktur für zwei Anwendungen (Stammdaten Fitness APP / Stammdaten Programierhilfe APP)
* Datenbindung an MSSQL, MySql, Xml, LowDb oder MongoDb 
* Online/Offline mit indexedDB  
* ECMA6 Standard  

**Serverseitige wird Node für die Datenlieferung verwendet**  
Node Version: v12.16.1  

**folgende Erweiterungen müssen für die Anwendungen mh und test installiert werden:**  
`$ npm install --save xml2json`  
`$ npm install --save xml-js`  
`$ npm install --save mssql`   
`$ npm install --save mysql`   
`$ npm install --save lowdb`  
`$ npm install --save mongodb`  
`$ npm install --save http`    

--------------------------------------------------------------------------  

* **Module** -> Client Javascript    
    * CSS -> css Datei    
    * img -> Bilder für Fitness-Übungsgeräte    
    * lib -> Javascript Dateien    
        * lib_0 -> Javascript Dateien für Fitness APP  
            * ctrl.js -> Steuerung  
            * daoXXX.js -> Speicherzpezifische Datenschnittstellen  
            * domain -> Geschäftsmodel  

        * lib_1 -> Javascript Dateien für Programierhilfe APP  
            * siehe lib_0  

        * hlp.js -> Hilfe Funktionen  
        * init.js -> Inizialisiert die Anwendung  
        * view.js -> erzeugt die Darstellung  
        * view_h.js -> Hilfe Funktionen für die Darstellung  

    * oop.html -> Startet Fitness oder Programierhilfe APP  (Serverseitig -> note_js/mh)  
    * test.html -> Startet Test APP (Serverseitig -> note_js/test)  

--------------------------------------------------------------------------  

* **note_js** -> Server Javascript  
    * mh -> Fitness und Programierhilfe Server  
        * dao -> Datenschnitstellen  
        * hlp -> Hilfe Funktionen  
        * json -> lowDb Dateien  
        * xml -> XML Dateien  
        * mh.js -> Startet Fitness und Programierhilfe Server  

    * test -> Test APP  
        * dao -> Datenschnittstellen  
        * json -> lowDb Dateien  
        * xml -> XML Dateien  
        * test.js -> Startet Test Server  
