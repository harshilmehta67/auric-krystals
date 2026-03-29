// Quiz Data and Logic
const quizQuestions = [
    {
        id: 1,
        question: "When you wake up most days, how do you usually feel?",
        options: [
            { text: "Calm but emotionally sensitive", value: "A" },
            { text: "Mentally tired or overthinking", value: "B" },
            { text: "Energetic but restless", value: "C" },
            { text: "Heavy, drained, or low", value: "D" }
        ]
    },
    {
        id: 2,
        question: "Which area of life feels most out of balance right now?",
        options: [
            { text: "Love, emotions, or relationships", value: "A" },
            { text: "Mental peace and clarity", value: "B" },
            { text: "Career, money, or growth", value: "C" },
            { text: "Protection and stability", value: "D" }
        ]
    },
    {
        id: 3,
        question: "What are you seeking the most at this phase of life?",
        options: [
            { text: "Emotional healing and self-love", value: "A" },
            { text: "Guidance and inner clarity", value: "B" },
            { text: "Confidence, success, and motivation", value: "C" },
            { text: "Grounding and protection", value: "D" }
        ]
    },
    {
        id: 4,
        question: "How do you usually react to stressful situations?",
        options: [
            { text: "I get emotionally affected easily", value: "A" },
            { text: "I overthink and feel mentally exhausted", value: "B" },
            { text: "I push myself harder to overcome it", value: "C" },
            { text: "I withdraw and feel low on energy", value: "D" }
        ]
    },
    {
        id: 5,
        question: "What kind of energy do you wish to attract right now?",
        options: [
            { text: "Gentle, loving, and soothing", value: "A" },
            { text: "Calm, peaceful, and balanced", value: "B" },
            { text: "Powerful, confident, and abundant", value: "C" },
            { text: "Protective, grounding, and stable", value: "D" }
        ]
    },
    {
        id: 6,
        question: "Which color resonates most with you right now?",
        options: [
            { text: "Soft pink or rose", value: "A" },
            { text: "Lavender or indigo", value: "B" },
            { text: "Golden or amber", value: "C" },
            { text: "Deep black or brown", value: "D" }
        ]
    },
    {
        id: 7,
        question: "What's your primary goal with crystal healing?",
        options: [
            { text: "Open my heart and attract love", value: "A" },
            { text: "Enhance intuition and spiritual awareness", value: "B" },
            { text: "Boost success and manifest abundance", value: "C" },
            { text: "Feel safe and protected", value: "D" }
        ]
    }
];

const crystalResults = {
    "A": {
        emoji: "💗",
        name: "Rose Quartz",
        theme: "The Heart Healer",
        description: "Known as the stone of unconditional love, Rose Quartz opens your heart chakra and deepens your capacity for self-love and compassion. Perfect for emotional healing and attracting love into your life."
    },
    "B": {
        emoji: "💜",
        name: "Amethyst",
        theme: "The Spiritual Guardian",
        description: "A powerful protective stone that enhances intuition and spiritual awareness. Amethyst calms the mind, aids meditation, and connects you to higher consciousness."
    },
    "C": {
        emoji: "✨",
        name: "Citrine",
        theme: "The Abundance Attractor",
        description: "The ultimate manifestation stone, Citrine radiates joy, confidence, and prosperity. It amplifies your personal power and attracts success and abundance."
    },
    "D": {
        emoji: "🖤",
        name: "Black Tourmaline",
        theme: "The Protective Guardian",
        description: "A powerful grounding stone that shields you from negative energy. Black Tourmaline roots you to the earth and creates a protective shield around your aura."
    }
};

let currentQuestion = 0;
let answers = [];

function initializeQuiz() {
    const quizTaken = localStorage.getItem('quizTaken');
    if (!quizTaken) {
        setTimeout(openQuiz, 1500);
    }
}

function openQuiz() {
    document.getElementById('quizModal').classList.remove('hidden');
    currentQuestion = 0;
    answers = [];
    renderQuestion();
}

function closeQuiz() {
    document.getElementById('quizModal').classList.add('hidden');
}

function renderQuestion() {
    const question = quizQuestions[currentQuestion];
    let html = `
        <div class="space-y-6">
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-bold text-primary">Question ${currentQuestion + 1}/${quizQuestions.length}</h3>
                <button onclick="closeQuiz()" class="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <p class="text-lg text-on-surface font-semibold">${question.question}</p>
            <div class="space-y-3">
    `;

    question.options.forEach(option => {
        html += `
            <button onclick="selectAnswer('${option.value}')" class="w-full p-4 text-left rounded-lg border-2 border-outline-variant hover:border-primary hover:bg-primary-fixed transition-all">
                ${option.text}
            </button>
        `;
    });

    html += `
            </div>
            <div class="flex gap-4 pt-4">
    `;

    if (currentQuestion > 0) {
        html += `<button onclick="previousQuestion()" class="flex-1 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary-fixed">Back</button>`;
    }

    html += `</div>
        </div>
    `;

    document.getElementById('quizContent').innerHTML = html;
}

function selectAnswer(value) {
    answers.push(value);
    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        answers.pop();
        renderQuestion();
    }
}

function showResults() {
    const frequency = {};
    answers.forEach(answer => {
        frequency[answer] = (frequency[answer] || 0) + 1;
    });

    const mostFrequent = Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
    const crystal = crystalResults[mostFrequent];

    localStorage.setItem('quizTaken', 'true');

    let html = `
        <div class="text-center space-y-6">
            <div class="text-6xl mb-4">${crystal.emoji}</div>
            <h3 class="text-2xl font-bold text-primary">${crystal.name}</h3>
            <p class="text-sm text-secondary font-semibold italic">${crystal.theme}</p>
            <p class="text-base leading-relaxed text-on-surface">${crystal.description}</p>
            <div class="flex gap-4 pt-6">
                <button onclick="window.location.href='shop.html'" class="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-container">Explore ${crystal.name}</button>
                <button onclick="openQuiz()" class="flex-1 py-3 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary-fixed">Retake Quiz</button>
            </div>
            <button onclick="closeQuiz()" class="w-full py-2 text-gray-400 hover:text-gray-600">Close</button>
        </div>
    `;

    document.getElementById('quizContent').innerHTML = html;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeQuiz);
