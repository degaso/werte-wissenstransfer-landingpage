var apiDomain = 'https://degaso.de:8787/'

function sendAccount() {
    let data = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
      };

      data = JSON.stringify(data);
      fetch(apiDomain + "sendAccount", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: data
      })
      .then(document.getElementById('formForRegistration').innerHTML = 'Vielen Dank für Ihre Anmeldung!')
      .catch(err => { })
}