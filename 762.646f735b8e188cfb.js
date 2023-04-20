"use strict";(self.webpackChunksite=self.webpackChunksite||[]).push([[762],{6762:(ss,Se,b)=>{b.d(Se,{CP:()=>Mt,rG:()=>Wn,kf:()=>Jn,y3:()=>Kn,DT:()=>Qn,ng:()=>ve,rE:()=>qn,BM:()=>Xn});var l=b(5857),p=b(5339);const k=t=>e=>1-t(1-e),tt=t=>e=>e<=.5?t(2*e)/2:(2-t(2*(1-e)))/2,St=t=>e=>e*e*((t+1)*e-t),Tt=t=>t,et=(2,e=>Math.pow(e,2)),je=k(et),z=tt(et),Ee=k(t=>1-Math.sin(Math.acos(t))),Dt=(tt(Ee),St(1.525)),nt=(k(Dt),tt(Dt),St(1.525),t=>{if(1===t||0===t)return t;const e=t*t;return t<.36363636363636365?7.5625*e:t<.7272727272727273?9.075*e-9.9*t+3.4:t<.9?12.066481994459833*e-19.63545706371191*t+8.898060941828255:10.8*t*t-20.52*t+10.72});k(nt);var Ft=b(5163),Bt=function(){},V=function(){};const st=(t,e,n)=>Math.min(Math.max(n,t),e),rt=.001,Ie=.01,jt=10,Pe=.05,Ce=1;const $e=12;function ot(t,e){return t*Math.sqrt(1-e*e)}const Ye=["duration","bounce"],ke=["stiffness","damping","mass"];function Et(t,e){return e.some(n=>void 0!==t[n])}function it(t){var{from:e=0,to:n=1,restSpeed:s=2,restDelta:r}=t,i=(0,Ft._T)(t,["from","to","restSpeed","restDelta"]);const o={done:!1,value:e};let{stiffness:a,damping:c,mass:u,velocity:d,duration:f,isResolvedFromDuration:g}=function ze(t){let e=Object.assign({velocity:0,stiffness:100,damping:10,mass:1,isResolvedFromDuration:!1},t);if(!Et(t,ke)&&Et(t,Ye)){const n=function Ze({duration:t=800,bounce:e=.25,velocity:n=0,mass:s=1}){let r,i;Bt(t<=1e3*jt,"Spring duration must be 10 seconds or less");let o=1-e;o=st(Pe,Ce,o),t=st(Ie,jt,t/1e3),o<1?(r=u=>{const d=u*o,f=d*t,g=d-n,S=ot(u,o),A=Math.exp(-f);return rt-g/S*A},i=u=>{const f=u*o*t,g=f*n+n,S=Math.pow(o,2)*Math.pow(u,2)*t,A=Math.exp(-f),T=ot(Math.pow(u,2),o);return(-r(u)+rt>0?-1:1)*((g-S)*A)/T}):(r=u=>Math.exp(-u*t)*((u-n)*t+1)-rt,i=u=>Math.exp(-u*t)*(t*t*(n-u)));const c=function Ue(t,e,n){let s=n;for(let r=1;r<$e;r++)s-=t(s)/e(s);return s}(r,i,5/t);if(t*=1e3,isNaN(c))return{stiffness:100,damping:10,duration:t};{const u=Math.pow(c,2)*s;return{stiffness:u,damping:2*o*Math.sqrt(s*u),duration:t}}}(t);e=Object.assign(Object.assign(Object.assign({},e),n),{velocity:0,mass:1}),e.isResolvedFromDuration=!0}return e}(i),S=Ot,A=Ot;function T(){const R=d?-d/1e3:0,x=n-e,y=c/(2*Math.sqrt(a*u)),m=Math.sqrt(a/u)/1e3;if(void 0===r&&(r=Math.min(Math.abs(n-e)/100,.4)),y<1){const h=ot(m,y);S=v=>{const M=Math.exp(-y*m*v);return n-M*((R+y*m*x)/h*Math.sin(h*v)+x*Math.cos(h*v))},A=v=>{const M=Math.exp(-y*m*v);return y*m*M*(Math.sin(h*v)*(R+y*m*x)/h+x*Math.cos(h*v))-M*(Math.cos(h*v)*(R+y*m*x)-h*x*Math.sin(h*v))}}else if(1===y)S=h=>n-Math.exp(-m*h)*(x+(R+m*x)*h);else{const h=m*Math.sqrt(y*y-1);S=v=>{const M=Math.exp(-y*m*v),L=Math.min(h*v,300);return n-M*((R+y*m*x)*Math.sinh(L)+h*x*Math.cosh(L))/h}}}return T(),{next:R=>{const x=S(R);if(g)o.done=R>=f;else{const y=1e3*A(R),m=Math.abs(y)<=s,h=Math.abs(n-x)<=r;o.done=m&&h}return o.value=o.done?n:x,o},flipTarget:()=>{d=-d,[e,n]=[n,e],T()}}}it.needsInterpolation=(t,e)=>"string"==typeof t||"string"==typeof e;const Ot=t=>0,Lt=(t,e,n)=>{const s=e-t;return 0===s?1:(n-t)/s},w=(t,e,n)=>-n*t+n*e+t,Nt=(t,e)=>n=>Math.max(Math.min(n,e),t),N=t=>t%1?Number(t.toFixed(5)):t,G=/(-)?([\d]*\.?[\d])+/g,at=/(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi,Ve=/^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;function I(t){return"string"==typeof t}const H={test:t=>"number"==typeof t,parse:parseFloat,transform:t=>t},It=Object.assign(Object.assign({},H),{transform:Nt(0,1)}),ct=(Object.assign(Object.assign({},H),{default:1}),(t,e)=>n=>Boolean(I(n)&&Ve.test(n)&&n.startsWith(t)||e&&Object.prototype.hasOwnProperty.call(n,e))),Pt=(t,e,n)=>s=>{if(!I(s))return s;const[r,i,o,a]=s.match(G);return{[t]:parseFloat(r),[e]:parseFloat(i),[n]:parseFloat(o),alpha:void 0!==a?parseFloat(a):1}},Ge=Nt(0,255),ut=Object.assign(Object.assign({},H),{transform:t=>Math.round(Ge(t))}),D={test:ct("rgb","red"),parse:Pt("red","green","blue"),transform:({red:t,green:e,blue:n,alpha:s=1})=>"rgba("+ut.transform(t)+", "+ut.transform(e)+", "+ut.transform(n)+", "+N(It.transform(s))+")"},lt={test:ct("#"),parse:function He(t){let e="",n="",s="",r="";return t.length>5?(e=t.substr(1,2),n=t.substr(3,2),s=t.substr(5,2),r=t.substr(7,2)):(e=t.substr(1,1),n=t.substr(2,1),s=t.substr(3,1),r=t.substr(4,1),e+=e,n+=n,s+=s,r+=r),{red:parseInt(e,16),green:parseInt(n,16),blue:parseInt(s,16),alpha:r?parseInt(r,16)/255:1}},transform:D.transform},P=t=>({test:e=>I(e)&&e.endsWith(t)&&1===e.split(" ").length,parse:parseFloat,transform:e=>`${e}${t}`}),B=(P("deg"),P("%")),We=P("px"),F=(P("vh"),P("vw"),Object.assign(Object.assign({},B),{parse:t=>B.parse(t)/100,transform:t=>B.transform(100*t)}),{test:ct("hsl","hue"),parse:Pt("hue","saturation","lightness"),transform:({hue:t,saturation:e,lightness:n,alpha:s=1})=>"hsla("+Math.round(t)+", "+B.transform(N(e))+", "+B.transform(N(n))+", "+N(It.transform(s))+")"});function dt(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+6*(e-t)*n:n<.5?e:n<2/3?t+(e-t)*(2/3-n)*6:t}function Ct({hue:t,saturation:e,lightness:n,alpha:s}){t/=360,n/=100;let r=0,i=0,o=0;if(e/=100){const a=n<.5?n*(1+e):n+e-n*e,c=2*n-a;r=dt(c,a,t+1/3),i=dt(c,a,t),o=dt(c,a,t-1/3)}else r=i=o=n;return{red:Math.round(255*r),green:Math.round(255*i),blue:Math.round(255*o),alpha:s}}const Ke=(t,e,n)=>{const s=t*t;return Math.sqrt(Math.max(0,n*(e*e-s)+s))},Je=[lt,D,F],Zt=t=>Je.find(e=>e.test(t)),$t=t=>`'${t}' is not an animatable color. Use the equivalent color code instead.`,Ut=(t,e)=>{let n=Zt(t),s=Zt(e);V(!!n,$t(t)),V(!!s,$t(e));let r=n.parse(t),i=s.parse(e);n===F&&(r=Ct(r),n=D),s===F&&(i=Ct(i),s=D);const o=Object.assign({},r);return a=>{for(const c in o)"alpha"!==c&&(o[c]=Ke(r[c],i[c],a));return o.alpha=w(r.alpha,i.alpha,a),n.transform(o)}},W={test:t=>D.test(t)||lt.test(t)||F.test(t),parse:t=>D.test(t)?D.parse(t):F.test(t)?F.parse(t):lt.parse(t),transform:t=>I(t)?t:t.hasOwnProperty("red")?D.transform(t):F.transform(t)},Yt="${c}",kt="${n}";function zt(t){"number"==typeof t&&(t=`${t}`);const e=[];let n=0;const s=t.match(at);s&&(n=s.length,t=t.replace(at,Yt),e.push(...s.map(W.parse)));const r=t.match(G);return r&&(t=t.replace(G,kt),e.push(...r.map(H.parse))),{values:e,numColors:n,tokenised:t}}function Vt(t){return zt(t).values}function Gt(t){const{values:e,numColors:n,tokenised:s}=zt(t),r=e.length;return i=>{let o=s;for(let a=0;a<r;a++)o=o.replace(a<n?Yt:kt,a<n?W.transform(i[a]):N(i[a]));return o}}const Xe=t=>"number"==typeof t?0:t,Ht={test:function Qe(t){var e,n,s,r;return isNaN(t)&&I(t)&&(null!==(n=null===(e=t.match(G))||void 0===e?void 0:e.length)&&void 0!==n?n:0)+(null!==(r=null===(s=t.match(at))||void 0===s?void 0:s.length)&&void 0!==r?r:0)>0},parse:Vt,createTransformer:Gt,getAnimatableNone:function qe(t){const e=Vt(t);return Gt(t)(e.map(Xe))}},_e=t=>"number"==typeof t,tn=(t,e)=>n=>e(t(n)),Wt=(...t)=>t.reduce(tn);function Kt(t,e){return _e(t)?n=>w(t,e,n):W.test(t)?Ut(t,e):Xt(t,e)}const Jt=(t,e)=>{const n=[...t],s=n.length,r=t.map((i,o)=>Kt(i,e[o]));return i=>{for(let o=0;o<s;o++)n[o]=r[o](i);return n}},en=(t,e)=>{const n=Object.assign(Object.assign({},t),e),s={};for(const r in n)void 0!==t[r]&&void 0!==e[r]&&(s[r]=Kt(t[r],e[r]));return r=>{for(const i in s)n[i]=s[i](r);return n}};function Qt(t){const e=Ht.parse(t),n=e.length;let s=0,r=0,i=0;for(let o=0;o<n;o++)s||"number"==typeof e[o]?s++:void 0!==e[o].hue?i++:r++;return{parsed:e,numNumbers:s,numRGB:r,numHSL:i}}const Xt=(t,e)=>{const n=Ht.createTransformer(e),s=Qt(t),r=Qt(e);return s.numHSL===r.numHSL&&s.numRGB===r.numRGB&&s.numNumbers>=r.numNumbers?Wt(Jt(s.parsed,r.parsed),n):(Bt(!0,`Complex values '${t}' and '${e}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`),o=>`${o>0?e:t}`)},nn=(t,e)=>n=>w(t,e,n);function qt(t,e,{clamp:n=!0,ease:s,mixer:r}={}){const i=t.length;V(i===e.length,"Both input and output ranges must be the same length"),V(!s||!Array.isArray(s)||s.length===i-1,"Array of easing functions must be of length `input.length - 1`, as it applies to the transitions **between** the defined values."),t[0]>t[i-1]&&(t=[].concat(t),e=[].concat(e),t.reverse(),e.reverse());const o=function rn(t,e,n){const s=[],r=n||function sn(t){return"number"==typeof t?nn:"string"==typeof t?W.test(t)?Ut:Xt:Array.isArray(t)?Jt:"object"==typeof t?en:void 0}(t[0]),i=t.length-1;for(let o=0;o<i;o++){let a=r(t[o],t[o+1]);if(e){const c=Array.isArray(e)?e[o]:e;a=Wt(c,a)}s.push(a)}return s}(e,s,r),a=2===i?function on([t,e],[n]){return s=>n(Lt(t,e,s))}(t,o):function an(t,e){const n=t.length,s=n-1;return r=>{let i=0,o=!1;if(r<=t[0]?o=!0:r>=t[s]&&(i=s-1,o=!0),!o){let c=1;for(;c<n&&!(t[c]>r||c===s);c++);i=c-1}const a=Lt(t[i],t[i+1],r);return e[i](a)}}(t,o);return n?c=>a(st(t[0],t[i-1],c)):a}function cn(t,e){return t.map(()=>e||z).splice(0,t.length-1)}function K({from:t=0,to:e=1,ease:n,offset:s,duration:r=300}){const i={done:!1,value:t},o=Array.isArray(e)?e:[t,e],a=function ln(t,e){return t.map(n=>n*e)}(s&&s.length===o.length?s:function un(t){const e=t.length;return t.map((n,s)=>0!==s?s/(e-1):0)}(o),r);function c(){return qt(a,o,{ease:Array.isArray(n)?n:cn(o,n)})}let u=c();return{next:d=>(i.value=u(d),i.done=d>=r,i),flipTarget:()=>{o.reverse(),u=c()}}}const _t={keyframes:K,spring:it,decay:function dn({velocity:t=0,from:e=0,power:n=.8,timeConstant:s=350,restDelta:r=.5,modifyTarget:i}){const o={done:!1,value:e};let a=n*t;const c=e+a,u=void 0===i?c:i(c);return u!==c&&(a=u-e),{next:d=>{const f=-a*Math.exp(-d/s);return o.done=!(f>r||f<-r),o.value=o.done?u:u+f,o},flipTarget:()=>{}}}},te=1/60*1e3,pn=typeof performance<"u"?()=>performance.now():()=>Date.now(),ee=typeof window<"u"?t=>window.requestAnimationFrame(t):t=>setTimeout(()=>t(pn()),te);let ft=!0,C=!1,pt=!1;const j={delta:0,timestamp:0},Z=["read","update","preRender","render","postRender"],J=Z.reduce((t,e)=>(t[e]=function hn(t){let e=[],n=[],s=0,r=!1,i=!1;const o=new WeakSet,a={schedule:(c,u=!1,d=!1)=>{const f=d&&r,g=f?e:n;return u&&o.add(c),-1===g.indexOf(c)&&(g.push(c),f&&r&&(s=e.length)),c},cancel:c=>{const u=n.indexOf(c);-1!==u&&n.splice(u,1),o.delete(c)},process:c=>{if(r)i=!0;else{if(r=!0,[e,n]=[n,e],n.length=0,s=e.length,s)for(let u=0;u<s;u++){const d=e[u];d(c),o.has(d)&&(a.schedule(d),t())}r=!1,i&&(i=!1,a.process(c))}}};return a}(()=>C=!0),t),{}),gn=Z.reduce((t,e)=>{const n=J[e];return t[e]=(s,r=!1,i=!1)=>(C||xn(),n.schedule(s,r,i)),t},{}),yn=Z.reduce((t,e)=>(t[e]=J[e].cancel,t),{}),bn=(Z.reduce((t,e)=>(t[e]=()=>J[e].process(j),t),{}),t=>J[t].process(j)),ne=t=>{C=!1,j.delta=ft?te:Math.max(Math.min(t-j.timestamp,40),1),j.timestamp=t,pt=!0,Z.forEach(bn),pt=!1,C&&(ft=!1,ee(ne))},xn=()=>{C=!0,ft=!0,pt||ee(ne)},vn=gn;function se(t,e,n=0){return t-e-n}const wn=t=>{const e=({delta:n})=>t(n);return{start:()=>vn.update(e,!0),stop:()=>yn.update(e)}};function Sn(t){var e,n,{from:s,autoplay:r=!0,driver:i=wn,elapsed:o=0,repeat:a=0,repeatType:c="loop",repeatDelay:u=0,onPlay:d,onStop:f,onComplete:g,onRepeat:S,onUpdate:A}=t,T=(0,Ft._T)(t,["from","autoplay","driver","elapsed","repeat","repeatType","repeatDelay","onPlay","onStop","onComplete","onRepeat","onUpdate"]);let x,h,L,{to:R}=T,y=0,m=T.duration,v=!1,M=!0;const Re=function fn(t){if(Array.isArray(t.to))return K;if(_t[t.type])return _t[t.type];const e=new Set(Object.keys(t));return e.has("ease")||e.has("duration")&&!e.has("dampingRatio")?K:e.has("dampingRatio")||e.has("stiffness")||e.has("mass")||e.has("damping")||e.has("restSpeed")||e.has("restDelta")?it:K}(T);null!==(n=(e=Re).needsInterpolation)&&void 0!==n&&n.call(e,s,R)&&(L=qt([0,100],[s,R],{clamp:!1}),s=0,R=100);const Me=Re(Object.assign(Object.assign({},T),{from:s,to:R}));function es(wt){if(M||(wt=-wt),o+=wt,!v){const we=Me.next(Math.max(0,o));h=we.value,L&&(h=L(h)),v=M?we.done:o<=0}A?.(h),v&&(0===y&&(m??(m=o)),y<a?function Mn(t,e,n,s){return s?t>=e+n:t<=-n}(o,m,u,M)&&function _n(){y++,"reverse"===c?(M=y%2==0,o=function Rn(t,e,n=0,s=!0){return s?se(e+-t,e,n):e-(t-e)+n}(o,m,u,M)):(o=se(o,m,u),"mirror"===c&&Me.flipTarget()),v=!1,S&&S()}():function ts(){x.stop(),g&&g()}())}return r&&function ns(){d?.(),x=i(es),x.start()}(),{stop:()=>{f?.(),x.stop()}}}class Q{constructor(e){(0,p.Z)(this,"top",void 0),(0,p.Z)(this,"left",void 0),(0,p.Z)(this,"right",void 0),(0,p.Z)(this,"bottom",void 0),this.top=e.top,this.left=e.left,this.right=e.right,this.bottom=e.bottom}width(){return this.right-this.left}height(){return this.bottom-this.top}midpoint(){return{x:w(this.left,this.right,.5),y:w(this.top,this.bottom,.5)}}}class re{constructor(e){(0,p.Z)(this,"origin",void 0),(0,p.Z)(this,"scale",void 0),(0,p.Z)(this,"translate",void 0),this.origin=e.origin,this.scale=e.scale,this.translate=e.translate}apply(e){return this.origin+(e-this.origin)*this.scale+this.translate}}class ht{constructor(){(0,p.Z)(this,"records",new WeakMap)}animate(e,n){let s;this.records.get(e)?.stop();const r=new Promise(o=>{const{duration:a,easing:c,route:u}=n,d=f=>this.animateFrame(e,u,f);d(0),s=Sn({from:0,to:1,duration:a,ease:c,onUpdate:d,onComplete:()=>{e.reset(),o()},onStop:o}).stop}),i=new Tn(e,r,()=>s());return this.records.set(e,i),i}animateFrame(e,n,s){const r=this.calculateBoundingBox(n,s),i=this.calculateBorderRadiuses(n,s);e.borderRadiuses=i,e.project(r)}calculateBoundingBox(e,n){const s=e.boundingBoxFrom,r=e.boundingBoxTo;return new Q({top:w(s.top,r.top,n),left:w(s.left,r.left,n),right:w(s.right,r.right,n),bottom:w(s.bottom,r.bottom,n)})}calculateBorderRadiuses(e,n){const s=e.borderRadiusesFrom,r=e.borderRadiusesTo,i=(o,a,c)=>({x:w(o.x,a.x,c),y:w(o.y,a.y,c)});return{topLeft:i(s.topLeft,r.topLeft,n),topRight:i(s.topRight,r.topRight,n),bottomLeft:i(s.bottomLeft,r.bottomLeft,n),bottomRight:i(s.bottomRight,r.bottomRight,n)}}}class mt{constructor(e){(0,p.Z)(this,"engine",void 0),(0,p.Z)(this,"records",new WeakMap),this.engine=e}animate(e,n){this.records.get(e)?.stop();const{duration:s,easing:r,routes:i}=n,o=[];e.traverse(c=>{const u=i.get(c.id);if(!u)throw new Error("Unknown node");const f=this.engine.animate(c,{duration:s,easing:r,route:u});o.push(f)},{includeSelf:!0});const a=new Dn(e,o);return this.records.set(e,a),a}}class An extends Map{}class gt{constructor(e,n){(0,p.Z)(this,"promise",void 0),(0,p.Z)(this,"stopper",void 0),this.promise=e,this.stopper=n}then(e,n){return this.promise.then(e,n)}stop(){this.stopper()}}class Tn extends gt{constructor(e,n,s){super(n,s),(0,p.Z)(this,"node",void 0),this.node=e}}class Dn extends gt{constructor(e,n){super(Promise.all(n),()=>n.forEach(s=>s.stop())),(0,p.Z)(this,"root",void 0),this.root=e}}class yt{constructor(e,n,s){(0,p.Z)(this,"engine",void 0),(0,p.Z)(this,"measurer",void 0),(0,p.Z)(this,"easingParser",void 0),this.engine=e,this.measurer=n,this.easingParser=s}animate(e){const{root:n,from:s,estimation:r=!1}=e;"string"==typeof e.easing&&(e.easing=this.easingParser.parse(e.easing));const{duration:i=225,easing:o=z}=e;this.initialize(n);const a=this.getAnimationRouteMap(n,s,r);return this.engine.animate(n,{duration:i,easing:o,routes:a})}initialize(e){e.traverse(n=>n.reset(),{includeSelf:!0}),e.traverse(n=>n.measure(),{includeSelf:!0})}getAnimationRouteMap(e,n,s){const r=new An;return e.traverse(i=>{if(!i.measured())throw new Error("Unknown node");const o=n.get(i.id);if(r.has(i.id)&&i.element===o?.element)return;const a=o?.boundingBox||s&&this.estimateStartingBoundingBox(e,i,n)||i.boundingBox;r.set(i.id,{boundingBoxFrom:a,boundingBoxTo:i.boundingBox,borderRadiusesFrom:o?.borderRadiuses??i.borderRadiuses,borderRadiusesTo:i.borderRadiuses})},{includeSelf:!0}),r}estimateStartingBoundingBox(e,n,s){if(!n.measured())throw new Error("Unknown node");let i,r=n;for(;void 0===(i=s.get(r.id));){if(r===e||!r.parent)return;r=r.parent}if(!r.measured())throw new Error("Unknown ancestor");const a=r.calculateTransform(i.boundingBox).x.scale;return new Q({top:i.boundingBox.top-(r.boundingBox.top-n.boundingBox.top)*a,left:i.boundingBox.left-(r.boundingBox.left-n.boundingBox.left)*a,right:i.boundingBox.right-(r.boundingBox.right-n.boundingBox.right)*a,bottom:i.boundingBox.top-(r.boundingBox.top-n.boundingBox.bottom)*a})}}const oe=(t,e)=>1-3*e+3*t,ie=(t,e)=>3*e-6*t,ae=t=>3*t,X=(t,e,n)=>((oe(e,n)*t+ie(e,n))*t+ae(e))*t,ce=(t,e,n)=>3*oe(e,n)*t*t+2*ie(e,n)*t+ae(e),Fn=1e-7,Bn=10,En=8,On=.001,q=11,_=1/(q-1);function Nn(t,e,n,s){if(t===e&&n===s)return Tt;const r=new Float32Array(q);for(let o=0;o<q;++o)r[o]=X(o*_,t,n);return o=>0===o||1===o?o:X(function i(o){let a=0,c=1;const u=q-1;for(;c!==u&&r[c]<=o;++c)a+=_;--c;const f=a+(o-r[c])/(r[c+1]-r[c])*_,g=ce(f,t,n);return g>=On?function Ln(t,e,n,s){for(let r=0;r<En;++r){const i=ce(e,n,s);if(0===i)return e;e-=(X(e,n,s)-t)/i}return e}(o,f,t,n):0===g?f:function jn(t,e,n,s,r){let i,o,a=0;do{o=e+(n-e)/2,i=X(o,s,r)-t,i>0?n=o:e=o}while(Math.abs(i)>Fn&&++a<Bn);return o}(o,a,a+_,t,n)}(o),e,s)}class bt{parse(e,n,s){if(e.match(/\d.*?px \d.*?px/u)){const[r,i]=e.split(" ").map(o=>parseFloat(o));return{x:r,y:i}}if(B.test(e)){const r=parseFloat(e)/100;return{x:r*n,y:r*s}}if(We.test(e)){const r=parseFloat(e);return{x:r,y:r}}throw new Error(`Unsupported radius: ${e}`)}}class xt{parse(e){if("linear"===e)return Tt;if("ease"===e)return z;if("ease-in"===e)return et;if("ease-out"===e)return je;if("ease-in-out"===e)return z;if(e.startsWith("cubic-bezier")){const[n,s,r,i]=e.replace("cubic-bezier(","").replace(")","").split(",").map(o=>parseFloat(o));return Nn(n,s,r,i)}throw new Error(`Unsupported easing string: ${e}`)}}class ${constructor(e){(0,p.Z)(this,"borderRadiusParser",void 0),this.borderRadiusParser=e}measureBoundingBox(e){return new Q(e.getBoundingClientRect())}measureBorderRadiuses(e,n=this.measureBoundingBox(e)){const s=getComputedStyle(e),r=i=>this.borderRadiusParser.parse(i,n.width(),n.height());return{topLeft:r(s.borderTopLeftRadius),topRight:r(s.borderTopRightRadius),bottomLeft:r(s.borderBottomLeftRadius),bottomRight:r(s.borderBottomRightRadius)}}}let E=(()=>{class t{constructor(n,s){(0,p.Z)(this,"element",void 0),(0,p.Z)(this,"measurer",void 0),(0,p.Z)(this,"id","anonymous-"+t.idNext++),(0,p.Z)(this,"activated",!1),(0,p.Z)(this,"parent",void 0),(0,p.Z)(this,"children",new Set),(0,p.Z)(this,"boundingBox",void 0),(0,p.Z)(this,"borderRadiuses",void 0),(0,p.Z)(this,"transform",void 0),this.element=n,this.measurer=s}identifyAs(n){this.id=n}activate(){this.activated=!0}deactivate(){this.activated=!1}attach(n){this.parent=n,n.children.add(this)}detach(){if(!this.parent)throw new Error("Missing parent");this.parent.children.delete(this),this.parent=void 0}traverse(n,s={}){s.includeSelf??=!1,s.includeDeactivated??=!1,s.includeSelf&&n(this),this.children.forEach(r=>{!s.includeDeactivated&&!r.activated||r.traverse(n,{...s,includeSelf:!0})})}track(){const n=[];let s=this.parent;for(;s;)n.unshift(s),s=s.parent;return n}reset(){this.transform=void 0,this.element.style.transform="",this.element.style.borderRadius=""}measure(){this.boundingBox=this.measurer.measureBoundingBox(this.element),this.borderRadiuses=this.measurer.measureBorderRadiuses(this.element,this.boundingBox)}measured(){return!!this.boundingBox&&!!this.borderRadiuses}project(n){if(!this.measured())throw new Error("Node not measured");this.transform=this.calculateTransform(n);const s={x:1,y:1},r=this.track();for(const g of r)g.transform&&(s.x*=g.transform.x.scale,s.y*=g.transform.y.scale);const i=this.element.style,o=this.transform;i.transform=[`translate3d(${o.x.translate/s.x}px, ${o.y.translate/s.y}px, 0)`,`scale(${o.x.scale}, ${o.y.scale})`].join(" ");const u_x=s.x*this.transform.x.scale,u_y=s.y*this.transform.y.scale,d=this.borderRadiuses,f=g=>`${g.x/u_x}px ${g.y/u_y}px`;i.borderTopLeftRadius=f(d.topLeft),i.borderTopRightRadius=f(d.topRight),i.borderBottomLeftRadius=f(d.bottomLeft),i.borderBottomRightRadius=f(d.bottomRight)}calculateTransform(n){const s=this.calculateTransformedBoundingBox(),r=s.midpoint(),i=n.midpoint(),o={x:new re({origin:r.x,scale:n.width()/s.width(),translate:i.x-r.x}),y:new re({origin:r.y,scale:n.height()/s.height(),translate:i.y-r.y})};return isNaN(o.x.scale)&&(o.x.scale=1),isNaN(o.y.scale)&&(o.y.scale=1),o}calculateTransformedBoundingBox(){if(!this.measured())throw new Error("Node not measured");let n=this.boundingBox;for(const s of this.track()){if(!s.boundingBox||!s.transform)continue;const r=s.transform;n=new Q({top:r.y.apply(n.top),left:r.x.apply(n.left),right:r.x.apply(n.right),bottom:r.y.apply(n.bottom)})}return n}}return(0,p.Z)(t,"idNext",1),t})();class vt{constructor(e){(0,p.Z)(this,"measurer",void 0),this.measurer=e}snapshot(e){const n=this.measurer.measureBoundingBox(e.element),s=this.measurer.measureBorderRadiuses(e.element,n);return{element:e.element,boundingBox:n,borderRadiuses:s}}snapshotTree(e,n){const s=new O,r=new Set;return e.traverse(i=>{if(!n||n(i)){if(r.has(i.id))throw new Error(`Node ID conflict: "${i.id}"`);r.add(i.id),s.set(i.id,this.snapshot(i))}},{includeSelf:!0}),s}}class O extends Map{merge(e){for(const[n,s]of e)this.set(n,s)}}var ue=b(4885),In=b(8105),le=b(7612),Pn=b(3970),Cn=b(2170),de=b(2077),fe=b(3205),Zn=b(9930),pe=b(1368);function he(t,e){return e?n=>n.pipe(he((s,r)=>(0,fe.Xf)(t(s,r)).pipe((0,de.U)((i,o)=>e(s,i,r,o))))):(0,Zn.e)((n,s)=>{let r=0,i=null,o=!1;n.subscribe((0,pe.x)(s,a=>{i||(i=(0,pe.x)(s,void 0,()=>{i=null,o&&s.complete()}),(0,fe.Xf)(t(a,r++)).subscribe(i))},()=>{o=!0,!i&&s.complete()}))})}var $n=b(3273);function Un(){return he($n.y)}var Yn=b(7114),Rt=b(4291),kn=b(6469);const me={now:()=>(me.delegate||performance).now(),delegate:void 0};var ge=b(555);function ye(t){return new ue.y(e=>{const n=t||me,s=n.now();let r=0;const i=()=>{e.closed||(r=ge.l.requestAnimationFrame(o=>{r=0;const a=n.now();e.next({timestamp:t?a:o,elapsed:a-s}),i()}))};return i(),()=>{r&&ge.l.cancelAnimationFrame(r)}})}const Vn=ye();var Gn=b(2314);class Hn{constructor(e,n){this.map=e,this.secondsBeforeDeletion=n,this.timeouts=new Map}stale(e){const n=setTimeout(()=>this.performDeletion(e),1e3*this.secondsBeforeDeletion);this.timeouts.set(e,n)}refresh(e){const n=this.timeouts.get(e);clearTimeout(n),this.timeouts.delete(e)}performDeletion(e){this.map.delete(e),this.timeouts.delete(e)}}let Wn=(()=>{class t{set lpjAnimationScope(n){""!==n&&(this.source=n)}constructor(n,s){this.templateRef=n,this.viewContainer=s}ngOnInit(){const n=this.createInjector(),s=n.get(be);this.viewContainer.createEmbeddedView(this.templateRef,{$implicit:s},{injector:n})}createInjector(){const{nodeRegistry:n=new U,entryRegistry:s=new Y,snapshots:r=new O}=this.source??{};return l.zs3.create({providers:[{provide:be},{provide:U,useValue:n},{provide:Y,useValue:s},{provide:O,useValue:r},{provide:xe}]})}static ngTemplateContextGuard(n,s){return!0}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(l.Rgc),l.Y36(l.s_b))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjAnimationScope",""]],inputs:{lpjAnimationScope:"lpjAnimationScope"}}),t})(),be=(()=>{class t{constructor(n,s,r){this.nodeRegistry=n,this.entryRegistry=s,this.snapshots=r}}return t.\u0275fac=function(n){return new(n||t)(l.LFG(U),l.LFG(Y),l.LFG(O))},t.\u0275prov=l.Yz7({token:t,factory:t.\u0275fac}),t})();class U extends Set{}class Y extends Set{}let xe=(()=>{class t extends Hn{constructor(n){super(n,10)}}return t.\u0275fac=function(n){return new(n||t)(l.LFG(O))},t.\u0275prov=l.Yz7({token:t,factory:t.\u0275fac}),t})(),Mt=(()=>{class t{set lpjAnimation(n){"string"!=typeof n&&(this.config=n)}constructor(n,s,r,i,o){this.node=n,this.animator=s,this.snapper=r,this.snapshots=i,this.nodeRegistry=o,this.config={}}snapshot(){const n=this.nodeRegistry?.has.bind(this.nodeRegistry),s=this.snapper.snapshotTree(this.node,n);this.snapshots.merge(s)}animate(){if(!this.snapshots)throw new Error("Missing snapshots");return this.animator.animate({root:this.node,from:this.snapshots,...this.config})}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(E,2),l.Y36(yt),l.Y36(vt),l.Y36(O),l.Y36(U,8))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjNode","","lpjAnimation",""]],inputs:{lpjAnimation:"lpjAnimation"},exportAs:["lpjAnimation"]}),t})(),Kn=(()=>{class t{constructor(n,s,r){this.node=n,this.registry=s,this.snapshots=r}ngOnInit(){this.registry?.add(this.node),this.snapshots?.refresh(this.node.id)}ngOnDestroy(){this.registry?.delete(this.node),this.snapshots?.stale(this.node.id)}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(E,2),l.Y36(U,8),l.Y36(xe,8))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjNode",""]]}),t})(),Jn=(()=>{class t{constructor(n,s){this.entry=n,this.registry=s}ngOnInit(){this.registry?.add(this.entry)}ngOnDestroy(){this.registry?.delete(this.entry)}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(Mt,2),l.Y36(Y,8))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjAnimation",""]]}),t})(),ve=(()=>{class t{set lpjAnimationTrigger(n){const s=n instanceof ue.y?n.pipe((0,In.O)((0,le.of)(n))):(0,le.of)(n);this.trigger$.next(s)}set lpjAnimationTriggerFor(n){const s=r=>r instanceof E?r.id:r;this.targetIds=n instanceof Array?n.map(s):[s(n)]}constructor(n){this.entryRegistry=n,this.trigger$=new Pn.X(Cn.E),this.targetIds=[],this.animationTrigger=new l.vpe,this.animationSettle=new l.vpe}ngOnInit(){this.trigger$.pipe(Un(),(0,Yn.T)(1),(0,Rt.b)(()=>this.animationTrigger.emit()),(0,Rt.b)(()=>this.snapshot()),(0,kn.w)(()=>function zn(t){return t?ye(t):Vn}().pipe((0,Gn.P)())),(0,de.U)(()=>this.animate()),(0,Rt.b)(n=>n.then(()=>this.animationSettle.emit()))).subscribe()}snapshot(){this.findTargets().forEach(n=>n.snapshot())}animate(){const n=this.findTargets().map(s=>s.animate());return new gt(Promise.all(n),()=>n.forEach(s=>s.stop()))}findTargets(){const n=Array.from(this.entryRegistry).filter(s=>this.targetIds.includes(s.node.id));if(!n.length)throw new Error("Failed to find any target entry");return n}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(Y))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjAnimationTrigger",""]],inputs:{lpjAnimationTrigger:"lpjAnimationTrigger",lpjAnimationTriggerFor:"lpjAnimationTriggerFor"},outputs:{animationTrigger:"animationTrigger",animationSettle:"animationSettle"}}),t})(),Qn=(()=>{class t{constructor(n,s){s.lpjAnimationTriggerFor=n.node}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(Mt,2),l.Y36(ve,2))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjAnimation","","lpjAnimationTrigger",""]]}),t})(),Xn=(()=>{class t extends E{set lpjNode(n){"string"==typeof n?(n&&this.identifyAs(n),this.activate()):this.deactivate()}constructor(n,s,r){super(n.nativeElement,s),r&&this.attach(r)}ngOnDestroy(){this.parent&&this.detach()}}return t.\u0275fac=function(n){return new(n||t)(l.Y36(l.SBq),l.Y36($),l.Y36(E,12))},t.\u0275dir=l.lG2({type:t,selectors:[["","lpjNode",""]],inputs:{lpjNode:"lpjNode"},exportAs:["lpjNode"],features:[l._Bn([{provide:E,useExisting:t}]),l.qOj]}),t})(),qn=(()=>{class t{}return t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=l.oAB({type:t}),t.\u0275inj=l.cJS({providers:[{provide:yt,useFactory:()=>new yt((0,l.f3M)(mt),(0,l.f3M)($),(0,l.f3M)(xt))},{provide:ht,useFactory:()=>new ht},{provide:mt,useFactory:()=>new mt((0,l.f3M)(ht))},{provide:$,useFactory:()=>new $((0,l.f3M)(bt))},{provide:vt,useFactory:()=>new vt((0,l.f3M)($))},{provide:bt,useFactory:()=>new bt},{provide:xt,useFactory:()=>new xt}]}),t})()}}]);