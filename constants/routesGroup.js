module.exports = {
	unsecureRoutes: ['/api/v1', '/api/v1/staff/signup', '/api/v1/staff/signin'],
	secureRoutes: [
		'/all',
		'/:id',
		'/register',
		'/washid/find',
		'/new',
		'/delete/all',
		'/update/:id',
	],
};
