const can = function (permission) {
	let permissions = localStorage.getItem('permissions');
	if (permissions && typeof permission === 'string') {
		if (permissions.includes(permission)) {
			return true;
		}
	}else if (permissions && typeof permission === 'object'){
		let matches = permission.map(item => {
			if (permissions.includes(item)) {
				return true;
			}
			return false;
		});

		if (matches.includes(true))
			return true;
		return false;

	}
	return false
};

export default can;

