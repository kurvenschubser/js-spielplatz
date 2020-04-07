/*
Fitness Stammdaten Controler
*/
let cont =(function(){
	"use strict";
	//###### CONST ##################
	const E_TITLE=[{neu:"neue Eigenschaft anlegen",edit:"Eigenschaft speichern",del:"Eigenschaft löschen"},{neu:"neues Gerät anlegen",edit:"Gerät speichern",del:"Gerät löschen"},{neu:"neue Art anlegen",edit:"Art speichern",del:"Art löschen"}];
	const F_EG=new dom.f_eigenschaft(0,'','','255,255,255',0);
	const F_Art=new dom.f_arten(0,'','');
	const F_Ger=new dom.f_geraete(0,'','',0,'');
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
			let ti=t==="f_geraete"?1:t==="f_arten"?2:0;
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
		if( art==="f_eigenschaft") return F_EG;
		else if(art==="f_arten") return F_Art;
		else if(art==="f_geraete") return F_Ger;
	}

	let getModel=async(nr)=>{
		return new Promise((resolve, reject) => {
			if(aktMenu==null) resolve({});
			else{
				let ret={};
				try {
					if(aktMenu.type==="f_arten") 	dao.artDao.getById(nr).then(result=>{resolve(result)});
					else if(aktMenu.type==="f_eigenschaft") dao.egDao.getById(nr).then(result=>{resolve(result)});
					else if(aktMenu.type==="f_geraete") dao.gerDao.getById(nr).then(result=>{resolve(result)});
					else {resolve({})}
				}
				catch (e) { setError(e) }
			}
		});
	}

	let getList=async (art)=>{
		try {
			return new Promise((resolve, reject) => {
				if(art=="f_arten") dao.artDao.getList().then(result=>{resolve(result)});
				else if(art=="f_eigenschaft") dao.egDao.getList().then(result=>{resolve(result)});
				else if(art=="f_geraete") dao.gerDao.getList().then(result=>{resolve(result)});
				else resolve([]);
			});
		}
		catch (e) { setError(e) }
	}

	let getLstByArt=async(nr)=>{
		try {
			return new Promise((resolve, reject) => {
				if(aktMenu==null) return [];
				if(aktMenu.type==="f_geraete"){
						dao.gerDao.getLstByArt(nr).then(result=>{
							resolve(result)});
				}
				else{ resolve([]) }
			});
		}
		catch (e) { setError(e) }
	}

	let getMId=(m,feld)=>{ if(feld=="Art") return m.Art}

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
			let men=new dom.menubar("Arten","f_arten","Arten");
			men.dsRules=getRules("f_arten");
			menuList.push(men);
			men=new dom.menubar("Eigenschaften","f_eigenschaft","Übungseigenschaften");
			men.dsRules=getRules("f_eigenschaft");
			menuList.push(men);
			men=new dom.menubar("Geräte","f_geraete","Fitnessgräte");
			men.dsRules=getRules("f_geraete");
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
		if(typ==="f_geraete") return [{type:'f_arten'}];
		return [];
	}

	let getRules=(typ)=>{
		if(typ==="f_eigenschaft") { return [{feld:'Name',art:'input',type:'text'},{feld:'Farbe',art:'input',type:'color'},{feld:'Sortierung',art:'input',type:'number'},{feld:'Beschreibung',art:'textarea',type:'text'}];}
		else if(typ==="f_geraete") { return [{feld:'Name',art:'input',type:'text'},{feld:'Art',art:'select',type:'f_arten'},{feld:'Beschreibung',art:'textarea',type:'text'},{feld:'Bild',art:'img',type:'text'}];}
		else if(typ==="f_arten") { return [{feld:'Name',art:'input',type:'text'},{feld:'Beschreibung',art:'textarea',type:'text'}];}
		else return [];
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
		resetIdleTime
    };
})();
