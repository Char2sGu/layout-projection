"use strict";(self.webpackChunksite=self.webpackChunksite||[]).push([[721],{9721:(br,Be,b)=>{b.d(Be,{CP:()=>At,rG:()=>cr,kf:()=>lr,y3:()=>ur,DT:()=>dr,ng:()=>Ae,rE:()=>pr,BM:()=>fr});var l=b(5857);const k=new WeakMap;function Dt(t,e){return k.get(t)&&k.get(t).get(e)}function z(t,e,n){if(void 0===e)throw new TypeError;const r=Dt(e,n);return r&&r.get(t)}function Ft(t,e,n,r){if(r&&!["string","symbol"].includes(typeof r))throw new TypeError;(Dt(n,r)||function Le(t,e){const n=k.get(t)||new Map;k.set(t,n);const r=n.get(e)||new Map;return n.set(e,r),r}(n,r)).set(t,e)}function nt(t,e,n){return z(t,e,n)?z(t,e,n):Object.getPrototypeOf(e)?nt(t,Object.getPrototypeOf(e),n):void 0}Object.assign(Reflect,{decorate:function Ee(t,e,n,r){if(!Array.isArray(t)||0===t.length)throw new TypeError;return void 0!==n?function je(t,e,n,r){return t.reverse().forEach(s=>{r=s(e,n,r)||r}),r}(t,e,n,r):"function"==typeof e?function Oe(t,e){return t.reverse().forEach(n=>{const r=n(e);r&&(e=r)}),e}(t,e):void 0},defineMetadata:function $e(t,e,n,r){Ft(t,e,n,r)},getMetadata:function Ie(t,e,n){return nt(t,e,n)},getOwnMetadata:function Pe(t,e,n){return z(t,e,n)},hasMetadata:function Ze(t,e,n){return!!nt(t,e,n)},hasOwnMetadata:function Ce(t,e,n){return!!z(t,e,n)},metadata:function Ne(t,e){return function(r,s){Ft(t,e,r,s)}}});var p=b(5339);const G=t=>e=>1-t(1-e),rt=t=>e=>e<=.5?t(2*e)/2:(2-t(2*(1-e)))/2,Bt=t=>e=>e*e*((t+1)*e-t),Ot=t=>t,st=(2,e=>Math.pow(e,2)),Ve=G(st),V=rt(st),He=G(t=>1-Math.sin(Math.acos(t))),Et=(rt(He),Bt(1.525)),ot=(G(Et),rt(Et),Bt(1.525),t=>{if(1===t||0===t)return t;const e=t*t;return t<.36363636363636365?7.5625*e:t<.7272727272727273?9.075*e-9.9*t+3.4:t<.9?12.066481994459833*e-19.63545706371191*t+8.898060941828255:10.8*t*t-20.52*t+10.72});G(ot);var Lt=b(5163),Nt=function(){},H=function(){};const it=(t,e,n)=>Math.min(Math.max(n,t),e),at=.001,Ke=.01,It=10,Xe=.05,qe=1;const tn=12;function ct(t,e){return t*Math.sqrt(1-e*e)}const nn=["duration","bounce"],rn=["stiffness","damping","mass"];function Pt(t,e){return e.some(n=>void 0!==t[n])}function ut(t){var{from:e=0,to:n=1,restSpeed:r=2,restDelta:s}=t,i=(0,Lt._T)(t,["from","to","restSpeed","restDelta"]);const o={done:!1,value:e};let{stiffness:a,damping:c,mass:u,velocity:d,duration:f,isResolvedFromDuration:g}=function sn(t){let e=Object.assign({velocity:0,stiffness:100,damping:10,mass:1,isResolvedFromDuration:!1},t);if(!Pt(t,rn)&&Pt(t,nn)){const n=function _e({duration:t=800,bounce:e=.25,velocity:n=0,mass:r=1}){let s,i;Nt(t<=1e3*It,"Spring duration must be 10 seconds or less");let o=1-e;o=it(Xe,qe,o),t=it(Ke,It,t/1e3),o<1?(s=u=>{const d=u*o,f=d*t,g=d-n,S=ct(u,o),A=Math.exp(-f);return at-g/S*A},i=u=>{const f=u*o*t,g=f*n+n,S=Math.pow(o,2)*Math.pow(u,2)*t,A=Math.exp(-f),T=ct(Math.pow(u,2),o);return(-s(u)+at>0?-1:1)*((g-S)*A)/T}):(s=u=>Math.exp(-u*t)*((u-n)*t+1)-at,i=u=>Math.exp(-u*t)*(t*t*(n-u)));const c=function en(t,e,n){let r=n;for(let s=1;s<tn;s++)r-=t(r)/e(r);return r}(s,i,5/t);if(t*=1e3,isNaN(c))return{stiffness:100,damping:10,duration:t};{const u=Math.pow(c,2)*r;return{stiffness:u,damping:2*o*Math.sqrt(r*u),duration:t}}}(t);e=Object.assign(Object.assign(Object.assign({},e),n),{velocity:0,mass:1}),e.isResolvedFromDuration=!0}return e}(i),S=Ct,A=Ct;function T(){const M=d?-d/1e3:0,x=n-e,y=c/(2*Math.sqrt(a*u)),m=Math.sqrt(a/u)/1e3;if(void 0===s&&(s=Math.min(Math.abs(n-e)/100,.4)),y<1){const h=ct(m,y);S=v=>{const R=Math.exp(-y*m*v);return n-R*((M+y*m*x)/h*Math.sin(h*v)+x*Math.cos(h*v))},A=v=>{const R=Math.exp(-y*m*v);return y*m*R*(Math.sin(h*v)*(M+y*m*x)/h+x*Math.cos(h*v))-R*(Math.cos(h*v)*(M+y*m*x)-h*x*Math.sin(h*v))}}else if(1===y)S=h=>n-Math.exp(-m*h)*(x+(M+m*x)*h);else{const h=m*Math.sqrt(y*y-1);S=v=>{const R=Math.exp(-y*m*v),L=Math.min(h*v,300);return n-R*((M+y*m*x)*Math.sinh(L)+h*x*Math.cosh(L))/h}}}return T(),{next:M=>{const x=S(M);if(g)o.done=M>=f;else{const y=1e3*A(M),m=Math.abs(y)<=r,h=Math.abs(n-x)<=s;o.done=m&&h}return o.value=o.done?n:x,o},flipTarget:()=>{d=-d,[e,n]=[n,e],T()}}}ut.needsInterpolation=(t,e)=>"string"==typeof t||"string"==typeof e;const Ct=t=>0,Zt=(t,e,n)=>{const r=e-t;return 0===r?1:(n-t)/r},w=(t,e,n)=>-n*t+n*e+t,$t=(t,e)=>n=>Math.max(Math.min(n,e),t),N=t=>t%1?Number(t.toFixed(5)):t,W=/(-)?([\d]*\.?[\d])+/g,lt=/(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi,on=/^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;function I(t){return"string"==typeof t}const J={test:t=>"number"==typeof t,parse:parseFloat,transform:t=>t},Ut=Object.assign(Object.assign({},J),{transform:$t(0,1)}),dt=(Object.assign(Object.assign({},J),{default:1}),(t,e)=>n=>Boolean(I(n)&&on.test(n)&&n.startsWith(t)||e&&Object.prototype.hasOwnProperty.call(n,e))),Yt=(t,e,n)=>r=>{if(!I(r))return r;const[s,i,o,a]=r.match(W);return{[t]:parseFloat(s),[e]:parseFloat(i),[n]:parseFloat(o),alpha:void 0!==a?parseFloat(a):1}},an=$t(0,255),ft=Object.assign(Object.assign({},J),{transform:t=>Math.round(an(t))}),D={test:dt("rgb","red"),parse:Yt("red","green","blue"),transform:({red:t,green:e,blue:n,alpha:r=1})=>"rgba("+ft.transform(t)+", "+ft.transform(e)+", "+ft.transform(n)+", "+N(Ut.transform(r))+")"},pt={test:dt("#"),parse:function cn(t){let e="",n="",r="",s="";return t.length>5?(e=t.substr(1,2),n=t.substr(3,2),r=t.substr(5,2),s=t.substr(7,2)):(e=t.substr(1,1),n=t.substr(2,1),r=t.substr(3,1),s=t.substr(4,1),e+=e,n+=n,r+=r,s+=s),{red:parseInt(e,16),green:parseInt(n,16),blue:parseInt(r,16),alpha:s?parseInt(s,16)/255:1}},transform:D.transform},P=t=>({test:e=>I(e)&&e.endsWith(t)&&1===e.split(" ").length,parse:parseFloat,transform:e=>`${e}${t}`}),B=(P("deg"),P("%")),un=P("px"),F=(P("vh"),P("vw"),Object.assign(Object.assign({},B),{parse:t=>B.parse(t)/100,transform:t=>B.transform(100*t)}),{test:dt("hsl","hue"),parse:Yt("hue","saturation","lightness"),transform:({hue:t,saturation:e,lightness:n,alpha:r=1})=>"hsla("+Math.round(t)+", "+B.transform(N(e))+", "+B.transform(N(n))+", "+N(Ut.transform(r))+")"});function ht(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+6*(e-t)*n:n<.5?e:n<2/3?t+(e-t)*(2/3-n)*6:t}function kt({hue:t,saturation:e,lightness:n,alpha:r}){t/=360,n/=100;let s=0,i=0,o=0;if(e/=100){const a=n<.5?n*(1+e):n+e-n*e,c=2*n-a;s=ht(c,a,t+1/3),i=ht(c,a,t),o=ht(c,a,t-1/3)}else s=i=o=n;return{red:Math.round(255*s),green:Math.round(255*i),blue:Math.round(255*o),alpha:r}}const ln=(t,e,n)=>{const r=t*t;return Math.sqrt(Math.max(0,n*(e*e-r)+r))},dn=[pt,D,F],zt=t=>dn.find(e=>e.test(t)),Gt=t=>`'${t}' is not an animatable color. Use the equivalent color code instead.`,Vt=(t,e)=>{let n=zt(t),r=zt(e);H(!!n,Gt(t)),H(!!r,Gt(e));let s=n.parse(t),i=r.parse(e);n===F&&(s=kt(s),n=D),r===F&&(i=kt(i),r=D);const o=Object.assign({},s);return a=>{for(const c in o)"alpha"!==c&&(o[c]=ln(s[c],i[c],a));return o.alpha=w(s.alpha,i.alpha,a),n.transform(o)}},Q={test:t=>D.test(t)||pt.test(t)||F.test(t),parse:t=>D.test(t)?D.parse(t):F.test(t)?F.parse(t):pt.parse(t),transform:t=>I(t)?t:t.hasOwnProperty("red")?D.transform(t):F.transform(t)},Ht="${c}",Wt="${n}";function Jt(t){"number"==typeof t&&(t=`${t}`);const e=[];let n=0;const r=t.match(lt);r&&(n=r.length,t=t.replace(lt,Ht),e.push(...r.map(Q.parse)));const s=t.match(W);return s&&(t=t.replace(W,Wt),e.push(...s.map(J.parse))),{values:e,numColors:n,tokenised:t}}function Qt(t){return Jt(t).values}function Kt(t){const{values:e,numColors:n,tokenised:r}=Jt(t),s=e.length;return i=>{let o=r;for(let a=0;a<s;a++)o=o.replace(a<n?Ht:Wt,a<n?Q.transform(i[a]):N(i[a]));return o}}const pn=t=>"number"==typeof t?0:t,Xt={test:function fn(t){var e,n,r,s;return isNaN(t)&&I(t)&&(null!==(n=null===(e=t.match(W))||void 0===e?void 0:e.length)&&void 0!==n?n:0)+(null!==(s=null===(r=t.match(lt))||void 0===r?void 0:r.length)&&void 0!==s?s:0)>0},parse:Qt,createTransformer:Kt,getAnimatableNone:function hn(t){const e=Qt(t);return Kt(t)(e.map(pn))}},mn=t=>"number"==typeof t,gn=(t,e)=>n=>e(t(n)),qt=(...t)=>t.reduce(gn);function _t(t,e){return mn(t)?n=>w(t,e,n):Q.test(t)?Vt(t,e):ne(t,e)}const te=(t,e)=>{const n=[...t],r=n.length,s=t.map((i,o)=>_t(i,e[o]));return i=>{for(let o=0;o<r;o++)n[o]=s[o](i);return n}},yn=(t,e)=>{const n=Object.assign(Object.assign({},t),e),r={};for(const s in n)void 0!==t[s]&&void 0!==e[s]&&(r[s]=_t(t[s],e[s]));return s=>{for(const i in r)n[i]=r[i](s);return n}};function ee(t){const e=Xt.parse(t),n=e.length;let r=0,s=0,i=0;for(let o=0;o<n;o++)r||"number"==typeof e[o]?r++:void 0!==e[o].hue?i++:s++;return{parsed:e,numNumbers:r,numRGB:s,numHSL:i}}const ne=(t,e)=>{const n=Xt.createTransformer(e),r=ee(t),s=ee(e);return r.numHSL===s.numHSL&&r.numRGB===s.numRGB&&r.numNumbers>=s.numNumbers?qt(te(r.parsed,s.parsed),n):(Nt(!0,`Complex values '${t}' and '${e}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`),o=>`${o>0?e:t}`)},bn=(t,e)=>n=>w(t,e,n);function re(t,e,{clamp:n=!0,ease:r,mixer:s}={}){const i=t.length;H(i===e.length,"Both input and output ranges must be the same length"),H(!r||!Array.isArray(r)||r.length===i-1,"Array of easing functions must be of length `input.length - 1`, as it applies to the transitions **between** the defined values."),t[0]>t[i-1]&&(t=[].concat(t),e=[].concat(e),t.reverse(),e.reverse());const o=function vn(t,e,n){const r=[],s=n||function xn(t){return"number"==typeof t?bn:"string"==typeof t?Q.test(t)?Vt:ne:Array.isArray(t)?te:"object"==typeof t?yn:void 0}(t[0]),i=t.length-1;for(let o=0;o<i;o++){let a=s(t[o],t[o+1]);if(e){const c=Array.isArray(e)?e[o]:e;a=qt(c,a)}r.push(a)}return r}(e,r,s),a=2===i?function Mn([t,e],[n]){return r=>n(Zt(t,e,r))}(t,o):function Rn(t,e){const n=t.length,r=n-1;return s=>{let i=0,o=!1;if(s<=t[0]?o=!0:s>=t[r]&&(i=r-1,o=!0),!o){let c=1;for(;c<n&&!(t[c]>s||c===r);c++);i=c-1}const a=Zt(t[i],t[i+1],s);return e[i](a)}}(t,o);return n?c=>a(it(t[0],t[i-1],c)):a}function wn(t,e){return t.map(()=>e||V).splice(0,t.length-1)}function K({from:t=0,to:e=1,ease:n,offset:r,duration:s=300}){const i={done:!1,value:t},o=Array.isArray(e)?e:[t,e],a=function An(t,e){return t.map(n=>n*e)}(r&&r.length===o.length?r:function Sn(t){const e=t.length;return t.map((n,r)=>0!==r?r/(e-1):0)}(o),s);function c(){return re(a,o,{ease:Array.isArray(n)?n:wn(o,n)})}let u=c();return{next:d=>(i.value=u(d),i.done=d>=s,i),flipTarget:()=>{o.reverse(),u=c()}}}const se={keyframes:K,spring:ut,decay:function Tn({velocity:t=0,from:e=0,power:n=.8,timeConstant:r=350,restDelta:s=.5,modifyTarget:i}){const o={done:!1,value:e};let a=n*t;const c=e+a,u=void 0===i?c:i(c);return u!==c&&(a=u-e),{next:d=>{const f=-a*Math.exp(-d/r);return o.done=!(f>s||f<-s),o.value=o.done?u:u+f,o},flipTarget:()=>{}}}},oe=1/60*1e3,Fn=typeof performance<"u"?()=>performance.now():()=>Date.now(),ie=typeof window<"u"?t=>window.requestAnimationFrame(t):t=>setTimeout(()=>t(Fn()),oe);let mt=!0,C=!1,gt=!1;const j={delta:0,timestamp:0},Z=["read","update","preRender","render","postRender"],X=Z.reduce((t,e)=>(t[e]=function Bn(t){let e=[],n=[],r=0,s=!1,i=!1;const o=new WeakSet,a={schedule:(c,u=!1,d=!1)=>{const f=d&&s,g=f?e:n;return u&&o.add(c),-1===g.indexOf(c)&&(g.push(c),f&&s&&(r=e.length)),c},cancel:c=>{const u=n.indexOf(c);-1!==u&&n.splice(u,1),o.delete(c)},process:c=>{if(s)i=!0;else{if(s=!0,[e,n]=[n,e],n.length=0,r=e.length,r)for(let u=0;u<r;u++){const d=e[u];d(c),o.has(d)&&(a.schedule(d),t())}s=!1,i&&(i=!1,a.process(c))}}};return a}(()=>C=!0),t),{}),On=Z.reduce((t,e)=>{const n=X[e];return t[e]=(r,s=!1,i=!1)=>(C||Nn(),n.schedule(r,s,i)),t},{}),En=Z.reduce((t,e)=>(t[e]=X[e].cancel,t),{}),Ln=(Z.reduce((t,e)=>(t[e]=()=>X[e].process(j),t),{}),t=>X[t].process(j)),ae=t=>{C=!1,j.delta=mt?oe:Math.max(Math.min(t-j.timestamp,40),1),j.timestamp=t,gt=!0,Z.forEach(Ln),gt=!1,C&&(mt=!1,ie(ae))},Nn=()=>{C=!0,mt=!0,gt||ie(ae)},In=On;function ce(t,e,n=0){return t-e-n}const Zn=t=>{const e=({delta:n})=>t(n);return{start:()=>In.update(e,!0),stop:()=>En.update(e)}};function $n(t){var e,n,{from:r,autoplay:s=!0,driver:i=Zn,elapsed:o=0,repeat:a=0,repeatType:c="loop",repeatDelay:u=0,onPlay:d,onStop:f,onComplete:g,onRepeat:S,onUpdate:A}=t,T=(0,Lt._T)(t,["from","autoplay","driver","elapsed","repeat","repeatType","repeatDelay","onPlay","onStop","onComplete","onRepeat","onUpdate"]);let x,h,L,{to:M}=T,y=0,m=T.duration,v=!1,R=!0;const Te=function Dn(t){if(Array.isArray(t.to))return K;if(se[t.type])return se[t.type];const e=new Set(Object.keys(t));return e.has("ease")||e.has("duration")&&!e.has("dampingRatio")?K:e.has("dampingRatio")||e.has("stiffness")||e.has("mass")||e.has("damping")||e.has("restSpeed")||e.has("restDelta")?ut:K}(T);null!==(n=(e=Te).needsInterpolation)&&void 0!==n&&n.call(e,r,M)&&(L=re([0,100],[r,M],{clamp:!1}),r=0,M=100);const De=Te(Object.assign(Object.assign({},T),{from:r,to:M}));function gr(Tt){if(R||(Tt=-Tt),o+=Tt,!v){const Fe=De.next(Math.max(0,o));h=Fe.value,L&&(h=L(h)),v=R?Fe.done:o<=0}A?.(h),v&&(0===y&&(m??(m=o)),y<a?function Cn(t,e,n,r){return r?t>=e+n:t<=-n}(o,m,u,R)&&function hr(){y++,"reverse"===c?(R=y%2==0,o=function Pn(t,e,n=0,r=!0){return r?ce(e+-t,e,n):e-(t-e)+n}(o,m,u,R)):(o=ce(o,m,u),"mirror"===c&&De.flipTarget()),v=!1,S&&S()}():function mr(){x.stop(),g&&g()}())}return s&&function yr(){d?.(),x=i(gr),x.start()}(),{stop:()=>{f?.(),x.stop()}}}class q{constructor(e){(0,p.Z)(this,"top",void 0),(0,p.Z)(this,"left",void 0),(0,p.Z)(this,"right",void 0),(0,p.Z)(this,"bottom",void 0),this.top=e.top,this.left=e.left,this.right=e.right,this.bottom=e.bottom}width(){return this.right-this.left}height(){return this.bottom-this.top}midpoint(){return{x:w(this.left,this.right,.5),y:w(this.top,this.bottom,.5)}}}class ue{constructor(e){(0,p.Z)(this,"origin",void 0),(0,p.Z)(this,"scale",void 0),(0,p.Z)(this,"translate",void 0),this.origin=e.origin,this.scale=e.scale,this.translate=e.translate}apply(e){return this.origin+(e-this.origin)*this.scale+this.translate}}class yt{constructor(){(0,p.Z)(this,"records",new WeakMap)}animate(e,n){let r;this.records.get(e)?.stop();const s=new Promise(o=>{const{duration:a,easing:c,route:u}=n,d=f=>this.animateFrame(e,u,f);d(0),r=$n({from:0,to:1,duration:a,ease:c,onUpdate:d,onComplete:()=>o(),onStop:o}).stop}),i=new Yn(e,s,()=>r());return this.records.set(e,i),i}animateFrame(e,n,r){const s=this.calculateBoundingBox(n,r),i=this.calculateBorderRadiuses(n,r);e.borderRadiuses=i,e.project(s)}calculateBoundingBox(e,n){const r=e.boundingBoxFrom,s=e.boundingBoxTo;return new q({top:w(r.top,s.top,n),left:w(r.left,s.left,n),right:w(r.right,s.right,n),bottom:w(r.bottom,s.bottom,n)})}calculateBorderRadiuses(e,n){const r=e.borderRadiusesFrom,s=e.borderRadiusesTo,i=(o,a,c)=>({x:w(o.x,a.x,c),y:w(o.y,a.y,c)});return{topLeft:i(r.topLeft,s.topLeft,n),topRight:i(r.topRight,s.topRight,n),bottomLeft:i(r.bottomLeft,s.bottomLeft,n),bottomRight:i(r.bottomRight,s.bottomRight,n)}}}class bt{constructor(e){(0,p.Z)(this,"engine",void 0),(0,p.Z)(this,"records",new WeakMap),this.engine=e}animate(e,n){this.records.get(e)?.stop();const{duration:r,easing:s,routes:i}=n,o=[];e.traverse(c=>{const u=i.get(c.id);if(!u)throw new Error("Unknown node");const f=this.engine.animate(c,{duration:r,easing:s,route:u});o.push(f)},{includeSelf:!0});const a=new kn(e,o);return this.records.set(e,a),a}}class Un extends Map{}class xt{constructor(e,n){(0,p.Z)(this,"promise",void 0),(0,p.Z)(this,"stopper",void 0),this.promise=e,this.stopper=n}then(e,n){return this.promise.then(e,n)}stop(){this.stopper()}}class Yn extends xt{constructor(e,n,r){super(n,r),(0,p.Z)(this,"node",void 0),this.node=e}}class kn extends xt{constructor(e,n){super(Promise.all(n),()=>n.forEach(r=>r.stop())),(0,p.Z)(this,"root",void 0),this.root=e}}class vt{constructor(e,n,r){(0,p.Z)(this,"engine",void 0),(0,p.Z)(this,"measurer",void 0),(0,p.Z)(this,"easingParser",void 0),this.engine=e,this.measurer=n,this.easingParser=r}animate(e){const{root:n,from:r,estimation:s=!1}=e;"string"==typeof e.easing&&(e.easing=this.easingParser.parse(e.easing));const{duration:i=225,easing:o=V}=e;this.initialize(n);const a=this.getAnimationRouteMap(n,r,s),c=this.engine.animate(n,{duration:i,easing:o,routes:a});return c.then(()=>{n.traverse(u=>u.reset(),{includeSelf:!0})}),c}initialize(e){e.traverse(n=>n.reset(),{includeSelf:!0}),e.traverse(n=>n.measure(),{includeSelf:!0})}getAnimationRouteMap(e,n,r){const s=new Un;return e.traverse(i=>{if(!i.measured())throw new Error("Unknown node");const o=n.get(i.id);if(s.has(i.id)&&i.element===o?.element)return;const a=o?.boundingBox||r&&this.estimateStartingBoundingBox(e,i,n)||i.boundingBox;s.set(i.id,{boundingBoxFrom:a,boundingBoxTo:i.boundingBox,borderRadiusesFrom:o?.borderRadiuses??i.borderRadiuses,borderRadiusesTo:i.borderRadiuses})},{includeSelf:!0}),s}estimateStartingBoundingBox(e,n,r){if(!n.measured())throw new Error("Unknown node");let i,s=n;for(;void 0===(i=r.get(s.id));){if(s===e||!s.parent)return;s=s.parent}if(!s.measured())throw new Error("Unknown ancestor");const a=s.calculateTransform(i.boundingBox).x.scale;return new q({top:i.boundingBox.top-(s.boundingBox.top-n.boundingBox.top)*a,left:i.boundingBox.left-(s.boundingBox.left-n.boundingBox.left)*a,right:i.boundingBox.right-(s.boundingBox.right-n.boundingBox.right)*a,bottom:i.boundingBox.top-(s.boundingBox.top-n.boundingBox.bottom)*a})}}const le=(t,e)=>1-3*e+3*t,de=(t,e)=>3*e-6*t,fe=t=>3*t,_=(t,e,n)=>((le(e,n)*t+de(e,n))*t+fe(e))*t,pe=(t,e,n)=>3*le(e,n)*t*t+2*de(e,n)*t+fe(e),zn=1e-7,Gn=10,Hn=8,Wn=.001,tt=11,et=1/(tt-1);function Qn(t,e,n,r){if(t===e&&n===r)return Ot;const s=new Float32Array(tt);for(let o=0;o<tt;++o)s[o]=_(o*et,t,n);return o=>0===o||1===o?o:_(function i(o){let a=0,c=1;const u=tt-1;for(;c!==u&&s[c]<=o;++c)a+=et;--c;const f=a+(o-s[c])/(s[c+1]-s[c])*et,g=pe(f,t,n);return g>=Wn?function Jn(t,e,n,r){for(let s=0;s<Hn;++s){const i=pe(e,n,r);if(0===i)return e;e-=(_(e,n,r)-t)/i}return e}(o,f,t,n):0===g?f:function Vn(t,e,n,r,s){let i,o,a=0;do{o=e+(n-e)/2,i=_(o,r,s)-t,i>0?n=o:e=o}while(Math.abs(i)>zn&&++a<Gn);return o}(o,a,a+et,t,n)}(o),e,r)}class Mt{parse(e,n,r){if(e.match(/\d.*?px \d.*?px/u)){const[s,i]=e.split(" ").map(o=>parseFloat(o));return{x:s,y:i}}if(B.test(e)){const s=parseFloat(e)/100;return{x:s*n,y:s*r}}if(un.test(e)){const s=parseFloat(e);return{x:s,y:s}}throw new Error(`Unsupported radius: ${e}`)}}class Rt{parse(e){if("linear"===e)return Ot;if("ease"===e)return V;if("ease-in"===e)return st;if("ease-out"===e)return Ve;if("ease-in-out"===e)return V;if(e.startsWith("cubic-bezier")){const[n,r,s,i]=e.replace("cubic-bezier(","").replace(")","").split(",").map(o=>parseFloat(o));return Qn(n,r,s,i)}throw new Error(`Unsupported easing string: ${e}`)}}class ${constructor(e){(0,p.Z)(this,"borderRadiusParser",void 0),this.borderRadiusParser=e}measureBoundingBox(e){return new q(e.getBoundingClientRect())}measureBorderRadiuses(e,n=this.measureBoundingBox(e)){const r=getComputedStyle(e),s=i=>this.borderRadiusParser.parse(i,n.width(),n.height());return{topLeft:s(r.borderTopLeftRadius),topRight:s(r.borderTopRightRadius),bottomLeft:s(r.borderBottomLeftRadius),bottomRight:s(r.borderBottomRightRadius)}}}let O=(()=>{class t{constructor(n,r){(0,p.Z)(this,"element",void 0),(0,p.Z)(this,"measurer",void 0),(0,p.Z)(this,"id","anonymous-"+t.idNext++),(0,p.Z)(this,"activated",!0),(0,p.Z)(this,"parent",void 0),(0,p.Z)(this,"children",new Set),(0,p.Z)(this,"boundingBox",void 0),(0,p.Z)(this,"borderRadiuses",void 0),(0,p.Z)(this,"transform",void 0),this.element=n,this.measurer=r}identifyAs(n){this.id=n}activate(){this.activated=!0}deactivate(){this.activated=!1}attach(n){this.parent=n,n.children.add(this)}detach(){if(!this.parent)throw new Error("Missing parent");this.parent.children.delete(this),this.parent=void 0}traverse(n,r={}){r.includeSelf??=!1,r.includeDeactivated??=!1,r.includeSelf&&n(this),this.children.forEach(s=>{!r.includeDeactivated&&!s.activated||s.traverse(n,{...r,includeSelf:!0})})}track(){const n=[];let r=this.parent;for(;r;)n.unshift(r),r=r.parent;return n}reset(){this.transform=void 0,this.element.style.transform="",this.element.style.borderRadius=""}measure(){this.boundingBox=this.measurer.measureBoundingBox(this.element),this.borderRadiuses=this.measurer.measureBorderRadiuses(this.element,this.boundingBox)}measured(){return!!this.boundingBox&&!!this.borderRadiuses}project(n){if(!this.measured())throw new Error("Node not measured");this.transform=this.calculateTransform(n);const r={x:1,y:1},s=this.track();for(const g of s)g.transform&&(r.x*=g.transform.x.scale,r.y*=g.transform.y.scale);const i=this.element.style,o=this.transform;i.transform=[`translate3d(${o.x.translate/r.x}px, ${o.y.translate/r.y}px, 0)`,`scale(${o.x.scale}, ${o.y.scale})`].join(" ");const u_x=r.x*this.transform.x.scale,u_y=r.y*this.transform.y.scale,d=this.borderRadiuses,f=g=>`${g.x/u_x}px ${g.y/u_y}px`;i.borderTopLeftRadius=f(d.topLeft),i.borderTopRightRadius=f(d.topRight),i.borderBottomLeftRadius=f(d.bottomLeft),i.borderBottomRightRadius=f(d.bottomRight)}calculateTransform(n){const r=this.calculateTransformedBoundingBox(),s=r.midpoint(),i=n.midpoint(),o={x:new ue({origin:s.x,scale:n.width()/r.width(),translate:i.x-s.x}),y:new ue({origin:s.y,scale:n.height()/r.height(),translate:i.y-s.y})};return isNaN(o.x.scale)&&(o.x.scale=1),isNaN(o.y.scale)&&(o.y.scale=1),o}calculateTransformedBoundingBox(){if(!this.measured())throw new Error("Node not measured");let n=this.boundingBox;for(const r of this.track()){if(!r.boundingBox||!r.transform)continue;const s=r.transform;n=new q({top:s.y.apply(n.top),left:s.x.apply(n.left),right:s.x.apply(n.right),bottom:s.y.apply(n.bottom)})}return n}}return(0,p.Z)(t,"idNext",1),t})();class wt{constructor(e){(0,p.Z)(this,"measurer",void 0),this.measurer=e}snapshot(e){const n=this.measurer.measureBoundingBox(e.element),r=this.measurer.measureBorderRadiuses(e.element,n);return{element:e.element,boundingBox:n,borderRadiuses:r}}snapshotTree(e,n){const r=new E,s=new Set;return e.traverse(i=>{if(!n||n(i)){if(s.has(i.id))throw new Error(`Node ID conflict: "${i.id}"`);s.add(i.id),r.set(i.id,this.snapshot(i))}},{includeSelf:!0}),r}}class E extends Map{merge(e){for(const[n,r]of e)this.set(n,r)}}var he=b(4885),Kn=b(8105),me=b(7612),Xn=b(3970),qn=b(2170),ge=b(2077),ye=b(3205),_n=b(9930),be=b(1368);function xe(t,e){return e?n=>n.pipe(xe((r,s)=>(0,ye.Xf)(t(r,s)).pipe((0,ge.U)((i,o)=>e(r,i,s,o))))):(0,_n.e)((n,r)=>{let s=0,i=null,o=!1;n.subscribe((0,be.x)(r,a=>{i||(i=(0,be.x)(r,void 0,()=>{i=null,o&&r.complete()}),(0,ye.Xf)(t(a,s++)).subscribe(i))},()=>{o=!0,!i&&r.complete()}))})}var tr=b(3273);function er(){return xe(tr.y)}var nr=b(7114),St=b(4291),rr=b(6469);const ve={now:()=>(ve.delegate||performance).now(),delegate:void 0};var Me=b(555);function Re(t){return new he.y(e=>{const n=t||ve,r=n.now();let s=0;const i=()=>{e.closed||(s=Me.l.requestAnimationFrame(o=>{s=0;const a=n.now();e.next({timestamp:t?a:o,elapsed:a-r}),i()}))};return i(),()=>{s&&Me.l.cancelAnimationFrame(s)}})}const or=Re();var ir=b(2314);class ar{constructor(e,n){this.map=e,this.secondsBeforeDeletion=n,this.timeouts=new Map}stale(e){const n=setTimeout(()=>this.performDeletion(e),1e3*this.secondsBeforeDeletion);this.timeouts.set(e,n)}refresh(e){const n=this.timeouts.get(e);clearTimeout(n),this.timeouts.delete(e)}performDeletion(e){this.map.delete(e),this.timeouts.delete(e)}}class U extends Set{}class Y extends Set{}let we=(()=>{class t{constructor(n,r,s){this.nodeRegistry=n,this.entryRegistry=r,this.snapshots=s}}return t.\u0275fac=function(n){return new(n||t)(l.LFG(U),l.LFG(Y),l.LFG(E))},t.\u0275prov=l.Yz7({token:t,factory:t.\u0275fac}),t})(),Se=(()=>{class t extends ar{constructor(n){super(n,10)}}return t.\u0275fac=function(n){return new(n||t)(l.LFG(E))},t.\u0275prov=l.Yz7({token:t,factory:t.\u0275fac}),t})(),At=(()=>{class t{set lpjAnimation(n){"string"!=typeof n&&(this.config=n)}constructor(n,r,s,i,o){this.node=n,this.animator=r,this.snapper=s,this.snapshots=i,this.nodeRegistry=o,this.config={}}snapshot(){const n=this.nodeRegistry?.has.bind(this.nodeRegistry),r=this.snapper.snapshotTree(this.node,n);this.snapshots.merge(r)}animate(){if(!this.snapshots)throw new Error("Missing snapshots");return this.animator.animate({root:this.node,from:this.snapshots,...this.config})}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(O,2),l.Y36(vt),l.Y36(wt),l.Y36(E),l.Y36(U,8))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjNode","","lpjAnimation",""]],inputs:{lpjAnimation:"lpjAnimation"},exportAs:["lpjAnimation"]}),t})(),cr=(()=>{class t{set lpjAnimationScope(n){""!==n&&(this.source=n)}constructor(n,r){this.templateRef=n,this.viewContainer=r}ngOnInit(){const n=this.createInjector(),r=n.get(we);this.viewContainer.createEmbeddedView(this.templateRef,{$implicit:r},{injector:n})}createInjector(){const{nodeRegistry:n=new U,entryRegistry:r=new Y,snapshots:s=new E}=this.source??{};return l.zs3.create({providers:[{provide:we},{provide:U,useValue:n},{provide:Y,useValue:r},{provide:E,useValue:s},{provide:Se}]})}static ngTemplateContextGuard(n,r){return!0}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(l.Rgc),l.Y36(l.s_b))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjAnimationScope",""]],inputs:{lpjAnimationScope:"lpjAnimationScope"}}),t})(),ur=(()=>{class t{constructor(n,r,s){this.node=n,this.registry=r,this.snapshots=s}ngOnInit(){this.registry?.add(this.node),this.snapshots?.refresh(this.node.id)}ngOnDestroy(){this.registry?.delete(this.node),this.snapshots?.stale(this.node.id)}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(O,2),l.Y36(U,8),l.Y36(Se,8))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjNode",""]]}),t})(),lr=(()=>{class t{constructor(n,r){this.entry=n,this.registry=r}ngOnInit(){this.registry?.add(this.entry)}ngOnDestroy(){this.registry?.delete(this.entry)}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(At,2),l.Y36(Y,8))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjAnimation",""]]}),t})(),Ae=(()=>{class t{set lpjAnimationTrigger(n){const r=n instanceof he.y?n.pipe((0,Kn.O)((0,me.of)(n))):(0,me.of)(n);this.trigger$.next(r)}set lpjAnimationTriggerFor(n){const r=s=>s instanceof O?s.id:s;this.targetIds=n instanceof Array?n.map(r):[r(n)]}constructor(n){this.entryRegistry=n,this.trigger$=new Xn.X(qn.E),this.targetIds=[],this.animationTrigger=new l.vpe,this.animationSettle=new l.vpe}ngOnInit(){this.trigger$.pipe(er(),(0,nr.T)(1),(0,St.b)(()=>this.animationTrigger.emit()),(0,St.b)(()=>this.snapshot()),(0,rr.w)(()=>function sr(t){return t?Re(t):or}().pipe((0,ir.P)())),(0,ge.U)(()=>this.animate()),(0,St.b)(n=>n.then(()=>this.animationSettle.emit()))).subscribe()}snapshot(){this.findTargets().forEach(n=>n.snapshot())}animate(){const n=this.findTargets().map(r=>r.animate());return new xt(Promise.all(n),()=>n.forEach(r=>r.stop()))}findTargets(){const n=Array.from(this.entryRegistry).filter(r=>this.targetIds.includes(r.node.id));if(!n.length)throw new Error("Failed to find any target entry");return n}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(Y))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjAnimationTrigger",""]],inputs:{lpjAnimationTrigger:"lpjAnimationTrigger",lpjAnimationTriggerFor:"lpjAnimationTriggerFor"},outputs:{animationTrigger:"animationTrigger",animationSettle:"animationSettle"}}),t})(),dr=(()=>{class t{constructor(n,r){r.lpjAnimationTriggerFor=n.node}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(At,2),l.Y36(Ae,2))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjAnimation","","lpjAnimationTrigger",""]]}),t})(),fr=(()=>{class t extends O{set lpjNode(n){"string"==typeof n?(n&&this.identifyAs(n),this.activate()):this.deactivate()}constructor(n,r,s){super(n.nativeElement,r),s&&this.attach(s)}ngOnDestroy(){this.parent&&this.detach()}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(l.SBq),l.Y36($),l.Y36(O,12))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjNode",""]],inputs:{lpjNode:"lpjNode"},exportAs:["lpjNode"],features:[l._Bn([{provide:O,useExisting:t}]),l.qOj]}),t})(),pr=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=l.oAB({type:t}),t.\u0275inj=l.cJS({providers:[{provide:vt,useFactory:()=>new vt((0,l.f3M)(bt),(0,l.f3M)($),(0,l.f3M)(Rt))},{provide:yt,useFactory:()=>new yt},{provide:bt,useFactory:()=>new bt((0,l.f3M)(yt))},{provide:$,useFactory:()=>new $((0,l.f3M)(Mt))},{provide:wt,useFactory:()=>new wt((0,l.f3M)($))},{provide:Mt,useFactory:()=>new Mt},{provide:Rt,useFactory:()=>new Rt}]}),t})()}}]);