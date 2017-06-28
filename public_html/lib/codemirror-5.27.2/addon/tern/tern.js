'use strict';(function(h){"object"==typeof exports&&"object"==typeof module?h(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],h):h(CodeMirror)})(function(h){function C(a,c,b){var d=a.docs[c];d?b(y(a,d)):a.options.getFile?a.options.getFile(c,b):b(null)}function w(a,c,b){for(var d in a.docs){var e=a.docs[d];if(e.doc==c)return e}if(!b)for(b=0;;++b)if(d="[doc"+(b||"")+"]",!a.docs[d]){b=d;break}return a.addDoc(b,c)}function D(a,c){if("string"==typeof c)return a.docs[c];
c instanceof h&&(c=c.getDoc());if(c instanceof h.Doc)return w(a,c)}function M(a,c,b){var d=w(a,c),e=a.cachedArgHints;e&&e.doc==c&&0<=z(e.start,b.to)&&(a.cachedArgHints=null);e=d.changed;null==e&&(d.changed=e={from:b.from.line,to:b.from.line});var f=b.from.line+(b.text.length-1);b.from.line<e.to&&(e.to-=b.to.line-f);f>=e.to&&(e.to=f+1);e.from>b.from.line&&(e.from=b.from.line);c.lineCount()>E&&100<b.to-e.from&&setTimeout(function(){d.changed&&100<d.changed.to-d.changed.from&&F(a,d)},200)}function F(a,
c){a.server.request({files:[{type:"full",name:c.name,text:y(a,c)}]},function(a){a?window.console.error(a):c.changed=null})}function N(a,c,b){a.request(c,{type:"completions",types:!0,docs:!0,urls:!0},function(d,e){if(d)return v(a,c,d);d=[];var f="",g=e.start,l=e.end;'["'==c.getRange(r(g.line,g.ch-2),g)&&'"]'!=c.getRange(l,r(l.line,l.ch+2))&&(f='"]');for(var p=0;p<e.completions.length;++p){var k=e.completions[p],u=O(k.type);e.guess&&(u+=" "+n+"guess");d.push({text:k.name+f,displayText:k.displayName||
k.name,className:u,data:k})}e={from:g,to:l,list:d};var m=null;h.on(e,"close",function(){x(m)});h.on(e,"update",function(){x(m)});h.on(e,"select",function(c,b){x(m);if(c=a.options.completionTip?a.options.completionTip(c.data):c.data.doc)m=B(b.parentNode.getBoundingClientRect().right+window.pageXOffset,b.getBoundingClientRect().top+window.pageYOffset,c),m.className+=" "+n+"hint-doc"});b(e)})}function O(a){a="?"==a?"unknown":"number"==a||"string"==a||"bool"==a?a:/^fn\(/.test(a)?"fn":/^\[/.test(a)?"array":
"object";return n+"completion "+n+"completion-"+a}function G(a,c,b,d,e){a.request(c,d,function(b,d){if(b)return v(a,c,b);if(a.options.typeTip)b=a.options.typeTip(d);else if(b=t("span",null,t("strong",null,d.type||"not found")),d.doc&&b.appendChild(document.createTextNode(" \u2014 "+d.doc)),d.url){b.appendChild(document.createTextNode(" "));var g=b.appendChild(t("a",null,"[docs]"));g.href=d.url;g.target="_blank"}H(c,b,a);e&&e()},b)}function P(a,c){A(a);if(!c.somethingSelected()){var b=c.getTokenAt(c.getCursor()).state,
b=h.innerMode(c.getMode(),b);if("javascript"==b.mode.name&&(b=b.state.lexical,"call"==b.info)){for(var d,e=b.pos||0,f=c.getOption("tabSize"),g=c.getCursor().line,l=Math.max(0,g-9),p=!1;g>=l;--g){for(var k=c.getLine(g),u=d=0;;){u=k.indexOf("\t",u);if(-1==u)break;d+=f-(u+d)%f-1;u+=1}d=b.column-d;if("("==k.charAt(d)){p=!0;break}}if(p){var m=r(g,d);if((b=a.cachedArgHints)&&b.doc==c.getDoc()&&0==z(m,b.start))return I(a,c,e);a.request(c,{type:"type",preferFunction:!0,end:m},function(b,d){!b&&d.type&&/^fn\(/.test(d.type)&&
(a.cachedArgHints={start:m,type:Q(d.type),name:d.exprName||d.name||"fn",guess:d.guess,doc:c.getDoc()},I(a,c,e))})}}}}function I(a,c,b){A(a);for(var d=a.cachedArgHints,e=d.type,d=t("span",d.guess?n+"fhint-guess":null,t("span",n+"fname",d.name),"("),f=0;f<e.args.length;++f){f&&d.appendChild(document.createTextNode(", "));var g=e.args[f];d.appendChild(t("span",n+"farg"+(f==b?" "+n+"farg-current":""),g.name||"?"));"?"!=g.type&&(d.appendChild(document.createTextNode(":\u00a0")),d.appendChild(t("span",
n+"type",g.type)))}d.appendChild(document.createTextNode(e.rettype?") ->\u00a0":")"));e.rettype&&d.appendChild(t("span",n+"type",e.rettype));c=c.cursorCoords(null,"page");a.activeArgHints=B(c.right+1,c.bottom,d)}function Q(a){function c(c){for(var b=0,e=d;;){var f=a.charAt(d);if(c.test(f)&&!b)return a.slice(e,d);/[{\[\(]/.test(f)?++b:/[}\]\)]/.test(f)&&--b;++d}}var b=[],d=3;if(")"!=a.charAt(d))for(;;){var e=a.slice(d).match(/^([^, \(\[\{]+): /);e&&(d+=e[0].length,e=e[1]);b.push({name:e,type:c(/[\),]/)});
if(")"==a.charAt(d))break;d+=2}e=a.slice(d).match(/^\) -> (.*)$/);return{args:b,rettype:e&&e[1]}}function R(a,c){function b(b){b={type:"definition",variable:b||null};var d=w(a,c.getDoc());a.server.request(J(a,d,b),function(b,e){if(b)return v(a,c,b);if(!e.file&&e.url)window.open(e.url);else{if(e.file){b=a.docs[e.file];var f;if(f=b){var g=b.doc;var k=e.context.slice(0,e.contextOffset).split("\n");var h=e.start.line-(k.length-1);f=r(h,(1==k.length?e.start.ch:g.getLine(h).length)-k[0].length);for(var m=
g.getLine(h).slice(f.ch),h=h+1;h<g.lineCount()&&m.length<e.context.length;++h)m+="\n"+g.getLine(h);if(m.slice(0,e.context.length)==e.context)var q=e;else{g=g.getSearchCursor(e.context,0,!1);for(m=Infinity;g.findNext();){var h=g.from(),n=1E4*Math.abs(h.line-f.line);n||(n=Math.abs(h.ch-f.ch));n<m&&(q=h,m=n)}q?(1==k.length?q.ch+=k[0].length:q=r(q.line+(k.length-1),k[k.length-1].length),e=e.start.line==e.end.line?r(q.line,q.ch+(e.end.ch-e.start.ch)):r(q.line+(e.end.line-e.start.line),e.end.ch),q={start:q,
end:e}):q=null}f=k=q}if(f){a.jumpStack.push({file:d.name,start:c.getCursor("from"),end:c.getCursor("to")});K(a,d,b,k.start,k.end);return}}v(a,c,"Could not find a definition.")}})}S(c)?b():L(c,"Jump to variable",function(a){a&&b(a)})}function K(a,c,b,d,e){b.doc.setSelection(d,e);c!=b&&a.options.switchToDoc&&(A(a),a.options.switchToDoc(b.name,b.doc))}function S(a){var c=a.getCursor("end"),b=a.getTokenAt(c);return b.start<c.ch&&"comment"==b.type?!1:/[\w)\]]/.test(a.getLine(c.line).slice(Math.max(c.ch-
1,0),c.ch+1))}function T(a,c){var b=c.getTokenAt(c.getCursor());if(!/\w/.test(b.string))return v(a,c,"Not at a variable");L(c,"New name for "+b.string,function(b){a.request(c,{type:"rename",newName:b,fullDocs:!0},function(b,d){if(b)return v(a,c,b);U(a,d.changes)})})}function V(a,c){var b=w(a,c.doc).name;a.request(c,{type:"refs"},function(d,e){if(d)return v(a,c,d);d=[];for(var f=0,g=c.getCursor(),h=0;h<e.refs.length;h++){var p=e.refs[h];p.file==b&&(d.push({anchor:p.start,head:p.end}),0<=z(g,p.start)&&
0>=z(g,p.end)&&(f=d.length-1))}c.setSelections(d,f)})}function U(a,c){for(var b,d=Object.create(null),e=0;e<c.length;++e)b=c[e],(d[b.file]||(d[b.file]=[])).push(b);for(var f in d){c=a.docs[f];var g=d[f];if(c){g.sort(function(a,b){return z(b.start,a.start)});for(var h="*rename"+ ++W,e=0;e<g.length;++e)b=g[e],c.doc.replaceRange(b.text,b.start,b.end,h)}}}function J(a,c,b,d){var e,f=[];(e=!b.fullDocs)||delete b.fullDocs;"string"==typeof b&&(b={type:b});b.lineCharPositions=!0;null==b.end&&(b.end=d||c.doc.getCursor("end"),
c.doc.somethingSelected()&&(b.start=c.doc.getCursor("start")));d=b.start||b.end;c.changed?c.doc.lineCount()>E&&!1!==e&&100>c.changed.to-c.changed.from&&c.changed.from<=d.line&&c.changed.to>b.end.line?(f.push(X(c,d,b.end)),b.file="#0",e=f[0].offsetLines,null!=b.start&&(b.start=r(b.start.line- -e,b.start.ch)),b.end=r(b.end.line-e,b.end.ch)):(f.push({type:"full",name:c.name,text:y(a,c)}),b.file=c.name,c.changed=null):b.file=c.name;for(var g in a.docs)e=a.docs[g],e.changed&&e!=c&&(f.push({type:"full",
name:e.name,text:y(a,e)}),e.changed=null);return{query:b,files:f}}function X(a,c,b){for(var d,e=a.doc,f=null,g=null,l=c.line-1,p=Math.max(0,l-50);l>=p;--l)d=e.getLine(l),0>d.search(/\bfunction\b/)||(d=h.countColumn(d,null,4),null!=f&&f<=d||(f=d,g=l));null==g&&(g=p);l=Math.min(e.lastLine(),b.line+20);if(null==f||f==h.countColumn(e.getLine(c.line),null,4))c=l;else for(c=b.line+1;c<l&&!(d=h.countColumn(e.getLine(c),null,4),d<=f);++c);f=r(g,0);return{type:"part",name:a.name,offsetLines:f.line,text:e.getRange(f,
r(c,0))}}function t(a,c){var b=document.createElement(a);c&&(b.className=c);for(var d=2;d<arguments.length;++d){var e=arguments[d];"string"==typeof e&&(e=document.createTextNode(e));b.appendChild(e)}return b}function L(a,c,b){a.openDialog?a.openDialog(c+": <input type=text>",b):b(prompt(c,""))}function H(a,c,b){function d(){a.state.ternTooltip=null;f.parentNode&&(a.off("cursorActivity",d),a.off("blur",d),a.off("scroll",d),Y(f))}a.state.ternTooltip&&x(a.state.ternTooltip);var e=a.cursorCoords(),f=
a.state.ternTooltip=B(e.right+1,e.bottom,c),g=!1,l=!1;h.on(f,"mousemove",function(){g=!0});h.on(f,"mouseout",function(a){h.contains(f,a.relatedTarget||a.toElement)||(l?d():g=!1)});setTimeout(function(){l=!0;g||d()},b.options.hintDelay?b.options.hintDelay:1700);a.on("cursorActivity",d);a.on("blur",d);a.on("scroll",d)}function B(a,c,b){b=t("div",n+"tooltip",b);b.style.left=a+"px";b.style.top=c+"px";document.body.appendChild(b);return b}function x(a){var c=a&&a.parentNode;c&&c.removeChild(a)}function Y(a){a.style.opacity=
"0";setTimeout(function(){x(a)},1100)}function v(a,c,b){a.options.showError?a.options.showError(c,b):H(c,String(b),a)}function A(a){a.activeArgHints&&(x(a.activeArgHints),a.activeArgHints=null)}function y(a,c){var b=c.doc.getValue();a.options.fileFilter&&(b=a.options.fileFilter(b,c.name,c.doc));return b}function Z(a){function c(a,c){c&&(a.id=++d,e[d]=c);b.postMessage(a)}var b=a.worker=new Worker(a.options.workerScript);b.postMessage({type:"init",defs:a.options.defs,plugins:a.options.plugins,scripts:a.options.workerDeps});
var d=0,e={};b.onmessage=function(b){var d=b.data;"getFile"==d.type?C(a,d.name,function(a,b){c({type:"getFile",err:String(a),text:b,id:d.id})}):"debug"==d.type?window.console.log(d.message):d.id&&e[d.id]&&(e[d.id](d.err,d.body),delete e[d.id])};b.onerror=function(a){for(var b in e)e[b](a);e={}};this.addFile=function(a,b){c({type:"add",name:a,text:b})};this.delFile=function(a){c({type:"del",name:a})};this.request=function(a,b){c({type:"req",body:a},b)}}h.TernServer=function(a){var c=this;this.options=
a||{};a=this.options.plugins||(this.options.plugins={});a.doc_comment||(a.doc_comment=!0);this.docs=Object.create(null);this.server=this.options.useWorker?new Z(this):new tern.Server({getFile:function(a,d){return C(c,a,d)},async:!0,defs:this.options.defs||[],plugins:a});this.trackChange=function(a,d){M(c,a,d)};this.activeArgHints=this.cachedArgHints=null;this.jumpStack=[];this.getHint=function(a,d){return N(c,a,d)};this.getHint.async=!0};h.TernServer.prototype={addDoc:function(a,c){var b={doc:c,name:a,
changed:null};this.server.addFile(a,y(this,b));h.on(c,"change",this.trackChange);return this.docs[a]=b},delDoc:function(a){if(a=D(this,a))h.off(a.doc,"change",this.trackChange),delete this.docs[a.name],this.server.delFile(a.name)},hideDoc:function(a){A(this);(a=D(this,a))&&a.changed&&F(this,a)},complete:function(a){a.showHint({hint:this.getHint})},showType:function(a,c,b){G(this,a,c,"type",b)},showDocs:function(a,c,b){G(this,a,c,"documentation",b)},updateArgHints:function(a){P(this,a)},jumpToDef:function(a){R(this,
a)},jumpBack:function(a){var c=this.jumpStack.pop(),b=c&&this.docs[c.file];b&&K(this,w(this,a.getDoc()),b,c.start,c.end)},rename:function(a){T(this,a)},selectName:function(a){V(this,a)},request:function(a,c,b,d){var e=this,f=w(this,a.getDoc()),g=J(this,f,c,d);if(a=g.query&&this.options.queryOptions&&this.options.queryOptions[g.query.type])for(var h in a)g.query[h]=a[h];this.server.request(g,function(a,d){!a&&e.options.responseFilter&&(d=e.options.responseFilter(f,c,g,a,d));b(a,d)})},destroy:function(){A(this);
this.worker&&(this.worker.terminate(),this.worker=null)}};var r=h.Pos,n="CodeMirror-Tern-",E=250,W=0,z=h.cmpPos});