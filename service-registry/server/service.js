const express = require('express');

const ServiceRegistry = require("./lib/service-registry");

const service = express();

module.exports = (config) => {
	const log = config.log();
	const serviceRegistry = new ServiceRegistry(log);
	// Add a request logging middleware in development mode
	if (service.get('env') === 'development') {
		service.use((req, res, next) => {
			log.debug(`${req.method}: ${req.url}`);
			return next();
		});
	}

	service.put("/register/:servicename/:serviceversion/:serviceport", (req, res, next) => {
		const { servicename, serviceversion, serviceport } = req.params;
		const serviceIp = req.socket.remoteAddress.includes("::") ? `[${req.socket.remoteAddress}]` : req.socket.remoteAddress;
		const serviceKey = serviceRegistry.register(servicename, serviceversion, serviceIp, serviceport);
		return res.json({ result: serviceKey });
	});

	service.delete("/register/:servicename/:serviceversion/:serviceport", (req, res, next) => {
		const { servicename, serviceversion, serviceport } = req.params;
		const serviceIp = req.socket.remoteAddress.includes("::") ? `[${req.socket.remoteAddress}]` : req.socket.remoteAddress;
		const serviceKey = serviceRegistry.unregister(servicename, serviceversion, serviceIp, serviceport);
		return res.json({ result: serviceKey });
	});

	service.get("/find/:servicename/:serviceversion", (req, res, next) => {
		const { servicename, serviceversion } = req.params;
		const svc = serviceRegistry.getService(servicename, serviceversion);
		if(!svc) {
			return res.status(404).json({ result: "Service not found" });
		}
		return res.json(svc);
	});

	// eslint-disable-next-line no-unused-vars
	service.use((error, req, res, next) => {
		res.status(error.status || 500);
		// Log out the error to the console
		log.error(error);
		return res.json({
			error: {
				message: error.message,
			},
		});
	});
	return service;
};
