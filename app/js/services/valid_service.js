'use strict';

module.exports = function(app) {
  app.factory('validationService', [function() {

    return {
      isValid: function(email, password, passwordConfirmation) {
        var errors = [];
        var emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailPattern.test(email)) {
          errors.push('Email address must be valid (e.g. test@example.com).');
        }
        //password validation
        //password pattern: any 8-12 character length combo of ASCII
        //with at least one number and one letter
        var passwordPattern = /^(?=.*\d+)(?=.*[a-z A-Z])[ -~]{8,12}$/;
        if (!passwordPattern.test(password)) {
          errors.push('Password must be 8-12 characters long, with at least 1 letter and 1 number.');
        }
        if (password === email) {
          errors.push('Email and password must not be equal.');
        }
        //Password confirmation
        if (password !== passwordConfirmation) {
          errors.push('Password and confirmation must match.');
        }
        return errors;
      }

    };
  }]);
};
