(function(e){function t(t){for(var o,a,c=t[0],s=t[1],u=t[2],l=0,f=[];l<c.length;l++)a=c[l],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&f.push(r[a][0]),r[a]=0;for(o in s)Object.prototype.hasOwnProperty.call(s,o)&&(e[o]=s[o]);p&&p(t);while(f.length)f.shift()();return i.push.apply(i,u||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],o=!0,a=1;a<n.length;a++){var c=n[a];0!==r[c]&&(o=!1)}o&&(i.splice(t--,1),e=s(s.s=n[0]))}return e}var o={},a={app:0},r={app:0},i=[];function c(e){return s.p+"js/"+({about:"about",education:"education",project:"project",skill:"skill"}[e]||e)+"."+{about:"26256b52",education:"bed7fb7f",project:"2f5816eb",skill:"a0677311"}[e]+".js"}function s(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.e=function(e){var t=[],n={about:1,project:1,skill:1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise((function(t,n){for(var o="css/"+({about:"about",education:"education",project:"project",skill:"skill"}[e]||e)+"."+{about:"e74494e3",education:"31d6cfe0",project:"edd06ec0",skill:"76e9723b"}[e]+".css",r=s.p+o,i=document.getElementsByTagName("link"),c=0;c<i.length;c++){var u=i[c],l=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(l===o||l===r))return t()}var f=document.getElementsByTagName("style");for(c=0;c<f.length;c++){u=f[c],l=u.getAttribute("data-href");if(l===o||l===r)return t()}var p=document.createElement("link");p.rel="stylesheet",p.type="text/css",p.onload=t,p.onerror=function(t){var o=t&&t.target&&t.target.src||r,i=new Error("Loading CSS chunk "+e+" failed.\n("+o+")");i.code="CSS_CHUNK_LOAD_FAILED",i.request=o,delete a[e],p.parentNode.removeChild(p),n(i)},p.href=r;var d=document.getElementsByTagName("head")[0];d.appendChild(p)})).then((function(){a[e]=0})));var o=r[e];if(0!==o)if(o)t.push(o[2]);else{var i=new Promise((function(t,n){o=r[e]=[t,n]}));t.push(o[2]=i);var u,l=document.createElement("script");l.charset="utf-8",l.timeout=120,s.nc&&l.setAttribute("nonce",s.nc),l.src=c(e);var f=new Error;u=function(t){l.onerror=l.onload=null,clearTimeout(p);var n=r[e];if(0!==n){if(n){var o=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;f.message="Loading chunk "+e+" failed.\n("+o+": "+a+")",f.name="ChunkLoadError",f.type=o,f.request=a,n[1](f)}r[e]=void 0}};var p=setTimeout((function(){u({type:"timeout",target:l})}),12e4);l.onerror=l.onload=u,document.head.appendChild(l)}return Promise.all(t)},s.m=e,s.c=o,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)s.d(n,o,function(t){return e[t]}.bind(null,o));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/",s.oe=function(e){throw console.error(e),e};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=t,u=u.slice();for(var f=0;f<u.length;f++)t(u[f]);var p=l;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("cd49")},1502:function(e,t,n){"use strict";n("45cc")},"45cc":function(e,t,n){},"85f2":function(e,t,n){"use strict";n.d(t,"a",(function(){return o})),n.d(t,"d",(function(){return a})),n.d(t,"c",(function(){return r})),n.d(t,"b",(function(){return i}));var o={fullName:"Hoàng Dân An",englishName:"An Hoang",nickname:"Beo",phone:"*****"},a={facebook:"https://facebook.com/beohoang1998",github:"https://github.com/beohoang98",instagram:"https://instagram.com/beohoang98",linkedin:"https://linkedin.com/in/an-hoang98"},r=[{name:"Programming",value:5,unit:"years",note:"In university and work",faIcon:"fa fa-code",skills:[{name:"C / C++",value:2,unit:"years",note:"In university"},{name:"Front-end Web Development",value:2,unit:"years",faIcon:"fa fa-desktop",skills:[{name:"React.js",value:2,unit:"projects",note:"In university and works",faIcon:"fab fa-react"},{name:"Vue.js",value:2,unit:"projects",note:"In works, with knowledge in Vue 2 & 3",faIcon:"fab fa-vuejs"}]},{name:"Back-end Web Development",value:2,unit:"years",note:"In University",faIcon:"fa fa-server",skills:[{name:"Databases",value:1,note:"In University, with basic knowledge.\nInclude MySQL, MSSQL, MongoDB",unit:"years",faIcon:"fa fa-database"},{name:"Node.js",value:3,unit:"years",note:"In University, work's projects",faIcon:"fab fa-node"}]}]},{name:"English",note:"Good at Reading.\nBe improving Listening and Speaking",value:"",faIcon:"fa fa-globe-asia"}],i=[{type:"github",url:"https://github.com/beohoang98/tree-visualizer",teamSize:1,time:"Jan 2021",kind:"personal",name:"Tree Visualizer",description:"Visualize tree data structure like Binary Tree, etc",languages:["Vue","Javascript"],knowledge:["Data structure","Tree","SVG"]},{type:"github",url:"https://github.com/beohoang98/typing-survival",teamSize:2,role:"Programmer",name:"Hero of Words (Game)",languages:["C#","Unity"],description:"School's project about Game Making with Unity",knowledge:["CSharp of course","Basics about Unity","Some knowledge about graphic stuff like shader or post-processing"],time:"Sep 2020 - Dec 2020",kind:"school"},{type:"github",teamSize:2,languages:["Node.js","Typescript","Vue"],url:"https://github.com/beohoang98/internet-banking",role:"Fullstack",name:"Internet Banking",description:"School's project in Web Development course. To create an internet banking system which has backend and frontend in SPA",knowledge:["Node.js and Typescript, framework is Nest.js (not Next.js)","Basic encryption in banking like PGP and SHA512 to safety communication with other bank system","Vue.js for making Single Page Application"],time:"Jan 2020 - May 2020",kind:"school"},{type:"custom",name:"Cloudjet Potential (shutdown)",description:"An Application Tracking System developed with serverless solutions (Firebase, Netlify). The project was shutdown in March 2020 but it's the first real project that I had participated",role:"Junior Frontend Developer",teamSize:8,languages:["Vue.js","Node.js","Typescript"],knowledge:["First time dealing with tons of complex things in real frontend application","Experienced with problems about teamwork and communication that is as important as coding","Experienced with a workflow in real project, like pull-request, testing phase, named version, deployment and distribution","Basics about Cloud platform as Google Cloud","Dealing with tons of pros/cons of Firebase, NoSQL. That are very ease and quick to use but they will be more complex with higher requirements","Disadvantages in SEO and performance with SPA, which are trade-off to archive fast and reusable coding"],time:"March 2019 - Dec 2019",kind:"real-world"},{type:"github",url:"https://github.com/beohoang98/ISE_NMH_16",name:"Smart Money",description:"Android app for wallet management, final project in university for Software Technology subject",teamSize:4,role:"Team Leader, also as coder",knowledge:["Basic about Android","Basic about workflow for a software project","Basic about what we need to archive during development of a software project"],time:"Oct 2018 - Jan 2019",kind:"school",languages:["Android","Java"]}]},a5a3:function(e,t,n){},b450:function(e,t,n){"use strict";n("a5a3")},cd49:function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var o=n("7a23"),a={class:"app-body"},r={class:"app-header"};function i(e,t,n,i,c,s){var u=Object(o["y"])("Navigation"),l=Object(o["y"])("router-link"),f=Object(o["y"])("Socials"),p=Object(o["y"])("router-view");return Object(o["r"])(),Object(o["e"])("div",{class:"app page-"+i.pathName},[Object(o["i"])(u),Object(o["i"])("div",a,[Object(o["i"])("div",r,[Object(o["i"])(l,{to:"/"},{default:Object(o["E"])((function(){return[Object(o["i"])("img",{src:i.socials.github+".png?size=320",alt:"",width:"320"},null,8,["src"])]})),_:1}),Object(o["i"])(f)]),Object(o["i"])(o["b"],{name:"fade"},{default:Object(o["E"])((function(){return[Object(o["i"])(p,{class:"app-content"})]})),_:1})])],2)}n("ac1f"),n("5319");var c=n("6c02"),s=(n("b0c0"),{class:"app-nav"}),u={class:"app-nav-menu"},l={class:"app-nav-menu-item--title"},f=Object(o["j"])({expose:[],setup:function(e){var t=[{name:"About me",path:"/about",icon:"info-circle"},{name:"Education",path:"/education",icon:"book-open"},{name:"Skills",path:"/skills",icon:"lightbulb"},{name:"Projects",path:"/projects",icon:"tasks"},{name:"Other stuffs",path:"/other-stuffs",icon:"puzzle-piece"}];return function(e,n){var a=Object(o["y"])("router-link");return Object(o["r"])(),Object(o["e"])("nav",s,[Object(o["i"])("ul",u,[(Object(o["r"])(),Object(o["e"])(o["a"],null,Object(o["x"])(t,(function(e){return Object(o["i"])(a,{to:e.path,class:"app-nav-menu-item","active-class":"active",key:e.path},{default:Object(o["E"])((function(){return[Object(o["i"])("i",{class:"fa fa-"+e.icon},null,2),Object(o["i"])("strong",l,Object(o["A"])(e.name),1)]})),_:2},1032,["to"])})),64))])])}}}),p=(n("fb44"),f),d=n("85f2"),b={class:"app-social-links"},h=Object(o["i"])("i",{class:"fab fa-facebook"},null,-1),m=Object(o["i"])("i",{class:"fab fa-github"},null,-1),g=Object(o["i"])("i",{class:"fab fa-linkedin"},null,-1),j=Object(o["i"])("i",{class:"fab fa-instagram"},null,-1),v=Object(o["j"])({expose:[],setup:function(e){return function(e,t){return Object(o["r"])(),Object(o["e"])("ul",b,[Object(o["i"])("li",null,[Object(o["i"])("a",{href:Object(o["B"])(d["d"]).facebook,target:"_blank",title:"Facebook"},[h],8,["href"])]),Object(o["i"])("li",null,[Object(o["i"])("a",{href:Object(o["B"])(d["d"]).github,title:"Github",target:"_blank"},[m],8,["href"])]),Object(o["i"])("li",null,[Object(o["i"])("a",{href:Object(o["B"])(d["d"]).linkedin,title:"Linkedin",target:"_blank"},[g],8,["href"])]),Object(o["i"])("li",null,[Object(o["i"])("a",{href:Object(o["B"])(d["d"]).instagram,title:"Instagram",target:"_blank"},[j],8,["href"])])])}}}),k=(n("1502"),v),y={components:{Socials:k,Navigation:p},setup:function(){var e=Object(c["c"])(),t=Object(o["c"])((function(){return e.path.replace(/[\\/]/gi,"").toLowerCase()}));return{pathName:t,profile:d["a"],socials:d["d"]}}};n("b450");y.render=i;var O=y,w=n("9483");Object(w["a"])("".concat("/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}});n("d3b7");function S(e,t){return Object(o["r"])(),Object(o["e"])("div")}const A={};A.render=S;var N=A,I=[{path:"/",name:"Home",component:N},{path:"/about",name:"About",component:function(){return n.e("about").then(n.bind(null,"f820"))}},{path:"/education",name:"Education",component:function(){return n.e("education").then(n.bind(null,"7a0c"))}},{path:"/skills",name:"Skills",component:function(){return n.e("skill").then(n.bind(null,"5c73"))}},{path:"/projects",name:"Projects",component:function(){return n.e("project").then(n.bind(null,"07bd"))}},{path:"/other-stuffs",name:"Other Stuffs",component:N}],B=Object(c["a"])({history:Object(c["b"])("/"),routes:I}),E=B;Object(o["d"])(O).use(E).mount("#app")},eb3d:function(e,t,n){},fb44:function(e,t,n){"use strict";n("eb3d")}});
//# sourceMappingURL=app.29175b40.js.map