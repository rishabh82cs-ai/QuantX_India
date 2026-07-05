const instruments = {
  indexOptions: [
    {symbol:'NIFTY', price:24580, lot:50, exchange:'NSE', asset:'Index'},
    {symbol:'BANKNIFTY', price:52840, lot:15, exchange:'NSE', asset:'Index'},
    {symbol:'FINNIFTY', price:23820, lot:40, exchange:'NSE', asset:'Index'},
    {symbol:'MIDCPNIFTY', price:12890, lot:75, exchange:'NSE', asset:'Index'},
    {symbol:'SENSEX', price:80850, lot:10, exchange:'BSE', asset:'Index'}
  ],
  stockOptions: [
    {symbol:'RELIANCE', price:2920, lot:250, exchange:'NSE', asset:'Stock'},
    {symbol:'TCS', price:3865, lot:175, exchange:'NSE', asset:'Stock'},
    {symbol:'HDFCBANK', price:1680, lot:550, exchange:'NSE', asset:'Stock'}
  ],
  indexFutures: [
    {symbol:'NIFTY FUT', price:24622, lot:50, exchange:'NSE', asset:'Index Future'},
    {symbol:'BANKNIFTY FUT', price:52925, lot:15, exchange:'NSE', asset:'Index Future'},
    {symbol:'SENSEX FUT', price:80960, lot:10, exchange:'BSE', asset:'Index Future'}
  ],
  stockFutures: [
    {symbol:'RELIANCE FUT', price:2932, lot:250, exchange:'NSE', asset:'Stock Future'},
    {symbol:'TCS FUT', price:3881, lot:175, exchange:'NSE', asset:'Stock Future'},
    {symbol:'ICICIBANK FUT', price:1178, lot:700, exchange:'NSE', asset:'Stock Future'}
  ],
  currencyFutures: [
    {symbol:'USDINR FUT', price:83.52, lot:1000, exchange:'NSE', asset:'Currency Future'},
    {symbol:'EURINR FUT', price:90.40, lot:1000, exchange:'NSE', asset:'Currency Future'}
  ],
  commodityFutures: [
    {symbol:'GOLD FUT', price:71250, lot:1, exchange:'Broker Supported', asset:'Commodity Future'},
    {symbol:'CRUDEOIL FUT', price:6820, lot:100, exchange:'Broker Supported', asset:'Commodity Future'}
  ]
};

const modules = [
 ['M01','Multi-Platform Application Shell','macOS, Windows, web, Android, iOS shell.'],['M02','User Interface Layer','Dashboard, charts, orders, journal, settings.'],['M03','Instrument Master Engine','Exchange, segment, asset, underlying, contracts.'],['M04','Broker API Layer','Dhan API and future broker integrations.'],['M05','Market Data Engine','Quotes, candles, options, futures, news.'],['M06','Historical Data Engine','Historical candle storage and retrieval.'],['M07','Professional Chart Engine','Internal charting with overlays and controls.'],['M08','Candlestick Rendering Engine','Hollow, classic, line, bar modes.'],['M09','Candlestick Pattern Engine','28 candle patterns and chart markers.'],['M10','Price Action Engine','Trend, structure, zones, breakout, retest.'],['M11','Option Chain Engine','CE/PE chain, ATM, IV, Greeks, bid/ask.'],['M12','Option Analytics Engine','PCR, Max Pain, OI, IV, pressure zones.'],['M13','Futures Chain Engine','Futures contracts, expiries, OI, volume.'],['M14','Futures Analytics Engine','Basis, rollover, spot-vs-futures.'],['M15','Greeks and IV Engine','Delta, Gamma, Theta, Vega, Rho, IV.'],['M16','Strategy Advisor Engine','Strategy category and no-trade decisions.'],['M17','Strategy Builder Engine','Multi-leg options and futures strategies.'],['M18','Payoff Analyzer','Profit, loss, breakeven, payoff scenarios.'],['M19','Risk Management Engine','Position sizing, limits, margin, blockers.'],['M20','One-Click Order Engine','Pre-filled paper/live order tickets.'],['M21','Bracket Order Engine','Entry, stop, target, trailing, partial exits.'],['M22','Order Management Engine','Place, modify, cancel, square off.'],['M23','Paper Trading Engine','Paper orders, tradebook and journal.'],['M24','Live Trading Confirmation Engine','Manual confirmation gate and warnings.'],['M25','Tradebook Engine','Broker sync and internal trade records.'],['M26','AI Market Intelligence Engine','Market, chart, option/futures explanation.'],['M27','AI Strategy Explanation Engine','Explains strategy fit and risk.'],['M28','AI Trade Journal Engine','Post-trade explanation and lessons.'],['M29','EOD and Weekly Review Engine','Performance and discipline reviews.'],['M30','Backtesting Engine','Historical testing and performance metrics.'],['M31','Replay Engine','Market replay and trade decision review.'],['M32','News and Event Intelligence Engine','Indian/global news and event warnings.'],['M33','Alert and Notification Engine','Price, pattern, risk, order alerts.'],['M34','Database Layer','Instruments, candles, trades, journals, logs.'],['M35','Security and Credential Engine','API key and user data protection.'],['M36','Compliance and Audit Engine','Risk disclaimers, audit logs, licenses.'],['M37','Excel and Report Export Engine','Exports reports, journals and workbooks.'],['M38','Dev Center','Diagnostics, logs, tests and installer tools.'],['M39','Installer and Update Engine','Mac/Windows install, update, rollback.'],['M40','Cloud Sync Engine','Future login, mobile sync, secure backup.']
];

