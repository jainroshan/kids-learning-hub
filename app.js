let currentSubject = '';
let currentGrade = 3;
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
let streak = 0;
let maxStreak = 0;
let quizMode = 'practice';
let timerInterval = null;
let timeLeft = 0;
let feedbackVoiceEnabled = true;
let currentStepList = [];
let currentStepIndex = 0;
let visualAidVisible = true;
let scratchVisible = true;
const digitControl = document.getElementById('digitControl');
const learnResume = document.getElementById('learnResume');
const badgeShelf = document.getElementById('badgeShelf');

function getGradeDigitCap(grade) {
    if (grade <= 1) return 1;
    if (grade <= 3) return 2;
    if (grade <= 5) return 3;
    return 4;
}

function getRecommendedDifficulty(grade) {
    if (grade <= 1) return 'easy';
    if (grade <= 6) return 'medium';
    return 'hard';
}

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

function getEligibleTopics(subject) {
    const topics = subject === 'math' ? mathTopics : subject === 'english' ? englishTopics : gkTopics;
    const entries = Object.entries(topics).filter(([, topic]) => currentGrade >= topic.minGrade && currentGrade <= topic.maxGrade);

    if (subject === 'english') {
        if (currentGrade <= 1) return entries.filter(([k]) => ['letters', 'spelling'].includes(k));
        if (currentGrade <= 3) return entries.filter(([k]) => ['letters', 'spelling', 'nouns', 'verbs', 'reading'].includes(k));
        if (currentGrade <= 5) return entries.filter(([k]) => ['spelling', 'nouns', 'verbs', 'reading', 'vocabulary', 'punctuation'].includes(k));
        return entries.filter(([k]) => ['grammar', 'vocabulary', 'reading', 'punctuation'].includes(k));
    }

    if (subject === 'gk') {
        if (currentGrade <= 1) return entries.filter(([k]) => ['animals', 'nature'].includes(k));
        if (currentGrade <= 3) return entries.filter(([k]) => ['animals', 'nature', 'science', 'geography'].includes(k));
        if (currentGrade <= 5) return entries.filter(([k]) => ['science', 'geography', 'history', 'space'].includes(k));
        return entries.filter(([k]) => ['history', 'space', 'countries', 'sports', 'science'].includes(k));
    }

    if (subject === 'math') {
        if (currentGrade <= 1) {
            return entries.filter(([k]) => ['counting', 'addition'].includes(k));
        }
        return entries;
    }

    return entries;
}

