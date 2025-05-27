function submitFeedback() {
    const form = document.getElementById('feedback-form');
    form.addEventListener('submit', function (event) {
        const likertQuestions = ['overall', 'quality', 'responsiveness', 'expectations'];
        let allValid = true;

        likertQuestions.forEach(questionName => {
            const radioButtons = document.getElementsByName(questionName);
            const isChecked = Array.from(radioButtons).some(radio => radio.checked);

            if (!isChecked) {
                allValid = false;
                radioButtons[0].setCustomValidity('Please select an option.');
                radioButtons[0].closest('.col-md-2').classList.add('is-invalid');
            } else {
                radioButtons[0].setCustomValidity('');
                radioButtons[0].closest('.col-md-2').classList.remove('is-invalid');
            }
        });

        if (!allValid) {
            event.preventDefault();
            event.stopPropagation();
        }

        form.classList.add('was-validated');
    });

    const allRadioButtons = document.querySelectorAll('.form-check-input[type="radio"]');
    allRadioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            this.closest('.col-md-2').classList.remove('is-invalid');
        });
    });
}

function resetFeedback() {
    const form = document.getElementById('feedback-form');
    const likertQuestions = ['overall', 'quality', 'responsiveness', 'expectations'];

    likertQuestions.forEach(questionName => {
        const radioButtons = document.getElementsByName(questionName);
        radioButtons[0].setCustomValidity('');
        radioButtons[0].closest('.col-md-2').classList.remove('is-invalid');
    });

    form.classList.remove('was-validated');
}