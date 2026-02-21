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
let currentLearnChallenge = null;
let learnSpeechEnabled = true;
let learnSpeechRate = 1;
let currentLearnSteps = [];
const digitControl = document.getElementById('digitControl');
const learnResume = document.getElementById('learnResume');

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
    document.getElementById('tutorialArea').style.display = 'none';
    setDigitVisibility(false);
    renderLearnResume();
    updateLearnMasteryBadges();
}

function backToLearn() {
    document.getElementById('tutorialArea').style.display = 'none';
    document.getElementById('learnSection').style.display = 'block';
}

function showLearnTutorial(operation) {
    document.getElementById('learnSection').style.display = 'none';
    document.getElementById('tutorialArea').style.display = 'block';
    const content = buildLearnContent(operation);
    document.getElementById('tutorialTitle').textContent = content.title;
    document.getElementById('tutorialContent').innerHTML = content.html;
    document.getElementById('tutorialArea').dataset.operation = operation;
    localStorage.setItem('lastLearnTopic', operation);
    currentLearnSteps = content.steps;
    initLearnControls(operation);
    initLearnAudioControls();
    initLearnChallenge(operation);
    updateMasteryBadge(operation);
}

function buildLearnContent(operation) {
    const configs = {
        addition: {
            title: 'Addition',
            intro: 'Combine two groups to find the total.',
            controls: `
                <div class="learn-controls">
                    <label>Group A: <span id="addAVal">3</span></label>
                    <input id="addA" type="range" min="1" max="10" value="3">
                    <label>Group B: <span id="addBVal">4</span></label>
                    <input id="addB" type="range" min="1" max="10" value="4">
                </div>
            `,
            steps: [
                'Count dots in group A.',
                'Count dots in group B.',
                'Add them together to get the total.'
            ],
            viz: `<div id="vizBox" class="viz-box"></div>`
        },
        subtraction: {
            title: 'Subtraction',
            intro: 'Take away dots from a group to see what is left.',
            controls: `
                <div class="learn-controls">
                    <label>Start With: <span id="subAVal">9</span></label>
                    <input id="subA" type="range" min="2" max="12" value="9">
                    <label>Take Away: <span id="subBVal">4</span></label>
                    <input id="subB" type="range" min="1" max="10" value="4">
                </div>
            `,
            steps: [
                'Count the starting dots.',
                'Cross out the dots being taken away.',
                'Count the remaining dots.'
            ],
            viz: `<div id="vizBox" class="viz-box"></div>`
        },
        multiplication: {
            title: 'Multiplication',
            intro: 'Make equal rows to show repeated addition.',
            controls: `
                <div class="learn-controls">
                    <label>Rows: <span id="mulAVal">3</span></label>
                    <input id="mulA" type="range" min="1" max="6" value="3">
                    <label>Columns: <span id="mulBVal">4</span></label>
                    <input id="mulB" type="range" min="1" max="6" value="4">
                </div>
            `,
            steps: [
                'Make rows of equal dots.',
                'Count dots in one row.',
                'Multiply rows by dots per row.'
            ],
            viz: `<div id="vizBox" class="viz-box"></div>`
        },
        division: {
            title: 'Division',
            intro: 'Share dots equally across groups.',
            controls: `
                <div class="learn-controls">
                    <label>Total Dots: <span id="divAVal">12</span></label>
                    <input id="divA" type="range" min="4" max="20" value="12">
                    <label>Groups: <span id="divBVal">3</span></label>
                    <input id="divB" type="range" min="2" max="6" value="3">
                </div>
            `,
            steps: [
                'Split dots into equal groups.',
                'Count how many in each group.',
                'If dots remain, that is the remainder.'
            ],
            viz: `<div id="vizBox" class="viz-box"></div>`
        },
        fractions: {
            title: 'Fractions',
            intro: 'See parts of a whole using a pie chart.',
            controls: `
                <div class="learn-controls">
                    <label>Numerator: <span id="fracAVal">1</span></label>
                    <input id="fracA" type="range" min="1" max="7" value="1">
                    <label>Denominator: <span id="fracBVal">4</span></label>
                    <input id="fracB" type="range" min="2" max="8" value="4">
                </div>
            `,
            steps: [
                'Denominator = total parts.',
                'Numerator = shaded parts.',
                'Write it as numerator / denominator.'
            ],
            viz: `<div id="vizBox" class="viz-box"></div>`
        },
        percentages: {
            title: 'Percentages',
            intro: 'Percent means “out of 100.”',
            controls: `
                <div class="learn-controls">
                    <label>Percent: <span id="pctVal">40</span>%</label>
                    <input id="pct" type="range" min="5" max="100" value="40">
                </div>
            `,
            steps: [
                '100% is the full bar.',
                'Shade the percent you want.',
                'Read the amount as a part of 100.'
            ],
            viz: `<div id="vizBox" class="viz-box"></div>`
        }
    };

    const config = configs[operation];
    const steps = config.steps.map(step => `<li>${step}</li>`).join('');
    return {
        title: config.title,
        steps: config.steps,
        html: `
            <div class="learn-grid">
                <div class="learn-panel">
                    <h3>${config.title} Explorer</h3>
                    <p>${config.intro}</p>
                    ${config.controls}
                    <div class="learn-actions">
                        <button onclick="speakLearn('${operation}')">Read Aloud</button>
                        <button class="secondary" onclick="speakLearnSteps()">Read Steps</button>
                        <button class="ghost" onclick="stopLearnSpeech()">Stop</button>
                        <button id="learnSpeakToggle" class="toggle" onclick="toggleLearnSpeech()">Audio On</button>
                        <select id="learnSpeakRate" aria-label="Narration speed">
                            <option value="0.8">Slow</option>
                            <option value="1" selected>Normal</option>
                            <option value="1.2">Fast</option>
                        </select>
                    </div>
                </div>
                <div class="learn-panel">
                    <h3>Visualize It</h3>
                    ${config.viz}
                </div>
            </div>
            <div class="learn-panel">
                <h3>Steps</h3>
                <ol class="learn-steps">${steps}</ol>
            </div>
            <div class="learn-panel">
                <h3>Challenge</h3>
                <div id="challengeQuestion"></div>
                <div class="challenge-box">
                    <div class="challenge-progress">
                        <div class="progress-bar"><div id="challengeProgressFill" class="progress-fill"></div></div>
                        <div id="challengeProgressText"></div>
                    </div>
                    <div class="challenge-row">
                        <input id="challengeAnswer" type="text" placeholder="Your answer">
                        <button onclick="checkLearnChallenge()">Check</button>
                        <button class="secondary" onclick="newLearnChallenge()">New</button>
                        <button class="secondary" onclick="resetChallengeProgress()">Reset Progress</button>
                    </div>
                    <div id="challengeFeedback" class="challenge-feedback"></div>
                </div>
            </div>
        `
    };
}

