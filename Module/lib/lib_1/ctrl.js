/*
Programmierhilfe Stammdaten Controler
*/
"use strict";
let cont =(function(){	
	//VIEWER
	const E_TITLE=[
	{neu:"neuen Eintrag anlegen",edit:"Eintrag speichern",del:"Eintrag löschen"},
	{neu:"neues Thema anlegen",edit:"Thema speichern",del:"Thema löschen"},
	{neu:"neues Subsprache anlegen",edit:"Subsprache speichern",del:"Subsprache löschen"},
	{neu:"neue Sprache anlegen",edit:"Sprache speichern",del:"Sprache löschen"}];	
	//constructor(id,name,desc,val,thema,sub_spr,spr,date,edit)
	const F_EINTRAG=new dom.f_eintrag(0,'','','',0,0,0,Date.now(),Date.now());
	//constructor(id,name,desc,sub_spr,spr,date,edit)
	const F_THEMA=new dom.f_thema(0,'','',0,0,Date.now(),Date.now());
	//constructor(id,name,desc,spr,date,edit)
	const f_sub_thema=new dom.f_sub_thema(0,'','',0,Date.now(),Date.now());
	//constructor(id,name,desc,date,edit)
	const F_SPRACHE=new dom.f_sprache(0,'','',Date.now(),Date.now());	
	let setError=(e)=>{
		try {
			view_h.clear_r();
			document.getElementById('div_edit').style.visibility='hidden';
			document.getElementById('right').insertAdjacentHTML('beforeend', `<p><b>${e}</b></p>`)
			console.log(JSON.stringify(e))
		}
		catch (e) {}
	}	
	let setForm=()=>{
		try {
			viewer.createMain();
			view_h.setWait(true);
			(async () => {					
				let promise = new Promise((resolve, reject) => {
					dao.sprDao.fillLst();
					dao.subsprDao.fillLst();	
					dao.temDao.fillLst();
					dao.einDao.fillLst();													
					setTimeout(() => resolve("done!"), 500);
				});				
				let result = await promise; // wait until the promise resolves (*)
				view_h.setWait(false);
				viewer.createMenu();
			})();				
		}
		catch (e) {setError(e)}
		finally{}
	}	
	let createNForm=()=>{
		try {
			let t=getAktMenu().type;
			let ti=t==="f_thema"?1:t==="f_sub_thema"?2:t==="f_sprache"?3:0;
			viewer.createForm(getNewModel(t));			
			view_h.setEditTitle(E_TITLE[ti].neu,E_TITLE[ti].edit,E_TITLE[ti].del);
		}
		catch (e) {setError(e)}
	}
	let fillNForm=()=>{viewer.display(getNewModel(getAktMenu().typ));}	
	let set_view=(nr)=>{viewer.display(getModel(nr));}
	//MODEL wird in view.js verwendet siehe: edit_click() und menu_click()
	let getNewModel=(art)=>{
		if( art==="f_eintrag") return F_EINTRAG;
		else if(art==="f_thema") return F_THEMA;
		else if(art==="f_sub_thema") return f_sub_thema;
		else if(art==="f_sprache") return F_SPRACHE;
	}
	let getModel=(nr)=>{
		if(aktMenu==null) return;			
		let m={};
		try {
			if(aktMenu.type==="f_eintrag") m=dao.einDao.getById(nr);
			else if(aktMenu.type==="f_thema") m=dao.temDao.getById(nr);
			else if(aktMenu.type==="f_sub_thema") m=dao.subsprDao.getById(nr);
			else if(aktMenu.type==="f_sprache") m=dao.sprDao.getById(nr);
		}
		catch (e) {setError(e)}		
		return m;
	}
	let getList=(art)=>{
		try {
			if(art=="f_eintrag") return dao.einDao.getList();
			else if(art=="f_thema") return dao.temDao.getList();
			else if(art=="f_sub_thema") return dao.subsprDao.getList();
			else if(art=="f_sprache") return dao.sprDao.getList();
		}
		catch (e) {setError(e)}	
	}
	let getLstByArt=(nr)=>{
		if(aktMenu==null) return;		
		try {if(aktMenu.type==="f_eintrag") return dao.einDao.getLstByArt(nr)}
		catch (e) {setError(e)}		
		return {};
	}
	let getMId=(m,feld)=>{
		if(feld=="Sprache") return m.Sprache;
		if(feld=="Sub_Sprache") return m.Sub_Sprache;
		if(feld=="Thema") return m.Thema;
	}
	let getMBild=(m,feld)=>{if(feld=="Bild") return m.Bild;}
	let getMEdit=(m,feld)=>{if(feld=="Edit") return m.Edit;}
	//MENU
	let aktMenu;
	let getListMenu=()=>{		
		if(menuList==null || menuList.length==0) fillListMenu();
		return menuList;
	}
	let getMenuBytyp=(typ)=>{for (let r of getListMenu()){if(r.type===typ){return r;break;}}}
	let menuList=[];
	let fillListMenu=()=>{
		//Menu füllen
		let men=new dom.menubar("Sprachen","f_sprache","Programmiersprachen");
		men.dsRules=getRules("f_sprache");
		menuList.push(men);
		men=new dom.menubar("Thema","f_sub_thema","Unterpunkte");
		men.dsRules=getRules("f_sub_thema");
		menuList.push(men);	
		men=new dom.menubar("Sub Thema","f_thema","Hilfethemen");
		men.dsRules=getRules("f_thema");
		menuList.push(men);	
		men=new dom.menubar("Eintrag","f_eintrag","Hilfeeintrag");
		men.dsRules=getRules("f_eintrag");
		menuList.push(men);	
		men=new dom.menubar("Javascript Tester","js","öffnet den Javascript Tester");		
		menuList.push(men);
	}
	let setAktMenu=(typ)=>aktMenu=getMenuBytyp(typ);			
	let getAktMenu=()=>aktMenu;
	//diplay rules
	let getLstForTree=(typ)=>{		
		if(typ==="f_eintrag") 
			return [{type:'f_sprache'}];
		return[];
	}
	let getRules=(typ)=>{
		//f_eintrag constructor(id,name,desc,val,thema,sub_spr,spr,date,edit)
		if(typ==="f_eintrag") return [
		{feld:'Edit',art:'data',type:'text'},
		{feld:'Sprache',art:'select',type:'f_sprache'},
		{feld:'Sub_Sprache',art:'select',type:'f_sub_thema'},
		{feld:'Thema',art:'select',type:'f_thema'},
		{feld:'Name',art:'input',type:'text'},
		{feld:'Desc',art:'textarea',type:'text'},
		{feld:'Text',art:'textarea',type:'text'}
		];
		//constructor(id,name,desc,date,edit)
		else if(typ==="f_sprache") return [
		{feld:'Edit',art:'data',type:'text'},
		{feld:'Name',art:'input',type:'text'},
		{feld:'Desc',art:'input',type:'text'}];
		//constructor(id,name,desc,spr,date,edit)
		else if(typ==="f_sub_thema") return [
		{feld:'Edit',art:'data',type:'text'},
		{feld:'Name',art:'input',type:'text'},
		{feld:'Desc',art:'input',type:'text'}
		];
		//constructor(id,name,desc,sub_spr,spr,date,edit)
		else if(typ==="f_thema") return [
		{feld:'Edit',art:'data',type:'text'},
		{feld:'Name',art:'input',type:'text'},
		{feld:'Desc',art:'input',type:'text'}
		];
	}	
	return {
		getRules: getRules,
        getLstForTree: getLstForTree,
		getAktMenu: getAktMenu,
		setAktMenu: setAktMenu,
		getMenuBytyp: getMenuBytyp,
		getListMenu: getListMenu,
		getMEdit: getMEdit,
		getMBild: getMBild,
		getMId: getMId,
		getLstByArt: getLstByArt,
		getList: getList,
		getModel: getModel,
		set_view: set_view,
		fillNForm:fillNForm,
		createNForm: createNForm,
		setForm: setForm,	
		setError:setError
    };
})();