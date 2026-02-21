let currentSubject = '';
let currentGrade = 2;
let currentTopic = '';
let isQuickStart = false;
let difficulty = 'medium';
let totalQuestions = 10;
let questionCount = 0;
let score = 0;
let attempts = 0;
let currentAnswer = '';
let selectedOption = null;
let questionHistory = [];
let digitCount = 2; // Default to 2-digit numbers
let mistakesOnlyMode = false;
let mistakesQueue = [];
const digitControl = document.getElementById('digitControl');

const mathTopics = {
    counting: { minGrade: 0, maxGrade: 1, label: 'Counting' },
    addition: { minGrade: 1, maxGrade: 11, label: 'Addition', digits: [1, 2, 3, 4] },
    subtraction: { minGrade: 1, maxGrade: 11, label: 'Subtraction', digits: [1, 2, 3, 4] },
    multiplication: { minGrade: 3, maxGrade: 11, label: 'Multiplication', digits: [1, 2, 3] },
    division: { minGrade: 3, maxGrade: 11, label: 'Division', digits: [1, 2, 3] },
    fractions: { minGrade: 4, maxGrade: 11, label: 'Fractions' },
    percentages: { minGrade: 5, maxGrade: 11, label: 'Percentages' },
    algebra: { minGrade: 7, maxGrade: 11, label: 'Algebra' }
};

const englishTopics = {
    letters: { minGrade: 0, maxGrade: 1, label: 'Letters' },
    spelling: { minGrade: 1, maxGrade: 11, label: 'Spelling' },
    nouns: { minGrade: 2, maxGrade: 6, label: 'Nouns' },
    verbs: { minGrade: 2, maxGrade: 6, label: 'Verbs' },
    grammar: { minGrade: 3, maxGrade: 11, label: 'Grammar' },
    vocabulary: { minGrade: 3, maxGrade: 11, label: 'Vocabulary' },
    punctuation: { minGrade: 2, maxGrade: 8, label: 'Punctuation' },
    reading: { minGrade: 2, maxGrade: 11, label: 'Reading' }
};

const gkTopics = {
    animals: { minGrade: 0, maxGrade: 11, label: 'Animals' },
    geography: { minGrade: 2, maxGrade: 11, label: 'Geography' },
    science: { minGrade: 2, maxGrade: 11, label: 'Science' },
    history: { minGrade: 3, maxGrade: 11, label: 'History' },
    space: { minGrade: 2, maxGrade: 11, label: 'Space' },
    nature: { minGrade: 1, maxGrade: 11, label: 'Nature' },
    sports: { minGrade: 2, maxGrade: 11, label: 'Sports' },
    countries: { minGrade: 3, maxGrade: 11, label: 'Countries' }
};

document.getElementById('grade').addEventListener('change', (e) => {
    currentGrade = parseInt(e.target.value);
    
    // Refresh topic menu if currently viewing one
    if (document.getElementById('mathOptions').style.display === 'block') {
        showTopicMenu('math');
    } else if (document.getElementById('englishOptions').style.display === 'block') {
        showTopicMenu('english');
    } else if (document.getElementById('gkOptions').style.display === 'block') {
        showTopicMenu('gk');
    }
});

document.getElementById('difficulty').addEventListener('change', (e) => {
    difficulty = e.target.value;
});

document.getElementById('digitCount').addEventListener('change', (e) => {
    digitCount = parseInt(e.target.value);
});

document.getElementById('questionCount').addEventListener('change', (e) => {
    totalQuestions = parseInt(e.target.value);
    // Update score display if in a quiz
    if (document.getElementById('questionArea').style.display === 'block') {
        document.getElementById('score').textContent = `Score: ${score}/${totalQuestions}`;
        document.getElementById('progress').textContent = `Question ${questionCount}/${totalQuestions}`;
    }
});

function setDigitVisibility(isVisible) {
    if (!digitControl) return;
    digitControl.style.display = isVisible ? 'flex' : 'none';
    const digitSelect = document.getElementById('digitCount');
    if (digitSelect) {
        digitSelect.disabled = !isVisible;
    }
}

function startSubject(subject) {
    currentSubject = subject;
    isQuickStart = false;
    mistakesOnlyMode = false;
    mistakesQueue = [];
    score = 0;
    attempts = 0;
    
    document.getElementById('home').style.display = 'none';
    setDigitVisibility(false);
    showTopicMenu(subject);
}