let state = {
  universe:'indexOptions', instrument:null, scenario:'range', interval:'5m', days:5, chartMode:'hollow', overlays:true,
  candles:[], optionRows:[], futuresRows:[], trades:[], alerts:[]
};

const $ = id => document.getElementById(id);
const fmt = n => Number(n).toLocaleString('en-IN', {maximumFractionDigits: n < 100 ? 2 : 0});
const money = n => '₹' + fmt(n);
const pct = n => (n>0?'+':'') + n.toFixed(2) + '%';

function seedRandom(seed){let x = Math.sin(seed) * 10000; return () => {x = Math.sin(x) * 10000; return x - Math.floor(x);};}
function currentInstrument(){ return instruments[state.universe].find(i => i.symbol === state.instrument) || instruments[state.universe][0]; }
function scenarioDrift(){ return {bullish:0.58,bearish:-0.58,range:0.03,volatile:0.12}[state.scenario]; }
function scenarioVol(){ return {bullish:1.1,bearish:1.25,range:.65,volatile:2.1}[state.scenario]; }
function scenarioLabel(){ return {bullish:'Bullish breakout',bearish:'Bearish rejection',range:'Range / neutral',volatile:'High-IV volatile'}[state.scenario]; }

function initControls(){
  const universe = $('universeSelect'); const inst = $('instrumentSelect');
  universe.addEventListener('change', () => { state.universe = universe.value; populateInstruments(); refreshAll(); });
  inst.addEventListener('change', () => { state.instrument = inst.value; refreshAll(); });
  $('scenarioSelect').addEventListener('change', e => {state.scenario=e.target.value; refreshAll();});
  $('intervalSelect').addEventListener('change', e => {state.interval=e.target.value; refreshAll();});
  $('daysInput').addEventListener('change', e => {state.days=Math.max(1, Math.min(60, +e.target.value||5)); refreshAll();});
  $('chartMode').addEventListener('change', e => {state.chartMode=e.target.value; drawChart();});
  $('refreshDemo').addEventListener('click', refreshAll);
  $('toggleOverlays').addEventListener('click', () => {state.overlays=!state.overlays; drawChart();});
  $('runAdvisor').addEventListener('click', renderStrategy);
  $('paperTrade').addEventListener('click', paperTrade);
  $('liveConfirm').addEventListener('click', () => $('liveModal').classList.add('open'));
  $('closeModal').addEventListener('click', () => $('liveModal').classList.remove('open'));
  $('generateJournal').addEventListener('click', renderJournal);
  $('runBacktest').addEventListener('click', renderBacktest);
  $('addAlert').addEventListener('click', addAlert);
  ['entryPrice','stopLoss','targetPrice','qty','orderSide','orderStrategy','orderType'].forEach(id => $(id).addEventListener('input', renderRisk));
  document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));
  document.querySelectorAll('[data-scroll]').forEach(btn => btn.addEventListener('click', () => document.getElementById(btn.dataset.scroll).scrollIntoView({behavior:'smooth'})));
}
function populateInstruments(){
  const inst = $('instrumentSelect'); inst.innerHTML = '';
  instruments[state.universe].forEach(i => { const opt = document.createElement('option'); opt.value=i.symbol; opt.textContent=`${i.symbol} — ${i.asset}`; inst.appendChild(opt); });
  state.instrument = instruments[state.universe][0].symbol;
}
function activateTab(tab){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  document.querySelectorAll('.tab-content').forEach(c=>c.classList.toggle('active',c.id===tab));
}

