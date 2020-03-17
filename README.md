# js-spielplatz
<p>--------------------------------------------------------------------------<p/>
<p><b>Anforderung:</b><br/>
Eine Struktur für zwei Anwendungen (Stammdaten Fitness APP / Stammdaten Programierhilfe APP)<br/>
Online/Offline APP (IndexedDb)</P>
<p><b>node -version:</b> v12.16.1 </p>
<p><b>folgende Erweiterungen müssen für die Anwendungen mh und test installiert werden:</b><br/>
<tab indent=20>npm install --save xml2json<br/>
<tab indent=20>npm install --save xml-js<br/>
<tab indent=20>npm install --save mssql<br/>
</p>
<p>--------------------------------------------------------------------------<p/>
<p><b>Module</b> -> Clientside Javascript<br/>
  <p style="tab-size:30;-moz-tab-size:30;-ms-tab-size:30">
  CSS -> css Datei<br/>
  img -> Bilder für Fitness-Übungsgeräte<br/>
  lib -> Javascript Dateien<br/>
  <br/>
    lib_0 -> Javascript Dateien für Fitness APP<br/>
    ctrl.js -> Steuerung<br/>
    daoXXX.js -> Speicherzpezifische Datenschnittstellen<br/>
    domain -> Geschäftsmodel<br/>
  <br/>
    lib_1 -> Javascript Dateien für Programierhilfe APP<br/>
    siehe lib_0<br/>
  <br/>
  hlp.js -> Hilfe Funktionen<br/>
  init.js -> Inizialisiert die Anwendung<br/>
  view.js -> erzeugt die Darstellung<br/>
  view_h.js -> Hilfe Funktionen für die Darstellung<br/>
  <br/>
  oop.html -> Startet Fitness oder Programierhilfe APP  (Serverseitig -> note_js/mh)<br/>
  test.html -> Startet Test APP (Serverseitig -> note_js/test)<br/>
  </p>
</p>
<p>--------------------------------------------------------------------------<p/>
<p><b>node_js</b> -> Serverside Javascript<br/>
  mh -> Fitness oder Programierhilfe APP<br/>
    dao -> Datenschnitstellen<br/>
    hlp -> Hilfe Funktionen<br/>
    json -> lowDb Dateien<br/>
    xml -> XML Dateien<br/>
    mh.js -> Startet Fitness oder Programierhilfe APP<br/>
  <br/>
  test -> Test APP<br/>
    dao -> Datenschnittstellen<br/>
    json -> lowDb Dateien<br/>
    xml -> XML Dateien<br/>
    test.js -> Startet Test APP
</p>