function initLearnControls(operation) {
    const saved = loadLearnState(operation);
    if (operation === 'addition') {
        const a = document.getElementById('addA');
        const b = document.getElementById('addB');
        const update = () => {
            document.getElementById('addAVal').textContent = a.value;
            document.getElementById('addBVal').textContent = b.value;
            saveLearnState(operation, { a: a.value, b: b.value });
            renderAddition(parseInt(a.value, 10), parseInt(b.value, 10));
        };
        if (saved) {
            a.value = saved.a ?? a.value;
            b.value = saved.b ?? b.value;
        }
        a.addEventListener('input', update);
        b.addEventListener('input', update);
        update();
    } else if (operation === 'subtraction') {
        const a = document.getElementById('subA');
        const b = document.getElementById('subB');
        const update = () => {
            let start = parseInt(a.value, 10);
            let take = parseInt(b.value, 10);
            if (take >= start) {
                take = start - 1;
                b.value = take;
            }
            document.getElementById('subAVal').textContent = start;
            document.getElementById('subBVal').textContent = take;
            saveLearnState(operation, { a: start, b: take });
            renderSubtraction(start, take);
        };
        if (saved) {
            a.value = saved.a ?? a.value;
            b.value = saved.b ?? b.value;
        }
        a.addEventListener('input', update);
        b.addEventListener('input', update);
        update();
    } else if (operation === 'multiplication') {
        const a = document.getElementById('mulA');
        const b = document.getElementById('mulB');
        const update = () => {
            document.getElementById('mulAVal').textContent = a.value;
            document.getElementById('mulBVal').textContent = b.value;
            saveLearnState(operation, { a: a.value, b: b.value });
            renderMultiplication(parseInt(a.value, 10), parseInt(b.value, 10));
        };
        if (saved) {
            a.value = saved.a ?? a.value;
            b.value = saved.b ?? b.value;
        }
        a.addEventListener('input', update);
        b.addEventListener('input', update);
        update();
    } else if (operation === 'division') {
        const a = document.getElementById('divA');
        const b = document.getElementById('divB');
        const update = () => {
            document.getElementById('divAVal').textContent = a.value;
            document.getElementById('divBVal').textContent = b.value;
            saveLearnState(operation, { a: a.value, b: b.value });
            renderDivision(parseInt(a.value, 10), parseInt(b.value, 10));
        };
        if (saved) {
            a.value = saved.a ?? a.value;
            b.value = saved.b ?? b.value;
        }
        a.addEventListener('input', update);
        b.addEventListener('input', update);
        update();
    } else if (operation === 'fractions') {
        const a = document.getElementById('fracA');
        const b = document.getElementById('fracB');
        const update = () => {
            let numerator = parseInt(a.value, 10);
            let denominator = parseInt(b.value, 10);
            if (numerator >= denominator) {
                numerator = denominator - 1;
                a.value = numerator;
            }
            document.getElementById('fracAVal').textContent = numerator;
            document.getElementById('fracBVal').textContent = denominator;
            saveLearnState(operation, { a: numerator, b: denominator });
            renderFractions(numerator, denominator);
        };
        if (saved) {
            a.value = saved.a ?? a.value;
            b.value = saved.b ?? b.value;
        }
        a.addEventListener('input', update);
        b.addEventListener('input', update);
        update();
    } else if (operation === 'percentages') {
        const p = document.getElementById('pct');
        const update = () => {
            document.getElementById('pctVal').textContent = p.value;
            saveLearnState(operation, { p: p.value });
            renderPercentages(parseInt(p.value, 10));
        };
        if (saved) {
            p.value = saved.p ?? p.value;
        }
        p.addEventListener('input', update);
        update();
    }
}

