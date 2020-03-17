/*
Fitness Stammdaten Controler
*/
"use strict";
let cont =(function(){
	//VIEWER
	const E_TITLE=[{neu:"neue Eigenschaft anlegen",edit:"Eigenschaft speichern",del:"Eigenschaft löschen"},{neu:"neues Gerät anlegen",edit:"Gerät speichern",del:"Gerät löschen"},{neu:"neue Art anlegen",edit:"Art speichern",del:"Art löschen"}];
	const F_EG=new dom.f_eigenschaft(0,'','','255,255,255',0);
	const F_Art=new dom.f_arten(0,'','');
	const F_Ger=new dom.f_geraete(0,'','',0,'');
	let aktEntry;
	let setError=(e)=>{
		try {
			view_h.clear_r();
			document.getElementById('div_edit').style.visibility='hidden';
			document.getElementById('right').insertAdjacentHTML('beforeend',`<p><b>${e}</b></p>`)
			console.log(JSON.stringify(e));
		}
		catch (e){alert(e)}
	}
	let setForm=()=>{
		try {
			viewer.createMain();
			viewer.createMenu();
			//view_h.setWait(true);
/*
			(async () => {
				let promise = new Promise((resolve, reject) => {
					dao.artDao.fillLst();
					dao.egDao.fillLst();
					dao.gerDao.fillLst();
					setTimeout(() => resolve("done!"), 500);
				});
				let result = await promise;
				view_h.setWait(false);
				fillListMenu();
				viewer.createMenu();
			})();
			*/
		}
		catch (e) {setError(e)}
	}
	let createNForm=()=>{
		try {
			let t=getAktMenu().type;
			let ti=t==="f_geraete"?1:t==="f_arten"?2:0;
			viewer.createForm(getNewModel(t));
			view_h.setEditTitle(E_TITLE[ti].neu,E_TITLE[ti].edit,E_TITLE[ti].del);
		}
		catch (e) {setError(e)}
	}
	let fillNForm=()=>{viewer.display(getNewModel(getAktMenu().type))}
	let set_view=(nr)=>{
		let akm=getModel(nr);
		viewer.display(getModel(nr));
	}
	//MODEL wird in view.js verwendet siehe: edit_click() und menu_click()
	let getNewModel=(art)=>{
		if( art==="f_eigenschaft") return F_EG;
		else if(art==="f_arten") return F_Art;
		else if(art==="f_geraete") return F_Ger;
	}
	let getModel=(nr)=>{
		if(aktMenu==null) return;
		try {
			if(aktMenu.type==="f_arten") return dao.artDao.getById(nr);
			else if(aktMenu.type==="f_eigenschaft") return dao.egDao.getById(nr);
			else if(aktMenu.type==="f_geraete"){
				let m=dao.gerDao.getById(nr);
				return m;
			}
		}
		catch (e) {setError(e)}
		return {};
	}
	let getList=(art)=>{
		try {
			return new Promise((resolve, reject) => {
				if(art=="f_arten") return dao.artDao.getList();
				else if(art=="f_eigenschaft") return dao.egDao.getList();
				else if(art=="f_geraete") return dao.gerDao.getList();
				else return [];
			});
			/*
			.then(resVal => {
				console.log(resVal);
				return resVal;
			});
			*/
		}
		catch (e) {setError(e)}
	}
	let getLstByArt=(nr)=>{
		return new Promise((resolve, reject) => {
			if(aktMenu==null) resolve([]);
			try {
				if(aktMenu.type==="f_geraete"){
						resolve(dao.gerDao.getLstByArt(nr));
				}
				else{
					resolve([]);
				}
			}
			catch (e) {setError(e)}
		}).then(res=>{
			return res;
		});
	}
	let getMId=(m,feld)=>{if(feld=="Art") return m.Art;}
	let getMBild=(m,feld)=>{if(feld=="Bild") return m.Bild;}
	let getMEdit=(m,feld)=>{if(feld=="Edit") return m.Edit;}
	//MENU
	let aktMenu;
	let getListMenu=()=>{
		if(menuList==null || menuList.length ==0) fillListMenu();
		return menuList;
	}
	let getMenuBytyp=function(t){
		let lst=getListMenu();
		for (let r of lst){
			if(r.type===t){
				return r;
				break;
			}
		}
	}
	let menuList=[];
	let fillListMenu=()=>{
		//Menu füllen
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
	let setAktMenu=function(t){
		let men=getMenuBytyp(t);
		aktMenu=men
	}
	let getAktMenu=()=>{
		return aktMenu
	}
	//diplay rules
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
	return {
		getRules: getRules,
    getLstForTree: getLstForTree,
		getAktMenu: getAktMenu,
		setAktMenu: setAktMenu,
		fillListMenu: fillListMenu,
		getMenuBytyp: getMenuBytyp,
		getListMenu: getListMenu,
		getMEdit: getMEdit,
		getMBild: getMBild,
		getMId: getMId,
		getLstByArt: getLstByArt,
		getList: getList,
		getModel: setAktMenu,
		set_view: set_view,
		createNForm: createNForm,
		setForm: setForm,
		fillNForm:fillNForm,
		setError:setError,
		aktEntry:aktEntry,
		insert:insert,
		update:update,
		del:del
    };
})();
