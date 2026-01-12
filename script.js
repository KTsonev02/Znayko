function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    document.getElementById("clock").innerText = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000);
updateClock();

// SLIDER
const slides = [
    "assets/elephant_slider.png",
    "assets/dog_slider.png",
    "assets/cat_slider.png",
    "assets/fish_slider.png"
];
let index = 0;

setInterval(() => {
    index = (index + 1) % slides.length;
    document.getElementById("slider-image").src = slides[index];
}, 4000);

// GAME
function startGame() {
    alert("🎉 Тук ще стартира играта!");
}

// MODAL
function openInfo(type) {
    const data = {
        info1: "Детето избира буква от меню. \n След избор на буква се показват картинки (предмети/животни/цветове и т.н.), които съдържат тази буква. \n Когато детето цъкне върху картинка, се пуска аудио, което казва думата.",
        info2: "Натисни звука, за да го чуеш. Дръпни картинката до съответния звук. Докосни картинката в полето, за да я махнеш. Натисни Провери за да видиш дали си познал/а!",
    };
    document.getElementById("modal-text").innerText = data[type];   
    document.getElementById("modal").style.display = "block";
}

function closeInfo() {
    document.getElementById("modal").style.display = "none";
}