function generateCandles(){
  const inst = currentInstrument(); const count = Math.min(160, Math.max(40, state.days * (state.interval==='1D'?5:18)));
  const rand = seedRandom(inst.price + state.days * 13 + state.scenario.length * 31 + Date.now()/60000|0);
  let price = inst.price * (1 - scenarioDrift()/100*count/8);
  const candles=[];
  for(let i=0;i<count;i++){
    const noise = (rand()-.5) * inst.price * .0018 * scenarioVol();
    const trend = inst.price * .00022 * scenarioDrift();
    const open = price;
    let close = open + trend + noise;
    if(state.scenario==='range') close = open + (Math.sin(i/5)*inst.price*.00055) + noise*.45;
    if(state.scenario==='volatile' && i%16===0) close += (rand()-.5)*inst.price*.006;
    const high = Math.max(open,close) + Math.abs(rand()*inst.price*.0015*scenarioVol());
    const low = Math.min(open,close) - Math.abs(rand()*inst.price*.0015*scenarioVol());
    const vol = Math.round(40000 + rand()*180000*scenarioVol() + (Math.abs(close-open)/inst.price)*5000000);
    candles.push({i, open, high, low, close, vol}); price = close;
  }
  state.candles = candles;
}
function generateOptions(){
  const inst = currentInstrument(); const price = state.candles.at(-1)?.close || inst.price;
  const step = price>50000?500:price>15000?100:price>5000?50:10;
  const atm = Math.round(price/step)*step; const rows=[];
  for(let k=-7;k<=7;k++){
    const strike = atm + k*step;
    const distance = Math.abs(strike-price)/step;
    const ivBase = state.scenario==='volatile'?25:state.scenario==='range'?13:18;
    const ceIntrinsic = Math.max(0, price-strike); const peIntrinsic = Math.max(0, strike-price);
    const timeValue = Math.max(step*.35, step*(2.2-distance*.18))*(state.scenario==='volatile'?1.8:1);
    const ceLtp = Math.max(1, ceIntrinsic + timeValue + k*-2.1);
    const peLtp = Math.max(1, peIntrinsic + timeValue + k*2.1);
    const callPressure = state.scenario==='bearish' ? 1.5 : state.scenario==='bullish' ? .85 : 1.1;
    const putPressure = state.scenario==='bullish' ? 1.5 : state.scenario==='bearish' ? .85 : 1.1;
    const ceOi = Math.round((1400000/(1+distance*.65))*callPressure + (k>0?900000:100000));
    const peOi = Math.round((1400000/(1+distance*.65))*putPressure + (k<0?900000:100000));
    rows.push({strike, atm:k===0, ceLtp, peLtp, ceOi, peOi, ceChg:Math.round((Math.random()-.45)*260000), peChg:Math.round((Math.random()-.45)*260000), iv:ivBase+distance*.75, deltaCE:Math.max(.05, Math.min(.95,.5-k*.07)), deltaPE:-Math.max(.05, Math.min(.95,.5+k*.07)), gamma:(.0025/(1+distance)).toFixed(4), bid:ceLtp-.4, ask:ceLtp+.4});
  }
  state.optionRows = rows;
}
function generateFutures(){
  const inst = currentInstrument(); const spot = state.candles.at(-1)?.close || inst.price; const rows=[];
  ['Near','Next','Far'].forEach((m,idx)=>{
    const basis = (idx+1) * (state.scenario==='bullish'?0.18:state.scenario==='bearish'?-0.08:0.06) * spot/100;
    rows.push({contract:m, price:spot+basis, basis, oi:Math.round(2200000/(idx+1)*(state.scenario==='volatile'?1.3:1)), oiChg:Math.round((idx+1)*45000*(state.scenario==='bullish'?1:state.scenario==='bearish'?-1:.2)), volume:Math.round(900000/(idx+1)), rollover:Math.round(42+idx*18+(state.scenario==='volatile'?8:0))});
  });
  state.futuresRows = rows;
}