function initLearnAudioControls() {
    const toggle = document.getElementById('learnSpeakToggle');
    const rate = document.getElementById('learnSpeakRate');
    const savedEnabled = localStorage.getItem('learnSpeechEnabled');
    const savedRate = localStorage.getItem('learnSpeechRate');
    if (savedEnabled !== null) {
        learnSpeechEnabled = savedEnabled === 'true';
    }
    if (savedRate) {
        learnSpeechRate = parseFloat(savedRate);
    }
    if (toggle) {
        toggle.textContent = learnSpeechEnabled ? 'Audio On' : 'Audio Off';
    }
    if (rate) {
        rate.value = String(learnSpeechRate);
        rate.addEventListener('change', () => {
            learnSpeechRate = parseFloat(rate.value);
            localStorage.setItem('learnSpeechRate', String(learnSpeechRate));
        });
    }
}

function toggleLearnSpeech() {
    learnSpeechEnabled = !learnSpeechEnabled;
    localStorage.setItem('learnSpeechEnabled', String(learnSpeechEnabled));
    const toggle = document.getElementById('learnSpeakToggle');
    if (toggle) {
        toggle.textContent = learnSpeechEnabled ? 'Audio On' : 'Audio Off';
    }
}

function saveLearnState(operation, values) {
    localStorage.setItem(`learnState:${operation}`, JSON.stringify(values));
}

