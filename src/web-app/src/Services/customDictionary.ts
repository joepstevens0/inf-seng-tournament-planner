/**
 * @author jentevandersanden
 */

// Interface for generic dictionary with strings as a key
export interface IDictionary<TValue> {
	[id: string]: TValue;
}