document.getElementById('grade').addEventListener('change', (e) => {
    currentGrade = parseInt(e.target.value);
    applyGradeDefaults();
    
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

document.getElementById('modeSelect').addEventListener('change', (e) => {
    quizMode = e.target.value;
});

window.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'voiceToggle') {
        feedbackVoiceEnabled = !feedbackVoiceEnabled;
        localStorage.setItem('feedbackVoiceEnabled', String(feedbackVoiceEnabled));
        e.target.textContent = feedbackVoiceEnabled ? 'Voice On' : 'Voice Off';
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

function updateDigitOptionsForGrade() {
    const select = document.getElementById('digitCount');
    if (!select) return;
    const cap = getGradeDigitCap(currentGrade);
    Array.from(select.options).forEach(opt => {
        const value = parseInt(opt.value, 10);
        opt.disabled = value > cap;
        opt.hidden = value > cap;
    });
    if (digitCount > cap) {
        digitCount = cap;
        select.value = String(cap);
    }
}

function applyGradeDefaults() {
    const recommended = getRecommendedDifficulty(currentGrade);
    difficulty = recommended;
    const difficultySelect = document.getElementById('difficulty');
    if (difficultySelect) {
        difficultySelect.value = recommended;
    }
    updateDigitOptionsForGrade();
}

function startSubject(subject) {
    currentSubject = subject;
    isQuickStart = false;
    mistakesOnlyMode = false;
    mistakesQueue = [];
    score = 0;
    streak = 0;
    maxStreak = 0;
    attempts = 0;
    
    document.getElementById('home').style.display = 'none';
    document.getElementById('mathMode').style.display = 'none';
    showControls(false);
    setDigitVisibility(false);
    updateDigitOptionsForGrade();
    setBackVisible(true);

    if (subject === 'math') {
        document.getElementById('mathMode').style.display = 'block';
    } else {
        showControls(true);
        showTopicMenu(subject);
    }
}

function showTopicMenu(subject) {
    // Hide all topic menus first
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    document.getElementById('learnSection').style.display = 'none';
    document.getElementById('tutorialArea').style.display = 'none';
    document.getElementById('mathMode').style.display = 'none';
    setDigitVisibility(false);
    updateDigitOptionsForGrade();
    setBackVisible(true);
    
    const topics = subject === 'math' ? mathTopics : subject === 'english' ? englishTopics : gkTopics;
    const container = document.getElementById(subject + 'Options');
    const grid = container.querySelector('.topic-grid');
    
    grid.innerHTML = '';
    
    const eligible = getEligibleTopics(subject);
    for (const [key, topic] of eligible) {
        const btn = document.createElement('button');
        btn.className = 'topic-btn';
        btn.style.background = subject === 'math' ? getMathColor(key) : subject === 'english' ? getEnglishColor(key) : getGKColor(key);
        btn.textContent = topic.label;
        btn.onclick = () => startTopic(key);
        grid.appendChild(btn);
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
    streak = 0;
    maxStreak = 0;
    attempts = 0;
    questionHistory = [];
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    document.getElementById('questionArea').style.display = 'block';
    document.getElementById('score').textContent = `Score: 0/${totalQuestions}`;
    document.getElementById('streak').textContent = `Streak: 0`;
    showControls(true);
    if (currentSubject === 'math') {
        const hasDigits = !!mathTopics[currentTopic]?.digits;
        setDigitVisibility(hasDigits);
        updateDigitOptionsForGrade();
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
    document.getElementById('mathMode').style.display = 'none';
    document.getElementById('questionArea').style.display = 'none';
    document.getElementById('feedback').innerHTML = '';
    stopTimer();
    setDigitVisibility(false);
    showControls(false);
    setBackVisible(false);
    renderBadgeShelf();
}

function changeSubject() {
    document.getElementById('questionArea').style.display = 'none';
    document.getElementById('mathOptions').style.display = 'none';
    document.getElementById('englishOptions').style.display = 'none';
    document.getElementById('gkOptions').style.display = 'none';
    document.getElementById('learnSection').style.display = 'none';
    document.getElementById('tutorialArea').style.display = 'none';
    document.getElementById('mathMode').style.display = 'none';
    document.getElementById('home').style.display = 'grid';
    stopTimer();
    setDigitVisibility(false);
    showControls(false);
    setBackVisible(false);
    renderBadgeShelf();
}

function changeTopic() {
    document.getElementById('questionArea').style.display = 'none';
    stopTimer();
    showControls(true);
    showTopicMenu(currentSubject);
}

function isVisible(id) {
    const el = document.getElementById(id);
    if (!el) return false;
    return el.style.display !== 'none';
}

function goBack() {
    if (isVisible('tutorialArea')) {
        backToLearn();
        return;
    }
    if (isVisible('learnSection')) {
        document.getElementById('learnSection').style.display = 'none';
        document.getElementById('mathMode').style.display = 'block';
        showControls(false);
        setDigitVisibility(false);
        return;
    }
    if (isVisible('mathMode')) {
        goHome();
        return;
    }
    if (isVisible('mathOptions') || isVisible('englishOptions') || isVisible('gkOptions')) {
        if (currentSubject === 'math') {
            document.getElementById('mathOptions').style.display = 'none';
            document.getElementById('mathMode').style.display = 'block';
            showControls(false);
            setDigitVisibility(false);
        } else {
            goHome();
        }
        return;
    }
    if (isVisible('questionArea')) {
        stopTimer();
        if (isQuickStart) {
            goHome();
            return;
        }
        showControls(true);
        showTopicMenu(currentSubject);
        return;
    }
    goHome();
}

function showControls(show) {
    const controls = document.getElementById('controls');
    if (controls) controls.style.display = show ? 'grid' : 'none';
}

function setBackVisible(visible) {
    const btn = document.getElementById('globalBack');
    if (btn) btn.style.display = visible ? 'inline-flex' : 'none';
}

function startMathPractice() {
    currentSubject = 'math';
    isQuickStart = false;
    mistakesOnlyMode = false;
    showControls(true);
    setDigitVisibility(true);
    updateDigitOptionsForGrade();
    setBackVisible(true);
    showTopicMenu('math');
}

function startQuickStart() {
    currentSubject = 'mixed';
    currentTopic = 'mixed';
    isQuickStart = true;
    mistakesOnlyMode = false;
    mistakesQueue = [];
    questionCount = 0;
    score = 0;
    streak = 0;
    maxStreak = 0;
    attempts = 0;
    questionHistory = [];
    document.getElementById('home').style.display = 'none';
    showControls(true);
    setDigitVisibility(false);
    setBackVisible(true);
    document.getElementById('questionArea').style.display = 'block';
    document.getElementById('score').textContent = `Score: 0/${totalQuestions}`;
    document.getElementById('streak').textContent = `Streak: 0`;
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
    startTimerIfNeeded();
    updateHelperText('');
    currentStepList = [];
    currentStepIndex = 0;
    renderVoiceToggle();
    
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
        const pad = document.getElementById('scratchPad');
        if (pad) {
            pad.style.display = scratchVisible ? 'block' : 'none';
            if (scratchVisible) clearScratchPad();
        }
        generateMathQuestion();
    } else if (currentSubject === 'english') {
        document.getElementById('scratchPad').style.display = 'none';
        const visual = document.getElementById('mathVisual');
        if (visual) visual.style.display = 'none';
        generateEnglishQuestion();
    } else if (currentSubject === 'gk') {
        document.getElementById('scratchPad').style.display = 'none';
        const visual = document.getElementById('mathVisual');
        if (visual) visual.style.display = 'none';
        generateGKQuestion();
    }

    syncVisualAndScratch();
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
        streak++;
        if (streak > maxStreak) maxStreak = streak;
    } else {
        streak = 0;
    }
    document.getElementById('streak').textContent = `Streak: ${streak}`;
    animateAnswer(isCorrect);
    speakFeedback(isCorrect);
    
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

function showHint() {
    const hint = buildHint();
    updateHelperText(hint);
}

function showExplanation() {
    const explanation = buildExplanation();
    updateHelperText(explanation);
}

function showSteps() {
    currentStepList = buildStepList();
    currentStepIndex = 0;
    renderStepHelper();
}

function updateHelperText(text) {
    const el = document.getElementById('helperText');
    if (el) el.textContent = text || '';
}

function updateHelperHtml(html) {
    const el = document.getElementById('helperText');
    if (el) el.innerHTML = html || '';
}

function animateAnswer(isCorrect) {
    const area = document.getElementById('questionArea');
    if (!area) return;
    area.classList.remove('correct-anim', 'incorrect-anim');
    void area.offsetWidth;
    area.classList.add(isCorrect ? 'correct-anim' : 'incorrect-anim');
}

function buildHint() {
    const meta = window.currentQuestionMeta || {};
    if (meta.subject === 'math') {
        if (meta.topic === 'counting') return 'Count the stars one by one. Use your finger to point to each star.';
        if (meta.topic === 'addition') return 'Start with the bigger number and count up by the smaller one.';
        if (meta.topic === 'subtraction') return 'Think: what do I remove from the first number to get the answer?';
        if (meta.topic === 'multiplication') return 'This is repeated addition. Add the first number, second number times.';
        if (meta.topic === 'division') return 'Try sharing the dividend into equal groups of the divisor.';
        if (meta.topic === 'fractions') return 'Add the numerators because the denominators match.';
        if (meta.topic === 'percentages') return '10% is one tenth. Break the percent into easy parts.';
        if (meta.topic === 'algebra') return 'Undo the operation on x to isolate it.';
    }
    if (meta.subject === 'english') {
        const topic = meta.topic;
        if (topic === 'nouns') return 'A noun is a person, place, or thing.';
        if (topic === 'verbs') return 'A verb shows action or state of being.';
        if (topic === 'grammar') return 'Read the sentence out loud and see what sounds correct.';
        if (topic === 'punctuation') return 'Look for where a pause or end should be.';
        if (topic === 'vocabulary') return 'Think of a word with the same or opposite meaning.';
        if (topic === 'spelling') return 'Say the word slowly and listen for each sound.';
        if (topic === 'letters') return 'Match the lowercase sound to the uppercase letter.';
        return 'Eliminate choices that don’t fit the sentence.';
    }
    if (meta.subject === 'gk') {
        const label = getTopicLabel('gk', meta.topic);
        return `Think about ${label.toLowerCase()} and what you already know.`;
    }
    return 'Try breaking the problem into smaller steps.';
}

function buildExplanation() {
    const meta = window.currentQuestionMeta || {};
    if (meta.subject === 'math') {
        if (meta.topic === 'addition') return `${meta.a} + ${meta.b} = ${meta.a + meta.b}. Add ones, then tens.`;
        if (meta.topic === 'subtraction') return `${meta.a} - ${meta.b} = ${meta.a - meta.b}. Subtract ones, then tens.`;
        if (meta.topic === 'multiplication') return `${meta.a} × ${meta.b} = ${meta.a * meta.b}. It means ${meta.a} added ${meta.b} times.`;
        if (meta.topic === 'division') return `${meta.a} ÷ ${meta.b} = ${Math.floor(meta.a / meta.b)}. Split ${meta.a} into ${meta.b} equal groups.`;
        if (meta.topic === 'fractions') {
            const sum = meta.a + meta.b;
            return `${meta.a}/${meta.d} + ${meta.b}/${meta.d} = ${sum}/${meta.d} = ${(sum / meta.d).toFixed(2)}.`;
        }
        if (meta.topic === 'percentages') {
            return `${meta.p}% of ${meta.a} is ${meta.a} × ${meta.p}/100 = ${(meta.a * meta.p / 100)}`;
        }
        if (meta.topic === 'algebra') {
            if (meta.a === 1) {
                return `x + ${meta.b} = ${meta.c}. Subtract ${meta.b} from both sides to get x = ${meta.c - meta.b}.`;
            }
            return `${meta.a}x + ${meta.b} = ${meta.c}. Subtract ${meta.b}, then divide by ${meta.a}.`;
        }
        if (meta.topic === 'counting') return `Count each star: there are ${meta.a}.`;
    }
    if (meta.subject === 'english') {
        return 'Read the sentence carefully and choose the option that makes it correct.';
    }
    if (meta.subject === 'gk') {
        return 'Use facts you already know from school or daily life.';
    }
    return '';
}

function buildSteps() {
    const meta = window.currentQuestionMeta || {};
    if (meta.subject === 'math') {
        if (meta.topic === 'addition') {
            return `1) Add ones: ${meta.a % 10} + ${meta.b % 10}. 2) Add tens: ${Math.floor(meta.a / 10)} + ${Math.floor(meta.b / 10)}.`;
        }
        if (meta.topic === 'subtraction') {
            return `1) Subtract ones. 2) Subtract tens. Borrow if needed.`;
        }
        if (meta.topic === 'multiplication') {
            return `1) Multiply ${meta.a} by ${meta.b}. 2) Combine results.`;
        }
        if (meta.topic === 'division') {
            return `1) How many ${meta.b}'s fit in ${meta.a}? 2) Check by multiplying back.`;
        }
        if (meta.topic === 'fractions') {
            return `1) Add numerators: ${meta.a} + ${meta.b}. 2) Keep denominator ${meta.d}. 3) Convert to decimal.`;
        }
        if (meta.topic === 'percentages') {
            return `1) Convert ${meta.p}% to a decimal. 2) Multiply by ${meta.a}.`;
        }
        if (meta.topic === 'algebra') {
            return `1) Undo the +${meta.b}. 2) Divide by ${meta.a}.`;
        }
    }
    return 'Read the question carefully and solve step by step.';
}

function buildStepList() {
    const meta = window.currentQuestionMeta || {};
    if (meta.subject === 'math') {
        if (meta.topic === 'addition') {
            return [
                `Add ones: ${meta.a % 10} + ${meta.b % 10}.`,
                `Add tens: ${Math.floor(meta.a / 10)} + ${Math.floor(meta.b / 10)}.`,
                `Combine to get ${meta.a + meta.b}.`
            ];
        }
        if (meta.topic === 'subtraction') {
            return [
                `Subtract ones. Borrow if needed.`,
                `Subtract tens.`,
                `Answer is ${meta.a - meta.b}.`
            ];
        }
        if (meta.topic === 'multiplication') {
            return [
                `Think of ${meta.a} groups of ${meta.b}.`,
                `Multiply: ${meta.a} × ${meta.b}.`,
                `Answer is ${meta.a * meta.b}.`
            ];
        }
        if (meta.topic === 'division') {
            return [
                `Split ${meta.a} into groups of ${meta.b}.`,
                `Count how many groups fit.`,
                `Answer is ${Math.floor(meta.a / meta.b)}.`
            ];
        }
        if (meta.topic === 'fractions') {
            const sum = meta.a + meta.b;
            return [
                `Add numerators: ${meta.a} + ${meta.b} = ${sum}.`,
                `Keep denominator: ${meta.d}.`,
                `Decimal: ${(sum / meta.d).toFixed(2)}.`
            ];
        }
        if (meta.topic === 'percentages') {
            return [
                `Convert ${meta.p}% to decimal: ${meta.p}/100.`,
                `Multiply: ${meta.a} × ${meta.p}/100.`,
                `Answer is ${meta.a * meta.p / 100}.`
            ];
        }
        if (meta.topic === 'algebra') {
            if (meta.a === 1) {
                return [
                    `Subtract ${meta.b} from both sides.`,
                    `x = ${meta.c} - ${meta.b}.`,
                    `Answer is ${meta.c - meta.b}.`
                ];
            }
            return [
                `Subtract ${meta.b} from both sides.`,
                `Divide both sides by ${meta.a}.`,
                `Answer is ${(meta.c - meta.b) / meta.a}.`
            ];
        }
        if (meta.topic === 'counting') {
            return [
                `Point to each star and count.`,
                `Say the numbers out loud.`,
                `Answer is ${meta.a}.`
            ];
        }
    }
    return [
        `Read the question carefully.`,
        `Remove choices that don't fit.`,
        `Pick the best answer.`
    ];
}

function renderStepHelper() {
    if (!currentStepList || currentStepList.length === 0) {
        updateHelperText('Try breaking the problem into smaller steps.');
        return;
    }
    const step = currentStepList[currentStepIndex];
    const nextLabel = currentStepIndex < currentStepList.length - 1 ? 'Next Step' : 'Start Over';
    const counter = `<span class="step-chip">Step ${currentStepIndex + 1}/${currentStepList.length}</span>`;
    const actions = `
        <div class="step-actions">
            <button class="helper-btn" onclick="nextStep()">${nextLabel}</button>
            <button class="helper-btn" onclick="showHint()">Hint</button>
        </div>`;
    updateHelperHtml(`${counter}<div style="margin-top:6px;">${step}</div>${actions}`);
}

function nextStep() {
    if (!currentStepList || currentStepList.length === 0) return;
    if (currentStepIndex < currentStepList.length - 1) {
        currentStepIndex += 1;
    } else {
        currentStepIndex = 0;
    }
    renderStepHelper();
}

function renderVoiceToggle() {
    const helperRow = document.querySelector('.helper-row');
    if (!helperRow) return;
    let btn = document.getElementById('voiceToggle');
    const saved = localStorage.getItem('feedbackVoiceEnabled');
    if (saved !== null) feedbackVoiceEnabled = saved === 'true';
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'voiceToggle';
        btn.className = 'helper-btn';
        helperRow.appendChild(btn);
    }
    btn.textContent = feedbackVoiceEnabled ? 'Voice On' : 'Voice Off';
}

function speakFeedback(isCorrect) {
    if (!('speechSynthesis' in window)) return;
    if (!feedbackVoiceEnabled) return;
    const text = isCorrect ? 'Great job! Keep going.' : 'Nice try. You can do it.';
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

function updateProgress() {
    document.getElementById('progress').textContent = `Question ${questionCount}/${totalQuestions}`;
}

function showResults() {
    stopTimer();
    const q = document.getElementById('question');
    const a = document.getElementById('answerSection');
    const feedback = document.getElementById('feedback');
    
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const mistakes = questionHistory.filter(item => !item.isCorrect);
    const newlyUnlocked = unlockBadges(score, totalQuestions);
    
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

    if (newlyUnlocked.length > 0) {
        reviewHTML += `<div style="margin-top:16px; font-weight:600; color:#2f9e44;">New badges: ${newlyUnlocked.join(', ')}</div>`;
    }
    
    a.innerHTML = reviewHTML;
    feedback.innerHTML = '';
    feedback.className = 'feedback';
    renderBadgeShelf();
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

function startTimerIfNeeded() {
    const timerEl = document.getElementById('timer');
    if (quizMode !== 'challenge') {
        if (timerEl) timerEl.style.display = 'none';
        stopTimer();
        return;
    }
    timeLeft = getChallengeTime();
    if (timerEl) {
        timerEl.style.display = 'inline-flex';
        timerEl.textContent = `⏱ ${timeLeft}s`;
    }
    stopTimer();
    timerInterval = setInterval(() => {
        timeLeft -= 1;
        if (timerEl) timerEl.textContent = `⏱ ${timeLeft}s`;
        if (timeLeft <= 0) {
            stopTimer();
            if (currentAnswer) {
                saveCurrentAnswer();
            }
            generateQuestion();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function getChallengeTime() {
    if (currentGrade <= 1) return 60;
    if (currentGrade <= 3) return 50;
    if (currentGrade <= 5) return 45;
    return 40;
}

// Scratch pad functionality
let isDrawing = false;
let scratchCtx = null;
let scratchTool = 'pen';
let scratchColor = '#333';
let scratchSize = 4;
let scratchGridOn = false;

function initScratchPad() {
    const canvas = document.getElementById('scratchCanvas');
    scratchCtx = canvas.getContext('2d');
    scratchCtx.lineWidth = scratchSize;
    scratchCtx.lineCap = 'round';
    scratchCtx.strokeStyle = scratchColor;
    
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
    scratchCtx.lineWidth = scratchSize;
    scratchCtx.strokeStyle = scratchTool === 'eraser' ? '#ffffff' : scratchColor;
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
        scratchCtx.lineWidth = scratchSize;
        scratchCtx.strokeStyle = scratchTool === 'eraser' ? '#ffffff' : scratchColor;
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
        if (scratchGridOn) {
            drawScratchGrid();
        }
    }
}

function toggleScratchPad() {
    const pad = document.getElementById('scratchPad');
    if (pad.style.display === 'none') {
        pad.style.display = 'block';
        scratchVisible = true;
    } else {
        pad.style.display = 'none';
        scratchVisible = false;
    }
    localStorage.setItem('scratchVisible', String(scratchVisible));
    syncVisualAndScratch();
}

function toggleVisualAid() {
    visualAidVisible = !visualAidVisible;
    localStorage.setItem('visualAidVisible', String(visualAidVisible));
    syncVisualAndScratch();
}

function syncVisualAndScratch() {
    const visual = document.getElementById('mathVisual');
    const visualBtn = document.getElementById('toggleVisualBtn');
    const scratchBtn = document.getElementById('toggleScratchBtn');
    if (visual) {
        if (currentSubject === 'math' && visualAidVisible) {
            visual.style.display = 'block';
        } else {
            visual.style.display = 'none';
        }
    }
    if (visualBtn) {
        visualBtn.textContent = visualAidVisible ? 'Hide Visual Aid' : 'Show Visual Aid';
    }
    const pad = document.getElementById('scratchPad');
    if (pad && scratchBtn) {
        const visible = pad.style.display !== 'none';
        scratchBtn.textContent = visible ? 'Hide Scratch Pad' : 'Show Scratch Pad';
    }
}

function setScratchTool(tool) {
    scratchTool = tool;
    document.querySelectorAll('.scratch-controls button').forEach(btn => btn.classList.remove('active'));
    const buttons = Array.from(document.querySelectorAll('.scratch-controls button'));
    const target = buttons.find(btn => btn.textContent.toLowerCase() === tool);
    if (target) target.classList.add('active');
}

function setScratchColor(color) {
    scratchColor = color;
    document.querySelectorAll('.color-dot').forEach(dot => dot.classList.remove('active'));
    const dots = Array.from(document.querySelectorAll('.color-dot'));
    const target = dots.find(dot => dot.style.background === color);
    if (target) target.classList.add('active');
}

function toggleScratchGrid() {
    scratchGridOn = !scratchGridOn;
    if (scratchGridOn) {
        drawScratchGrid();
    } else {
        clearScratchPad();
    }
}

function drawScratchGrid() {
    const canvas = document.getElementById('scratchCanvas');
    const ctx = scratchCtx;
    if (!ctx) return;
    ctx.save();
    ctx.strokeStyle = '#e9ecff';
    ctx.lineWidth = 1;
    const step = 20;
    for (let x = 0; x <= canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    ctx.restore();
}

const scratchSizeInput = document.getElementById('scratchSize');
if (scratchSizeInput) {
    scratchSizeInput.addEventListener('input', () => {
        scratchSize = parseInt(scratchSizeInput.value, 10);
    });
}

function pickQuickStartTarget() {
    const topics = [];
    for (const [key] of getEligibleTopics('math')) {
        topics.push({ subject: 'math', topic: key, weight: 1.1 });
    }
    for (const [key] of getEligibleTopics('english')) {
        topics.push({ subject: 'english', topic: key, weight: 1 });
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
    streak = 0;
    maxStreak = 0;
    document.getElementById('questionArea').style.display = 'block';
    document.getElementById('score').textContent = `Score: 0/${totalQuestions}`;
    document.getElementById('streak').textContent = `Streak: 0`;
    setDigitVisibility(currentSubject === 'math' && !!mathTopics[currentTopic]?.digits);
    updateProgress();
    generateQuestion();
}

function getBadges() {
    const raw = localStorage.getItem('badges');
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveBadges(badges) {
    localStorage.setItem('badges', JSON.stringify(badges));
}

function unlockBadges(scoreVal, total) {
    const earned = getBadges();
    const newly = [];
    const maybeAdd = (badge, condition) => {
        if (condition && !earned.includes(badge)) {
            earned.push(badge);
            newly.push(badge);
        }
    };
    maybeAdd('Hot Streak x5', maxStreak >= 5);
    maybeAdd('Hot Streak x10', maxStreak >= 10);
    maybeAdd('10 Correct', scoreVal >= 10);
    maybeAdd('25 Correct', scoreVal >= 25);
    maybeAdd('Perfect Score', scoreVal === total && total > 0);
    if (newly.length > 0) saveBadges(earned);
    return newly;
}

function renderBadgeShelf() {
    if (!badgeShelf) return;
    const badges = getBadges();
    if (badges.length === 0) {
        badgeShelf.style.display = 'none';
        badgeShelf.innerHTML = '';
        return;
    }
    badgeShelf.style.display = 'flex';
    badgeShelf.innerHTML = badges.map(b => `<div class="badge-chip">${b}</div>`).join('');
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
applyGradeDefaults();
renderBadgeShelf();
setBackVisible(false);
const savedVisual = localStorage.getItem('visualAidVisible');
const savedScratch = localStorage.getItem('scratchVisible');
if (savedVisual !== null) visualAidVisible = savedVisual === 'true';
if (savedScratch !== null) scratchVisible = savedScratch === 'true';

function showLearnSection() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('learnSection').style.display = 'block';
    document.getElementById('tutorialArea').style.display = 'none';
    document.getElementById('mathMode').style.display = 'none';
    setDigitVisibility(false);
    showControls(false);
    setBackVisible(true);
    renderLearnResume();
    updateLearnMasteryBadges();
}

function backToLearn() {
    document.getElementById('tutorialArea').style.display = 'none';
    document.getElementById('learnSection').style.display = 'block';
    setBackVisible(true);
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
            viz: `<div id="vizBox" class="viz-box"></div>`,
            extra: `
                <div class="learn-panel">
                    <h3>Carry Over (Multiple Digits)</h3>
                    <p>When the ones add up to 10 or more, carry 1 to the tens.</p>
                    <div class="learn-carry-controls">
                        <label>Top: <input id="carryTop" type="number" min="10" max="9999" value="247"></label>
                        <label>Bottom: <input id="carryBottom" type="number" min="10" max="9999" value="389"></label>
                        <button onclick="renderCarry()">Show Steps</button>
                    </div>
                    <div id="carryVisual" class="carry-visual"></div>
                </div>
            `
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
            viz: `<div id="vizBox" class="viz-box"></div>`,
            extra: `
                <div class="learn-panel">
                    <h3>Borrowing (Multiple Digits)</h3>
                    <p>If the top digit is smaller, borrow 1 from the next place.</p>
                    <div class="learn-carry-controls">
                        <label>Top: <input id="borrowTop" type="number" min="10" max="9999" value="503"></label>
                        <label>Bottom: <input id="borrowBottom" type="number" min="10" max="9999" value="247"></label>
                        <button onclick="renderBorrow()">Show Steps</button>
                    </div>
                    <div id="borrowVisual" class="carry-visual"></div>
                </div>
            `
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
        ,
        tables: {
            title: 'Multiplication Tables',
            intro: 'Pick a table and practice quickly.',
            controls: `
                <div class="learn-controls">
                    <label>Table of: <span id="tableBaseVal">5</span></label>
                    <input id="tableBase" type="range" min="1" max="30" value="5">
                    <label>Up to: <span id="tableMaxVal">10</span></label>
                    <input id="tableMax" type="range" min="5" max="30" value="10">
                </div>
            `,
            steps: [
                'Choose a table (like 5).',
                'Multiply by 1, 2, 3, and so on.',
                'Say the answers out loud to remember.'
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
            ${config.extra || ''}
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
        setTimeout(renderCarry, 0);
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
        setTimeout(renderBorrow, 0);
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
    } else if (operation === 'tables') {
        const base = document.getElementById('tableBase');
        const max = document.getElementById('tableMax');
        const update = () => {
            document.getElementById('tableBaseVal').textContent = base.value;
            document.getElementById('tableMaxVal').textContent = max.value;
            saveLearnState(operation, { base: base.value, max: max.value });
            renderTables(parseInt(base.value, 10), parseInt(max.value, 10));
            newLearnChallenge(operation);
        };
        const saved = loadLearnState(operation);
        if (saved) {
            base.value = saved.base ?? base.value;
            max.value = saved.max ?? max.value;
        }
        base.addEventListener('input', update);
        max.addEventListener('input', update);
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
    if (operation === 'tables') {
        const saved = loadLearnState('tables') || { base: 5, max: 10 };
        const base = Math.min(30, Math.max(1, parseInt(saved.base, 10)));
        const max = Math.min(30, Math.max(5, parseInt(saved.max, 10)));
        const n = randInt(1, max);
        return { question: `What is ${base} × ${n}?`, answer: base * n, type: 'number' };
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

function renderTables(base, max) {
    const box = document.getElementById('vizBox');
    if (!box) return;
    let rows = '';
    for (let i = 1; i <= max; i++) {
        rows += `<div class="table-row">${base} × ${i} = ${base * i}</div>`;
    }
    box.innerHTML = `<div class="table-grid">${rows}</div>`;
}

function renderCarry() {
    const topInput = document.getElementById('carryTop');
    const bottomInput = document.getElementById('carryBottom');
    const out = document.getElementById('carryVisual');
    if (!topInput || !bottomInput || !out) return;
    const top = clampMultiDigit(parseInt(topInput.value, 10));
    const bottom = clampMultiDigit(parseInt(bottomInput.value, 10));
    topInput.value = top;
    bottomInput.value = bottom;
    const { carryRow, result, steps } = addWithCarry(top, bottom);
    const width = Math.max(String(top).length, String(bottom).length, String(result).length);
    out.innerHTML = `
        <div class="math-problem">
            <div class="carry-row">${carryRow.padStart(width)}</div>
            <div>${String(top).padStart(width)}</div>
            <div>+${String(bottom).padStart(width - 1)}</div>
            <div class="line"></div>
            <div>${String(result).padStart(width)}</div>
        </div>
        <ol class="learn-steps" style="margin-top:10px;">
            ${steps.map(s => `<li>${s}</li>`).join('')}
        </ol>
    `;
}

function renderBorrow() {
    const topInput = document.getElementById('borrowTop');
    const bottomInput = document.getElementById('borrowBottom');
    const out = document.getElementById('borrowVisual');
    if (!topInput || !bottomInput || !out) return;
    let topRaw = parseInt(topInput.value, 10);
    let bottomRaw = parseInt(bottomInput.value, 10);
    if (isNaN(topRaw)) topRaw = 10;
    if (isNaN(bottomRaw)) bottomRaw = 10;
    const top = clampMultiDigit(topRaw);
    const bottom = clampMultiDigit(bottomRaw);
    if (topRaw !== top) topInput.value = top;
    if (bottomRaw !== bottom) bottomInput.value = bottom;
    if (bottom > top) {
        out.innerHTML = `<div class="carry-visual">Bottom should be smaller than top to borrow. Please adjust.</div>`;
        return;
    }
    const { borrowRow, result, steps } = subtractWithBorrow(top, bottom);
    const width = Math.max(String(top).length, String(bottom).length, String(result).length);
    out.innerHTML = `
        <div class="math-problem">
            <div class="carry-row">${borrowRow.padStart(width)}</div>
            <div>${String(top).padStart(width)}</div>
            <div>−${String(bottom).padStart(width - 1)}</div>
            <div class="line"></div>
            <div>${String(result).padStart(width)}</div>
        </div>
        <ol class="learn-steps" style="margin-top:10px;">
            ${steps.map(s => `<li>${s}</li>`).join('')}
        </ol>
    `;
}

function clampMultiDigit(value) {
    if (isNaN(value)) return 10;
    return Math.min(9999, Math.max(10, value));
}

function addWithCarry(a, b) {
    const aDigits = String(a).split('').reverse().map(Number);
    const bDigits = String(b).split('').reverse().map(Number);
    const maxLen = Math.max(aDigits.length, bDigits.length);
    let carry = 0;
    const resultDigits = [];
    const carryRow = [];
    const steps = [];
    for (let i = 0; i < maxLen; i++) {
        const ad = aDigits[i] || 0;
        const bd = bDigits[i] || 0;
        const sum = ad + bd + carry;
        const digit = sum % 10;
        const newCarry = Math.floor(sum / 10);
        resultDigits.push(digit);
        carryRow.push(carry ? String(carry) : ' ');
        steps.push(`Place ${i + 1}: ${ad} + ${bd} + ${carry} = ${sum} → write ${digit}, carry ${newCarry}.`);
        carry = newCarry;
    }
    if (carry) {
        resultDigits.push(carry);
        carryRow.push(' ');
    }
    return {
        result: Number(resultDigits.reverse().join('')),
        carryRow: carryRow.reverse().join(''),
        steps
    };
}

function subtractWithBorrow(a, b) {
    const aDigits = String(a).split('').reverse().map(Number);
    const bDigits = String(b).split('').reverse().map(Number);
    const maxLen = Math.max(aDigits.length, bDigits.length);
    const resultDigits = [];
    const borrowRow = [];
    const steps = [];
    let borrow = 0;
    for (let i = 0; i < maxLen; i++) {
        let ad = (aDigits[i] || 0) - borrow;
        const bd = bDigits[i] || 0;
        if (ad < bd) {
            ad += 10;
            borrow = 1;
            borrowRow.push('1');
            steps.push(`Place ${i + 1}: borrowed 1 → ${ad} - ${bd} = ${ad - bd}.`);
        } else {
            borrow = 0;
            borrowRow.push(' ');
            steps.push(`Place ${i + 1}: ${ad} - ${bd} = ${ad - bd}.`);
        }
        resultDigits.push(ad - bd);
    }
    while (resultDigits.length > 1 && resultDigits[resultDigits.length - 1] === 0) {
        resultDigits.pop();
    }
    return {
        result: Number(resultDigits.reverse().join('')),
        borrowRow: borrowRow.reverse().join(''),
        steps
    };
}
