/// html 
<div class="container">
  <div class="button-wrapper">
    <button id="chars" class="button">Characters</button>
    <button id="words" class="button">Words</button>
    <button id="lines" class="button">Lines</button>
  </div>
  <div class="text">
    Break apart HTML text into characters, words, and/or lines for easy animation.
  </div>

</div>

// csss
html,
body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;
}

.container {
  position: relative;
  width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 9px;
}

.text {
  color: #dfdcff;
  font-size: clamp(2rem, 12rem, 5vw);
  line-height: 1.2;
  box-sizing: border-box;
  padding: 5%;
  width: 100%;
  text-align: center;
  perspective: 500px;
}

.button-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}


//// js 

gsap.registerPlugin(SplitText);

let split, animation;
document.querySelector("#chars").addEventListener("click", () => {
  animation && animation.revert();
  animation = gsap.from(split.chars, {
    x: 150,
    opacity: 0,
    duration: 0.7, 
    ease: "power4",
    stagger: 0.04
  })
});

document.querySelector("#words").addEventListener("click", () => {
  animation && animation.revert();
  animation = gsap.from(split.words, {
    y: -100,
    opacity: 0,
    rotation: "random(-80, 80)",
    duration: 0.7, 
    ease: "back",
    stagger: 0.15
  })
});

document.querySelector("#lines").addEventListener("click", () => {
  animation && animation.revert();
  animation = gsap.from(split.lines, {
    rotationX: -100,
    transformOrigin: "50% 50% -160px",
    opacity: 0,
    duration: 0.8, 
    ease: "power3",
    stagger: 0.25
  })
});

function setup() {
  split && split.revert();
  animation && animation.revert();
  split = SplitText.create(".text", {type:"chars,words,lines"});
}
setup();
window.addEventListener("resize", setup);