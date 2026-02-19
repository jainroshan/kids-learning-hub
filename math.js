function generateMathQuestion() {
    const q = document.getElementById('question');
    const a = document.getElementById('answerSection');
    
    const ranges = {
        easy: { max: 20, mult: 10 },
        medium: { max: 50, mult: 12 },
        hard: { max: 100, mult: 15 }
    };
    const range = ranges[difficulty];
    
    if (currentTopic === 'counting') {
        const num = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15)) + 1;
        q.innerHTML = `Count the stars: ${'⭐'.repeat(num)}`;
        currentAnswer = num.toString();
        a.innerHTML = '<input type="number" class="answer-input" id="answer" onkeypress="if(event.key===\'Enter\')checkAnswer()"><br><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'addition') {
        const n1 = Math.floor(Math.random() * range.max) + 1;
        const n2 = Math.floor(Math.random() * range.max) + 1;
        q.textContent = `${n1} + ${n2} = ?`;
        currentAnswer = (n1 + n2).toString();
        a.innerHTML = '<input type="number" class="answer-input" id="answer" onkeypress="if(event.key===\'Enter\')checkAnswer()"><br><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'subtraction') {
        const n1 = Math.floor(Math.random() * range.max) + 1;
        const n2 = Math.floor(Math.random() * range.max) + 1;
        const larger = Math.max(n1, n2);
        const smaller = Math.min(n1, n2);
        q.textContent = `${larger} - ${smaller} = ?`;
        currentAnswer = (larger - smaller).toString();
        a.innerHTML = '<input type="number" class="answer-input" id="answer" onkeypress="if(event.key===\'Enter\')checkAnswer()"><br><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'multiplication') {
        const n1 = Math.floor(Math.random() * range.mult) + 1;
        const n2 = Math.floor(Math.random() * range.mult) + 1;
        q.textContent = `${n1} × ${n2} = ?`;
        currentAnswer = (n1 * n2).toString();
        a.innerHTML = '<input type="number" class="answer-input" id="answer" onkeypress="if(event.key===\'Enter\')checkAnswer()"><br><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'division') {
        const n1 = Math.floor(Math.random() * range.mult) + 1;
        const n2 = Math.floor(Math.random() * range.mult) + 1;
        const product = n1 * n2;
        q.textContent = `${product} ÷ ${n1} = ?`;
        currentAnswer = n2.toString();
        a.innerHTML = '<input type="number" class="answer-input" id="answer" onkeypress="if(event.key===\'Enter\')checkAnswer()"><br><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'fractions') {
        const n1 = Math.floor(Math.random() * (difficulty === 'easy' ? 3 : 5)) + 1;
        const d1 = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12)) + 2;
        const n2 = Math.floor(Math.random() * (difficulty === 'easy' ? 3 : 5)) + 1;
        const d2 = d1;
        q.textContent = `${n1}/${d1} + ${n2}/${d2} = ? (as decimal)`;
        const result = (n1 + n2) / d1;
        currentAnswer = result.toFixed(2);
        a.innerHTML = '<input type="number" step="0.01" class="answer-input" id="answer" onkeypress="if(event.key===\'Enter\')checkAnswer()"><br><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'percentages') {
        const num = Math.floor(Math.random() * (difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 200)) + 10;
        const pcts = difficulty === 'easy' ? [10, 25, 50] : difficulty === 'medium' ? [10, 20, 25, 50, 75] : [15, 20, 25, 30, 40, 60, 75, 80];
        const pct = pcts[Math.floor(Math.random() * pcts.length)];
        q.textContent = `What is ${pct}% of ${num}?`;
        currentAnswer = (num * pct / 100).toString();
        a.innerHTML = '<input type="number" class="answer-input" id="answer" onkeypress="if(event.key===\'Enter\')checkAnswer()"><br><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    } else if (currentTopic === 'algebra') {
        const x = Math.floor(Math.random() * (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30)) + 1;
        const b = Math.floor(Math.random() * (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30)) + 1;
        const c = x + b;
        q.textContent = `Solve for x: x + ${b} = ${c}`;
        currentAnswer = x.toString();
        a.innerHTML = '<input type="number" class="answer-input" id="answer" onkeypress="if(event.key===\'Enter\')checkAnswer()"><br><button class="submit-btn" onclick="checkAnswer()">Check Answer</button><button class="next-btn" onclick="generateQuestion()">Next Question</button>';
    }
}
