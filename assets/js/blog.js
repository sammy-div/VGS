(function(){
'use strict';
const SB_URL='https://drpvjnzuqhtlvgmtrthj.supabase.co';
const SB_KEY='sb_publishable_-mBP1hR2CmFPTBg5KumEKg_AMbyTB9p';
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const plain=v=>String(v||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const settings=()=>window.VG_SETTINGS||{};
async function request(path,params={},extra={}){
 const u=new URL(SB_URL+'/rest/v1/'+path);Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));
 const r=await fetch(u,{headers:{apikey:SB_KEY,Authorization:'Bearer '+SB_KEY,...extra.headers},...extra});
 if(!r.ok)throw new Error('Request failed ('+r.status+').');return r;
}
async function getPosts(params={},range){
 const p={select:'id,title,slug,category,excerpt,body,author,read_minutes,path,status,featured,cover_image_url,cover_image_alt,meta_title,meta_description,canonical_url,social_title,social_description,social_image_url,noindex,answer_summary,search_intent,created_at,updated_at,published_at,deleted_at',status:'eq.published',deleted_at:'is.null',...params};
 const headers=range?{Range:range,'Prefer':'count=exact'}:{};
 const res=await request('blog_posts',p,{headers});return {posts:await res.json(),count:res.headers.get('content-range')};
}
function safeHtml(input){
 const doc=new DOMParser().parseFromString(String(input||''),'text/html');
 const allowed=new Set(['P','BR','H2','H3','H4','STRONG','B','EM','I','U','UL','OL','LI','BLOCKQUOTE','A','IMG','FIGURE','FIGCAPTION','HR','TABLE','THEAD','TBODY','TR','TH','TD','PRE','CODE','VIDEO','SOURCE','IFRAME','DIV','SPAN']);
 const safeUrl=v=>{try{const u=new URL(v,location.origin);return ['https:','http:'].includes(u.protocol)}catch(_){return false}};
 function walk(parent){[...parent.children].forEach(el=>{
  if(!allowed.has(el.tagName)){el.replaceWith(...el.childNodes);return;}
  [...el.attributes].forEach(a=>{const n=a.name.toLowerCase(),v=a.value.trim();const permitted=['href','src','alt','title','width','height','loading','target','rel','class','controls','poster','colspan','rowspan','allow','allowfullscreen','frameborder'];
   if(!permitted.includes(n)||n.startsWith('on')||((n==='href'||n==='src'||n==='poster')&&!safeUrl(v))){el.removeAttribute(a.name);return;}
   if(['width','height','colspan','rowspan'].includes(n)){const z=Number(v);if(!Number.isInteger(z)||z<1||z>3000)el.removeAttribute(n);}
  });
  if(el.tagName==='A'){el.setAttribute('rel','noopener noreferrer');if(el.target==='_blank')el.setAttribute('target','_blank');}
  if(el.tagName==='IMG'){el.setAttribute('loading','lazy');el.setAttribute('decoding','async');el.style.maxWidth='100%';el.style.height='auto';}
  if(el.tagName==='IFRAME'){const u=el.getAttribute('src')||'';if(!/^https:\/\/(www\.)?(youtube-nocookie\.com|youtube\.com|player\.vimeo\.com)\//i.test(u)){el.remove();return;}el.setAttribute('loading','lazy');el.setAttribute('title',el.getAttribute('title')||'Embedded video');el.setAttribute('referrerpolicy','strict-origin-when-cross-origin');}
  walk(el);
 });}
 walk(doc.body);return doc.body.innerHTML;
}
function sortArgs(s){const key=['published_at','created_at','updated_at','title','read_minutes'].includes(s.blog_home_order)?s.blog_home_order:'published_at';return {key,dir:s.blog_home_direction==='asc'?'asc':'desc'};}
function card(p,layout='grid'){const url='/blog/'+encodeURIComponent(p.slug);const img=p.cover_image_url?'<a class="insight-card__image" href="'+url+'" aria-label="Read '+esc(p.title)+'"><img src="'+esc(p.cover_image_url)+'" alt="'+esc(p.cover_image_alt||p.title)+'" loading="lazy" decoding="async" width="1200" height="675"><span>'+esc(p.category||'Insights')+'</span></a>':'<div class="insight-card__image"><div class="blog-card-placeholder" aria-hidden="true">V.</div><span>'+esc(p.category||'Insights')+'</span></div>';return '<article class="insight-card '+(layout==='list'?'insight-card--list':'')+'">'+img+'<div class="insight-card__body"><p class="insight-meta">'+esc(p.author||'Vatous Team')+' · '+(p.published_at?new Date(p.published_at).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}):'')+' · '+Math.max(1,Number(p.read_minutes)||5)+' min read</p><h2><a href="'+url+'">'+esc(p.title)+'</a></h2><p class="blog-card-excerpt">'+esc(plain(p.excerpt).slice(0,Math.max(80,Math.min(500,Number(settings().blog_excerpt_length)||180))))+'</p><a class="text-link" href="'+url+'">Read article <span aria-hidden="true">↗</span></a></div></article>';}
async function initHome(){
 const root=document.querySelector('[data-blog-home]');if(!root)return;const s=settings();if(s.blog_home_enabled===false||s.blog_home_enabled==='false'){root.hidden=true;return;}
 const grid=root.querySelector('[data-home-blog-grid]');if(!grid)return;
 const title=root.querySelector('#home-insights-title'),intro=root.querySelector('.home-section-intro__body .lede');if(title&&s.blog_home_title)title.textContent=s.blog_home_title;if(intro&&s.blog_home_intro)intro.textContent=s.blog_home_intro;
 try{const {key,dir}=sortArgs(s);const limit=Math.min(12,Math.max(1,Number(s.blog_home_limit)||3));const {posts}=await getPosts({order:key+'.'+dir+',created_at.desc',limit:String(limit)});grid.innerHTML=posts.length?posts.map(p=>card(p,s.blog_home_layout||'grid')).join(''):'<div class="blog-empty"><p>New articles are on the way.</p><a href="/blog">Explore insights</a></div>';}
 catch(e){grid.innerHTML='<p class="muted">Insights are temporarily unavailable. Please try again shortly.</p>';}
}
async function initListing(){
 const grid=document.querySelector('[data-insights-grid]');if(!grid)return;const pager=document.querySelector('[data-blog-pagination]'),search=document.querySelector('[data-blog-search]'),s=settings(),url=new URL(location.href);
 const size=Math.min(30,Math.max(1,Number(s.blog_page_size)||9));const page=Math.max(1,parseInt(url.searchParams.get('page')||'1',10)||1);const query=(url.searchParams.get('q')||'').trim();if(search)search.value=query;
 grid.innerHTML='<p class="muted">Loading published articles…</p>';
 try{const {key,dir}=sortArgs(s);const params={order:key+'.'+dir+',created_at.desc',limit:String(size),offset:String((page-1)*size)};if(query)params.or='(title.ilike.*'+query.replace(/[(),.]/g,' ')+'*,excerpt.ilike.*'+query.replace(/[(),.]/g,' ')+'*)';const {posts,count}=await getPosts(params,'0-0');const total=Number((count||'').split('/').pop())||0;const pages=Math.max(1,Math.ceil(total/size));grid.innerHTML=posts.length?posts.map(p=>card(p,s.blog_layout||'grid')).join(''):'<div class="blog-empty"><h2>No articles found</h2><p>Try another search or browse all insights.</p><a href="/blog">View all articles</a></div>';
 if(pager)pager.innerHTML=pages>1?'<a class="btn btn--ghost" href="/blog?'+(query?'q='+encodeURIComponent(query)+'&':'')+'page='+Math.max(1,page-1)+'" '+(page===1?'aria-disabled="true" tabindex="-1"':'')+'>← Previous</a><span>Page '+page+' of '+pages+'</span><a class="btn btn--ghost" href="/blog?'+(query?'q='+encodeURIComponent(query)+'&':'')+'page='+Math.min(pages,page+1)+'" '+(page>=pages?'aria-disabled="true" tabindex="-1"':'')+'>Next →</a>':'';
 if(search&&!search.dataset.ready){search.dataset.ready='1';search.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const u=new URL('/blog',location.origin);if(search.value.trim())u.searchParams.set('q',search.value.trim());location.href=u.pathname+u.search;}});}
 }catch(e){grid.innerHTML='<p class="muted">Articles could not be loaded. Please try again later.</p>';if(pager)pager.innerHTML='';}
}
function setMeta(name,content,attr='name'){if(!content)return;let el=document.querySelector('meta['+attr+'="'+name+'"]');if(!el){el=document.createElement('meta');el.setAttribute(attr,name);document.head.appendChild(el);}el.content=content;}
function addSchema(data){let el=document.getElementById('blog-jsonld');if(!el){el=document.createElement('script');el.type='application/ld+json';el.id='blog-jsonld';document.head.appendChild(el);}el.textContent=JSON.stringify(data).replace(/</g,'\\u003c');}
async function initArticle(){
 const root=document.querySelector('[data-blog-article]');if(!root)return;
 const parts=location.pathname.split('/').filter(Boolean);const slug=new URL(location.href).searchParams.get('slug')||(parts[0]==='blog'?parts[parts.length-1]:parts[parts.length-1]||'');
 try{
  const {posts}=await getPosts({slug:'eq.'+slug,limit:'1'});const p=posts[0];
  if(!p){root.innerHTML='<section class="band"><div class="shell"><h1>Article not found</h1><p>This article may have been unpublished or moved.</p><a class="btn" href="/blog">Back to insights</a></div></section>';document.title='Article not found | Vatous';setMeta('robots','noindex,follow');return;}
  const desc=plain(p.meta_description||p.excerpt||p.answer_summary).slice(0,320),canonical=p.canonical_url||location.origin+'/blog/'+encodeURIComponent(p.slug),title=p.meta_title||p.title+' | Vatous Insights',image=p.social_image_url||p.cover_image_url;
  document.title=title;setMeta('description',desc);setMeta('robots',p.noindex?'noindex,follow':'index,follow');
  let canon=document.querySelector('link[rel="canonical"]');if(!canon){canon=document.createElement('link');canon.rel='canonical';document.head.appendChild(canon);}canon.href=canonical;
  setMeta('og:type','article','property');setMeta('og:title',p.social_title||p.meta_title||p.title,'property');setMeta('og:description',p.social_description||desc,'property');setMeta('og:url',canonical,'property');if(image)setMeta('og:image',image,'property');setMeta('twitter:card','summary_large_image');setMeta('twitter:title',p.social_title||p.title);setMeta('twitter:description',p.social_description||desc);if(image)setMeta('twitter:image',image);
  const date=p.published_at||p.created_at,updated=p.updated_at||date;
  const content=safeHtml(p.body||'');const tmp=new DOMParser().parseFromString(content,'text/html');const headings=[...tmp.querySelectorAll('h2,h3')];let toc='';if(settings().blog_show_toc!==false&&headings.length>=4){const items=headings.map((h,n)=>{const id='section-'+(n+1);h.id=id;return '<li class="toc-'+h.tagName.toLowerCase()+'"><a href="#'+id+'">'+esc(h.textContent)+'</a></li>';});toc='<nav class="article-toc" aria-label="Table of contents"><h2>In this article</h2><ol>'+items.join('')+'</ol></nav>';}
  const body=tmp.body.innerHTML;const cover=p.cover_image_url?'<img class="article-cover" src="'+esc(p.cover_image_url)+'" alt="'+esc(p.cover_image_alt||p.title)+'" width="1200" height="675" fetchpriority="high" decoding="async">':'';
  root.innerHTML='<section class="hero band band--flush-bottom"><div class="shell"><div class="article-hero"><nav aria-label="Breadcrumb"><a class="text-link" href="/blog">Insights</a> / '+esc(p.category||'Insights')+'</nav><p class="insight-meta">'+esc(p.category||'Insights')+' · '+Math.max(1,Number(p.read_minutes)||5)+' min read · '+esc(p.author||'Vatous Team')+'</p><h1 class="display">'+esc(p.title)+'</h1>'+(p.excerpt?'<p class="lede">'+esc(p.excerpt)+'</p>':'')+'<p class="insight-meta">Published '+esc(new Date(date).toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric'}))+(updated&&updated!==date?' · Updated '+esc(new Date(updated).toLocaleDateString()):'')+'</p>'+cover+'</div></div></section><section class="band"><article class="shell article-content" style="max-width:'+Math.min(1000,Math.max(620,Number(settings().blog_content_width)||760))+'px">'+toc+'<div class="article-body">'+body+'</div><div class="article-share"><span>Share this article</span> <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(canonical)+'">LinkedIn</a> · <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(canonical)+'">Facebook</a> · <a href="mailto:?subject='+encodeURIComponent(p.title)+'&body='+encodeURIComponent(canonical)+'">Email</a></div></article></section><section class="band"><div class="shell"><h2>More from Vatous Insights</h2><div class="insights-grid" data-related-grid><p class="muted">Loading related articles…</p></div></div></section>';
  addSchema({'@context':'https://schema.org','@type':'BlogPosting','headline':p.title,'description':desc,'mainEntityOfPage':{'@type':'WebPage','@id':canonical},'url':canonical,'datePublished':date,'dateModified':updated,'author':{'@type':'Organization','name':p.author||'Vatous Team'},'publisher':{'@type':'Organization','name':'Vatous','url':location.origin},...(image?{image:[image]}:{})});
  addSchemaBreadcrumb(p,canonical);
  try{const {posts:related}=await getPosts({category:'eq.'+p.category,slug:'neq.'+p.slug,order:'published_at.desc',limit:'3'});const rg=root.querySelector('[data-related-grid]');if(rg)rg.innerHTML=related.length?related.map(x=>card(x)).join(''):'<p class="muted">Explore more insights soon.</p>';}catch(_){}
 }catch(e){root.innerHTML='<section class="band"><div class="shell"><h1>Article unavailable</h1><p>Please try again later.</p><a class="btn" href="/blog">Back to insights</a></div></section>';setMeta('robots','noindex,follow');}
}
function addSchemaBreadcrumb(p,url){const canonical=location.origin+'/blog/'+encodeURIComponent(p.slug);const existing=document.getElementById('blog-breadcrumb-jsonld');if(existing)existing.remove();const el=document.createElement('script');el.id='blog-breadcrumb-jsonld';el.type='application/ld+json';el.textContent=JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':location.origin},{'@type':'ListItem','position':2,'name':'Insights','item':location.origin+'/blog'},{'@type':'ListItem','position':3,'name':p.title,'item':canonical}]});document.head.appendChild(el);}
document.addEventListener('DOMContentLoaded',()=>{initHome();initListing();initArticle();});
document.addEventListener('vg:settings',()=>{initHome();initListing();});
})();