
// time
setInterval(timeNow, 1000);

function timeNow() {
    const time = document.getElementById('time');
    let now = new Date();
    const currentTime = new Intl.DateTimeFormat('default',
        {
            hour12: true,
            hour: 'numeric',
            minute: 'numeric'
        }).format(now);
    time.innerHTML = currentTime;
};

