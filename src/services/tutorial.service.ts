const TUTORIAL_EVENT = "tutorial";
let tutorialFrames = ['initial'];

export const tutorialService = { newTutorial, nextTutorialFrame, TUTORIAL_EVENT };

function newTutorial(frames: string[]): void {
  tutorialFrames = frames;
  window.dispatchEvent(
    new CustomEvent(TUTORIAL_EVENT, {
      detail: {
        currentFrame: tutorialFrames[0],
        frames: tutorialFrames
      },
    })
  );
}

function nextTutorialFrame(frame: string): void {
  let currentFrame = "";
  const index = tutorialFrames.findIndex(f => f == frame);
  if (index && tutorialFrames.length > (index +1)) {
    currentFrame = tutorialFrames[index+1]
  }
  window.dispatchEvent(
    new CustomEvent(TUTORIAL_EVENT, {
      detail: {
        currentFrame: frame,
        frames:tutorialFrames
      },
    })
  );
}
