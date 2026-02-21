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
        renderMathVisual({ type: 'dots', a: num });
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'addition') {
        const n1 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const n2 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        q.innerHTML = renderVerticalProblem(n1, n2, '+');
        currentAnswer = (n1 + n2).toString();
        window.currentQuestionMeta = { subject: 'math', topic: 'addition', a: n1, b: n2 };
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
        renderMathVisual({ type: 'place', a: larger, b: smaller });
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'multiplication') {
        const n1 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const n2 = Math.floor(Math.random() * (Math.min(maxValue, multiplierCap) - 1 + 1)) + 1;
        q.innerHTML = renderVerticalProblem(n1, n2, '×');
        currentAnswer = (n1 * n2).toString();
        window.currentQuestionMeta = { subject: 'math', topic: 'multiplication', a: n1, b: n2 };
        renderMathVisual({ type: 'groups', a: n1, b: n2 });
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'division') {
        const divisor = Math.floor(Math.random() * (multiplierCap - 2 + 1)) + 2;
        const quotient = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const dividend = divisor * quotient;
        q.innerHTML = renderVerticalProblem(dividend, divisor, '÷');
        currentAnswer = quotient.toString();
        window.currentQuestionMeta = { subject: 'math', topic: 'division', a: dividend, b: divisor };
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
            renderMathVisual({ type: 'balance', a, b, c });
        } else {
            const x = Math.floor(Math.random() * Math.max(10, maxVal)) + 1;
            const b = Math.floor(Math.random() * Math.max(10, maxVal)) + 1;
            const c = x + b;
            q.textContent = `Solve for x: x + ${b} = ${c}`;
            currentAnswer = x.toString();
            window.currentQuestionMeta = { subject: 'math', topic: 'algebra', a: 1, b, c };
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
    const title = '<div class="visual-title">Visual Aid</div>';
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
