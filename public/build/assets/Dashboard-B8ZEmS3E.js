import{R as y,g as Pe,r as L,j as c,H as Ne,a as me}from"./app-DAJCI8FB.js";import{B as De,a as te,C as Be}from"./BookingHeader-D7KYGXZs.js";import{E as d,q as $,z as X,k as B,v as F,x as S,d as O,bk as G,bl as W,bm as U,F as $e,cd as Xe,A as Fe,g as qe,r as Ye,h as Ve,e as Ge,I as Ue,T as Ke,B as K,C as _}from"./Logo-BYrrbJ73.js";import{R as _e}from"./MessageOutlined-YdkNaCbp.js";import{R as Qe}from"./CheckCircleOutlined-D-DuwSK3.js";import{R as ve,a as Je}from"./SafetyCertificateOutlined-DU_q93os.js";import{a as xe}from"./UserOutlined-CevrvxWz.js";import{d as Ze}from"./index-CUWDS_la.js";import{R as et,C as ie}from"./row-2wEzZXUl.js";import{s as tt}from"./index-_He5V0uf.js";/* empty css            */import"./index-Bl0SE7Gb.js";import"./CheckCircleFilled-CxZj3zSs.js";import"./InfoCircleFilled-BU7_q32T.js";import"./useClosable-CjZfDL2d.js";import"./extendsObject-78o_rR5W.js";import"./PhoneOutlined-CNr-xwJG.js";import"./index-CqEv_oRB.js";import"./Input-elahK19r.js";import"./EyeOutlined-D2xfrtBY.js";import"./EyeOutlined-Bmd706kk.js";import"./HomeOutlined-9g-WzLLh.js";import"./QuestionCircleOutlined-CkfPyHQh.js";var it={animating:!1,autoplaying:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,dragging:!1,edgeDragged:!1,initialized:!1,lazyLoadedList:[],listHeight:null,listWidth:null,scrolling:!1,slideCount:null,slideHeight:null,slideWidth:null,swipeLeft:null,swiped:!1,swiping:!1,touchObject:{startX:0,startY:0,curX:0,curY:0},trackStyle:{},trackWidth:0,targetSlide:0},de={accessibility:!0,adaptiveHeight:!1,afterChange:null,appendDots:function(t){return y.createElement("ul",{style:{display:"block"}},t)},arrows:!0,autoplay:!1,autoplaySpeed:3e3,beforeChange:null,centerMode:!1,centerPadding:"50px",className:"",cssEase:"ease",customPaging:function(t){return y.createElement("button",null,t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,infinite:!0,initialSlide:0,lazyLoad:null,nextArrow:null,onEdge:null,onInit:null,onLazyLoadError:null,onReInit:null,pauseOnDotsHover:!1,pauseOnFocus:!1,pauseOnHover:!0,prevArrow:null,responsive:null,rows:1,rtl:!1,slide:"div",slidesPerRow:1,slidesToScroll:1,slidesToShow:1,speed:500,swipe:!0,swipeEvent:null,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,waitForAnimate:!0,asNavFor:null};function ce(l,t,i){return Math.max(t,Math.min(l,i))}var D=function(t){var i=["onTouchStart","onTouchMove","onWheel"];i.includes(t._reactName)||t.preventDefault()},J=function(t){for(var i=[],e=ze(t),o=Le(t),r=e;r<o;r++)t.lazyLoadedList.indexOf(r)<0&&i.push(r);return i},ze=function(t){return t.currentSlide-rt(t)},Le=function(t){return t.currentSlide+nt(t)},rt=function(t){return t.centerMode?Math.floor(t.slidesToShow/2)+(parseInt(t.centerPadding)>0?1:0):0},nt=function(t){return t.centerMode?Math.floor((t.slidesToShow-1)/2)+1+(parseInt(t.centerPadding)>0?1:0):t.slidesToShow},ue=function(t){return t&&t.offsetWidth||0},pe=function(t){return t&&t.offsetHeight||0},je=function(t){var i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,e,o,r,n;return e=t.startX-t.curX,o=t.startY-t.curY,r=Math.atan2(o,e),n=Math.round(r*180/Math.PI),n<0&&(n=360-Math.abs(n)),n<=45&&n>=0||n<=360&&n>=315?"left":n>=135&&n<=225?"right":i===!0?n>=35&&n<=135?"up":"down":"vertical"},Z=function(t){var i=!0;return t.infinite||(t.centerMode&&t.currentSlide>=t.slideCount-1||t.slideCount<=t.slidesToShow||t.currentSlide>=t.slideCount-t.slidesToShow)&&(i=!1),i},re=function(t,i){var e={};return i.forEach(function(o){return e[o]=t[o]}),e},at=function(t){var i=y.Children.count(t.children),e=t.listRef,o=Math.ceil(ue(e)),r=t.trackRef&&t.trackRef.node,n=Math.ceil(ue(r)),a;if(t.vertical)a=o;else{var s=t.centerMode&&parseInt(t.centerPadding)*2;typeof t.centerPadding=="string"&&t.centerPadding.slice(-1)==="%"&&(s*=o/100),a=Math.ceil((o-s)/t.slidesToShow)}var f=e&&pe(e.querySelector('[data-index="0"]')),m=f*t.slidesToShow,u=t.currentSlide===void 0?t.initialSlide:t.currentSlide;t.rtl&&t.currentSlide===void 0&&(u=i-1-t.initialSlide);var x=t.lazyLoadedList||[],b=J(d(d({},t),{},{currentSlide:u,lazyLoadedList:x}));x=x.concat(b);var g={slideCount:i,slideWidth:a,listWidth:o,trackWidth:n,currentSlide:u,slideHeight:f,listHeight:m,lazyLoadedList:x};return t.autoplaying===null&&t.autoplay&&(g.autoplaying="playing"),g},ot=function(t){var i=t.waitForAnimate,e=t.animating,o=t.fade,r=t.infinite,n=t.index,a=t.slideCount,s=t.lazyLoad,f=t.currentSlide,m=t.centerMode,u=t.slidesToScroll,x=t.slidesToShow,b=t.useCSS,g=t.lazyLoadedList;if(i&&e)return{};var p=n,v,k,h,w={},T={},C=r?n:ce(n,0,a-1);if(o){if(!r&&(n<0||n>=a))return{};n<0?p=n+a:n>=a&&(p=n-a),s&&g.indexOf(p)<0&&(g=g.concat(p)),w={animating:!0,currentSlide:p,lazyLoadedList:g,targetSlide:p},T={animating:!1,targetSlide:p}}else v=p,p<0?(v=p+a,r?a%u!==0&&(v=a-a%u):v=0):!Z(t)&&p>f?p=v=f:m&&p>=a?(p=r?a:a-1,v=r?0:a-1):p>=a&&(v=p-a,r?a%u!==0&&(v=0):v=a-x),!r&&p+x>=a&&(v=a-x),k=V(d(d({},t),{},{slideIndex:p})),h=V(d(d({},t),{},{slideIndex:v})),r||(k===h&&(p=v),k=h),s&&(g=g.concat(J(d(d({},t),{},{currentSlide:p})))),b?(w={animating:!0,currentSlide:v,trackStyle:Me(d(d({},t),{},{left:k})),lazyLoadedList:g,targetSlide:C},T={animating:!1,currentSlide:v,trackStyle:Y(d(d({},t),{},{left:h})),swipeLeft:null,targetSlide:C}):w={currentSlide:v,trackStyle:Y(d(d({},t),{},{left:h})),lazyLoadedList:g,targetSlide:C};return{state:w,nextState:T}},lt=function(t,i){var e,o,r,n,a,s=t.slidesToScroll,f=t.slidesToShow,m=t.slideCount,u=t.currentSlide,x=t.targetSlide,b=t.lazyLoad,g=t.infinite;if(n=m%s!==0,e=n?0:(m-u)%s,i.message==="previous")r=e===0?s:f-e,a=u-r,b&&!g&&(o=u-r,a=o===-1?m-1:o),g||(a=x-s);else if(i.message==="next")r=e===0?s:e,a=u+r,b&&!g&&(a=(u+s)%m+e),g||(a=x+s);else if(i.message==="dots")a=i.index*i.slidesToScroll;else if(i.message==="children"){if(a=i.index,g){var p=ht(d(d({},t),{},{targetSlide:a}));a>i.currentSlide&&p==="left"?a=a-m:a<i.currentSlide&&p==="right"&&(a=a+m)}}else i.message==="index"&&(a=Number(i.index));return a},st=function(t,i,e){return t.target.tagName.match("TEXTAREA|INPUT|SELECT")||!i?"":t.keyCode===37?e?"next":"previous":t.keyCode===39?e?"previous":"next":""},dt=function(t,i,e){return t.target.tagName==="IMG"&&D(t),!i||!e&&t.type.indexOf("mouse")!==-1?"":{dragging:!0,touchObject:{startX:t.touches?t.touches[0].pageX:t.clientX,startY:t.touches?t.touches[0].pageY:t.clientY,curX:t.touches?t.touches[0].pageX:t.clientX,curY:t.touches?t.touches[0].pageY:t.clientY}}},ct=function(t,i){var e=i.scrolling,o=i.animating,r=i.vertical,n=i.swipeToSlide,a=i.verticalSwiping,s=i.rtl,f=i.currentSlide,m=i.edgeFriction,u=i.edgeDragged,x=i.onEdge,b=i.swiped,g=i.swiping,p=i.slideCount,v=i.slidesToScroll,k=i.infinite,h=i.touchObject,w=i.swipeEvent,T=i.listHeight,C=i.listWidth;if(!e){if(o)return D(t);r&&n&&a&&D(t);var z,M={},H=V(i);h.curX=t.touches?t.touches[0].pageX:t.clientX,h.curY=t.touches?t.touches[0].pageY:t.clientY,h.swipeLength=Math.round(Math.sqrt(Math.pow(h.curX-h.startX,2)));var I=Math.round(Math.sqrt(Math.pow(h.curY-h.startY,2)));if(!a&&!g&&I>10)return{scrolling:!0};a&&(h.swipeLength=I);var A=(s?-1:1)*(h.curX>h.startX?1:-1);a&&(A=h.curY>h.startY?1:-1);var ee=Math.ceil(p/v),E=je(i.touchObject,a),P=h.swipeLength;return k||(f===0&&(E==="right"||E==="down")||f+1>=ee&&(E==="left"||E==="up")||!Z(i)&&(E==="left"||E==="up"))&&(P=h.swipeLength*m,u===!1&&x&&(x(E),M.edgeDragged=!0)),!b&&w&&(w(E),M.swiped=!0),r?z=H+P*(T/C)*A:s?z=H-P*A:z=H+P*A,a&&(z=H+P*A),M=d(d({},M),{},{touchObject:h,swipeLeft:z,trackStyle:Y(d(d({},i),{},{left:z}))}),Math.abs(h.curX-h.startX)<Math.abs(h.curY-h.startY)*.8||h.swipeLength>10&&(M.swiping=!0,D(t)),M}},ut=function(t,i){var e=i.dragging,o=i.swipe,r=i.touchObject,n=i.listWidth,a=i.touchThreshold,s=i.verticalSwiping,f=i.listHeight,m=i.swipeToSlide,u=i.scrolling,x=i.onSwipe,b=i.targetSlide,g=i.currentSlide,p=i.infinite;if(!e)return o&&D(t),{};var v=s?f/a:n/a,k=je(r,s),h={dragging:!1,edgeDragged:!1,scrolling:!1,swiping:!1,swiped:!1,swipeLeft:null,touchObject:{}};if(u||!r.swipeLength)return h;if(r.swipeLength>v){D(t),x&&x(k);var w,T,C=p?g:b;switch(k){case"left":case"up":T=C+ye(i),w=m?Se(i,T):T,h.currentDirection=0;break;case"right":case"down":T=C-ye(i),w=m?Se(i,T):T,h.currentDirection=1;break;default:w=C}h.triggerSlideHandler=w}else{var z=V(i);h.trackStyle=Me(d(d({},i),{},{left:z}))}return h},ft=function(t){for(var i=t.infinite?t.slideCount*2:t.slideCount,e=t.infinite?t.slidesToShow*-1:0,o=t.infinite?t.slidesToShow*-1:0,r=[];e<i;)r.push(e),e=o+t.slidesToScroll,o+=Math.min(t.slidesToScroll,t.slidesToShow);return r},Se=function(t,i){var e=ft(t),o=0;if(i>e[e.length-1])i=e[e.length-1];else for(var r in e){if(i<e[r]){i=o;break}o=e[r]}return i},ye=function(t){var i=t.centerMode?t.slideWidth*Math.floor(t.slidesToShow/2):0;if(t.swipeToSlide){var e,o=t.listRef,r=o.querySelectorAll&&o.querySelectorAll(".slick-slide")||[];if(Array.from(r).every(function(s){if(t.vertical){if(s.offsetTop+pe(s)/2>t.swipeLeft*-1)return e=s,!1}else if(s.offsetLeft-i+ue(s)/2>t.swipeLeft*-1)return e=s,!1;return!0}),!e)return 0;var n=t.rtl===!0?t.slideCount-t.currentSlide:t.currentSlide,a=Math.abs(e.dataset.index-n)||1;return a}else return t.slidesToScroll},he=function(t,i){return i.reduce(function(e,o){return e&&t.hasOwnProperty(o)},!0)?null:console.error("Keys Missing:",t)},Y=function(t){he(t,["left","variableWidth","slideCount","slidesToShow","slideWidth"]);var i,e;if(!t.vertical)i=pt(t)*t.slideWidth;else{var o=t.unslick?t.slideCount:t.slideCount+2*t.slidesToShow;e=o*t.slideHeight}var r={opacity:1,transition:"",WebkitTransition:""};if(t.useTransform){var n=t.vertical?"translate3d(0px, "+t.left+"px, 0px)":"translate3d("+t.left+"px, 0px, 0px)",a=t.vertical?"translate3d(0px, "+t.left+"px, 0px)":"translate3d("+t.left+"px, 0px, 0px)",s=t.vertical?"translateY("+t.left+"px)":"translateX("+t.left+"px)";r=d(d({},r),{},{WebkitTransform:n,transform:a,msTransform:s})}else t.vertical?r.top=t.left:r.left=t.left;return t.fade&&(r={opacity:1}),i&&(r.width=i),e&&(r.height=e),window&&!window.addEventListener&&window.attachEvent&&(t.vertical?r.marginTop=t.left+"px":r.marginLeft=t.left+"px"),r},Me=function(t){he(t,["left","variableWidth","slideCount","slidesToShow","slideWidth","speed","cssEase"]);var i=Y(t);return t.useTransform?(i.WebkitTransition="-webkit-transform "+t.speed+"ms "+t.cssEase,i.transition="transform "+t.speed+"ms "+t.cssEase):t.vertical?i.transition="top "+t.speed+"ms "+t.cssEase:i.transition="left "+t.speed+"ms "+t.cssEase,i},V=function(t){if(t.unslick)return 0;he(t,["slideIndex","trackRef","infinite","centerMode","slideCount","slidesToShow","slidesToScroll","slideWidth","listWidth","variableWidth","slideHeight"]);var i=t.slideIndex,e=t.trackRef,o=t.infinite,r=t.centerMode,n=t.slideCount,a=t.slidesToShow,s=t.slidesToScroll,f=t.slideWidth,m=t.listWidth,u=t.variableWidth,x=t.slideHeight,b=t.fade,g=t.vertical,p=0,v,k,h=0;if(b||t.slideCount===1)return 0;var w=0;if(o?(w=-R(t),n%s!==0&&i+s>n&&(w=-(i>n?a-(i-n):n%s)),r&&(w+=parseInt(a/2))):(n%s!==0&&i+s>n&&(w=a-n%s),r&&(w=parseInt(a/2))),p=w*f,h=w*x,g?v=i*x*-1+h:v=i*f*-1+p,u===!0){var T,C=e&&e.node;if(T=i+R(t),k=C&&C.childNodes[T],v=k?k.offsetLeft*-1:0,r===!0){T=o?i+R(t):i,k=C&&C.children[T],v=0;for(var z=0;z<T;z++)v-=C&&C.children[z]&&C.children[z].offsetWidth;v-=parseInt(t.centerPadding),v+=k&&(m-k.offsetWidth)/2}}return v},R=function(t){return t.unslick||!t.infinite?0:t.variableWidth?t.slideCount:t.slidesToShow+(t.centerMode?1:0)},Q=function(t){return t.unslick||!t.infinite?0:t.slideCount},pt=function(t){return t.slideCount===1?1:R(t)+t.slideCount+Q(t)},ht=function(t){return t.targetSlide>t.currentSlide?t.targetSlide>t.currentSlide+gt(t)?"left":"right":t.targetSlide<t.currentSlide-mt(t)?"right":"left"},gt=function(t){var i=t.slidesToShow,e=t.centerMode,o=t.rtl,r=t.centerPadding;if(e){var n=(i-1)/2+1;return parseInt(r)>0&&(n+=1),o&&i%2===0&&(n+=1),n}return o?0:i-1},mt=function(t){var i=t.slidesToShow,e=t.centerMode,o=t.rtl,r=t.centerPadding;if(e){var n=(i-1)/2+1;return parseInt(r)>0&&(n+=1),!o&&i%2===0&&(n+=1),n}return o?i-1:0},be=function(){return!!(typeof window<"u"&&window.document&&window.document.createElement)},vt=Object.keys(de);function xt(l){return vt.reduce(function(t,i){return l.hasOwnProperty(i)&&(t[i]=l[i]),t},{})}function St(l,t,i){return t=W(t),G(l,U()?Reflect.construct(t,i||[],W(l).constructor):t.apply(l,i))}var ne=function(t){var i,e,o,r,n;t.rtl?n=t.slideCount-1-t.index:n=t.index,o=n<0||n>=t.slideCount,t.centerMode?(r=Math.floor(t.slidesToShow/2),e=(n-t.currentSlide)%t.slideCount===0,n>t.currentSlide-r-1&&n<=t.currentSlide+r&&(i=!0)):i=t.currentSlide<=n&&n<t.currentSlide+t.slidesToShow;var a;t.targetSlide<0?a=t.targetSlide+t.slideCount:t.targetSlide>=t.slideCount?a=t.targetSlide-t.slideCount:a=t.targetSlide;var s=n===a;return{"slick-slide":!0,"slick-active":i,"slick-center":e,"slick-cloned":o,"slick-current":s}},yt=function(t){var i={};return(t.variableWidth===void 0||t.variableWidth===!1)&&(i.width=t.slideWidth),t.fade&&(i.position="relative",t.vertical&&t.slideHeight?i.top=-t.index*parseInt(t.slideHeight):i.left=-t.index*parseInt(t.slideWidth),i.opacity=t.currentSlide===t.index?1:0,i.zIndex=t.currentSlide===t.index?999:998,t.useCSS&&(i.transition="opacity "+t.speed+"ms "+t.cssEase+", visibility "+t.speed+"ms "+t.cssEase)),i},ae=function(t,i){return t.key+"-"+i},bt=function(t){var i,e=[],o=[],r=[],n=y.Children.count(t.children),a=ze(t),s=Le(t);return y.Children.forEach(t.children,function(f,m){var u,x={message:"children",index:m,slidesToScroll:t.slidesToScroll,currentSlide:t.currentSlide};!t.lazyLoad||t.lazyLoad&&t.lazyLoadedList.indexOf(m)>=0?u=f:u=y.createElement("div",null);var b=yt(d(d({},t),{},{index:m})),g=u.props.className||"",p=ne(d(d({},t),{},{index:m}));if(e.push(y.cloneElement(u,{key:"original"+ae(u,m),"data-index":m,className:O(p,g),tabIndex:"-1","aria-hidden":!p["slick-active"],style:d(d({outline:"none"},u.props.style||{}),b),onClick:function(h){u.props&&u.props.onClick&&u.props.onClick(h),t.focusOnSelect&&t.focusOnSelect(x)}})),t.infinite&&n>1&&t.fade===!1&&!t.unslick){var v=n-m;v<=R(t)&&(i=-v,i>=a&&(u=f),p=ne(d(d({},t),{},{index:i})),o.push(y.cloneElement(u,{key:"precloned"+ae(u,i),"data-index":i,tabIndex:"-1",className:O(p,g),"aria-hidden":!p["slick-active"],style:d(d({},u.props.style||{}),b),onClick:function(h){u.props&&u.props.onClick&&u.props.onClick(h),t.focusOnSelect&&t.focusOnSelect(x)}}))),i=n+m,i<s&&(u=f),p=ne(d(d({},t),{},{index:i})),r.push(y.cloneElement(u,{key:"postcloned"+ae(u,i),"data-index":i,tabIndex:"-1",className:O(p,g),"aria-hidden":!p["slick-active"],style:d(d({},u.props.style||{}),b),onClick:function(h){u.props&&u.props.onClick&&u.props.onClick(h),t.focusOnSelect&&t.focusOnSelect(x)}}))}}),t.rtl?o.concat(e,r).reverse():o.concat(e,r)},wt=function(l){function t(){var i;F(this,t);for(var e=arguments.length,o=new Array(e),r=0;r<e;r++)o[r]=arguments[r];return i=St(this,t,[].concat(o)),S(i,"node",null),S(i,"handleRef",function(n){i.node=n}),i}return $(t,l),X(t,[{key:"render",value:function(){var e=bt(this.props),o=this.props,r=o.onMouseEnter,n=o.onMouseOver,a=o.onMouseLeave,s={onMouseEnter:r,onMouseOver:n,onMouseLeave:a};return y.createElement("div",B({ref:this.handleRef,className:"slick-track",style:this.props.trackStyle},s),e)}}])}(y.PureComponent);function kt(l,t,i){return t=W(t),G(l,U()?Reflect.construct(t,i||[],W(l).constructor):t.apply(l,i))}var Ct=function(t){var i;return t.infinite?i=Math.ceil(t.slideCount/t.slidesToScroll):i=Math.ceil((t.slideCount-t.slidesToShow)/t.slidesToScroll)+1,i},Tt=function(l){function t(){return F(this,t),kt(this,t,arguments)}return $(t,l),X(t,[{key:"clickHandler",value:function(e,o){o.preventDefault(),this.props.clickHandler(e)}},{key:"render",value:function(){for(var e=this.props,o=e.onMouseEnter,r=e.onMouseOver,n=e.onMouseLeave,a=e.infinite,s=e.slidesToScroll,f=e.slidesToShow,m=e.slideCount,u=e.currentSlide,x=Ct({slideCount:m,slidesToScroll:s,slidesToShow:f,infinite:a}),b={onMouseEnter:o,onMouseOver:r,onMouseLeave:n},g=[],p=0;p<x;p++){var v=(p+1)*s-1,k=a?v:ce(v,0,m-1),h=k-(s-1),w=a?h:ce(h,0,m-1),T=O({"slick-active":a?u>=w&&u<=k:u===w}),C={message:"dots",index:p,slidesToScroll:s,currentSlide:u},z=this.clickHandler.bind(this,C);g=g.concat(y.createElement("li",{key:p,className:T},y.cloneElement(this.props.customPaging(p),{onClick:z})))}return y.cloneElement(this.props.appendDots(g),d({className:this.props.dotsClass},b))}}])}(y.PureComponent);function He(l,t,i){return t=W(t),G(l,U()?Reflect.construct(t,i||[],W(l).constructor):t.apply(l,i))}var zt=function(l){function t(){return F(this,t),He(this,t,arguments)}return $(t,l),X(t,[{key:"clickHandler",value:function(e,o){o&&o.preventDefault(),this.props.clickHandler(e,o)}},{key:"render",value:function(){var e={"slick-arrow":!0,"slick-prev":!0},o=this.clickHandler.bind(this,{message:"previous"});!this.props.infinite&&(this.props.currentSlide===0||this.props.slideCount<=this.props.slidesToShow)&&(e["slick-disabled"]=!0,o=null);var r={key:"0","data-role":"none",className:O(e),style:{display:"block"},onClick:o},n={currentSlide:this.props.currentSlide,slideCount:this.props.slideCount},a;return this.props.prevArrow?a=y.cloneElement(this.props.prevArrow,d(d({},r),n)):a=y.createElement("button",B({key:"0",type:"button"},r)," ","Previous"),a}}])}(y.PureComponent),Lt=function(l){function t(){return F(this,t),He(this,t,arguments)}return $(t,l),X(t,[{key:"clickHandler",value:function(e,o){o&&o.preventDefault(),this.props.clickHandler(e,o)}},{key:"render",value:function(){var e={"slick-arrow":!0,"slick-next":!0},o=this.clickHandler.bind(this,{message:"next"});Z(this.props)||(e["slick-disabled"]=!0,o=null);var r={key:"1","data-role":"none",className:O(e),style:{display:"block"},onClick:o},n={currentSlide:this.props.currentSlide,slideCount:this.props.slideCount},a;return this.props.nextArrow?a=y.cloneElement(this.props.nextArrow,d(d({},r),n)):a=y.createElement("button",B({key:"1",type:"button"},r)," ","Next"),a}}])}(y.PureComponent),jt=["animating"];function Mt(l,t,i){return t=W(t),G(l,U()?Reflect.construct(t,i||[],W(l).constructor):t.apply(l,i))}var Ht=function(l){function t(i){var e;F(this,t),e=Mt(this,t,[i]),S(e,"listRefHandler",function(r){return e.list=r}),S(e,"trackRefHandler",function(r){return e.track=r}),S(e,"adaptHeight",function(){if(e.props.adaptiveHeight&&e.list){var r=e.list.querySelector('[data-index="'.concat(e.state.currentSlide,'"]'));e.list.style.height=pe(r)+"px"}}),S(e,"componentDidMount",function(){if(e.props.onInit&&e.props.onInit(),e.props.lazyLoad){var r=J(d(d({},e.props),e.state));r.length>0&&(e.setState(function(a){return{lazyLoadedList:a.lazyLoadedList.concat(r)}}),e.props.onLazyLoad&&e.props.onLazyLoad(r))}var n=d({listRef:e.list,trackRef:e.track},e.props);e.updateState(n,!0,function(){e.adaptHeight(),e.props.autoplay&&e.autoPlay("playing")}),e.props.lazyLoad==="progressive"&&(e.lazyLoadTimer=setInterval(e.progressiveLazyLoad,1e3)),e.ro=new Xe(function(){e.state.animating?(e.onWindowResized(!1),e.callbackTimers.push(setTimeout(function(){return e.onWindowResized()},e.props.speed))):e.onWindowResized()}),e.ro.observe(e.list),document.querySelectorAll&&Array.prototype.forEach.call(document.querySelectorAll(".slick-slide"),function(a){a.onfocus=e.props.pauseOnFocus?e.onSlideFocus:null,a.onblur=e.props.pauseOnFocus?e.onSlideBlur:null}),window.addEventListener?window.addEventListener("resize",e.onWindowResized):window.attachEvent("onresize",e.onWindowResized)}),S(e,"componentWillUnmount",function(){e.animationEndCallback&&clearTimeout(e.animationEndCallback),e.lazyLoadTimer&&clearInterval(e.lazyLoadTimer),e.callbackTimers.length&&(e.callbackTimers.forEach(function(r){return clearTimeout(r)}),e.callbackTimers=[]),window.addEventListener?window.removeEventListener("resize",e.onWindowResized):window.detachEvent("onresize",e.onWindowResized),e.autoplayTimer&&clearInterval(e.autoplayTimer),e.ro.disconnect()}),S(e,"componentDidUpdate",function(r){if(e.checkImagesLoad(),e.props.onReInit&&e.props.onReInit(),e.props.lazyLoad){var n=J(d(d({},e.props),e.state));n.length>0&&(e.setState(function(f){return{lazyLoadedList:f.lazyLoadedList.concat(n)}}),e.props.onLazyLoad&&e.props.onLazyLoad(n))}e.adaptHeight();var a=d(d({listRef:e.list,trackRef:e.track},e.props),e.state),s=e.didPropsChange(r);s&&e.updateState(a,s,function(){e.state.currentSlide>=y.Children.count(e.props.children)&&e.changeSlide({message:"index",index:y.Children.count(e.props.children)-e.props.slidesToShow,currentSlide:e.state.currentSlide}),(r.autoplay!==e.props.autoplay||r.autoplaySpeed!==e.props.autoplaySpeed)&&(!r.autoplay&&e.props.autoplay?e.autoPlay("playing"):e.props.autoplay?e.autoPlay("update"):e.pause("paused"))})}),S(e,"onWindowResized",function(r){e.debouncedResize&&e.debouncedResize.cancel(),e.debouncedResize=Ze(50,function(){return e.resizeWindow(r)}),e.debouncedResize()}),S(e,"resizeWindow",function(){var r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!0,n=!!(e.track&&e.track.node);if(n){var a=d(d({listRef:e.list,trackRef:e.track},e.props),e.state);e.updateState(a,r,function(){e.props.autoplay?e.autoPlay("update"):e.pause("paused")}),e.setState({animating:!1}),clearTimeout(e.animationEndCallback),delete e.animationEndCallback}}),S(e,"updateState",function(r,n,a){var s=at(r);r=d(d(d({},r),s),{},{slideIndex:s.currentSlide});var f=V(r);r=d(d({},r),{},{left:f});var m=Y(r);(n||y.Children.count(e.props.children)!==y.Children.count(r.children))&&(s.trackStyle=m),e.setState(s,a)}),S(e,"ssrInit",function(){if(e.props.variableWidth){var r=0,n=0,a=[],s=R(d(d(d({},e.props),e.state),{},{slideCount:e.props.children.length})),f=Q(d(d(d({},e.props),e.state),{},{slideCount:e.props.children.length}));e.props.children.forEach(function(z){a.push(z.props.style.width),r+=z.props.style.width});for(var m=0;m<s;m++)n+=a[a.length-1-m],r+=a[a.length-1-m];for(var u=0;u<f;u++)r+=a[u];for(var x=0;x<e.state.currentSlide;x++)n+=a[x];var b={width:r+"px",left:-n+"px"};if(e.props.centerMode){var g="".concat(a[e.state.currentSlide],"px");b.left="calc(".concat(b.left," + (100% - ").concat(g,") / 2 ) ")}return{trackStyle:b}}var p=y.Children.count(e.props.children),v=d(d(d({},e.props),e.state),{},{slideCount:p}),k=R(v)+Q(v)+p,h=100/e.props.slidesToShow*k,w=100/k,T=-w*(R(v)+e.state.currentSlide)*h/100;e.props.centerMode&&(T+=(100-w*h/100)/2);var C={width:h+"%",left:T+"%"};return{slideWidth:w+"%",trackStyle:C}}),S(e,"checkImagesLoad",function(){var r=e.list&&e.list.querySelectorAll&&e.list.querySelectorAll(".slick-slide img")||[],n=r.length,a=0;Array.prototype.forEach.call(r,function(s){var f=function(){return++a&&a>=n&&e.onWindowResized()};if(!s.onclick)s.onclick=function(){return s.parentNode.focus()};else{var m=s.onclick;s.onclick=function(u){m(u),s.parentNode.focus()}}s.onload||(e.props.lazyLoad?s.onload=function(){e.adaptHeight(),e.callbackTimers.push(setTimeout(e.onWindowResized,e.props.speed))}:(s.onload=f,s.onerror=function(){f(),e.props.onLazyLoadError&&e.props.onLazyLoadError()}))})}),S(e,"progressiveLazyLoad",function(){for(var r=[],n=d(d({},e.props),e.state),a=e.state.currentSlide;a<e.state.slideCount+Q(n);a++)if(e.state.lazyLoadedList.indexOf(a)<0){r.push(a);break}for(var s=e.state.currentSlide-1;s>=-R(n);s--)if(e.state.lazyLoadedList.indexOf(s)<0){r.push(s);break}r.length>0?(e.setState(function(f){return{lazyLoadedList:f.lazyLoadedList.concat(r)}}),e.props.onLazyLoad&&e.props.onLazyLoad(r)):e.lazyLoadTimer&&(clearInterval(e.lazyLoadTimer),delete e.lazyLoadTimer)}),S(e,"slideHandler",function(r){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,a=e.props,s=a.asNavFor,f=a.beforeChange,m=a.onLazyLoad,u=a.speed,x=a.afterChange,b=e.state.currentSlide,g=ot(d(d(d({index:r},e.props),e.state),{},{trackRef:e.track,useCSS:e.props.useCSS&&!n})),p=g.state,v=g.nextState;if(p){f&&f(b,p.currentSlide);var k=p.lazyLoadedList.filter(function(h){return e.state.lazyLoadedList.indexOf(h)<0});m&&k.length>0&&m(k),!e.props.waitForAnimate&&e.animationEndCallback&&(clearTimeout(e.animationEndCallback),x&&x(b),delete e.animationEndCallback),e.setState(p,function(){s&&e.asNavForIndex!==r&&(e.asNavForIndex=r,s.innerSlider.slideHandler(r)),v&&(e.animationEndCallback=setTimeout(function(){var h=v.animating,w=Fe(v,jt);e.setState(w,function(){e.callbackTimers.push(setTimeout(function(){return e.setState({animating:h})},10)),x&&x(p.currentSlide),delete e.animationEndCallback})},u))})}}),S(e,"changeSlide",function(r){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,a=d(d({},e.props),e.state),s=lt(a,r);if(!(s!==0&&!s)&&(n===!0?e.slideHandler(s,n):e.slideHandler(s),e.props.autoplay&&e.autoPlay("update"),e.props.focusOnSelect)){var f=e.list.querySelectorAll(".slick-current");f[0]&&f[0].focus()}}),S(e,"clickHandler",function(r){e.clickable===!1&&(r.stopPropagation(),r.preventDefault()),e.clickable=!0}),S(e,"keyHandler",function(r){var n=st(r,e.props.accessibility,e.props.rtl);n!==""&&e.changeSlide({message:n})}),S(e,"selectHandler",function(r){e.changeSlide(r)}),S(e,"disableBodyScroll",function(){var r=function(a){a=a||window.event,a.preventDefault&&a.preventDefault(),a.returnValue=!1};window.ontouchmove=r}),S(e,"enableBodyScroll",function(){window.ontouchmove=null}),S(e,"swipeStart",function(r){e.props.verticalSwiping&&e.disableBodyScroll();var n=dt(r,e.props.swipe,e.props.draggable);n!==""&&e.setState(n)}),S(e,"swipeMove",function(r){var n=ct(r,d(d(d({},e.props),e.state),{},{trackRef:e.track,listRef:e.list,slideIndex:e.state.currentSlide}));n&&(n.swiping&&(e.clickable=!1),e.setState(n))}),S(e,"swipeEnd",function(r){var n=ut(r,d(d(d({},e.props),e.state),{},{trackRef:e.track,listRef:e.list,slideIndex:e.state.currentSlide}));if(n){var a=n.triggerSlideHandler;delete n.triggerSlideHandler,e.setState(n),a!==void 0&&(e.slideHandler(a),e.props.verticalSwiping&&e.enableBodyScroll())}}),S(e,"touchEnd",function(r){e.swipeEnd(r),e.clickable=!0}),S(e,"slickPrev",function(){e.callbackTimers.push(setTimeout(function(){return e.changeSlide({message:"previous"})},0))}),S(e,"slickNext",function(){e.callbackTimers.push(setTimeout(function(){return e.changeSlide({message:"next"})},0))}),S(e,"slickGoTo",function(r){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(r=Number(r),isNaN(r))return"";e.callbackTimers.push(setTimeout(function(){return e.changeSlide({message:"index",index:r,currentSlide:e.state.currentSlide},n)},0))}),S(e,"play",function(){var r;if(e.props.rtl)r=e.state.currentSlide-e.props.slidesToScroll;else if(Z(d(d({},e.props),e.state)))r=e.state.currentSlide+e.props.slidesToScroll;else return!1;e.slideHandler(r)}),S(e,"autoPlay",function(r){e.autoplayTimer&&clearInterval(e.autoplayTimer);var n=e.state.autoplaying;if(r==="update"){if(n==="hovered"||n==="focused"||n==="paused")return}else if(r==="leave"){if(n==="paused"||n==="focused")return}else if(r==="blur"&&(n==="paused"||n==="hovered"))return;e.autoplayTimer=setInterval(e.play,e.props.autoplaySpeed+50),e.setState({autoplaying:"playing"})}),S(e,"pause",function(r){e.autoplayTimer&&(clearInterval(e.autoplayTimer),e.autoplayTimer=null);var n=e.state.autoplaying;r==="paused"?e.setState({autoplaying:"paused"}):r==="focused"?(n==="hovered"||n==="playing")&&e.setState({autoplaying:"focused"}):n==="playing"&&e.setState({autoplaying:"hovered"})}),S(e,"onDotsOver",function(){return e.props.autoplay&&e.pause("hovered")}),S(e,"onDotsLeave",function(){return e.props.autoplay&&e.state.autoplaying==="hovered"&&e.autoPlay("leave")}),S(e,"onTrackOver",function(){return e.props.autoplay&&e.pause("hovered")}),S(e,"onTrackLeave",function(){return e.props.autoplay&&e.state.autoplaying==="hovered"&&e.autoPlay("leave")}),S(e,"onSlideFocus",function(){return e.props.autoplay&&e.pause("focused")}),S(e,"onSlideBlur",function(){return e.props.autoplay&&e.state.autoplaying==="focused"&&e.autoPlay("blur")}),S(e,"render",function(){var r=O("slick-slider",e.props.className,{"slick-vertical":e.props.vertical,"slick-initialized":!0}),n=d(d({},e.props),e.state),a=re(n,["fade","cssEase","speed","infinite","centerMode","focusOnSelect","currentSlide","lazyLoad","lazyLoadedList","rtl","slideWidth","slideHeight","listHeight","vertical","slidesToShow","slidesToScroll","slideCount","trackStyle","variableWidth","unslick","centerPadding","targetSlide","useCSS"]),s=e.props.pauseOnHover;a=d(d({},a),{},{onMouseEnter:s?e.onTrackOver:null,onMouseLeave:s?e.onTrackLeave:null,onMouseOver:s?e.onTrackOver:null,focusOnSelect:e.props.focusOnSelect&&e.clickable?e.selectHandler:null});var f;if(e.props.dots===!0&&e.state.slideCount>=e.props.slidesToShow){var m=re(n,["dotsClass","slideCount","slidesToShow","currentSlide","slidesToScroll","clickHandler","children","customPaging","infinite","appendDots"]),u=e.props.pauseOnDotsHover;m=d(d({},m),{},{clickHandler:e.changeSlide,onMouseEnter:u?e.onDotsLeave:null,onMouseOver:u?e.onDotsOver:null,onMouseLeave:u?e.onDotsLeave:null}),f=y.createElement(Tt,m)}var x,b,g=re(n,["infinite","centerMode","currentSlide","slideCount","slidesToShow","prevArrow","nextArrow"]);g.clickHandler=e.changeSlide,e.props.arrows&&(x=y.createElement(zt,g),b=y.createElement(Lt,g));var p=null;e.props.vertical&&(p={height:e.state.listHeight});var v=null;e.props.vertical===!1?e.props.centerMode===!0&&(v={padding:"0px "+e.props.centerPadding}):e.props.centerMode===!0&&(v={padding:e.props.centerPadding+" 0px"});var k=d(d({},p),v),h=e.props.touchMove,w={className:"slick-list",style:k,onClick:e.clickHandler,onMouseDown:h?e.swipeStart:null,onMouseMove:e.state.dragging&&h?e.swipeMove:null,onMouseUp:h?e.swipeEnd:null,onMouseLeave:e.state.dragging&&h?e.swipeEnd:null,onTouchStart:h?e.swipeStart:null,onTouchMove:e.state.dragging&&h?e.swipeMove:null,onTouchEnd:h?e.touchEnd:null,onTouchCancel:e.state.dragging&&h?e.swipeEnd:null,onKeyDown:e.props.accessibility?e.keyHandler:null},T={className:r,dir:"ltr",style:e.props.style};return e.props.unslick&&(w={className:"slick-list"},T={className:r,style:e.props.style}),y.createElement("div",T,e.props.unslick?"":x,y.createElement("div",B({ref:e.listRefHandler},w),y.createElement(wt,B({ref:e.trackRefHandler},a),e.props.children)),e.props.unslick?"":b,e.props.unslick?"":f)}),e.list=null,e.track=null,e.state=d(d({},it),{},{currentSlide:e.props.initialSlide,targetSlide:e.props.initialSlide?e.props.initialSlide:0,slideCount:y.Children.count(e.props.children)}),e.callbackTimers=[],e.clickable=!0,e.debouncedResize=null;var o=e.ssrInit();return e.state=d(d({},e.state),o),e}return $(t,l),X(t,[{key:"didPropsChange",value:function(e){for(var o=!1,r=0,n=Object.keys(this.props);r<n.length;r++){var a=n[r];if(!e.hasOwnProperty(a)){o=!0;break}if(!($e(e[a])==="object"||typeof e[a]=="function"||isNaN(e[a]))&&e[a]!==this.props[a]){o=!0;break}}return o||y.Children.count(this.props.children)!==y.Children.count(e.children)}}])}(y.Component),oe,we;function Et(){if(we)return oe;we=1;var l=function(t){return t.replace(/[A-Z]/g,function(i){return"-"+i.toLowerCase()}).toLowerCase()};return oe=l,oe}var le,ke;function Ot(){if(ke)return le;ke=1;var l=Et(),t=function(o){var r=/[height|width]$/;return r.test(o)},i=function(o){var r="",n=Object.keys(o);return n.forEach(function(a,s){var f=o[a];a=l(a),t(a)&&typeof f=="number"&&(f=f+"px"),f===!0?r+=a:f===!1?r+="not "+a:r+="("+a+": "+f+")",s<n.length-1&&(r+=" and ")}),r},e=function(o){var r="";return typeof o=="string"?o:o instanceof Array?(o.forEach(function(n,a){r+=i(n),a<o.length-1&&(r+=", ")}),r):i(o)};return le=e,le}var Wt=Ot();const se=Pe(Wt);function Rt(l,t,i){return t=W(t),G(l,U()?Reflect.construct(t,i||[],W(l).constructor):t.apply(l,i))}var It=function(l){function t(i){var e;return F(this,t),e=Rt(this,t,[i]),S(e,"innerSliderRefHandler",function(o){return e.innerSlider=o}),S(e,"slickPrev",function(){return e.innerSlider.slickPrev()}),S(e,"slickNext",function(){return e.innerSlider.slickNext()}),S(e,"slickGoTo",function(o){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;return e.innerSlider.slickGoTo(o,r)}),S(e,"slickPause",function(){return e.innerSlider.pause("paused")}),S(e,"slickPlay",function(){return e.innerSlider.autoPlay("play")}),e.state={breakpoint:null},e._responsiveMediaHandlers=[],e}return $(t,l),X(t,[{key:"media",value:function(e,o){var r=window.matchMedia(e),n=function(s){var f=s.matches;f&&o()};r.addListener(n),n(r),this._responsiveMediaHandlers.push({mql:r,query:e,listener:n})}},{key:"componentDidMount",value:function(){var e=this;if(this.props.responsive){var o=this.props.responsive.map(function(n){return n.breakpoint});o.sort(function(n,a){return n-a}),o.forEach(function(n,a){var s;a===0?s=se({minWidth:0,maxWidth:n}):s=se({minWidth:o[a-1]+1,maxWidth:n}),be()&&e.media(s,function(){e.setState({breakpoint:n})})});var r=se({minWidth:o.slice(-1)[0]});be()&&this.media(r,function(){e.setState({breakpoint:null})})}}},{key:"componentWillUnmount",value:function(){this._responsiveMediaHandlers.forEach(function(e){e.mql.removeListener(e.listener)})}},{key:"render",value:function(){var e=this,o,r;this.state.breakpoint?(r=this.props.responsive.filter(function(p){return p.breakpoint===e.state.breakpoint}),o=r[0].settings==="unslick"?"unslick":d(d(d({},de),this.props),r[0].settings)):o=d(d({},de),this.props),o.centerMode&&(o.slidesToScroll>1,o.slidesToScroll=1),o.fade&&(o.slidesToShow>1,o.slidesToScroll>1,o.slidesToShow=1,o.slidesToScroll=1);var n=y.Children.toArray(this.props.children);n=n.filter(function(p){return typeof p=="string"?!!p.trim():!!p}),o.variableWidth&&(o.rows>1||o.slidesPerRow>1)&&(console.warn("variableWidth is not supported in case of rows > 1 or slidesPerRow > 1"),o.variableWidth=!1);for(var a=[],s=null,f=0;f<n.length;f+=o.rows*o.slidesPerRow){for(var m=[],u=f;u<f+o.rows*o.slidesPerRow;u+=o.slidesPerRow){for(var x=[],b=u;b<u+o.slidesPerRow&&(o.variableWidth&&n[b].props.style&&(s=n[b].props.style.width),!(b>=n.length));b+=1)x.push(y.cloneElement(n[b],{key:100*f+10*u+b,tabIndex:-1,style:{width:"".concat(100/o.slidesPerRow,"%"),display:"inline-block"}}));m.push(y.createElement("div",{key:10*f+u},x))}o.variableWidth?a.push(y.createElement("div",{key:f,style:{width:s}},m)):a.push(y.createElement("div",{key:f},m))}if(o==="unslick"){var g="regular slider "+(this.props.className||"");return y.createElement("div",{className:g},n)}else a.length<=o.slidesToShow&&!o.infinite&&(o.unslick=!0);return y.createElement(Ht,B({style:this.props.style,ref:this.innerSliderRefHandler},xt(o)),a)}}])}(y.Component);const ge="--dot-duration",At=l=>{const{componentCls:t,antCls:i}=l;return{[t]:Object.assign(Object.assign({},Ye(l)),{".slick-slider":{position:"relative",display:"block",boxSizing:"border-box",touchAction:"pan-y",WebkitTouchCallout:"none",WebkitTapHighlightColor:"transparent",".slick-track, .slick-list":{transform:"translate3d(0, 0, 0)",touchAction:"pan-y"}},".slick-list":{position:"relative",display:"block",margin:0,padding:0,overflow:"hidden","&:focus":{outline:"none"},"&.dragging":{cursor:"pointer"},".slick-slide":{pointerEvents:"none",[`input${i}-radio-input, input${i}-checkbox-input`]:{visibility:"hidden"},"&.slick-active":{pointerEvents:"auto",[`input${i}-radio-input, input${i}-checkbox-input`]:{visibility:"visible"}},"> div > div":{verticalAlign:"bottom"}}},".slick-track":{position:"relative",top:0,insetInlineStart:0,display:"block","&::before, &::after":{display:"table",content:'""'},"&::after":{clear:"both"}},".slick-slide":{display:"none",float:"left",height:"100%",minHeight:1,img:{display:"block"},"&.dragging img":{pointerEvents:"none"}},".slick-initialized .slick-slide":{display:"block"},".slick-vertical .slick-slide":{display:"block",height:"auto"}})}},Pt=l=>{const{componentCls:t,motionDurationSlow:i,arrowSize:e,arrowOffset:o}=l,r=l.calc(e).div(Math.SQRT2).equal();return{[t]:{".slick-prev, .slick-next":{position:"absolute",top:"50%",width:e,height:e,transform:"translateY(-50%)",color:"#fff",opacity:.4,background:"transparent",padding:0,lineHeight:0,border:0,outline:"none",cursor:"pointer",zIndex:1,transition:`opacity ${i}`,"&:hover, &:focus":{opacity:1},"&.slick-disabled":{pointerEvents:"none",opacity:0},"&::after":{boxSizing:"border-box",position:"absolute",top:l.calc(e).sub(r).div(2).equal(),insetInlineStart:l.calc(e).sub(r).div(2).equal(),display:"inline-block",width:r,height:r,border:"0 solid currentcolor",borderInlineStartWidth:2,borderBlockStartWidth:2,borderRadius:1,content:'""'}},".slick-prev":{insetInlineStart:o,"&::after":{transform:"rotate(-45deg)"}},".slick-next":{insetInlineEnd:o,"&::after":{transform:"rotate(135deg)"}}}}},Nt=l=>{const{componentCls:t,dotOffset:i,dotWidth:e,dotHeight:o,dotGap:r,colorBgContainer:n,motionDurationSlow:a}=l;return{[t]:{".slick-dots":{position:"absolute",insetInlineEnd:0,bottom:0,insetInlineStart:0,zIndex:15,display:"flex !important",justifyContent:"center",paddingInlineStart:0,margin:0,listStyle:"none","&-bottom":{bottom:i},"&-top":{top:i,bottom:"auto"},li:{position:"relative",display:"inline-block",flex:"0 1 auto",boxSizing:"content-box",width:e,height:o,marginInline:r,padding:0,textAlign:"center",textIndent:-999,verticalAlign:"top",transition:`all ${a}`,borderRadius:o,overflow:"hidden","&::after":{display:"block",position:"absolute",top:0,insetInlineStart:0,width:"100%",height:o,content:'""',background:n,borderRadius:o,opacity:1,outline:"none",cursor:"pointer",overflow:"hidden",transform:"translate3d(-100%, 0, 0)"},button:{position:"relative",display:"block",width:"100%",height:o,padding:0,color:"transparent",fontSize:0,background:n,border:0,borderRadius:o,outline:"none",cursor:"pointer",opacity:.2,transition:`all ${a}`,overflow:"hidden","&:hover":{opacity:.75},"&::after":{position:"absolute",inset:l.calc(r).mul(-1).equal(),content:'""'}},"&.slick-active":{width:l.dotActiveWidth,position:"relative","&:hover":{opacity:1},"&::after":{transform:"translate3d(0, 0, 0)",transition:`transform var(${ge}) ease-out`}}}}}}},Dt=l=>{const{componentCls:t,dotOffset:i,arrowOffset:e,marginXXS:o}=l,r={width:l.dotHeight,height:l.dotWidth};return{[`${t}-vertical`]:{".slick-prev, .slick-next":{insetInlineStart:"50%",marginBlockStart:"unset",transform:"translateX(-50%)"},".slick-prev":{insetBlockStart:e,insetInlineStart:"50%","&::after":{transform:"rotate(45deg)"}},".slick-next":{insetBlockStart:"auto",insetBlockEnd:e,"&::after":{transform:"rotate(-135deg)"}},".slick-dots":{top:"50%",bottom:"auto",flexDirection:"column",width:l.dotHeight,height:"auto",margin:0,transform:"translateY(-50%)","&-left":{insetInlineEnd:"auto",insetInlineStart:i},"&-right":{insetInlineEnd:i,insetInlineStart:"auto"},li:Object.assign(Object.assign({},r),{margin:`${Ve(o)} 0`,verticalAlign:"baseline",button:r,"&::after":Object.assign(Object.assign({},r),{height:0}),"&.slick-active":Object.assign(Object.assign({},r),{button:r,"&::after":Object.assign(Object.assign({},r),{transition:`height var(${ge}) ease-out`})})})}}}},Bt=l=>{const{componentCls:t}=l;return[{[`${t}-rtl`]:{direction:"rtl",".slick-dots":{[`${t}-rtl&`]:{flexDirection:"row-reverse"}}}},{[`${t}-vertical`]:{".slick-dots":{[`${t}-rtl&`]:{flexDirection:"column"}}}}]},$t=l=>({arrowSize:16,arrowOffset:l.marginXS,dotWidth:16,dotHeight:3,dotGap:l.marginXXS,dotOffset:12,dotWidthActive:24,dotActiveWidth:24}),Xt=qe("Carousel",l=>[At(l),Pt(l),Nt(l),Dt(l),Bt(l)],$t,{deprecatedTokens:[["dotWidthActive","dotActiveWidth"]]});var Ee=function(l,t){var i={};for(var e in l)Object.prototype.hasOwnProperty.call(l,e)&&t.indexOf(e)<0&&(i[e]=l[e]);if(l!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,e=Object.getOwnPropertySymbols(l);o<e.length;o++)t.indexOf(e[o])<0&&Object.prototype.propertyIsEnumerable.call(l,e[o])&&(i[e[o]]=l[e[o]]);return i};const Ce="slick-dots",Te=l=>{var{currentSlide:t,slideCount:i}=l,e=Ee(l,["currentSlide","slideCount"]);return L.createElement("button",Object.assign({type:"button"},e))},Ft=L.forwardRef((l,t)=>{const{dots:i=!0,arrows:e=!1,prevArrow:o=L.createElement(Te,{"aria-label":"prev"}),nextArrow:r=L.createElement(Te,{"aria-label":"next"}),draggable:n=!1,waitForAnimate:a=!1,dotPosition:s="bottom",vertical:f=s==="left"||s==="right",rootClassName:m,className:u,style:x,id:b,autoplay:g=!1,autoplaySpeed:p=3e3}=l,v=Ee(l,["dots","arrows","prevArrow","nextArrow","draggable","waitForAnimate","dotPosition","vertical","rootClassName","className","style","id","autoplay","autoplaySpeed"]),{getPrefixCls:k,direction:h,className:w,style:T}=Ge("carousel"),C=L.useRef(null),z=(Ie,Ae=!1)=>{C.current.slickGoTo(Ie,Ae)};L.useImperativeHandle(t,()=>({goTo:z,autoPlay:C.current.innerSlider.autoPlay,innerSlider:C.current.innerSlider,prev:C.current.slickPrev,next:C.current.slickNext}),[C.current]);const M=L.useRef(L.Children.count(l.children));L.useEffect(()=>{M.current!==L.Children.count(l.children)&&(z(l.initialSlide||0,!1),M.current=L.Children.count(l.children))},[l.children]);const H=Object.assign({vertical:f,className:O(u,w),style:Object.assign(Object.assign({},T),x),autoplay:!!g},v);H.effect==="fade"&&(H.fade=!0);const I=k("carousel",H.prefixCls),A=!!i,ee=O(Ce,`${Ce}-${s}`,typeof i=="boolean"?!1:i?.className),[E,P,Oe]=Xt(I),We=O(I,{[`${I}-rtl`]:h==="rtl",[`${I}-vertical`]:H.vertical},P,Oe,m),Re=g&&(typeof g=="object"?g.dotDuration:!1)?{[ge]:`${p}ms`}:{};return E(L.createElement("div",{className:We,id:b,style:Re},L.createElement(It,Object.assign({ref:C},H,{dots:A,dotsClass:ee,arrows:e,prevArrow:o,nextArrow:r,draggable:n,verticalSwiping:f,autoplaySpeed:p,waitForAnimate:a}))))});var qt={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M854.4 800.9c.2-.3.5-.6.7-.9C920.6 722.1 960 621.7 960 512s-39.4-210.1-104.8-288c-.2-.3-.5-.5-.7-.8-1.1-1.3-2.1-2.5-3.2-3.7-.4-.5-.8-.9-1.2-1.4l-4.1-4.7-.1-.1c-1.5-1.7-3.1-3.4-4.6-5.1l-.1-.1c-3.2-3.4-6.4-6.8-9.7-10.1l-.1-.1-4.8-4.8-.3-.3c-1.5-1.5-3-2.9-4.5-4.3-.5-.5-1-1-1.6-1.5-1-1-2-1.9-3-2.8-.3-.3-.7-.6-1-1C736.4 109.2 629.5 64 512 64s-224.4 45.2-304.3 119.2c-.3.3-.7.6-1 1-1 .9-2 1.9-3 2.9-.5.5-1 1-1.6 1.5-1.5 1.4-3 2.9-4.5 4.3l-.3.3-4.8 4.8-.1.1c-3.3 3.3-6.5 6.7-9.7 10.1l-.1.1c-1.6 1.7-3.1 3.4-4.6 5.1l-.1.1c-1.4 1.5-2.8 3.1-4.1 4.7-.4.5-.8.9-1.2 1.4-1.1 1.2-2.1 2.5-3.2 3.7-.2.3-.5.5-.7.8C103.4 301.9 64 402.3 64 512s39.4 210.1 104.8 288c.2.3.5.6.7.9l3.1 3.7c.4.5.8.9 1.2 1.4l4.1 4.7c0 .1.1.1.1.2 1.5 1.7 3 3.4 4.6 5l.1.1c3.2 3.4 6.4 6.8 9.6 10.1l.1.1c1.6 1.6 3.1 3.2 4.7 4.7l.3.3c3.3 3.3 6.7 6.5 10.1 9.6 80.1 74 187 119.2 304.5 119.2s224.4-45.2 304.3-119.2a300 300 0 0010-9.6l.3-.3c1.6-1.6 3.2-3.1 4.7-4.7l.1-.1c3.3-3.3 6.5-6.7 9.6-10.1l.1-.1c1.5-1.7 3.1-3.3 4.6-5 0-.1.1-.1.1-.2 1.4-1.5 2.8-3.1 4.1-4.7.4-.5.8-.9 1.2-1.4a99 99 0 003.3-3.7zm4.1-142.6c-13.8 32.6-32 62.8-54.2 90.2a444.07 444.07 0 00-81.5-55.9c11.6-46.9 18.8-98.4 20.7-152.6H887c-3 40.9-12.6 80.6-28.5 118.3zM887 484H743.5c-1.9-54.2-9.1-105.7-20.7-152.6 29.3-15.6 56.6-34.4 81.5-55.9A373.86 373.86 0 01887 484zM658.3 165.5c39.7 16.8 75.8 40 107.6 69.2a394.72 394.72 0 01-59.4 41.8c-15.7-45-35.8-84.1-59.2-115.4 3.7 1.4 7.4 2.9 11 4.4zm-90.6 700.6c-9.2 7.2-18.4 12.7-27.7 16.4V697a389.1 389.1 0 01115.7 26.2c-8.3 24.6-17.9 47.3-29 67.8-17.4 32.4-37.8 58.3-59 75.1zm59-633.1c11 20.6 20.7 43.3 29 67.8A389.1 389.1 0 01540 327V141.6c9.2 3.7 18.5 9.1 27.7 16.4 21.2 16.7 41.6 42.6 59 75zM540 640.9V540h147.5c-1.6 44.2-7.1 87.1-16.3 127.8l-.3 1.2A445.02 445.02 0 00540 640.9zm0-156.9V383.1c45.8-2.8 89.8-12.5 130.9-28.1l.3 1.2c9.2 40.7 14.7 83.5 16.3 127.8H540zm-56 56v100.9c-45.8 2.8-89.8 12.5-130.9 28.1l-.3-1.2c-9.2-40.7-14.7-83.5-16.3-127.8H484zm-147.5-56c1.6-44.2 7.1-87.1 16.3-127.8l.3-1.2c41.1 15.6 85 25.3 130.9 28.1V484H336.5zM484 697v185.4c-9.2-3.7-18.5-9.1-27.7-16.4-21.2-16.7-41.7-42.7-59.1-75.1-11-20.6-20.7-43.3-29-67.8 37.2-14.6 75.9-23.3 115.8-26.1zm0-370a389.1 389.1 0 01-115.7-26.2c8.3-24.6 17.9-47.3 29-67.8 17.4-32.4 37.8-58.4 59.1-75.1 9.2-7.2 18.4-12.7 27.7-16.4V327zM365.7 165.5c3.7-1.5 7.3-3 11-4.4-23.4 31.3-43.5 70.4-59.2 115.4-21-12-40.9-26-59.4-41.8 31.8-29.2 67.9-52.4 107.6-69.2zM165.5 365.7c13.8-32.6 32-62.8 54.2-90.2 24.9 21.5 52.2 40.3 81.5 55.9-11.6 46.9-18.8 98.4-20.7 152.6H137c3-40.9 12.6-80.6 28.5-118.3zM137 540h143.5c1.9 54.2 9.1 105.7 20.7 152.6a444.07 444.07 0 00-81.5 55.9A373.86 373.86 0 01137 540zm228.7 318.5c-39.7-16.8-75.8-40-107.6-69.2 18.5-15.8 38.4-29.7 59.4-41.8 15.7 45 35.8 84.1 59.2 115.4-3.7-1.4-7.4-2.9-11-4.4zm292.6 0c-3.7 1.5-7.3 3-11 4.4 23.4-31.3 43.5-70.4 59.2-115.4 21 12 40.9 26 59.4 41.8a373.81 373.81 0 01-107.6 69.2z"}}]},name:"global",theme:"outlined"};function fe(){return fe=Object.assign?Object.assign.bind():function(l){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var e in i)Object.prototype.hasOwnProperty.call(i,e)&&(l[e]=i[e])}return l},fe.apply(this,arguments)}const Yt=(l,t)=>L.createElement(Ue,fe({},l,{ref:t,icon:qt})),Vt=L.forwardRef(Yt),{Title:N,Paragraph:q,Text:j}=Ke;function vi({auth:l,services:t=[]}){const[i,e]=L.useState(!1),[o,r]=L.useState(!1),[n,a]=L.useState(null),s=[{id:1,name:"HospiPal for OPD Visits",description:"Escort and assist during doctor visits & diagnostics.",icon:"🧑‍⚕",color:"#1890ff"},{id:2,name:"HospiPal for Elderly Care",description:"Respectful companion for seniors (single visit or packages).",icon:"👵",color:"#52c41a"},{id:3,name:"HospiPal On-Call (Emergency)",description:"Quick HospiPal when family can't reach in time.",icon:"⚡",color:"#faad14"}],f=t.length>0?t:s;console.log("Services from backend:",t),console.log("Services being used in carousel:",f),console.log("First service data:",f[0]),console.log("ServicesData length:",f.length),console.log("ServicesData type:",typeof f),console.log("Is servicesData array:",Array.isArray(f)),L.useEffect(()=>{l&&l.user&&(r(!0),a(l.user))},[l]);const m=()=>{me.visit(route("booking.select-service"))},u=()=>{tt.info("Chat feature coming soon!")},x=g=>{r(!0),a(g)},b=g=>{me.visit(route("booking.select-service"))};return c.jsxs("div",{children:[c.jsx(Ne,{title:"HospiPal - Customer Dashboard"}),c.jsx(De,{auth:l}),c.jsxs("div",{style:{maxWidth:1200,margin:"0 auto",padding:"24px"},children:[c.jsx("div",{className:"mobile-top-spacing"}),c.jsxs("div",{style:{background:"#ffffff",padding:"64px 32px",borderRadius:"24px",textAlign:"center",marginBottom:64,boxShadow:"0 8px 32px rgba(0, 0, 0, 0.06)",border:"1px solid #f5f5f5",position:"relative",overflow:"hidden"},className:"hero-section",children:[c.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"linear-gradient(135deg, rgba(24, 144, 255, 0.02) 0%, rgba(24, 144, 255, 0.01) 100%)",zIndex:0}}),c.jsxs("div",{style:{position:"relative",zIndex:1},children:[c.jsxs(N,{level:1,style:{color:"#1a1a1a",fontSize:"3rem",fontWeight:800,lineHeight:1.1,maxWidth:900,margin:"0 auto 32px auto",letterSpacing:"-0.02em"},className:"hero-title",children:["Book a HospiPal Anytime,",c.jsx("br",{}),"From Anywhere"]}),c.jsx(q,{style:{fontSize:20,color:"#4a4a4a",maxWidth:800,margin:"0 auto 48px auto",lineHeight:1.7,fontWeight:400},className:"hero-subtitle",children:"Whether you're in Mumbai or miles away in Dubai, London, or New York — you can book a HospiPal for your loved ones. Families abroad, locals, and even foreigners trust us for trained, non-medical companion support in hospitals."}),c.jsxs("div",{style:{marginBottom:40,display:"flex",justifyContent:"center",gap:"20px",flexWrap:"wrap"},className:"hero-cta-container",children:[c.jsx(K,{type:"primary",size:"large",icon:c.jsx(te,{style:{fontSize:18,color:"#ffffff"}}),onClick:m,style:{background:"#1890ff",border:"none",height:60,padding:"0 48px",fontSize:16,fontWeight:600,borderRadius:"14px",boxShadow:"0 6px 16px rgba(24, 144, 255, 0.25)",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"10px",minWidth:"280px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},className:"hero-primary-button",children:"Book a HospiPal"}),c.jsx(K,{type:"default",size:"large",icon:c.jsx(_e,{}),onClick:u,style:{height:60,padding:"0 40px",fontSize:16,fontWeight:500,borderRadius:"14px",border:"2px solid #1890ff",color:"#1890ff",background:"#ffffff",minWidth:"200px"},className:"hero-secondary-button",children:"💬 Chat with Us"})]}),c.jsxs("div",{style:{display:"inline-flex",alignItems:"center",gap:16,padding:"24px 40px",background:"linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.04) 100%)",borderRadius:"20px",border:"1px solid rgba(24, 144, 255, 0.12)",maxWidth:"fit-content"},className:"hero-trust-indicator",children:[c.jsx(Qe,{style:{color:"#52c41a",fontSize:24,fontWeight:"bold"}}),c.jsx(j,{style:{color:"#4a4a4a",fontSize:16,fontWeight:500,lineHeight:1.4},className:"hero-trust-text",children:"Secure global booking."}),c.jsx("span",{style:{color:"#ff4d4f",fontSize:20},children:"📌"}),c.jsx(j,{style:{color:"#4a4a4a",fontSize:16,fontWeight:500,lineHeight:1.4},className:"hero-trust-text",children:"Instant confirmation."}),c.jsx(j,{style:{color:"#4a4a4a",fontSize:16,fontWeight:500,lineHeight:1.4},className:"hero-trust-text",children:"Local support delivered by HospiPals."})]})]})]}),c.jsx("div",{style:{background:"#ffffff",padding:"48px 32px",borderRadius:"20px",marginBottom:48,boxShadow:"0 4px 20px rgba(0, 0, 0, 0.06)",border:"1px solid #f5f5f5"},className:"trust-anchors-section",children:c.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:"32px",maxWidth:"1000px",margin:"0 auto"},className:"trust-anchors-grid",children:[c.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",padding:"24px",background:"linear-gradient(135deg, rgba(82, 196, 26, 0.05) 0%, rgba(82, 196, 26, 0.02) 100%)",borderRadius:"16px",border:"1px solid rgba(82, 196, 26, 0.1)"},className:"trust-anchor-item",children:[c.jsx("div",{style:{width:"48px",height:"48px",background:"#52c41a",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:c.jsx(ve,{style:{fontSize:24,color:"#ffffff"}})}),c.jsxs("div",{children:[c.jsx(j,{style:{fontSize:16,fontWeight:600,color:"#1a1a1a",display:"block",marginBottom:"4px"},children:"✅ Trained & Verified Companions"}),c.jsx(j,{style:{fontSize:14,color:"#666",lineHeight:1.5},children:"All our HospiPals are thoroughly vetted and trained"})]})]}),c.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",padding:"24px",background:"linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(24, 144, 255, 0.02) 100%)",borderRadius:"16px",border:"1px solid rgba(24, 144, 255, 0.1)"},className:"trust-anchor-item",children:[c.jsx("div",{style:{width:"48px",height:"48px",background:"#1890ff",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:c.jsx(te,{style:{fontSize:24,color:"#ffffff"}})}),c.jsxs("div",{children:[c.jsx(j,{style:{fontSize:16,fontWeight:600,color:"#1a1a1a",display:"block",marginBottom:"4px"},children:"✅ Transparent Pricing"}),c.jsx(j,{style:{fontSize:14,color:"#666",lineHeight:1.5},children:"No hidden fees, clear pricing upfront"})]})]}),c.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",padding:"24px",background:"linear-gradient(135deg, rgba(250, 173, 20, 0.05) 0%, rgba(250, 173, 20, 0.02) 100%)",borderRadius:"16px",border:"1px solid rgba(250, 173, 20, 0.1)"},className:"trust-anchor-item",children:[c.jsx("div",{style:{width:"48px",height:"48px",background:"#faad14",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:c.jsx(xe,{style:{fontSize:24,color:"#ffffff"}})}),c.jsxs("div",{children:[c.jsx(j,{style:{fontSize:16,fontWeight:600,color:"#1a1a1a",display:"block",marginBottom:"4px"},children:"✅ Flexible Rescheduling"}),c.jsx(j,{style:{fontSize:14,color:"#666",lineHeight:1.5},children:"Easy to reschedule or cancel when needed"})]})]}),c.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",padding:"24px",background:"linear-gradient(135deg, rgba(114, 46, 209, 0.05) 0%, rgba(114, 46, 209, 0.02) 100%)",borderRadius:"16px",border:"1px solid rgba(114, 46, 209, 0.1)"},className:"trust-anchor-item",children:[c.jsx("div",{style:{width:"48px",height:"48px",background:"#722ed1",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:c.jsx(Vt,{style:{fontSize:24,color:"#ffffff"}})}),c.jsxs("div",{children:[c.jsx(j,{style:{fontSize:16,fontWeight:600,color:"#1a1a1a",display:"block",marginBottom:"4px"},children:"✅ Global Booking. Local Care."}),c.jsx(j,{style:{fontSize:14,color:"#666",lineHeight:1.5},children:"Book from anywhere, care delivered locally"})]})]})]})}),c.jsxs("div",{style:{background:"#f8f9fa",padding:"64px 32px",borderRadius:"24px",marginBottom:48,boxShadow:"0 4px 20px rgba(0, 0, 0, 0.06)",border:"1px solid #e9ecef"},className:"our-services-section",children:[c.jsxs("div",{style:{textAlign:"center",marginBottom:48},children:[c.jsx(N,{level:2,style:{color:"#1a1a1a",marginBottom:16},children:"Our Services"}),c.jsx(q,{style:{color:"#666",fontSize:18,margin:0},children:"Choose the perfect HospiPal for your loved ones."})]}),c.jsx("div",{style:{position:"relative",maxWidth:"1200px",margin:"0 auto",minHeight:"500px"},children:c.jsx(Ft,{autoplay:!0,autoplaySpeed:5e3,dots:!0,arrows:!0,infinite:!0,speed:500,slidesToShow:3,slidesToScroll:3,swipeable:!0,emulateTouch:!0,responsive:[{breakpoint:1200,settings:{slidesToShow:2,slidesToScroll:2,dots:!0,arrows:!0,swipeable:!0,emulateTouch:!0}},{breakpoint:768,settings:{slidesToShow:1,slidesToScroll:1,dots:!0,arrows:!1,centerMode:!1,swipeable:!0,emulateTouch:!0}},{breakpoint:480,settings:{slidesToShow:1,slidesToScroll:1,dots:!0,arrows:!1,centerMode:!1,swipeable:!0,emulateTouch:!0}}],style:{padding:"0 40px"},className:"services-carousel",children:f&&f.length>0?f.map((g,p)=>c.jsx("div",{style:{padding:"0 24px"},className:"service-slide",children:c.jsxs(_,{onClick:()=>b(),style:{background:"#ffffff",border:"1px solid #e8e8e8",borderRadius:"16px",overflow:"hidden",cursor:"pointer",transition:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",height:"420px",display:"flex",flexDirection:"column",boxShadow:"0 4px 12px rgba(0, 0, 0, 0.08)"},hoverable:!0,className:"service-card",bodyStyle:{padding:0},children:[c.jsxs("div",{style:{width:"100%",height:180,background:`linear-gradient(135deg, ${g.color||"#1890ff"} 0%, ${g.color?g.color+"80":"#1890ff80"} 100%)`,position:"relative",overflow:"hidden"},children:[c.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)"}}),c.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",fontSize:"64px",filter:"drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))"},children:g.icon||"🏥"})]}),c.jsxs("div",{style:{padding:"24px",flex:1,display:"flex",flexDirection:"column"},children:[c.jsx(N,{level:4,style:{marginBottom:12,color:"#1f1f1f",fontSize:"18px",fontWeight:600,lineHeight:1.3},children:g.name||"Service"}),(g.description||g.name)&&c.jsx(j,{style:{color:"#666",fontSize:"14px",lineHeight:1.5,marginBottom:20,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"},children:g.description||`Professional ${g.name||"service"} for your needs.`}),c.jsx("div",{style:{marginTop:"auto",paddingTop:16},children:c.jsx(K,{type:"primary",size:"middle",style:{width:"100%",height:40,fontWeight:500,borderRadius:"8px",background:"linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",border:"none",boxShadow:"0 2px 8px rgba(24, 144, 255, 0.2)"},children:"Choose Service"})})]})]})},g.id||p)):c.jsx("div",{style:{padding:"0 24px",textAlign:"center"},children:c.jsx(j,{style:{color:"#666",fontSize:"16px"},children:"Loading services..."})})})}),c.jsx("div",{style:{textAlign:"center",marginTop:48,padding:"24px 32px",background:"rgba(24, 144, 255, 0.08)",borderRadius:"16px",border:"1px solid rgba(24, 144, 255, 0.15)",maxWidth:"800px",margin:"48px auto 0"},children:c.jsx(j,{style:{color:"#4a4a4a",fontSize:"15px",lineHeight:1.5,fontWeight:500},children:"📌 HospiPals provide non-medical companion support only. All medical/nursing care is handled by hospital staff."})}),c.jsx("div",{style:{textAlign:"center",marginTop:40},children:c.jsx(K,{type:"primary",size:"large",icon:c.jsx(te,{}),onClick:m,style:{background:"linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",border:"none",height:56,padding:"0 32px",fontSize:"16px",fontWeight:600,borderRadius:"14px",boxShadow:"0 8px 24px rgba(24, 144, 255, 0.25)",minWidth:"280px",maxWidth:"400px",width:"auto",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},className:"services-cta-button",children:"Book a HospiPal"})})]}),c.jsx("style",{jsx:!0,children:`
                    /* Global Carousel Styles */
                    .services-carousel .slick-dots {
                        position: relative !important;
                        bottom: -20px !important;
                        z-index: 10 !important;
                    }

                    .services-carousel .slick-dots li button {
                        width: 12px !important;
                        height: 12px !important;
                        border-radius: 50% !important;
                        background: #d9d9d9 !important;
                        border: 2px solid #ffffff !important;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                        opacity: 1 !important;
                    }

                    .services-carousel .slick-dots li.slick-active button {
                        background: #1890ff !important;
                        border: 2px solid #ffffff !important;
                        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3) !important;
                    }

                    .services-carousel .slick-prev,
                    .services-carousel .slick-next {
                        width: 44px !important;
                        height: 44px !important;
                        background: #ffffff !important;
                        border: 2px solid #1890ff !important;
                        border-radius: 50% !important;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                        z-index: 10 !important;
                        opacity: 1 !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        font-family: "Ant Design Icons", Arial, sans-serif !important;
                        position: absolute !important;
                        top: 0 !important;
                    }

                    .services-carousel .slick-prev:hover,
                    .services-carousel .slick-next:hover {
                        background: #1890ff !important;
                        color: #ffffff !important;
                    }

                    .services-carousel .slick-prev:before,
                    .services-carousel .slick-next:before {
                        color: #1890ff !important;
                        font-size: 20px !important;
                        font-weight: bold !important;
                        opacity: 1 !important;
                        content: "‹" !important;
                    }

                    .services-carousel .slick-next:before {
                        content: "›" !important;
                    }

                    .services-carousel .slick-prev:hover:before,
                    .services-carousel .slick-next:hover:before {
                        color: #ffffff !important;
                    }

                    @media (max-width: 1200px) {
                    @media (max-width: 1200px) {
                        .services-carousel {
                            padding: 0 20px !important;
                        }

                        .service-slide {
                            padding: 0 16px !important;
                        }
                    }

                    @media (max-width: 768px) {
                        .hero-section {
                            padding: 32px 16px !important;
                            margin-bottom: 32px !important;
                            border-radius: 16px !important;
                        }

                        .hero-title {
                            font-size: 2rem !important;
                            line-height: 1.2 !important;
                            margin-bottom: 24px !important;
                            padding: 0 8px !important;
                        }

                        .hero-subtitle {
                            font-size: 16px !important;
                            line-height: 1.6 !important;
                            margin-bottom: 32px !important;
                            padding: 0 8px !important;
                        }

                        .hero-cta-container {
                            display: flex !important;
                            justify-content: center !important;
                            gap: 16px !important;
                            flex-wrap: wrap !important;
                        }

                        .hero-primary-button {
                            width: 100% !important;
                            min-width: unset !important;
                            height: 56px !important;
                            font-size: 16px !important;
                            padding: 0 24px !important;
                            white-space: nowrap !important;
                            text-align: center !important;
                        }

                        .hero-primary-button span {
                            font-size: 16px !important;
                            line-height: 1.2 !important;
                        }

                        .hero-secondary-button {
                            width: 100% !important;
                            min-width: unset !important;
                            height: 56px !important;
                            font-size: 15px !important;
                            padding: 0 28px !important;
                        }

                        .hero-trust-indicator {
                            flex-wrap: wrap !important;
                            gap: 12px !important;
                            padding: 20px 24px !important;
                            text-align: center !important;
                            justify-content: center !important;
                        }

                        .hero-trust-text {
                            font-size: 14px !important;
                            text-align: center !important;
                        }

                        /* Trust Anchors Mobile Styles */
                        .trust-anchors-section {
                            padding: 32px 16px !important;
                            margin-bottom: 32px !important;
                            border-radius: 16px !important;
                        }

                        .trust-anchors-grid {
                            grid-template-columns: 1fr !important;
                            gap: 20px !important;
                        }

                        .trust-anchor-item {
                            padding: 20px !important;
                            border-radius: 12px !important;
                        }

                        /* Our Services Mobile Styles */
                        .our-services-section {
                            padding: 48px 16px !important;
                            margin-bottom: 32px !important;
                            border-radius: 20px !important;
                        }

                        .services-carousel {
                            padding: 0 10px !important;
                        }

                        .service-slide {
                            padding: 0 8px !important;
                        }

                        .service-card {
                            height: 400px !important;
                            border-radius: 16px !important;
                        }

                        .service-card .ant-card-body {
                            padding: 0 !important;
                        }

                        .service-card h4 {
                            font-size: 16px !important;
                            margin-bottom: 8px !important;
                        }

                        .service-card .ant-typography {
                            font-size: 13px !important;
                            margin-bottom: 16px !important;
                        }

                        .service-card .ant-btn {
                            height: 36px !important;
                            font-size: 14px !important;
                        }

                        /* CTA Button Mobile Styles */
                        .our-services-section .ant-btn,
                        .services-cta-button {
                            width: 100% !important;
                            max-width: 300px !important;
                            height: 48px !important;
                            font-size: 16px !important;
                            padding: 0 20px !important;
                            white-space: nowrap !important;
                            text-align: center !important;
                            line-height: 1.4 !important;
                            min-width: unset !important;
                            overflow: hidden !important;
                            text-overflow: ellipsis !important;
                        }

                        /* Carousel Navigation Mobile Styles */
                        .services-carousel .slick-dots {
                            bottom: -30px !important;
                            z-index: 10 !important;
                        }

                        .services-carousel .slick-dots li button {
                            width: 10px !important;
                            height: 10px !important;
                            border-radius: 50% !important;
                            background: #d9d9d9 !important;
                            border: 2px solid #ffffff !important;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                        }

                        .services-carousel .slick-dots li.slick-active button {
                            background: #1890ff !important;
                            border: 2px solid #ffffff !important;
                            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3) !important;
                        }

                        /* Carousel Arrow Styles */
                        .services-carousel .slick-prev,
                        .services-carousel .slick-next {
                            width: 40px !important;
                            height: 40px !important;
                            background: #ffffff !important;
                            border: 2px solid #1890ff !important;
                            border-radius: 50% !important;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                            z-index: 10 !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            font-family: "Ant Design Icons", Arial, sans-serif !important;
                        }

                        .services-carousel .slick-prev:hover,
                        .services-carousel .slick-next:hover {
                            background: #1890ff !important;
                            color: #ffffff !important;
                        }

                        .services-carousel .slick-prev:before,
                        .services-carousel .slick-next:before {
                            color: #1890ff !important;
                            font-size: 18px !important;
                            font-weight: bold !important;
                        }

                        .services-carousel .slick-prev:hover:before,
                        .services-carousel .slick-next:hover:before {
                            color: #ffffff !important;
                        }
                    }

                    @media (max-width: 480px) {
                        .hero-section {
                            padding: 24px 12px !important;
                        }

                        .hero-title {
                            font-size: 1.75rem !important;
                            padding: 0 4px !important;
                        }

                        .hero-subtitle {
                            font-size: 15px !important;
                            padding: 0 4px !important;
                        }

                        .hero-primary-button {
                            height: 48px !important;
                            font-size: 14px !important;
                            padding: 0 20px !important;
                        }

                        .hero-secondary-button {
                            height: 44px !important;
                            font-size: 13px !important;
                            padding: 0 16px !important;
                        }

                        .hero-trust-indicator {
                            padding: 12px 16px !important;
                        }

                        .hero-trust-text {
                            font-size: 13px !important;
                        }

                        /* Trust Anchors Small Mobile Styles */
                        .trust-anchors-section {
                            padding: 24px 12px !important;
                        }

                        .trust-anchors-grid {
                            gap: 16px !important;
                        }

                        .trust-anchor-item {
                            padding: 16px !important;
                            gap: 12px !important;
                        }

                        .trust-anchor-item > div:first-child {
                            width: 40px !important;
                            height: 40px !important;
                        }

                        .trust-anchor-item > div:first-child > * {
                            font-size: 20px !important;
                        }

                        /* Our Services Small Mobile Styles */
                        .our-services-section {
                            padding: 32px 12px !important;
                        }

                        .services-carousel {
                            padding: 0 8px !important;
                        }

                        .service-slide {
                            padding: 0 6px !important;
                        }

                        .service-card {
                            height: 380px !important;
                            border-radius: 14px !important;
                        }

                        .service-card h4 {
                            font-size: 15px !important;
                            margin-bottom: 6px !important;
                        }

                        .service-card .ant-typography {
                            font-size: 12px !important;
                            margin-bottom: 12px !important;
                        }

                        .service-card .ant-btn {
                            height: 32px !important;
                            font-size: 13px !important;
                        }

                        /* CTA Button Small Mobile Styles */
                        .our-services-section .ant-btn,
                        .services-cta-button {
                            width: 100% !important;
                            max-width: 280px !important;
                            height: 44px !important;
                            font-size: 15px !important;
                            padding: 0 16px !important;
                            white-space: nowrap !important;
                            text-align: center !important;
                            line-height: 1.3 !important;
                            min-width: unset !important;
                            overflow: hidden !important;
                            text-overflow: ellipsis !important;
                        }

                        /* Carousel Navigation Small Mobile Styles */
                        .services-carousel .slick-dots {
                            bottom: -25px !important;
                            z-index: 10 !important;
                        }

                        .services-carousel .slick-dots li button {
                            width: 8px !important;
                            height: 8px !important;
                            border-radius: 50% !important;
                            background: #d9d9d9 !important;
                            border: 2px solid #ffffff !important;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                        }

                        .services-carousel .slick-dots li.slick-active button {
                            background: #1890ff !important;
                            border: 2px solid #ffffff !important;
                            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3) !important;
                        }
                    }
                `}),c.jsxs(et,{gutter:[24,24],children:[c.jsx(ie,{xs:24,md:8,children:c.jsx(_,{children:c.jsxs("div",{style:{textAlign:"center"},children:[c.jsx(xe,{style:{fontSize:48,color:"#1890ff",marginBottom:16}}),c.jsx(N,{level:4,children:"Easy Booking"}),c.jsx(q,{children:"Book your appointments in just a few clicks with our streamlined booking process."})]})})}),c.jsx(ie,{xs:24,md:8,children:c.jsx(_,{children:c.jsxs("div",{style:{textAlign:"center"},children:[c.jsx(ve,{style:{fontSize:48,color:"#52c41a",marginBottom:16}}),c.jsx(N,{level:4,children:"Secure & Safe"}),c.jsx(q,{children:"Your data is protected with industry-standard security measures."})]})})}),c.jsx(ie,{xs:24,md:8,children:c.jsx(_,{children:c.jsxs("div",{style:{textAlign:"center"},children:[c.jsx(Je,{style:{fontSize:48,color:"#722ed1",marginBottom:16}}),c.jsx(N,{level:4,children:"Mobile Friendly"}),c.jsx(q,{children:"Access our platform from any device with our responsive design."})]})})})]}),c.jsx(Be,{isVisible:i,onClose:()=>e(!1),onSuccess:x})]})]})}export{vi as default};
