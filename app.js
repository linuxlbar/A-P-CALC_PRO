// ==========================================
// 1. NAVIGATION ROUTING
// ==========================================
const tabButtons = document.querySelectorAll('.tab-btn');
const calcCards = document.querySelectorAll('.calc-card');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    calcCards.forEach(card => card.style.display = 'none');
    const targetId = button.getAttribute('data-target');
    const targetCard = document.getElementById(targetId);
    if (targetCard) targetCard.style.display = 'block';
  });
});

// ==========================================
// 2. WEIGHT & BALANCE MODULE
// ==========================================

// --- Tool 1: Single Item Solver ---
const calcWbBtn = document.getElementById('calcWbBtn');
calcWbBtn.addEventListener('click', () => {
  const w = parseFloat(document.getElementById('wbWeight').value);
  const a = parseFloat(document.getElementById('wbArm').value);
  const m = parseFloat(document.getElementById('wbMoment').value);
  const res = document.getElementById('wbResult');

  if ([!isNaN(w), !isNaN(a), !isNaN(m)].filter(Boolean).length !== 2) {
    res.textContent = "Error: Enter exactly 2 values";
    res.style.color = "red";
    return;
  }
  res.style.color = "var(--primary-color)";

  if (isNaN(w)) {
    const calcW = m / a;
    document.getElementById('wbWeight').value = calcW.toFixed(2);
    res.textContent = `Calculated Weight: ${calcW.toFixed(2)} lbs`;
  } else if (isNaN(a)) {
    const calcA = m / w;
    document.getElementById('wbArm').value = calcA.toFixed(2);
    res.textContent = `Calculated Arm/CG: ${calcA.toFixed(2)} in`;
  } else if (isNaN(m)) {
    const calcM = w * a;
    document.getElementById('wbMoment').value = calcM.toFixed(2);
    res.textContent = `Calculated Moment: ${calcM.toFixed(2)} in-lbs`;
  }
});

// --- Tool 2: Aircraft CG Summation ---
const addCgRowBtn = document.getElementById('addCgRowBtn');
addCgRowBtn.addEventListener('click', () => {
  const newRow = document.createElement('div');
  newRow.className = 'cg-row';
  newRow.style.cssText = 'display: flex; gap: 8px; margin-bottom: 10px;';
  newRow.innerHTML = `
    <input type="text" placeholder="Item" style="flex: 2; padding: 0.8rem; border-radius: 8px; border: 1px solid #d1d5db; min-width: 0;">
    <input type="number" class="cg-weight" placeholder="W (lbs)" style="flex: 1.5; padding: 0.8rem; border-radius: 8px; border: 1px solid #d1d5db; min-width: 0;">
    <input type="number" class="cg-arm" placeholder="A (in)" style="flex: 1.5; padding: 0.8rem; border-radius: 8px; border: 1px solid #d1d5db; min-width: 0;">
  `;
  document.getElementById('cg-layers-container').appendChild(newRow);
});

document.getElementById('calcCgBtn').addEventListener('click', () => {
  let totalW = 0, totalM = 0, valid = 0;
  document.querySelectorAll('.cg-row').forEach(row => {
    const w = parseFloat(row.querySelector('.cg-weight').value);
    const a = parseFloat(row.querySelector('.cg-arm').value);
    if (!isNaN(w) && !isNaN(a)) {
      totalW += w; totalM += (w * a); valid++;
    }
  });
  if (valid === 0) { alert("Add data to stations"); return; }
  document.getElementById('outCgWeight').textContent = totalW.toFixed(2);
  document.getElementById('outCgMoment').textContent = totalM.toFixed(2);
  document.getElementById('outCg').textContent = (totalM / totalW).toFixed(3);
});

// --- Tool 3: Ballast Shift ---
document.getElementById('calcBallastBtn').addEventListener('click', () => {
  const w = parseFloat(document.getElementById('balWeight').value);
  const curCg = parseFloat(document.getElementById('balCurrentCg').value);
  const tgtCg = parseFloat(document.getElementById('balTargetCg').value);
  const arm = parseFloat(document.getElementById('balArm').value);
  if (isNaN(w) || isNaN(curCg) || isNaN(tgtCg) || isNaN(arm)) { alert("Fill all fields"); return; }
  const bw = (w * (tgtCg - curCg)) / (arm - tgtCg);
  document.getElementById('balResult').textContent = `${bw.toFixed(2)} lbs`;
});

