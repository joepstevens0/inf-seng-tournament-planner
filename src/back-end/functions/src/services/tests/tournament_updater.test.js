import { selectWinner } from '../tournament_updater';
import { ScheduleFormat } from '../Enums/formats';

/**
 * @author jentevandersanden
 * Jest test file for tournament_updater.ts
 */

test('Updates the tournament state, given a winner', () => {
	// Single elim
	let result1 = [
		[ { team1Id: '1', team2Id: '2', winner: '2' }, { team1Id: '3', team2Id: '4', winner: '' } ],
		[ { team1Id: '2', team2Id: 'T.B.A.', winner: '' } ]
	];
	let result2 = [
		[
			{ team1Id: '1', team2Id: '2', winner: '' },
			{ team1Id: '3', team2Id: '4', winner: '' },
			{ team1Id: '5', team2Id: '6', winner: '' },
			{ team1Id: '7', team2Id: '8', winner: '' }
		],
		[ { team1Id: '2', team2Id: '4', winner: '' }, { team1Id: '5', team2Id: '7', winner: '5' } ],
		[ { team1Id: 'T.B.A.', team2Id: '5', winner: '' } ]
	];
	let result3 = [
		[
			{ team1Id: '1', team2Id: '2', winner: '' },
			{ team1Id: '3', team2Id: '4', winner: '' },
			{ team1Id: '5', team2Id: '6', winner: '' },
			{ team1Id: '7', team2Id: '8', winner: '7' }
		],
		[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' }, { team1Id: '5', team2Id: '7', winner: '' } ],
		[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
	];

	// Round Robin
	let result4 = {
		scores: { '1': 3, '2': 0, '3': 0, '4': 0 },
		schedule: [
			[ { team1Id: '1', team2Id: '2', winner: '1' }, { team1Id: '3', team2Id: '4', winner: '' } ],
			[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
		]
	};

	let result5 = {
		scores: { '1': 3, '2': 1, '3': 0, '4': 0 },
		schedule: [
			[ { team1Id: '1', team2Id: '2', winner: '2' }, { team1Id: '3', team2Id: '4', winner: '' } ],
			[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
		]
	};

	// TEST CASE 1
	expect(
		selectWinner(
			ScheduleFormat.SingleElim,
			[
				[ { team1Id: '1', team2Id: '2', winner: '' }, { team1Id: '3', team2Id: '4', winner: '' } ],
				[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
			],
			0,
			[ '2' ],
			null
		).schedule
	).toEqual(result1);

	// TEST CASE 2
	expect(
		selectWinner(
			ScheduleFormat.SingleElim,
			[
				[
					{ team1Id: '1', team2Id: '2', winner: '' },
					{ team1Id: '3', team2Id: '4', winner: '' },
					{ team1Id: '5', team2Id: '6', winner: '' },
					{ team1Id: '7', team2Id: '8', winner: '' }
				],
				[ { team1Id: '2', team2Id: '4', winner: '' }, { team1Id: '5', team2Id: '7', winner: '' } ],
				[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
			],
			1,
			[ '5' ],
			null
		).schedule
	).toEqual(result2);

	expect(
		selectWinner(
			ScheduleFormat.SingleElim,
			[
				[
					{ team1Id: '1', team2Id: '2', winner: '' },
					{ team1Id: '3', team2Id: '4', winner: '' },
					{ team1Id: '5', team2Id: '6', winner: '' },
					{ team1Id: '7', team2Id: '8', winner: '' }
				],
				[
					{ team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' },
					{ team1Id: '5', team2Id: 'T.B.A.', winner: '' }
				],
				[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
			],
			0,
			[ '7' ],
			null
		).schedule
	).toEqual(result3);

	expect(
		selectWinner(
			ScheduleFormat.RoundRobin,
			[
				[ { team1Id: '1', team2Id: '2', winner: '2' }, { team1Id: '3', team2Id: '4', winner: '' } ],
				[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
			],
			0,
			[ '1' ],
			{ '1': 0, '2': 0, '3': 0, '4': 0 }
		)
	).toEqual(result4);
	expect(
		selectWinner(
			ScheduleFormat.RoundRobin,
			[
				[ { team1Id: '1', team2Id: '2', winner: '2' }, { team1Id: '3', team2Id: '4', winner: '' } ],
				[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
			],
			0,
			[ '2' ],
			{ '1': 3, '2': 0, '3': 0, '4': 0 },
			true
		)
	).toEqual(result5);
});
