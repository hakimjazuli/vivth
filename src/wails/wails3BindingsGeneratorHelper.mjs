// @ts-check

const JS_RESERVED_WORDS = new Set([
	'break',
	'case',
	'catch',
	'class',
	'const',
	'continue',
	'debugger',
	'default',
	'delete',
	'do',
	'else',
	'export',
	'extends',
	'false',
	'finally',
	'for',
	'function',
	'if',
	'import',
	'in',
	'instanceof',
	'let',
	'new',
	'null',
	'return',
	'super',
	'switch',
	'this',
	'throw',
	'true',
	'try',
	'typeof',
	'var',
	'void',
	'while',
	'with',
	'yield',
	'enum',
	'await',
	'implements',
	'interface',
	'package',
	'private',
	'protected',
	'public',
	'static',
	'arguments',
]);

/**
 * Fast deterministic 32-bit hash (FNV-1a) converted to base36.
 * @param {string} str
 * @returns {string}
 */
function hash36(str) {
	let hash = 0x811c9dc5;
	for (let i = 0; i < str.length; i += 1) {
		hash ^= str.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193);
	}
	return (hash >>> 0).toString(36);
}

/**
 * Converts a single-line string into a valid, collision-resistant JS identifier.
 * @param {string} arg0
 * @returns {string}
 */
export function toValidJsConstName(arg0) {
	const raw = String(arg0 ?? '').trim();

	// Split on non-alphanumeric separators (spaces, dashes, underscores, colons, dots, etc.)
	const parts = raw
		.replace(/([a-z0-9])([A-Z])/g, '$1_$2')
		.split(/[^A-Za-z0-9]+/)
		.filter(Boolean)
		.map((part) => part.toUpperCase());

	let base = parts.length > 0 ? parts.join('_') : 'IPC_ITEM';

	// JS identifiers cannot start with a digit
	if (/^[0-9]/.test(base)) {
		base = `_${base}`;
	}

	// Avoid reserved words
	if (JS_RESERVED_WORDS.has(base.toLowerCase())) {
		base = `${base}_CONST`;
	}

	// Append deterministic hash so "foo-bar", "foo_bar", and "foo bar" stay distinct
	const suffix = hash36(raw);
	return `${base}_${suffix}`;
}