function showTopicMenu(subject) {
    // Hide all topic menus first
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    document.getElementById('learnSection').style.display = 'none';
    document.getElementById('tutorialArea').style.display = 'none';
    setDigitVisibility(false);
    
    const topics = subject === 'math' ? mathTopics : subject === 'english' ? englishTopics : gkTopics;
    const container = document.getElementById(subject + 'Options');
    const grid = container.querySelector('.topic-grid');
    
    grid.innerHTML = '';
    
    for (const [key, topic] of Object.entries(topics)) {
        if (currentGrade >= topic.minGrade && currentGrade <= topic.maxGrade) {
            const btn = document.createElement('button');
            btn.className = 'topic-btn';
            btn.style.background = subject === 'math' ? getMathColor(key) : subject === 'english' ? getEnglishColor(key) : getGKColor(key);
            btn.textContent = topic.label;
            btn.onclick = () => startTopic(key);
            grid.appendChild(btn);
        }
    }
    
    container.style.display = 'block';
}

function getMathColor(topic) {
    const colors = {
        counting: '#ff6b6b', addition: '#ff8787', subtraction: '#ffa94d',
        multiplication: '#ffd43b', division: '#74c0fc', fractions: '#b197fc',
        percentages: '#da77f2', algebra: '#ff6b9d'
    };
    return colors[topic];
}

function getEnglishColor(topic) {
    const colors = {
        letters: '#4ecdc4', spelling: '#45b7d1', grammar: '#5f27cd',
        vocabulary: '#00d2d3', nouns: '#1dd1a1', verbs: '#10ac84',
        reading: '#54a0ff', punctuation: '#2e86de'
    };
    return colors[topic];
}

function getGKColor(topic) {
    const colors = {
        animals: '#f39c12', geography: '#3498db', science: '#9b59b6',
        history: '#e74c3c', space: '#34495e', nature: '#27ae60',
        sports: '#e67e22', countries: '#16a085'
    };
    return colors[topic];
}

function startTopic(topic) {
    currentTopic = topic;
    isQuickStart = false;
    mistakesOnlyMode = false;
    mistakesQueue = [];
    questionCount = 0;
    score = 0;
    attempts = 0;
    questionHistory = [];
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    document.getElementById('questionArea').style.display = 'block';
    document.getElementById('score').textContent = `Score: 0/${totalQuestions}`;
    if (currentSubject === 'math') {
        const hasDigits = !!mathTopics[currentTopic]?.digits;
        setDigitVisibility(hasDigits);
    } else {
        setDigitVisibility(false);
    }
    updateProgress();
    generateQuestion();
}

function goHome() {
    document.getElementById('home').style.display = 'grid';
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    document.getElementById('learnSection').style.display = 'none';
    document.getElementById('tutorialArea').style.display = 'none';
    document.getElementById('questionArea').style.display = 'none';
    document.getElementById('feedback').innerHTML = '';
    setDigitVisibility(false);
}

function changeSubject() {
    document.getElementById('questionArea').style.display = 'none';
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    document.getElementById('learnSection').style.display = 'none';
    document.getElementById('tutorialArea').style.display = 'none';
    document.getElementById('home').style.display = 'grid';
    setDigitVisibility(false);
}

function changeTopic() {
    document.getElementById('questionArea').style.display = 'none';
    showTopicMenu(currentSubject);
}

function startQuickStart() {
    currentSubject = 'mixed';
    currentTopic = 'mixed';
    isQuickStart = true;
    mistakesOnlyMode = false;
    mistakesQueue = [];
    questionCount = 0;
    score = 0;
    attempts = 0;
    questionHistory = [];
    document.getElementById('home').style.display = 'none';
    document.getElementById('questionArea').style.display = 'block';
    document.getElementById('score').textContent = `Score: 0/${totalQuestions}`;
    setDigitVisibility(false);
    updateProgress();
    generateQuestion();
}

