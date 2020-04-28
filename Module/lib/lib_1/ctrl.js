//Programmierhilfe Stammdaten Controler

let cont =(function(){
	"use strict";
	//###### CONST ##################
	const E_TITLE=[
	{neu:"neuen Eintrag anlegen",edit:"Eintrag speichern",del:"Eintrag löschen"},
	{neu:"neues Thema anlegen",edit:"Thema speichern",del:"Thema löschen"},
	{neu:"neue Sprache anlegen",edit:"Sprache speichern",del:"Sprache löschen"}];

	//constructor(id,name,desc,text,thema,spr,sort,date,edit)
	const F_EINTRAG=new dom.f_eintrag(0,'','','',0,0,0,hlp.getDate(Date.now(),1), hlp.getDate(Date.now(),1));
	//constructor(id,name,sprache,date,edit)
	const F_THEMA=new dom.f_thema(0,'',0,hlp.getDate(Date.now(),1), hlp.getDate(Date.now(),1));
	//constructor(id,name,desc,date,edit)
	const F_SPRACHE=new dom.f_sprache(0,'','',hlp.getDate(Date.now(),1), hlp.getDate(Date.now(),1));

	//###### SET ##################
	let aktEntry;
	let setError=(e)=>{
		try { view_h.setMsb(`${ini.CONFOBJ.titel}`,e) }
		catch (e){alert(e)}
	}

	let setForm=()=>{
		try {
			viewer.createMain();
			viewer.createMenu();
		}
		catch (e) {setError(e)}
	}

	let createNForm=()=>{
		try {
			let t=getAktMenu().type;
			let ti=t==="f_thema"?1:t==="f_sprache"?2:0;
			let m = getNewModel(t);
			viewer.createForm(m);
			view_h.setEditTitle(E_TITLE[ti].neu,E_TITLE[ti].edit,E_TITLE[ti].del);
		}
		catch (e) { setError(e) }
	}

	let fillNForm=()=>{
		try { viewer.display(getNewModel(getAktMenu().type)) }
		catch (e) { setError(e) }
	}

	let set_view=async (nr)=>{
		try { getModel(nr).then(result=>{viewer.display(result)}) }
		catch (e) { setError(e) }
	}

	//###### GET ##################
	let getNewModel=(art)=>{
		if( art==="f_eintrag") return F_EINTRAG;
		else if(art==="f_thema") return F_THEMA;
		else if(art==="f_sprache") return F_SPRACHE;
	}

	let getModel=async(nr)=>{
		let prom= new Promise((resolve, reject) => {
			if(aktMenu==null) resolve({});
			else{
				let ret={};
				try {
					if(aktMenu.type==="f_eintrag") 	dao.einDao.getById(nr).then(result=>{resolve(result)},rej=>{reject(rej)});
					else if(aktMenu.type==="f_thema") dao.temDao.getById(nr).then(result=>{resolve(result)},rej=>{reject(rej)});
					else if(aktMenu.type==="f_sprache") dao.sprDao.getById(nr).then(result=>{resolve(result)},rej=>{reject(rej)});
					else {resolve({})}
				}
				catch (e) { reject(e) }
			}
		});
		return prom;
	}

	let getList=async (art)=>{
		let prom = new Promise((resolve, reject) => {
			try{
				if(art=="f_eintrag") dao.einDao.getList().then(result=>{resolve(result)},rej=>{reject(rej)});
				else if(art=="f_thema") dao.temDao.getList().then(result=>{resolve(result)},rej=>{reject(rej)});
				else if(art=="f_sprache") dao.sprDao.getList().then(result=>{resolve(result)},rej=>{reject(rej)});
				else resolve([]);
			}
			catch (e) { reject(e) }
		});
		return prom;
	}

	let getLstByArt=async(nr)=>{
		let prom = new Promise((resolve, reject) => {
			try{
				if(aktMenu==null) return [];
				if(aktMenu.type==="f_eintrag") dao.temDao.getLstByArt(nr).then(result=>{resolve(result)},rej=>{reject(rej)});
				else{resolve([])}
			}
			catch (e) { reject(e) }
		});
		return prom;
	}

	let getLstUsed=async(t,nr1=0,nr2=0)=>{
		let prom = new Promise((resolve, reject) => {
			try{
				if(t==="f_sprache") dao.einDao.getLstUseSpr().then(result=>{resolve(result);},rej=>{reject(rej)});
				else if(t==="f_thema") dao.einDao.getLstUseThema(nr1).then(result=>{resolve(result);},rej=>{reject(rej)});
				else if(t==="f_eintrag") dao.einDao.getLstBySprThema(nr1,nr2).then(result=>{resolve(result);},rej=>{reject(rej)});
				else{ resolve([]) }
			}
			catch (e) { reject(e) }
		});
		return prom;
	}

	let getMId=(m,feld)=>{
		if(feld=="Sprache") return m.Sprache;
		if(feld=="Thema") return m.Thema;
	}

	let getMBild=(m,feld)=>{if(feld=="Bild") return m.Bild}

	let getMEdit=(m,feld)=>{if(feld=="Edit") return m.Edit}

	//###### insert/update/delete ##################
	let insert=(m,p,s,a)=>{
		try { return dao.insert(m,p,s,a)	}
		catch (e) { setError(e) }
	}

	let update=(m,p,s,a)=>{
		try { return dao.update(m,p,s,a) }
		catch (e) { setError(e) }
	}

	let del=(m,p,s,a)=>{
		try { return dao.del(m,p,s,a) }
		catch (e) { setError(e) }
	}

	//###### MENU ##################
	let aktMenu;
	let menuList=[];
	let getListMenu=()=>{
		if(menuList==null || menuList.length ==0) {
			let men=new dom.menubar("Sprachen","f_sprache","Programmiersprachen");
			men.dsRules=getRules("f_sprache");
			menuList.push(men);
			men=new dom.menubar("Themen","f_thema","Unterpunkte");
			men.dsRules=getRules("f_thema");
			menuList.push(men);
			men=new dom.menubar("Einträge","f_eintrag","Hilfeeintrag");
			men.dsRules=getRules("f_eintrag");
			menuList.push(men);
			men=new dom.menubar("Javascript Tester","js","öffnet den Javascript Tester");
			menuList.push(men);
		}
		return menuList;
	}

	let setAktMenu=(t)=>{
		let lst=getListMenu();
		for (let r of lst){
			if(r.type===t){
				aktMenu=r;
				break;
			}
		}
	}

	let getAktMenu=()=>{return aktMenu}

	//###### diplay rules ##################
	let getLstForTree=(typ)=>{
		if(typ==="f_eintrag")
			return [{type:'f_sprache',level:0},{type:'f_thema',level:1},{type:'f_eintrag',level:2}];
		return[];
	}

	let getRules=(typ)=>{
		if(typ==="f_eintrag") return [
		{feld:'Edit',art:'data',type:'text'},
		{feld:'Sprache',art:'select',type:'f_sprache'},
		{feld:'Thema',art:'select',type:'f_thema'},
		{feld:'Name',art:'input',type:'text'},
		{feld:'Beschreibung',art:'textarea',type:'text',rows:3},
		{feld:'Text',art:'textarea',type:'text',rows:12}];
		else if(typ==="f_sprache") return [
		{feld:'Edit',art:'data',type:'text'},
		{feld:'Name',art:'input',type:'text'},
		{feld:'Beschreibung',art:'textarea',type:'text',rows:3}];
		else if(typ==="f_thema") return [
		{feld:'Edit',art:'data',type:'text'},
		{feld:'Name',art:'input',type:'text'},
		{feld:'Beschreibung',art:'textarea',type:'text',rows:3}];
	}

	//###### AUTO LOGOUT
	let idleTime = 0;
	let resetIdleTime=()=>{ idleTime = 0 }

	let timerIncrement=()=> {
		try{
			idleTime = idleTime + 1;
	    if (idleTime >= 5) {
				idleTime=0;
	      view_h.getLogOut();
	    }
		}
		catch (e) {setError(e)}
	}

	let startTimer=()=>{
		document.onreadystatechange = () => {
		  setInterval(timerIncrement, 60000); // 1 minute
		  document.onclick = e => {idleTime = 0};
		  document.onmousemove = e => {idleTime = 0 };
		  document.onkeypress = e => {idleTime = 0 };
			document.onscroll  = e => {idleTime = 0 };
		};
	}

	//###### Public ##################
	return {
		getRules,
		getLstForTree,
		getAktMenu,
		setAktMenu,
		getListMenu,
	  getMEdit,
		getMBild,
		getMId,
		getLstByArt,
		getList,
		getModel,
		set_view,
		createNForm,
		setForm,
		fillNForm,
		setError,
		aktEntry,
		insert,
		update,
		del,
		startTimer,
		resetIdleTime,
		getLstUsed
    };
})();
