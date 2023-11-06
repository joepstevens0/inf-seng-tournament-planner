import TournamentCard from '../TournamentCard/TournamentCard'

export interface Props{
    cardList?: typeof TournamentCard[],
    className?: string | string[],
}