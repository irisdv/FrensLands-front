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
  }

  componentDidUpdate(prevProps: any, prevState: any) {}

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  // ******************* EVENT LISTENERS ******************* //
  handleResize = () => {
    this.viewGL.onWindowResize(window.innerWidth, window.innerHeight);
  };

  render() {
    return (
      <div className="canvasContainer">
        <canvas ref={this.canvasRef} />
      </div>
    );
  }
}
