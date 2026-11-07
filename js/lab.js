/* lab.js - Phase 2: Writing Lab and Speaking Studio.
   No AI is used. Writing statistics are simple, transparent text counts (not scores).
   Speaking audio stays on this device (IndexedDB) and is never uploaded. */
var WT2 = {opinion: 'Opinion', discuss: 'Discussion', advdis: 'Advantages / Disadvantages', probsol: 'Problem / Solution', twopart: 'Two-part question'};
var WP2 = [
 ['o1', 'opinion', 'Some people believe that university education should be free for all students. To what extent do you agree or disagree?'],
 ['d1', 'discuss', 'Some people think children should start learning a foreign language at primary school, while others believe it should start later. Discuss both views and give your own opinion.'],
 ['a1', 'advdis', 'More and more people are working from home. Do the advantages of this trend outweigh the disadvantages?'],
 ['p1', 'probsol', 'In many cities, air pollution is becoming a serious problem. What are the main causes, and what can be done to reduce it?'],
 ['t1', 'twopart', 'Many young people now spend more time on social media than with friends in person. Why is this happening? Is it a positive or negative development?'],
 ['o2', 'opinion', 'Governments should spend more money on public transport than on building new roads. To what extent do you agree or disagree?'],
 ['d2', 'discuss', 'Some people prefer to buy products made in their own country, while others choose the cheapest option regardless of origin. Discuss both views and give your own opinion.'],
 ['a2', 'advdis', 'Tourism is growing quickly in many parts of the world. What are the advantages and disadvantages for local communities?'],
 ['p2', 'probsol', 'Many people find it difficult to maintain a healthy diet. What problems does this cause, and what measures could help?'],
 ['t2', 'twopart', 'In some countries, a growing number of people choose to live alone. What are the reasons for this? Is it a positive or negative trend?']
].map(function(a){ return {id: a[0], task: 2, type: a[1], q: a[2]}; });
var WP1 = [
 {id: 'c1', task: 1, kind: 'bar', q: 'The chart shows the percentage of households with internet access in four countries in 2010 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', labels: ['Country A', 'Country B', 'Country C', 'Country D'], series: [{n: '2010', v: [45, 62, 30, 71]}, {n: '2020', v: [78, 91, 64, 95]}], unit: '%'},
 {id: 'c2', task: 1, kind: 'line', q: 'The graph shows the number of visitors to a museum between 2015 and 2022. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'], series: [{n: 'Visitors (thousands)', v: [120, 135, 150, 160, 175, 40, 70, 140]}], unit: 'thousands'},
 {id: 'c3', task: 1, kind: 'table', q: 'The table shows the average number of hours per week that two age groups spent on three activities. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', cols: ['15-17 years', '18-22 years'], rows: [['Study', 22, 28], ['Sport', 6, 4], ['Social media', 9, 12]]}