// --- Tool 4: Equipment Alteration ---
document.getElementById('addRemBtn').addEventListener('click', () => {
  const div = document.createElement('div');
  div.className = 'rem-row';
  div.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px;';
  div.innerHTML = `<input type="number" class="rem-wt" placeholder="Wt" style="flex: 1; padding: 0.8rem; border-radius: 8px; border: 1px solid #d1d5db; min-width: 0;"><input type="number" class="rem-arm" placeholder="Arm" style="flex: 1; padding: 0.8rem; border-radius: 8px; border: 1px solid #d1d5db; min-width: 0;">`;
  document.getElementById('rem-container').appendChild(div);
});

document.getElementById('addAddBtn').addEventListener('click', () => {
  const div = document.createElement('div');
  div.className = 'add-row';
  div.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px;';
  div.innerHTML = `<input type="number" class="add-wt" placeholder="Wt" style="flex: 1; padding: 0.8rem; border-radius: 8px; border: 1px solid #d1d5db; min-width: 0;"><input type="number" class="add-arm" placeholder="Arm" style="flex: 1; padding: 0.8rem; border-radius: 8px; border: 1px solid #d1d5db; min-width: 0;">`;
  document.getElementById('add-container').appendChild(div);
});

document.getElementById('calcAltBtn').addEventListener('click', () => {
  const oldW = parseFloat(document.getElementById('altOldWt').value);
  const oldCg = parseFloat(document.getElementById('altOldCg').value);
  if (isNaN(oldW) || isNaN(oldCg)) { alert("Enter Original Wt & CG"); return; }
  
  let remM = 0, remW = 0, addM = 0, addW = 0;
  
  document.querySelectorAll('.rem-row').forEach(row => {
    const w = parseFloat(row.querySelector('.rem-wt').value) || 0;
    const a = parseFloat(row.querySelector('.rem-arm').value) || 0;
    remM += (w * a); remW += w;
  });
  document.querySelectorAll('.add-row').forEach(row => {
    const w = parseFloat(row.querySelector('.add-wt').value) || 0;
    const a = parseFloat(row.querySelector('.add-arm').value) || 0;
    addM += (w * a); addW += w;
  });
  
  const newW = oldW - remW + addW;
  const newM = (oldW * oldCg) - remM + addM;
  
  document.getElementById('altResWt').textContent = newW.toFixed(2);
  document.getElementById('altResCg').textContent = (newM / newW).toFixed(2);
});

// Clear Handlers
document.getElementById('clearWbBtn').addEventListener('click', () => { ['wbWeight','wbArm','wbMoment'].forEach(id => document.getElementById(id).value = ''); });
document.getElementById('clearCgBtn').addEventListener('click', () => location.reload());
document.getElementById('clearBallastBtn').addEventListener('click', () => { ['balWeight','balCurrentCg','balTargetCg','balArm'].forEach(id => document.getElementById(id).value = ''); });
document.getElementById('clearAltBtn').addEventListener('click', () => location.reload());

// ==========================================
// 3. SHEET METAL CALCULATOR
// ==========================================
document.getElementById('addLayerBtn').addEventListener('click', () => {
  const count = document.querySelectorAll('.layer-input').length + 1;
  const newGroup = document.createElement('div');
  newGroup.className = 'input-group';
  newGroup.innerHTML = `<label>Layer ${count} Thickness (in)</label><input type="number" class="layer-input" placeholder="e.g. 0.032" step="0.001">`;
  document.getElementById('layers-container').appendChild(newGroup);
});

