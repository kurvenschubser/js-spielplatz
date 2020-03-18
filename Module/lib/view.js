"use strict";
let viewer =(function(){
	let click=(event)=>{
		/*bubbling ul click from li*/
		let ele = event.target;
		if(ele===null) return;
		let nr=ele.getAttribute("nr");
		let level=ele.getAttribute("l");
		//attribut ob tree oder listview
		if(!hlp.isInt(nr)) return;
		let ak = cont.getAktMenu()
		let lstTree=cont.getLstForTree(ak.type);
		if(lstTree.length>0 && level==0){
console.log('viewer click lstTree.length>0  ',level);
			if(ele.lastChild.nodeName==='UL'){
				cont.fillNForm();
				return;
			}
			console.log('viewer click vor getLstByArt ',level);
			cont.getLstByArt(nr).then(resVal=>{
console.log('viewer click getLstByArt.then ',resVal);
				let ul = document.createElement("ul");
				let value=null;
				let child=null;
				for (let r of resVal){
					child=view_h.createLi(r,-1);
					ul.appendChild(child);
				}
				ele.appendChild(ul);
			});
		}
		else{
//console.log('viewer click cont.set_view ',nr)
			cont.set_view(nr);
		}
	}
	let edit_click=(event)=>{
		/*bubbling save del new click from edit div*/
		let ele = event.target;
		if(ele===null) return;
		//btnJST
		if(ele.id==='btnJST'){
			window.open('./jse/jst.html');
			return;
		}
		if(cont.aktEntry){
			if(ele.id==="btnNew") {
				cont.fillNForm()
			}
			else if(ele.id==="btnSave") {
				//muss noch für die anderen Menüs angelegt werden
				//zur Zeit nur Arten
				let vn=document.getElementById('txt_Name').value;
				let vd=document.getElementById('txt_Desc').value;
				cont.aktEntry.Name=vn;
				cont.aktEntry.Desc=vd;
				if(cont.aktEntry.Id==0){
					//insert	m,p,s,a
					cont.insert(cont.aktEntry,ini.CONFOBJ.id,ini.CONFOBJ.stor.id,0)
				}
				else{
					//update
					cont.update(cont.aktEntry,ini.CONFOBJ.id,ini.CONFOBJ.stor.id,0)
				}
			}
			else if(ele.id==="btnDel") {
				//delete
				//muss noch für die anderen Menüs angelegt werden
				//zur Zeit nur Arten
				cont.del(cont.aktEntry,ini.CONFOBJ.id,ini.CONFOBJ.stor.id,0)
			}
		}
	}
	let menu_click=(event)=>{
		/*bubbling div click from menu div*/
		let ele = event.target;
		if(ele===null) return;
		if(ele.innerText==='Javascript Tester'){
			let fenster = window.open('./jse/jst.html');
			return;
		}
		view_h.clear_r();
		view_h.clear_l();
		let art=ele.getAttribute("art");
		cont.setAktMenu(art);
		cont.createNForm();
		let leftDiv = document.getElementById("left");
		let ul = document.createElement("ul");
		ul.addEventListener('click', viewer.click, false);
		let value={};
		let child=null;
		let lst=[];
		//if tree get first level

		let lstTree=cont.getLstForTree(art);
		if(lstTree.length>0){
			cont.getList(lstTree[0].type).then(resVal=>{
//console.log('view.js 95: ',resVal);
				for (let key of resVal) {
					child=view_h.createLi(key,lstTree.length>0?0:-1);
					ul.appendChild(child);
				}
				leftDiv.appendChild(ul);
				view_h.setLblStatus(art);
				view_h.setLeftHead(art);
			});
		}
		else{
//console.log('view.js 106: vor getList.then');
			cont.getList(art).then(resVal=>{
				for (let key of resVal) {
//console.log('view.js key: ',key);
					child=view_h.createLi(key,lstTree.length>0?0:-1);
					ul.appendChild(child);
				}
				leftDiv.appendChild(ul);
				view_h.setLblStatus(art);
				view_h.setLeftHead(art);
			});
		}
	}
	let err_click=(event)=>{
		let ele = event.target;
console.log(ele);
	}
	let display=(m)=>{
		let value=null;
		let lbl=null;
		let txt=null;
		let opt=null;
		let ak=	cont.getAktMenu();
		cont.aktEntry=m;
//console.log('view display: ',ak);
		for (let r of ak.dsRules){
			value = m[r.feld];

			lbl = document.getElementById(`lbl_${r.feld}`);
			lbl.innerText=`${r.feld}:`;
			txt = document.getElementById(`txt_${r.feld}`);
			if(r.art==='select'){
				for (let i = 0; i < txt.length; i++){
					opt = txt.options[i];
					let mId=cont.getMId(m,r.feld);
					if(parseInt(opt.value)===mId){opt.selected =true;break;}
				}
			}
			else if(r.art==='img'){
				let b=cont.getMBild(m,r.feld);
				txt.src=`./img/bilder/${b}`;
			}
			else if(r.art==='data'){
				/*helper.js getDate(timestamp,format) format: 0=long date short weekname | 1=long date long weekname | 2=short datetime | 3=short date*/
				txt.innerText=hlp.getDate(Number(m.Edit),2);
			}
			else txt.value=value;
		}
		view_h.setLblStatus(`${m.constructor.name} ${m.toString()}`);
		view_h.setRightHead(`${m.constructor.name} ${m.toString()}`);
		let js = document.getElementById('btnJST').style.visibility = "hidden";
		if(ak.type==='f_eintrag') document.getElementById('btnJST').style.visibility = "visible";
	}
	let createForm=(m)=>{
		view_h.clear_r();
		let currentDiv = document.getElementById("right");
		let lbl=null;
		let txt=null;
		let opt=null;
		let newSubDiv=null;
		let ak=cont.getAktMenu();
		for (let r of ak.dsRules){
			newSubDiv = document.createElement("div");
			txt = document.createElement(r.art);
			if(r.art==='select'){
				opt = null;
				(async () => {
					let lst = await cont.getList(r.type);
					for(let a of lst) {
						opt = document.createElement('option');
						opt.value = a.Id;
						opt.innerText=a.Name;
						txt.appendChild(opt);
					}
				});
				lbl=document.createElement("label");
			}
			else if(r.art==='img'){
				if(hlp.isFileApi()){
					lbl=document.createElement("input")
					lbl.type="file"
					lbl.style.cssText = 'width:120px;;vertical-align:top'
					lbl.onclick=function(evt){
						let files = evt.target.files
					}
				}
				else{
					lbl=document.createElement("label")
				}
			}
			else if(r.art==='textarea'){
				lbl=document.createElement("label")
				txt.rows="12"
			}
			else{
				lbl=document.createElement("label")
			}
			txt.setAttribute('type',r.type)
			txt.id=`txt_${r.feld}`;
			lbl.id=`lbl_${r.feld}`;
			newSubDiv.appendChild(lbl);
			newSubDiv.appendChild(txt)
			currentDiv.appendChild(newSubDiv);
		}
		display(m);
		let edit = document.getElementById("div_edit");
		edit.style.visibility='visible';
	}
	let createMenu=()=>{
		let currentDiv = document.getElementById("botomhead");
		let menuDiv =view_h.createEle('div','','menu','Menu',[],'');
		menuDiv.onclick = function(){view_h.toogleMenu();};
		menuDiv.onmouseleave = function(){view_h.toogleMenu();};
		currentDiv.appendChild(menuDiv);
		let navDiv= view_h.createEle('div','menu','','',[],'');
		navDiv.style.visibility='hidden';
		let lst=cont.getListMenu();
		let menuSubDiv=null;
		for(let r of lst) {
			menuSubDiv=view_h.createEle("div",'','submenu',r.Name,[{name:'art',val:r.type}],r.desc);
			navDiv.appendChild(menuSubDiv);
		}
		//bubeling eventhandler on menu click
		navDiv.addEventListener('click', viewer.menu_click, false);
		menuDiv.appendChild(navDiv);
	}
	let createMain=()=>{
		let currentDiv = document.body;
		//header
		let newDiv=view_h.createEle('div','head','header','',[],'');
		let subdiv=view_h.createEle('div','','top-head',`${ini.CONFOBJ.titel} [${ini.CONFOBJ.v} ] ${ini.CONFOBJ.stor.desc}`,[],'');
		newDiv.appendChild(subdiv);
		subdiv=view_h.createEle('div','botomhead','botom-head','',[],'');
		newDiv.appendChild(subdiv);
		currentDiv.appendChild(newDiv);
		//main
		newDiv=view_h.createEle('div','main','main','',[],'');
		newDiv.addEventListener('error', viewer.err_click, false);
		//main links
		let leftdiv=view_h.createEle('div','left_m','left-pan','',[],'');
		let msub=view_h.createEle('div','stl','hl','',[],'');
		leftdiv.appendChild(msub);
		subdiv=view_h.createEle('div','left','','',[],'');
		leftdiv.appendChild(subdiv);
		newDiv.appendChild(leftdiv);
		//main rechts
		leftdiv=view_h.createEle('div','right_m','right-pan','',[],'');
		//kopfleiste
		msub=view_h.createEle('div','str','hl','',[],'');
		leftdiv.appendChild(msub);
		//edit leiste
		let editDiv=view_h.createEle('div','div_edit','edit','',[],'');
		let img=view_h.createImg("btnNew","./img/btn_new.png","img_edit","neu");
		editDiv.appendChild(img);
		img=view_h.createImg("btnSave","./img/btn_save.png","img_edit","speichern");
		editDiv.appendChild(img);
		img=view_h.createImg("btnDel","./img/btn_del.png","img_edit","löschen");
		editDiv.appendChild(img);
		img=view_h.createImg("btnJST","./img/execute.jpg","img_edit","öffnet den Javascript Tester");
		editDiv.appendChild(img);
		editDiv.style.visibility='hidden';
		editDiv.addEventListener('click', viewer.edit_click, false);
		leftdiv.appendChild(editDiv);
		//eingabe felder
		subdiv =view_h.createEle('div','right','','',[],'');
		leftdiv.appendChild(subdiv);
		newDiv.appendChild(leftdiv);
		currentDiv.appendChild(newDiv);
		//Wait DIV
		newDiv=view_h.createEle('div','wait','','',[],'');
		newDiv.insertAdjacentHTML('beforeend', '<b>warte auf Server...</b>')
		currentDiv.appendChild(newDiv);
	}
	return {createMain: createMain,createMenu: createMenu,createForm: createForm,display: display,menu_click: menu_click,edit_click: edit_click,click: click,err_click:err_click};
})();
