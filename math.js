function generateMathQuestion() {
    const q = document.getElementById('question');
    const a = document.getElementById('answerSection');
    const visual = document.getElementById('mathVisual');
    
    const gradeCap = typeof getGradeDigitCap === 'function' ? getGradeDigitCap(currentGrade) : digitCount;
    const effectiveDigits = Math.max(1, Math.min(digitCount, gradeCap));
    
    // Calculate max value based on digit count and grade cap
    const maxValue = Math.pow(10, effectiveDigits) - 1;
    const minValue = effectiveDigits === 1 ? 1 : Math.pow(10, effectiveDigits - 1);
    
    const multiplierCap = currentGrade <= 3 ? 6 : currentGrade <= 6 ? 9 : 12;
    
    if (currentTopic === 'counting') {
        const num = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15)) + 1;
        q.innerHTML = `Count the stars: ${'⭐'.repeat(num)}`;
        currentAnswer = num.toString();
        window.currentQuestionMeta = { subject: 'math', topic: 'counting', a: num };
        window.currentQuestionId = (window.currentQuestionId || 0) + 1;
        renderMathVisual({ type: 'dots', a: num });
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'addition') {
        const n1 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const n2 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        q.innerHTML = renderVerticalProblem(n1, n2, '+');
        currentAnswer = (n1 + n2).toString();
        window.currentQuestionMeta = { subject: 'math', topic: 'addition', a: n1, b: n2 };
        window.currentQuestionId = (window.currentQuestionId || 0) + 1;
        renderMathVisual({ type: 'place', a: n1, b: n2 });
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'subtraction') {
        const n1 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const n2 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const larger = Math.max(n1, n2);
        const smaller = Math.min(n1, n2);
        q.innerHTML = renderVerticalProblem(larger, smaller, '−');
        currentAnswer = (larger - smaller).toString();
        window.currentQuestionMeta = { subject: 'math', topic: 'subtraction', a: larger, b: smaller };
        window.currentQuestionId = (window.currentQuestionId || 0) + 1;
        renderMathVisual({ type: 'place', a: larger, b: smaller });
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'multiplication') {
        const n1 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const n2 = Math.floor(Math.random() * (Math.min(maxValue, multiplierCap) - 1 + 1)) + 1;
        q.innerHTML = renderVerticalProblem(n1, n2, '×');
        currentAnswer = (n1 * n2).toString();
        window.currentQuestionMeta = { subject: 'math', topic: 'multiplication', a: n1, b: n2 };
        window.currentQuestionId = (window.currentQuestionId || 0) + 1;
        renderMathVisual({ type: 'groups', a: n1, b: n2 });
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'division') {
        const divisor = Math.floor(Math.random() * (multiplierCap - 2 + 1)) + 2;
        const quotient = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const dividend = divisor * quotient;
        q.innerHTML = renderVerticalProblem(dividend, divisor, '÷');
        currentAnswer = quotient.toString();
        window.currentQuestionMeta = { subject: 'math', topic: 'division', a: dividend, b: divisor };
        window.currentQuestionId = (window.currentQuestionId || 0) + 1;
        renderMathVisual({ type: 'groups', a: dividend, b: divisor });
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'fractions') {
        const maxNum = Math.floor((difficulty === 'easy' ? 3 : 5) * (currentGrade / 4));
        const maxDenom = Math.floor((difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12) * (currentGrade / 4));
        const n1 = Math.floor(Math.random() * Math.max(3, maxNum)) + 1;
        const d1 = Math.floor(Math.random() * Math.max(4, maxDenom)) + 2;
        const n2 = Math.floor(Math.random() * Math.max(3, maxNum)) + 1;
        const d2 = d1;
        q.textContent = `${n1}/${d1} + ${n2}/${d2} = ? (as decimal)`;
        const result = (n1 + n2) / d1;
        currentAnswer = result.toFixed(2);
        window.currentQuestionMeta = { subject: 'math', topic: 'fractions', a: n1, b: n2, d: d1 };
        window.currentQuestionId = (window.currentQuestionId || 0) + 1;
        renderMathVisual({ type: 'fraction', a: n1, b: n2, d: d1 });
        a.innerHTML = '<input type="number" step="0.01" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'percentages') {
        const maxNum = Math.floor((difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 200) * (currentGrade / 5));
        const num = Math.floor(Math.random() * maxNum) + 10;
        const pcts = difficulty === 'easy' ? [10, 25, 50] : difficulty === 'medium' ? [10, 20, 25, 50, 75] : [12, 15, 18, 20, 25, 30, 35, 40, 60, 75, 80, 85];
        const pct = pcts[Math.floor(Math.random() * pcts.length)];
        q.textContent = `What is ${pct}% of ${num}?`;
        currentAnswer = (num * pct / 100).toString();
        window.currentQuestionMeta = { subject: 'math', topic: 'percentages', a: num, p: pct };
        window.currentQuestionId = (window.currentQuestionId || 0) + 1;
        renderMathVisual({ type: 'percent', a: num, p: pct });
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'algebra') {
        const maxVal = Math.floor((difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30) * (currentGrade / 7));
        
        if (currentGrade >= 9 && difficulty !== 'easy') {
            // Advanced algebra for high grades
            const a = Math.floor(Math.random() * 5) + 2;
            const x = Math.floor(Math.random() * Math.max(10, maxVal)) + 1;
            const b = Math.floor(Math.random() * Math.max(10, maxVal)) + 1;
            const c = a * x + b;
            q.textContent = `Solve for x: ${a}x + ${b} = ${c}`;
            currentAnswer = x.toString();
            window.currentQuestionMeta = { subject: 'math', topic: 'algebra', a, b, c };
            window.currentQuestionId = (window.currentQuestionId || 0) + 1;
            renderMathVisual({ type: 'balance', a, b, c });
        } else {
            const x = Math.floor(Math.random() * Math.max(10, maxVal)) + 1;
            const b = Math.floor(Math.random() * Math.max(10, maxVal)) + 1;
            const c = x + b;
            q.textContent = `Solve for x: x + ${b} = ${c}`;
            currentAnswer = x.toString();
            window.currentQuestionMeta = { subject: 'math', topic: 'algebra', a: 1, b, c };
            window.currentQuestionId = (window.currentQuestionId || 0) + 1;
            renderMathVisual({ type: 'balance', a: 1, b, c });
        }
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    }

    if (visual) {
        visual.style.display = currentSubject === 'math' ? 'block' : 'none';
    }
}

