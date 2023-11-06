import { Lobby } from '../../typedefs/firebaseTypedefs';

export interface Props{
    allLobbies: Lobby[];
    onFilter: (filterdLobbies: Lobby[]) => void;
}