function generateQuestion() {
    if (questionCount >= totalQuestions) {
        showResults();
        return;
    }
    
    questionCount++;
    document.getElementById('feedback').innerHTML = '';
    selectedOption = null;
    updateProgress();
    
    // Store current question for history (will be saved when moving to next)
    window.currentQuestionText = '';
    
    if (mistakesOnlyMode && mistakesQueue.length > 0) {
        const picked = mistakesQueue.shift();
        currentSubject = picked.subject;
        currentTopic = picked.topic;
    } else if (isQuickStart) {
        const picked = pickQuickStartTarget();
        currentSubject = picked.subject;
        currentTopic = picked.topic;
    }
    
    const topicBadge = document.getElementById('topicBadge');
    if (topicBadge) {
        if (isQuickStart || mistakesOnlyMode) {
            const subjectLabel = currentSubject === 'gk' ? 'GK' : currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1);
            const topicLabel = getTopicLabel(currentSubject, currentTopic);
            topicBadge.textContent = `${subjectLabel}: ${topicLabel}`;
            topicBadge.style.display = 'inline-flex';
        } else {
            topicBadge.style.display = 'none';
        }
    }

    // Show scratch pad for math, hide for others
    if (currentSubject === 'math') {
        document.getElementById('scratchPad').style.display = 'block';
        clearScratchPad();
        generateMathQuestion();
    } else if (currentSubject === 'english') {
        document.getElementById('scratchPad').style.display = 'none';
        generateEnglishQuestion();
    } else if (currentSubject === 'gk') {
        document.getElementById('scratchPad').style.display = 'none';
        generateGKQuestion();
    }
}

function saveCurrentAnswer() {
    // Get user's answer
    let userAnswer = selectedOption || document.getElementById('answer')?.value.trim();
    const questionText = document.getElementById('question').textContent || document.getElementById('question').innerText;
    
    console.log('Saving answer:', {userAnswer, currentAnswer, questionText});
    
    if (!userAnswer) {
        userAnswer = 'No answer';
    }
    
    // Normalize answers for comparison
    const normalizedUser = userAnswer ? userAnswer.toString().trim().toLowerCase() : '';
    const normalizedCorrect = currentAnswer ? currentAnswer.toString().trim().toLowerCase() : '';
    
    let isCorrect = false;
    
    if (currentTopic === 'fractions' && !isNaN(userAnswer) && !isNaN(currentAnswer)) {
        if (Math.abs(parseFloat(userAnswer) - parseFloat(currentAnswer)) < 0.01) {
            isCorrect = true;
        }
    } else if (normalizedUser === normalizedCorrect && normalizedCorrect !== '') {
        isCorrect = true;
    }
    
    console.log('Is correct?', isCorrect, 'User:', normalizedUser, 'Correct:', normalizedCorrect);
    
    if (isCorrect) {
        score++;
    }
    
    // Save to history
    questionHistory.push({
        question: questionText,
        userAnswer: userAnswer,
        correctAnswer: currentAnswer || 'N/A',
        isCorrect: isCorrect,
        subject: currentSubject,
        topic: currentTopic
    });
    
    console.log('Current score:', score, 'History length:', questionHistory.length);
}

function updateProgress() {
    document.getElementById('progress').textContent = `Question ${questionCount}/${totalQuestions}`;
}

