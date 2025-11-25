
(function(){
  function $(id){ return document.getElementById(id); }
  function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[s])); }
  function s(v){ return v==null?'' : escapeHtml(v); }

  // Minimal markdown parser for bold, italic, links, and code
  function md(str){
    if(str==null) return '';
    let text = escapeHtml(str);

    // Links: [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, linkText, url) => {
      const cleanUrl = sanitizeUrl(url);
      return cleanUrl ? `<a href="${cleanUrl}" target="_blank" rel="noopener">${linkText}</a>` : linkText;
    });

    // Bold: **text** or __text__
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');

    // Italic: *text* or _text_ (but not inside words)
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/\b_([^_]+)_\b/g, '<em>$1</em>');

    // Code: `text`
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    return text;
  }

  function sanitizeUrl(url){
    if(!url) return '';
    const trimmed = String(url).trim();
    if(trimmed.match(/^(javascript|data|vbscript):/i)) return '';
    if(!trimmed.match(/^(https?:\/\/|mailto:|tel:)/i)) return '';
    return s(trimmed);
  }
  function hideLoading(){
    const loader = $('loading');
    if(loader){
      loader.classList.add('hidden');
      loader.style.display = 'none';
    }
  }
  const icons = {
    email: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>',
    phone: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    location: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    web: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    social: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>'
  };
  function showError(msg){
    hideLoading();
    const box = $('error'); if(!box) return;
    box.style.display = 'block';
    box.style.background = 'var(--card)';
    box.style.border = '2px solid #ef4444';
    box.style.borderRadius = 'var(--radius)';
    box.innerHTML = '<div style="color:#ef4444;font-weight:600;margin-bottom:8px;font-size:16px">\u26A0\uFE0F Fehler</div><div class="small">'+s(msg)+'</div>';
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
    return '<ul style="margin:6px 0 0 18px">'+arr.map(h=>'<li>'+md(h)+'</li>').join('')+'</ul>';
  }

  function renderHeader(d){
    $('name').textContent = d.name || '';
    $('profession').textContent = d.title || '';
    $('summary').textContent = d.summary || d.description || '';
    if(d.image){ $('avatar').src = d.image; }

    // Set document title from pageTitle field or fallback to name
    const pageTitle = d.pageTitle || (d.name ? d.name + ' – Lebenslauf' : 'Lebenslauf');
    document.title = pageTitle;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if(ogTitle) ogTitle.content = pageTitle;
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if(twTitle) twTitle.content = pageTitle;
    const desc = d.title || d.description || 'Professioneller Lebenslauf';
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if(ogDesc) ogDesc.content = desc;
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if(twDesc) twDesc.content = desc;

    const contact = d.contact || {};
    const web = contact.web || {};
    const socials = Array.isArray(d.socialLinks) ? d.socialLinks : [];

    const contactHtml = '<section class="card">'+
      '<div class="section-title">Kontakt</div>'+
      '<div class="contact-grid small">'+
        (contact.email? '<div class="contact-key">'+icons.email+' E‑Mail</div><div class="contact-item"><a href="mailto:'+s(contact.email)+'">'+s(contact.email)+'</a></div>' : '')+
        (contact.phone? '<div class="contact-key">'+icons.phone+' Telefon</div><div class="contact-item"><a href="tel:'+s(contact.phone)+'">'+s(contact.phone)+'</a></div>' : '')+
        (contact.address? '<div class="contact-key">'+icons.location+' Adresse</div><div class="contact-item">'+s(contact.address)+'</div>' : '')+
        (web.url? '<div class="contact-key contact-web">'+icons.web+' Web</div><div class="contact-item contact-web"><a href=\"'+sanitizeUrl(web.url)+'\" target=\"_blank\" rel=\"noopener\">'+s(web.title||web.url)+'</a></div>' : '')+
        (socials.length? '<div class="contact-key contact-social">'+icons.social+' Social</div><div class="contact-item contact-social">'+socials.map(x=>{const u=sanitizeUrl(x.url);return u?'<a href="'+u+'" target="_blank" rel="noopener">'+s(x.name)+'</a>':'';}).filter(Boolean).join(' ')+'</div>' : '')+
      '</div>'+
    '</section>';

    return contactHtml;
  }

  let activeSkillFilter = null;
  function renderSkills(skills){
    if(!Array.isArray(skills) || !skills.length) return '';
    if(skills[0] && typeof skills[0] === 'object' && Array.isArray(skills[0].items)){
      return '<section class="card"><div class="section-title">Kernkompetenzen &amp; Tech‑Stack</div>'+
        '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px">'+
        skills.map(cat=>'<div><div class="small" style="font-weight:600">'+s(cat.category)+'</div><div class="badges">'+(Array.isArray(cat.items)?cat.items.map(x=>'<span class="badge skill-badge" data-skill="'+s(x)+'">'+s(x)+'</span>').join(''):'')+'</div></div>').join('')+
        '</div></section>';
    } else {
      return '<section class="card" id="skillsSection">'+
        '<div class="section-title">Kernkompetenzen &amp; Tech‑Stack <span class="small" id="filterStatus"></span></div>'+
        '<div class="badges">'+skills.map(x=>'<span class="badge skill-badge" data-skill="'+s(x)+'">'+s(x)+'</span>').join('')+'</div></section>';
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
    const sorted = [...items].sort((a,b)=>(b.period?.start||'').localeCompare(a.period?.start||''));
    return '<section class="card"><div class="section-title">Ausgewählte Berufserfahrung</div>'+
      sorted.map(exp=>{
        const metaBits = [exp.company, formatPeriod(exp.period)].filter(Boolean);
        const meta = metaBits.join(' · ');
        const desc = exp.description ? '<div style="margin-top:6px">'+md(exp.description)+'</div>' : '';
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
        const desc = ed.description ? '<div class="small" style="margin-top:6px">'+md(ed.description)+'</div>' : '';
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
        const cleanUrl = sanitizeUrl(c.url);
        const link = cleanUrl ? ' <a class="small" href="'+cleanUrl+'" target="_blank" rel="noopener">Link</a>' : '';
        const desc = c.description ? '<div class="small" style="margin-top:4px">'+md(c.description)+'</div>' : '';
        return '<div style="margin:8px 0"><div style="font-weight:600">'+title+' '+date+link+'</div>'+desc+'</div>';
      }).join('')+
    '</section>';
  }

  let cvData = null;

  function generateMarkdown(data){
    if(!data) return '';
    let md = '';

    // Header
    md += `# ${data.name || 'Lebenslauf'}\n\n`;
    md += `**${data.title || ''}**\n\n`;
    if(data.description) md += `${data.description}\n\n`;

    // Contact
    md += `## Kontakt\n\n`;
    const contact = data.contact || {};
    if(contact.email) md += `- **E-Mail:** ${contact.email}\n`;
    if(contact.phone) md += `- **Telefon:** ${contact.phone}\n`;
    if(contact.address) md += `- **Adresse:** ${contact.address}\n`;
    if(contact.web?.url) md += `- **Web:** [${contact.web.title || contact.web.url}](${contact.web.url})\n`;
    if(Array.isArray(data.socialLinks) && data.socialLinks.length){
      md += `- **Social:** ${data.socialLinks.map(s => `[${s.name}](${s.url})`).join(', ')}\n`;
    }
    md += '\n';

    // Skills
    if(Array.isArray(data.skills) && data.skills.length){
      md += `## Kernkompetenzen & Tech-Stack\n\n`;
      md += data.skills.map(s => `- ${s}`).join('\n') + '\n\n';
    }

    // Languages
    if(data.languages && Object.keys(data.languages).length){
      md += `## Sprachen\n\n`;
      Object.entries(data.languages).forEach(([name, val]) => {
        const label = typeof val === 'object' ? val.label : '';
        const cefr = typeof val === 'object' ? val.cefr : '';
        md += `- **${name}**${label ? ` (${label})` : ''}${cefr ? ` - ${cefr}` : ''}\n`;
      });
      md += '\n';
    }

    // Interests
    if(Array.isArray(data.interests) && data.interests.length){
      md += `## Interessen\n\n`;
      md += data.interests.map(i => `- ${i}`).join('\n') + '\n\n';
    }

    // Experience
    if(Array.isArray(data.experience) && data.experience.length){
      md += `## Berufserfahrung\n\n`;
      const sorted = [...data.experience].sort((a,b)=>(b.period?.start||'').localeCompare(a.period?.start||''));
      sorted.forEach(exp => {
        md += `### ${exp.title}\n\n`;
        if(exp.company) md += `**${exp.company}**`;
        if(exp.location) md += ` · ${exp.location}`;
        if(exp.period) md += ` · ${formatPeriod(exp.period)}`;
        md += '\n\n';
        if(exp.role) md += `**Rolle:** ${exp.role}\n\n`;
        if(exp.description) md += `${exp.description}\n\n`;
        if(Array.isArray(exp.skills) && exp.skills.length){
          md += `**Skills:** ${exp.skills.join(', ')}\n\n`;
        }
        if(Array.isArray(exp.details) && exp.details.length){
          md += exp.details.map(d => `- ${d}`).join('\n') + '\n\n';
        }
      });
    }

    // Education
    if(Array.isArray(data.education) && data.education.length){
      md += `## Ausbildung & Abschlüsse\n\n`;
      data.education.forEach(ed => {
        md += `### ${ed.degree}\n\n`;
        if(ed.school) md += `**${ed.school}**`;
        if(ed.location) md += ` · ${ed.location}`;
        if(ed.period) md += ` · ${formatPeriod(ed.period)}`;
        md += '\n\n';
        if(ed.description) md += `${ed.description}\n\n`;
        if(Array.isArray(ed.details) && ed.details.length){
          md += ed.details.map(d => `- ${d}`).join('\n') + '\n\n';
        }
      });
    }

    // Certificates
    if(Array.isArray(data.certificates) && data.certificates.length){
      md += `## Zertifizierungen\n\n`;
      data.certificates.forEach(cert => {
        md += `### ${cert.title}`;
        if(cert.date) md += ` (${formatYearMonth(cert.date)})`;
        md += '\n\n';
        if(cert.description) md += `${cert.description}\n\n`;
        if(cert.url) md += `[Link zum Zertifikat](${cert.url})\n\n`;
      });
    }

    return md;
  }

  function attachControls(){
    const c = $('btnPrintCompact'), d = $('btnPrintDetailed'), m = $('btnDownloadMarkdown'), j = $('btnDownloadJson');
    if(c) c.addEventListener('click',()=>{ document.querySelectorAll('details').forEach(x=>x.open=false); window.print(); });
    if(d) d.addEventListener('click',()=>{ document.querySelectorAll('details').forEach(x=>x.open=true); window.print(); });
    if(m) m.addEventListener('click',()=>{
      const mdContent = generateMarkdown(cvData);
      const blob = new Blob([mdContent], {type: 'text/markdown;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const name = cvData?.name ? cvData.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') : 'cv';
      a.download = name + '-cv.md';
      document.body.appendChild(a); a.click();
      setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 200);
    });
    if(j) j.addEventListener('click',()=>{
      fetch('cv.json',{cache:'no-store'}).then(r=>r.blob()).then(b=>{
        const url = URL.createObjectURL(b);
        const a = document.createElement('a');
        a.href = url;
        const name = cvData?.name ? cvData.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') : 'cv';
        a.download = name + '-cv.json';
        document.body.appendChild(a); a.click();
        setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 200);
      }).catch(e=>showError('cv.json konnte nicht geladen werden für Download: '+String(e)));
    });
  }

  function filterExperienceBySkill(skill){
    activeSkillFilter = skill;
    const items = cvData?.experience || [];
    const filtered = skill ? items.filter(exp => {
      const expSkills = Array.isArray(exp.skills) ? exp.skills : [];
      return expSkills.some(s => s.toLowerCase() === skill.toLowerCase());
    }) : items;

    const expSection = document.querySelector('#experienceSection');
    if(expSection){
      expSection.innerHTML = '<div class="section-title">Ausgewählte Berufserfahrung'+(skill?' <span class="badge" style="font-size:10px">Filter: '+s(skill)+'</span>':'')+'</div>'+
        (filtered.length ? filtered.sort((a,b)=>(b.period?.start||'').localeCompare(a.period?.start||'')).map(exp=>{
          const metaBits = [exp.company, formatPeriod(exp.period)].filter(Boolean);
          const meta = metaBits.join(' · ');
          const desc = exp.description ? '<div style="margin-top:6px">'+md(exp.description)+'</div>' : '';
          const details = renderList(exp.details);
          return '<details><summary>'+s(exp.title)+' <span class="small">'+s(meta)+'</span></summary>'+
                 '<div class="kv small">'+
                   '<div class="k">Rolle</div><div>'+s(exp.role||'')+'</div>'+
                   '<div class="k">Art der Beschäftigung</div><div>'+s(({'self_employed':'Selbstständig','permanent':'Festanstellung','contract':'Freier Vertrag','staffing':'AN-Überlassung'})[exp.type]||exp.type||'')+'</div>'+
                   '<div class="k">Einsatzort</div><div>'+s(exp.location||'')+'</div>'+
                 '</div>'+
   (Array.isArray(exp.skills)&&exp.skills.length ? '<div class=\"badges\" style=\"margin-top:8px\">'+exp.skills.map(t=>'<span class=\"badge\">'+s(t)+'</span>').join('')+'</div>' : '') + desc + details + '</details>';
        }).join('') : '<div class="small" style="margin-top:8px">Keine Projekte mit dieser Kompetenz gefunden.</div>');
    }

    updateSkillBadges(skill);
    const filterStatus = $('filterStatus');
    if(filterStatus){
      filterStatus.innerHTML = skill ? '(gefiltert nach: '+s(skill)+' – <a href="#" id="clearFilter" style="font-weight:600">Filter löschen</a>)' : '';
      const clearBtn = $('clearFilter');
      if(clearBtn) clearBtn.addEventListener('click', (e)=>{ e.preventDefault(); filterExperienceBySkill(null); });
    }
  }

  function updateSkillBadges(activeSkill){
    document.querySelectorAll('.skill-badge').forEach(badge=>{
      const skill = badge.dataset.skill;
      if(activeSkill && skill.toLowerCase() === activeSkill.toLowerCase()){
        badge.classList.add('badge-active');
      } else {
        badge.classList.remove('badge-active');
      }
    });
  }

  function attachSkillFilter(){
    document.querySelectorAll('.skill-badge').forEach(badge=>{
      badge.style.cursor = 'pointer';
      badge.addEventListener('click', ()=>{
        const skill = badge.dataset.skill;
        if(activeSkillFilter === skill){
          filterExperienceBySkill(null);
        } else {
          filterExperienceBySkill(skill);
        }
      });
    });
  }

  function renderAll(d){
    hideLoading();
    cvData = d;
    const root = $('cv');
    if(!root){ showError('Container #cv fehlt.'); return; }
    const blocks = [];
    blocks.push(renderHeader(d));
    blocks.push(renderSkills(d.skills));
    blocks.push(renderLanguages(d.languages));
    blocks.push(renderInterests(d.interests));

    blocks.push('<section class="card" id="experienceSection">'+renderExperience(d.experience).replace('<section class="card">','').replace(/<\/section>$/,'')+'</section>');
    blocks.push(renderEducation(d.education));
    blocks.push(renderCertificates(d.certificates));
    root.innerHTML = blocks.join('');
    attachSkillFilter();
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