document.getElementById('calcMetalBtn').addEventListener('click', () => {
  const inputs = document.querySelectorAll('.layer-input');
  let tMax = 0, tTotal = 0, valid = 0;
  inputs.forEach(i => { const v = parseFloat(i.value); if(v>0) { tTotal+=v; if(v>tMax) tMax=v; valid++; } });
  if (valid === 0) return;
  document.getElementById('outGrip').textContent = tTotal.toFixed(3);
  let dashDia = Math.ceil(tMax * 3 * 32); if (dashDia < 3) dashDia = 3;
  let d = dashDia / 32;
  document.getElementById('outDiaDash').textContent = `-${dashDia} (${d.toFixed(3)}")`;
  let rawLen = tTotal + (1.5 * d);
  document.getElementById('outLenDash').textContent = `-${Math.round(rawLen * 16)} (Exact: ${rawLen.toFixed(4)}")`;
  const drillMap = {3:"3/32 | #40", 4:"1/8 | #30", 5:"5/32 | #21", 6:"3/16 | #11", 8:"1/4 | 1/4\""};
  document.getElementById('outDrill').textContent = drillMap[dashDia] || "Check Manual";
  document.getElementById('outED').textContent = (d * 2).toFixed(3);
  const l = parseFloat(document.getElementById('rowLength').value);
  const c = parseInt(document.getElementById('rivetCount').value);
  if (!isNaN(l) && c > 1) {
    let p = (l - (4 * d)) / (c - 1);
    document.getElementById('outEvenPitch').textContent = p.toFixed(3);
    document.getElementById('pitchWarning').textContent = p < (d * 3) ? "WARNING: Pitch below min" : "Meets min pitch";
  }
});
document.getElementById('clearMetalBtn').addEventListener('click', () => location.reload());

// ==========================================
// 4. ELECTRICAL CALCULATOR
// ==========================================
document.getElementById('calcElecBtn').addEventListener('click', () => {
  const v = parseFloat(document.getElementById('voltsInput').value);
  const i = parseFloat(document.getElementById('ampsInput').value);
  const r = parseFloat(document.getElementById('ohmsInput').value);
  const p = parseFloat(document.getElementById('wattsInput').value);
  const count = [!isNaN(v), !isNaN(i), !isNaN(r), !isNaN(p)].filter(Boolean).length;
  if (count !== 2) { alert("Enter exactly 2 values"); return; }
  let cv, ci, cr, cp;
  if (!isNaN(v) && !isNaN(i)) { cv=v; ci=i; cr=v/i; cp=v*i; }
  else if (!isNaN(v) && !isNaN(r)) { cv=v; cr=r; ci=v/r; cp=(v*v)/r; }
  else if (!isNaN(v) && !isNaN(p)) { cv=v; cp=p; ci=p/v; cr=(v*v)/p; }
  else if (!isNaN(i) && !isNaN(r)) { ci=i; cr=r; cv=i*r; cp=(i*i)*r; }
  else if (!isNaN(i) && !isNaN(p)) { ci=i; cp=p; cv=p/i; cr=p/(i*i); }
  else if (!isNaN(r) && !isNaN(p)) { cr=r; cp=p; cv=Math.sqrt(p*r); ci=Math.sqrt(p/r); }
  document.getElementById('voltsInput').value = cv.toFixed(2);
  document.getElementById('ampsInput').value = ci.toFixed(2);
  document.getElementById('ohmsInput').value = cr.toFixed(2);
  document.getElementById('wattsInput').value = cp.toFixed(2);
});
document.getElementById('clearElecBtn').addEventListener('click', () => { 
  ['voltsInput','ampsInput','ohmsInput','wattsInput'].forEach(id => document.getElementById(id).value = ''); 
  document.getElementById('elecResult').textContent='--'; 
});

// --- Load Comparison Tool ---
document.getElementById('calcLoadBtn').addEventListener('click', () => {
    const type = document.getElementById('loadType').value;
    const val1 = parseFloat(document.getElementById('loadA').value);
    const val2 = parseFloat(document.getElementById('loadB').value);
    let watts = 0;

    if (type === 'ea') {
        // Option 1: 24V * 3A * 2 lights = 144W
        watts = val1 * val2; 
    } else {
        // Option 3: (1/5 HP * 746) / 0.75 = 198.9W
        watts = (val1 * 746) / val2;
    }
    document.getElementById('loadRes').textContent = watts.toFixed(1);
});