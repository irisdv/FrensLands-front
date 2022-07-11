import React, { useContext } from "react";
import ViewGL from "./ViewGL";
import { GameState } from "../contexts/GameContext";
import { gsap, SteppedEase } from "gsap";
import { MenuBar } from "../components/GameUI/MenuBar";
import { BottomBar } from "../components/GameUI/BottomBar";
import { useGameContext } from "../hooks/useGameContext";
import { BuildingFrame } from "../components/GameUI/BuildingFrame";

export default class Scene extends React.Component {
  private canvasRef: any;
  private viewGL: any;

  static contextGame = GameState;

  constructor(props: any) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    this.viewGL = new ViewGL(canvas);
    this.handleResize();

    window.addEventListener("resize", this.handleResize, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    document.addEventListener("mousedown", this.onDocumentMouseDown, false);
    document.addEventListener("mouseup", this.onDocumentMouseUp, false);
    document.addEventListener("keydown", this.onDocumentKeyDown, true);
    document.addEventListener("keyup", this.onDocumentKeyUp, true);
    document.addEventListener("wheel", this.onMouseWheel, true);
    document.addEventListener("contextmenu", function (e){e.preventDefault()}, false);
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    // Context data
    console.log("New data received from parent components", prevProps);
    this.viewGL.onReceivedUpdatedData(prevProps);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("mousemove", this.onDocumentMouseMove);
    document.removeEventListener("mousedown", this.onDocumentMouseDown);
    document.removeEventListener("mouseup", this.onDocumentMouseUp);
    document.removeEventListener("keydown", this.onDocumentKeyDown);
    document.removeEventListener("keyup", this.onDocumentKeyUp);
    document.removeEventListener("wheel", this.onMouseWheel);
    document.removeEventListener("contextmenu", function (e){e.preventDefault()});
  }

  // ******************* EVENT LISTENERS ******************* //
  handleResize = () => {
    this.viewGL.onWindowResize(window.innerWidth, window.innerHeight);
  };
  onDocumentMouseMove = (event: any) => {
    this.viewGL.onDocumentMouseMove(event);
  };
  onDocumentMouseDown = (event: any) => {
    this.viewGL.onDocumentMouseDown(event);
  };
  onDocumentMouseUp = (event: any) => {
    this.viewGL.onDocumentMouseUp(event);
  };
  onDocumentKeyDown = (event: any) => {
    this.viewGL.onDocumentKeyDown(event);
  };
  onDocumentKeyUp = (event: any) => {
    this.viewGL.onDocumentKeyUp(event);
  };
  onMouseWheel = (event: any) => {
    this.viewGL.onMouseWheel(event);
  };

  render() {
    return (
      <div>
        <MenuBar />
        <div className="canvasContainer">
          <canvas ref={this.canvasRef} />
        </div>
        <BuildingFrame />
        <BottomBar />
      </div>
    );
  }
}