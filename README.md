# js-spielplatz
# ######################################################################
<p><b>Anforderung:</b><br/>
Eine Struktur für zwei Anwendungen (Stammdaten Fitness APP / Stammdaten Programierhilfe APP)<br/>
Online/Offline APP (IndexedDb)</P>
<p><b>node -version:</b> v12.16.1 </p>
<p><b>folgende Erweiterungen müssen für die Anwendungen mh und test installiert werden:</b><br/>
<tab indent=20>npm install --save xml2json<br/>
<tab indent=20>npm install --save xml-js<br/>
<tab indent=20>npm install --save mssql<br/>
</p>
# ######################################################################

<p><b>Module</b> -> Clientside Javascript<br/>
<tab indent=20>CSS -> css Datei<br/>
<tab indent=20>img -> Bilder für Fitness-Übungsgeräte<br/>
<tab indent=20>lib -> Javascript Dateien<br/>
<br/>
<tab indent=20>lib_0 -> Javascript Dateien für Fitness APP<br/>
<tab indent=20>ctrl.js -> Steuerung<br/>
<tab indent=20>daoXXX.js -> Speicherzpezifische Datenschnittstellen<br/>
<tab indent=20>domain -> Geschäftsmodel<br/>
<br/>
<tab indent=20>lib_1 -> Javascript Dateien für Programierhilfe APP<br/>
<tab indent=20>siehe lib_0<br/>
<br/>
<tab indent=20>hlp.js -> Hilfe Funktionen<br/>
<tab indent=20>init.js -> Inizialisiert die Anwendung<br/>
<tab indent=20>view.js -> erzeugt die Darstellung<br/>
<tab indent=20>view_h.js -> Hilfe Funktionen für die Darstellung<br/>
<br/>
oop.html -> Startet Fitness oder Programierhilfe APP  (Serverseitig -> note_js/mh)<br/>
test.html -> Startet Test APP (Serverseitig -> note_js/test)<br/>
</p>
# ######################################################################
<b>node_js</b> -> Serverside Javascript  

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
