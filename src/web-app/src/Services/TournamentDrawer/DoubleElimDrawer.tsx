import { Match, Team } from "../../typedefs/firebaseTypedefs";
import { TournamentDrawer } from "./TournamentDrawer";
import { IDictionary } from "../customDictionary";

/**
 * @author jentevandersanden, brentzoomers
 */

/**
 * Class which is responsible for drawing the Double Elimination tournament format on the Konva canvas.
 */
export default class DoubleElimDrawer implements TournamentDrawer {
  /**
   * @see TournamentDrawer.draw
   */
  draw(
    amountTeams: number,
    schedule: Array<Array<Match>>,
    onTeamClick: Function,
    stageNumber: number = 0,
    previousWinners: Array<Array<string>>,
    teamMap: IDictionary<Team>,
    scoreMap: IDictionary<number> = {}
  ): Array<JSX.Element> {
    // TODO: Implement
    return [];
  }
}
