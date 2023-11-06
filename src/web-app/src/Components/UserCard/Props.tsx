import { User } from '../../typedefs/firebaseTypedefs';

export interface Props{
    user: User,
    onClick?: (user: User) => void
};