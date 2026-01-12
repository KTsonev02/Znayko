// Данни за играта - животни и звуци
const animals = [
{ name: "Котка", sound: "мяу-мяу", image: "🐱", audio: "sound-game-assets/kotka.wav" },
    { name: "Куче", sound: "бау-бау", image: "🐶", audio: "sound-game-assets/kuche.wav" },
    { name: "Крава", sound: "мууу", image: "🐮", audio: "sound-game-assets/krava.wav" },
    { name: "Овца", sound: "беее", image: "🐑", audio: "sound-game-assets/ovca.mp3" },
    { name: "Петел", sound: "кукуригу", image: "🐓", audio: "sound-game-assets/petel.wav" },
    { name: "Гъска", sound: "га-га", image: "🦆", audio: "sound-game-assets/guska.wav" },
    { name: "Кон", sound: "и-хаа", image: "🐴", audio: "sound-game-assets/kon.wav" },
    { name: "Жаба", sound: "квак-квак", image: "🐸", audio: "sound-game-assets/jaba.mp3" },
    { name: "Птица", sound: "чирик-чирик", image: "🐦", audio: "sound-game-assets/ptica.wav" }
];

// Елементи от DOM
const soundsContainer = document.getElementById('sounds-container');
const imagesContainer = document.getElementById('images-container');
const dropContainer = document.getElementById('drop-container');
const checkBtn = document.getElementById('check-btn');
const resetBtn = document.getElementById('reset-btn');
const hintBtn = document.getElementById('hint-btn');
const bravoBtn = document.getElementById('bravo-btn');
const feedbackMessage = document.getElementById('feedback-message');
const scoreElement = document.getElementById('score');

// Променливи за играта
let currentDraggedItem = null;
let score = 0;
let placedAnimals = new Map(); // съхранява slotIndex -> {animalName, element}
let soundElements = [];
let animalElements = [];
let dropSlots = [];

// Инициализация на играта
function initGame() {
    // Разбъркване на животните за случайно подреждане
    const shuffledAnimals = [...animals].sort(() => Math.random() - 0.5);
    
    // Изчистване на контейнерите
    soundsContainer.innerHTML = '';
    imagesContainer.innerHTML = '';
    dropContainer.innerHTML = '';
    
    // Нулиране на играта
    currentDraggedItem = null;
    score = 0;
    placedAnimals.clear();
    soundElements = [];
    animalElements = [];
    dropSlots = [];
    updateScore();
    bravoBtn.style.display = 'none';
    
    // Създаване на звуковите елементи
    shuffledAnimals.forEach((animal, index) => {
        const soundItem = document.createElement('div');
        soundItem.className = 'sound-item';
        soundItem.dataset.index = index;
        soundItem.dataset.animal = animal.name;
        soundItem.innerHTML = `
            <div class="sound-icon">🔊</div>
            <div class="sound-text">${animal.sound}</div>
        `;
        
        soundItem.addEventListener('click', () => playSound(soundItem, animal));
        soundsContainer.appendChild(soundItem);
        soundElements.push(soundItem);
        
        // Създаване на слот за поставяне
        const dropSlot = document.createElement('div');
        dropSlot.className = 'drop-slot';
        dropSlot.dataset.index = index;
        dropSlot.dataset.animal = animal.name; // Очаквано животно
        dropSlot.innerHTML = `<div class="slot-number">${index + 1}</div>`;
        
        // Добавяне на drag and drop функционалност
        dropSlot.addEventListener('dragover', handleDragOver);
        dropSlot.addEventListener('drop', handleDrop);
        dropSlot.addEventListener('dragenter', handleDragEnter);
        dropSlot.addEventListener('dragleave', handleDragLeave);
        dropSlot.addEventListener('click', handleSlotClick);
        
        dropContainer.appendChild(dropSlot);
        dropSlots.push(dropSlot);
    });
    
    // Създаване на животните за плъзгане (в разбъркан ред)
    const shuffledForDrag = [...shuffledAnimals].sort(() => Math.random() - 0.5);
    
    shuffledForDrag.forEach(animal => {
        const animalItem = document.createElement('div');
        animalItem.className = 'animal-item';
        animalItem.dataset.animal = animal.name;
        animalItem.draggable = true;
        animalItem.innerHTML = `
            <div class="animal-emoji">${animal.image}</div>
            <div class="animal-name">${animal.name}</div>
        `;
        
        // Добавяне на drag and drop функционалност
        animalItem.addEventListener('dragstart', handleDragStart);
        animalItem.addEventListener('dragend', handleDragEnd);
        
        imagesContainer.appendChild(animalItem);
        animalElements.push(animalItem);
    });
    
    // Добавяне на звукови ефекти
    setupAudioElements();
}

// Настройване на аудио елементите
function setupAudioElements() {
    console.log("Аудио системата е готова!");
}

