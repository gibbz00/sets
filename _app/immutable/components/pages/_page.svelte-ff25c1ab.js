import{S as Y,i as Z,s as ee,w as V,a as M,k as C,q as U,x as O,c as B,l as T,m as y,h as b,r as S,n as w,y as A,b as N,G as k,I as j,f as D,g as q,d as z,t as E,z as x,J as se,H as F,e as J,B as te,K as G,u as ne,p as oe,L as ae,M as be,N as Ce,O as Te,P as ye,Q as Pe,R as ve,T as we,j as Ne,U as Ve,V as Oe,W as Ae}from"../../chunks/index-5892b046.js";import{C as ke,H as Q,g as xe,e as De,s as K,E as Me,A as Ie,f as Be,a as We,b as ie,c as Ue,d as Se,P as Ee,w as le,h as ce,I as He,i as Fe,T as Re}from"../../chunks/TableTemplate-6f5d294e.js";let X=(l,e)=>{let n=e;for(let t=0;t<l.length;t++)n=n.filter(s=>{if(s.charAt(t)==l.charAt(t))return s});return n};function ue(l,e,n){const t=l.slice();return t[13]=e[n],t}function fe(l,e,n){const t=l.slice();return t[16]=e[n],t}function de(l){let e,n=l[13]+"",t,s,o,a,r,i,f,u=[...l[4].getDefined(l[0]).getDefined(l[13])],_=[];for(let h=0;h<u.length;h+=1)_[h]=pe(fe(l,u,h));const g=h=>E(_[h],1,1,()=>{_[h]=null});function p(...h){return l[9](l[13],...h)}return r=new Q({props:{placeholderText:"Add tag",listItems:[...l[3].getDefined(l[13]).values()],listFilter:X,$$slots:{placeholderContent:[qe]},$$scope:{ctx:l}}}),r.$on("selected",p),{c(){e=C("div"),t=U(n),s=M(),o=C("div");for(let h=0;h<_.length;h+=1)_[h].c();a=M(),V(r.$$.fragment),i=M(),this.h()},l(h){e=T(h,"DIV",{class:!0});var d=y(e);t=S(d,n),d.forEach(b),s=B(h),o=T(h,"DIV",{class:!0});var c=y(o);for(let m=0;m<_.length;m+=1)_[m].l(c);a=B(c),O(r.$$.fragment,c),i=B(c),c.forEach(b),this.h()},h(){w(e,"class","text-2xl mb-1 w-fit"),w(o,"class","flex items-center flex-wrap gap-2")},m(h,d){N(h,e,d),k(e,t),N(h,s,d),N(h,o,d);for(let c=0;c<_.length;c+=1)_[c].m(o,null);k(o,a),A(r,o,null),k(o,i),f=!0},p(h,d){if(l=h,(!f||d&8)&&n!==(n=l[13]+"")&&ne(t,n),d&29){u=[...l[4].getDefined(l[0]).getDefined(l[13])];let m;for(m=0;m<u.length;m+=1){const v=fe(l,u,m);_[m]?(_[m].p(v,d),D(_[m],1)):(_[m]=pe(v),_[m].c(),D(_[m],1),_[m].m(o,a))}for(q(),m=u.length;m<_.length;m+=1)g(m);z()}const c={};d&8&&(c.listItems=[...l[3].getDefined(l[13]).values()]),d&524288&&(c.$$scope={dirty:d,ctx:l}),r.$set(c)},i(h){if(!f){for(let d=0;d<u.length;d+=1)D(_[d]);D(r.$$.fragment,h),f=!0}},o(h){_=_.filter(Boolean);for(let d=0;d<_.length;d+=1)E(_[d]);E(r.$$.fragment,h),f=!1},d(h){h&&b(e),h&&b(s),h&&b(o),se(_,h),x(r)}}}function je(l){let e,n=l[16]+"",t;return{c(){e=C("div"),t=U(n),this.h()},l(s){e=T(s,"DIV",{class:!0,slot:!0});var o=y(e);t=S(o,n),o.forEach(b),this.h()},h(){w(e,"class","text-white pl-2 text-center"),w(e,"slot","placeholderContent")},m(s,o){N(s,e,o),k(e,t)},p(s,o){o&25&&n!==(n=s[16]+"")&&ne(t,n)},d(s){s&&b(e)}}}function pe(l){let e,n,t,s;function o(...r){return l[7](l[13],l[16],...r)}function a(){return l[8](l[13],l[16])}return n=new Me({props:{inputPlaceholderText:"Change tag name",inputElementClasses:{input:"bg-green-800 text-white placeholder:text-gray-300",icon:"fill-white"},iconClass:{base:"fill-gray-300",opened:"fill-white",groupHover:"group-hover:fill-white"},dynamicWidth:!0,absoluteEllipsisPositioning:!1,$$slots:{placeholderContent:[je]},$$scope:{ctx:l}}}),n.$on("update",o),n.$on("delete",a),{c(){e=C("div"),V(n.$$.fragment),t=M(),this.h()},l(r){e=T(r,"DIV",{class:!0});var i=y(e);O(n.$$.fragment,i),t=B(i),i.forEach(b),this.h()},h(){w(e,"class","bg-green-800 p-2 rounded-sm font-medium grid place-content-center")},m(r,i){N(r,e,i),A(n,e,null),k(e,t),s=!0},p(r,i){l=r;const f={};i&524313&&(f.$$scope={dirty:i,ctx:l}),n.$set(f)},i(r){s||(D(n.$$.fragment,r),s=!0)},o(r){E(n.$$.fragment,r),s=!1},d(r){r&&b(e),x(n)}}}function qe(l){let e,n;return e=new Ie({props:{slot:"placeholderContent"}}),{c(){V(e.$$.fragment)},l(t){O(e.$$.fragment,t)},m(t,s){A(e,t,s),n=!0},p:te,i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){E(e.$$.fragment,t),n=!1},d(t){x(e,t)}}}function he(l){let e=l[4].getDefined(l[0]).has(l[13]),n,t,s=e&&de(l);return{c(){s&&s.c(),n=J()},l(o){s&&s.l(o),n=J()},m(o,a){s&&s.m(o,a),N(o,n,a),t=!0},p(o,a){a&25&&(e=o[4].getDefined(o[0]).has(o[13])),e?s?(s.p(o,a),a&25&&D(s,1)):(s=de(o),s.c(),D(s,1),s.m(n.parentNode,n)):s&&(q(),E(s,1,1,()=>{s=null}),z())},i(o){t||(D(s),t=!0)},o(o){E(s),t=!1},d(o){s&&s.d(o),o&&b(n)}}}function ze(l){let e,n;return{c(){e=C("button"),n=U("Add group"),this.h()},l(t){e=T(t,"BUTTON",{slot:!0});var s=y(e);n=S(s,"Add group"),s.forEach(b),this.h()},h(){w(e,"slot","placeholderContent")},m(t,s){N(t,e,s),k(e,n)},p:te,d(t){t&&b(e)}}}function Ge(l){let e,n;return{c(){e=C("button"),n=U("Change exercise"),this.h()},l(t){e=T(t,"BUTTON",{slot:!0});var s=y(e);n=S(s,"Change exercise"),s.forEach(b),this.h()},h(){w(e,"slot","placeholderContent")},m(t,s){N(t,e,s),k(e,n)},p:te,d(t){t&&b(e)}}}function Le(l){let e,n,t,s,o,a,r,i,f,u,_,g,p,h,d,c={};e=new ke({props:c}),l[6](e);let m=[...l[3].keys()],v=[];for(let $=0;$<m.length;$+=1)v[$]=he(ue(l,m,$));const L=$=>E(v[$],1,1,()=>{v[$]=null});return r=new Q({props:{placeholderText:"Enter group name",elementClasses:{input:"w-full text-center placeholder:text-gray-300 pl-2 text-white",icon:"fill-white"},dynamicWidth:!1,listItems:[...l[3].keys()],listFilter:X,listOmit:[...l[4].getDefined(l[0]).keys()],$$slots:{placeholderContent:[ze]},$$scope:{ctx:l}}}),r.$on("selected",l[10]),f=new Q({props:{elementClasses:{input:"w-full text-center placeholder:text-gray-300 pl-2 text-white",icon:"fill-white"},dynamicWidth:!1,listItems:[...l[4].keys()],listFilter:X,placeholderText:"New exercise name",$$slots:{placeholderContent:[Ge]},$$scope:{ctx:l}}}),f.$on("selected",l[11]),{c(){V(e.$$.fragment),n=M(),t=C("div"),s=C("span");for(let $=0;$<v.length;$+=1)v[$].c();o=M(),a=C("div"),V(r.$$.fragment),i=M(),V(f.$$.fragment),u=M(),_=C("button"),g=U("Delete exercise plan"),this.h()},l($){O(e.$$.fragment,$),n=B($),t=T($,"DIV",{id:!0,class:!0});var I=y(t);s=T(I,"SPAN",{class:!0});var H=y(s);for(let P=0;P<v.length;P+=1)v[P].l(H);H.forEach(b),o=B(I),a=T(I,"DIV",{id:!0,class:!0});var W=y(a);O(r.$$.fragment,W),i=B(W),O(f.$$.fragment,W),u=B(W),_=T(W,"BUTTON",{});var R=y(_);g=S(R,"Delete exercise plan"),R.forEach(b),W.forEach(b),I.forEach(b),this.h()},h(){w(s,"class","space-y-2"),w(a,"id","exercisePlanOptions"),w(a,"class","flex flex-col space-y-2 [&_button]:bg-green-800 [&_button:hover]:bg-green-900 [&_button]:px-2 [&>button]:rounded-sm [&_button]:py-4 [&_button]:w-full [&_input]:bg-green-800 text-white font-medium mt-3 "),w(t,"id","drop-right-menu"),w(t,"class","w-max p-3 text-black bg-white border-2 border-gray-100 rounded-sm shadow-md border-gray cursor-default ")},m($,I){A(e,$,I),N($,n,I),N($,t,I),k(t,s);for(let H=0;H<v.length;H+=1)v[H].m(s,null);k(t,o),k(t,a),A(r,a,null),k(a,i),A(f,a,null),k(a,u),k(a,_),k(_,g),p=!0,h||(d=j(_,"click",l[12]),h=!0)},p($,[I]){const H={};if(e.$set(H),I&29){m=[...$[3].keys()];let P;for(P=0;P<m.length;P+=1){const re=ue($,m,P);v[P]?(v[P].p(re,I),D(v[P],1)):(v[P]=he(re),v[P].c(),D(v[P],1),v[P].m(s,null))}for(q(),P=m.length;P<v.length;P+=1)L(P);z()}const W={};I&8&&(W.listItems=[...$[3].keys()]),I&17&&(W.listOmit=[...$[4].getDefined($[0]).keys()]),I&524288&&(W.$$scope={dirty:I,ctx:$}),r.$set(W);const R={};I&16&&(R.listItems=[...$[4].keys()]),I&524288&&(R.$$scope={dirty:I,ctx:$}),f.$set(R)},i($){if(!p){D(e.$$.fragment,$);for(let I=0;I<m.length;I+=1)D(v[I]);D(r.$$.fragment,$),D(f.$$.fragment,$),p=!0}},o($){E(e.$$.fragment,$),v=v.filter(Boolean);for(let I=0;I<v.length;I+=1)E(v[I]);E(r.$$.fragment,$),E(f.$$.fragment,$),p=!1},d($){l[6](null),x(e,$),$&&b(n),$&&b(t),se(v,$),x(r),x(f),h=!1,d()}}}function Je(l,e,n){let t,s,o;F(l,xe,c=>n(3,t=c)),F(l,De,c=>n(4,s=c)),F(l,K,c=>n(5,o=c));let{exerciseName:a}=e,{exercisePlanIndex:r}=e,i;function f(c){G[c?"unshift":"push"](()=>{i=c,n(2,i)})}const u=(c,m,v)=>i.updateTag(c,m,v.detail),_=(c,m)=>i.deleteExerciseTag(a,c,m),g=(c,m)=>i.createExerciseTag(m.detail.selected,c,a),p=c=>i.addGroupToExercise(a,c.detail.selected),h=c=>i.updatePlanExercise(c.detail.selected,r),d=()=>i.deleteExercisePlan(o,a,r);return l.$$set=c=>{"exerciseName"in c&&n(0,a=c.exerciseName),"exercisePlanIndex"in c&&n(1,r=c.exercisePlanIndex)},[a,r,i,t,s,o,f,u,_,g,p,h,d]}class Qe extends Y{constructor(e){super(),Z(this,e,Je,Le,ee,{exerciseName:0,exercisePlanIndex:1})}}function Ke(l){let e,n,t,s,o,a,r,i,f,u,_,g,p,h;return{c(){e=C("div"),n=C("button"),t=U("-"),o=M(),a=C("input"),r=M(),i=C("button"),f=U("+"),this.h()},l(d){e=T(d,"DIV",{class:!0});var c=y(e);n=T(c,"BUTTON",{class:!0});var m=y(n);t=S(m,"-"),m.forEach(b),o=B(c),a=T(c,"INPUT",{class:!0,min:!0,step:!0,type:!0}),r=B(c),i=T(c,"BUTTON",{class:!0});var v=y(i);f=S(v,"+"),v.forEach(b),c.forEach(b),this.h()},h(){w(n,"class","text-gray-400 w-7 group-hover:text-black"),n.disabled=s=l[0]==0,oe(n,"color",l[0]==0?"grey":""),w(a,"class","text-center w-7 invalid:text-rose-600"),w(a,"min","0"),w(a,"step","1"),w(a,"type","number"),w(i,"class","text-gray-400 w-7 group-hover:text-black"),w(e,"class","group flex h-10")},m(d,c){N(d,e,c),k(e,n),k(n,t),k(e,o),k(e,a),ae(a,l[0]),k(e,r),k(e,i),k(i,f),g=!0,p||(h=[j(n,"click",l[1]),j(a,"input",l[2]),j(i,"click",l[3])],p=!0)},p(d,[c]){l=d,(!g||c&1&&s!==(s=l[0]==0))&&(n.disabled=s),c&1&&oe(n,"color",l[0]==0?"grey":""),c&1&&be(a.value)!==l[0]&&ae(a,l[0])},i(d){g||(d&&Ce(()=>{_&&_.end(1),u=Te(e,ie,{delay:Be,duration:We}),u.start()}),g=!0)},o(d){u&&u.invalidate(),d&&(_=ye(e,ie,{delay:Ue,duration:Se})),g=!1},d(d){d&&b(e),d&&_&&_.end(),p=!1,Pe(h)}}}function Xe(l,e,n){let{set:t}=e;const s=()=>n(0,t--,t);function o(){t=be(this.value),n(0,t)}const a=()=>n(0,t++,t);return l.$$set=r=>{"set"in r&&n(0,t=r.set)},[t,s,o,a]}class Ye extends Y{constructor(e){super(),Z(this,e,Xe,Ke,ee,{set:0})}}function Ze(l){let e,n;return e=new He({props:{listOptions:{items:[...l[3].keys()]}}}),e.$on("selected",l[6]),{c(){V(e.$$.fragment)},l(t){O(e.$$.fragment,t)},m(t,s){A(e,t,s),n=!0},p(t,s){const o={};s&8&&(o.listOptions={items:[...t[3].keys()]}),e.$set(o)},i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){E(e.$$.fragment,t),n=!1},d(t){x(e,t)}}}function et(l){let e,n,t,s,o,a,r,i,f,u,_,g,p;function h(c){l[7](c)}let d={iconType:"expand_more",iconClass:l[4],$$slots:{popMenuWindow:[Ze]},$$scope:{ctx:l}};return l[0]!==void 0&&(d.opened=l[0]),a=new Ee({props:d}),G.push(()=>ve(a,"opened",h)),{c(){e=C("div"),n=C("div"),t=C("div"),s=U(l[2]),o=M(),V(a.$$.fragment),i=M(),f=C("input"),this.h()},l(c){e=T(c,"DIV",{class:!0});var m=y(e);n=T(m,"DIV",{class:!0});var v=y(n);t=T(v,"DIV",{class:!0});var L=y(t);s=S(L,l[2]),L.forEach(b),o=B(v),O(a.$$.fragment,v),v.forEach(b),i=B(m),f=T(m,"INPUT",{placeholder:!0,class:!0}),m.forEach(b),this.h()},h(){w(t,"class","text-6xl mr-1"),w(n,"class","flex"),f.value=u=l[3].getDefined(l[2]).description,w(f,"placeholder","Add a workout description"),w(f,"class","text-2xl mt-4 resize-none focus:outline-none border-2 border-green-900/0 focus:border-green-900/100 hover:border-green-900/100"),w(e,"class","flex flex-col")},m(c,m){N(c,e,m),k(e,n),k(n,t),k(t,s),k(n,o),A(a,n,null),k(e,i),k(e,f),l[8](f),_=!0,g||(p=j(f,"input",l[9]),g=!0)},p(c,[m]){(!_||m&4)&&ne(s,c[2]);const v={};m&1037&&(v.$$scope={dirty:m,ctx:c}),!r&&m&1&&(r=!0,v.opened=c[0],we(()=>r=!1)),a.$set(v),(!_||m&12&&u!==(u=c[3].getDefined(c[2]).description)&&f.value!==u)&&(f.value=u)},i(c){_||(D(a.$$.fragment,c),_=!0)},o(c){E(a.$$.fragment,c),_=!1},d(c){c&&b(e),x(a),l[8](null),g=!1,p()}}}function tt(l,e,n){let t,s;F(l,K,p=>n(2,t=p)),F(l,le,p=>n(3,s=p));let o,a={base:"w-[4.5rem]",opened:"rotate-90"};Ne(()=>{n(1,r.style.width=ce(r),r)});let r;function i(p){s.getDefined(t).description=p.target.value,n(1,r.style.width=ce(r),r)}const f=p=>{Ve(K,t=p.detail.selected,t),n(0,o=!1)};function u(p){o=p,n(0,o)}function _(p){G[p?"unshift":"push"](()=>{r=p,n(1,r)})}return[o,r,t,s,a,i,f,u,_,p=>i(p)]}class nt extends Y{constructor(e){super(),Z(this,e,tt,et,ee,{})}}function _e(l,e,n){const t=l.slice();return t[7]=e[n],t[9]=n,t}function me(l,e,n){const t=l.slice();return t[10]=e[n],t[11]=e,t[12]=n,t}function lt(l){let e,n;return e=new nt({}),{c(){V(e.$$.fragment)},l(t){O(e.$$.fragment,t)},m(t,s){A(e,t,s),n=!0},i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){E(e.$$.fragment,t),n=!1},d(t){x(e,t)}}}function st(l){let e;return{c(){e=U("Exercise")},l(n){e=S(n,"Exercise")},m(n,t){N(n,e,t)},d(n){n&&b(e)}}}function rt(l){let e,n=l[7].exerciseName+"",t;return{c(){e=C("div"),t=U(n),this.h()},l(s){e=T(s,"DIV",{slot:!0,class:!0});var o=y(e);t=S(o,n),o.forEach(b),this.h()},h(){w(e,"slot","placeholderContent"),w(e,"class","max-w-[22rem] ml-3 my-1 truncate")},m(s,o){N(s,e,o),k(e,t)},p(s,o){o&6&&n!==(n=s[7].exerciseName+"")&&ne(t,n)},d(s){s&&b(e)}}}function ot(l){let e,n;return e=new Qe({props:{slot:"popMenuWindow",exerciseName:l[7].exerciseName,exercisePlanIndex:l[9]}}),{c(){V(e.$$.fragment)},l(t){O(e.$$.fragment,t)},m(t,s){A(e,t,s),n=!0},p(t,s){const o={};s&6&&(o.exerciseName=t[7].exerciseName),s&6&&(o.exercisePlanIndex=t[9]),e.$set(o)},i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){E(e.$$.fragment,t),n=!1},d(t){x(e,t)}}}function ge(l){let e,n,t,s;function o(r){l[6](r,l[10],l[11],l[12])}let a={};return l[10]!==void 0&&(a.set=l[10]),n=new Ye({props:a}),G.push(()=>ve(n,"set",o)),{c(){e=C("div"),V(n.$$.fragment),this.h()},l(r){e=T(r,"DIV",{class:!0});var i=y(e);O(n.$$.fragment,i),i.forEach(b),this.h()},h(){w(e,"class","justify-self-center")},m(r,i){N(r,e,i),A(n,e,null),s=!0},p(r,i){l=r;const f={};!t&&i&6&&(t=!0,f.set=l[10],we(()=>t=!1)),n.$set(f)},i(r){s||(D(n.$$.fragment,r),s=!0)},o(r){E(n.$$.fragment,r),s=!1},d(r){r&&b(e),x(n)}}}function $e(l,e){let n,t,s,o,a,r,i;o=new Ee({props:{fadeTransition:!0,iconType:"arrowRight",iconClass:{opened:"rotate-180"},$$slots:{popMenuWindow:[ot],placeholderContent:[rt]},$$scope:{ctx:e}}});let f=e[7].sets,u=[];for(let g=0;g<f.length;g+=1)u[g]=ge(me(e,f,g));const _=g=>E(u[g],1,1,()=>{u[g]=null});return{key:l,first:null,c(){n=C("div"),t=C("div"),s=C("div"),V(o.$$.fragment),a=M();for(let g=0;g<u.length;g+=1)u[g].c();r=M(),this.h()},l(g){n=T(g,"DIV",{class:!0});var p=y(n);t=T(p,"DIV",{class:!0});var h=y(t);s=T(h,"DIV",{class:!0});var d=y(s);O(o.$$.fragment,d),d.forEach(b),h.forEach(b),a=B(p);for(let c=0;c<u.length;c+=1)u[c].l(p);r=B(p),p.forEach(b),this.h()},h(){w(s,"class","max-w-max"),w(t,"class","col-start-1"),w(n,"class","contents"),this.first=n},m(g,p){N(g,n,p),k(n,t),k(t,s),A(o,s,null),k(n,a);for(let h=0;h<u.length;h+=1)u[h].m(n,null);k(n,r),i=!0},p(g,p){e=g;const h={};if(p&8198&&(h.$$scope={dirty:p,ctx:e}),o.$set(h),p&6){f=e[7].sets;let d;for(d=0;d<f.length;d+=1){const c=me(e,f,d);u[d]?(u[d].p(c,p),D(u[d],1)):(u[d]=ge(c),u[d].c(),D(u[d],1),u[d].m(n,r))}for(q(),d=f.length;d<u.length;d+=1)_(d);z()}},i(g){if(!i){D(o.$$.fragment,g);for(let p=0;p<f.length;p+=1)D(u[p]);i=!0}},o(g){E(o.$$.fragment,g),u=u.filter(Boolean);for(let p=0;p<u.length;p+=1)E(u[p]);i=!1},d(g){g&&b(n),x(o),se(u,g)}}}function at(l){let e=[],n=new Map,t,s,o=l[1].getDefined(l[2]).exercises;const a=r=>r[7];for(let r=0;r<o.length;r+=1){let i=_e(l,o,r),f=a(i);n.set(f,e[r]=$e(f,i))}return{c(){for(let r=0;r<e.length;r+=1)e[r].c();t=J()},l(r){for(let i=0;i<e.length;i+=1)e[i].l(r);t=J()},m(r,i){for(let f=0;f<e.length;f+=1)e[f].m(r,i);N(r,t,i),s=!0},p(r,i){i&6&&(o=r[1].getDefined(r[2]).exercises,q(),e=Oe(e,i,a,1,r,o,n,t.parentNode,Ae,$e,t,_e),z())},i(r){if(!s){for(let i=0;i<o.length;i+=1)D(e[i]);s=!0}},o(r){for(let i=0;i<e.length;i+=1)E(e[i]);s=!1},d(r){for(let i=0;i<e.length;i+=1)e[i].d(r);r&&b(t)}}}function it(l){let e,n;return e=new Ie({props:{slot:"placeholderContent"}}),{c(){V(e.$$.fragment)},l(t){O(e.$$.fragment,t)},m(t,s){A(e,t,s),n=!0},p:te,i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){E(e.$$.fragment,t),n=!1},d(t){x(e,t)}}}function ct(l){let e,n,t;return n=new Q({props:{placeholderText:"Add exercise plan",elementClasses:{list:"w-min"},listItems:[...l[3].keys()],listFilter:X,$$slots:{placeholderContent:[it]},$$scope:{ctx:l}}}),n.$on("selected",l[5]),{c(){e=C("div"),V(n.$$.fragment),this.h()},l(s){e=T(s,"DIV",{slot:!0,class:!0});var o=y(e);O(n.$$.fragment,o),o.forEach(b),this.h()},h(){w(e,"slot","footer"),w(e,"class","col-start-1 pl-3 mt-2")},m(s,o){N(s,e,o),A(n,e,null),t=!0},p(s,o){const a={};o&8&&(a.listItems=[...s[3].keys()]),o&8192&&(a.$$scope={dirty:o,ctx:s}),n.$set(a)},i(s){t||(D(n.$$.fragment,s),t=!0)},o(s){E(n.$$.fragment,s),t=!1},d(s){s&&b(e),x(n)}}}function ut(l){let e,n;return e=new Re({props:{$$slots:{footer:[ct],body:[at],headerColumnOne:[st]},$$scope:{ctx:l}}}),{c(){V(e.$$.fragment)},l(t){O(e.$$.fragment,t)},m(t,s){A(e,t,s),n=!0},p(t,s){const o={};s&8207&&(o.$$scope={dirty:s,ctx:t}),e.$set(o)},i(t){n||(D(e.$$.fragment,t),n=!0)},o(t){E(e.$$.fragment,t),n=!1},d(t){x(e,t)}}}function ft(l){let e,n,t,s,o={};return e=new ke({props:o}),l[4](e),t=new Fe({props:{content:{redirectPlaceholder:"Set Analysis",redirectRef:"/analysis",heightTransitionMultiplier:l[1].getDefined(l[2]).exercises.length+2},$$slots:{"main-section":[ut],header:[lt]},$$scope:{ctx:l}}}),{c(){V(e.$$.fragment),n=M(),V(t.$$.fragment)},l(a){O(e.$$.fragment,a),n=B(a),O(t.$$.fragment,a)},m(a,r){A(e,a,r),N(a,n,r),A(t,a,r),s=!0},p(a,[r]){const i={};e.$set(i);const f={};r&6&&(f.content={redirectPlaceholder:"Set Analysis",redirectRef:"/analysis",heightTransitionMultiplier:a[1].getDefined(a[2]).exercises.length+2}),r&8207&&(f.$$scope={dirty:r,ctx:a}),t.$set(f)},i(a){s||(D(e.$$.fragment,a),D(t.$$.fragment,a),s=!0)},o(a){E(e.$$.fragment,a),E(t.$$.fragment,a),s=!1},d(a){l[4](null),x(e,a),a&&b(n),x(t,a)}}}function dt(l,e,n){let t,s,o;F(l,le,u=>n(1,t=u)),F(l,K,u=>n(2,s=u)),F(l,De,u=>n(3,o=u));let a;function r(u){G[u?"unshift":"push"](()=>{a=u,n(0,a)})}const i=u=>a.createExercisePlan(u.detail.selected);function f(u,_,g,p){g[p]=u,le.set(t)}return[a,t,s,o,r,i,f]}class _t extends Y{constructor(e){super(),Z(this,e,dt,ft,ee,{})}}export{_t as default};