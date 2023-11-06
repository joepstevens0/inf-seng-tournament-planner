import { Game } from '../../typedefs/firebaseTypedefs';

export interface Props{
    game: Game,
    onClick?: (game: Game) => void
};