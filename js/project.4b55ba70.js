"use strict";(self["webpackChunkbeohoang98_github_io"]=self["webpackChunkbeohoang98_github_io"]||[]).push([[242],{367:function(e,t,i){i.r(t),i.d(t,{default:function(){return F}});var n=i(252),s=i(262),o=i(35);const c={class:"project-item",ref:"element"},l={class:"project-time"},r={"data-role":"line",fill:"none",viewBox:"0 0 100 200",preserveAspectRatio:"none"},a=["d"],p=(0,n._)("svg",{"data-role":"point",viewBox:"0 0 100 100"},[(0,n._)("circle",{r:"5",cx:"50",cy:"50"})],-1),u=["datetime"],h={class:"project-info"},g=["href"],d={key:1},_={class:"project-description",title:"Description"},j=(0,n._)("h3",null,"Description",-1),w={class:"project-lang",title:"Languages, Stacks"},m={class:"project-team"},k=(0,n._)("h3",null,"Team",-1),b=(0,n._)("strong",null,"Size:",-1),v=(0,n._)("strong",null,"Role:",-1),y={class:"project-knowledge"},L=(0,n._)("h3",null,"Experience",-1);function f(e,t,i,s,f,D){return(0,n.wg)(),(0,n.iD)("article",c,[(0,n._)("section",l,[((0,n.wg)(),(0,n.iD)("svg",r,[(0,n._)("path",{d:e.pathLine},null,8,a)])),p,(0,n._)("time",{datetime:e.project.time},(0,o.zw)(e.project.time),9,u)]),(0,n._)("section",h,[e.project.url?((0,n.wg)(),(0,n.iD)("a",{key:0,href:e.project.url,target:"_blank"},[(0,n._)("h2",null,(0,o.zw)(e.project.name),1)],8,g)):((0,n.wg)(),(0,n.iD)("h2",d,(0,o.zw)(e.project.name),1)),(0,n._)("p",{class:(0,o.C_)("project-kind "+e.project.kind)},(0,o.zw)(e.project.kind),3),(0,n._)("section",_,[j,(0,n._)("p",null,(0,o.zw)(e.project.description),1)]),(0,n._)("section",w,[(0,n._)("ul",null,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(e.project.languages,(e=>((0,n.wg)(),(0,n.iD)("li",{class:"project-lang-item",key:e},(0,o.zw)(e),1)))),128))])]),(0,n._)("section",m,[k,(0,n._)("p",null,[b,(0,n.Uk)(" "+(0,o.zw)(e.project.teamSize),1)]),(0,n._)("p",null,[v,(0,n.Uk)(" "+(0,o.zw)(e.project.role),1)])]),(0,n._)("section",y,[L,(0,n._)("ul",null,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(e.project.knowledge,((e,t)=>((0,n.wg)(),(0,n.iD)("li",{key:t},(0,o.zw)(e),1)))),128))])])])],512)}var D=(0,n.aZ)({props:{project:{type:Object,required:!0},isFirst:Boolean,isLast:Boolean},computed:{pathLine(){return this.isFirst?"M50,100 L50,200":this.isLast?"M50,0 L50,100":"M50,0 L50,200"}},methods:{checkVisible(){const e=this.$refs.element,{y:t,height:i}=e.getBoundingClientRect(),{height:n}=document.body.getBoundingClientRect();t>2*n/3||t+i<n/3?e.classList.remove("visible"):e.classList.add("visible")},watchVisibility(){setTimeout(this.checkVisible,200)}},mounted(){this.checkVisible(),document.querySelector(".app-content")?.addEventListener("scroll",this.watchVisibility)},unmounted(){document.querySelector(".app-content")?.removeEventListener("scroll",this.watchVisibility)}}),z=i(744);const S=(0,z.Z)(D,[["render",f]]);var B=S,V=i(901);const q={class:"app-projects-content"};var C=(0,n.aZ)({__name:"app-project",setup(e){return(e,t)=>((0,n.wg)(),(0,n.iD)("div",q,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)((0,s.SU)(V.q),((e,t)=>((0,n.wg)(),(0,n.j4)(B,{key:t,project:e,isFirst:0===t,isLast:t===(0,s.SU)(V.q).length-1},null,8,["project","isFirst","isLast"])))),128))]))}});const x=C;var F=x}}]);
//# sourceMappingURL=project.4b55ba70.js.map