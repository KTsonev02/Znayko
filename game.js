// ===============================
// ДАННИ
// ===============================

// Данни за картинките по букви
const words = {
    "Р":[
        {name:"Бор", img:"assets/bor.png", audio:"audio/bor.mp3", info:"Борът е голямо зелено дърво. 🌲"},
        {name:"Храст", img:"assets/hrast.png", audio:"audio/hrast.mp3", info:"Храстът е ниско растение с много клонки. 🌿"},
        {name:"Река", img:"assets/reka.png", audio:"audio/reka.mp3", info:"Реката е течаща вода. 💧"},
        {name:"Трева", img:"assets/grass.png", audio:"audio/treva.mp3", info:"Тревата е зелена и мека. 🍀"},
        {name:"Рак", img:"assets/rak.png", audio:"audio/rak.mp3", info:"Ракът живее във водата и има щипки. 🦀"},
        {name:"Риба", img:"assets/riba.png", audio:"audio/riba.mp3", info:"Рибата живее във водата и плува. 🐟"},

    ],
    "Л":[
        {name:"Лисица", img:"assets/lisica.png", audio:"audio/lisica.mp3", info:"Лисицата е хитро животно."},
        {name:"Лимонада", img:"assets/limonada.png", audio:"audio/limonada.mp3", info:"Лимонадата е освежаваща напитка."},
        {name:"Лъжица", img:"assets/lachica.png", audio:"audio/lazhica.mp3", info:"Лъжица се използва за ядене."},
        {name:"Лъв", img:"assets/lav.png", audio:"audio/lav.mp3", info:"Лъвът е голямо и силно животно."},
        {name:"Камила", img:"assets/kamila.png", audio:"audio/kamila.mp3", info:"Камилата живее в пустинята и има гърбица."}
    ],
    "В":[
        {name:"Van", img:"assets/van.png", audio:"assets/van.mp3", info:"Камионче - превозно средство."}
    ]
};


// Аудио за самите букви
const letterAudios = {
    "Р": "audio/r.mp3",
    "Л": "audio/l.mp3",
    "В": "assets/audio/letters/В.mp3"
};

// ===============================
// ЕЛЕМЕНТИ
// ===============================

const lettersDiv = document.getElementById("letters");
const letterMenu = document.getElementById("letter-menu");
const gameArea = document.getElementById("game-area");
const bravoBtn = document.getElementById("bravo-btn");
const letterDisplay = document.getElementById("letter-display");

// ===============================
// СЪСТОЯНИЕ
// ===============================

let currentLetter = null;

// ===============================
// СЪЗДАВАНЕ НА БУТОНИ ЗА БУКВИ
// ===============================

Object.keys(words).forEach(letter => {
    const btn = document.createElement("button");
    btn.innerText = letter;
    btn.addEventListener("click", () => startLetterGame(letter));
    lettersDiv.appendChild(btn);
});

// ===============================
// СТАРТИРАНЕ НА ИГРА
// ===============================

function startLetterGame(letter){
    letterMenu.style.display = "none";
    gameArea.style.display = "block";
    bravoBtn.style.display = "block";

    letterDisplay.innerText = letter;
    currentLetter = letter;

    loadObjects(letter);
}

// ===============================
// ЗВУК ПРИ КЛИК НА БУКВАТА
// ===============================

letterDisplay.addEventListener("click", () => {
    if (!currentLetter) return;

    const audioPath = letterAudios[currentLetter];
    if (!audioPath) return;

    new Audio(audioPath).play();
});

// ===============================
// ЗАРЕЖДАНЕ НА КАРТИНКИ
// ===============================

