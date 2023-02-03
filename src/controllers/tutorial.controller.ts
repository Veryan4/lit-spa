import { ReactiveControllerHost} from "lit";
import { tutorialService } from "../services";
import "../components/tutorial/tutorial";

export class TutorialController {
  private host: ReactiveControllerHost;
  private tutorialFrames: string[];

  currentFrame: string;

  _newTutorial = (e: CustomEvent) => {
    const tutorialFrames: string[] = e.detail.frames;
    const currentFrame: string = e.detail.frames;
    if (this.tutorialFrames !== tutorialFrames || this.currentFrame !== currentFrame) {
      this.tutorialFrames = tutorialFrames;
      this.currentFrame = currentFrame;
      this.host.requestUpdate();
    }
  };

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected(): void {
    window.addEventListener(
      tutorialService.TUTORIAL_EVENT,
      this._newTutorial as EventListener
    );
  }

  hostDisconnected(): void {
    window.removeEventListener(
      tutorialService.TUTORIAL_EVENT,
      this._newTutorial as EventListener
    );
  }
}