function renderVerticalProblem(top, bottom, op) {
    const topStr = String(top);
    const bottomStr = String(bottom);
    const width = Math.max(topStr.length, bottomStr.length) + 1;
    const pad = (str) => str.padStart(width);
    return `
        <div class="math-problem">
            <div>${pad(topStr)}</div>
            <div>${op}${pad(bottomStr).slice(1)}</div>
            <div class="line"></div>
            <div>?</div>
        </div>
    `;
}

function renderMathVisual(data) {
    const visual = document.getElementById('mathVisual');
    if (!visual) return;
    const title = '<div class="visual-title">Visual Tools</div>';
    const tool = window.mathTool || localStorage.getItem('mathTool') || 'baseTen';
    const selector = `
        <div class="tool-selector">
            <button class="tool-btn ${tool === 'baseTen' ? 'active' : ''}" onclick="setMathTool('baseTen')">Base‑Ten</button>
            <button class="tool-btn ${tool === 'numberLine' ? 'active' : ''}" onclick="setMathTool('numberLine')">Number Line</button>
            <button class="tool-btn ${tool === 'fractionBar' ? 'active' : ''}" onclick="setMathTool('fractionBar')">Fraction Bar</button>
            <button class="tool-btn ${tool === 'array' ? 'active' : ''}" onclick="setMathTool('array')">Array</button>
        </div>
    `;
    visual.innerHTML = `${title}${selector}<div id="mathToolArea"></div>`;
    renderMathTool(tool, data);
}

function setMathTool(tool) {
    window.mathTool = tool;
    localStorage.setItem('mathTool', tool);
    renderMathVisual(window.currentQuestionMeta || { type: 'dots', a: 5 });
}

function renderMathTool(tool, data) {
    const area = document.getElementById('mathToolArea');
    if (!area) return;
    const meta = window.currentQuestionMeta || {};
    if (tool === 'baseTen') {
        renderBaseTenTool(area, meta);
        return;
    }
    if (tool === 'numberLine') {
        renderNumberLine(area, meta);
        return;
    }
    if (tool === 'fractionBar') {
        renderFractionBar(area, meta);
        return;
    }
    if (tool === 'array') {
        renderArrayTool(area, meta);
        return;
    }
    area.innerHTML = '';
}

