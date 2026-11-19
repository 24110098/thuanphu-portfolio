/* Thuận Phú Portfolio — tương tác: menu mobile, thanh tiến độ, lọc chiến dịch, xem ảnh lớn, sao chép, form liên hệ.
   Phần claude.use(...) chỉ chạy trên claude.ai; trên GitHub Pages tự bỏ qua, form mở ứng dụng email. */
(function(){
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const toastEl=$('#toast'); let tT;
  function toast(m){toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(tT);tT=setTimeout(()=>toastEl.classList.remove('show'),2600)}

  // Mobile menu
  const nav=$('#nav'), burger=$('#burger');
  burger.addEventListener('click',()=>{const o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Đóng menu':'Mở menu')});
  $$('.menu a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');burger.setAttribute('aria-expanded','false')}));

  // Progress bar, back-to-top, active link
  const prog=$('#progress'), top=$('#totop');
  const links=$$('.menu a'), secs=links.map(a=>document.querySelector(a.getAttribute('href')));
  function onScroll(){
    const h=document.documentElement, max=h.scrollHeight-h.clientHeight;
    prog.style.transform='scaleX('+(max>0?h.scrollTop/max:0)+')';
    top.classList.toggle('show',h.scrollTop>900);
    let cur=-1; secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<140)cur=i});
    links.forEach((a,i)=>a.classList.toggle('active',i===cur));
  }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  top.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

  // Campaign filter (+ #hash for direct links)
  const chips=$$('.chip'), camps=$$('.camp'), ids=camps.map(c=>c.id);
  function apply(f,scroll){
    chips.forEach(c=>{const on=c.dataset.filter===f;c.classList.toggle('on',on);c.setAttribute('aria-pressed',on)});
    camps.forEach(s=>{s.hidden=!(f==='all'||s.id===f)});
    if(scroll)$('#work').scrollIntoView({behavior:'smooth'});
  }
  chips.forEach(c=>c.addEventListener('click',()=>apply(c.dataset.filter,true)));
  function fromHash(){const h=location.hash.slice(1);if(ids.includes(h))apply(h,false)}
  addEventListener('hashchange',fromHash); fromHash();

  // Lightbox with counter, keyboard and swipe
  const lb=$('#lb'), img=$('#lb-img'), cap=$('#lb-cap'), camp=$('#lb-camp'), num=$('#lb-num');
  let list=[],i=0,last=null;
  const visible=()=>$$('.open').filter(b=>!b.closest('.camp[hidden]'));
  function show(){const b=list[i];img.src=b.dataset.src;img.alt=b.dataset.cap;cap.textContent=b.dataset.cap;camp.textContent=b.dataset.camp;num.textContent=(i+1)+' / '+list.length}
  function open(b){list=visible();i=list.indexOf(b);last=b;show();lb.classList.add('show');document.body.style.overflow='hidden';$('#lb-x').focus()}
  function close(){lb.classList.remove('show');document.body.style.overflow='';if(last)last.focus()}
  function step(d){i=(i+d+list.length)%list.length;show()}
  document.addEventListener('click',e=>{const b=e.target.closest('.open');if(b){e.preventDefault();open(b)}});
  $('#lb-x').onclick=close; $('#lb-prev').onclick=()=>step(-1); $('#lb-next').onclick=()=>step(1);
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  lb.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
  let sx=null; lb.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)step(dx<0?1:-1);sx=null});

  // Copy buttons
  $$('.copy').forEach(b=>b.addEventListener('click',async()=>{
    const t=document.getElementById(b.dataset.copy).textContent.trim();
    try{await navigator.clipboard.writeText(t);toast('Đã sao chép: '+t)}catch(_){toast('Không sao chép được, bạn bôi đen để copy nhé.')}
  }));

  // Contact form: validate, then save to the artifact database when this viewer may write
  const form=$('#cform'), note=$('#formnote'), send=$('#send');
  const F={name:$('#f-name'),email:$('#f-mail'),msg:$('#f-msg')}, E={name:$('#e-name'),email:$('#e-mail'),msg:$('#e-msg')};
  function check(){
    let ok=true; const v={name:F.name.value.trim(),email:F.email.value.trim(),msg:F.msg.value.trim()};
    const set=(k,m)=>{E[k].textContent=m;F[k].parentElement.classList.toggle('bad',!!m);if(m)ok=false};
    set('name',v.name.length<2?'Bạn nhập họ tên giúp mình nhé.':'');
    set('email',/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)?'':'Email chưa đúng định dạng.');
    set('msg',v.msg.length<10?'Lời nhắn cần ít nhất 10 ký tự.':'');
    return ok?v:null;
  }
  Object.values(F).forEach(f=>f.addEventListener('blur',()=>{if(f.value)check()}));
  let db=null, me=null, canWrite=null;
  form.addEventListener('submit',async e=>{
    e.preventDefault(); note.className='formnote';
    const v=check(); if(!v){note.textContent='Kiểm tra lại các ô báo đỏ.';note.classList.add('bad');return}
    if(db&&me&&canWrite!==false){
      send.disabled=true; note.textContent='Đang gửi…';
      try{
        const ref=db.collection('messages').doc(me); const old=await ref.get();
        const prev=(old.exists&&Array.isArray(old.data().items))?old.data().items:[];
        const items=prev.concat([{name:v.name,email:v.email,msg:v.msg,at:new Date().toISOString()}]).slice(-20);
        await ref.set({items,updatedAt:new Date().toISOString()});
        note.textContent='Đã gửi! Phú sẽ phản hồi qua email của bạn sớm nhất.'; note.classList.add('ok'); form.reset(); toast('Lời nhắn đã được gửi');
      }catch(err){canWrite=false;fallback(v)}
      send.disabled=false; return;
    }
    fallback(v);
  });
  async function fallback(v){
    const text='Gửi Phú,\n\n'+v.msg+'\n\n— '+v.name+' ('+v.email+')';
    const to=document.getElementById('email').textContent.trim();
    if(!window.claude && /@/.test(to) && !/\[/.test(to)){
      location.href='mailto:'+to+'?subject='+encodeURIComponent('Liên hệ từ portfolio — '+v.name)+'&body='+encodeURIComponent(text);
      note.textContent='Đang mở ứng dụng email của bạn…'; note.classList.add('ok'); return;
    }
    try{await navigator.clipboard.writeText(text);note.textContent='Trang này chưa nhận lời nhắn trực tiếp từ bạn. Mình đã sao chép sẵn nội dung, bạn dán vào email gửi tới địa chỉ bên trái nhé.'}
    catch(_){note.textContent='Trang này chưa nhận lời nhắn trực tiếp từ bạn. Bạn gửi nội dung qua email ở bên trái giúp mình nhé.'}
    note.classList.add('bad');
  }

  // Backend: artifact database + viewer identity (light up when available)
  (async()=>{
    try{
      if(!window.claude||!claude.use)return;
      const [d,u]=await Promise.all([claude.use('db'),claude.use('user')]);
      if(!d||!u)return; db=d; me=await u.id();
      try{canWrite=u.can?await u.can('data.write'):null}catch(_){canWrite=null}
      if(u.isOwner&&await u.isOwner()){
        const box=$('#inbox'), ul=$('#inbox-list'); box.hidden=false; ul.innerHTML='<li>Đang tải hộp thư…</li>';
        const t=setTimeout(()=>{ul.innerHTML='<li>Chưa kết nối được hộp thư, thử tải lại trang sau.</li>'},10000);
        db.collection('messages').onSnapshot(s=>{
          clearTimeout(t); const all=[];
          s.docs.forEach(doc=>{const it=(doc.data()||{}).items||[];it.forEach(m=>all.push(m))});
          all.sort((a,b)=>String(b.at).localeCompare(String(a.at)));
          ul.innerHTML='';
          if(!all.length){ul.innerHTML='<li>Chưa có lời nhắn nào.</li>';return}
          all.slice(0,50).forEach(m=>{const li=document.createElement('li');const b=document.createElement('b');b.textContent=m.name+' · '+m.email;const p=document.createElement('span');p.textContent=m.msg;const sm=document.createElement('small');sm.textContent=' '+new Date(m.at).toLocaleString('vi-VN');li.append(b,p,document.createElement('br'),sm);ul.append(li)});
        },()=>{clearTimeout(t);ul.innerHTML='<li>Không đọc được hộp thư lúc này.</li>'});
      }
    }catch(_){}
  })();
})();
