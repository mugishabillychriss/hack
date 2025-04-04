const express = require('express');
const axios = require('axios');
const nmap = require('node-nmap');

const app = express();
const port = 3000;

// Static file serving
app.use(express.static('public'));

// Endpoint for geolocation
app.get('/geoLocation', (req, res) => {
    const ip = req.query.ip;
    axios.get(`https://ipinfo.io/${ip}/json?token=YOUR_TOKEN`)
        .then(response => {
            res.json(response.data);
        })
        .catch(error => {
            res.status(500).send('Error fetching geolocation data');
        });
});

// Endpoint for port scanning
app.get('/scanPorts', (req, res) => {
    const ip = req.query.ip;
    nmap.nmapLocation = "nmap"; // Path to Nmap executable if needed

    const scan = new nmap.NmapScan(ip);
    scan.on('complete', (data) => {
        const openPorts = data[0].ports.filter(port => port.state === 'open').map(port => port.port);
        res.json({ openPorts });
    });

    scan.on('error', (error) => {
        res.status(500).send('Error scanning ports');
    });

    scan.startScan();
});

// Endpoint for vulnerability scanning (using Shodan API as an example)
app.get('/scanVuln', (req, res) => {
    const ip = req.query.ip;
    const apiKey = 'YOUR_SHODAN_API_KEY';

    axios.get(`https://api.shodan.io/shodan/host/${ip}?key=${apiKey}`)
        .then(response => {
            const vulnerabilities = response.data.vulns || [];
            res.json({ vulnerabilities });
        })
        .catch(error => {
            res.status(500).send('Error scanning vulnerabilities');
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
