import { convertFirestoreObjectToNestedArray, convertNestedArrayToFirestoreObject } from '../converters';
import { connvertFirestoreObjectToNestedArray } from '../converters';

/**
 * @author jentevandersanden
 * Jest test file for converter.ts
 */

test('Converts a nested array of any depth into the correct firestore format', () => {
	let result1 = [
		{
			data: [
				{ team1Id: '1', team2Id: '2', winner: '' },
				{ team1Id: '3', team2Id: '4', winner: '' },
				{ team1Id: '5', team2Id: '6', winner: '' },
				{ team1Id: '7', team2Id: '8', winner: '' }
			]
		},
		{
			data: [
				{ team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' },
				{ team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' }
			]
		},
		{ data: [ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ] }
	];
	let result2 = [
		{ data: [ { data: [ '2', '3' ] }, { data: [ '4', '5' ] }, { data: [ '6', '7' ] } ] },
		{ data: [] },
		{ data: [] }
	];
	let result3 = [ { data: [] }, { data: [] }, { data: [ { data: [ { data: [] } ] } ] } ];

	// TEST CASE 1
	expect(
		convertNestedArrayToFirestoreObject([
			[
				{ team1Id: '1', team2Id: '2', winner: '' },
				{ team1Id: '3', team2Id: '4', winner: '' },
				{ team1Id: '5', team2Id: '6', winner: '' },
				{ team1Id: '7', team2Id: '8', winner: '' }
			],
			[
				{ team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' },
				{ team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' }
			],
			[ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ]
		])
	).toEqual(result1);

	// TEST CASE 2
	expect(convertNestedArrayToFirestoreObject([ [ [ '2', '3' ], [ '4', '5' ], [ '6', '7' ] ], [], [] ])).toEqual(
		result2
	);

	// TEST CASE 3
	expect(convertNestedArrayToFirestoreObject([ [], [], [ [ [] ] ] ])).toEqual(result3);
});

test('Converts an array of objects in Google Firestore format into a regular nested array', () => {
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
	let result2 = [ [ [ '2', '3' ], [ '4', '5' ], [ '6', '7' ] ], [], [] ];
	let result3 = [ [], [], [ [ [] ] ] ];

	// TEST CASE 1
	expect(
		convertFirestoreObjectToNestedArray([
			{
				data: [
					{ team1Id: '1', team2Id: '2', winner: '' },
					{ team1Id: '3', team2Id: '4', winner: '' },
					{ team1Id: '5', team2Id: '6', winner: '' },
					{ team1Id: '7', team2Id: '8', winner: '' }
				]
			},
			{
				data: [
					{ team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' },
					{ team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' }
				]
			},
			{ data: [ { team1Id: 'T.B.A.', team2Id: 'T.B.A.', winner: '' } ] }
		])
	).toEqual(result1);

	// TEST CASE 2
	expect(
		convertFirestoreObjectToNestedArray([
			{ data: [ { data: [ '2', '3' ] }, { data: [ '4', '5' ] }, { data: [ '6', '7' ] } ] },
			{ data: [] },
			{ data: [] }
		])
	).toEqual(result2);

	// TEST CASE 3
	expect(
		convertFirestoreObjectToNestedArray([ { data: [] }, { data: [] }, { data: [ { data: [ { data: [] } ] } ] } ])
	).toEqual(result3);
});
