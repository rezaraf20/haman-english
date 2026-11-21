/* ui.js: Today screen, swipeable review cards, activity heatmap, appearance settings and haptics (no AI) */
NAVS.unshift(['today', 'امروز']);
NAVICON.today = '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>';
function navOf(v){ return ['today', 'grammar', 'vocab', 'quiz', 'acct', 'review'].indexOf(v) >= 0 ? v : (v === 'errors' ? 'review' : 'ielts'); }
view = 'today';
function reduceMotion(){ return !!prefs.rm || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); }
function buzz(p){ if(prefs.haptic !== false && navigator.vibrate){ try{ navigator.vibrate(p); }catch(e){} } }
function applyTheme(){
  var el = document.documentElement, t = prefs.theme;
  if(t === 'light' || t === 'dark') el.setAttribute('data-theme', t); else el.removeAttribute('data-theme');
  var m = document.querySelector('meta[name=theme-color]'); if(m) m.setAttribute('content', t === 'dark' ? '#0E1626' : '#12213B');
}
applyTheme();
function ring(p, big, small){
  var c = 2 * Math.PI * 52;
  return '<svg viewBox="0 0 120 120" class="ring" role="img" aria-label="'+esc(big+' '+small)+'"><circle cx="60" cy="60" r="52" class="rbg"/><circle cx="60" cy="60" r="52" class="rfg" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+(c * (1 - Math.min(1, p))).toFixed(1)+'" transform="rotate(-90 60 60)"/><text x="60" y="58" text-anchor="middle" class="rt">'+esc(big)+'</text><text x="60" y="76" text-anchor="middle" class="rs">'+esc(small)+'</text></svg>';
}
function topTask(){
  var done = PL[dkey()] || {}, due = queueLen(), xo = errs.filter(function(e){ return e.area === 'exercise' && !e.res; }).length, now = Date.now();
  var dW = W.length ? (now - W[0].ts) / DAY_MS : 99, dS = SH.length ? (now - SH[0].ts) / DAY_MS : 99;
  if(due && !done.v) return {t: 'مرور ' + due + ' کارت لغات', a: 'data-rv="start" data-m="flip" data-go="review"'};
  if(!done.x) return {t: xo ? 'تمرین ' + xo + ' اشتباه گرامر' : 'تمرین گرامر (۱۰ سؤال)', a: 'data-ex="start"'};
  if(!done.w && dW > 2) return {t: 'یک تمرین Writing', a: 'data-view="wlab"'};
  if(!done.s && dS > 2) return {t: 'یک ضبط Speaking', a: 'data-view="slab"'};
  return {t: 'همهٔ کارهای امروز انجام شد؛ یک لغت جدید یاد بگیر', a: 'data-view="vocab"'};
}
function heatHtml(){
  var n = 84, start = new Date(Date.now() - (n - 1) * DAY_MS), pad = start.getDay(), cells = '', tot = 0, i;
  for(i = 0; i < pad; i++) cells += '<i class="hm"></i>';
  for(i = 0; i < n; i++){ var k = dkey(new Date(start.getTime() + i * DAY_MS)), r = days[k], m = r ? r.s / 60 : 0; tot += m; cells += '<i class="hm l'+(m <= 0 ? 0 : m < 10 ? 1 : m < 25 ? 2 : m < 45 ? 3 : 4)+'" title="'+k+': '+Math.round(m)+' دقیقه"></i>'; }
  return '<div class="daily-card" style="margin-top:12px"><div class="daily-eyebrow">فعالیت ۱۲ هفتهٔ اخیر · '+(Math.round(tot / 6) / 10)+' ساعت</div><div class="heat">'+cells+'</div></div>';
}
function renderToday(){
  var goal = prefs.mins || 40, mins = Math.round((dayRec().s || 0) / 60), hr = new Date().getHours();
  var hello = hr < 5 ? 'شب بخیر' : hr < 12 ? 'صبح بخیر' : hr < 18 ? 'روز بخیر' : 'عصر بخیر', nm = prefs.name || (session ? session.user.email.split('@')[0] : '');
  var tk = topTask(), t = todayWord;
  var h = '<div class="hero"><div><div class="hello">'+hello+(nm ? '، '+esc(nm) : '')+'</div><div class="hsub">هدف امروز: '+goal+' دقیقه</div><div class="flame">🔥 '+streak+' روز پیاپی</div></div>'+ring(mins / goal, mins+' / '+goal, 'دقیقه')+'</div>';
  h += '<button class="daily-btn cta" '+tk.a+'>'+tk.t+' ←</button>';
  h += '<div class="daily-card" style="margin-top:14px"><div class="daily-eyebrow">کلمهٔ امروز</div><div class="daily-title">'+emo(t)+' '+esc(t.w)+' <span style="font-weight:400;font-size:13px;color:var(--fg-mut)">'+esc(t.ipa)+'</span></div><p class="daily-usage" style="margin:0">'+esc(t.fa)+' <button class="mini" style="width:auto;display:inline;padding:2px 10px" data-say="'+esc(t.w)+'" data-lang="en-GB">🔊</button></p></div>';
  h += planHtml() + heatHtml();
  h += '<div class="daily-card" style="margin-top:12px"><div class="daily-eyebrow">ظاهر و تجربه</div><div class="chips" style="padding-top:2px">'+[['auto', 'خودکار'], ['light', 'روشن'], ['dark', 'تیره']].map(function(x){ return '<button class="chip '+((prefs.theme || 'auto') === x[0] ? 'active' : '')+'" data-ui="theme" data-v="'+x[0]+'">'+x[1]+'</button>'; }).join('')+'</div><div class="chips" style="padding-top:2px"><button class="chip '+(prefs.haptic !== false ? 'active' : '')+'" data-ui="haptic">ویبره '+(prefs.haptic !== false ? 'روشن' : 'خاموش')+'</button><button class="chip '+(reduceMotion() ? 'active' : '')+'" data-ui="rm">کاهش حرکت '+(prefs.rm ? 'روشن' : 'خودکار')+'</button></div></div>';
  return h;
}
var _rs = rSession;
rSession = function(){
  var h = _rs();
  if(rv && rv.mode === 'flip'){
    h = h.replace('<div class="daily-card" style="margin-top:0">', '<div class="daily-card swipe" id="swc" style="margin-top:0">');
    h = h.replace('<div class="rate">', '<div class="swhint">← دوباره · خوب →</div><div class="rate">');
    if(!rv.show) h = h.replace('<p class="daily-usage">', '<p class="daily-usage">(روی کارت بزن) ');
  }
  return h;
};
function flyOut(el, dir, g){
  buzz(g >= 2 ? [15] : [30, 40, 30]);
  if(reduceMotion()){ applyGrade(g); render(); return; }
  el.style.transition = 'transform .22s,opacity .22s'; el.style.transform = 'translateX('+(dir * window.innerWidth)+'px) rotate('+(dir * 18)+'deg)'; el.style.opacity = '0';
  setTimeout(function(){ applyGrade(g); render(); }, 210);
}
function bindSwipe(){
  var el = document.getElementById('swc'); if(!el || !rv || rv.done) return;
  var sx = 0, dx = 0, on = false;
  el.addEventListener('pointerdown', function(e){ if(e.target.closest('button,input,a,label')) return; on = true; sx = e.clientX; dx = 0; if(e.pointerId !== undefined && el.setPointerCapture){ try{ el.setPointerCapture(e.pointerId); }catch(x){} } el.style.transition = 'none'; });
  el.addEventListener('pointermove', function(e){
    if(!on || !rv.show) return; dx = e.clientX - sx;
    if(!reduceMotion()){ el.style.transform = 'translateX('+dx+'px) rotate('+(dx / 28)+'deg)'; }
    el.style.boxShadow = '0 0 0 3px ' + (dx > 20 ? 'rgba(62,142,90,.7)' : dx < -20 ? 'rgba(192,57,43,.7)' : 'transparent');
  });
  el.addEventListener('pointerup', function(){
    if(!on) return; on = false;
    if(Math.abs(dx) < 8){ if(!rv.show){ rv.show = true; render(); } return; }
    if(!rv.show) return;
    if(dx > 90) flyOut(el, 1, 2); else if(dx < -90) flyOut(el, -1, 0); else { el.style.transition = 'transform .2s'; el.style.transform = ''; el.style.boxShadow = ''; }
  });
  el.addEventListener('pointercancel', function(){ on = false; el.style.transform = ''; el.style.boxShadow = ''; });
}
var _render = render;
render = function(){ _render(); bindSwipe(); };
var _ea = exAnswer;
exAnswer = function(j){ _ea(j); var it = ex.q[ex.i]; buzz(it.ord[j] === it.x.a ? [15] : [30, 40, 30]); };
var _ct = checkTyped;
checkTyped = function(){ _ct(); if(rv && rv.res) buzz(rv.res.ok ? [15] : [30, 40, 30]); };
document.getElementById('app').addEventListener('click', function(e){
  var g = e.target.closest('[data-go]'); if(g){ view = g.getAttribute('data-go'); render(); return; }
  var t = e.target.closest('[data-ui]'); if(!t) return;
  var a = t.getAttribute('data-ui');
  if(a === 'theme') prefs.theme = t.getAttribute('data-v'); else if(a === 'haptic') prefs.haptic = prefs.haptic === false; else if(a === 'rm') prefs.rm = !prefs.rm;
  save('haman_prefs', prefs); applyTheme(); render();
});
