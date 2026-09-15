window.addEventListener('load',()=>{
  setTimeout(()=>document.getElementById('loader').classList.add('hidden'),2000);
});

/* ---------- CURSOR ---------- */
(function(){
  const dot=document.querySelector('.cur-dot'),ring=document.querySelector('.cur-ring');
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    dot.style.transform=`translate(${mx}px,${my}px)`;
  });
  (function loop(){
    rx+=(mx-rx)*.14; ry+=(my-ry)*.14;
    ring.style.transform=`translate(${rx}px,${ry}px)`;
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.chip,.proj,.job,.c-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('grow'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('grow'));
  });
})();

/* ---------- PARTICLE NETWORK ---------- */
(function(){
  const c=document.getElementById('net'),x=c.getContext('2d');
  const COLORS=['#4c36c9','#6d4aff','#9d8bff','#c4b5fd'];
  let pts=[],w,h;
  function size(){
    w=c.width=innerWidth; h=c.height=innerHeight;
    const n=Math.min(110,Math.round(w*h/14000));
    pts=Array.from({length:n},()=>({
      x:Math.random()*w,y:Math.random()*h,
      vx:(Math.random()-.5)*.45,vy:(Math.random()-.5)*.45,
      r:Math.random()*1.9+.8,
      c:COLORS[Math.floor(Math.random()*COLORS.length)]
    }));
  }
  function hex2rgb(v){return [parseInt(v.slice(1,3),16),parseInt(v.slice(3,5),16),parseInt(v.slice(5,7),16)];}
  function draw(){
    x.clearRect(0,0,w,h);
    for(let i=0;i<pts.length;i++){
      const p=pts[i];
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>w)p.vx*=-1;
      if(p.y<0||p.y>h)p.vy*=-1;
      x.beginPath();x.arc(p.x,p.y,p.r,0,6.2832);
      x.fillStyle=p.c;x.globalAlpha=.75;x.fill();
      for(let j=i+1;j<pts.length;j++){
        const q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);
        if(d<128){
          const [r,g,b]=hex2rgb(p.c);
          x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);
          x.strokeStyle=`rgba(${r},${g},${b},${(1-d/128)*.28})`;
          x.lineWidth=.7;x.globalAlpha=1;x.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  size();addEventListener('resize',size);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches) draw();
})();

/* ---------- SCROLL REVEAL ---------- */
(function(){
  const io=new IntersectionObserver((es)=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.14,rootMargin:'0px 0px -60px 0px'});
  document.querySelectorAll('.rv,.rv-l,.rv-r').forEach((el,i)=>{
    el.style.transitionDelay=(i%4)*70+'ms';
    io.observe(el);
  });
})();

/* ---------- SKILL BARS ---------- */
(function(){
  const io=new IntersectionObserver((es)=>{
    es.forEach(e=>{
      if(!e.isIntersecting)return;
      const b=e.target;
      setTimeout(()=>{
        b.style.width=b.dataset.w+'%';
        setTimeout(()=>b.classList.add('done'),1500);
      },120);
      io.unobserve(b);
    });
  },{threshold:.5});
  document.querySelectorAll('.bar').forEach(b=>io.observe(b));
})();

/* ---------- MARQUEE (duplicate for seamless loop) ---------- */
(function(){
  const t=document.getElementById('mq');
  t.innerHTML+=t.innerHTML;
})();

/* ---------- MOBILE NAV ---------- */
(function(){
  const b=document.getElementById('burger'),l=document.getElementById('navLinks');
  b.addEventListener('click',()=>l.classList.toggle('open'));
  l.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>l.classList.remove('open')));
})();
/* ---------- CUSTOM SMOOTH NAVIGATION ---------- */
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',function(e){
      const targetId = this.getAttribute('href');

      if(targetId === '#') return;

      const target = document.querySelector(targetId);

      if(!target) return;

      e.preventDefault();

      const offset = 90;
      const start = window.scrollY;
      const end =
        target.getBoundingClientRect().top +
        window.scrollY -
        offset;

      const distance = end - start;
      const duration = 900;
      const startTime = performance.now();

      function ease(t){
        return 1 - Math.pow(1 - t, 4);
      }

      function animate(currentTime){
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        window.scrollTo(
          0,
          start + distance * ease(progress)
        );

        if(progress < 1){
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
    });
  });
})();
/* ---------- ACTIVE NAVIGATION ---------- */
(function(){
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  function setActive(id){
    links.forEach(link=>{
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + id
      );
    });
  }

  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        setActive(entry.target.id);
      }
    });
  },{
    rootMargin:'-25% 0px -60% 0px',
    threshold:0
  });

  sections.forEach(section => io.observe(section));

  if(window.scrollY < 120){
    setActive('home');
  }
})();