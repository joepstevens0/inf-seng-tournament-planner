import { Match, Team } from "../../typedefs/firebaseTypedefs";
import { IDictionary } from "../customDictionary";

/**
 * @author jentevandersanden, brentzoomers
 */

/**
 * Interface which abstracts the entity `TournamentDrawer`, this is an object that will be responsible for
 * drawing out a graphic representation of the Tournament's current standings based on a certain format.
 */
export interface TournamentDrawer {
  /**
   * Calculates the Konva Elements that will need to be drawn on a Konva - canvas.
   * @param amountTeams The amount of teams participating in the tournament
   * @param schedule The representation of the standings of this tournament,
   * 				   this must be conform to a certain format, depending on
   * 				   the scheduling format.
   * @returns {Array<JSX.Element>} An array of JSX (Konva) elements which together
   * 								 form the graphical representation of the tournament
   * 								 in question.
   */
  draw(
    amountTeams: number,
    schedule: Array<Array<Match>>,
    onTeamClick: Function,
    stageNumber: number,
    previousWinners: Array<Array<string>>,
    teamMap: IDictionary<Team>,
    scoreMap: IDictionary<number>
  ): Array<JSX.Element>;
}
