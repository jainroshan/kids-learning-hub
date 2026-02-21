function generateMathQuestion() {
    const q = document.getElementById('question');
    const a = document.getElementById('answerSection');
    
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
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'addition') {
        const n1 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const n2 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        q.textContent = `${n1} + ${n2} = ?`;
        currentAnswer = (n1 + n2).toString();
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'subtraction') {
        const n1 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const n2 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const larger = Math.max(n1, n2);
        const smaller = Math.min(n1, n2);
        q.textContent = `${larger} - ${smaller} = ?`;
        currentAnswer = (larger - smaller).toString();
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'multiplication') {
        const n1 = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const n2 = Math.floor(Math.random() * (Math.min(maxValue, multiplierCap) - 1 + 1)) + 1;
        q.textContent = `${n1} × ${n2} = ?`;
        currentAnswer = (n1 * n2).toString();
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'division') {
        const divisor = Math.floor(Math.random() * (multiplierCap - 2 + 1)) + 2;
        const quotient = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const dividend = divisor * quotient;
        q.textContent = `${dividend} ÷ ${divisor} = ?`;
        currentAnswer = quotient.toString();
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
        a.innerHTML = '<input type="number" step="0.01" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    } else if (currentTopic === 'percentages') {
        const maxNum = Math.floor((difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 200) * (currentGrade / 5));
        const num = Math.floor(Math.random() * maxNum) + 10;
        const pcts = difficulty === 'easy' ? [10, 25, 50] : difficulty === 'medium' ? [10, 20, 25, 50, 75] : [12, 15, 18, 20, 25, 30, 35, 40, 60, 75, 80, 85];
        const pct = pcts[Math.floor(Math.random() * pcts.length)];
        q.textContent = `What is ${pct}% of ${num}?`;
        currentAnswer = (num * pct / 100).toString();
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
        } else {
            const x = Math.floor(Math.random() * Math.max(10, maxVal)) + 1;
            const b = Math.floor(Math.random() * Math.max(10, maxVal)) + 1;
            const c = x + b;
            q.textContent = `Solve for x: x + ${b} = ${c}`;
            currentAnswer = x.toString();
        }
        a.innerHTML = '<input type="number" class="answer-input" id="answer"><br><button class="next-btn" onclick="checkAnswer()">Next Question</button>';
    }
}