function refreshAll(){
  generateCandles(); generateOptions(); generateFutures(); renderDashboard(); drawChart(); renderOptions(); renderFutures(); renderStrategy(); prefillOrder(); renderRisk(); renderJournal(); renderBacktest(); renderAlerts(); renderModules();
}
function renderDashboard(){
  const inst=currentInstrument(), last=state.candles.at(-1), first=state.candles[0]; const chg=(last.close-first.open)/first.open*100;
  const totalCE=state.optionRows.reduce((a,r)=>a+r.ceOi,0), totalPE=state.optionRows.reduce((a,r)=>a+r.peOi,0); const pcr=totalPE/totalCE;
  const maxPain=state.optionRows.reduce((best,r)=> Math.abs(r.strike-last.close)<Math.abs(best-last.close)?r.strike:best, state.optionRows[0].strike);
  const metrics=[['Instrument',inst.symbol],['Last price',money(last.close)],['Session move',pct(chg), chg>=0?'up':'down'],['Scenario',scenarioLabel()],['PCR',pcr.toFixed(2)],['Max Pain',fmt(maxPain)],['Total Call OI',fmt(totalCE)],['Total Put OI',fmt(totalPE)],['Paper Mode','ON'],['Live Orders','Manual confirmation'],['Chart Mode',state.chartMode],['Data Source','Simulated demo']];
  $('metricGrid').innerHTML=metrics.map(m=>`<div class="metric"><span>${m[0]}</span><strong class="${m[2]||''}">${m[1]}</strong></div>`).join('');
  $('aiSummary').innerHTML = `<p><strong>${inst.symbol}</strong> is currently shown under a <strong>${scenarioLabel()}</strong> simulation. The workspace combines candles, price action, option-chain pressure, futures basis, strategy advisor logic, and risk controls.</p><p>Demo interpretation: ${advisorSentence()} Paper trading remains the default. Live execution is intentionally disabled on this public page.</p>`;
}
function advisorSentence(){
  if(state.scenario==='bullish') return 'Price action suggests a possible bullish continuation, but confirmation should come from volume, support holding, and controlled risk.';
  if(state.scenario==='bearish') return 'Price action suggests rejection risk, so bearish or hedged structures may be reviewed only after risk checks.';
  if(state.scenario==='volatile') return 'High implied volatility favours hedged or premium-risk-aware structures over impulsive directional trades.';
  return 'Range conditions favour patience, defined-risk strategies, and no-trade decisions near unclear levels.';
}

