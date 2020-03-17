/*
Fitness Stammdaten Domain
REQUIRED for new Classes: extends f_basic
*/
"use strict";
let dom=(function(){	
	class f_basic
	{
		constructor(id,name,desc){
			this.Id=id;
			this.Name=name;
			this.Desc=desc;
		}		
		toString(){return `[${this.Id}] ${this.Name}`;}
	}
	class f_arten extends f_basic
	{
		constructor(id,name,desc){super(id,name,desc)}	
		toString(){return super.toString();}
	}
	class f_eigenschaft extends f_basic
	{
		constructor(id,name,desc,farbe,sort){
			super(id,name,desc);
			this.Farbe=farbe;
			this.Sort=sort;			
		}
		toString(){return super.toString();}
	}
	class f_geraete extends f_basic
	{
		constructor(id,name,desc,art,bild){
			super(id,name,desc);
			this.Art=art;
			this.Bild=bild;						
		}
		toString(){return super.toString();}
	}
	class menubar extends f_basic
	{
		constructor(name,type,desc){
			super(0,name,desc);
			this.type=type;
			this.dsRules=[];
		}
	}	
	return {
		f_arten: f_arten,
        f_eigenschaft: f_eigenschaft,
		f_geraete: f_geraete,
		menubar: menubar
    }; 
})();	