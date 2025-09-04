
(function(){
  function $(id){ return document.getElementById(id); }
  function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[s])); }
  function s(v){ return v==null?'' : escapeHtml(v); }
  function showError(msg){
    const box = $('error'); if(!box) return;
    box.style.display = 'block'; box.innerHTML = '<div class="section-title">Fehler</div><div class="small">'+s(msg)+'</div>';
  }

  function monthName(m){
    const arr = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
    const i = parseInt(m,10); return (i>=1&&i<=12)?arr[i-1]:m;
  }
  function formatYM(ym){
    if(!ym) return '';
    const m = /^(\d{4})-(\d{2})$/.exec(ym);
    if(!m) return s(ym);
    return `${m[2]}/${m[1]}`;
  }
  function formatYearMonth(ym){
    const m = /^(\d{4})-(\d{2})$/.exec(ym||''); if(!m) return s(ym||'');
    return monthName(m[2])+' '+m[1];
  }
  function formatPeriod(p){
    if(!p) return '';
    if(typeof p === 'string') return s(p);
    const start = p.start ? formatYM(p.start) : '';
    const end = (p.end===null) ? 'heute' : (p.end ? formatYM(p.end) : '');
    if(start && end) return `${start} – ${end}`;
    if(start && !end) return `${start}`;
    if(!start && end) return `${end}`;
    return '';
  }
  function renderList(arr){
    if(!Array.isArray(arr) || !arr.length) return '';
    return '<ul style="margin:6px 0 0 18px">'+arr.map(h=>'<li>'+s(h)+'</li>').join('')+'</ul>';
  }

  function renderHeader(d){
    $('name').textContent = d.name || '';
    $('profession').textContent = d.title || '';
    $('summary').textContent = d.summary || d.description || '';
    if(d.image){ $('avatar').src = d.image; }

    const contact = d.contact || {};
    const web = contact.web || {};
    const socials = Array.isArray(d.socialLinks) ? d.socialLinks : [];

    const contactHtml = '<section class="card">'+
      '<div class="section-title">Kontakt</div>'+
      '<div class="contact-grid small">'+
        (contact.email? '<div class="contact-key">E‑Mail</div><div class="contact-item"><a href="mailto:'+s(contact.email)+'">'+s(contact.email)+'</a></div>' : '')+
        (contact.phone? '<div class="contact-key">Telefon</div><div class="contact-item"><a href="tel:'+s(contact.phone)+'">'+s(contact.phone)+'</a></div>' : '')+
        (contact.address? '<div class="contact-key">Adresse</div><div class="contact-item">'+s(contact.address)+'</div>' : '')+
        (web.url? '<div class="contact-key contact-web">Web</div><div class="contact-item contact-web"><a href=\"'+s(web.url)+'\" target=\"_blank\" rel=\"noopener\">'+s(web.title||web.url)+'</a></div>' : '')+
        (socials.length? '<div class="contact-key contact-social">Social</div><div class="contact-item contact-social">'+socials.map(x=>'<a href="'+s(x.url)+'" target="_blank" rel="noopener">'+s(x.name)+'</a>').join(' ')+'</div>' : '')+
      '</div>'+
    '</section>';

    return contactHtml;
  }

  function renderSkills(skills){
    if(!Array.isArray(skills) || !skills.length) return '';
    if(skills[0] && typeof skills[0] === 'object' && Array.isArray(skills[0].items)){
      return '<section class="card"><div class="section-title">Kernkompetenzen &amp; Tech‑Stack</div>'+
        '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px">'+
        skills.map(cat=>'<div><div class="small" style="font-weight:600">'+s(cat.category)+'</div><div class="badges">'+(Array.isArray(cat.items)?cat.items.map(x=>'<span class="badge">'+s(x)+'</span>').join(''):'')+'</div></div>').join('')+
        '</div></section>';
    } else {
      return '<section class="card"><div class="section-title">Kernkompetenzen &amp; Tech‑Stack</div>'+
        '<div class="badges">'+skills.map(x=>'<span class="badge">'+s(x)+'</span>').join('')+'</div></section>';
    }
  }

  function renderLanguages(langs){
    if(!langs || typeof langs!=='object') return '';
    const entries = Object.entries(langs);
    if(!entries.length) return '';
    return '<section class="card">'+
             '<div class="section-title">Sprachen</div>'+
             entries.map(([name, val])=>{
               let level=0,label='',cefr='';
               if(typeof val==='number'){ level = Math.max(0, Math.min(100, Number(val)||0)); }
               else if(typeof val==='object'){ level = Math.max(0, Math.min(100, Number(val.level)||0)); label = s(val.label||''); cefr = s(val.cefr||''); }
               return '<div class=\"lang-row\">'+
         '<div class=\"lang-meta\"><span class=\"lang-name\">'+s(name)+'</span>'+(label? ' <span class=\"lang-badge\">'+label+'</span>' : '')+(cefr? ' <span class=\"lang-badge cefr\">'+cefr+'</span>' : '')+'</div>'+
                        '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+level+'"><div class="bar" style="width:'+level+'%"></div></div>'+
                      '</div>';
             }).join('')+
           '</section>';
  }

  function renderInterests(list){
    if(!list) return '';
    let names = [];
    if(Array.isArray(list)) names = list;
    else if(typeof list==='object') names = Object.keys(list);
    names = names.filter(x=>String(x).trim().length>0);
    if(!names.length) return '';
    return '<section class="card">'+
             '<div class="section-title">Interessen</div>'+
             '<div class="interests">'+
               names.map(name=>'<span class="badge">'+s(name)+'</span>').join('')+
             '</div>'+
           '</section>';
  }

  function renderExperience(items){
    if(!Array.isArray(items) || !items.length) return '';
    return '<section class="card"><div class="section-title">Ausgewählte Berufserfahrung</div>'+
      items.map(exp=>{
        const metaBits = [exp.company, formatPeriod(exp.period)].filter(Boolean);
        const meta = metaBits.join(' · ');
        const desc = exp.description ? '<div style="margin-top:6px">'+s(exp.description)+'</div>' : '';
        const details = renderList(exp.details);
        return '<details><summary>'+s(exp.title)+' <span class="small">'+s(meta)+'</span></summary>'+
               '<div class="kv small">'+
                 '<div class="k">Rolle</div><div>'+s(exp.role||'')+'</div>'+
                 '<div class="k">Art der Beschäftigung</div><div>'+s(({'self_employed':'Selbstständig','permanent':'Festanstellung','contract':'Freier Vertrag','staffing':'AN-Überlassung'})[exp.type]||exp.type||'')+'</div>'+
                 '<div class="k">Einsatzort</div><div>'+s(exp.location||'')+'</div>'+
               '</div>'+
 (Array.isArray(exp.skills)&&exp.skills.length ? '<div class=\"badges\" style=\"margin-top:8px\">'+exp.skills.map(t=>'<span class=\"badge\">'+s(t)+'</span>').join('')+'</div>' : '') + desc + details + '</details>';
      }).join('')+
    '</section>';
  }

  function renderEducation(items){
    if(!Array.isArray(items) || !items.length) return '';
    return '<section class="card"><div class="section-title">Ausbildung &amp; Abschlüsse</div>'+
      items.map(ed=>{
        const metaBits = [ed.school, ed.location, formatPeriod(ed.period)].filter(Boolean);
        const meta = metaBits.join(' · ');
        const desc = ed.description ? '<div class="small" style="margin-top:6px">'+s(ed.description)+'</div>' : '';
        const details = renderList(ed.details);
        return '<details><summary>'+s(ed.degree)+' <span class="small">'+s(meta)+'</span></summary>'+desc+details+'</details>';
      }).join('')+
    '</section>';
  }

  function renderCertificates(items){
    if(!Array.isArray(items) || !items.length) return '';
    return '<section class="card"><div class="section-title">Zertifizierungen</div>'+
      items.map(c=>{
        const date = c.date ? '<span class="small">'+formatYearMonth(c.date)+'</span>' : '';
        const title = s(c.title||'Zertifikat');
        const link = c.url ? ' <a class="small" href="'+s(c.url)+'" target="_blank" rel="noopener">Link</a>' : '';
        const desc = c.description ? '<div class="small" style="margin-top:4px">'+s(c.description)+'</div>' : '';
        return '<div style="margin:8px 0"><div style="font-weight:600">'+title+' '+date+link+'</div>'+desc+'</div>';
      }).join('')+
    '</section>';
  }

  function attachControls(){
    const c = $('btnPrintCompact'), d = $('btnPrintDetailed'), j = $('btnDownloadJson');
    if(c) c.addEventListener('click',()=>{ document.querySelectorAll('details').forEach(x=>x.open=false); window.print(); });
    if(d) d.addEventListener('click',()=>{ document.querySelectorAll('details').forEach(x=>x.open=true); window.print(); });
    if(j) j.addEventListener('click',()=>{
      fetch('cv.json',{cache:'no-store'}).then(r=>r.blob()).then(b=>{
        const url = URL.createObjectURL(b);
        const a = document.createElement('a');
        a.href = url; a.download = 'cv.json';
        document.body.appendChild(a); a.click();
        setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 200);
      }).catch(e=>showError('cv.json konnte nicht geladen werden für Download: '+String(e)));
    });
  }

  function renderAll(d){
    const root = $('cv');
    if(!root){ showError('Container #cv fehlt.'); return; }
    const blocks = [];
    blocks.push(renderHeader(d));
    blocks.push(renderSkills(d.skills));
    blocks.push(renderLanguages(d.languages));
    blocks.push(renderInterests(d.interests));
    blocks.push(renderExperience(d.experience));
    blocks.push(renderEducation(d.education));
    blocks.push(renderCertificates(d.certificates));
    root.innerHTML = blocks.join('');
  }

  function boot(){
    attachControls();
    fetch('cv.json',{cache:'no-store'})
      .then(r=>{ if(!r.ok) throw new Error('HTTP '+r.status+' beim Laden von cv.json'); return r.json(); })
      .then(d=>renderAll(d))
      .catch(err=>showError('cv.json konnte nicht geladen werden: '+String(err)));
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
})();
