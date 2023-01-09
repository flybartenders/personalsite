/**
* PHP Email Form Validation - v3.5
* URL: https://bootstrapmade.com/form-email/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.form-email');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      if (thisForm.getAttribute('action') != "contato") {
        if(!validateForm(thisForm, formData)) return;
      }

      send_email(thisForm, formData);

    });
  });

  function send_email(thisForm, formData) {

    let params = {
      user_id: 'H0q8rns6_uasvqg0O',
      service_id: 'gmailMessage'
    };

    if (thisForm.getAttribute('action') === "contato") {
      params.template_id = 'default_contato_1',
        params.template_params = {
          'email-contato': formData.get("email-contato"),
          'nome-contato': formData.get("nome-contato"),
          'assunto-contato': formData.get("assunto-contato"),
          'mensagem-contato': formData.get("mensagem-contato"),
          'reply_to': formData.get("email-contato"),
        }
    } else {
      params.template_id = 'default_orcamento_1',
        params.template_params = {
          'email': formData.get("email"),
          'nome': formData.get("nome"),
          'fone': formData.get("fone"),
          'data': formData.get("data"),
          'tipoEvento': formData.get("tipoEvento"),
          'pessoas': formData.get("pessoas"),
          'message': formData.get("message"),
          'reply_to': formData.get("email"),
        }
    };

    let headers = {
      'Content-type': 'application/json'
    };

    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(params)
    };

    fetch('https://api.emailjs.com/api/v1.0/email/send', options)
      .then(response => {
        return response.text();
      }).then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.trim() == 'OK') {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action);
        }
      })
      .catch((error) => {
        displayError(thisForm, error);
      })
  }
})();

function displayError(thisForm, error) {
  thisForm.querySelector('.loading').classList.remove('d-block');
  thisForm.querySelector('.error-message').innerHTML = error;
  thisForm.querySelector('.error-message').classList.add('d-block');
  return;
}

function mascara(i, t) {
  var v = i.value;

  if (isNaN(v[v.length - 1])) {
    i.value = v.substring(0, v.length - 1);
    return;
  }

  if (t == "data") {
    i.setAttribute("maxlength", "10");
    if (v.length == 2 || v.length == 5) i.value += "/";
  }

  if (t == "dataLeave") {
    var rawdata = i.value;
    rawdata = rawdata.replace(/\D/g, "");
    v = rawdata;
    i.value = v.slice(0, 2) + "/" + v.slice(2, 4) + "/" + v.slice(4);
    return;
  }

  if (t == "tel") {
    if (v.length === 1) i.value = "(" + i.value;
    if (v.length === 3) i.value += ") ";
    if (v[5] == 9) {
      i.setAttribute("maxlength", "15");
      if (v.length === 10) i.value += "-";
    } else {
      i.setAttribute("maxlength", "14");
      if (v.length === 9) i.value += "-";
    }
  }

  if (t == "telLeave") {
    var cleaned = ('' + i.value).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      i.value = '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return;
  }
};

function validateForm(thisForm, formData) {

  if (formData.get("nome").length == 0 || formData.get("nome").length <= 4) {
    this.displayError(thisForm, "Por favor informe seu nome");
    return false;
  }

  if (formData.get("email").length == 0 || !validateEmail(formData.get("email"))) {
    this.displayError(thisForm, "Por favor informe um email válido");
    return false;
  }

  if (formData.get("fone").length == 0 || formData.get("fone").length <= 11) {
    this.displayError(thisForm, "Por favor informe seu celular");
    return false;
  }

  if (formData.get("data").length == 0 || formData.get("data").length <= 8) {
    this.displayError(thisForm, "Por favor informe a data do seu evento");
    return false;
  }

  if (formData.get("tipoEvento").length == 0) {
    this.displayError(thisForm, "Por favor informe o tipo do seu evento");
    return false;
  }

  if (formData.get("pessoas").length == 0) {
    this.displayError(thisForm, "Por favor informe a quantidade de pessoas do seu evento");
    return false;
  }

  if (formData.get("message").length == 0 || formData.get("message").length <= 10) {
    this.displayError(thisForm, "Por favor nos conte um pouco mais sobre seu evento...");
    return false;
  }

}

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};