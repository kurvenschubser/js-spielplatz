/*
Fitness Stammdaten Viewer
*/
let viewer =(function(){
	"use strict";
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
			if(ele.lastChild.nodeName==='UL'){
				cont.fillNForm();
				return;
			}
			view_h.setWait(true);
			cont.getLstByArt(nr).then(resVal=>{
				let ul = document.createElement("ul");
				let value=null;
				let child=null;
				for (let r of resVal){
					child=view_h.createLi(r,-1);
					ul.appendChild(child);
				}
				ele.appendChild(ul);
				setTimeout(() => view_h.setWait(false), 500);
			});
		}
		else{
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
			if(ele.id==="btnNew") cont.fillNForm();
			else if(ele.id==="btnSave") {
				//muss noch für die anderen Menüs angelegt werden
				//zur Zeit nur Arten
				view_h.setWait(true);
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
				setTimeout(() => view_h.setWait(false), 1000);
			}
			else if(ele.id==="btnDel") {
				//delete
				//muss noch für die anderen Menüs angelegt werden
				//zur Zeit nur Arten
				view_h.setWait(true);
				cont.del(cont.aktEntry,ini.CONFOBJ.id,ini.CONFOBJ.stor.id,0)
				setTimeout(() => view_h.setWait(false), 1000);
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
		let leftDiv = document.getElementById("left");
		let value={};
		let child=null;
		//if tree get first level
		let lstTree=cont.getLstForTree(art);
		if(lstTree.length>0){
			view_h.setWait(true);
			cont.getList(lstTree[0].type).then(resVal=>{
				let ul = document.createElement("ul");
				ul.addEventListener('click', viewer.click, false);
				for (let key of resVal) {
					child=view_h.createLi(key,0);
					ul.appendChild(child);
				}
				leftDiv.appendChild(ul);
				setTimeout(() => view_h.setWait(false), 500);
			}).then(result=>{
				cont.createNForm();
			});
		}
		else{
			view_h.setWait(true);
			cont.getList(art).then(resVal=>{
				let ul = document.createElement("ul");
				ul.addEventListener('click', viewer.click, false);
				for (let key of resVal) {
					child=view_h.createLi(key,-1);
					ul.appendChild(child);
				}
				leftDiv.appendChild(ul);
				setTimeout(() => view_h.setWait(false), 500);
			}).then(result=>{
				cont.createNForm();
			});
		}

		view_h.setLblStatus(art);
		view_h.setLeftHead(art);
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
		let newSubDiv=null;
		let ak=cont.getAktMenu();
		for (const r of ak.dsRules){
			newSubDiv = document.createElement("div");
			let txt = document.createElement(r.art);
			if(r.art==='select'){
				cont.getList(r.type).then(result=>{
					for(let a of result) {
						let opt = document.createElement('option');
						opt.value=a.Id;
						opt.text=a.Name;
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
		menuDiv.onmouseover = function(){view_h.showMenu();};
		menuDiv.onmouseleave = function(){view_h.hideMenu();};
		currentDiv.appendChild(menuDiv);
		let navDiv= view_h.createEle('div','menu','','',[],'');
		navDiv.style.visibility='hidden';
		navDiv.onclick=function(){view_h.hideMenu();};
		let lst=cont.getListMenu();
		let menuSubDiv=null;
		for(let r of lst) {
			menuSubDiv=view_h.createEle("div",'','',r.Name,[{name:'art',val:r.type}],r.desc);
			navDiv.appendChild(menuSubDiv);
		}
		//bubeling eventhandler on menu click
		navDiv.addEventListener('click', viewer.menu_click, false);
		menuDiv.appendChild(navDiv);
	}

	let createMain=()=>{
		let currentDiv = document.body;
		let wrapper = view_h.createEle('div','','wrapper','',[],'');
		let menu = view_h.createEle('div','botomhead','','',[],'');
		let header=view_h.createEle('div','head','box header',`${ini.CONFOBJ.titel} [${ini.CONFOBJ.v} ] ${ini.CONFOBJ.stor.desc}`,[],'');
		let sidebar=view_h.createEle('div','left_m','box sidebar','',[],'');
		let sHeader=view_h.createEle('div','stl','hl','',[],'');
		let left=view_h.createEle('div','left','','',[],'');
		sidebar.appendChild(sHeader);
		sidebar.appendChild(left);
		let content=view_h.createEle('div','right_m','box content','',[],'');
		let cHeader=view_h.createEle('div','str','hl','',[],'');
		let edit=view_h.createEle('div','div_edit','edit','',[],'');
		let img=view_h.createImg("btnNew","./img/btn_new.png","img_edit","neu");
		edit.appendChild(img);
		img=view_h.createImg("btnSave","./img/btn_save.png","img_edit","speichern");
		edit.appendChild(img);
		img=view_h.createImg("btnDel","./img/btn_del.png","img_edit","löschen");
		edit.appendChild(img);
		img=view_h.createImg("btnJST","./img/execute.jpg","img_edit","öffnet den Javascript Tester");
		edit.appendChild(img);
		edit.style.visibility='hidden';
		edit.addEventListener('click', edit_click, false);
		let right=view_h.createEle('div','right','','',[],'');
		content.appendChild(cHeader);
		content.appendChild(edit);
		content.appendChild(right);
		let footer=view_h.createEle('div','footer','','',[],'');
		let wait=view_h.createEle('div','wait','','',[],'');
		wait.insertAdjacentHTML('beforeend', '<b>warte auf Server...</b>')
		wrapper.appendChild(menu);
		wrapper.appendChild(header);
		wrapper.appendChild(sidebar);
		wrapper.appendChild(content);
		wrapper.appendChild(footer);
		wrapper.appendChild(wait);
		currentDiv.appendChild(wrapper);
	}

	return {
		createMain,
		createMenu,
		createForm,
		display,
		menu_click,
		edit_click,
		click,
		err_click
	};
})();
