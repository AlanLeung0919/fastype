export default (timestamp, notime, noyear) => {
	const month = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const date = new Date(timestamp);
	if (notime) {
		return `${date.getFullYear()} ${month[date.getMonth()]} ${(
			'0' + date.getDate()
		).slice(-2)}`;
	} else if (noyear) {
		return `${month[date.getMonth()]} ${('0' + date.getDate()).slice(-2)} ${(
			'0' + date.getHours()
		).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`;
	} else {
		return `${date.getFullYear()} ${month[date.getMonth()]} ${(
			'0' + date.getDate()
		).slice(-2)} ${('0' + date.getHours()).slice(-2)}:${(
			'0' + date.getMinutes()
		).slice(-2)}`;
	}
};
