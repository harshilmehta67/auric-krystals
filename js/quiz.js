// Quiz Data and Logic
const quizQuestions = [
    {
        id: 1,
        question: "When you wake up most days, how do you usually feel?",
        options: [
            { text: "Calm but emotionally sensitive", value: "A" },
            { text: "Mentally tired or overthinking", value: "B" },
            { text: "Energetic but restless", value: "C" },
            { text: "Heavy, drained, or low", value: "D" },
        ],
    },
    {
        id: 2,
        question: "Which area of life feels most out of balance right now?",
        options: [
            { text: "Love, emotions, or relationships", value: "A" },
            { text: "Mental peace and clarity", value: "B" },
            { text: "Career, money, or growth", value: "C" },
            { text: "Protection and stability", value: "D" },
        ],
    },
    {
        id: 3,
        question: "What are you seeking the most at this phase of life?",
        options: [
            { text: "Emotional healing and self-love", value: "A" },
            { text: "Guidance and inner clarity", value: "B" },
            { text: "Confidence, success, and motivation", value: "C" },
            { text: "Grounding and protection", value: "D" },
        ],
    },
    {
        id: 4,
        question: "How do you usually react to stressful situations?",
        options: [
            { text: "I get emotionally affected easily", value: "A" },
            { text: "I overthink and feel mentally exhausted", value: "B" },
            { text: "I push myself harder to overcome it", value: "C" },
            { text: "I withdraw and feel low on energy", value: "D" },
        ],
    },
    {
        id: 5,
        question: "What kind of energy do you wish to attract right now?",
        options: [
            { text: "Gentle, loving, and soothing", value: "A" },
            { text: "Calm, peaceful, and balanced", value: "B" },
            { text: "Powerful, confident, and abundant", value: "C" },
            { text: "Protective, grounding, and stable", value: "D" },
        ],
    },
    {
        id: 6,
        question: "Which affirmation resonates most with you?",
        options: [
            { text: "“I am worthy of love and healing.”", value: "A" },
            { text: "“My mind is calm and clear.”", value: "B" },
            { text: "“I attract success and abundance.”", value: "C" },
            { text: "“I am safe, protected, and grounded.”", value: "D" },
        ],
    },
    {
        id: 7,
        question: "How would you like your crystal to support you?",
        options: [
            { text: "Heal my emotions and bring comfort", value: "A" },
            { text: "Clear my mind and improve focus", value: "B" },
            { text: "Boost my confidence and growth", value: "C" },
            { text: "Protect my energy and keep me grounded", value: "D" },
        ],
    },
];

const crystalResults = {
    A: {
        emoji: "💗",
        name: "Rose Quartz",
        theme: "The Heart Healer",
        description:
            "Known as the stone of unconditional love, Rose Quartz opens your heart chakra and deepens your capacity for self-love and compassion. Perfect for emotional healing and attracting love into your life.",
    },
    B: {
        emoji: "💜",
        name: "Amethyst",
        theme: "The Spiritual Guardian",
        description:
            "A powerful protective stone that enhances intuition and spiritual awareness. Amethyst calms the mind, aids meditation, and connects you to higher consciousness.",
    },
    C: {
        emoji: "✨",
        name: "Citrine",
        theme: "The Abundance Attractor",
        description:
            "The ultimate manifestation stone, Citrine radiates joy, confidence, and prosperity. It amplifies your personal power and attracts success and abundance.",
    },
    D: {
        emoji: "🖤",
        name: "Black Tourmaline",
        theme: "The Protective Guardian",
        description:
            "A powerful grounding stone that shields you from negative energy. Black Tourmaline roots you to the earth and creates a protective shield around your aura.",
    },
};

let currentQuestion = 0;
let answers = [];

/** Ensures quiz DOM exists on every page that loads this script. */
function ensureQuizModal() {
    if (document.getElementById("quizModal") && document.getElementById("quizContent")) return;
    var old = document.getElementById("quizModal");
    if (old) old.remove();
    var wrap = document.createElement("div");
    wrap.innerHTML =
        '<div id="quizModal" class="hidden fixed inset-0 z-[70] flex items-center justify-center bg-black/45 ak-nav-blur px-4" aria-hidden="true">' +
        '<div class="ak-modal-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">' +
        '<div id="quizContent" class="p-6 sm:p-8"></div></div></div>';
    document.body.appendChild(wrap.firstElementChild);
}

