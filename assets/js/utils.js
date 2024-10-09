export function isSerializedPHPObjectRegex( data ) {

	const regex = /^O:\d+:"[^"]+":\d+:\{/;

	return regex.test( data );
},

/**
 * Checks value to find if it is a serialized PHP string.
 *
 * A JS version of the WordPress is_serialized() PHP function.
 *
 * @link https://developer.wordpress.org/reference/functions/is_serialized/
 *
 * @param {String}  data   Value to check to see if was serialized.
 * @param {boolean} strict Optional. Whether to be strict about the end of the string. Default true.
 * @returns {boolean} False if not serialized and true if it was.
 */
export function isSerializedPHPObject( data, strict = true ) {

	// If it's not a string, it isn't serialized.
	if ( typeof data !== 'string' ) {
		return false;
	}

	data = data.trim();

	if ( data === 'N;' ) {
		return true;
	}

	if ( data.length < 4 ) {
		return false;
	}

	if ( data[1] !== ':' ) {
		return false;
	}

	if ( strict ) {

		const lastChar = data.slice( -1 );

		if ( lastChar !== ';' && lastChar !== '}' ) {
			return false;
		}

	} else {

		const semicolon = data.indexOf( ';' );
		const brace = data.indexOf( '}' );

		// Either ; or } must exist.
		if (semicolon === -1 && brace === -1) {
			return false;
		}

		// But neither must be in the first few characters.
		if ( semicolon !== -1 && semicolon < 3 ) {
			return false;
		}

		if ( brace !== -1 && brace < 4 ) {
			return false;
		}
	}

	const token = data[0];

	switch ( token ) {
		case 's': // string.
			if (strict) {
				if (data.slice(-2, -1) !== '"') {
					return false;
				}
			} else if (!data.includes('"')) {
				return false;
			}
		case 'a': // array.
		case 'O': // object.
		case 'E': // custom object.
			return new RegExp( `^${token}:[0-9]+:` ).test( data );
		case 'b': // boolean.
		case 'i': // integer.
		case 'd': // float (double).
			const end = strict ? '$' : '';
			return new RegExp( `^${token}:[0-9.E+-]+;${end}` ).test( data );
	}

	return false;
}

export function base64Decode( string ){

	if ( 'function' !== typeof atob ) {
		return false;
	}

	return decodeURIComponent( atob( string ) );
}
