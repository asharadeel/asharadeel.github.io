fetch('fetchUser.php')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        sessionStorage.setItem('fname', data.fname);
        sessionStorage.setItem('lname', data.lname);
        sessionStorage.setItem('email', data.email);
        console.log('Session Data Saved:', data);
    })
    .catch(error => {
        console.error('Error fetching session data:', error);
    });