function initializeQuiz() {
    if (document.body.dataset.quizAutostart !== "true") return;
    var quizTaken = localStorage.getItem("quizTaken");
    if (!quizTaken) {
        setTimeout(openQuiz, 1800);
    }
}

function openQuiz() {
    ensureQuizModal();
    var modal = document.getElementById("quizModal");
    var content = document.getElementById("quizContent");
    if (!modal || !content) return;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    currentQuestion = 0;
    answers = [];
    renderQuestion();
}

function closeQuiz() {
    var modal = document.getElementById("quizModal");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
}

function renderQuestion() {
    var content = document.getElementById("quizContent");
    if (!content) return;
    var question = quizQuestions[currentQuestion];
    var html =
        '<div class="space-y-6">' +
        '<div class="flex justify-between items-center gap-4">' +
        '<h3 class="text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.14em] text-primary/90">Question ' +
        (currentQuestion + 1) +
        "/" +
        quizQuestions.length +
        "</h3>" +
        '<button type="button" onclick="closeQuiz()" class="shrink-0 text-on-surface-variant hover:text-primary text-2xl leading-none" aria-label="Close quiz">&times;</button>' +
        "</div>" +
        '<div class="h-1.5 rounded-full bg-outline-variant/30 overflow-hidden"><div class="h-full rounded-full bg-primary transition-all duration-300" style="width:' +
        Math.round(((currentQuestion + 1) / quizQuestions.length) * 100) +
        '%"></div></div>' +
        '<p class="text-base sm:text-lg text-on-surface font-semibold leading-snug">' +
        question.question +
        "</p>" +
        '<div class="space-y-3">';

    question.options.forEach(function (option) {
        html +=
            '<button type="button" onclick="selectAnswer(\'' +
            option.value +
            '\')" class="w-full text-left p-4 rounded-xl border-2 border-outline-variant/60 hover:border-primary hover:bg-primary-fixed/50 transition-all text-sm sm:text-base">' +
            option.text +
            "</button>";
    });

    html += "</div><div class=\"flex gap-3 pt-2\">";
    if (currentQuestion > 0) {
        html +=
            '<button type="button" onclick="previousQuestion()" class="flex-1 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary-fixed/40 transition-colors">Back</button>';
    }
    html += "</div></div>";
    content.innerHTML = html;
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
    var content = document.getElementById("quizContent");
    if (!content) return;
    var frequency = {};
    answers.forEach(function (answer) {
        frequency[answer] = (frequency[answer] || 0) + 1;
    });
    var keys = Object.keys(frequency);
    var mostFrequent = keys.reduce(function (a, b) {
        return frequency[a] > frequency[b] ? a : b;
    });
    var crystal = crystalResults[mostFrequent];
    localStorage.setItem("quizTaken", "true");

    var html =
        '<div class="text-center space-y-5">' +
        '<div class="text-6xl mb-2" aria-hidden="true">' +
        crystal.emoji +
        "</div>" +
        '<h3 class="text-2xl font-bold text-primary">' +
        crystal.name +
        "</h3>" +
        '<p class="text-sm text-secondary font-semibold italic">' +
        crystal.theme +
        "</p>" +
        '<p class="text-base leading-relaxed text-on-surface text-left sm:text-center">' +
        crystal.description +
        "</p>" +
        '<div class="flex flex-col sm:flex-row gap-3 pt-4">' +
        '<button type="button" onclick="window.location.href=\'shop.html\'" class="flex-1 py-3.5 bg-primary text-on-primary rounded-xl font-bold hover:opacity-95 transition-opacity">Shop ' +
        crystal.name +
        "</button>" +
        '<button type="button" onclick="openQuiz()" class="flex-1 py-3.5 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary-fixed/40 transition-colors">Retake Quiz</button>' +
        "</div>" +
        '<button type="button" onclick="closeQuiz()" class="w-full py-2 text-on-surface-variant hover:text-primary text-sm">Close</button>' +
        "</div>";
    content.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function () {
    ensureQuizModal();
    initializeQuiz();
});
