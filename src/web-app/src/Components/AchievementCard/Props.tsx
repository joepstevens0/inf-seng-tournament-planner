import { Achievement } from '../../typedefs/firebaseTypedefs';

export interface Props{
    achievementId?: string,
    onClick?: (achievement: Achievement) => void,
    date?: number,
    achievementData?: Achievement
};