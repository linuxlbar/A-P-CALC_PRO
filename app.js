// =========================================================================
// A&P Calculator Pro - Master JS File
// =========================================================================

// --- 1. NAVIGATION LOGIC ---
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


// --- 2. WEIGHT & BALANCE MODULE ---
document.getElementById('calcWbBtn').addEventListener('click', () => {
    const w = parseFloat(document.getElementById('wbWeight').value);
    const a = parseFloat(document.getElementById('wbArm').value);
    const m = parseFloat(document.getElementById('wbMoment').value);
    const res = document.getElementById('wbResult');

    if ([!isNaN(w), !isNaN(a), !isNaN(m)].filter(Boolean).length !== 2) {
        res.textContent = "Error: Enter exactly 2 values"; return;
    }
    
    if (isNaN(w)) {
        document.getElementById('wbWeight').value = (m / a).toFixed(2);
        res.textContent = "Weight: " + (m / a).toFixed(2);
    } else if (isNaN(a)) {
        document.getElementById('wbArm').value = (m / w).toFixed(2);
        res.textContent = "Arm: " + (m / w).toFixed(2);
    } else if (isNaN(m)) {
        document.getElementById('wbMoment').value = (w * a).toFixed(2);
        res.textContent = "Moment: " + (w * a).toFixed(2);
    }
});
document.getElementById('clearWbBtn').addEventListener('click', () => {
    document.getElementById('wbWeight').value = '';
    document.getElementById('wbArm').value = '';
    document.getElementById('wbMoment').value = '';
    document.getElementById('wbResult').textContent = '--';
});

document.getElementById('addCgRowBtn').addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'cg-row';
    div.style.cssText = 'display: flex; gap: 8px; margin-bottom: 10px;';
    div.innerHTML = `<input type="text" placeholder="Item" style="flex: 2; padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);"><input type="number" class="cg-weight" placeholder="W" style="flex: 1.5; padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);"><input type="number" class="cg-arm" placeholder="A" style="flex: 1.5; padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">`;
    document.getElementById('cg-layers-container').appendChild(div);
});

document.getElementById('calcCgBtn').addEventListener('click', () => {
    let tW = 0, tM = 0;
    document.querySelectorAll('.cg-row').forEach(row => {
        const w = parseFloat(row.querySelector('.cg-weight').value) || 0;
        const a = parseFloat(row.querySelector('.cg-arm').value) || 0;
        if (w !== 0 && a !== 0) { tW += w; tM += (w * a); }
    });
    if (tW === 0) return;
    document.getElementById('outCgWeight').textContent = tW.toFixed(2);
    document.getElementById('outCg').textContent = (tM / tW).toFixed(3);
});

document.getElementById('calcBallastBtn').addEventListener('click', () => {
    const w = parseFloat(document.getElementById('balWeight').value);
    const curCg = parseFloat(document.getElementById('balCurrentCg').value);
    const tgtCg = parseFloat(document.getElementById('balTargetCg').value);
    const arm = parseFloat(document.getElementById('balArm').value);
    if (isNaN(w) || isNaN(curCg) || isNaN(tgtCg) || isNaN(arm)) return;
    const bw = (w * (tgtCg - curCg)) / (arm - tgtCg);
    document.getElementById('balResult').textContent = `${bw.toFixed(2)} lbs`;
});

document.getElementById('addRemBtn').addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'rem-row';
    div.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px;';
    div.innerHTML = `<input type="number" class="rem-wt" placeholder="Wt" style="flex: 1; padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);"><input type="number" class="rem-arm" placeholder="Arm" style="flex: 1; padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">`;
    document.getElementById('rem-container').appendChild(div);
});

document.getElementById('addAddBtn').addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'add-row';
    div.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px;';
    div.innerHTML = `<input type="number" class="add-wt" placeholder="Wt" style="flex: 1; padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);"><input type="number" class="add-arm" placeholder="Arm" style="flex: 1; padding: 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">`;
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
document.getElementById('clearAltBtn').addEventListener('click', () => location.reload());


// --- 3. SHEET METAL MODULE ---

// Add Layer Button
document.getElementById('addLayerBtn').addEventListener('click', () => {
    const count = document.querySelectorAll('.layer-input').length + 1;
    const div = document.createElement('div');
    div.className = 'input-group';
    div.innerHTML = `<label>Layer ${count} Thickness</label><input type="number" class="layer-input" step="0.001">`;
    document.getElementById('layers-container').appendChild(div);
});

