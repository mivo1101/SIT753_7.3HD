function subscribe(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const emailFeedback = document.getElementById('email-feedback');
    const subscriptionFeedback = document.getElementById('subscription-feedback');
    const emailValue = emailInput.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    emailInput.classList.remove('is-invalid');
    emailFeedback.style.display = 'none';
    subscriptionFeedback.style.display = 'none';

    if (emailValue === "") {
        emailInput.classList.add('is-invalid');
        emailFeedback.textContent = 'Please enter your email address to subscribe!';
        emailFeedback.style.display = 'block';
        return false;
    } else if (!emailPattern.test(emailValue)) {
        emailInput.classList.add('is-invalid');
        emailFeedback.textContent = 'Please enter a valid email address!';
        emailFeedback.style.display = 'block';
        return false;
    } else {
        emailFeedback.style.display = 'none';

        fetch('/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailValue }),
        })
        .then(response => {
            if (response.ok) {
                window.location.href = `/subscription-success?email=${encodeURIComponent(emailValue)}`;
            } else {
                emailInput.classList.add('is-invalid');
                emailFeedback.textContent = 'Error processing subscription. Please try again.';
                emailFeedback.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            emailInput.classList.add('is-invalid');
            emailFeedback.textContent = 'Error processing subscription. Please try again.';
            emailFeedback.style.display = 'block';
        });

        return false;
    }
}