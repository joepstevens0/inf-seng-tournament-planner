import { Tournament } from '../../typedefs/firebaseTypedefs';

export interface Props{
    tournament: Tournament,
    onClick?: (tournament: Tournament) => void
};