function loadLearnState(operation) {
    const raw = localStorage.getItem(`learnState:${operation}`);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function renderLearnResume() {
    if (!learnResume) return;
    const last = localStorage.getItem('lastLearnTopic');
    if (!last) {
        learnResume.style.display = 'none';
        learnResume.innerHTML = '';
        return;
    }
    const label = getTopicLabel('math', last);
    learnResume.style.display = 'flex';
    learnResume.innerHTML = `<button onclick="showLearnTutorial('${last}')">Continue: ${label}</button>`;
}

function speakLearn(operation) {
    if (!('speechSynthesis' in window)) {
        alert('Sorry, your browser does not support speech.');
        return;
    }
    if (!learnSpeechEnabled) return;
    const content = buildLearnContent(operation);
    const temp = document.createElement('div');
    temp.innerHTML = content.html;
    const steps = Array.from(temp.querySelectorAll('.learn-steps li')).map(li => li.textContent);
    const text = `${content.title}. ${temp.querySelector('p')?.textContent || ''} Steps: ${steps.join('. ')}.`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = learnSpeechRate;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

function speakLearnSteps() {
    if (!('speechSynthesis' in window)) return;
    if (!learnSpeechEnabled) return;
    if (!currentLearnSteps || currentLearnSteps.length === 0) return;
    speechSynthesis.cancel();
    let index = 0;
    const speakNext = () => {
        if (index >= currentLearnSteps.length) return;
        const utter = new SpeechSynthesisUtterance(currentLearnSteps[index]);
        utter.rate = learnSpeechRate;
        utter.onend = () => {
            index += 1;
            speakNext();
        };
        speechSynthesis.speak(utter);
    };
    speakNext();
}

function stopLearnSpeech() {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
}

function initLearnChallenge(operation) {
    newLearnChallenge(operation);
    updateChallengeProgress(operation);
}

function newLearnChallenge(operationOverride) {
    const operation = operationOverride || document.getElementById('tutorialArea').dataset.operation;
    const challenge = buildChallenge(operation);
    currentLearnChallenge = challenge;
    const q = document.getElementById('challengeQuestion');
    const input = document.getElementById('challengeAnswer');
    const feedback = document.getElementById('challengeFeedback');
    if (q && input && feedback) {
        q.textContent = challenge.question;
        input.value = '';
        input.type = challenge.type || 'text';
        feedback.textContent = '';
        feedback.className = 'challenge-feedback';
    }
}

function checkLearnChallenge() {
    if (!currentLearnChallenge) return;
    const input = document.getElementById('challengeAnswer');
    const feedback = document.getElementById('challengeFeedback');
    if (!input || !feedback) return;
    const user = input.value.trim();
    const correct = currentLearnChallenge.answer;
    let isCorrect = false;
    if (typeof correct === 'number') {
        const num = parseFloat(user);
        isCorrect = !isNaN(num) && Math.abs(num - correct) < 0.01;
    } else {
        isCorrect = user.toLowerCase() === String(correct).toLowerCase();
    }
    feedback.textContent = isCorrect ? 'Great job! 🎉' : `Try again. Correct answer: ${correct}`;
    feedback.style.color = isCorrect ? '#2f9e44' : '#e03131';
    if (isCorrect) {
        incrementChallengeProgress();
        updateChallengeProgress();
        updateMasteryBadge();
        updateLearnMasteryBadges();
    }
}

function buildChallenge(operation) {
    const grade = currentGrade || 2;
    const scale = Math.min(1.8, Math.max(0.8, 0.8 + grade * 0.1));
    const maxSmall = Math.floor(10 * scale);
    const maxMid = Math.floor(20 * scale);
    const maxLarge = Math.floor(50 * scale);
    if (operation === 'addition') {
        const a = randInt(1, maxSmall);
        const b = randInt(1, maxSmall);
        return { question: `What is ${a} + ${b}?`, answer: a + b, type: 'number' };
    }
    if (operation === 'subtraction') {
        const a = randInt(Math.max(5, Math.floor(maxSmall / 2)), maxMid);
        const b = randInt(1, Math.max(2, Math.floor(a / 2)));
        return { question: `What is ${a} - ${b}?`, answer: a - b, type: 'number' };
    }
    if (operation === 'multiplication') {
        const a = randInt(2, Math.max(4, Math.floor(maxSmall / 2)));
        const b = randInt(2, Math.max(4, Math.floor(maxSmall / 2)));
        return { question: `What is ${a} × ${b}?`, answer: a * b, type: 'number' };
    }
    if (operation === 'division') {
        const b = randInt(2, Math.max(4, Math.floor(maxSmall / 2)));
        const a = b * randInt(2, Math.max(5, Math.floor(maxSmall / 2)));
        return { question: `What is ${a} ÷ ${b}?`, answer: a / b, type: 'number' };
    }
    if (operation === 'fractions') {
        const denom = randInt(2, Math.max(4, Math.floor(maxSmall / 2)));
        const numer = randInt(1, denom - 1);
        const whole = randInt(2, Math.max(6, Math.floor(maxSmall / 2)));
        return { question: `What is ${numer}/${denom} of ${whole * denom}?`, answer: numer * whole, type: 'number' };
    }
    if (operation === 'percentages') {
        const pct = randInt(10, 90);
        const base = randInt(5, Math.max(10, Math.floor(maxLarge / 10))) * 10;
        return { question: `What is ${pct}% of ${base}?`, answer: (pct / 100) * base, type: 'number' };
    }
    return { question: 'What is 2 + 2?', answer: 4, type: 'number' };
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function incrementChallengeProgress() {
    const operation = document.getElementById('tutorialArea')?.dataset.operation;
    if (!operation) return;
    const key = `learnChallengeProgress:${operation}`;
    const current = loadChallengeProgress(operation);
    const updated = {
        correct: current.correct + 1,
        goal: current.goal
    };
    localStorage.setItem(key, JSON.stringify(updated));
}

function loadChallengeProgress(operation) {
    const key = `learnChallengeProgress:${operation}`;
    const raw = localStorage.getItem(key);
    if (!raw) return { correct: 0, goal: 5 };
    try {
        const parsed = JSON.parse(raw);
        return { correct: parsed.correct || 0, goal: parsed.goal || 5 };
    } catch {
        return { correct: 0, goal: 5 };
    }
}

function updateChallengeProgress(operationOverride) {
    const operation = operationOverride || document.getElementById('tutorialArea')?.dataset.operation;
    if (!operation) return;
    const progress = loadChallengeProgress(operation);
    const fill = document.getElementById('challengeProgressFill');
    const text = document.getElementById('challengeProgressText');
    const pct = Math.min(100, Math.round((progress.correct / progress.goal) * 100));
    if (fill) fill.style.width = `${pct}%`;
    if (text) text.textContent = `Completed: ${progress.correct}/${progress.goal}`;
}

function resetChallengeProgress() {
    const operation = document.getElementById('tutorialArea')?.dataset.operation;
    if (!operation) return;
    localStorage.setItem(`learnChallengeProgress:${operation}`, JSON.stringify({ correct: 0, goal: 5 }));
    updateChallengeProgress(operation);
    updateMasteryBadge(operation);
    updateLearnMasteryBadges();
}

function isTopicMastered(operation) {
    const progress = loadChallengeProgress(operation);
    return progress.correct >= progress.goal;
}

function updateMasteryBadge(operationOverride) {
    const operation = operationOverride || document.getElementById('tutorialArea')?.dataset.operation;
    if (!operation) return;
    const badge = document.getElementById('masteryBadge');
    if (!badge) return;
    if (isTopicMastered(operation)) {
        badge.style.display = 'inline-flex';
    } else {
        badge.style.display = 'none';
    }
}

function updateLearnMasteryBadges() {
    const buttons = document.querySelectorAll('#learnSection .topic-btn[data-op]');
    buttons.forEach(btn => {
        const op = btn.getAttribute('data-op');
        if (!op) return;
        if (isTopicMastered(op)) {
            btn.classList.add('mastered');
        } else {
            btn.classList.remove('mastered');
        }
    });
}

function renderAddition(a, b) {
    const box = document.getElementById('vizBox');
    const dots = [];
    for (let i = 0; i < a; i++) dots.push('<span class="dot"></span>');
    for (let i = 0; i < b; i++) dots.push('<span class="dot blue"></span>');
    box.innerHTML = `
        <div class="dot-row">${dots.join('')}</div>
        <div style="margin-top:10px; font-weight:600;">${a} + ${b} = ${a + b}</div>
    `;
}

function renderSubtraction(start, take) {
    const box = document.getElementById('vizBox');
    const dots = [];
    for (let i = 0; i < start; i++) {
        const cls = i < take ? 'dot' : 'dot green';
        dots.push(`<span class="${cls}" style="${i < take ? 'opacity:0.3' : ''}"></span>`);
    }
    box.innerHTML = `
        <div class="dot-row">${dots.join('')}</div>
        <div style="margin-top:10px; font-weight:600;">${start} - ${take} = ${start - take}</div>
    `;
}

function renderMultiplication(rows, cols) {
    const box = document.getElementById('vizBox');
    const grid = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) grid.push('<span class="grid-dot"></span>');
    }
    box.innerHTML = `
        <div class="grid-box" style="grid-template-columns: repeat(${cols}, 1fr);">${grid.join('')}</div>
        <div style="margin-top:10px; font-weight:600;">${rows} × ${cols} = ${rows * cols}</div>
    `;
}

function renderDivision(total, groups) {
    const box = document.getElementById('vizBox');
    const perGroup = Math.floor(total / groups);
    const remainder = total % groups;
    const groupHTML = [];
    for (let g = 0; g < groups; g++) {
        const dots = [];
        for (let i = 0; i < perGroup; i++) dots.push('<span class="dot blue"></span>');
        groupHTML.push(`<div class="dot-row">${dots.join('')}</div>`);
    }
    const remDots = [];
    for (let i = 0; i < remainder; i++) remDots.push('<span class="dot"></span>');
    box.innerHTML = `
        <div style="display:grid; gap:6px;">${groupHTML.join('')}</div>
        <div style="margin-top:8px;" class="dot-row">${remDots.join('')}</div>
        <div style="margin-top:10px; font-weight:600;">${total} ÷ ${groups} = ${perGroup}${remainder ? ` R${remainder}` : ''}</div>
    `;
}

function renderFractions(numerator, denominator) {
    const box = document.getElementById('vizBox');
    const percent = Math.round((numerator / denominator) * 360);
    box.innerHTML = `
        <div class="fraction-pie" style="background: conic-gradient(#4dabf7 0deg, #4dabf7 ${percent}deg, #e5e7f2 ${percent}deg, #e5e7f2 360deg);"></div>
        <div style="margin-top:10px; font-weight:600;">${numerator}/${denominator}</div>
    `;
}

function renderPercentages(value) {
    const box = document.getElementById('vizBox');
    box.innerHTML = `
        <div class="percent-bar"><div class="percent-fill" style="width:${value}%;"></div></div>
        <div style="margin-top:10px; font-weight:600;">${value}%</div>
    `;
}
