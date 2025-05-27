function submitRequest() {
    const form = document.querySelector('.needs-validation');
    const yesInput = document.getElementById('yes-input');
    const spotYes = document.getElementById('spot-yes');
    const spotNo = document.getElementById('spot-no');
    const startDate = document.getElementById('startdate');
    const endDate = document.getElementById('enddate');
    const formControls = form.querySelectorAll('.form-control, .form-check-input, .form-select');
    
    form.addEventListener('submit', function (event) {
        let isValid = true;

        if (!document.querySelector('input[name="travelstyle"]:checked') ||
            !document.querySelector('input[name="trippace"]:checked') ||
            !document.querySelector('input[name="specificspots"]:checked')) {
            isValid = false;
        }

        if (startDate.value && endDate.value && new Date(startDate.value) > new Date(endDate.value)) {
            isValid = false;
            endDate.classList.add('is-invalid');
            endDate.nextElementSibling.textContent = 'End date must be after start date!';
        } else {
            endDate.classList.remove('is-invalid');
        }

        if (spotYes.checked && !document.getElementById('spotsinput').value) {
            isValid = false;
            document.getElementById('spotsinput').classList.add('is-invalid');
            document.querySelector('#specificspots + .invalid-feedback').textContent = 'Please specify the cities or spots!';
        } else {
            document.getElementById('spotsinput').classList.remove('is-invalid');
        }

        if (!isValid) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        form.classList.add('was-validated');
    });

    spotYes.addEventListener('change', function () {
        yesInput.style.display = 'block';
    });

    spotNo.addEventListener('change', function () {
        yesInput.style.display = 'none';
    });
}

function resetRequest() {
    const form = document.querySelector('.needs-validation');
    form.classList.remove('was-validated');

    form.querySelectorAll('.form-control, .form-check-input, .form-select').forEach(function (input) {
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
    });
}