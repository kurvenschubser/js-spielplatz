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
		try {
			//view_h.clear_r();
			//document.getElementById('div_edit').style.visibility='hidden';
			//document.getElementById('right').insertAdjacentHTML('beforeend',`<p><b>${e}</b></p>`)
			console.log(JSON.stringify(e));
		}
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
			console.log('ctrl createNForm ',t);
			let m = getNewModel(t);
			console.log('ctrl new model ',m);
			viewer.createForm(m);
			view_h.setEditTitle(E_TITLE[ti].neu,E_TITLE[ti].edit,E_TITLE[ti].del);
		}
		catch (e) {setError(e)}
	}

	let fillNForm=()=>{viewer.display(getNewModel(getAktMenu().type))}

	let set_view=async (nr)=>{getModel(nr).then(result=>{viewer.display(result)})}

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
				catch (e) {setError(e)}
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
		catch (e) {setError(e)}
	}

	let getLstByArt=async(nr)=>{
		try {
				return new Promise((resolve, reject) => {
					if(aktMenu==null) return [];
					if(aktMenu.type==="f_geraete"){
						dao.gerDao.getLstByArt(nr).then(result=>{
							//console.log('ctrl getLstByArt dao.gerDao.getLstByArt',result);
							resolve(result)});
					}
					else{resolve([])}
				});
			}
		catch (e) {setError(e)}
	}

	let getMId=(m,feld)=>{if(feld=="Art") return m.Art;}

	let getMBild=(m,feld)=>{if(feld=="Bild") return m.Bild;}

	let getMEdit=(m,feld)=>{if(feld=="Edit") return m.Edit;}

	//###### insert/update/delete ##################
	let insert=(m,p,s,a)=>{
		let val;
		if(p==0){
			if(aktMenu.type==="f_arten")  val = dao.artDao.insert(m,p,s,a);
			else if(aktMenu.type==="f_eigenschaft") val = dao.egDao.insert(m,p,s,a);
			else if(aktMenu.type==="f_geraete") val = dao.gerDao.insert(m,p,s,a);
		}
		else if(p==1){}
		return val;
	}

	let update=(m,p,s,a)=>{
		let val;
		if(p==0){
			if(aktMenu.type==="f_arten")  val = dao.artDao.update(m,p,s,a);
			else if(aktMenu.type==="f_eigenschaft") val = dao.egDao.update(m,p,s,a);
			else if(aktMenu.type==="f_geraete") val = dao.gerDao.update(m,p,s,a);
		}
		else if(p==1){}
		return val;
	}

	let del=(m,p,s,a)=>{
		if(p==0){
			if(aktMenu.type==="f_arten")  val = dao.artDao.del(m,p,s,a);
			else if(aktMenu.type==="f_eigenschaft") val = dao.egDao.del(m,p,s,a);
			else if(aktMenu.type==="f_geraete") val = dao.gerDao.del(m,p,s,a);
		}
		else if(p==1){}
		return val;
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

	let getAktMenu=()=>{
		return aktMenu
	}

	//###### diplay rules ##################
	let getLstForTree=(typ)=>{
		if(typ==="f_geraete") return [{type:'f_arten'}];
		return [];
	}

	let getRules=(typ)=>{
		if(typ==="f_eigenschaft")return [{feld:'Name',art:'input',type:'text'},{feld:'Farbe',art:'input',type:'color'},{feld:'Sort',art:'input',type:'number'},{feld:'Desc',art:'input',type:'text'}];
		else if(typ==="f_geraete")return [{feld:'Name',art:'input',type:'text'},{feld:'Art',art:'select',type:'f_arten'},{feld:'Desc',art:'input',type:'text'},{feld:'Bild',art:'img',type:'text'}];
		else if(typ==="f_arten"){return [{feld:'Name',art:'input',type:'text'},{feld:'Desc',art:'input',type:'text'}];}
		else return [];
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
		del
    };
})();
