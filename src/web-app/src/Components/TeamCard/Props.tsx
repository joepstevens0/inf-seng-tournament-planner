import { Team } from '../../typedefs/firebaseTypedefs';

export interface Props{
    teamId: string,
    team?: Team,
    onClick?: (user: Team) => void
};