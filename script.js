 // Set the attendance start and end time (in milliseconds)
        var attendanceStartTime = new Date('2023-12-04T12:26:50').getTime();
        var attendanceEndTime = new Date('2023-12-24T12:44:30').getTime();

        // Update the countdown every second
        var countdownInterval = setInterval(function () {
            var now = new Date().getTime();
            var distanceStart = attendanceStartTime - now;
            var distanceEnd = attendanceEndTime - now;

            // Calculate days, hours, minutes, and seconds
            var days = Math.floor(distanceStart / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distanceStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distanceStart % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distanceStart % (1000 * 60)) / 1000);

            // Display the countdown
            document.getElementById('countdown').innerHTML = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';

            // If the countdown reaches zero, show the attendance container and clear the interval
            if (distanceStart <= 0 && distanceEnd > 0) {
                clearInterval(countdownInterval);
                document.getElementById('attendanceContainer').style.display = 'block';
                document.querySelector('.attendance-container form').style.display = 'block';
                document.getElementById('countdownContainer').style.display = 'none';
            } else if (distanceEnd <= 0) {
                clearInterval(countdownInterval);
                document.getElementById('endTimeContainer').style.display = 'block';
                document.getElementById('countdownContainer').style.display = 'none';
                document.getElementById('attendanceContainer').style.display = 'none';
            }
        }, 1000);

        function markAttendance() {
            var idInput = document.querySelector('.uniqueId');
            var id = idInput.value;
            var errorContainer = document.getElementById('errorContainer');
            var successPopup = document.getElementById('successPopup');

            if (id.length === 8) {
                if (hasAttendanceAlreadyMarked(id)) {
                    errorContainer.textContent = 'Attendance has already been marked for this ITS ID.';
                    setTimeout(function () {
                        errorContainer.textContent = '';
                    }, 3000);
                    return;
                }

                successPopup.style.display = 'block';
                var scriptUrl = 'https://script.google.com/macros/s/AKfycbzg0x6QRo_C6NhSe_MaDywLPC_HazcLCRId1JQZIbg6RaTKqf3QOls4-PmmLs6NfAou/exec';
                var payload = { id: id };

                fetch(scriptUrl, {
                        method: 'POST',
                        mode: 'no-cors',
                        cache: 'no-cache',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams(payload),
                    })
                    .then(response => response.text())
                    .then(data => console.log(data))
                    .catch(error => console.error('Error:', error));

                // Store marked attendance in local storage
                var markedAttendance = JSON.parse(localStorage.getItem('markedAttendance')) || [];
                markedAttendance.push(id);
                localStorage.setItem('markedAttendance', JSON.stringify(markedAttendance));

                // Clear local storage after 3 hours (3 hours * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second)
                setTimeout(function () {
                    localStorage.clear();
                }, 3 * 60 * 60 * 1000);

                // Hide the popup after 2 seconds
                setTimeout(function () {
                    successPopup.style.display = 'none';
                }, 2000);
            } else {
                errorContainer.textContent = 'Please enter a valid ITS ID.';
                setTimeout(function () {
                    errorContainer.textContent = '';
                }, 3000);
            }
        }

        function hasAttendanceAlreadyMarked(id) {
            var markedAttendance = JSON.parse(localStorage.getItem('markedAttendance')) || [];
            return markedAttendance.includes(id);
        }
       // Function to clear local storage
        function clearLocalStorage() {
            localStorage.clear();
            alert('Local Storage cleared successfully!');
        }