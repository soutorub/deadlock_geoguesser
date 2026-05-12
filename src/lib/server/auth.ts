export function hashPassword(password: string) {
	let hash = 0;

	for (let index = 0; index < password.length; index += 1) {
		hash = (hash * 31 + password.charCodeAt(index)) >>> 0;
	}

	return hash.toString(16).padStart(8, '0');
}