function drawChart(){
  const svg=$('candleChart'), candles=state.candles; if(!candles.length)return; const W=980,H=430, pad=46, volH=72, chartH=H-pad*2-volH;
  const highs=candles.map(c=>c.high), lows=candles.map(c=>c.low); const max=Math.max(...highs), min=Math.min(...lows), range=max-min || 1;
  const x=i=>pad + i*(W-pad*2)/(candles.length-1); const y=p=>pad + (max-p)/range*chartH;
  const volMax=Math.max(...candles.map(c=>c.vol));
  let html=`<rect width="980" height="430" fill="#050b0a"/><g opacity=".28">`;
  for(let i=0;i<6;i++){const gy=pad+i*chartH/5; html+=`<line x1="${pad}" y1="${gy}" x2="${W-pad}" y2="${gy}" stroke="rgba(255,255,255,.2)"/>`;}
  for(let i=0;i<8;i++){const gx=pad+i*(W-pad*2)/7; html+=`<line x1="${gx}" y1="${pad}" x2="${gx}" y2="${H-pad}" stroke="rgba(255,255,255,.12)"/>`;}
  html+=`</g>`;
  if(state.overlays){
    const support=min+range*.24, resist=min+range*.78, entry=candles.at(-1).close, stop=entry-range*.15, target=entry+range*.22;
    [[support,'Support zone','#39e7a5'],[resist,'Resistance zone','#ffd166'],[entry,'Entry marker','#8bffcd'],[stop,'Stop loss','#ff6b6b'],[target,'Target','#b7ffea']].forEach(([p,label,col])=>{html+=`<line x1="${pad}" y1="${y(p)}" x2="${W-pad}" y2="${y(p)}" stroke="${col}" stroke-width="2" stroke-dasharray="6 6" opacity=".86"/><text x="${W-pad+5}" y="${y(p)+4}" fill="${col}" font-size="11">${label}</text>`;});
  }
  if(state.chartMode==='line'){
    const path=candles.map((c,i)=>`${i?'L':'M'}${x(i)},${y(c.close)}`).join(' '); html+=`<path d="${path}" fill="none" stroke="#39e7a5" stroke-width="2.5"/>`;
  } else {
    const bw=Math.max(3,(W-pad*2)/candles.length*.58);
    candles.forEach((c,i)=>{const up=c.close>=c.open, col=up?'#39e7a5':'#ff6b6b', cx=x(i), yo=y(c.open), yc=y(c.close), yh=y(c.high), yl=y(c.low); html+=`<line x1="${cx}" y1="${yh}" x2="${cx}" y2="${yl}" stroke="${col}" stroke-width="1.3"/>`; if(state.chartMode==='bar'){html+=`<line x1="${cx-bw/2}" y1="${yo}" x2="${cx}" y2="${yo}" stroke="${col}" stroke-width="1.6"/><line x1="${cx}" y1="${yc}" x2="${cx+bw/2}" y2="${yc}" stroke="${col}" stroke-width="1.6"/>`;} else {const top=Math.min(yo,yc), h=Math.max(2,Math.abs(yc-yo)); const fill=state.chartMode==='hollow'&&up?'transparent':col; html+=`<rect x="${cx-bw/2}" y="${top}" width="${bw}" height="${h}" fill="${fill}" stroke="${col}" stroke-width="1.2" rx="1"/>`;}
      const vh=(c.vol/volMax)*volH; html+=`<rect x="${cx-bw/2}" y="${H-pad-vh}" width="${bw}" height="${vh}" fill="${col}" opacity=".28"/>`;
    });
  }
  const patterns = patternNames();
  patterns.forEach((p,idx)=>{const ci=Math.round(candles.length*(.25+idx*.22)); const cy=y(candles[ci].high)-14; html+=`<circle cx="${x(ci)}" cy="${cy}" r="8" fill="#ffd166"/><text x="${x(ci)+12}" y="${cy+4}" fill="#ffd166" font-size="11">${p.short}</text>`;});
  const labels=[max,(max+min)/2,min]; labels.forEach(p=>html+=`<text x="8" y="${y(p)+4}" fill="#a8c3ba" font-size="11">${fmt(p)}</text>`);
  svg.innerHTML=html;
  const inst=currentInstrument(); const last=candles.at(-1); $('chartTitle').textContent=`${inst.symbol} • ${state.interval} • ${state.days} days • ${state.chartMode}`; $('chartStats').textContent=`O ${fmt(last.open)} H ${fmt(last.high)} L ${fmt(last.low)} C ${fmt(last.close)}`;
  renderPatternAndPA();
}
function patternNames(){
  if(state.scenario==='bullish') return [{short:'Bull Engulfing',full:'Bullish Engulfing'},{short:'Morning Star',full:'Morning Star'},{short:'Three Soldiers',full:'Three White Soldiers'}];
  if(state.scenario==='bearish') return [{short:'Bear Engulfing',full:'Bearish Engulfing'},{short:'Evening Star',full:'Evening Star'},{short:'Shooting Star',full:'Shooting Star'}];
  if(state.scenario==='volatile') return [{short:'Doji',full:'Doji'},{short:'Spinning Top',full:'Spinning Top'},{short:'Tweezers',full:'Tweezers Top / Bottom watch'}];
  return [{short:'Doji',full:'Doji'},{short:'Harami',full:'Bull/Bear Harami watch'},{short:'Hammer',full:'Hammer near support watch'}];
}
function renderPatternAndPA(){
  $('patternList').innerHTML=patternNames().map(p=>`<div class="pill">${p.full}</div>`).join('') + `<p class="small-note">Pattern labels are simulated and shown for proposed product behaviour.</p>`;
  const items = state.scenario==='bullish'?['Higher high / higher low structure','Breakout over resistance watch','Volume confirmation required','Pullback entry zone possible']:state.scenario==='bearish'?['Lower high structure','Resistance rejection watch','Breakdown confirmation required','Avoid chasing below support']:state.scenario==='volatile'?['Wide candle ranges','High IV warning','Wait for clean retest','Defined-risk strategy preferred']:['Range-bound market','Support/resistance rotation','No-trade near middle of range','Breakout confirmation needed'];
  $('priceActionList').innerHTML=items.map(i=>`<div class="pill">${i}</div>`).join('');
}