// Възпроизвеждане на звук
function playSound(soundElement, animal) {
    // Премахване на анимации от предишни звуци
    soundElements.forEach(el => el.classList.remove('playing'));
    
    // Маркиране на текущия звук
    soundElement.classList.add('playing');
    
    // Симулиране на звуков ефект
    playAnimalSound(animal);
    
    // Ако този звук има поставено животно, маркираме и слот
    const slotIndex = Array.from(dropSlots).findIndex(slot => slot.dataset.animal === animal.name);
    if (slotIndex !== -1 && placedAnimals.has(slotIndex)) {
        dropSlots[slotIndex].classList.add('highlight');
        setTimeout(() => dropSlots[slotIndex].classList.remove('highlight'), 1000);
    }
}

// Симулиране на звук на животно
function playAnimalSound(animal) {
    if (!animal.audio) {
        console.error("Липсва audio за:", animal.name);
        return;
    }

    const audio = new Audio(animal.audio);
    audio.currentTime = 0;
    audio.play().catch(err => {
        console.error("Грешка при пускане на звук:", err);
    });
}

// Drag and Drop функции
function handleDragStart(e) {
    if (this.classList.contains('placed')) {
        e.preventDefault();
        return;
    }
    
    currentDraggedItem = this;
    this.classList.add('dragging');
    
    // Задаване на данни за drag
    e.dataTransfer.setData('text/plain', this.dataset.animal);
    e.dataTransfer.effectAllowed = 'move';
    
    // Показване на всички слотове като активни
    dropSlots.forEach(slot => {
        if (!slot.classList.contains('filled')) {
            slot.classList.add('highlight');
        }
    });
}

function handleDragEnd() {
    this.classList.remove('dragging');
    currentDraggedItem = null;
    
    // Премахване на highlight от всички слотове
    dropSlots.forEach(slot => slot.classList.remove('highlight'));
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    
    if (!currentDraggedItem || currentDraggedItem.classList.contains('placed')) {
        return;
    }
    
    const slotIndex = parseInt(this.dataset.index);
    const animalName = e.dataTransfer.getData('text/plain');
    const expectedAnimal = this.dataset.animal;
    
    // Поставяне на животното в слота
    placeAnimalInSlot(slotIndex, animalName, expectedAnimal);
    
    // Премахване на highlight
    this.classList.remove('highlight');
}

// Функция за поставяне на животно в слот
function placeAnimalInSlot(slotIndex, animalName, expectedAnimal) {
    const slot = dropSlots[slotIndex];
    
    // Проверка дали вече има животно на този слот
    if (placedAnimals.has(slotIndex)) {
        // Връщане на старото животно в колоната
        removeAnimalFromSlot(slotIndex);
    }
    
    // Маркиране на оригиналното животно като поставено
    currentDraggedItem.classList.add('placed');
    currentDraggedItem.style.opacity = '0.4';
    currentDraggedItem.draggable = false;
    
    // Създаване на изображението в слота
    const animalData = animals.find(a => a.name === animalName);
    const animalImage = document.createElement('div');
    animalImage.className = 'slot-image';
    animalImage.innerHTML = `
        <div class="animal-emoji">${animalData.image}</div>
        <div class="animal-name">${animalName}</div>
        <button class="remove-btn" title="Премахни">×</button>
    `;
    
    // Добавяне на бутон за премахване
    const removeBtn = animalImage.querySelector('.remove-btn');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeAnimalFromSlot(slotIndex);
    });
    
    // Поставяне в слота
    slot.innerHTML = `<div class="slot-number">${slotIndex + 1}</div>`;
    slot.appendChild(animalImage);
    slot.classList.add('filled');
    
    // Запазване на съответствието
    placedAnimals.set(slotIndex, {
        name: animalName,
        element: currentDraggedItem
    });
    
    // Проверка за незабавна обратна връзка
    if (animalName === expectedAnimal) {
        slot.classList.remove('incorrect');
        slot.classList.add('correct');
        setTimeout(() => slot.classList.remove('correct'), 1000);
    } else {
        slot.classList.remove('correct');
        slot.classList.add('incorrect');
        setTimeout(() => slot.classList.remove('incorrect'), 1000);
    }
}

// Функция за премахване на животно от слот
function removeAnimalFromSlot(slotIndex) {
    if (!placedAnimals.has(slotIndex)) return;
    
    const placedAnimal = placedAnimals.get(slotIndex);
    const slot = dropSlots[slotIndex];
    
    // Връщане на животното в колоната
    placedAnimal.element.classList.remove('placed');
    placedAnimal.element.style.opacity = '1';
    placedAnimal.element.draggable = true;
    
    // Изчистване на слота
    slot.innerHTML = `<div class="slot-number">${slotIndex + 1}</div>`;
    slot.classList.remove('filled', 'correct', 'incorrect');
    
    // Премахване от записа
    placedAnimals.delete(slotIndex);
}

// Клик върху слот (за мобилни устройства или бързо премахване)
function handleSlotClick(e) {
    if (this.classList.contains('filled') && e.target === this) {
        const slotIndex = parseInt(this.dataset.index);
        removeAnimalFromSlot(slotIndex);
    }
}

function handleDragEnter(e) {
    e.preventDefault();
    if (!this.classList.contains('filled')) {
        this.classList.add('highlight');
    }
}

