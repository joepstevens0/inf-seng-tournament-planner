import { checkIfStageCompleted } from '../check_if_stage_completed';

/**
 * @author jentevandersanden
 * Jest test file for check_if_stage_completed.ts
 */

test('Checks whether a certain stage is completed in a tournament', () => {
	let result1 = true;
	let result2 = false;
	let result3 = true;

	expect(
		checkIfStageCompleted(0, [
			[
				{ team1Id: '1', team2Id: '2', winner: '1' },
				{ team1Id: '3', team2Id: '4', winner: '4' },
				{ team1Id: '5', team2Id: '6', winner: '6' },
				{ team1Id: '7', team2Id: '8', winner: '8' }
			],
			[
				{ team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' },
				{ team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' }
			],
			[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
		])
	).toEqual(result1);

	expect(
		checkIfStageCompleted(1, [
			[
				{ team1Id: '1', team2Id: '2', winner: '1' },
				{ team1Id: '3', team2Id: '4', winner: '4' },
				{ team1Id: '5', team2Id: '6', winner: '6' },
				{ team1Id: '7', team2Id: '8', winner: '8' }
			],
			[ { team1Id: '1', team2Id: '4', winner: '4' }, { team1Id: '5', team2Id: '8', winner: '' } ],
			[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
		])
	).toEqual(result2);

	expect(
		checkIfStageCompleted(1, [
			[
				{ team1Id: '1', team2Id: '2', winner: '1' },
				{ team1Id: '3', team2Id: '4', winner: '4' },
				{ team1Id: '5', team2Id: '6', winner: '6' },
				{ team1Id: '7', team2Id: '8', winner: '8' }
			],
			[ { team1Id: '1', team2Id: '4', winner: '4' }, { team1Id: '5', team2Id: '8', winner: '8' } ],
			[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
		])
	).toEqual(result3);
});
