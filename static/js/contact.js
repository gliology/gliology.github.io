// Sends the contact form to Stalwart, which answers {data: {success, details}}
// with 200 on success, 400 for a bad submission and 429 once rate limited.
(function() {
	var form = document.getElementById('contact-form'),
		status = document.getElementById('contact-status');

	if (!form)
		return;

	form.addEventListener('submit', function(event) {
		var submit = form.querySelector('input[type=submit]');

		event.preventDefault();
		submit.disabled = true;
		status.textContent = 'Sending...';

		fetch(form.action, { method: 'POST', body: new FormData(form) })
			.then(function(response) {
				return response.json().catch(function() { return {}; }).then(function(json) {
					if (!response.ok)
						throw (json.data && json.data.details) || null;
				});
			})
			.then(function() {
				form.reset();
				status.textContent = 'Thank you, we will get back to you soon.';
			})
			.catch(function(details) {
				status.textContent = typeof details === 'string'
					? details
					: 'Sorry, that did not work. Please write to contact@gli.al instead.';
			})
			.then(function() {
				submit.disabled = false;
			});
	});
})();