function handleDragLeave() {
    this.classList.remove('highlight');
}

// Проверка на всички съответствия
function checkAllMatches() {
    let correctCount = 0;
    let hasErrors = false;
    
    // Нулиране на предишни маркировки
    soundElements.forEach(el => {
        el.classList.remove('correct', 'incorrect');
    });
    
    dropSlots.forEach(slot => {
        slot.classList.remove('correct', 'incorrect');
    });
    
    // Проверка на всеки слот
    dropSlots.forEach((slot, index) => {
        const expectedAnimal = slot.dataset.animal;
        const placedAnimal = placedAnimals.get(index);
        
        if (placedAnimal) {
            const soundElement = soundElements.find(el => el.dataset.animal === expectedAnimal);
            
            if (placedAnimal.name === expectedAnimal) {
                // Правилно поставяне
                slot.classList.add('correct');
                if (soundElement) soundElement.classList.add('correct');
                correctCount++;
            } else {
                // Грешно поставяне
                slot.classList.add('incorrect');
                if (soundElement) soundElement.classList.add('incorrect');
                hasErrors = true;
            }
        } else {
            // Празен слот
            const soundElement = soundElements.find(el => el.dataset.animal === expectedAnimal);
            if (soundElement) {
                soundElement.classList.add('incorrect');
                hasErrors = true;
            }
        }
    });
    
    // Обновяване на резултата
    score = correctCount;
    updateScore();
    
    // Показване на обратна връзка
    if (hasErrors) {
        const errorCount = animals.length - correctCount;
        showFeedback(`Има ${errorCount} грешки! Провери отново.`, '#f44336');
        
        // Показване на грешните звуци с анимация
        soundElements.forEach(el => {
            if (el.classList.contains('incorrect')) {
                el.style.animation = 'shake 0.5s';
                setTimeout(() => el.style.animation = '', 500);
            }
        });
    } else if (score === animals.length) {
        showFeedback('Браво! Всичко е вярно! 🎉', '#4caf50');
        setTimeout(() => {
            bravoBtn.style.display = 'block';
        }, 1500);
    } else {
        showFeedback(`Имаш ${score} от ${animals.length} верни!`, '#ff9800');
    }
}

// Функция за помощ/подсказка
function giveHint() {
    // Намираме първия несъответстващ слот
    let emptySlots = [];
    let incorrectSlots = [];
    
    dropSlots.forEach((slot, index) => {
        const expectedAnimal = slot.dataset.animal;
        const placedAnimal = placedAnimals.get(index);
        
        if (!placedAnimal) {
            emptySlots.push({ slot, index, expectedAnimal });
        } else if (placedAnimal.name !== expectedAnimal) {
            incorrectSlots.push({ slot, index, expectedAnimal });
        }
    });
    
    if (emptySlots.length > 0 || incorrectSlots.length > 0) {
        // Даваме подсказка за празен или грешен слот
        const targetSlot = emptySlots.length > 0 ? emptySlots[0] : incorrectSlots[0];
        const expectedAnimal = targetSlot.expectedAnimal;
        
        // Намираме правилното животно
        const correctAnimal = animalElements.find(el => 
            el.dataset.animal === expectedAnimal && !el.classList.contains('placed')
        );
        
        if (correctAnimal) {
            // Маркираме животното и звука
            correctAnimal.style.animation = 'bounce 1s';
            const soundElement = soundElements.find(el => el.dataset.animal === expectedAnimal);
            if (soundElement) {
                soundElement.style.animation = 'pulse-glow 2s';
            }
            
            // Маркираме и слота
            targetSlot.slot.classList.add('highlight');
            
            showFeedback(`Постави ${expectedAnimal} тук`, '#2196f3');
            
            // Премахване на анимациите след време
            setTimeout(() => {
                correctAnimal.style.animation = '';
                if (soundElement) soundElement.style.animation = '';
                targetSlot.slot.classList.remove('highlight');
            }, 2000);
        }
    } else {
        showFeedback('Всичко е наред!', '#4caf50');
    }
}

// Показване на обратна връзка
function showFeedback(message, color) {
    feedbackMessage.textContent = message;
    feedbackMessage.style.background = `linear-gradient(135deg, ${color}, ${darkenColor(color, 20)})`;
    feedbackMessage.style.display = 'block';
    
    setTimeout(() => {
        feedbackMessage.style.display = 'none';
    }, 2000);
}

// Помощна функция за затъмняване на цвят
function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return "#" + (
        0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}

// Обновяване на резултата
function updateScore() {
    scoreElement.textContent = score;
}

// Ивенти
checkBtn.addEventListener('click', checkAllMatches);
resetBtn.addEventListener('click', initGame);
hintBtn.addEventListener('click', giveHint);
bravoBtn.addEventListener('click', () => {
    showFeedback('Супер! Започни нова игра!', '#9c27b0');
    bravoBtn.style.display = 'none';
    initGame();
});

// Стартиране на играта при зареждане
window.addEventListener('DOMContentLoaded', initGame);