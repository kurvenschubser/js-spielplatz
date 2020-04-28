let view_h =(function(){
	"use strict";

	let toogleMenu=()=>{
		let childDivs = document.getElementById('menu');
		if(childDivs===null) return;
		if(childDivs.style.visibility==='hidden'||childDivs.style.visibility==='') childDivs.style.visibility='visible';
		else childDivs.style.visibility='hidden';
	}

	let hideMenu=()=>{
		let childDivs = document.getElementById('menu');
		if(childDivs===null) return;
		childDivs.style.visibility='hidden';
	}

	let showMenu=()=>{
		let childDivs = document.getElementById('menu');
		if(childDivs===null) return;
		childDivs.style.visibility='visible';
	}

	let clear_r=()=>{
		let cDiv = document.getElementById("right");
		if(cDiv===null) {return}
		while(cDiv.firstChild) {cDiv.removeChild(cDiv.firstChild)}
	}

	let clear_l=()=>{
		let leftDiv = document.getElementById("left");
		if(leftDiv===null) return;
		while(leftDiv.firstChild){
			leftDiv.removeEventListener('click', viewer.click);
			leftDiv.removeChild(leftDiv.firstChild);
		}
		cont.setAktMenu(null);
		document.getElementById("stl").innerText='';
		document.getElementById("str").innerText='';
		document.getElementById("footer").innerText='';
		document.getElementById("div_edit").style.visibility='hidden';
	}

	let setEditTitle=(txN='',txS='',txD='')=>{
		let eleN = document.getElementById("btnNew");
		let eleS = document.getElementById("btnSave");
		let eleD = document.getElementById("btnDel");
		if(eleN!=null) eleN.title = txN;
		if(eleS!=null) eleS.title = txS;
		if(eleD!=null) eleD.title = txD;
	}

	let setLblStatus=(txt)=>{document.getElementById("footer").innerText=ini.CONFOBJ.titel+" ["+txt+"]"}

	let setWait=(a)=>{
		if (a==true) {
			const h=window.innerHeight;
			const w=window.innerWidth;
			document.getElementById("wait").setAttribute('style','height:' + h + 'px;');
			document.getElementById("wait").setAttribute('style','width:' + w + 'px;');
			document.getElementById("wait").style.display='block';
		}
		else{
			document.getElementById("wait").setAttribute('style','height:0px;');
			document.getElementById("wait").style.display='none';
		}
	}

	let setLeftHead=(txt)=>{document.getElementById("stl").innerText=txt}

	let setRightHead=(txt)=>{document.getElementById("str").innerText=txt}

	let createLi=(value,l)=>{
		let child = document.createElement("li");
		child.innerText=value.Name;
		child.setAttribute("nr", value.Id);
		child.setAttribute("l", l);
		return child;
	}

	let createEle=(type,id='',clN='',val='',lstAtr=[],title='')=>{
		let child = document.createElement(type);
		if(clN != '') child.className=clN;
		if(id != '') child.id=id;
		if(val != ''){child.innerText=val};
		if(title != '') child.title=title;
		for (var a in lstAtr){
			let at = lstAtr[a];
			child.setAttribute(at.name, at.val);
		}
		return child;
	}

	let createImg=(id,src,clN,t)=>{
		let img=document.createElement("img");
		img.id=id;
		img.src=src;
		if(clN !='') img.className=clN;
		img.title=t;
		img.alt=t;
		return img;
	}

	let toggleColoumWidth=()=>{
		let el=document.getElementsByTagName('main')[0];
		let style = getComputedStyle(el);
		const w=parseInt(window.innerWidth);
		if (w < 980) {
			//rows
			let rows = style.gridTemplateRows;
			let resRow=rows.split(' ');
			const row1 = parseInt(resRow[3]);
			if (row1 < 200) {
				document.getElementById("stl").title='Berreich zusammenklappen';
				el.style.gridTemplateRows = "minmax(40px, auto) 40px 40px 200px 40px auto minmax(40px, auto)";
			}
			else {
				document.getElementById("stl").title='Berreich erweitern';
				el.style.gridTemplateRows = "minmax(40px, auto) 40px 40px 0px 40px auto minmax(40px, auto)";
			}
			el.style.gridTemplateCols ="100%";
		}
		else{
			//cols
			let col = style.gridTemplateColumns;
			let resCol=col.split(' ');
			const col1 = parseInt(resCol[0]);
			if (col1 < 200) {
				document.getElementById("stl").title='Berreich zusammenklappen';
				el.style.gridTemplateColumns = "20% 79%";
			}
			else{
				document.getElementById("stl").title='Berreich erweitern';
				el.style.gridTemplateColumns = "5% 94%";
			}
			el.style.gridTemplateRows = "80px 40px 780px 40px;";
		}
	}

	let getCancelOk=(val)=>{
  	var retVal = confirm(val);
    if( retVal == true ){return true}
		else {return false}
  }

	let getLogin=()=>{
		let username = document.getElementById('user_name');
		let userpwd = document.getElementById('user_pwd');
		if (username.value==='' || userpwd.value==='') {
			alert('Bitte einen Benutzernamen und ein Passwort eingeben!');
			return;
		}
		if (username.value==='michi' || username.value==='malte') {
				if (userpwd.value==='test') {
						cont.resetIdleTime();
						document.getElementById('logdiv').style.visibility='hidden';
				}
				else {
					alert('Das Passwort ist falsch!');
					return;
				}
		}
		else {
			alert('Der Benutzername ist falsch!');
			return;
		}
	}

	let getLogOut=()=>{
		document.getElementById('logdiv').style.visibility='visible';
		document.getElementById('user_name').focus();
	}

	let loginKeyup=(e)=>{if (e.keyCode == 13) {getLogin()}}

	let msbKeyup=(e)=>{if (e.keyCode == 13) {msbClick()}}

	let msbClick=()=>{document.getElementById('errorDiv').style.visibility='hidden'}

	let setMsb=(title,val)=>{
		document.getElementById('lblTitle').innerText=title;
		document.getElementById('lblMsb').innerText=val;
		document.getElementById('errorDiv').style.visibility='visible';
		document.getElementById('msbOk').focus();
	}

	let resetActiveLi=()=>{
		for (let key of document.getElementById("left").getElementsByTagName("li")) {key.setAttribute('style','font-weight:normal')}
	}

	return{
		createImg,
		createEle,
		createLi,
		setRightHead,
		setLeftHead,
		setLblStatus,
		setEditTitle,
		clear_l,
		clear_r,
		toogleMenu,
		setWait,
		hideMenu,
		showMenu,
		toggleColoumWidth,
		getCancelOk,
		getLogin,
		getLogOut,
		loginKeyup,
		msbClick,
		msbKeyup,
		setMsb,
		resetActiveLi
	}
})();