function showResults() {
    const q = document.getElementById('question');
    const a = document.getElementById('answerSection');
    const feedback = document.getElementById('feedback');
    
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const mistakes = questionHistory.filter(item => !item.isCorrect);
    
    q.innerHTML = `🎉 Quiz Complete! 🎉`;
    
    // Build review HTML
    let reviewHTML = `<div style="font-size:1.5em; margin:20px 0;">
        You got <strong>${score}</strong> out of <strong>${totalQuestions}</strong> correct!<br>
        Score: <strong>${percentage}%</strong>
    </div>`;
    
    if (questionHistory.length > 0) {
        reviewHTML += `<div style="text-align:left; max-width:640px; margin:18px auto;">
            <h3 style="color:#4451d1; margin-bottom:10px;">Review Your Answers</h3>
            <div class="review-list">`;
        
        questionHistory.forEach((item, index) => {
            const icon = item.isCorrect ? '✅' : '❌';
            const color = item.isCorrect ? '#2f9e44' : '#e03131';
            reviewHTML += `
                <details class="review-card">
                    <summary>
                        <span>${icon} Question ${index + 1}</span>
                        <span style="color:${color}; font-weight:600;">${item.isCorrect ? 'Correct' : 'Needs work'}</span>
                    </summary>
                    <div class="review-meta">${item.question}</div>
                    <div class="review-meta">Your answer: <strong>${item.userAnswer}</strong></div>
                    ${!item.isCorrect ? `<div class="review-meta" style="color:${color};">Correct answer: <strong>${item.correctAnswer}</strong></div>` : ''}
                </details>`;
        });
        
        reviewHTML += `</div></div>`;
    }
    
    const primaryAction = isQuickStart
        ? `<button class="next-btn" onclick="startQuickStart()">Try Again</button>`
        : `<button class="next-btn" onclick="startTopic('${currentTopic}')">Try Again</button>`;
    const secondaryAction = isQuickStart
        ? `<button class="change-topic-btn" onclick="goHome()">Pick Subjects</button>`
        : `<button class="change-topic-btn" onclick="changeTopic()">Different Topic</button>`;

    const mistakesAction = mistakes.length > 0
        ? `<button class="change-subject-btn" onclick="startMistakesPractice()">Practice Mistakes (${mistakes.length})</button>`
        : '';

    reviewHTML += `
    ${primaryAction}
    ${secondaryAction}
    ${mistakesAction}`;
    
    a.innerHTML = reviewHTML;
    feedback.innerHTML = '';
    feedback.className = 'feedback';
}

function selectOption(option) {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
    selectedOption = option;
}

function checkAnswer() {
    // Save current answer and move to next question
    if (currentAnswer) {
        saveCurrentAnswer();
    }
    generateQuestion();
}

// Scratch pad functionality
let isDrawing = false;
let scratchCtx = null;

function initScratchPad() {
    const canvas = document.getElementById('scratchCanvas');
    scratchCtx = canvas.getContext('2d');
    scratchCtx.lineWidth = 2;
    scratchCtx.lineCap = 'round';
    scratchCtx.strokeStyle = '#333';
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = e.target.getBoundingClientRect();
    scratchCtx.beginPath();
    scratchCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = e.target.getBoundingClientRect();
    scratchCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    scratchCtx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    
    if (e.type === 'touchstart') {
        isDrawing = true;
        scratchCtx.beginPath();
        scratchCtx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    } else if (e.type === 'touchmove' && isDrawing) {
        scratchCtx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
        scratchCtx.stroke();
    }
}

