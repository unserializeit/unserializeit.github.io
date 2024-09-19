import unserialize from './unserialize.js';

const UnserializeIt = {

	init() {

		this.initUnserializeButton();
		this.initCopyButton();
	},

	initUnserializeButton() {

		const el = document.getElementById( 'button-unserialize' );

		if ( el ) {
			el.addEventListener( 'click', () => {
				this.unserializeData();
			});
		}
	},

	initCopyButton() {

		const el = document.getElementById( 'button-copy' );

		if ( el ) {
			el.addEventListener( 'click', () => {
				this.copyToClipboard();
			});
		}
	},

	unserializeData() {

		const serializedData = document.getElementById('serialized-data').value;
		let result;

		try {
			result = JSON.parse( serializedData );
		} catch (jsonError) {
			try {
				result = unserialize(serializedData);
			} catch (phpError) {
				result = 'Invalid serialized data: ' + phpError.message;
			}
		}

		const string = result ? `<pre>${JSON.stringify(result, null, 2)}</pre>` : '';

		document.getElementById('result').innerHTML = string;
		document.getElementById('button-copy').disabled = !result;

	},

	copyToClipboard () {

		const resultElement = document.getElementById("result");

		if ( ! resultElement ) {
			return;
		}

		const textToCopy = resultElement.innerText || resultElement.textContent;
		const tempTextArea = document.createElement('textarea');

		tempTextArea.value = textToCopy;

		document.body.appendChild( tempTextArea );

		tempTextArea.select();

		document.execCommand('copy');

		document.body.removeChild( tempTextArea );

		alert('Result copied to clipboard');
	},

	isSerializedPHPObject( data ) {

		const regex = /^O:\d+:"[^"]+":\d+:\{/;

		return regex.test( data );
	}
};

document.addEventListener( 'DOMContentLoaded', function() {

	UnserializeIt.init();
});
