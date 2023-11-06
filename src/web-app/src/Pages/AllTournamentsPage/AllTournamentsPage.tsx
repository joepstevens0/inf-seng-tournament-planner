import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AllTournamentsPage.module.css';
import TournamentCard from '../../Components/TournamentCard/TournamentCard';
import TournamentCardContainer from '../../Components/TournamentCardContainer/TournamentCardContainer';
import TournamentFilter from '../../Components/TournamentFilter/TournamentFilter';
import { getAllTournaments } from "../../Services/FirebaseFunctions/tournament";
import { Tournament } from '../../typedefs/firebaseTypedefs';
import image from './BannerExamples/test_banner.png';
import { AddCircle } from '@material-ui/icons';
import { Button } from "@material-ui/core";


/**
 * @author seansnellinx
 * Page which displays all tournaments registered on the platform.
 */
function AllTournamentsPage(props: any) {
	const [ tournaments, setTournaments ] = useState([] as Tournament[]);
	const [ shownTournaments, showTournaments ] = useState([] as Tournament[]);
	/**
	 * get all tournament objects from the database
	 * @post the tournament in the data state are filled with the tournament from the database
	 */
	async function getTournaments() {
		console.debug('Retrieving tournament objects from database...');
		await getAllTournaments().then((response: any) => {
			if (response.status === 200) setTournaments(response.body);
		});
	}

	/**
	 * called on apply of the filter, shows the received tournaments
	 * @param filteredTournaments list of filtered tournaments received
	 * @post shows the filteredTournaments to the user
	 */
	function onFilter(filteredTournaments: Tournament[]) {
		showTournaments(filteredTournaments);
	}

	// On mounting
	useEffect(() => {
		getTournaments();
	}, []);

	// create a list item for every tournament
	let listItems = shownTournaments.map((tournamentvar: Tournament) => (
		<TournamentCard key={"TOUR:" + tournamentvar.id} img={image} tournament={tournamentvar} />
	));

	if (listItems.length <= 0){
		listItems = [<div key={"NOTOURNAMENTSFOUND"}>No tournaments found</div>];
	}

	return (
		<div>
			<h1>All Tournaments</h1>
			<div className={styles.header}>
			  <Link to="/createtournament" className={styles.create_link}>

				<Button variant="contained" color="secondary" className={styles.button_style}>
				Create Own Tournament
					
          		</Button>
			  </Link>
			</div>
			<TournamentFilter allTournaments={tournaments} onFilter={onFilter} />

			<TournamentCardContainer>
				{listItems}
			</TournamentCardContainer>
		</div>
	);
}

export default AllTournamentsPage;
