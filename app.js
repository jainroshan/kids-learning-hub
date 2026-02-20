let currentSubject = '';
let currentGrade = 2;
let currentTopic = '';
let difficulty = 'medium';
let totalQuestions = 10;
let questionCount = 0;
let score = 0;
let attempts = 0;
let currentAnswer = '';
let selectedOption = null;

const mathTopics = {
    counting: { minGrade: 0, maxGrade: 1, label: 'Counting' },
    addition: { minGrade: 1, maxGrade: 11, label: 'Addition' },
    subtraction: { minGrade: 1, maxGrade: 11, label: 'Subtraction' },
    multiplication: { minGrade: 3, maxGrade: 11, label: 'Multiplication' },
    division: { minGrade: 3, maxGrade: 11, label: 'Division' },
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

document.getElementById('questionCount').addEventListener('change', (e) => {
    totalQuestions = parseInt(e.target.value);
    // Update score display if in a quiz
    if (document.getElementById('questionArea').style.display === 'block') {
        document.getElementById('score').textContent = `Score: ${score}/${totalQuestions}`;
        document.getElementById('progress').textContent = `Question ${questionCount}/${totalQuestions}`;
    }
});

function startSubject(subject) {
    currentSubject = subject;
    score = 0;
    attempts = 0;
    
    document.getElementById('home').style.display = 'none';
    showTopicMenu(subject);
}

function showTopicMenu(subject) {
    // Hide all topic menus first
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    
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
    questionCount = 0;
    score = 0;
    attempts = 0;
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    document.getElementById('questionArea').style.display = 'block';
    document.getElementById('score').textContent = `Score: 0/${totalQuestions}`;
    updateProgress();
    generateQuestion();
}

function goHome() {
    document.getElementById('home').style.display = 'flex';
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    document.getElementById('questionArea').style.display = 'none';
    document.getElementById('feedback').innerHTML = '';
}

function changeSubject() {
    document.getElementById('questionArea').style.display = 'none';
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    document.getElementById('home').style.display = 'flex';
}

function changeTopic() {
    document.getElementById('questionArea').style.display = 'none';
    showTopicMenu(currentSubject);
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
    
    // Show scratch pad for math, hide for others
    if (currentSubject === 'math') {
        document.getElementById('scratchPad').style.display = 'block';
        clearScratchPad();
        generateMathQuestion();
    } else if (currentSubject === 'english') {
        document.getElementById('scratchPad').style.display = 'none';
        generateEnglishQuestion();
    } else {
        document.getElementById('scratchPad').style.display = 'none';
        generateGKQuestion();
    }
}

function updateProgress() {
    document.getElementById('progress').textContent = `Question ${questionCount}/${totalQuestions}`;
}

function showResults() {
    const q = document.getElementById('question');
    const a = document.getElementById('answerSection');
    const feedback = document.getElementById('feedback');
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    q.innerHTML = `🎉 Quiz Complete! 🎉`;
    a.innerHTML = '';
    feedback.innerHTML = `<div style="font-size:1.8em; margin:30px 0;">
        You got <strong>${score}</strong> out of <strong>${totalQuestions}</strong> correct!<br>
        Score: <strong>${percentage}%</strong>
    </div>
    <button class="next-btn" onclick="startTopic('${currentTopic}')">Try Again</button>
    <button class="change-topic-btn" onclick="changeTopic()">Different Topic</button>`;
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
    const feedback = document.getElementById('feedback');
    let userAnswer = selectedOption || document.getElementById('answer')?.value.trim();
    
    // Prevent multiple submissions
    if (attempts >= questionCount) {
        return;
    }
    
    attempts++;
    
    // Normalize answers for comparison (trim and lowercase)
    const normalizedUser = userAnswer ? userAnswer.toString().trim().toLowerCase() : '';
    const normalizedCorrect = currentAnswer.toString().trim().toLowerCase();
    
    let isCorrect = false;
    
    if (currentTopic === 'fractions' && !isNaN(userAnswer) && !isNaN(currentAnswer)) {
        if (Math.abs(parseFloat(userAnswer) - parseFloat(currentAnswer)) < 0.01) {
            isCorrect = true;
        }
    } else if (normalizedUser === normalizedCorrect) {
        isCorrect = true;
    }
    
    if (isCorrect) {
        score++;
        feedback.innerHTML = '✅ Correct! Great job!';
        feedback.className = 'feedback correct';
    } else {
        feedback.innerHTML = '❌ Not quite. Try the next question!';
        feedback.className = 'feedback incorrect';
    }
    
    // Disable all option buttons to prevent changing answer
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
        btn.style.opacity = '0.6';
    });
    
    // Disable input field if present
    const answerInput = document.getElementById('answer');
    if (answerInput) {
        answerInput.disabled = true;
    }
    
    // Disable check answer button
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'not-allowed';
    }
    
    document.getElementById('score').textContent = `Score: ${score}/${totalQuestions}`;
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

// Initialize scratch pad when page loads
window.addEventListener('load', initScratchPad);