// Dash Specs & Drills
document.getElementById('calcMetalBtn').addEventListener('click', () => {
    let tMax = 0, tTotal = 0;
    document.querySelectorAll('.layer-input').forEach(i => { 
        const v = parseFloat(i.value); 
        if(v > 0) { tTotal+=v; if(v>tMax) tMax=v; } 
    });
    
    if (tTotal === 0) return;
    
    let dashDia = Math.ceil(tMax * 3 * 32); 
    if (dashDia < 3) dashDia = 3; 
    
    let d = dashDia / 32;
    
    let pilotDrill = "--";
    let finalDrill = "--";
    let cleco = "--";
    
    // Explicit Pilot and Final definitions
    switch(dashDia) {
        case 3: 
            pilotDrill = "N/A"; 
            finalDrill = "#40"; 
            cleco = "Silver / White"; 
            break;
        case 4: 
            pilotDrill = '1/8"'; 
            finalDrill = "#30"; 
            cleco = "Copper"; 
            break;
        case 5: 
            pilotDrill = '1/8"'; 
            finalDrill = "#21"; 
            cleco = "Black"; 
            break;
        case 6: 
            pilotDrill = "#30"; 
            finalDrill = "#11"; 
            cleco = "Brass"; 
            break;
        case 8: 
            pilotDrill = "#30"; 
            finalDrill = 'Letter "F" (1/4")'; 
            cleco = "Copper / Green"; 
            break;
        default: 
            pilotDrill = "--"; 
            finalDrill = "Check Manual"; 
            cleco = "N/A";
    }

    // Edge Distance Math
    let univED = d * 2;
    let flushED = d * 2.5;

    // Output specs
    document.getElementById('outDiaDash').textContent = `-${dashDia} (${d.toFixed(3)}")`;
    document.getElementById('outLenDash').textContent = `-${Math.round((tTotal + (1.5 * d)) * 16)}`;
    document.getElementById('outPilot').textContent = pilotDrill;
    document.getElementById('outFinal').textContent = finalDrill;
    document.getElementById('outCleco').textContent = cleco;
    document.getElementById('outUnivED').textContent = univED.toFixed(3) + '"';
    document.getElementById('outFlushED').textContent = flushED.toFixed(3) + '"';

    // UX Feature: Auto-fill the ED input in the Rivet Spacing tool
    document.getElementById('rivetED').value = univED.toFixed(3);
});

// Rivet Spacing Calculator
document.getElementById('calcRivetBtn').addEventListener('click', () => {
    const len = parseFloat(document.getElementById('rivetLen').value);
    const ed = parseFloat(document.getElementById('rivetED').value);
    let count = parseFloat(document.getElementById('rivetCount').value);
    
    if (isNaN(count)) count = 6; // Default to standard layout

    if (isNaN(len) || isNaN(ed) || count < 2) {
        document.getElementById('rivetPitchOut').textContent = "Error"; return;
    }
    
    const pitch = (len - (2 * ed)) / (count - 1);
    document.getElementById('rivetPitchOut').textContent = pitch.toFixed(3);
});


// --- 4. ELECTRICAL MODULE ---
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

document.getElementById('loadType').addEventListener('change', (e) => {
    const type = e.target.value;
    const labelA = document.getElementById('loadLabelA');
    const labelB = document.getElementById('loadLabelB');
    const inputA = document.getElementById('loadA');
    const inputB = document.getElementById('loadB');

    if (type === 'ea') {
        labelA.textContent = "Volts (E)";
        inputA.placeholder = "e.g., 24";
        labelB.textContent = "Amps (I)";
        inputB.placeholder = "e.g., 3";
    } else {
        labelA.textContent = "Horsepower (HP)";
        inputA.placeholder = "e.g., 0.2 (for 1/5 HP)";
        labelB.textContent = "Efficiency (Decimal)";
        inputB.placeholder = "e.g., 0.75 (for 75%)";
    }
    inputA.value = '';
    inputB.value = '';
    document.getElementById('loadRes').textContent = '--';
});

document.getElementById('calcLoadBtn').addEventListener('click', () => {
    const type = document.getElementById('loadType').value;
    const v1 = parseFloat(document.getElementById('loadA').value);
    const v2 = parseFloat(document.getElementById('loadB').value);
    if(isNaN(v1) || isNaN(v2)) return;
    let watts = (type === 'ea') ? (v1 * v2) : ((v1 * 746) / v2);
    document.getElementById('loadRes').textContent = watts.toFixed(1);
});


// --- 5. GENERAL MATH MODULE ---
function safeEval(expr) {
    try {
        const sanitized = expr.replace(/[^-()\d/*+.]/g, ''); 
        return Function('"use strict";return (' + sanitized + ')')();
    } catch (e) { return "Error"; }
}

document.getElementById('calcExprBtn').addEventListener('click', () => {
    const expr = document.getElementById('mathExpr').value;
    const res = safeEval(expr);
    document.getElementById('exprRes').textContent = isNaN(res) ? "Invalid input" : res;
});

function gcd(a, b) { return b ? gcd(b, a % b) : a; }

document.getElementById('convFracBtn').addEventListener('click', () => {
    const input = document.getElementById('fracDecInput').value.trim();
    let result = "";
    
    if (input.includes('/')) {
        const parts = input.split('/');
        if (parts.length === 2) {
            const num = parseFloat(parts[0]);
            const den = parseFloat(parts[1]);
            if (den !== 0) { result = (num / den).toString(); }
        }
    } else {
        const dec = parseFloat(input);
        if (!isNaN(dec)) {
            const len = dec.toString().split('.')[1] ? dec.toString().split('.')[1].length : 0;
            const denominator = Math.pow(10, len);
            const numerator = dec * denominator;
            const divisor = gcd(numerator, denominator);
            result = `${numerator/divisor} / ${denominator/divisor}`;
        }
    }
    document.getElementById('fracRes').textContent = result || "Invalid input";
});

document.getElementById('calcPropBtn').addEventListener('click', () => {
    const aInput = document.getElementById('propA');
    const bInput = document.getElementById('propB');
    const cInput = document.getElementById('propC');
    const dInput = document.getElementById('propD');
    
    const a = parseFloat(aInput.value); const b = parseFloat(bInput.value);
    const c = parseFloat(cInput.value); const d = parseFloat(dInput.value);
    
    if (isNaN(a)) { aInput.value = (b * c) / d; }
    else if (isNaN(b)) { bInput.value = (a * d) / c; }
    else if (isNaN(c)) { cInput.value = (a * d) / b; }
    else if (isNaN(d)) { dInput.value = (b * c) / a; }
});