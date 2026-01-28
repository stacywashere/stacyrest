var c=Object.defineProperty;var u=(a,t,n)=>t in a?c(a,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):a[t]=n;var s=(a,t,n)=>u(a,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(e){if(e.ep)return;e.ep=!0;const i=n(e);fetch(e.href,i)}})();class h{constructor(){s(this,"audioPlayer");s(this,"playPauseBtn");s(this,"visualizer");s(this,"bars");s(this,"isPlaying",!1);s(this,"audioContext",null);s(this,"analyser",null);s(this,"source",null);s(this,"dataArray",null);s(this,"dataArrayBuffer",null);s(this,"animationId",null);this.audioPlayer=document.getElementById("audioPlayer"),this.playPauseBtn=document.getElementById("playPauseBtn"),this.visualizer=document.querySelector(".visualizer"),this.bars=Array.from(this.visualizer.querySelectorAll(".bar")),this.init()}init(){this.audioPlayer.currentTime=0,this.playPauseBtn.addEventListener("click",()=>this.togglePlay()),this.audioPlayer.addEventListener("ended",()=>this.onEnded()),this.audioPlayer.addEventListener("pause",()=>this.onPause()),this.audioPlayer.addEventListener("play",()=>this.onPlay())}initAudioContext(){if(!this.audioContext){this.audioContext=new(window.AudioContext||window.webkitAudioContext),this.analyser=this.audioContext.createAnalyser(),this.analyser.fftSize=64,this.analyser.smoothingTimeConstant=.8,this.source=this.audioContext.createMediaElementSource(this.audioPlayer),this.source.connect(this.analyser),this.analyser.connect(this.audioContext.destination);const t=this.analyser.frequencyBinCount;this.dataArrayBuffer=new ArrayBuffer(t),this.dataArray=new Uint8Array(this.dataArrayBuffer)}}togglePlay(){var t;this.isPlaying?this.audioPlayer.pause():(this.initAudioContext(),((t=this.audioContext)==null?void 0:t.state)==="suspended"&&this.audioContext.resume(),this.audioPlayer.play())}updateVisualizer(){if(!this.analyser||!this.dataArray||!this.dataArrayBuffer)return;this.analyser.getByteFrequencyData(new Uint8Array(this.dataArrayBuffer)),this.dataArray=new Uint8Array(this.dataArrayBuffer);const t=this.bars.length,n=Math.floor(this.dataArray.length/t);for(let r=0;r<t;r++){const e=r*n,i=this.dataArray[e],o=Math.pow(i/255,1.5)*255,d=Math.max(4,Math.min(20,o/255*20));this.bars[r].style.height=`${d}px`}this.isPlaying&&(this.animationId=requestAnimationFrame(()=>this.updateVisualizer()))}onEnded(){this.playPauseBtn.innerHTML='<span style="display: block; transform: translateX(0.5px);">▶</span>',this.isPlaying=!1,this.visualizer.classList.remove("playing"),this.stopVisualizer()}onPause(){this.playPauseBtn.innerHTML='<span style="display: block; transform: translateX(0.5px);">▶</span>',this.isPlaying=!1,this.visualizer.classList.remove("playing"),this.stopVisualizer()}onPlay(){this.playPauseBtn.innerHTML='<span style="display: block; transform: translateX(0px);">⏸</span>',this.isPlaying=!0,this.visualizer.classList.add("playing"),this.startVisualizer()}startVisualizer(){this.animationId&&cancelAnimationFrame(this.animationId),this.updateVisualizer()}stopVisualizer(){this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null),this.bars.forEach(t=>{t.style.height="4px"})}}const l=[{href:"https://discordapp.com/users/921020185601769522",text:"Discord"},{href:"https://www.roblox.com/users/301507890/profile",text:"Roblox"},{href:"https://www.youtube.com/@fakerroblox",text:"YouTube"}],y=[{href:"https://exb.sh",icon:"/exb.png",alt:"exb",name:"exb"},{href:"https://vidra.live",icon:"/vidra.png",alt:"vidra",name:"vidra"}],p=()=>l.map((a,t)=>`<a href="${a.href}" class="link" target="_blank" rel="noopener noreferrer">${a.text}</a>${t<l.length-1?'<span class="separator">|</span>':""}`).join(""),m=({href:a,icon:t,alt:n,name:r})=>`
  <div class="project-item">
    <a href="${a}" class="link" target="_blank" rel="noopener noreferrer"><img src="${t}" alt="${n}" style="width: 16px; height: 16px; margin-right: 12px; vertical-align: middle;" draggable="false" oncontextmenu="return false;">${r}</a>
  </div>
`,f=()=>`
  <div class="visualizer">
    ${Array(8).fill('<div class="bar"></div>').join("")}
  </div>
`,v=()=>`
  <div class="music-player-container" style="user-select: none; -webkit-user-select: none;">
    <div class="music-player">
      <button class="pause-btn" id="playPauseBtn"><span style="display: block; transform: translateX(0.5px);">▶</span></button>
      <div class="player-display">
        <div class="track-info">
          <div class="track-name">IF WE SPEAK QUIETLY</div>
          <div class="artist-name">LOWER DEFINITION</div>
        </div>
        ${f()}
      </div>
    </div>
  </div>
`,g=()=>`
  <audio id="audioPlayer" preload="auto">
    <source src="/song.mp3" type="audio/mpeg">
  </audio>
`,P=()=>`
  <div class="image-container">
    ${v()}
    <img src="/stacy.png" alt="Stacy" class="portfolio-image" draggable="false" oncontextmenu="return false;" style="user-select: none; -webkit-user-select: none;">
  </div>
`,b=()=>`
  <div class="projects-section">
    <div class="section-title">Projects</div>
    ${y.map(m).join("")}
  </div>
`,x=()=>`
  <div class="content">
    <h1 class="name">stacy</h1>
    <div class="subtitle">web developer, photobasher, music addict</div>
    <div class="social-links">${p()}</div>
    ${b()}
    ${g()}
    ${P()}
  </div>
`,A=()=>`
  <div class="container">
    ${x()}
  </div>
`;document.body.innerHTML=A();new h;document.addEventListener("contextmenu",a=>{a.preventDefault()});
