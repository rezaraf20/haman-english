/* exercise.js: adaptive grammar exercises, daily planner and local backup (no AI) */
var EX = [{"id": "x0", "cat": "زمان فعل", "lvl": "B1", "type": "mcq", "q": "She ___ in London since 2018.", "o": ["live", "lives", "has lived", "is living"], "a": 2, "e": "since + نقطهٔ شروع ← Present Perfect: has lived."}, {"id": "x1", "cat": "زمان فعل", "lvl": "B1", "type": "mcq", "q": "I ___ him yesterday at the station.", "o": ["have seen", "saw", "was seeing", "have been seeing"], "a": 1, "e": "yesterday = زمان مشخص گذشته ← Past Simple."}, {"id": "x2", "cat": "زمان فعل", "lvl": "B2", "type": "mcq", "q": "By the time we arrived, the film ___.", "o": ["started", "has started", "had started", "was starting"], "a": 2, "e": "کار اول (شروع فیلم) قبل از رسیدن ← Past Perfect."}, {"id": "x3", "cat": "زمان فعل", "lvl": "B1", "type": "mcq", "q": "Look at those clouds! It ___ rain.", "o": ["will", "is going to", "would", "rains"], "a": 1, "e": "پیش‌بینی با شواهد فعلی ← be going to."}, {"id": "x4", "cat": "شرطی‌ها", "lvl": "B1", "type": "mcq", "q": "If I ___ more time, I would learn another language.", "o": ["have", "had", "would have", "will have"], "a": 1, "e": "Second conditional: If + past simple, would + V1."}, {"id": "x5", "cat": "شرطی‌ها", "lvl": "B2", "type": "mcq", "q": "If she ___ harder, she would have passed the exam.", "o": ["studied", "had studied", "studies", "would study"], "a": 1, "e": "Third conditional: If + past perfect, would have + V3."}, {"id": "x6", "cat": "شرطی‌ها", "lvl": "B1", "type": "mcq", "q": "Unless you ___ now, you will miss the bus.", "o": ["don't leave", "leave", "won't leave", "left"], "a": 1, "e": "unless = if not؛ بعد از آن فعل مثبت می‌آید."}, {"id": "x7", "cat": "شرطی‌ها", "lvl": "B1", "type": "mcq", "q": "If you heat ice, it ___.", "o": ["melts", "would melt", "melted", "is melting"], "a": 0, "e": "Zero conditional (حقیقت علمی): present + present."}, {"id": "x8", "cat": "مجهول", "lvl": "B1", "type": "mcq", "q": "The bridge ___ in 1990.", "o": ["built", "was built", "has built", "is built"], "a": 1, "e": "عامل مهم نیست و زمان گذشته است ← was built."}, {"id": "x9", "cat": "مجهول", "lvl": "B1", "type": "mcq", "q": "The report ___ by the committee next week.", "o": ["will publish", "will be published", "publishes", "is publishing"], "a": 1, "e": "آینده مجهول: will be + V3."}, {"id": "x10", "cat": "مجهول", "lvl": "B2", "type": "mcq", "q": "The accident ___ last night.", "o": ["was happened", "happened", "has been happened", "is happening"], "a": 1, "e": "happen فعل لازم است و مجهول نمی‌شود."}, {"id": "x11", "cat": "مجهول", "lvl": "B1", "type": "mcq", "q": "English ___ in many countries.", "o": ["speaks", "is spoken", "is speaking", "spoke"], "a": 1, "e": "فاعل (زبان) کار را انجام نمی‌دهد ← is spoken."}, {"id": "x12", "cat": "حرف تعریف", "lvl": "B1", "type": "mcq", "q": "She gave me some useful ___.", "o": ["advices", "advice", "an advice", "the advices"], "a": 1, "e": "advice غیرقابل‌شمارش است."}, {"id": "x13", "cat": "حرف تعریف", "lvl": "B1", "type": "mcq", "q": "___ life is full of surprises.", "o": ["The", "A", "No article", "An"], "a": 2, "e": "معنای کلی و غیرقابل‌شمارش ← بدون حرف تعریف."}, {"id": "x14", "cat": "حرف تعریف", "lvl": "B1", "type": "mcq", "q": "He is ___ honest man.", "o": ["a", "an", "the", "no article"], "a": 1, "e": "صدای اول honest مصوت است (h خوانده نمی‌شود) ← an."}, {"id": "x15", "cat": "حرف تعریف", "lvl": "B2", "type": "mcq", "q": "She studies at ___ University of Tehran.", "o": ["a", "an", "the", "no article"], "a": 2, "e": "نام مشخص با of ← the University of Tehran."}, {"id": "x16", "cat": "حروف اضافه", "lvl": "B1", "type": "mcq", "q": "She is interested ___ photography.", "o": ["on", "in", "at", "for"], "a": 1, "e": "interested in."}, {"id": "x17", "cat": "حروف اضافه", "lvl": "B1", "type": "mcq", "q": "They discussed ___ yesterday.", "o": ["about the plan", "the plan", "on the plan", "of the plan"], "a": 1, "e": "discuss مفعول مستقیم می‌گیرد، بدون حرف اضافه."}, {"id": "x18", "cat": "حروف اضافه", "lvl": "B1", "type": "mcq", "q": "The success of the project depends ___ teamwork.", "o": ["of", "on", "from", "with"], "a": 1, "e": "depend on."}, {"id": "x19", "cat": "حروف اضافه", "lvl": "B2", "type": "mcq", "q": "There has been a sharp increase ___ prices.", "o": ["of", "in", "on", "at"], "a": 1, "e": "an increase in + اسم."}, {"id": "x20", "cat": "مطابقت فاعل و فعل", "lvl": "B1", "type": "mcq", "q": "The number of students ___ increased.", "o": ["have", "has", "are", "were"], "a": 1, "e": "The number of + فعل مفرد."}, {"id": "x21", "cat": "مطابقت فاعل و فعل", "lvl": "B2", "type": "mcq", "q": "A number of students ___ complained.", "o": ["has", "have", "is", "was"], "a": 1, "e": "A number of + فعل جمع."}, {"id": "x22", "cat": "مطابقت فاعل و فعل", "lvl": "B2", "type": "mcq", "q": "Neither the teacher nor the students ___ ready.", "o": ["was", "were", "is", "has been"], "a": 1, "e": "فعل با نزدیک‌ترین فاعل (students) هماهنگ می‌شود."}, {"id": "x23", "cat": "مطابقت فاعل و فعل", "lvl": "B1", "type": "mcq", "q": "Everyone ___ responsible for the result.", "o": ["are", "is", "were", "have"], "a": 1, "e": "Everyone مفرد است."}, {"id": "x24", "cat": "جملهٔ موصولی", "lvl": "B1", "type": "mcq", "q": "The man ___ called you is my boss.", "o": ["which", "who", "whose", "whom"], "a": 1, "e": "برای آدم و در نقش فاعل ← who."}, {"id": "x25", "cat": "جملهٔ موصولی", "lvl": "B2", "type": "mcq", "q": "The book ___ cover is red is mine.", "o": ["who", "which", "whose", "that"], "a": 2, "e": "مالکیت ← whose."}, {"id": "x26", "cat": "جملهٔ موصولی", "lvl": "B1", "type": "mcq", "q": "This is the city ___ I grew up.", "o": ["where", "which", "who", "whose"], "a": 0, "e": "مکان ← where."}, {"id": "x27", "cat": "جملهٔ موصولی", "lvl": "B2", "type": "mcq", "q": "My brother, ___ lives in Berlin, called me.", "o": ["that", "who", "which", "whom"], "a": 1, "e": "در non-defining از that استفاده نمی‌شود؛ برای آدم who."}, {"id": "x28", "cat": "مصدر و gerund", "lvl": "B1", "type": "mcq", "q": "I look forward to ___ you.", "o": ["meet", "meeting", "met", "to meet"], "a": 1, "e": "در look forward to کلمهٔ to حرف اضافه است ← -ing."}, {"id": "x29", "cat": "مصدر و gerund", "lvl": "B1", "type": "mcq", "q": "She decided ___ abroad.", "o": ["studying", "to study", "study", "studied"], "a": 1, "e": "decide + to V."}, {"id": "x30", "cat": "مصدر و gerund", "lvl": "B2", "type": "mcq", "q": "He stopped ___ when the doctor warned him.", "o": ["to smoke", "smoking", "smoke", "smoked"], "a": 1, "e": "stop + -ing = دست کشیدن از کاری."}, {"id": "x31", "cat": "مصدر و gerund", "lvl": "B1", "type": "mcq", "q": "I enjoy ___ new languages.", "o": ["to learn", "learning", "learn", "learned"], "a": 1, "e": "enjoy + -ing."}, {"id": "x32", "cat": "افعال وجهی", "lvl": "B1", "type": "mcq", "q": "You ___ wear a seat belt; it is the law.", "o": ["could", "must", "might", "would"], "a": 1, "e": "الزام قانونی ← must."}, {"id": "x33", "cat": "افعال وجهی", "lvl": "B2", "type": "mcq", "q": "He ___ be at home; his lights are on.", "o": ["must", "should", "can", "would"], "a": 0, "e": "استنباط قوی ← must."}, {"id": "x34", "cat": "افعال وجهی", "lvl": "B2", "type": "mcq", "q": "You ___ come tomorrow; the office is closed.", "o": ["mustn't", "don't have to", "can't", "must"], "a": 1, "e": "don't have to = لازم نیست؛ mustn't = ممنوع."}, {"id": "x35", "cat": "افعال وجهی", "lvl": "B2", "type": "mcq", "q": "She ___ have left already; her coat isn't here.", "o": ["must", "can", "should", "would"], "a": 0, "e": "استنباط دربارهٔ گذشته ← must have + V3."}, {"id": "x36", "cat": "نقل قول", "lvl": "B1", "type": "mcq", "q": "She said she ___ tired.", "o": ["is", "was", "has been", "will be"], "a": 1, "e": "backshift: is ← was."}, {"id": "x37", "cat": "نقل قول", "lvl": "B1", "type": "mcq", "q": "He asked me where I ___.", "o": ["live", "lived", "do live", "did live"], "a": 1, "e": "در سؤال غیرمستقیم ترتیب خبری و یک قدم عقب‌تر: lived."}, {"id": "x38", "cat": "نقل قول", "lvl": "B2", "type": "mcq", "q": "The teacher told us ___ talking.", "o": ["stop", "to stop", "stopping", "stopped"], "a": 1, "e": "told + مفعول + to V."}, {"id": "x39", "cat": "نقل قول", "lvl": "B1", "type": "mcq", "q": "She asked ___ I could help.", "o": ["that", "if", "what", "do"], "a": 1, "e": "سؤال بله/خیر در نقل غیرمستقیم ← if / whether."}, {"id": "x40", "cat": "مقایسه", "lvl": "B1", "type": "mcq", "q": "This exam was ___ than the last one.", "o": ["more difficult", "most difficult", "difficulter", "more difficulter"], "a": 0, "e": "صفت بلند ← more + adj + than."}, {"id": "x41", "cat": "مقایسه", "lvl": "B1", "type": "mcq", "q": "She is the ___ student in the class.", "o": ["more intelligent", "most intelligent", "intelligentest", "intelligent"], "a": 1, "e": "صفت عالی صفت بلند ← the most + adj."}, {"id": "x42", "cat": "مقایسه", "lvl": "B2", "type": "mcq", "q": "The ___ the price, the lower the demand.", "o": ["high", "higher", "highest", "more high"], "a": 1, "e": "ساختار the + comparative, the + comparative."}, {"id": "x43", "cat": "مقایسه", "lvl": "B1", "type": "mcq", "q": "Cars are not as cheap ___ bikes.", "o": ["than", "as", "like", "that"], "a": 1, "e": "as + adj + as."}, {"id": "x44", "cat": "ساخت واژه", "lvl": "B1", "type": "mcq", "q": "There has been a ___ increase in sales.", "o": ["significantly", "significant", "significance", "signify"], "a": 1, "e": "قبل از اسم صفت لازم است."}, {"id": "x45", "cat": "ساخت واژه", "lvl": "B2", "type": "mcq", "q": "The country's ___ is growing rapidly.", "o": ["economy", "economic", "economical", "economically"], "a": 0, "e": "بعد از ملکی اسم می‌آید ← economy."}, {"id": "x46", "cat": "ساخت واژه", "lvl": "B2", "type": "mcq", "q": "He behaved very ___ during the interview.", "o": ["professional", "professionally", "profession", "professionalism"], "a": 1, "e": "قید برای توصیف فعل ← professionally."}, {"id": "x47", "cat": "ساخت واژه", "lvl": "B1", "type": "mcq", "q": "Air ___ is a serious problem in big cities.", "o": ["pollute", "pollution", "polluted", "polluting"], "a": 1, "e": "اسم لازم است ← pollution."}, {"id": "x48", "cat": "حروف اضافه", "lvl": "B1", "type": "err", "q": "Find the error", "o": ["Despite of", "the rain,", "the match", "was played."], "a": 0, "e": "Despite بدون of؛ یا in spite of."}, {"id": "x49", "cat": "مطابقت فاعل و فعل", "lvl": "B1", "type": "err", "q": "Find the error", "o": ["The number of cars", "have increased", "sharply", "since 2010."], "a": 1, "e": "The number of + فعل مفرد ← has increased."}, {"id": "x50", "cat": "مصدر و gerund", "lvl": "B1", "type": "err", "q": "Find the error", "o": ["She suggested", "to go", "to the museum", "after lunch."], "a": 1, "e": "suggest + -ing ← suggested going."}, {"id": "x51", "cat": "شرطی‌ها", "lvl": "B2", "type": "err", "q": "Find the error", "o": ["If I would have", "more time,", "I would learn", "French."], "a": 0, "e": "در جملهٔ if از would استفاده نمی‌شود ← If I had."}, {"id": "x52", "cat": "مطابقت فاعل و فعل", "lvl": "B1", "type": "err", "q": "Find the error", "o": ["Each of the students", "have", "their own", "laptop."], "a": 1, "e": "Each of the + جمع + فعل مفرد ← has."}, {"id": "x53", "cat": "حرف تعریف", "lvl": "B1", "type": "err", "q": "Find the error", "o": ["The informations", "that we collected", "were", "very useful."], "a": 0, "e": "information غیرقابل‌شمارش است؛ جمع ندارد."}, {"id": "x54", "cat": "مقایسه", "lvl": "B1", "type": "err", "q": "Find the error", "o": ["He is", "more taller", "than his brother", "by five centimetres."], "a": 1, "e": "taller (صفت کوتاه) بدون more."}, {"id": "x55", "cat": "زمان فعل", "lvl": "B1", "type": "err", "q": "Find the error", "o": ["I have seen", "him", "yesterday", "at the library."], "a": 0, "e": "yesterday ← Past Simple: I saw."}];
var EXS = load('hm_ex', {}), PL = load('hm_plan', {}), ex = null;
var BK = ['haman_done','haman_vocab_done','haman_streak','haman_prefs','haman_qlocal','hm_srs','hm_err','hm_days','hm_wsub','hm_wdraft','hm_spk','hm_ex','hm_plan'];
function shuf(a){ for(var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function exPick(n, onlyErr){
  var open = errs.filter(function(e){ return e.area === 'exercise' && !e.res; }), oi = {}, oc = {};
  open.forEach(function(e){ oi[e.item] = 1; oc[e.cat] = 1; });
  var pool = EX.filter(function(x){ return !onlyErr || oi[x.id]; }), out = [];
  while(out.length < n && pool.length){
    var ws = pool.map(function(x){ var s = EXS[x.id] || {c: 0, w: 0}, w = 1; if(oi[x.id]) w += 4; if(oc[x.cat]) w += 2; if(!s.c && !s.w) w += 1; if(s.c >= 2 && !oi[x.id]) w *= 0.3; return w; });
    var tot = ws.reduce(function(a, b){ return a + b; }, 0), r = Math.random() * tot, k = 0;
    while(k < ws.length - 1 && r > ws[k]){ r -= ws[k]; k++; }
    out.push(pool.splice(k, 1)[0]);
  }
  return out;
}
function exStart(onlyErr){
  var l = exPick(10, onlyErr);
  ex = {q: l.map(function(x){ var o = x.o.map(function(_, i){ return i; }); if(x.type === 'mcq') shuf(o); return {x: x, ord: o}; }), i: 0, n: 0, ok: 0, pick: null, wrong: {}, done: !l.length};
}
function exAnswer(j){
  if(ex.pick !== null) return;
  var it = ex.q[ex.i], x = it.x, ok = it.ord[j] === x.a;
  ex.pick = j; ex.n++; if(ok) ex.ok++; else ex.wrong[x.cat] = (ex.wrong[x.cat] || 0) + 1;
  var s = EXS[x.id] || (EXS[x.id] = {c: 0, w: 0, t: 0}); if(ok) s.c++; else s.w++; s.t = Date.now(); save('hm_ex', EXS);
  var open = errs.filter(function(e){ return e.area === 'exercise' && e.item === x.id && !e.res; })[0];
  if(ok){ if(open) errUpdate(open, true); }
  else logErr({area: 'exercise', cat: x.cat, item: x.id, prompt: x.type === 'err' ? 'Find the error: ' + x.o.join(' ') : x.q, ua: x.o[it.ord[j]], ca: x.o[x.a], ex: x.e});
  sv(); schedSrs();
}
function exHome(){
  var oe = errs.filter(function(e){ return e.area === 'exercise' && !e.res; }).length;
  return '<div class="section-title">تمرین هوشمند گرامر</div><div class="daily-card" style="margin-top:0"><p class="daily-usage">۱۰ سؤال؛ سؤال‌هایی که قبلاً اشتباه کرده‌ای و موضوع‌های ضعیف‌ترت بیشتر می‌آیند. هر اشتباه با دو پاسخ درست حل می‌شود. ('+EX.length+' سؤال اصلی با توضیح)</p><button class="daily-btn" data-ex="start">شروع (۱۰ سؤال)</button>'+(oe ? '<button class="daily-btn done" style="margin-top:8px" data-ex="errs">فقط اشتباهات قبلی ('+oe+')</button>' : '')+'</div>';
}
function exSession(){
  var it = ex.q[ex.i], x = it.x, h = '<div class="daily-eyebrow" style="margin:0 4px 6px">'+(ex.i + 1)+' / '+ex.q.length+' · '+x.cat+'</div><div class="daily-card" style="margin-top:0"><p class="vex" style="font-size:15px;font-weight:600">'+esc(x.type === 'err' ? 'Find the error: ' + x.o.join(' ') : x.q)+'</p>';
  it.ord.forEach(function(r, j){ var c = ''; if(ex.pick !== null){ if(r === x.a) c = ' ok'; else if(j === ex.pick) c = ' bad'; } h += '<button class="opt2'+c+'" data-ex="pick" data-j="'+j+'">'+(x.type === 'err' ? '('+'ABCD'.charAt(j)+') ' : '')+esc(x.o[r])+'</button>'; });
  if(ex.pick !== null) h += '<div class="'+(it.ord[ex.pick] === x.a ? 'res-ok' : 'res-bad')+'">'+(it.ord[ex.pick] === x.a ? 'درست ✔' : 'نادرست ✘')+'</div><div class="vfa">'+x.e+'</div><button class="daily-btn" data-ex="next">'+(ex.i + 1 >= ex.q.length ? 'پایان' : 'بعدی')+'</button>';
  return h + '</div><button class="daily-btn done" data-ex="end">پایان جلسه</button>';
}
function exSummary(){
  var w = Object.keys(ex.wrong).map(function(k){ return k + ' ('+ex.wrong[k]+')'; });
  return '<div class="section-title">نتیجهٔ تمرین گرامر</div><div class="daily-card" style="margin-top:0"><div class="big">'+Math.round(ex.ok / Math.max(1, ex.n) * 100)+'%</div><p class="daily-usage">'+ex.ok+' درست از '+ex.n+'.'+(w.length ? ' موضوع‌های نیازمند مرور: '+w.join('، ') : ' عالی بود!')+'</p><button class="daily-btn" data-ex="start">۱۰ سؤال دیگر</button><button class="daily-btn done" style="margin-top:8px" data-ex="end">بازگشت</button></div>';
}
function exStats(){
  var cats = {}; EX.forEach(function(x){ var s = EXS[x.id]; if(s && (s.c + s.w)){ var c = cats[x.cat] || (cats[x.cat] = {c: 0, t: 0}); c.c += s.c; c.t += s.c + s.w; } });
  var ks = Object.keys(cats).sort(function(a, b){ return cats[a].c / cats[a].t - cats[b].c / cats[b].t; });
  return '<div class="daily-card" style="margin-top:12px"><div class="daily-eyebrow">دقت تمرین گرامر به تفکیک موضوع</div>'+(ks.length ? ks.map(function(k){ var p = Math.round(cats[k].c / cats[k].t * 100); return '<div class="pcat"><span><b>'+k+'</b><span style="direction:ltr">'+p+'% ('+cats[k].t+')</span></span><div class="bar"><div style="width:'+p+'%"></div></div></div>'; }).join('') : '<p class="daily-usage" style="margin:0">هنوز تمرینی حل نکرده‌ای.</p>')+'</div>';
}
/* ---- daily planner (rule-based, uses your own data) ---- */
function buildPlan(){
  var mins = prefs.mins || 40, due = queueLen(), now = Date.now(), oe = openErrs();
  var dW = W.length ? (now - W[0].ts) / DAY_MS : 99, dS = SH.length ? (now - SH[0].ts) / DAY_MS : 99;
  var xo = errs.filter(function(e){ return e.area === 'exercise' && !e.res; }).length;
  var it = [{k: 'v', w: due ? 3 : 1, t: 'مرور لغات (SRS)', d: due ? due + ' کارت سررسید یا جدید' : 'امروز مروری نیست؛ لغت جدید از تب لغات', b: due ? '<button class="mini" style="width:auto;display:inline;padding:4px 10px" data-rv="start" data-m="flip">شروع</button>' : '<button class="mini" style="width:auto;display:inline;padding:4px 10px" data-view="vocab">لغات</button>'},
    {k: 'x', w: xo ? 3 : 2, t: xo ? 'تمرین گرامر و اشتباهات' : 'تمرین گرامر', d: xo ? xo + ' اشتباه باز در تمرین‌های گرامر' : '۱۰ سؤال تطبیقی', b: '<button class="mini" style="width:auto;display:inline;padding:4px 10px" data-ex="start">شروع</button>'},
    {k: 'w', w: dW > 3 ? 3 : 1.5, t: 'Writing Lab', d: dW > 3 ? (W.length ? 'چند روز است ننوشته‌ای' : 'هنوز شروع نکرده‌ای') + '؛ یک Task 2 یا Task 1' : 'یک بازنویسی یا نوشتهٔ جدید', b: '<button class="mini" style="width:auto;display:inline;padding:4px 10px" data-view="wlab">برو</button>'},
    {k: 's', w: dS > 3 ? 2 : 1, t: 'Speaking Studio', d: dS > 3 ? 'چند روز است ضبط نکرده‌ای' : 'یک Part 2 یا Part 3', b: '<button class="mini" style="width:auto;display:inline;padding:4px 10px" data-view="slab">برو</button>'}];
  var tot = it.reduce(function(a, x){ return a + x.w; }, 0), sum = 0, big = it[0];
  it.forEach(function(x){ x.m = Math.max(5, 5 * Math.round(mins * x.w / tot / 5)); sum += x.m; if(x.w > big.w) big = x; });
  if(mins - sum >= 5 || (sum - mins >= 5 && big.m - (sum - mins) >= 5)) big.m += mins - sum;
  var cats = {}; oe.forEach(function(e){ if(['TA','TR','CC','LR','GRA'].indexOf(e.cat) >= 0) cats[e.cat] = (cats[e.cat] || 0) + 1; });
  var wk = Object.keys(cats).sort(function(a, b){ return cats[b] - cats[a]; })[0];
  return {items: it, note: (wk ? 'در Writing بیشتر روی «'+CATL[wk]+'» کار کن (بیشترین مورد باز در چک‌لیست). ' : '') + 'Reading و Listening هنوز در برنامه نیستند (بعداً اضافه می‌شوند).'};
}
function planHtml(){
  var P = buildPlan(), done = PL[dkey()] || {}, mins = prefs.mins || 40;
  var h = '<div class="section-title">برنامهٔ امروز</div><div class="daily-card" style="margin-top:0"><div class="daily-eyebrow">زمان در دسترس</div><div class="chips" style="padding-top:2px">'+[20, 40, 60, 90].map(function(m){ return '<button class="chip '+(mins === m ? 'active' : '')+'" data-pl="mins" data-v="'+m+'">'+m+' دقیقه</button>'; }).join('')+'</div>';
  P.items.forEach(function(x){ h += '<div class="eitem"><b>'+x.m+' دقیقه</b> · '+x.t+'<div class="vfa">'+x.d+'</div>'+x.b+' <button class="mini" style="width:auto;display:inline;padding:4px 10px" data-pl="chk" data-k="'+x.k+'">'+(done[x.k] ? '✔ انجام شد' : 'علامت انجام')+'</button></div>'; });
  return h + '<div class="vfa" style="margin-top:8px">'+P.note+'</div></div>';
}
var _rr = renderReview;
renderReview = function(){
  if(ex && !ex.done) return '<div class="section-title">تمرین هوشمند گرامر</div>' + exSession();
  if(ex && ex.done) return exSummary();
  if(rv) return _rr();
  return planHtml() + exHome() + _rr();
};
var _rd = renderDash;
renderDash = function(){
  return _rd() + exStats() + '<div class="daily-card" style="margin-top:12px"><div class="daily-eyebrow">پشتیبان‌گیری از داده‌ها</div><p class="daily-usage">یک فایل JSON از پیشرفتت (بدون رمز و بدون فایل‌های صوتی) دانلود کن یا از فایل بازیابی کن.</p><button class="daily-btn done" data-bk="export">دانلود پشتیبان</button><label class="daily-btn done" style="display:block;text-align:center;margin-top:8px;cursor:pointer">بازیابی از فایل<input type="file" id="bk_in" accept=".json,application/json" hidden></label></div>';
};
function exportData(){
  var o = {}; BK.forEach(function(k){ var v = localStorage.getItem(k); if(v !== null) o[k] = v; });
  var b = new Blob([JSON.stringify({app: 'haman-english', v: 1, ts: Date.now(), data: o})], {type: 'application/json'}), a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = 'haman-english-backup-' + dkey() + '.json'; document.body.appendChild(a); a.click(); a.remove();
}
document.getElementById('app').addEventListener('click', function(e){
  var t = e.target.closest('[data-ex],[data-pl],[data-bk]'); if(!t) return;
  if(t.hasAttribute('data-ex')){
    var a = t.getAttribute('data-ex');
    if(a === 'start') exStart(false); else if(a === 'errs') exStart(true); else if(a === 'pick') exAnswer(+t.getAttribute('data-j'));
    else if(a === 'next'){ ex.i++; ex.pick = null; if(ex.i >= ex.q.length) ex.done = true; } else if(a === 'end') ex = null;
    view = 'review'; render(); return;
  }
  if(t.hasAttribute('data-pl')){
    var p = t.getAttribute('data-pl');
    if(p === 'mins'){ prefs.mins = +t.getAttribute('data-v'); save('haman_prefs', prefs); }
    else if(p === 'chk'){ var k = dkey(), kk = t.getAttribute('data-k'); PL[k] = PL[k] || {}; PL[k][kk] = !PL[k][kk]; save('hm_plan', PL); }
    render(); return;
  }
  if(t.getAttribute('data-bk') === 'export') exportData();
});
document.getElementById('app').addEventListener('change', function(e){
  if(e.target.id !== 'bk_in') return;
  var f = e.target.files[0]; if(!f || f.size > 3000000){ alert('فایل نامعتبر یا خیلی بزرگ است.'); return; }
  var r = new FileReader();
  r.onload = function(){ try{ var j = JSON.parse(r.result); if(j.app !== 'haman-english' || j.v !== 1 || typeof j.data !== 'object') throw 0;
    Object.keys(j.data).forEach(function(k){ if(BK.indexOf(k) >= 0 && typeof j.data[k] === 'string'){ JSON.parse(j.data[k]); localStorage.setItem(k, j.data[k]); } });
    alert('بازیابی انجام شد؛ برنامه دوباره بارگذاری می‌شود.'); location.reload(); }catch(err){ alert('فایل پشتیبان معتبر نیست.'); } };
  r.readAsText(f);
});
