import React from "react";
import ViewGL from "./ViewGL";

export default class Scene extends React.Component {
  private canvasRef: any;
  private viewGL: any;

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
  }

  componentDidUpdate(prevProps: any, prevState: any) {}

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("mousemove", this.onDocumentMouseMove);
    document.removeEventListener("mousedown", this.onDocumentMouseDown);
    document.removeEventListener("mouseup", this.onDocumentMouseUp);
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

  render() {
    return (
      <div className="canvasContainer">
        <canvas ref={this.canvasRef} />
      </div>
    );
  }
}
