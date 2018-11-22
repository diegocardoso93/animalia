
export class Channels {

	static joinChannel(channel, success, failure?, timeout?) {
		channel
			.join()
			.receive("ok", success || this.joinOk)
			.receive("error", failure || this.joinError)
			.receive("timeout", timeout || this.joinTimeout)
	}

	static joinOk(response) {
		console.log('Joined successfully', response)
	}

	static joinError(response) {
		console.log('Failed to join channel', response)
	}

	static joinTimeout(response?) {
		console.log('Networking issue. Still waiting...', response)
	}

}