function loadObjects(letter){
    gameArea.innerHTML = "";

    words[letter].forEach(obj => {
        const div = document.createElement("div");
        div.className = "game-object";

        div.style.left = `${Math.random() * (gameArea.clientWidth - 120)}px`;
        div.style.top = `${Math.random() * (gameArea.clientHeight - 120)}px`;

        const img = document.createElement("img");
        img.src = obj.img;
        img.alt = obj.name;
        img.draggable = false;

        div.appendChild(img);
        gameArea.appendChild(div);

        // ▶️ ЛЯВ КЛИК – ЗВУК НА ДУМАТА
        div.addEventListener("click", () => {
            new Audio(obj.audio).play();
        });

        // ℹ️ ДЕСЕН КЛИК – ИНФОРМАЦИЯ
        div.addEventListener("contextmenu", e => {
            e.preventDefault();
            document.getElementById("info-text").innerText = obj.info;
            document.getElementById("info-modal").style.display = "block";
        });

        // ===============================
        // DRAG & DROP
        // ===============================

        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        div.addEventListener("mousedown", e => {
            if (e.button !== 0) return;
            isDragging = true;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
        });

        document.addEventListener("mousemove", e => {
            if (!isDragging) return;

            const rect = gameArea.getBoundingClientRect();
            div.style.left = `${e.clientX - rect.left - offsetX}px`;
            div.style.top = `${e.clientY - rect.top - offsetY}px`;
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });
    });
}

// ===============================
// МОДАЛНО
// ===============================

function closeInfo(){
    document.getElementById("info-modal").style.display = "none";
}

// ===============================
// БРАВО
// ===============================

bravoBtn.addEventListener("click", () => {
    new Audio("audio/bravo1.mp3").play();
    launchConfetti();
});

// ===============================
// КОНФЕТИ
// ===============================

function launchConfetti(){
    const confettiCount = 150; // Повече конфети
    const confettiTypes = ['circle', 'rect', 'triangle']; // Различни форми
    
    for(let i = 0; i < confettiCount; i++){
        const confetti = document.createElement("div");
        const type = confettiTypes[Math.floor(Math.random() * confettiTypes.length)];
        
        // Различни форми
        switch(type){
            case 'circle':
                confetti.style.borderRadius = '50%';
                break;
            case 'triangle':
                confetti.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
                break;
            case 'rect':
                confetti.style.borderRadius = Math.random() > 0.5 ? '2px' : '0';
                break;
        }
        
        // Размери
        const size = 8 + Math.random() * 12;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Цвят - повече вариации
        const colorType = Math.random();
        if(colorType < 0.33){
            confetti.style.backgroundColor = `hsl(${Math.random()*360}, 100%, 60%)`;
        } else if(colorType < 0.66){
            confetti.style.backgroundColor = `hsl(${Math.random()*360}, 80%, 65%)`;
        } else {
            confetti.style.backgroundColor = `hsl(${40 + Math.random()*40}, 100%, 60%)`; // Топли цветове
        }
        
        // Начална позиция - по-разпределена
        const startX = Math.random() * gameArea.clientWidth;
        const startY = -50 - Math.random() * 100;
        
        confetti.style.position = 'absolute';
        confetti.style.left = `${startX}px`;
        confetti.style.top = `${startY}px`;
        confetti.style.zIndex = '9999';
        confetti.style.opacity = '0.9';
        
        // Ротация
        const rotation = Math.random() * 360;
        confetti.style.transform = `rotate(${rotation}deg)`;
        
        gameArea.appendChild(confetti);
        
        // Анимация
        const animation = confetti.animate([
            {
                transform: `translate(${Math.random()*100-50}px, 0px) rotate(${rotation}deg)`,
                opacity: 1
            },
            {
                transform: `translate(${Math.random()*200-100}px, ${gameArea.clientHeight + 100}px) rotate(${rotation + 720}deg)`,
                opacity: 0
            }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.1, 0.8, 0.9, 0.1)',
            fill: 'forwards'
        });
        
        // Премахване след края на анимацията
        animation.onfinish = () => {
            if(confetti.parentNode === gameArea){
                gameArea.removeChild(confetti);
            }
        };
    }
    
    // Звуков ефект за конфети (опционално)
    const confettiSound = new Audio("assets/confetti.mp3");
    confettiSound.volume = 0.3;
    confettiSound.play().catch(() => {
        // Ако няма звуков файл или има грешка, игнорираме
    });
}