function renderBaseTenTool(area, meta) {
    const questionId = window.currentQuestionId || 0;
    if (!window.baseTenState || window.baseTenState.qid !== questionId) {
        const initA = meta.a || 0;
        const initB = meta.b || 0;
        window.baseTenState = {
            qid: questionId,
            A: splitTensOnes(initA),
            B: splitTensOnes(initB)
        };
    }
    const state = window.baseTenState;
    area.innerHTML = `
        <div class="base-ten">
            <div class="base-ten-controls">
                <div><strong>Group A</strong>
                    <button onclick="addBlock('A','ten')">+10</button>
                    <button onclick="addBlock('A','one')">+1</button>
                    <button onclick="removeBlock('A')">Undo</button>
                </div>
                <div><strong>Group B</strong>
                    <button onclick="addBlock('B','ten')">+10</button>
                    <button onclick="addBlock('B','one')">+1</button>
                    <button onclick="removeBlock('B')">Undo</button>
                </div>
            </div>
            <div class="base-ten-bins">
                <div class="base-bin" data-bin="A" ondrop="onDropBlock(event)" ondragover="allowDrop(event)">
                    <div class="bin-title">A</div>
                    ${renderBlocks(state.A, 'A')}
                </div>
                <div class="base-bin" data-bin="B" ondrop="onDropBlock(event)" ondragover="allowDrop(event)">
                    <div class="bin-title">B</div>
                    ${renderBlocks(state.B, 'B')}
                </div>
            </div>
        </div>
    `;
}

function splitTensOnes(num) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return { tens, ones, stack: [] };
}

function renderBlocks(binState, bin) {
    const tensBlocks = Array.from({ length: binState.tens }, () => `<div class="ten-block" draggable="true" data-type="ten" data-bin="${bin}" ondragstart="onDragBlock(event)"></div>`).join('');
    const oneBlocks = Array.from({ length: binState.ones }, () => `<div class="one-block" draggable="true" data-type="one" data-bin="${bin}" ondragstart="onDragBlock(event)"></div>`).join('');
    return `${tensBlocks}${oneBlocks}`;
}

function addBlock(bin, type) {
    const state = window.baseTenState;
    if (!state) return;
    state[bin][type === 'ten' ? 'tens' : 'ones'] += 1;
    state[bin].stack.push(type);
    renderMathTool('baseTen', window.currentQuestionMeta || {});
}

function removeBlock(bin) {
    const state = window.baseTenState;
    if (!state || state[bin].stack.length === 0) return;
    const type = state[bin].stack.pop();
    if (type === 'ten' && state[bin].tens > 0) state[bin].tens -= 1;
    if (type === 'one' && state[bin].ones > 0) state[bin].ones -= 1;
    renderMathTool('baseTen', window.currentQuestionMeta || {});
}

function allowDrop(ev) {
    ev.preventDefault();
}

function onDragBlock(ev) {
    const type = ev.target.getAttribute('data-type');
    const bin = ev.target.getAttribute('data-bin');
    ev.dataTransfer.setData('type', type);
    ev.dataTransfer.setData('bin', bin);
}

function onDropBlock(ev) {
    ev.preventDefault();
    const type = ev.dataTransfer.getData('type');
    const from = ev.dataTransfer.getData('bin');
    const to = ev.currentTarget.getAttribute('data-bin');
    if (!type || !from || !to || from === to) return;
    const state = window.baseTenState;
    if (!state) return;
    if (type === 'ten' && state[from].tens > 0) {
        state[from].tens -= 1;
        state[to].tens += 1;
    } else if (type === 'one' && state[from].ones > 0) {
        state[from].ones -= 1;
        state[to].ones += 1;
    }
    renderMathTool('baseTen', window.currentQuestionMeta || {});
}

function renderNumberLine(area, meta) {
    const a = meta.a || 0;
    const b = meta.b || 0;
    const max = Math.max(20, a + b + 2);
    const marks = Array.from({ length: max + 1 }, (_, i) => `<span class="nl-mark">${i}</span>`).join('');
    const hops = meta.topic === 'subtraction' ? -b : b;
    const end = meta.topic === 'subtraction' ? a - b : a + b;
    area.innerHTML = `
        <div class="number-line">
            <div class="nl-track">${marks}</div>
            <div class="nl-hops">Start at ${a}. Hop ${hops} to ${end}.</div>
        </div>
    `;
}

