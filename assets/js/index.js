/* global Papa */
import unserialize from './unserialize.js';

const UnserializeIt = {

	init() {

		this.buttonCopy = document.getElementById( 'button-copy' );
		this.resultEl = document.getElementById( 'result' );
		this.tableEl = document.getElementById( 'table' );

		this.initUnserializeButton();
		this.initCopyButton();
	},

	initUnserializeButton() {

		const el = document.getElementById( 'button-unserialize' );

		if ( el ) {
			el.addEventListener( 'click', () => {
				this.clearResult();
				this.unserializeData();
			});
		}
	},

	clearResult() {

		this.resultEl.innerText = '';
		this.tableEl.innerText = '';
	},

	initCopyButton() {

		if ( this.buttonCopy ) {
			this.buttonCopy.addEventListener( 'click', () => {
				this.copyToClipboard();
			});
		}
	},

	unserializeData() {

		const serializedData = document.getElementById('serialized-data').value.trim();

		if ( '' === serializedData ) {
			return;
		}

		let result;

		try {

			result = JSON.parse( serializedData );

		} catch ( jsonError ) {

			result = unserialize( serializedData );

			if ( ! result ) {

				Papa.parse(
					serializedData,
					{
						complete: ( results ) => {

							// @todo Check if there are any errors before rendering.
							this.renderTable( results.data );
						}
					}
				);
			}
		}

		if ( result ) {

			const string = `<pre>${JSON.stringify(result, null, 2)}</pre>`;

			this.resultEl.innerHTML = string;
			this.resultEl.style.display = 'block';
			this.buttonCopy.style.display = 'block';

		} else {

			this.buttonCopy.style.display = 'none';
			this.resultEl.style.display = 'none';
			this.resultEl.innerHTML = '';
		}
	},

	copyToClipboard() {

		if ( ! this.resultEl ) {
			return;
		}

		const value = this.resultEl.innerText || this.resultEl.textContent;
		const textarea = document.createElement('textarea');

		textarea.value = value;

		document.body.appendChild( textarea );

		textarea.select();

		document.execCommand('copy');

		document.body.removeChild( textarea );

		alert( 'Result copied to clipboard' );
	},

	renderTable( data ) {

		if ( ! this.tableEl ) {
			return;
		}

		const table = document.createElement( 'table' );
		const thead = document.createElement( 'thead' );
		const tbody = document.createElement( 'tbody' );

		for ( let i = 0; i < data.length; i++ ) {

			if ( i === 0 ) {

				for( let j = 0; j < data[i].length; j++ ) {

					const th = document.createElement( 'th' );
					const text = document.createTextNode( data[i][j] );

					th.appendChild( text );
					thead.appendChild( th );
				}

			}

			if ( i > 0 ) {

				const tr = document.createElement( 'tr' );

				for( let j = 0; j < data[i].length; j++ ) {

					const td = document.createElement( 'td' );
					const text = document.createTextNode( data[i][j] );

					td.appendChild( text );
					tr.appendChild( td );
				}

				tbody.appendChild( tr );
			}
		}

		table.appendChild( thead );
		table.appendChild( tbody );

		this.tableEl.appendChild( table );
	},

	isSerializedPHPObject( data ) {

		const regex = /^O:\d+:"[^"]+":\d+:\{/;

		return regex.test( data );
	},

	base64Decode( string ) {

		if ( 'function' !== typeof atob ) {
			return false;
		}

		return decodeURIComponent( atob( string ) );
	}
};

document.addEventListener( 'DOMContentLoaded', function() {

	UnserializeIt.init();
});
