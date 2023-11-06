import {Tournament } from '../../typedefs/firebaseTypedefs';

export interface Props{
    allTournaments: Tournament[];
    onFilter: (filterdTournaments: Tournament[]) => void;
}