function renderFractionBar(area, meta) {
    const d = meta.d || 8;
    if (!window.fractionFill || window.fractionFill.qid !== (window.currentQuestionId || 0)) {
        window.fractionFill = { qid: window.currentQuestionId || 0, fills: Array.from({ length: d }, () => false) };
    }
    const fills = window.fractionFill.fills;
    const segments = fills.map((f, i) => `<div class="frac-seg ${f ? 'filled' : ''}" onclick="toggleFractionSegment(${i})"></div>`).join('');
    area.innerHTML = `
        <div class="fraction-bar">${segments}</div>
        <div class="fraction-note">Click to fill parts. ${fills.filter(Boolean).length}/${d} filled.</div>
    `;
}

function toggleFractionSegment(index) {
    if (!window.fractionFill) return;
    window.fractionFill.fills[index] = !window.fractionFill.fills[index];
    renderMathTool('fractionBar', window.currentQuestionMeta || {});
}

function renderArrayTool(area, meta) {
    const rows = Math.min(10, meta.a || 4);
    const cols = Math.min(10, meta.b || 4);
    area.innerHTML = `
        <div class="array-controls">
            <label>Rows <input type="range" min="1" max="10" value="${rows}" oninput="updateArray(this.value, null)"></label>
            <label>Cols <input type="range" min="1" max="10" value="${cols}" oninput="updateArray(null, this.value)"></label>
        </div>
        <div id="arrayGrid" class="array-grid" style="grid-template-columns: repeat(${cols}, 1fr);">
            ${Array.from({ length: rows * cols }, () => '<div class="array-cell"></div>').join('')}
        </div>
        <div class="fraction-note">${rows} × ${cols} = ${rows * cols}</div>
    `;
    window.arrayState = { rows, cols };
}

function updateArray(rows, cols) {
    const state = window.arrayState || { rows: 4, cols: 4 };
    if (rows !== null) state.rows = parseInt(rows, 10);
    if (cols !== null) state.cols = parseInt(cols, 10);
    const grid = document.getElementById('arrayGrid');
    if (!grid) return;
    grid.style.gridTemplateColumns = `repeat(${state.cols}, 1fr)`;
    grid.innerHTML = Array.from({ length: state.rows * state.cols }, () => '<div class="array-cell"></div>').join('');
    const note = grid.nextElementSibling;
    if (note) note.textContent = `${state.rows} × ${state.cols} = ${state.rows * state.cols}`;
    window.arrayState = state;
}
    if (data.type === 'dots') {
        const dots = Array.from({ length: data.a }, () => '<span class="dot"></span>').join('');
        visual.innerHTML = `${title}<div class="dot-row visual">${dots}</div>`;
        return;
    }
    if (data.type === 'place') {
        const parts = [1000, 100, 10, 1];
        const labels = ['Thousands', 'Hundreds', 'Tens', 'Ones'];
        const cols = parts.map((p, i) => {
            const countA = Math.floor((data.a % (p * 10)) / p);
            const countB = Math.floor((data.b % (p * 10)) / p);
            const blocks = Array.from({ length: countA + countB }, () => '<div class="pv-block"></div>').join('');
            return `<div class="pv-col"><div class="pv-label">${labels[i]}</div>${blocks}</div>`;
        }).join('');
        visual.innerHTML = `${title}<div class="place-value">${cols}</div>`;
        return;
    }
    if (data.type === 'groups') {
        const groups = Math.min(6, data.b);
        const per = Math.max(1, Math.floor(data.a / data.b));
        const groupHtml = Array.from({ length: groups }, () =>
            `<div class="dot-row visual">${Array.from({ length: per }, () => '<span class="dot blue"></span>').join('')}</div>`
        ).join('');
        visual.innerHTML = `${title}<div style="display:grid; gap:6px;">${groupHtml}</div>`;
        return;
    }
    if (data.type === 'fraction') {
        const sum = data.a + data.b;
        const percent = Math.round((sum / data.d) * 360);
        visual.innerHTML = `${title}<div class="fraction-pie" style="background: conic-gradient(#4dabf7 0deg, #4dabf7 ${percent}deg, #e5e7f2 ${percent}deg, #e5e7f2 360deg);"></div>`;
        return;
    }
    if (data.type === 'percent') {
        visual.innerHTML = `${title}<div class="percent-bar"><div class="percent-fill" style="width:${data.p}%;"></div></div>`;
        return;
    }
    if (data.type === 'balance') {
        const left = data.a === 1 ? 'x' : `${data.a}x`;
        visual.innerHTML = `${title}<div style="font-weight:700; color:#5f6c8a;">${left} + ${data.b} = ${data.c}</div>`;
        return;
    }
    visual.innerHTML = '';
}
