import { schedule } from '../schedule';
import { ScheduleFormat } from '../Enums/formats';
/**
 * @author jentevandersanden
 * Jest test file for schedule.ts
 */

test('Generates an initial tournament schedule, given a certain scheduling format', () => {
	// Single Elim
	let result1 = [
		[
			{ team1Id: '1', team2Id: '2', winner: '' },
			{ team1Id: '3', team2Id: '4', winner: '' },
			{ team1Id: '5', team2Id: '6', winner: '' },
			{ team1Id: '7', team2Id: '8', winner: '' }
		],
		[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' }, { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ],
		[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
	];
	let result2 = [
		[ { team1Id: '3', team2Id: '8', winner: '' }, { team1Id: '6', team2Id: '2', winner: '' } ],
		[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
	];
	let result3 = [];

	// Round Robin
	let result4 = [
		[
			{ team1Id: '1', team2Id: '5', winner: '' },
			{ team1Id: '2', team2Id: '4', winner: '' },
			{ team1Id: '3', team2Id: '8', winner: '' },
			{ team1Id: '6', team2Id: '7', winner: '' }
		],
		[
			{ team1Id: '7', team2Id: '4', winner: '' },
			{ team1Id: '1', team2Id: '3', winner: '' },
			{ team1Id: '2', team2Id: '8', winner: '' },
			{ team1Id: '5', team2Id: '6', winner: '' }
		],
		[
			{ team1Id: '6', team2Id: '3', winner: '' },
			{ team1Id: '7', team2Id: '2', winner: '' },
			{ team1Id: '1', team2Id: '8', winner: '' },
			{ team1Id: '4', team2Id: '5', winner: '' }
		],
		[
			{ team1Id: '5', team2Id: '2', winner: '' },
			{ team1Id: '6', team2Id: '1', winner: '' },
			{ team1Id: '7', team2Id: '8', winner: '' },
			{ team1Id: '3', team2Id: '4', winner: '' }
		],
		[
			{ team1Id: '4', team2Id: '1', winner: '' },
			{ team1Id: '5', team2Id: '7', winner: '' },
			{ team1Id: '6', team2Id: '8', winner: '' },
			{ team1Id: '2', team2Id: '3', winner: '' }
		],
		[
			{ team1Id: '3', team2Id: '7', winner: '' },
			{ team1Id: '4', team2Id: '6', winner: '' },
			{ team1Id: '5', team2Id: '8', winner: '' },
			{ team1Id: '1', team2Id: '2', winner: '' }
		],
		[
			{ team1Id: '2', team2Id: '6', winner: '' },
			{ team1Id: '3', team2Id: '5', winner: '' },
			{ team1Id: '4', team2Id: '8', winner: '' },
			{ team1Id: '7', team2Id: '1', winner: '' }
		]
	];

	let result5 = [];
	let result6 = [
		[
			{ team1Id: '1', team2Id: '9', winner: '' },
			{ team1Id: '2', team2Id: '8', winner: '' },
			{ team1Id: '3', team2Id: '7', winner: '' },
			{ team1Id: '4', team2Id: '6', winner: '' },
			{ team1Id: '5', team2Id: '16', winner: '' },
			{ team1Id: '10', team2Id: '15', winner: '' },
			{ team1Id: '11', team2Id: '14', winner: '' },
			{ team1Id: '12', team2Id: '13', winner: '' }
		],
		[
			{ team1Id: '15', team2Id: '8', winner: '' },
			{ team1Id: '1', team2Id: '7', winner: '' },
			{ team1Id: '2', team2Id: '6', winner: '' },
			{ team1Id: '3', team2Id: '5', winner: '' },
			{ team1Id: '4', team2Id: '16', winner: '' },
			{ team1Id: '9', team2Id: '14', winner: '' },
			{ team1Id: '10', team2Id: '13', winner: '' },
			{ team1Id: '11', team2Id: '12', winner: '' }
		],
		[
			{ team1Id: '14', team2Id: '7', winner: '' },
			{ team1Id: '15', team2Id: '6', winner: '' },
			{ team1Id: '1', team2Id: '5', winner: '' },
			{ team1Id: '2', team2Id: '4', winner: '' },
			{ team1Id: '3', team2Id: '16', winner: '' },
			{ team1Id: '8', team2Id: '13', winner: '' },
			{ team1Id: '9', team2Id: '12', winner: '' },
			{ team1Id: '10', team2Id: '11', winner: '' }
		],
		[
			{ team1Id: '13', team2Id: '6', winner: '' },
			{ team1Id: '14', team2Id: '5', winner: '' },
			{ team1Id: '15', team2Id: '4', winner: '' },
			{ team1Id: '1', team2Id: '3', winner: '' },
			{ team1Id: '2', team2Id: '16', winner: '' },
			{ team1Id: '7', team2Id: '12', winner: '' },
			{ team1Id: '8', team2Id: '11', winner: '' },
			{ team1Id: '9', team2Id: '10', winner: '' }
		],
		[
			{ team1Id: '12', team2Id: '5', winner: '' },
			{ team1Id: '13', team2Id: '4', winner: '' },
			{ team1Id: '14', team2Id: '3', winner: '' },
			{ team1Id: '15', team2Id: '2', winner: '' },
			{ team1Id: '1', team2Id: '16', winner: '' },
			{ team1Id: '6', team2Id: '11', winner: '' },
			{ team1Id: '7', team2Id: '10', winner: '' },
			{ team1Id: '8', team2Id: '9', winner: '' }
		],
		[
			{ team1Id: '11', team2Id: '4', winner: '' },
			{ team1Id: '12', team2Id: '3', winner: '' },
			{ team1Id: '13', team2Id: '2', winner: '' },
			{ team1Id: '14', team2Id: '1', winner: '' },
			{ team1Id: '15', team2Id: '16', winner: '' },
			{ team1Id: '5', team2Id: '10', winner: '' },
			{ team1Id: '6', team2Id: '9', winner: '' },
			{ team1Id: '7', team2Id: '8', winner: '' }
		],
		[
			{ team1Id: '10', team2Id: '3', winner: '' },
			{ team1Id: '11', team2Id: '2', winner: '' },
			{ team1Id: '12', team2Id: '1', winner: '' },
			{ team1Id: '13', team2Id: '15', winner: '' },
			{ team1Id: '14', team2Id: '16', winner: '' },
			{ team1Id: '4', team2Id: '9', winner: '' },
			{ team1Id: '5', team2Id: '8', winner: '' },
			{ team1Id: '6', team2Id: '7', winner: '' }
		],
		[
			{ team1Id: '9', team2Id: '2', winner: '' },
			{ team1Id: '10', team2Id: '1', winner: '' },
			{ team1Id: '11', team2Id: '15', winner: '' },
			{ team1Id: '12', team2Id: '14', winner: '' },
			{ team1Id: '13', team2Id: '16', winner: '' },
			{ team1Id: '3', team2Id: '8', winner: '' },
			{ team1Id: '4', team2Id: '7', winner: '' },
			{ team1Id: '5', team2Id: '6', winner: '' }
		],
		[
			{ team1Id: '8', team2Id: '1', winner: '' },
			{ team1Id: '9', team2Id: '15', winner: '' },
			{ team1Id: '10', team2Id: '14', winner: '' },
			{ team1Id: '11', team2Id: '13', winner: '' },
			{ team1Id: '12', team2Id: '16', winner: '' },
			{ team1Id: '2', team2Id: '7', winner: '' },
			{ team1Id: '3', team2Id: '6', winner: '' },
			{ team1Id: '4', team2Id: '5', winner: '' }
		],
		[
			{ team1Id: '7', team2Id: '15', winner: '' },
			{ team1Id: '8', team2Id: '14', winner: '' },
			{ team1Id: '9', team2Id: '13', winner: '' },
			{ team1Id: '10', team2Id: '12', winner: '' },
			{ team1Id: '11', team2Id: '16', winner: '' },
			{ team1Id: '1', team2Id: '6', winner: '' },
			{ team1Id: '2', team2Id: '5', winner: '' },
			{ team1Id: '3', team2Id: '4', winner: '' }
		],
		[
			{ team1Id: '6', team2Id: '14', winner: '' },
			{ team1Id: '7', team2Id: '13', winner: '' },
			{ team1Id: '8', team2Id: '12', winner: '' },
			{ team1Id: '9', team2Id: '11', winner: '' },
			{ team1Id: '10', team2Id: '16', winner: '' },
			{ team1Id: '15', team2Id: '5', winner: '' },
			{ team1Id: '1', team2Id: '4', winner: '' },
			{ team1Id: '2', team2Id: '3', winner: '' }
		],
		[
			{ team1Id: '5', team2Id: '13', winner: '' },
			{ team1Id: '6', team2Id: '12', winner: '' },
			{ team1Id: '7', team2Id: '11', winner: '' },
			{ team1Id: '8', team2Id: '10', winner: '' },
			{ team1Id: '9', team2Id: '16', winner: '' },
			{ team1Id: '14', team2Id: '4', winner: '' },
			{ team1Id: '15', team2Id: '3', winner: '' },
			{ team1Id: '1', team2Id: '2', winner: '' }
		],
		[
			{ team1Id: '4', team2Id: '12', winner: '' },
			{ team1Id: '5', team2Id: '11', winner: '' },
			{ team1Id: '6', team2Id: '10', winner: '' },
			{ team1Id: '7', team2Id: '9', winner: '' },
			{ team1Id: '8', team2Id: '16', winner: '' },
			{ team1Id: '13', team2Id: '3', winner: '' },
			{ team1Id: '14', team2Id: '2', winner: '' },
			{ team1Id: '15', team2Id: '1', winner: '' }
		],
		[
			{ team1Id: '3', team2Id: '11', winner: '' },
			{ team1Id: '4', team2Id: '10', winner: '' },
			{ team1Id: '5', team2Id: '9', winner: '' },
			{ team1Id: '6', team2Id: '8', winner: '' },
			{ team1Id: '7', team2Id: '16', winner: '' },
			{ team1Id: '12', team2Id: '2', winner: '' },
			{ team1Id: '13', team2Id: '1', winner: '' },
			{ team1Id: '14', team2Id: '15', winner: '' }
		],
		[
			{ team1Id: '2', team2Id: '10', winner: '' },
			{ team1Id: '3', team2Id: '9', winner: '' },
			{ team1Id: '4', team2Id: '8', winner: '' },
			{ team1Id: '5', team2Id: '7', winner: '' },
			{ team1Id: '6', team2Id: '16', winner: '' },
			{ team1Id: '11', team2Id: '1', winner: '' },
			{ team1Id: '12', team2Id: '15', winner: '' },
			{ team1Id: '13', team2Id: '14', winner: '' }
		]
	];

	// TEST CASE 1
	expect(schedule(ScheduleFormat.SingleElim, [ '1', '2', '3', '4', '5', '6', '7', '8' ])).toEqual(result1);

	// TEST CASE 2
	expect(schedule(ScheduleFormat.SingleElim, [ '3', '8', '6', '2' ])).toEqual(result2);

	// TEST CASE 3
	expect(schedule(ScheduleFormat.SingleElim, [])).toEqual(result3);

	// TEST CASE 4
	expect(schedule(ScheduleFormat.RoundRobin, [ '1', '2', '3', '4', '5', '6', '7', '8' ])).toEqual(result4);

	// TEST CASE 5
	expect(schedule(ScheduleFormat.RoundRobin, [])).toEqual(result5);

	// TEST CASE 6
	expect(
		schedule(ScheduleFormat.RoundRobin, [
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'10',
			'11',
			'12',
			'13',
			'14',
			'15',
			'16'
		])
	).toEqual(result6);
});
