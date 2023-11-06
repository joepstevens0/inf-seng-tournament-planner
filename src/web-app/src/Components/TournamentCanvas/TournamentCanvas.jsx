import React, { Component } from "react";

import { Stage, Layer } from "react-konva";
import SingleElimDrawer from "../../Services/TournamentDrawer/SingleElimDrawer";
import { ScheduleFormat } from "../../Services/Enums/formats";
import DoubleElimDrawer from "../../Services/TournamentDrawer/DoubleElimDrawer";
import RoundRobinDrawer from "../../Services/TournamentDrawer/RoundRobinDrawer";
import DefaultDrawer from "../../Services/TournamentDrawer/DefaultDrawer";

import styles from "./TournamentCanvas.module.css";

export default class TournamentCanvas extends Component {
  state = {
    stageScale: 1,
    stageX: 0,
    stageY: 0,
    name: this.props.name,
    amountTeams: 0,
    arrayTeamNames: [],
    container: undefined,
    format: this.props.format,
    drawer: new DefaultDrawer(),
    previousWinners: this.props.previousWinners,
    scores: this.props.scoreMap,
  };

  // Called on object mount lifecycle state
  componentDidMount() {
    // console.log(this.state.name);
    let newContainer = document.getElementsByClassName(this.state.name)[0];
    let formatDrawer = null;

    switch (this.state.format) {
      case ScheduleFormat.SingleElim:
        formatDrawer = new SingleElimDrawer();
        break;
      case ScheduleFormat.DoubleElim:
        formatDrawer = new DoubleElimDrawer();
        break;
      case ScheduleFormat.RoundRobin:
        formatDrawer = new RoundRobinDrawer();
        break;
      default:
        formatDrawer = new DefaultDrawer();
        break;
    }

    this.setState({
      stageScale: 1,
      stageX: 0,
      stageY: 0,
      name: this.props.name,
      amountTeams: this.props.amountTeams,
      arrayTeamNames: this.props.arrayTeamNames,
      container: newContainer,
      format: this.state.format,
      drawer: formatDrawer,
      previousWinners: this.props.previousWinners,
      scores: this.props.scoreMap,
    });
  }

  componentDidUpdate() {
    if (this.props.previousWinners !== this.state.previousWinners) {
      this.setState({
        stageScale: 1,
        stageX: 0,
        stageY: 0,
        name: this.props.name,
        amountTeams: this.props.amountTeams,
        arrayTeamNames: this.props.arrayTeamNames,
        container: this.state.container,
        format: this.state.format,
        drawer: this.state.drawer,
        previousWinners: this.props.previousWinners,
        scores: this.props.scoreMap,
      });
    }
    if (this.props.format !== this.state.format) {
      this.updateDrawer();
    }
  }

  updateDrawer() {
    let formatDrawer = null;
    switch (this.props.format) {
      case ScheduleFormat.SingleElim:
        formatDrawer = new SingleElimDrawer();
        break;
      case ScheduleFormat.DoubleElim:
        formatDrawer = new DoubleElimDrawer();
        break;
      case ScheduleFormat.RoundRobin:
        formatDrawer = new RoundRobinDrawer();
        break;
      default:
        formatDrawer = new DefaultDrawer();
        break;
    }

    this.setState({
      stageScale: 1,
      stageX: 0,
      stageY: 0,
      name: this.props.name,
      amountTeams: this.props.amountTeams,
      arrayTeamNames: this.props.arrayTeamNames,
      container: this.state.container,
      format: this.props.format,
      drawer: formatDrawer,
      previousWinners: this.props.previousWinners,
      scores: this.state.scores,
    });
  }

  /**
   * Handles mouse scroll events on the Tournament Canvas.
   * @param {React.WheelEvent} e
   */
  handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 0.55;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    this.setState({
      stageScale: newScale,
      stageX:
        -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
      stageY:
        -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale,
    });
  };



  render() {
    let newWidth =
      this.state.container === undefined ? 0 : this.state.container.clientWidth;
    let newHeight =
      this.state.container === undefined
        ? 0
        : this.state.container.clientHeight;

    return (
      <div className={styles.tournamentcanvas_bg}>
        <Stage
          width={newWidth}
          height={newHeight}
          color={"white"}
          onWheel={this.handleWheel}
          scaleX={this.state.stageScale}
          scaleY={this.state.stageScale}
          x={this.state.stageX}
          y={this.state.stageY}
          draggable
        >
          <Layer>
            {this.state.drawer.draw(
              this.props.amountTeams,
              this.props.arrayTeamNames,
              this.props.onTeamClick,
              this.props.stage,
              this.state.previousWinners,
              this.props.teamMap,
              this.state.scores
            )}
          </Layer>
        </Stage>
      </div>
    );
  }
}

// render(<TournamentCanvas />, document.getElementById("root"));