function clearScratchPad() {
    if (scratchCtx) {
        const canvas = document.getElementById('scratchCanvas');
        scratchCtx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function toggleScratchPad() {
    const pad = document.getElementById('scratchPad');
    const btn = event.target;
    if (pad.style.display === 'none') {
        pad.style.display = 'block';
        btn.textContent = 'Hide';
    } else {
        pad.style.display = 'none';
        btn.textContent = 'Show Scratch Pad';
    }
}

function pickQuickStartTarget() {
    const topics = [];
    for (const [key, topic] of Object.entries(mathTopics)) {
        if (currentGrade >= topic.minGrade && currentGrade <= topic.maxGrade) {
            topics.push({ subject: 'math', topic: key, weight: 1.1 });
        }
    }
    for (const [key, topic] of Object.entries(englishTopics)) {
        if (currentGrade >= topic.minGrade && currentGrade <= topic.maxGrade) {
            topics.push({ subject: 'english', topic: key, weight: 1 });
        }
    }

    if (topics.length === 0) {
        return { subject: 'math', topic: 'addition' };
    }

    const totalWeight = topics.reduce((sum, t) => sum + t.weight, 0);
    let r = Math.random() * totalWeight;
    for (const t of topics) {
        r -= t.weight;
        if (r <= 0) return t;
    }
    return topics[0];
}

function startMistakesPractice() {
    const mistakes = questionHistory.filter(item => !item.isCorrect);
    if (mistakes.length === 0) {
        return;
    }
    mistakesOnlyMode = true;
    isQuickStart = false;
    mistakesQueue = mistakes.map(item => ({ subject: item.subject, topic: item.topic }));
    questionHistory = [];
    questionCount = 0;
    score = 0;
    document.getElementById('questionArea').style.display = 'block';
    document.getElementById('score').textContent = `Score: 0/${totalQuestions}`;
    setDigitVisibility(currentSubject === 'math' && !!mathTopics[currentTopic]?.digits);
    updateProgress();
    generateQuestion();
}

function getTopicLabel(subject, topic) {
    if (subject === 'math') {
        return mathTopics[topic]?.label || topic;
    }
    if (subject === 'english') {
        return englishTopics[topic]?.label || topic;
    }
    if (subject === 'gk') {
        return gkTopics[topic]?.label || topic;
    }
    return topic;
}

// Initialize scratch pad when page loads
window.addEventListener('load', initScratchPad);
setDigitVisibility(false);

function showLearnSection() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('learnSection').style.display = 'block';
    setDigitVisibility(false);
}

function backToLearn() {
    document.getElementById('tutorialArea').style.display = 'none';
    document.getElementById('learnSection').style.display = 'block';
}

function showLearnTutorial(operation) {
    document.getElementById('learnSection').style.display = 'none';
    document.getElementById('tutorialArea').style.display = 'block';
    
    const tutorials = {
        addition: `
            <h2 style="color:#667eea;">Addition with Carrying</h2>
            <div style="line-height:1.8; font-size:1.1em;">
                <h3>Example 1: Simple Addition (No Carrying)</h3>
                <pre style="background:#f8f9fa; padding:15px; border-radius:8px; font-size:1.2em;">
    23
  + 45
  ----
    68
                </pre>
                <p><strong>Steps:</strong></p>
                <ol>
                    <li>Add the ones place: 3 + 5 = 8</li>
                    <li>Add the tens place: 2 + 4 = 6</li>
                    <li>Answer: 68</li>
                </ol>
                
                <h3 style="margin-top:30px;">Example 2: Addition with Carrying</h3>
                <pre style="background:#f8f9fa; padding:15px; border-radius:8px; font-size:1.2em;">
     ¹
    47
  + 38
  ----
    85
                </pre>
                <p><strong>Steps:</strong></p>
                <ol>
                    <li>Add the ones place: 7 + 8 = 15</li>
                    <li>Write 5 in ones place, carry 1 to tens</li>
                    <li>Add the tens place: 1 + 4 + 3 = 8</li>
                    <li>Answer: 85</li>
                </ol>
                
                <h3 style="margin-top:30px;">Example 3: Multiple Carries</h3>
                <pre style="background:#f8f9fa; padding:15px; border-radius:8px; font-size:1.2em;">
    ¹ ¹
   567
 + 489
 -----
  1056
                </pre>
                <p><strong>Steps:</strong></p>
                <ol>
                    <li>Ones: 7 + 9 = 16 → Write 6, carry 1</li>
                    <li>Tens: 1 + 6 + 8 = 15 → Write 5, carry 1</li>
                    <li>Hundreds: 1 + 5 + 4 = 10 → Write 0, carry 1</li>
                    <li>Thousands: 1</li>
                    <li>Answer: 1056</li>
                </ol>
            </div>
        `,
        subtraction: `
            <h2 style="color:#667eea;">Subtraction with Borrowing</h2>
            <div style="line-height:1.8; font-size:1.1em;">
                <h3>Example 1: Simple Subtraction (No Borrowing)</h3>
                <pre style="background:#f8f9fa; padding:15px; border-radius:8px; font-size:1.2em;">
    68
  - 23
  ----
    45
                </pre>
                <p><strong>Steps:</strong></p>
                <ol>
                    <li>Subtract ones: 8 - 3 = 5</li>
                    <li>Subtract tens: 6 - 2 = 4</li>
                    <li>Answer: 45</li>
                </ol>
                
                <h3 style="margin-top:30px;">Example 2: Subtraction with Borrowing</h3>
                <pre style="background:#f8f9fa; padding:15px; border-radius:8px; font-size:1.2em;">
    ⁴¹₂
    52
  - 27
  ----
    25
                </pre>
                <p><strong>Steps:</strong></p>
                <ol>
                    <li>Ones: Can't do 2 - 7, so borrow from tens</li>
                    <li>5 tens becomes 4 tens, 2 ones becomes 12 ones</li>
                    <li>Now: 12 - 7 = 5</li>
                    <li>Tens: 4 - 2 = 2</li>
                    <li>Answer: 25</li>
                </ol>
                
                <h3 style="margin-top:30px;">Example 3: Multiple Borrows</h3>
                <pre style="background:#f8f9fa; padding:15px; border-radius:8px; font-size:1.2em;">
    ⁴⁹¹₁₃
    503
  - 247
  -----
    256
                </pre>
                <p><strong>Steps:</strong></p>
                <ol>
                    <li>Ones: Can't do 3 - 7, borrow → 13 - 7 = 6</li>
                    <li>Tens: Can't do -1 - 4, borrow → 9 - 4 = 5</li>
                    <li>Hundreds: 4 - 2 = 2</li>
                    <li>Answer: 256</li>
                </ol>
            </div>
        `,
        multiplication: `
            <h2 style="color:#667eea;">Multiplication</h2>
            <div style="line-height:1.8; font-size:1.1em;">
                <h3>Example 1: Single Digit Multiplication</h3>
                <pre style="background:#f8f9fa; padding:15px; border-radius:8px; font-size:1.2em;">
    23
  ×  4
  ----
    92
                </pre>
                <p><strong>Steps:</strong></p>
                <ol>
                    <li>Multiply ones: 3 × 4 = 12 → Write 2, carry 1</li>
                    <li>Multiply tens: 2 × 4 = 8, plus carry 1 = 9</li>
                    <li>Answer: 92</li>
                </ol>
                
                <h3 style="margin-top:30px;">Example 2: Two Digit Multiplication</h3>
                <pre style="background:#f8f9fa; padding:15px; border-radius:8px; font-size:1.2em;">
     23
   × 14
   ----
     92  (23 × 4)
   230  (23 × 10)
   ----
    322
                </pre>
                <p><strong>Steps:</strong></p>
                <ol>
                    <li>Multiply by ones digit (4): 23 × 4 = 92</li>
                    <li>Multiply by tens digit (1): 23 × 10 = 230</li>
                    <li>Add the results: 92 + 230 = 322</li>
                    <li>Answer: 322</li>
                </ol>
                
                <h3 style="margin-top:30px;">Example 3: Larger Numbers</h3>
                <pre style="background:#f8f9fa; padding:15px; border-radius:8px; font-size:1.2em;">
      45
    × 27
    ----
     315  (45 × 7)
    900   (45 × 20)
    ----
    1215
                </pre>
            </div>
        `,
        division: `
            <h2 style="color:#667eea;">Long Division</h2>
            <div style="line-height:1.8; font-size:1.1em;">
                <h3>Example 1: Simple Division</h3>
                <pre style="background:#f8f9fa; padding:15px; border-radius:8px; font-size:1.2em;">
      4
   ------
  3 | 12
     -12
     ---
       0
                </pre>
                <p><strong>Steps:</strong></p>
                <ol>
                    <li>How many 3s in 12? Answer: 4</li>
                    <li>4 × 3 = 12</li>
                    <li>12 - 12 = 0 (no remainder)</li>
                    <li>Answer: 4</li>
                </ol>
                
                <h3 style="margin-top:30px;">Example 2: Division with Remainder</h3>
                <pre style="background:#f8f9fa; padding:15px; border-radius:8px; font-size:1.2em;">
      7 R1
   -------
  3 | 22
     -21
     ---
       1
                </pre>
                <p><strong>Steps:</strong></p>
                <ol>
                    <li>How many 3s in 22? Answer: 7</li>
                    <li>7 × 3 = 21</li>
                    <li>22 - 21 = 1 (remainder)</li>
                    <li>Answer: 7 remainder 1</li>
                </ol>
                
                <h3 style="margin-top:30px;">Example 3: Two-Digit Division</h3>
                <pre style="background:#f8f9fa; padding:15px; border-radius:8px; font-size:1.2em;">
       23
   --------
  4 | 92
     -8↓
     ---
      12
     -12
     ---
       0
                </pre>
                <p><strong>Steps:</strong></p>
                <ol>
                    <li>How many 4s in 9? Answer: 2</li>
                    <li>2 × 4 = 8, subtract: 9 - 8 = 1</li>
                    <li>Bring down the 2 → 12</li>
                    <li>How many 4s in 12? Answer: 3</li>
                    <li>3 × 4 = 12, subtract: 12 - 12 = 0</li>
                    <li>Answer: 23</li>
                </ol>
            </div>
        `
    };
    
    document.getElementById('tutorialContent').innerHTML = tutorials[operation];
}