,
 {id: 'c4', task: 1, kind: 'pie', q: 'The pie charts show how an average household spent its monthly income in 2000 and in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', charts: [{t: '2000', parts: [['Housing', 30], ['Food', 25], ['Transport', 15], ['Leisure', 10], ['Other', 20]]}, {t: '2020', parts: [['Housing', 35], ['Food', 15], ['Transport', 18], ['Leisure', 17], ['Other', 15]]}]},
 {id: 'c5', task: 1, kind: 'process', q: 'The diagram shows how paper is recycled. Summarise the information by selecting and reporting the main features.', steps: ['Used paper is collected from homes and offices', 'It is sorted and cleaned', 'The paper is mixed with water to make pulp', 'Ink is removed and the pulp is bleached', 'The pulp is pressed and dried into large sheets', 'The sheets are cut and delivered to shops']},
 {id: 'c6', task: 1, kind: 'map', q: 'The maps show a village in 2005 and today. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', before: [['Farm', 'Farm', 'River'], ['School', 'Park', 'River'], ['Houses', 'Houses', 'Road']], after: [['Housing estate', 'Supermarket', 'River'], ['School', 'Car park', 'Bridge'], ['Houses', 'Houses', 'Road']]},
 {id: 'c7', task: 1, kind: 'mixed', q: 'The chart shows the percentage of people who use public transport in four cities, and the table shows the average commuting time. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', labels: ['City A', 'City B', 'City C', 'City D'], series: [{n: 'Public transport users', v: [38, 55, 22, 47]}], unit: '%', cols: ['Average commute (minutes)'], rows: [['City A', 35], ['City B', 28], ['City C', 47], ['City D', 31]]}
];
var WCHK = {
 1: [['TA', 'مقدمه موضوع نمودار را با کلمات خودم بازنویسی کرده'], ['TA', 'Overview روند اصلی یا مقایسهٔ مهم را بدون عدد جزئی گفته'], ['TA', 'داده‌های کلیدی را دقیق و گروه‌بندی‌شده آورده‌ام، بدون نظر شخصی'], ['CC', 'پاراگراف‌بندی روشن دارم (مقدمه، overview، جزئیات)'], ['LR', 'افعال و قیدهای روند یا مقایسه متنوع‌اند'], ['GRA', 'زمان‌ها با دورهٔ نمودار هماهنگ‌اند و خطای ساده ندارم']],
 2: [['TR', 'موضعم در مقدمه و نتیجه روشن و یکسان است'], ['TR', 'به همهٔ بخش‌های سؤال جواب داده‌ام'], ['TR', 'هر ایدهٔ اصلی توضیح و مثال مشخص دارد'], ['CC', 'چهار پاراگراف روشن و topic sentence دارم'], ['CC', 'ربط‌دهنده‌ها طبیعی و غیرتکراری‌اند'], ['LR', 'لغات دقیق‌اند، collocationها طبیعی‌اند و املا چک شده'], ['GRA', 'ترکیبی از جملهٔ ساده و پیچیده دارم'], ['GRA', 'حرف تعریف، زمان و مطابقت فاعل و فعل را چک کرده‌ام']]
};
var STOP = 'the and that this with from have has had are was were will would can could their they them there which who what when where while into than then also been being such some any more most other these those about your our its not but for you she his her him how why'.split(' ');
var LINK = ['however', 'moreover', 'furthermore', 'in addition', 'for example', 'for instance', 'therefore', 'consequently', 'as a result', 'on the other hand', 'in contrast', 'by contrast', 'nevertheless', 'although', 'whereas', 'in conclusion', 'to sum up', 'firstly', 'secondly', 'finally', 'overall', 'in particular'];
var SAMPLES = [
 {t: 'Task 1 · نمودار میله‌ای (c1) · حدود Band 8', text: "The bar chart compares the proportion of households with internet access in four countries in 2010 and 2020.\n\nOverall, internet access rose significantly in every country over the decade. Country D had the highest figures in both years, whereas Country C remained the lowest.\n\nIn 2010, access ranged from 30% in Country C to 71% in Country D, with Country A at 45% and Country B at 62%. Country C then recorded the largest rise, up 34 percentage points to 64%, which more than doubled its starting figure, while Country A climbed by 33 points to 78%.\n\nBy 2020, Country D had reached 95%, an increase of 24 percentage points, and Country B followed closely at 91%. As a result, the gap between the highest and lowest countries narrowed from 41 to 31 percentage points.", notes: ['مقدمه فقط موضوع را بازنویسی کرده است.', 'Overview بدون عدد جزئی روند کلی و بالاترین و پایین‌ترین کشور را می‌گوید.', 'داده‌ها گروه‌بندی و مقایسه شده‌اند؛ تغییرها درست محاسبه شده‌اند.', 'نظر شخصی و پیش‌بینی ندارد.']},
 {t: 'Task 2 · a1 · حدود Band 6 (با خطاهای رایج)', text: "Nowadays many people work from home. In my opinion the advantages of this is more than the disadvantages.\n\nFirstly, working from home save time and money. People dont need to spend two hours in the traffic every day, and they can spend this time with their family. Also they dont need to buy petrol or pay for public transport.\n\nHowever, there are some disadvantages. Some workers feels lonely because they do not meet their colleagues, and this can be bad for their mental health. In addition, it is difficult for some people to concentrate at home because children is making noise.\n\nIn conclusion, I think working from home is good for most of people, but companies should help the workers who feel lonely.", notes: ['کوتاه‌تر از ۲۵۰ کلمه است (جریمهٔ Task Response).', 'ایده‌ها بسط داده نشده‌اند و مثال مشخص ندارند.', 'خطاها: is more than ✘، save ✘، dont ✘، in the traffic ✘، feels ✘، children is ✘، most of people ✘.', 'ربط‌دهنده‌ها ساده‌اند (Firstly، Also، However) و دامنهٔ واژگان محدود است.']},
 {t: 'Task 2 · a1 · حدود Band 8', text: "In recent years, remote working has moved from being an occasional perk to a standard arrangement for millions of employees. Although it has drawbacks, I believe its benefits clearly outweigh them.\n\nThe most obvious advantage is the time and money that employees save. Without a daily commute, a typical worker can recover two hours or more each day, which can be spent on family, exercise or further study. Employers also benefit, since they need smaller offices and often report higher productivity because staff can organise their day around their most focused hours. These gains translate into better morale and lower absenteeism.\n\nNevertheless, remote work is not without problems. Workers who rarely meet colleagues may feel isolated, and the informal conversations that spark new ideas are harder to replicate online. Moreover, home environments are not always suitable: a shared flat or a noisy household can make concentration difficult.\n\nHowever, these problems can largely be addressed. Companies can require occasional days in the office, fund a home workspace and schedule regular video meetings to maintain team spirit, while individuals can set clear boundaries between work and rest.\n\nIn conclusion, although remote working poses real challenges to communication and well-being, they are manageable, and the savings in time, cost and flexibility make the overall effect positive.", notes: ['موضع در مقدمه و نتیجه یکسان و روشن است.', 'هر پاراگراف یک ایدهٔ اصلی دارد و با توضیح و نتیجه بسط داده شده است.', 'لغات دقیق و طبیعی‌اند (commute، absenteeism، replicate)، نه پیچیده‌نویسی بی‌دلیل.', 'پاراگراف چهارم راه‌حل را مطرح می‌کند و استدلال را قوی‌تر می‌کند.']}
];
var W = load('hm_wsub', []), WD = load('hm_wdraft', {}), wDirty = {}, wTimer = null;
var wst = {step: 'home', pid: null, el: 0, run: false, timed: true, pick: [], view: null, msg: ''};
function wsv(){ save('hm_wsub', W); save('hm_wdraft', WD); }
function wcount(t){ return (t.trim().match(/\S+/g) || []).length; }
function wPrompt(id){ return WP1.concat(WP2).filter(function(p){ return p.id === id; })[0]; }
function analyze(t){
  var words = t.toLowerCase().match(/[a-z][a-z'’-]*/g) || [], n = words.length, u = {};
  words.forEach(function(w){ u[w] = (u[w] || 0) + 1; });
  var sents = t.split(/[.!?]+(?:\s|$)/).filter(function(x){ return /\w/.test(x); }).length;
  var paras = t.split(/\n/).filter(function(x){ return /\w/.test(x); }).length, low = t.toLowerCase();
  return {w: wcount(t), s: sents, p: paras, avg: sents ? Math.round(n / sents * 10) / 10 : 0, ttr: n ? Math.round(Object.keys(u).length / n * 100) : 0,
    rep: Object.keys(u).filter(function(w){ return u[w] >= 4 && w.length > 3 && STOP.indexOf(w) < 0; }).sort(function(a, b){ return u[b] - u[a]; }).slice(0, 6).map(function(w){ return w + ' (' + u[w] + ')'; }),
    lk: LINK.filter(function(l){ return new RegExp('\\b' + l + '\\b').test(low); }), c: (t.match(/\b\w+(n't|'re|'ve|'ll|'m|n’t)\b/gi) || []).length};
}
function metricsHtml(t, task){
  var a = analyze(t), min = task === 1 ? 150 : 250, h = '<div class="lbl">شاخص‌های ساده (نمره نیستند)</div><div class="mt">';
  h += '<span class="'+(a.w >= min ? 'ok' : 'warn2')+'">'+a.w+' کلمه (حداقل '+min+')</span><span>'+a.s+' جمله</span><span>'+a.p+' پاراگراف</span><span>میانگین '+a.avg+' کلمه در جمله</span><span>تنوع واژگان '+a.ttr+'%</span><span>'+a.lk.length+' ربط‌دهندهٔ متنوع</span></div>';
  var tips = [];
  if(a.avg > 28) tips.push('جمله‌ها خیلی بلندند؛ چند جمله را بشکن.'); if(a.avg && a.avg < 12) tips.push('جمله‌ها کوتاه‌اند؛ چند جمله را با which / although / because ترکیب کن.');
  if(a.c) tips.push(a.c+' کوتاه‌نویسی (مثل don\'t) پیدا شد؛ در نوشتار آکادمیک شکل کامل بنویس.');
  if(a.rep.length) tips.push('لغات پرتکرار: '+a.rep.join('، ')+' ← مترادف یا ضمیر به‌کار ببر.');
  if(a.lk.length) tips.push('ربط‌های پیدا شده: '+a.lk.join('، '));
  return h + (tips.length ? '<ul class="tl" style="padding-bottom:0">'+tips.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul>' : '');
}
/* ---- charts (inline SVG, no external images) ---- */
function svgChart(p){
  var Wd = 320, H = 190, L = 30, B = 24, T = 14, cols = ['#2E6E6B', '#C98A2C', '#7A4EAB'];
  var all = [].concat.apply([], p.series.map(function(s){ return s.v; })), top = Math.ceil(Math.max.apply(null, all) / 10) * 10, n = p.labels.length, g, s = '<svg viewBox="0 0 '+Wd+' '+H+'" style="width:100%;max-width:420px;direction:ltr;color:var(--fg)" role="img">';
  for(g = 0; g <= 4; g++){ var y = T + (H - T - B) * (1 - g / 4); s += '<line x1="'+L+'" x2="'+(Wd - 8)+'" y1="'+y+'" y2="'+y+'" stroke="currentColor" opacity=".15"/><text x="'+(L - 4)+'" y="'+(y + 3)+'" font-size="9" text-anchor="end" fill="currentColor">'+Math.round(top * g / 4)+'</text>'; }
  var gw = (Wd - L - 8) / n;
  if(p.kind === 'bar'){
    var bw = gw * 0.7 / p.series.length;
    p.labels.forEach(function(lb, i){ p.series.forEach(function(se, j){ var h = (H - T - B) * se.v[i] / top; s += '<rect x="'+(L + i * gw + gw * 0.15 + j * bw)+'" y="'+(H - B - h)+'" width="'+(bw - 2)+'" height="'+h+'" fill="'+cols[j]+'"/>'; }); s += '<text x="'+(L + i * gw + gw / 2)+'" y="'+(H - 8)+'" font-size="9" text-anchor="middle" fill="currentColor">'+lb+'</text>'; });
  } else {
    p.series.forEach(function(se, j){ var pts = se.v.map(function(v, i){ return (L + i * gw + gw / 2)+','+(H - B - (H - T - B) * v / top); }).join(' '); s += '<polyline points="'+pts+'" fill="none" stroke="'+cols[j]+'" stroke-width="2"/>'; });
    p.labels.forEach(function(lb, i){ s += '<text x="'+(L + i * gw + gw / 2)+'" y="'+(H - 8)+'" font-size="9" text-anchor="middle" fill="currentColor">'+lb+'</text>'; });
  }
  p.series.forEach(function(se, j){ s += '<rect x="'+(L + j * 70)+'" y="0" width="8" height="8" fill="'+cols[j]+'"/><text x="'+(L + j * 70 + 11)+'" y="8" font-size="9" fill="currentColor">'+se.n+'</text>'; });
  return s + '</svg>';
}
function svgPie(p){
  var cols = ['#2E6E6B', '#C98A2C', '#7A4EAB', '#3E8E5A', '#999999'], s = '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;direction:ltr;color:var(--fg)">';
  p.charts.forEach(function(c){
    var a0 = -Math.PI / 2, svg = '<svg viewBox="0 0 120 120" style="width:46%;min-width:130px"><text x="60" y="10" font-size="10" text-anchor="middle" fill="currentColor">'+c.t+'</text>';
    c.parts.forEach(function(pt, i){ var a1 = a0 + pt[1] / 100 * 2 * Math.PI, x0 = 60 + 42 * Math.cos(a0), y0 = 72 + 42 * Math.sin(a0), x1 = 60 + 42 * Math.cos(a1), y1 = 72 + 42 * Math.sin(a1), am = (a0 + a1) / 2;
      svg += '<path d="M60 72 L'+x0+' '+y0+' A42 42 0 '+(pt[1] > 50 ? 1 : 0)+' 1 '+x1+' '+y1+' Z" fill="'+cols[i]+'" stroke="#fff" stroke-width="0.5"/><text x="'+(60 + 27 * Math.cos(am))+'" y="'+(74 + 27 * Math.sin(am))+'" font-size="8" text-anchor="middle" fill="#fff">'+pt[1]+'%</text>'; a0 = a1; });
    s += svg + '</svg>';
  });
  s += '</div><div class="leg" style="justify-content:center">'+p.charts[0].parts.map(function(pt, i){ return '<span><b style="background:'+cols[i]+'"></b>'+pt[0]+'</span>'; }).join('')+'</div>';
  return s;
}
function gridMap(t, g){ return '<div class="eb" style="margin-top:8px">'+t+'</div><table class="tbl" style="text-align:center">'+g.map(function(r){ return '<tr>'+r.map(function(c){ return '<td>'+c+'</td>'; }).join('')+'</tr>'; }).join('')+'</table>'; }
function chartHtml(p){
  if(p.kind === 'pie') return svgPie(p)+'<div class="vfa">داده‌ها فرضی و فقط برای تمرین‌اند.</div>';
  if(p.kind === 'process') return '<ol class="tl" style="padding-right:20px">'+p.steps.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ol><div class="vfa">در آزمون واقعی این مراحل به‌صورت تصویر می‌آیند.</div>';
  if(p.kind === 'map') return gridMap('Before (2005)', p.before)+gridMap('Today', p.after)+'<div class="vfa">هر خانه یک بخش از نقشه است؛ ساده‌شدهٔ نقشهٔ واقعی.</div>';
  if(p.kind === 'mixed') return svgChart({kind: 'bar', labels: p.labels, series: p.series, unit: p.unit})+'<table class="tbl" style="margin-top:8px"><tr><th></th>'+p.cols.map(function(c){ return '<th>'+c+'</th>'; }).join('')+'</tr>'+p.rows.map(function(r){ return '<tr>'+r.map(function(c){ return '<td>'+c+'</td>'; }).join('')+'</tr>'; }).join('')+'</table><div class="vfa">داده‌ها فرضی و فقط برای تمرین‌اند.</div>';
  if(p.kind === 'table') return '<table class="tbl"><tr><th></th>'+p.cols.map(function(c){ return '<th>'+c+'</th>'; }).join('')+'</tr>'+p.rows.map(function(r){ return '<tr>'+r.map(function(c){ return '<td>'+c+'</td>'; }).join('')+'</tr>'; }).join('')+'</table><div class="vfa">واحد: ساعت در هفته. داده‌ها فرضی و فقط برای تمرین‌اند.</div>';
  return svgChart(p)+'<div class="vfa">واحد: '+p.unit+'. داده‌ها فرضی و فقط برای تمرین‌اند.</div>';
}
/* ---- Writing Lab screens ---- */
function renderWLab(){ return ({edit: wEdit, view: wView, hist: wHist, cmp: wCmp}[wst.step] || wHome)(); }
function wHome(){
  var h = '<div class="section-title">Writing Lab</div><div class="daily-card" style="margin-top:0"><p class="daily-usage" style="margin:0">تمرین زمان‌دار Task 1 (۲۰ دقیقه) و Task 2 (۴۰ دقیقه) با شمارندهٔ کلمه، ذخیرهٔ خودکار پیش‌نویس و تاریخچه. نمرهٔ خودکار داده نمی‌شود؛ فقط شاخص‌های ساده و چک‌لیست معیارهای رسمی را می‌بینی. فعلاً تحلیل با هوش مصنوعی در کار نیست.</p><button class="daily-btn done" data-lab="hist">تاریخچهٔ نوشته‌ها ('+W.length+')</button></div>';
  h += '<div class="section-title">Task 1 (نمودار و جدول)</div><div class="g">'+WP1.map(function(p){ return '<button class="hubc" style="width:100%" data-lab="open" data-id="'+p.id+'"><b>'+({bar: 'نمودار میله‌ای', line: 'نمودار خطی', table: 'جدول', pie: 'نمودار دایره‌ای', process: 'فرایند', map: 'نقشه', mixed: 'نمودار ترکیبی'}[p.kind])+'</b><small>'+esc(p.q.slice(0, 80))+'...</small>'+(WD[p.id] ? '<small style="color:var(--accent-fg)">پیش‌نویس ذخیره‌شده</small>' : '')+'</button>'; }).join('')+'</div>';
  h += '<div class="section-title">Task 2 (مقاله)</div><div class="g">'+WP2.map(function(p){ return '<button class="hubc" style="width:100%" data-lab="open" data-id="'+p.id+'"><b>'+WT2[p.type]+'</b><small>'+esc(p.q.slice(0, 90))+'...</small>'+(WD[p.id] ? '<small style="color:var(--accent-fg)">پیش‌نویس ذخیره‌شده</small>' : '')+'</button>'; }).join('')+'</div>';
  h += '<div class="section-title">نمونه‌های کامل (اصلی، سطح تقریبی)</div>'+SAMPLES.map(function(x){ return '<details class="card" style="padding:12px 16px"><summary style="cursor:pointer;font-weight:600;font-size:14px">'+x.t+'</summary><p class="ex" style="white-space:pre-wrap;margin-top:10px">'+esc(x.text)+'</p><ul class="tl">'+x.notes.map(function(n){ return '<li>'+n+'</li>'; }).join('')+'</ul></details>'; }).join('')+'<div class="section-title">نمونهٔ تفاوت سطح (پاراگراف اصلی، تقریبی)</div><div class="daily-card" style="margin-top:0"><div class="eb">پاراگراف ضعیف‌تر (حدود Band 6)</div><p class="ex">Working from home is good because you can save time. You dont need to go to office so you have more time. Also it is good for family. But some people feel lonely and this is a bad thing.</p><div class="eb">پاراگراف قوی‌تر (حدود Band 8)</div><p class="ex">One clear advantage of remote work is the time it saves. Eliminating the daily commute can free up two hours or more, which employees can invest in family life or further study. By contrast, the isolation it can cause should not be underestimated: workers who rarely meet colleagues may feel disconnected, which can undermine teamwork.</p><ul class="tl"><li>ایده‌ها بسط و توضیح داده شده‌اند (نه فقط «good»).</li><li>لغات دقیق‌اند: eliminating، commute، undermine؛ نه پیچیده‌نویسی بی‌دلیل.</li><li>ربط طبیعی: By contrast با دو نکتهٔ مقابل.</li><li>خطای ساده ندارد (dont ✘، go to office ✘ ← the office).</li></ul></div>';
  return h;
}
function wEdit(){
  var p = wPrompt(wst.pid), tot = p.task === 1 ? 1200 : 2400, d = WD[p.id] || (WD[p.id] = {t: '', c: [], el: 0});
  var left = Math.max(0, tot - wst.el), clock = wst.timed ? left : wst.el;
  var h = '<div class="section-title">Task '+p.task+(p.type ? ' · '+WT2[p.type] : '')+'</div><div class="daily-card" style="margin-top:0"><p class="vex" style="font-size:14.5px">'+esc(p.q)+'</p>'+(p.task === 1 ? chartHtml(p) : '')+'</div>';
  h += '<div class="daily-card" style="margin-top:12px"><div style="display:flex;justify-content:space-between;align-items:center"><div class="clock" id="w_clock">'+fmt(clock)+'</div><label class="vfa"><input type="checkbox" data-lab="timed" '+(wst.timed ? 'checked' : '')+'> زمان‌دار ('+(p.task === 1 ? '۲۰' : '۴۰')+' دقیقه)</label></div>';
  h += '<div style="display:flex;gap:8px"><button class="mini" data-lab="run">'+(wst.run ? 'توقف' : 'شروع / ادامه')+'</button><button class="mini" data-lab="reset">صفر کردن زمان</button></div>';
  h += '<div class="vfa" id="w_msg">'+(wst.timed && left === 0 ? 'زمان تمام شد؛ در آزمون واقعی اینجا باید بایستی.' : '')+'</div>';
  h += '<textarea id="w_text" class="wta" dir="ltr" spellcheck="false" placeholder="Write your answer here...">'+esc(d.t)+'</textarea><div class="mini" style="text-align:center;cursor:default" id="w_count">'+wcount(d.t)+' کلمه (حداقل '+(p.task === 1 ? 150 : 250)+')</div><div id="w_met">'+(d.t ? metricsHtml(d.t, p.task) : '')+'</div></div>';
  h += '<div class="daily-card" style="margin-top:12px"><div class="eb">چک‌لیست معیارهای رسمی (خودارزیابی)</div>'+WCHK[p.task].map(function(c, i){ return '<label class="chk"><input type="checkbox" data-lab="chk" data-i="'+i+'" '+(d.c[i] ? 'checked' : '')+'> <b>'+c[0]+'</b> '+c[1]+'</label>'; }).join('')+'</div>';
  h += (wst.msg ? '<div class="amsg">'+esc(wst.msg)+'</div>' : '')+'<button class="daily-btn" data-lab="save">ذخیره در تاریخچه</button><button class="daily-btn done" style="margin-top:8px" data-lab="home">بازگشت (پیش‌نویس حفظ می‌شود)</button>';
  return h;
}
function fmt(s){ return String(Math.floor(s / 60)).padStart(2, '0')+':'+String(s % 60).padStart(2, '0'); }
function wView(){
  var s = W.filter(function(x){ return x.id === wst.view; })[0]; if(!s) return wHome();
  var p = wPrompt(s.pid) || {q: s.pid, task: s.task};
  return '<div class="section-title">نوشتهٔ ذخیره‌شده</div><div class="daily-card" style="margin-top:0"><p class="vfa">'+esc(p.q)+'</p><p class="ex" style="white-space:pre-wrap">'+esc(s.text)+'</p>'+metricsHtml(s.text, s.task)+'<div class="vfa">زمان: '+fmt(s.secs)+' · چک‌لیست: '+s.checks.filter(Boolean).length+' از '+(WCHK[s.task] || []).length+'</div>'+(wst.msg ? '<div class="amsg">'+esc(wst.msg)+'</div>' : '')+'<button class="daily-btn" data-lab="rewrite" data-id="'+s.id+'">بازنویسی و ویرایش</button><button class="daily-btn done" style="margin-top:8px" data-lab="hist">تاریخچه</button></div>';
}
function wHist(){
  var h = '<button class="back" data-lab="home">&lsaquo; Writing Lab</button><div class="section-title">تاریخچهٔ نوشته‌ها</div>';
  if(!W.length) return h + '<p class="daily-usage" style="margin:10px 4px">هنوز چیزی ذخیره نکرده‌ای.</p>';
  h += '<div class="daily-card" style="margin-top:0;padding:6px 16px">'+W.map(function(s){ var p = wPrompt(s.pid); return '<div class="eitem"><label><input type="checkbox" data-lab="pick" data-id="'+s.id+'" '+(wst.pick.indexOf(s.id) >= 0 ? 'checked' : '')+'> <b>Task '+s.task+'</b> · '+new Date(s.ts).toISOString().slice(0, 10)+' · '+s.words+' کلمه · '+fmt(s.secs)+'</label><div class="vfa">'+esc(p ? p.q.slice(0, 70) : s.pid)+'...</div><button class="mini" data-lab="show" data-id="'+s.id+'">مشاهده</button> <button class="mini" data-lab="del" data-id="'+s.id+'">حذف</button></div>'; }).join('')+'</div>';
  return h + '<button class="daily-btn" data-lab="cmp" '+(wst.pick.length === 2 ? '' : 'disabled style="opacity:.5"')+'>مقایسهٔ دو نوشتهٔ انتخاب‌شده (۲ مورد)</button>';
}
function wCmp(){
  var a = W.filter(function(x){ return x.id === wst.pick[0]; })[0], b = W.filter(function(x){ return x.id === wst.pick[1]; })[0];
  if(!a || !b) return wHist();
  var A = analyze(a.text), B = analyze(b.text), rows = [['کلمه', A.w, B.w], ['جمله', A.s, B.s], ['میانگین طول جمله', A.avg, B.avg], ['پاراگراف', A.p, B.p], ['تنوع واژگان %', A.ttr, B.ttr], ['ربط‌دهندهٔ متنوع', A.lk.length, B.lk.length], ['زمان', fmt(a.secs), fmt(b.secs)], ['چک‌لیست', a.checks.filter(Boolean).length, b.checks.filter(Boolean).length]];
  return '<button class="back" data-lab="hist">&lsaquo; تاریخچه</button><div class="section-title">مقایسه</div><div class="daily-card" style="margin-top:0"><table class="tbl"><tr><th></th><th>'+new Date(a.ts).toISOString().slice(0, 10)+'</th><th>'+new Date(b.ts).toISOString().slice(0, 10)+'</th></tr>'+rows.map(function(r){ return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>'; }).join('')+'</table><div class="vfa">این اعداد فقط نشان می‌دهند چه چیزی عوض شده؛ بهتر بودن متن را معیارهای رسمی و بازخورد معلم تعیین می‌کند.</div></div><div class="daily-card"><p class="ex" style="white-space:pre-wrap">'+esc(a.text)+'</p></div><div class="daily-card"><p class="ex" style="white-space:pre-wrap">'+esc(b.text)+'</p></div>';
}
function writingErrors(s, p){
  var a = analyze(s.text), min = s.task === 1 ? 150 : 250;
  var flags = [['word count', 'تعداد کلمه کمتر از حد لازم', a.w + ' کلمه', 'حداقل ' + min + ' کلمه لازم است؛ کمتر از آن جریمه دارد.', a.w < min], ['formality', 'کوتاه‌نویسی غیررسمی', a.c + ' مورد', 'در نوشتار آکادمیک شکل کامل بنویس (do not).', a.c > 0], ['paragraphing', 'پاراگراف‌بندی ضعیف', a.p + ' پاراگراف', 'حداقل ۳ تا ۴ پاراگراف روشن بنویس.', a.p < 3], ['repetition', 'تکرار زیاد یک لغت', a.rep.slice(0, 3).join('، '), 'از مترادف و ضمیر استفاده کن.', a.rep.length > 0]];
  flags.forEach(function(f){ if(f[4]) logErr({area: 'writing', cat: f[0], item: 'rule:' + f[0], prompt: f[1], ua: f[2], ca: '', ex: f[3]}); else resolveErr('writing', 'rule:' + f[0]); });
  WCHK[s.task].forEach(function(c, i){ selfErr('writing', 'self:' + s.task + ':' + i, c[0], c[1], !!s.checks[i], 'خودارزیابی: ' + c[0]); });
}
function syncText(){ var ta = document.getElementById('w_text'); if(ta && wst.pid && WD[wst.pid]){ WD[wst.pid].t = ta.value; WD[wst.pid].el = wst.el; } }
async function wSync(t){
  var r = await sbFetch('/rest/v1/writing_submissions?select=id,pid,task,content,words,seconds,checks,created_at&order=created_at.desc&limit=100', {}, t);
  if(r.ok){ (await r.json()).forEach(function(x){ if(!W.some(function(y){ return y.id === x.id; })) W.push({id: x.id, pid: x.pid, task: x.task, text: x.content, words: x.words, secs: x.seconds, ts: Date.parse(x.created_at), checks: x.checks || []}); }); W.sort(function(a, b){ return b.ts - a.ts; }); W = W.slice(0, 80); wsv(); }
  var rows = Object.keys(wDirty).map(function(id){ return W.filter(function(s){ return s.id === id; })[0]; }).filter(Boolean).map(function(s){ return {id: s.id, user_id: session.user.id, pid: s.pid, task: s.task, content: s.text.slice(0, 8000), words: s.words, seconds: s.secs, checks: s.checks, created_at: new Date(s.ts).toISOString()}; });
  if(rows.length){ var p = await sbFetch('/rest/v1/writing_submissions', {method: 'POST', headers: {'Prefer': 'resolution=merge-duplicates'}, body: rows}, t); if(p.ok) wDirty = {}; }
}
/* ---- Speaking Studio ---- */
var SP1 = [
 ['Home', ['Do you live in a house or an apartment?', 'What do you like most about your home?', 'Is there anything you would like to change about it?', 'Who do you live with?']],
 ['Work or study', ['What do you do: do you work or study?', 'Why did you choose that job or subject?', 'What do you find most difficult about it?', 'What would you like to do in the future?']],
 ['Food', ['What kind of food do you enjoy most?', 'Do you prefer eating at home or in restaurants?', 'Can you cook? What can you make?', 'Has your diet changed in recent years?']],
 ['Technology', ['What technology do you use every day?', 'Do you think you spend too much time on your phone?', 'How do you usually learn to use new devices?', 'Is there any technology you would never use?']],
 ['Free time', ['What do you do in your free time?', 'Do you prefer relaxing or active hobbies?', 'Did you have different hobbies as a child?', 'Would you like to try a new hobby?']],
 ['Travel', ['Do you like travelling?', 'Where did you go on your last trip?', 'Do you prefer travelling alone or with others?', 'What place would you most like to visit?']]
];
var SP2 = [
 'a skill you would like to learn|what the skill is;why you want to learn it;how you would learn it;how it would help you|Why do some people find it hard to learn new skills?;Should schools focus more on practical skills?;How has the way people learn changed in recent years?',
 'a place in your city where you like to spend time|where it is;what it looks like;what you do there;why you like it|How have public spaces in cities changed?;Why is it important for cities to have parks?;Do people spend enough time outdoors today?',
 'a time you received good advice|who gave the advice;what the advice was;what you did;why it was useful|Who gives better advice: friends or family?;Is it always wise to follow advice?;Why do some people refuse to listen to advice?',
 'a piece of technology you find useful|what it is;how you use it;why it is useful;how often you use it|Is technology making life easier or more stressful?;How has technology changed the way people work?;Will machines replace many jobs in the future?',
 'a person who has influenced you|who the person is;how you know them;what they did;why they influenced you|What makes someone a good role model?;Do celebrities have a responsibility to set an example?;How do parents influence children?',
 'a time you had to wait for something|what you waited for;why you had to wait;how you felt;what you did while waiting|Are people less patient than in the past?;Why do some people dislike waiting?;Can waiting ever be a positive experience?',
 'a journey you remember well|where you went;who you went with;what happened;why you remember it|Why do people enjoy travelling?;How has tourism changed in your country?;Is it better to travel alone or in a group?',
 'a book or film that made you think|what it was about;when you read or saw it;what it made you think about;whether you would recommend it|Why do people enjoy stories?;Do books and films influence how people think?;Is reading declining among young people?'
].map(function(l, i){ var a = l.split('|'); return {id: 'c' + i, t: a[0], pts: a[1].split(';'), p3: a[2].split(';')}; });
var SCHK = ['جواب را با مثال و جزئیات توسعه دادم', 'مکث طولانی یا تکرار زیاد نداشتم', 'لغات متنوع و دقیق به‌کار بردم', 'زمان‌ها و ساختار جمله را کنترل کردم', 'واضح و با آهنگ طبیعی صحبت کردم'];
var SCAT = ['S-FC', 'S-FC', 'S-LR', 'S-GRA', 'S-PRON'];
var SH = load('hm_spk', []);
var sp = {mode: 'home', part: 1, qs: [], card: null, phase: 'idle', left: 0, el: 0, rec: null, stream: null, chunks: [], blob: null, url: null, err: '', notes: [], note: ''}, spAudio = null, spPlaying = null;
function idb(){ return new Promise(function(res, rej){ var r = indexedDB.open('hm_audio', 1); r.onupgradeneeded = function(){ r.result.createObjectStore('a'); }; r.onsuccess = function(){ res(r.result); }; r.onerror = function(){ rej(r.error); }; }); }
function idbDo(mode, fn){ return idb().then(function(db){ return new Promise(function(res, rej){ var tx = db.transaction('a', mode), rq = fn(tx.objectStore('a')); tx.oncomplete = function(){ res(rq && rq.result); }; tx.onerror = function(){ rej(tx.error); }; }); }); }
function pick(a){ return a[Math.floor(Math.random() * a.length)]; }
function spStart(part){
  spReset(); sp.mode = 'rec'; sp.part = part;
  if(part === 1){ var t = pick(SP1); sp.card = {t: t[0]}; sp.qs = t[1]; }
  else if(part === 2){ sp.card = pick(SP2); sp.qs = ['Describe ' + sp.card.t + '.', 'You should say:'].concat(sp.card.pts); }
  else { sp.card = pick(SP2); sp.qs = sp.card.p3; }
}
function spReset(){ spStopTracks(); if(sp.url){ URL.revokeObjectURL(sp.url); } sp.phase = 'idle'; sp.left = 0; sp.el = 0; sp.rec = null; sp.chunks = []; sp.blob = null; sp.url = null; sp.err = ''; sp.notes = []; sp.note = ''; }
function spStopTracks(){ if(sp.stream){ sp.stream.getTracks().forEach(function(t){ t.stop(); }); sp.stream = null; } }
async function spRecord(){
  if(!navigator.mediaDevices || !window.MediaRecorder){ sp.err = 'این مرورگر ضبط صدا را پشتیبانی نمی‌کند. از Chrome یا Safari جدید استفاده کن.'; sp.phase = 'idle'; render(); return; }
  sp.phase = 'req'; render();
  try{
    sp.stream = await navigator.mediaDevices.getUserMedia({audio: true});
    var mt = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].filter(function(m){ return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m); })[0];
    sp.rec = new MediaRecorder(sp.stream, mt ? {mimeType: mt} : undefined); sp.chunks = [];
    sp.rec.ondataavailable = function(e){ if(e.data && e.data.size) sp.chunks.push(e.data); };
    sp.rec.onstop = function(){ spStopTracks(); if(sp.discard){ sp.discard = false; sp.phase = 'idle'; return; } sp.blob = new Blob(sp.chunks, {type: sp.rec.mimeType || 'audio/webm'}); sp.url = URL.createObjectURL(sp.blob); sp.phase = 'review'; render(); };
    sp.rec.start(); sp.phase = 'rec'; sp.el = 0; render();
  }catch(e){ sp.err = 'دسترسی به میکروفون داده نشد. در تنظیمات مرورگر اجازهٔ میکروفون را فعال کن.'; sp.phase = 'idle'; spStopTracks(); render(); }
}
function spStop(discard){ if(sp.rec && sp.rec.state === 'recording'){ sp.discard = !!discard; sp.rec.stop(); } else spStopTracks(); }
async function spSave(){
  var id = uuid(), mime = sp.blob.type;
  try{ await idbDo('readwrite', function(s){ return s.put(sp.blob, id); }); }catch(e){ sp.err = 'ذخیرهٔ صدا روی این دستگاه ممکن نشد.'; render(); return; }
  SH.unshift({id: id, part: sp.part, q: sp.qs.join(' / ').slice(0, 300), secs: sp.el, ts: Date.now(), mime: mime, notes: sp.notes.slice(), note: sp.note.slice(0, 300)}); SH = SH.slice(0, 60); save('hm_spk', SH); SCHK.forEach(function(c, i){ selfErr('speaking', 'self:' + i, SCAT[i], c, !!sp.notes[i], 'خودارزیابی Speaking'); });
  spReset(); sp.mode = 'hist'; render();
}
function renderSLab(){
  if(sp.mode === 'hist') return sHist();
  if(sp.mode === 'rec') return sRec();
  var h = '<div class="section-title">Speaking Studio</div><div class="daily-card" style="margin-top:0"><p class="daily-usage" style="margin:0">ضبط پاسخ، پخش دوباره و خودارزیابی. صدا فقط روی همین دستگاه ذخیره می‌شود و به هیچ سروری نمی‌رود. تحلیل خودکار گفتار (فیلر، تکرار لغت، گرامر) به تبدیل گفتار به متن نیاز دارد و فعلاً فعال نیست؛ پس بازخورد با گوش‌دادن به خودت و چک‌لیست است.</p></div>';
  h += '<div class="g" style="margin-top:12px"><button class="hubc" style="width:100%" data-sp="start" data-part="1"><b>Part 1</b><small>سؤال‌های کوتاه شخصی (یک موضوع، ۴ سؤال)</small></button><button class="hubc" style="width:100%" data-sp="start" data-part="2"><b>Part 2</b><small>کارت موضوع: ۱ دقیقه آماده‌سازی و تا ۲ دقیقه صحبت</small></button><button class="hubc" style="width:100%" data-sp="start" data-part="3"><b>Part 3</b><small>سؤال‌های انتزاعی و تحلیلی</small></button></div>';
  return h + '<button class="daily-btn done" data-sp="hist">تاریخچهٔ ضبط‌ها ('+SH.length+')</button>';
}
function sRec(){
  var h = '<button class="back" data-sp="home">&lsaquo; Speaking Studio</button><div class="section-title">Part '+sp.part+(sp.card && sp.card.t && sp.part === 1 ? ' · '+sp.card.t : '')+'</div><div class="daily-card" style="margin-top:0">'+sp.qs.map(function(q, i){ return '<p class="ex" style="'+(sp.part === 2 && i === 0 ? 'font-weight:700' : '')+'">'+(sp.part === 2 && i > 1 ? '• ' : '')+esc(q)+'</p>'; }).join('');
  if(sp.err) h += '<div class="amsg">'+esc(sp.err)+'</div>';
  if(sp.phase === 'idle'){
    h += sp.part === 2 ? '<button class="daily-btn" data-sp="prep">شروع ۱ دقیقه آماده‌سازی</button><button class="daily-btn done" style="margin-top:8px" data-sp="record">رد کردن آماده‌سازی و شروع ضبط</button>' : '<button class="daily-btn" data-sp="record">شروع ضبط</button>';
    h += '<button class="mini" data-sp="next">سؤال دیگر</button>';
  } else if(sp.phase === 'prep') h += '<div class="clock" id="s_clock">'+fmt(sp.left)+'</div><p class="vfa">فقط ۴ یا ۵ کلمهٔ کلیدی یادداشت کن؛ ضبط خودکار شروع می‌شود.</p><button class="daily-btn" data-sp="record">همین حالا ضبط کن</button>';
  else if(sp.phase === 'req') h += '<p class="daily-usage">در حال گرفتن دسترسی میکروفون...</p>';
  else if(sp.phase === 'rec') h += '<div class="clock rec" id="s_clock">● '+fmt(sp.el)+'</div><p class="vfa">'+(sp.part === 2 ? 'تا ۲ دقیقه صحبت کن؛ خودکار متوقف می‌شود.' : 'پاسخ را کامل و با مثال بده (حداکثر ۴ دقیقه).')+'</p><button class="daily-btn" data-sp="stop">توقف ضبط</button>';
  else if(sp.phase === 'review'){
    h += '<div class="vfa">مدت: '+fmt(sp.el)+'</div><audio controls src="'+sp.url+'" style="width:100%;margin:8px 0"></audio><div class="eb">خودارزیابی بعد از گوش‌دادن</div>'+SCHK.map(function(c, i){ return '<label class="chk"><input type="checkbox" data-sp="note" data-i="'+i+'" '+(sp.notes[i] ? 'checked' : '')+'> '+c+'</label>'; }).join('')+'<textarea id="s_note" class="wta" style="min-height:70px" placeholder="یادداشت: چه چیزی را بهتر می‌کنی؟">'+esc(sp.note)+'</textarea><button class="daily-btn" data-sp="save">ذخیره در تاریخچه</button><button class="daily-btn done" style="margin-top:8px" data-sp="again">حذف و ضبط دوباره</button>';
  }
  return h + '</div>';
}
function sHist(){
  var h = '<button class="back" data-sp="home">&lsaquo; Speaking Studio</button><div class="section-title">تاریخچهٔ ضبط‌ها</div>';
  if(!SH.length) return h + '<p class="daily-usage" style="margin:10px 4px">هنوز ضبطی ذخیره نکرده‌ای.</p>';
  return h + '<div class="daily-card" style="margin-top:0;padding:6px 16px">'+SH.map(function(s){ return '<div class="eitem"><b>Part '+s.part+'</b> · '+new Date(s.ts).toISOString().slice(0, 10)+' · '+fmt(s.secs)+' · چک‌لیست '+s.notes.filter(Boolean).length+'/'+SCHK.length+'<div class="vfa" dir="ltr" style="text-align:left">'+esc(s.q.slice(0, 120))+'</div>'+(s.note ? '<div class="vfa">'+esc(s.note)+'</div>' : '')+'<button class="mini" data-sp="play" data-id="'+s.id+'">'+(spPlaying === s.id ? 'توقف پخش' : 'پخش')+'</button> <button class="mini" data-sp="del" data-id="'+s.id+'">حذف</button></div>'; }).join('')+'</div>';
}
/* ---- timers and safety: never keep recording when the screen is not visible ---- */
setInterval(function(){
  if(wst.run && view === 'wlab' && wst.step === 'edit'){
    wst.el++; var p = wPrompt(wst.pid), tot = p.task === 1 ? 1200 : 2400, c = document.getElementById('w_clock');
    if(c) c.textContent = fmt(wst.timed ? Math.max(0, tot - wst.el) : wst.el);
    if(wst.timed && wst.el >= tot){ wst.run = false; render(); }
    if(wst.el % 20 === 0){ syncText(); wsv(); }
  } else if(wst.run && view !== 'wlab'){ wst.run = false; syncText(); wsv(); }
  if(sp.phase === 'prep'){ sp.left--; var c1 = document.getElementById('s_clock'); if(c1) c1.textContent = fmt(Math.max(0, sp.left)); if(sp.left <= 0) spRecord(); }
  else if(sp.phase === 'rec'){
    sp.el++; var c2 = document.getElementById('s_clock'); if(c2) c2.textContent = '● ' + fmt(sp.el);
    if(view !== 'slab') spStop(true); else if(sp.el >= (sp.part === 2 ? 120 : 240)) spStop(false);
  }
}, 1000);
window.addEventListener('pagehide', function(){ if(sp.phase === 'rec') spStop(true); });
/* ---- events ---- */
(function(){
  var app = document.getElementById('app'), dt = null;
  app.addEventListener('input', function(e){
    if(e.target.id === 'w_text' && wst.pid){
      var t = e.target.value, p = wPrompt(wst.pid); WD[wst.pid].t = t; WD[wst.pid].el = wst.el;
      var cnt = document.getElementById('w_count'); if(cnt) cnt.textContent = wcount(t)+' کلمه (حداقل '+(p.task === 1 ? 150 : 250)+')';
      clearTimeout(dt); dt = setTimeout(function(){ var m = document.getElementById('w_met'); if(m) m.innerHTML = metricsHtml(t, p.task); wsv(); }, 700);
    } else if(e.target.id === 's_note'){ sp.note = e.target.value; }
  });
  app.addEventListener('click', function(e){
    var t = e.target.closest('[data-lab]'), a;
    if(t){
      a = t.getAttribute('data-lab'); syncText();
      if(a === 'open'){ wst.pid = t.getAttribute('data-id'); var d = WD[wst.pid]; wst.el = d ? d.el || 0 : 0; wst.run = false; wst.step = 'edit'; wst.msg = ''; }
      else if(a === 'home'){ wst.run = false; wsv(); wst.step = 'home'; }
      else if(a === 'hist'){ wst.step = 'hist'; wst.msg = ''; }
      else if(a === 'run'){ wst.run = !wst.run; }
      else if(a === 'reset'){ wst.el = 0; wst.run = false; }
      else if(a === 'timed'){ wst.timed = t.checked; }
      else if(a === 'chk'){ WD[wst.pid].c[+t.getAttribute('data-i')] = t.checked; wsv(); return; }
      else if(a === 'pick'){ var id = t.getAttribute('data-id'), i = wst.pick.indexOf(id); if(i >= 0) wst.pick.splice(i, 1); else { wst.pick.push(id); if(wst.pick.length > 2) wst.pick.shift(); } }
      else if(a === 'cmp'){ if(wst.pick.length === 2) wst.step = 'cmp'; }
      else if(a === 'show'){ wst.view = t.getAttribute('data-id'); wst.step = 'view'; wst.msg = ''; }
      else if(a === 'rewrite'){ var s = W.filter(function(x){ return x.id === t.getAttribute('data-id'); })[0]; if(s){ WD[s.pid] = {t: s.text, c: s.checks.slice(), el: 0}; wst.pid = s.pid; wst.el = 0; wst.run = false; wst.step = 'edit'; wst.msg = 'نوشتهٔ قبلی برای بازنویسی بارگذاری شد؛ نسخهٔ قدیمی در تاریخچه می‌ماند.'; wsv(); } }
      else if(a === 'del'){ var did = t.getAttribute('data-id'); if(window.confirm('این نوشته حذف شود؟')){ W = W.filter(function(x){ return x.id !== did; }); wst.pick = wst.pick.filter(function(x){ return x !== did; }); delete wDirty[did]; wsv(); if(session){ getToken().then(function(tk){ if(tk) sbFetch('/rest/v1/writing_submissions?id=eq.' + did, {method: 'DELETE'}, tk); }).catch(function(){}); } } }
      else if(a === 'save'){
        var p = wPrompt(wst.pid), d2 = WD[wst.pid];
        if(wcount(d2.t) < 20){ wst.msg = 'متن خیلی کوتاه است؛ حداقل ۲۰ کلمه بنویس.'; }
        else { var sid = uuid(); W.unshift({id: sid, pid: p.id, task: p.task, text: d2.t.trim(), words: wcount(d2.t), secs: wst.el, ts: Date.now(), checks: (d2.c || []).map(Boolean)}); W = W.slice(0, 80); wDirty[sid] = 1; writingErrors(W[0], p); delete WD[p.id]; wst.run = false; wst.view = sid; wst.step = 'view'; wst.msg = 'ذخیره شد.'; wsv(); schedSrs(); }
      }
      render(); return;
    }
    t = e.target.closest('[data-sp]'); if(!t) return;
    a = t.getAttribute('data-sp');
    if(a === 'home'){ spStop(true); spReset(); sp.mode = 'home'; }
    else if(a === 'hist'){ sp.mode = 'hist'; }
    else if(a === 'start'){ spStart(+t.getAttribute('data-part')); }
    else if(a === 'next'){ spStart(sp.part); }
    else if(a === 'prep'){ sp.phase = 'prep'; sp.left = 60; }
    else if(a === 'record'){ spRecord(); return; }
    else if(a === 'stop'){ spStop(false); return; }
    else if(a === 'note'){ sp.notes[+t.getAttribute('data-i')] = t.checked; return; }
    else if(a === 'save'){ spSave(); return; }
    else if(a === 'again'){ var part = sp.part, q = sp.qs, cd = sp.card; spReset(); sp.part = part; sp.qs = q; sp.card = cd; }
    else if(a === 'play'){
      var pid = t.getAttribute('data-id'); if(spAudio){ spAudio.pause(); spAudio = null; }
      if(spPlaying === pid){ spPlaying = null; }
      else { idbDo('readonly', function(s){ return s.get(pid); }).then(function(b){ if(!b) return; spAudio = new Audio(URL.createObjectURL(b)); spPlaying = pid; spAudio.onended = function(){ spPlaying = null; render(); }; spAudio.play(); render(); }).catch(function(){}); return; }
    }
    else if(a === 'del'){ var did2 = t.getAttribute('data-id'); if(window.confirm('این ضبط حذف شود؟')){ SH = SH.filter(function(x){ return x.id !== did2; }); save('hm_spk', SH); idbDo('readwrite', function(s){ return s.delete(did2); }).catch(function(){}); } }
    render();
  });
})();
HUB.unshift(['wlab', '🧪', 'Writing Lab', 'تمرین زمان‌دار، شمارنده، تاریخچه'], ['slab', '🎙️', 'Speaking Studio', 'ضبط، پخش و خودارزیابی']);
SUBV.push('wlab', 'slab');
