/*
Programmierhilfe Stammdaten Domain
REQUIRED for new Classes: extends f_basic
*/
"use strict";
let dom=(function(){
	class f_basic
	{
		constructor(id,name,desc,date,edit){
			this.Id=id;
			this.Name=name;
			this.Beschreibung=desc;
			this.Datum=date;
			this.Edit=edit;
		}
		toString(){return `[${this.Id}] ${this.Name}`;}
	}

	class f_eintrag extends f_basic
	{
		constructor(id,name,desc,text,thema,spr,sort,date,edit){
			super(id,name,desc,date,edit);
			this.Thema=thema;
			this.Sprache=spr;
			this.Sort=sort;
			this.Text=text;
		}
		toString(){return super.toString();}
	}

	class f_thema extends f_basic
	{
		constructor(id,name,sprache,date,edit){
			super(id,name,'',date,edit);
			this.Sprache=sprache;
		}
		toString(){return super.toString();}
	}

	class f_sprache extends f_basic
	{
		constructor(id,name,desc,date,edit){
			super(id,name,desc,date,edit);
		}
		toString(){return super.toString();}
	}

	/*REQUIRED for MENU*/
	class menubar extends f_basic
	{
		constructor(name,type,desc){
			super(0,name,desc);
			this.type=type;
			this.dsRules=[];
		}
	}

	return {f_eintrag,f_thema,f_sprache,menubar};
})();