function renderOptions(){
  const rows=state.optionRows, totalCE=rows.reduce((a,r)=>a+r.ceOi,0), totalPE=rows.reduce((a,r)=>a+r.peOi,0), pcr=totalPE/totalCE, atm=rows.find(r=>r.atm);
  const maxPain=atm.strike; const support=rows.reduce((a,r)=>r.peOi>a.peOi?r:a,rows[0]).strike; const resistance=rows.reduce((a,r)=>r.ceOi>a.ceOi?r:a,rows[0]).strike;
  const metrics=[['PCR',pcr.toFixed(2)],['Max Pain',fmt(maxPain)],['OI Support',fmt(support)],['OI Resistance',fmt(resistance)],['ATM Strike',fmt(atm.strike)]];
  $('optionMetrics').innerHTML=metrics.map(m=>`<div class="metric"><span>${m[0]}</span><strong>${m[1]}</strong></div>`).join('');
  $('optionTable').innerHTML=`<thead><tr><th>Strike</th><th>CE LTP</th><th>CE OI</th><th>CE ΔOI</th><th>IV</th><th>Delta CE</th><th>Gamma</th><th>PE LTP</th><th>PE OI</th><th>PE ΔOI</th><th>Delta PE</th></tr></thead><tbody>${rows.map(r=>`<tr class="${r.atm?'atm':''}"><td>${fmt(r.strike)}${r.atm?' ATM':''}</td><td>${fmt(r.ceLtp)}</td><td>${fmt(r.ceOi)}</td><td class="${r.ceChg>=0?'up':'down'}">${fmt(r.ceChg)}</td><td>${r.iv.toFixed(1)}%</td><td>${r.deltaCE.toFixed(2)}</td><td>${r.gamma}</td><td>${fmt(r.peLtp)}</td><td>${fmt(r.peOi)}</td><td class="${r.peChg>=0?'up':'down'}">${fmt(r.peChg)}</td><td>${r.deltaPE.toFixed(2)}</td></tr>`).join('')}</tbody>`;
}
function renderFutures(){
  const rows=state.futuresRows, near=rows[0]; const inst=currentInstrument();
  const metrics=[['Near future',money(near.price)],['Basis',money(near.basis)],['Rollover',near.rollover+'%'],['Futures OI',fmt(near.oi)],['OI Change',fmt(near.oiChg)]];
  $('futuresMetrics').innerHTML=metrics.map(m=>`<div class="metric"><span>${m[0]}</span><strong>${m[1]}</strong></div>`).join('');
  $('futuresTable').innerHTML=`<thead><tr><th>Contract</th><th>Price</th><th>Basis</th><th>OI</th><th>OI Change</th><th>Volume</th><th>Rollover</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.contract}</td><td>${money(r.price)}</td><td>${money(r.basis)}</td><td>${fmt(r.oi)}</td><td>${fmt(r.oiChg)}</td><td>${fmt(r.volume)}</td><td>${r.rollover}%</td></tr>`).join('')}</tbody>`;
  $('rolloverBars').innerHTML=rows.map(r=>`<div>${r.contract} contract<div class="bar"><span style="width:${Math.min(100,r.rollover)}%"></span></div></div>`).join('');
  $('basisText').textContent=`${inst.symbol} demo basis is ${money(near.basis)}. Positive basis may indicate futures trading at a premium to spot; negative basis may indicate discount. Production logic should validate this with real broker/exchange data.`;
}
function advisorData(){
  if(state.scenario==='bullish') return {category:'Bullish / breakout strategy', strategy:'Bull Call Spread or Futures Long with stop', confidence:72, risk:'Medium', avoid:'Avoid naked short options without margin and risk controls'};
  if(state.scenario==='bearish') return {category:'Bearish / rejection strategy', strategy:'Bear Put Spread or Futures Short with stop', confidence:68, risk:'Medium-high', avoid:'Avoid late short entry after extended downside candle'};
  if(state.scenario==='volatile') return {category:'High-IV / hedged strategy', strategy:'Iron Condor, Iron Butterfly, or defined-risk spread', confidence:63, risk:'High volatility', avoid:'Avoid unhedged premium selling and oversized positions'};
  return {category:'Range / no-trade watch', strategy:'Iron Condor watch or wait for breakout confirmation', confidence:58, risk:'Low-medium', avoid:'Avoid trading in middle of range'};
}
function renderStrategy(){
  const d=advisorData();
  $('strategyOutput').innerHTML=`<div class="metric"><span>Suggested category</span><strong>${d.category}</strong></div><p><strong>Strategy candidate:</strong> ${d.strategy}</p><p><strong>Confidence style:</strong> ${d.confidence}/100 setup quality, not a guarantee.</p><p><strong>Risk:</strong> ${d.risk}</p><p><strong>Avoid:</strong> ${d.avoid}</p><p class="small-note">Advisor output is educational and simulated. User confirmation and risk checks remain mandatory.</p>`;
  $('strategyBuilder').innerHTML=`<ul class="check-list"><li>Select strategy template.</li><li>Set legs, strikes, expiry, quantity.</li><li>View max profit/loss and breakeven.</li><li>Check Greeks and IV impact.</li><li>Send to risk engine and paper trade.</li></ul>`;
  const inputs=['Candles','Pattern markers','Price action','Support/resistance','Option-chain pressure','Futures basis','PCR','Max Pain','IV and Greeks','News risk','Risk limits','Journal history'];
  $('decisionInputs').innerHTML=inputs.map(i=>`<span class="pill">${i}</span>`).join('');
}
function prefillOrder(){
  const last=state.candles.at(-1).close; let entry=Math.round(last*100)/100;
  if($('orderType').value==='Option') entry=Math.max(25, Math.round((last*.004)*20)/20);
  $('entryPrice').value=entry.toFixed(entry<100?2:0); $('stopLoss').value=(entry*.82).toFixed(entry<100?2:0); $('targetPrice').value=(entry*1.35).toFixed(entry<100?2:0); $('qty').value=currentInstrument().lot;
}
function renderRisk(){
  const entry=+$('entryPrice').value||0, stop=+$('stopLoss').value||0, target=+$('targetPrice').value||0, qty=+$('qty').value||1; const risk=Math.max(0,entry-stop)*qty, reward=Math.max(0,target-entry)*qty, rr=risk?reward/risk:0;
  let status='Approved for paper demo', cls='risk-pass', notes=['Paper mode allowed','Manual live confirmation required','Audit log required'];
  if(rr<1.2){status='Warning: weak reward:risk'; cls='risk-warn'; notes.push('Improve target or reduce risk before live review');}
  if(risk>entry*qty*.35){status='Blocked for live review'; cls='risk-fail'; notes.push('Risk too large for safe demo workflow');}
  $('riskOutput').innerHTML=`<h2 class="${cls}">${status}</h2><p><strong>Capital at risk:</strong> ${money(risk)}</p><p><strong>Potential reward:</strong> ${money(reward)}</p><p><strong>Reward:risk:</strong> ${rr.toFixed(2)} : 1</p><ul class="check-list">${notes.map(n=>`<li>${n}</li>`).join('')}</ul>`;
}
function paperTrade(){
  const trade={time:new Date().toLocaleTimeString(), instrument:currentInstrument().symbol, strategy:$('orderStrategy').value, side:$('orderSide').value, entry:+$('entryPrice').value, stop:+$('stopLoss').value, target:+$('targetPrice').value, qty:+$('qty').value, status:'Paper open'};
  state.trades.unshift(trade); renderTradebook(); renderJournal(trade); activateTab('journal');
}
function renderTradebook(){
  const rows=state.trades.length?state.trades:[{time:'--',instrument:currentInstrument().symbol,strategy:'Demo trade not placed yet',side:'--',entry:0,stop:0,target:0,qty:0,status:'Waiting'}];
  $('tradebookTable').innerHTML=`<thead><tr><th>Time</th><th>Instrument</th><th>Strategy</th><th>Side</th><th>Entry</th><th>SL</th><th>Target</th><th>Qty</th><th>Status</th></tr></thead><tbody>${rows.map(t=>`<tr><td>${t.time}</td><td>${t.instrument}</td><td>${t.strategy}</td><td>${t.side}</td><td>${t.entry?fmt(t.entry):'--'}</td><td>${t.stop?fmt(t.stop):'--'}</td><td>${t.target?fmt(t.target):'--'}</td><td>${t.qty||'--'}</td><td>${t.status}</td></tr>`).join('')}</tbody>`;
}
function renderJournal(trade=state.trades[0]){
  const d=advisorData(); const t=trade || {instrument:currentInstrument().symbol,strategy:d.strategy,side:'Paper plan',entry:+$('entryPrice').value,stop:+$('stopLoss').value,target:+$('targetPrice').value,qty:+$('qty').value,status:'Sample'};
  $('journalEntry').innerHTML=`<p><strong>Instrument:</strong> ${t.instrument}</p><p><strong>Strategy:</strong> ${t.strategy}</p><p><strong>Setup reason:</strong> ${d.category} was selected after reviewing simulated candles, price action, option-chain pressure, futures basis, IV/Greeks, and risk condition.</p><p><strong>Risk plan:</strong> Entry ${fmt(t.entry)}, stop ${fmt(t.stop)}, target ${fmt(t.target)}, quantity ${t.qty}. The trade is paper/demo only unless live confirmation, broker approval, and compliance checks exist.</p><p><strong>Lesson:</strong> Wait for confirmation, avoid impulsive entries, respect stop loss, and review every decision after execution.</p>`;
  $('eodReview').innerHTML=`<ul class="check-list"><li>Trades taken: ${state.trades.length}</li><li>Best discipline point: paper mode and risk gate used.</li><li>Main improvement: confirm setup with price action and option-chain alignment.</li><li>No-trade reminder: unclear range middle should be avoided.</li></ul>`;
}
function renderBacktest(){
  const trades=+$('backtestTrades').value||80, risk=+$('riskPerTrade').value||1; const edge={bullish:1.08,bearish:.98,range:.85,volatile:.72}[state.scenario]; const win=Math.min(68,Math.max(38,46+edge*10-risk*2)); const pf=(1+edge*.55-risk*.08).toFixed(2); const dd=(risk*(state.scenario==='volatile'?7:4.5)).toFixed(1);
  const metrics=[['Trades',trades],['Win rate',win.toFixed(1)+'%'],['Profit factor',pf],['Max drawdown',dd+'%'],['Result','Simulated']];
  $('backtestMetrics').innerHTML=metrics.map(m=>`<div class="metric"><span>${m[0]}</span><strong>${m[1]}</strong></div>`).join('');
  drawEquity(trades, edge, risk);
}
function drawEquity(trades, edge, risk){
  const svg=$('equityCurve'), W=980,H=240,pad=28; let eq=100, pts=[]; const rand=seedRandom(trades*edge*risk+13);
  for(let i=0;i<trades;i++){eq += (rand()<.52?1:-1)*(risk*(.5+rand()*1.2))*edge; pts.push(eq);} const min=Math.min(...pts), max=Math.max(...pts); const x=i=>pad+i*(W-pad*2)/(pts.length-1); const y=v=>H-pad-(v-min)/(max-min||1)*(H-pad*2); const path=pts.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v)}`).join(' '); svg.innerHTML=`<rect width="980" height="240" fill="#050b0a"/><path d="${path}" fill="none" stroke="#39e7a5" stroke-width="3"/><text x="20" y="24" fill="#a8c3ba" font-size="12">Simulated equity curve</text><text x="20" y="220" fill="#a8c3ba" font-size="12">For demo only — not historical performance</text>`;
}
function addAlert(){
  const types=['Price near resistance','Bullish pattern detected','Risk limit warning','Option OI shift','Futures rollover change','No-trade zone warning']; const type=types[state.alerts.length%types.length]; state.alerts.unshift({time:new Date().toLocaleTimeString(), type, instrument:currentInstrument().symbol, status:'Active demo'}); renderAlerts();
}
function renderAlerts(){
  if(!state.alerts.length) state.alerts=[{time:'--',type:'No active alerts yet',instrument:currentInstrument().symbol,status:'Click add sample alert'}];
  $('alertsList').innerHTML=state.alerts.map(a=>`<div class="metric"><span>${a.time} • ${a.instrument}</span><strong>${a.type}</strong><small>${a.status}</small></div>`).join('');
}
function renderModules(){
  $('moduleGrid').innerHTML=modules.map(m=>`<div class="module-card"><strong>${m[0]}</strong><span>${m[1]}</span><p>${m[2]}</p></div>`).join('');
}

document.addEventListener('DOMContentLoaded', () => { initControls(); populateInstruments(); refreshAll(); });
