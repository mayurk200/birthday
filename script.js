document.addEventListener('DOMContentLoaded', () => {
    const birthdayForm = document.getElementById('birthday-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const birthdateInput = document.getElementById('birthdate');
    const birthdayListDiv = document.getElementById('birthday-list');

    /**
     * Fetches birthdays from the server and displays them.
     */
    const loadBirthdays = async () => {
        try {
            const response = await fetch('/api/birthdays');
            const birthdays = await response.json();
            displayBirthdays(birthdays);
        } catch (error) {
            console.error('Error loading birthdays:', error);
            birthdayListDiv.innerHTML = '<p>Could not load birthdays. Is the server running?</p>';
        }
    };
    
    /**
     * Renders the list of birthdays onto the page.
     */
    const displayBirthdays = (birthdays) => {
        birthdayListDiv.innerHTML = '';
        if (birthdays.length === 0) {
            birthdayListDiv.innerHTML = '<p>No birthdays saved yet.</p>';
            return;
        }

        birthdays.forEach(birthday => {
            const birthdayItem = document.createElement('div');
            birthdayItem.className = 'birthday-item';
            const date = new Date(birthday.date);
            const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

            birthdayItem.innerHTML = `
                <div class="birthday-details">
                    <strong>${birthday.name}</strong> (${birthday.email}) - ${formattedDate}
                </div>
                <button class="delete-btn" data-id="${birthday.id}">Delete</button>
            `;
            birthdayListDiv.appendChild(birthdayItem);
        });
    };

    // Handle form submission to add a new birthday
    birthdayForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newBirthday = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            date: birthdateInput.value,
        };

        try {
            // Send the new birthday data to the server
            const response = await fetch('/api/birthdays', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBirthday),
            });

            if (response.ok) {
                birthdayForm.reset();
                loadBirthdays(); // Reload the list from the server
            } else {
                alert('Failed to save birthday.');
            }
        } catch (error) {
            console.error('Error saving birthday:', error);
            alert('Error connecting to the server.');
        }
    });

    // Handle delete button clicks
    birthdayListDiv.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const idToDelete = e.target.dataset.id;
            try {
                const response = await fetch(`/api/birthdays/${idToDelete}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    loadBirthdays(); // Refresh the list
                } else {
                    alert('Failed to delete birthday.');
                }
            } catch (error) {
                console.error('Error deleting birthday:', error);
                alert('Error connecting to the server.');
            }
        }
    });

    // Initial load
    loadBirthdays();
});