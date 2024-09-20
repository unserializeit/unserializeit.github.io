import unserialize from './unserialize.js';

const UnserializeIt = {

	init() {

		this.resultEl = document.getElementById('result');
		this.buttonCopy = document.getElementById('button-copy');

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
		} catch (jsonError) {
			try {
				result = unserialize(serializedData);
			} catch (phpError) {
				error = 'Invalid serialized data: ' + phpError.message;
				result = false;
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
