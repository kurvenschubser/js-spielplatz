//Viewer
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
		//auf und zu klappen wenn li hasChildNodes and li lastChild is ul
		//sonst befüllen
		if (ele.hasChildNodes() && ele.lastChild.nodeName=='UL') {
			ele.lastChild.style.display=(ele.lastChild.style.display== 'block' || ele.lastChild.style.display=='') ? 'none' : 'block';
		}
		else{
			let ak = cont.getAktMenu()
			let lstTree=cont.getLstForTree(ak.type);
			let countTree=lstTree.length-1;
			if(countTree >= 0 && level>=0){
				let x=parseInt(level)+1;
				if(countTree > level && countTree > x){
					cont.getLstUsed(lstTree[x].type,parseInt(nr)).then(resVal=>{
						let ul = document.createElement("ul");
						for (let key of resVal) {
							let child=view_h.createLi(key,x);
							ul.appendChild(child);
						}
						ele.appendChild(ul);
						view_h.setWait(false);
					},rej=>{
						view_h.setWait(false);
						cont.setError(rej);
					});
				}
				else {
					let nr1=0;
					if (ele.parentElement.parentElement.hasAttribute("nr")) {nr1=ele.parentElement.parentElement.getAttribute("nr")}
					else if (ele.parentElement.hasAttribute("nr")){nr1=ele.parentElement.getAttribute("nr")}
					else if (ele.hasAttribute("nr")){nr1=ele.getAttribute("nr")}
					cont.getLstUsed(lstTree[countTree].type,parseInt(nr1),parseInt(nr)).then(resVal=>{
						let ul = document.createElement("ul");
						for (let r of resVal){
							let child=view_h.createLi(r,-1);
							ul.appendChild(child);
						}
						ele.appendChild(ul);
					},rej=>{
						view_h.setWait(false);
						cont.setError(rej);
					});
				}
			}
			else{
				//reset stylesheet
				view_h.resetActiveLi();
				ele.setAttribute('style','font-weight:bold');
				cont.set_view(nr);
			}
		}
	}

	let edit_click = (event) => {
		/*bubbling save del new click from edit div*/
		let ele = event.target;
		if(ele===null) return;
		//btnJST
		if(ele.id==='btnJST'){
			window.open('./jse/jst.html');
			return;
		}
		if(cont.aktEntry)
		{
			if(ele.id==="btnNew") cont.fillNForm();
			else if(ele.id==="btnSave") {
				//muss noch für die anderen Menüs angelegt werden
				//zur Zeit nur Arten
				let vn=document.getElementById('txt_Name').value;
				if (vn==='') {
					let ak = cont.getAktMenu();
					let tit=cont.aktEntry.Id==0 ? `${ak.type} anlegen` : `${ak.type} speichern`;
					view_h.setMsb(tit,'Bitte einen Namen eingeben!');
					return;
				}
				let vd=document.getElementById('txt_Beschreibung').value;
				cont.aktEntry.Name=vn;
				cont.aktEntry.Desc=vd;
				if(cont.aktEntry.Id==0){
					let istrue=view_h.getCancelOk(`Soll ${cont.aktEntry.Name} angelegt werden?`);
					if(istrue==true){
						view_h.setWait(true);
						try{
							cont.insert(cont.aktEntry,ini.CONFOBJ.id,ini.CONFOBJ.stor.id,0).then(
								val => {
									let doc;
									try{doc=JSON.parse(JSON.parse(val))	}
									catch (e) {
										view_h.setWait(false);
										cont.setError(text);
										return;
									}
									if(doc.art && doc.art == 'Error'){
										view_h.setWait(false);
										cont.setError(doc.msg);
										return;
									}
									//weiterverarbeiten an liste hängen
									for (let key of document.getElementById('left').firstChild.childNodes) {
										let nr = key.getAttribute('nr');
										let lev = key.getAttribute('l');
										if (parseInt(lev)===-1 && parseInt(nr)===doc) { key.innerText=cont.aktEntry.Name;	}
									}
									view_h.setWait(false);
								},
								rej => {
									view_h.setWait(false);
									cont.setError(rej);
								}
							);
						}
						catch (e){
							view_h.setWait(false);
							cont.setError(e);
						}
					}
				}
				else{
					//update
					let istrue=view_h.getCancelOk(`Soll ${cont.aktEntry.Name} geändert werden?`);
					if(istrue==true){
						view_h.setWait(true);
						try{
							cont.update(cont.aktEntry,ini.CONFOBJ.id,ini.CONFOBJ.stor.id,0).then(
								val => {
									let doc;
									try{doc=JSON.parse(JSON.parse(val))}
									catch (e) {
										view_h.setWait(false);
										cont.setError(e);
										return;
									}
									if(doc.art && doc.art == 'Error'){
										view_h.setWait(false);
										cont.setError(doc.msg);
										return;
									}
									//weiterverarbeiten li finden und ändern
									//doc == 2 ID
									for (let key of document.getElementById('left').firstChild.childNodes) {
										let nr = key.getAttribute('nr');
										let lev = key.getAttribute('l');
										if (parseInt(lev)===-1 && parseInt(nr)===doc) { key.innerText=cont.aktEntry.Name;	}
									}
									view_h.setWait(false);
									cont.setError(`Das Objekt ${cont.aktEntry.Name} mit der ID ${doc} wurde geändert!`);
								},
								rej => {
									view_h.setWait(false);
									cont.setError(rej);
								}
							);
						}
						catch (e){
							view_h.setWait(false);
							cont.setError(e);
						}
					}
				}
			}
			else if(ele.id==="btnDel") {
				//delete
				if(cont.aktEntry.Id==0 ){ return };
				let istrue=view_h.getCancelOk(`Soll ${cont.aktEntry.Name} gelöscht werden?`);
				if(istrue==true){
					try{
						view_h.setWait(true);
						cont.del(cont.aktEntry,ini.CONFOBJ.id,ini.CONFOBJ.stor.id,0).then(
							val => {
								let doc;
								try{doc=JSON.parse(JSON.parse(val))}
								catch (e) {
									view_h.setWait(false);
									cont.setError(text);
									return;
								}

								if(doc.art && doc.art == 'Error'){
									view_h.setWait(false);
									cont.setError(doc.msg);
									return;
								}
								//weiterverarbeiten aus liste entfernen
								for (let key of document.getElementById('left').firstChild.childNodes) {
									let nr = key.getAttribute('nr');
									let lev = key.getAttribute('l');
									if (parseInt(lev)===-1 && parseInt(nr)===doc) { key.style.visibility='hidden';	}
								}
								view_h.setWait(false);
							},
							rej => {
								view_h.setWait(false);
								cont.setError(rej);
							}
						);
					}
					catch (e){
						view_h.setWait(false);
						cont.setError(e);
					}
				}
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

		let art=ele.getAttribute("art");
		if (art==='logout') {
			view_h.getLogOut();
			return;
		}
		view_h.clear_r();
		view_h.clear_l();
		cont.setAktMenu(art);
		let leftDiv = document.getElementById("left");
		let value={};
		let child=null;
		//if tree get first level
		try{
			let lstTree=cont.getLstForTree(art);
			if(lstTree.length > 0){
				cont.getLstUsed(lstTree[0].type).then(resVal=>{
					let ul = document.createElement("ul");
					ul.addEventListener('click', viewer.click, false);
					for (let key of resVal) {
						child=view_h.createLi(key,0);
						ul.appendChild(child);
					}
					leftDiv.appendChild(ul);
					cont.createNForm();
					view_h.setWait(false);
				},rej=>{
					view_h.setWait(false);
					cont.setError(rej);
				});
			}
			else{
				cont.getList(art).then(resVal=>{
					let ul = document.createElement("ul");
					ul.addEventListener('click', viewer.click, false);
					for (let key of resVal) {
						child=view_h.createLi(key,-1);
						ul.appendChild(child);
					}
					leftDiv.appendChild(ul);
					cont.createNForm();
					view_h.setWait(false);
				},rej=>{
					view_h.setWait(false);
					cont.setError(rej);
				});
			}
		}
		catch(e){
			view_h.setWait(false);
			cont.setError(e);
		}
		view_h.hideMenu();
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
		let ak=cont.getAktMenu();
		cont.aktEntry=m;
		for (let r of ak.dsRules){
			value = m[r.feld];
			lbl = document.getElementById(`lbl_${r.feld}`);
			lbl.innerText=`${r.feld}:`;
			let txt = document.getElementById(`txt_${r.feld}`);
			if(r.art==='select'){
				for (let i = 0; i < txt.length; i++){
					let opt = txt.options[i];
					let mId=cont.getMId(m,r.feld);
					if(parseInt(opt.value)===mId){
						opt.selected =true;
						break;
					}
				}
			}
			else if(r.art==='img'){
				let b=cont.getMBild(m,r.feld);
				txt.src=`./img/bilder/${b}`;
			}
			else if(r.art==='data'){txt.innerText=m.Edit;}
			else if(r.art==='textarea'){
				txt.value=value;
				txt.rows=r.rows;
			}
			else {txt.value=value;}
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
			newSubDiv = document.createElement("section");
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
					lbl=document.createElement("input");
					lbl.type="file";
					lbl.style="width: 120px; vertical-align: top; size:10;";
					lbl.onclick=(evt)=>{let files = evt.target.files}
				}
				else{lbl=document.createElement("label");}
			}
			else if(r.art==='textarea'){
				lbl=document.createElement("label");
				/*txt.rows="12";*/
			}
			else{lbl=document.createElement("label");}
			txt.setAttribute('type',r.type)
			txt.id=`txt_${r.feld}`;
			lbl.id=`lbl_${r.feld}`;
			newSubDiv.appendChild(lbl);
			newSubDiv.appendChild(txt);
			currentDiv.appendChild(newSubDiv);
		}
		display(m);
		let edit = document.getElementById("div_edit");
		edit.style.visibility='visible';
	}

	let createMenu=()=>{
		let currentDiv = document.getElementById("botomhead");
		let menuDiv =view_h.createEle('section','navsec','','',[],'');
		let lbl = document.createElement('span');
		lbl.setAttribute('class', 'fas fa-align-justify btnMenu');
		menuDiv.appendChild(lbl);
		menuDiv.onmouseover = ()=>{view_h.showMenu();};
		menuDiv.onmouseleave = ()=>{view_h.hideMenu();};
		currentDiv.appendChild(menuDiv);
		let navDiv= view_h.createEle('section','menu','','',[],'');
		navDiv.style.visibility='hidden';
		navDiv.onmouseover=()=>{view_h.showMenu()}
		navDiv.onmousout=()=>{view_h.hideMenu()}
		let lst=cont.getListMenu();
		let menuSubDiv=null;
		for(let r of lst) {
			menuSubDiv=view_h.createEle("section",'','',r.Name,[{name:'art',val:r.type}],r.desc);
			navDiv.appendChild(menuSubDiv);
		}
		menuSubDiv=view_h.createEle('section','','fas fa-sign-out-alt btnLogout','',[{name:'art',val:'logout'}],'Abmelden');
		navDiv.appendChild(menuSubDiv);
		//bubeling eventhandler on menu click
		navDiv.addEventListener('click', viewer.menu_click, false);
		menuDiv.appendChild(navDiv);
	}

	let createMain=()=>{
		let currentDiv = document.body;
		let wrapper = view_h.createEle('main','','','',[],'');
		let menu = view_h.createEle('nav','botomhead','','',[],'');
		let header=view_h.createEle('section','head','',`${ini.CONFOBJ.titel} [${ini.CONFOBJ.v} ] ${ini.CONFOBJ.stor.desc}`,[],'');
		let sHeader=view_h.createEle('section','stl','','',[],'Bereich zusammenklappen');
		sHeader.onclick=()=>{view_h.toggleColoumWidth()}
		let cHeader=view_h.createEle('section','str','','',[],'');
		let sidebar=view_h.createEle('section','left_m','','',[],'');
		let left=view_h.createEle('section','left','','',[],'');
		sidebar.appendChild(left);
		let content=view_h.createEle('section','right_m','','',[],'');
		let edit=view_h.createEle('section','div_edit','','',[{name:'style',val:'visibility:hidden'}],'');
		let btnNew=view_h.createEle('span','btnNew','far fa-file btnEdit','',[],'neu');
		edit.appendChild(btnNew);
		btnNew=view_h.createEle('span','btnSave','far fa-save btnEdit','',[],'speichern');
		edit.appendChild(btnNew);
		btnNew=view_h.createEle('span','btnDel','far fa-trash-alt btnEdit','',[],'löschen');
		edit.appendChild(btnNew);
		btnNew=view_h.createEle('span','btnJST','fas fa-running btnEdit','',[],'öffnet den Javascript Tester');
		edit.appendChild(btnNew);
		edit.addEventListener('click', edit_click, false);
		let right=view_h.createEle('section','right','','',[],'');
		content.appendChild(edit);
		content.appendChild(right);
		let footer=view_h.createEle('section','footer','','',[],'');
		let wait=view_h.createEle('section','wait','','',[],'');
		wait.insertAdjacentHTML('beforeend', '<b>warte auf Server...</b>');
		wrapper.appendChild(header);
		wrapper.appendChild(sHeader);
		wrapper.appendChild(cHeader);
		wrapper.appendChild(sidebar);
		wrapper.appendChild(content);
		wrapper.appendChild(footer);
		wrapper.appendChild(menu);
		currentDiv.appendChild(wrapper);
		currentDiv.appendChild(wait);

		//LOGIN
		let logdiv=view_h.createEle('section','logdiv','','',[],'');
		logdiv.addEventListener("keyup", view_h.loginKeyup);
		let login =view_h.createEle('section','login','','',[],'');
		let head=view_h.createEle('label','lbl_head','',`${ini.CONFOBJ.titel} Login`,[],'');
		let lb =view_h.createEle('label','lbl_user','','Benutzer:',[],'');
		let txt =view_h.createEle('input','user_name','','',[{name:'value',val:'michi'}],'');
		let lb2 =view_h.createEle('label','lbl_pwd','','Passwort:',[],'');
		let txt2 =view_h.createEle('input','user_pwd','','',[{name:'type',val:'password'},{name:'value',val:'test'}],'');
		let btnOk=view_h.createEle('span','btnLogOk','fas fa-sign-in-alt','',[],'Anmelden');
		btnOk.onclick=()=>{view_h.getLogin()}
		login.appendChild(head);
		login.appendChild(lb);
		login.appendChild(txt);
		login.appendChild(lb2);
		login.appendChild(txt2);
		login.appendChild(btnOk);
		logdiv.appendChild(login);
		currentDiv.appendChild(logdiv);
		txt.focus();

		//ERRORBOX
		let msbDiv=view_h.createEle('section','errorDiv','','',[],'');
		msbDiv.addEventListener("keyup", view_h.msbKeyup);
		let msb=view_h.createEle('section','msb','','',[],'');
		let titel=view_h.createEle('label','lblTitle','','Test Message',[],'');
		let message=view_h.createEle('label','lblMsb','','Test Message',[],'');
		let msbOk=view_h.createEle('input','msbOk','','',[{name:'type',val:'button'},{name:'value',val:'OK'}],'');
		msbOk.addEventListener("click", view_h.msbClick);
		msb.appendChild(titel);
		msb.appendChild(message);
		msb.appendChild(msbOk);
		msbDiv.appendChild(msb);
		currentDiv.appendChild(msbDiv);
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
