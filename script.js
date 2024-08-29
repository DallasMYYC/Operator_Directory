// Populate select options
function populateOptions() {
    const airlineSelect = document.getElementById('airline');
    const serviceSelect = document.getElementById('service');
    const providerSelect = document.getElementById('provider');

    // Populate airline options
    data.airlines.forEach(airline => {
        let option = document.createElement('option');
        option.value = airline.name;
        option.textContent = airline.name;
        airlineSelect.appendChild(option);
    });

    // Populate service options initially with all services
    data.services.forEach(service => {
        let option = document.createElement('option');
        option.value = service;
        option.textContent = service;
        serviceSelect.appendChild(option);
    });

    // Populate provider options initially with all providers
    data.providers.forEach(provider => {
        let option = document.createElement('option');
        option.value = provider.name;
        option.textContent = provider.name;
        providerSelect.appendChild(option);
    });
}

function displayServicesForAirline(airline) {
    const serviceSelect = document.getElementById('service');
    const results = document.getElementById('results');
    serviceSelect.innerHTML = '<option value="">Select Service</option>'; // Reset services
    results.innerHTML = ''; // Reset results display

    airline.services && Object.keys(airline.services).forEach(service => {
        if (airline.services[service] && airline.services[service] !== "Unknown") {
            let option = document.createElement('option');
            option.value = service;
            option.textContent = service;
            serviceSelect.appendChild(option);

            let serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            serviceItem.innerHTML = `<strong>${service}:</strong> <span class="provider-name">${airline.services[service]}</span>`;

            // Add event listener to show provider contact info on click
            serviceItem.querySelector('.provider-name').addEventListener('click', function () {
                const providerName = this.textContent;
                const providerDetails = data.providers.find(p => p.name === providerName);

                if (providerDetails && providerDetails.contacts) {
                    const contactInfo = document.getElementById('contactInfo');
                    contactInfo.innerHTML = `
                        <h3>Contact Information - Provider</h3>
                        <h4>Primary Contact</h4>
                        <p><strong>Name:</strong> ${providerDetails.contacts.primary.name}</p>
                        <p><strong>Title:</strong> ${providerDetails.contacts.primary.title}</p>
                        <p><strong>Phone:</strong> ${providerDetails.contacts.primary.phone}</p>
                        <p><strong>Email:</strong> ${providerDetails.contacts.primary.email}</p>

                        <h4>Secondary Contact</h4>
                        <p><strong>Name:</strong> ${providerDetails.contacts.secondary.name}</p>
                        <p><strong>Title:</strong> ${providerDetails.contacts.secondary.title}</p>
                        <p><strong>Phone:</strong> ${providerDetails.contacts.secondary.phone}</p>
                        <p><strong>Email:</strong> ${providerDetails.contacts.secondary.email}</p>
                    `;
                } else {
                    contactInfo.innerHTML = `<p>No contact information available for ${providerName}.</p>`;
                }
            });

            results.appendChild(serviceItem);
        }
    });
}

function search() {
    const airlineName = document.getElementById('airline').value;
    const serviceName = document.getElementById('service').value;
    const providerName = document.getElementById('provider').value;

    const results = document.getElementById('results');
    results.innerHTML = ''; // Clear previous results
    const contactInfo = document.getElementById('contactInfo');
    contactInfo.innerHTML = ''; // Clear previous contact info

    let filteredAirlines = data.airlines;

    if (airlineName) {
        filteredAirlines = filteredAirlines.filter(a => a.name === airlineName);
    }

    if (serviceName) {
        filteredAirlines = filteredAirlines.filter(a => a.services[serviceName]);
    }

    if (providerName) {
        filteredAirlines = filteredAirlines.filter(a => {
            return Object.values(a.services).includes(providerName);
        });
    }

    if (filteredAirlines.length === 0) {
        contactInfo.innerHTML = '<p>No results found.</p>';
        return;
    }

    filteredAirlines.forEach(airline => {
        let resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.textContent = `${airline.name} (${airline.code})`;

        // Display all services and providers when searching by airline
        if (!serviceName && !providerName && airlineName) {
            displayServicesForAirline(airline);
        }

        results.appendChild(resultItem);

        // Event listener for clicking on a result
        resultItem.addEventListener('click', () => {
            console.log("Selected Airline:", airline);

            if (airline.contacts) {
                contactInfo.innerHTML = `
                    <h3>Contact Information - Airline</h3>
                    <br>
                    <h4>Primary Contact</h4>
                    <p><strong>Name:</strong> ${airline.contacts.primary.name}</p>
                    <p><strong>Title:</strong> ${airline.contacts.primary.title}</p>
                    <p><strong>Phone:</strong> ${airline.contacts.primary.phone}</p>
                    <p><strong>Email:</strong> ${airline.contacts.primary.email}</p>
<br>
                    <h4>Secondary Contact</h4>
                    <p><strong>Name:</strong> ${airline.contacts.secondary.name}</p>
                    <p><strong>Title:</strong> ${airline.contacts.secondary.title}</p>
                    <p><strong>Phone:</strong> ${airline.contacts.secondary.phone}</p>
                    <p><strong>Email:</strong> ${airline.contacts.secondary.email}</p>
                `;
            } else {
                contactInfo.innerHTML = `<p>No contact information available for ${airline.name}.</p>`;
            }

            if (serviceName) {
                let providerName = airline.services[serviceName];
                let providerDetails = data.providers.find(p => p.name === providerName);

                console.log("Provider Details:", providerDetails);

                if (providerDetails && providerDetails.contacts) {
                    contactInfo.innerHTML += `
                        <h3>Contact Information - Provider</h3>
                        <h4>Primary Contact</h4>
                        <p><strong>Name:</strong> ${providerDetails.contacts.primary.name}</p>
                        <p><strong>Title:</strong> ${providerDetails.contacts.primary.title}</p>
                        <p><strong>Phone:</strong> ${providerDetails.contacts.primary.phone}</p>
                        <p><strong>Email:</strong> ${providerDetails.contacts.primary.email}</p>
<br>
                        <h4>Secondary Contact</h4>
                        <p><strong>Name:</strong> ${providerDetails.contacts.secondary.name}</p>
                        <p><strong>Title:</strong> ${providerDetails.contacts.secondary.title}</p>
                        <p><strong>Phone:</strong> ${providerDetails.contacts.secondary.phone}</p>
                        <p><strong>Email:</strong> ${providerDetails.contacts.secondary.email}</p>
                    `;
                } else {
                    contactInfo.innerHTML += `<p>No provider contact information available for ${providerName}.</p>`;
                }
            }
        });
    });

    // If a provider is selected, display its contact info directly
    if (providerName) {
        const providerDetails = data.providers.find(p => p.name === providerName);

        console.log("Provider Details (direct selection):", providerDetails);

        if (providerDetails && providerDetails.contacts) {
            contactInfo.innerHTML = `
                <h3>Contact Information - Provider</h3>
                <h4>Primary Contact</h4>
                <p><strong>Name:</strong> ${providerDetails.contacts.primary.name}</p>
                <p><strong>Title:</strong> ${providerDetails.contacts.primary.title}</p>
                <p><strong>Phone:</strong> ${providerDetails.contacts.primary.phone}</p>
                <p><strong>Email:</strong> ${providerDetails.contacts.primary.email}</p>
<br>
                <h4>Secondary Contact</h4>
                <p><strong>Name:</strong> ${providerDetails.contacts.secondary.name}</p>
                <p><strong>Title:</strong> ${providerDetails.contacts.secondary.title}</p>
                <p><strong>Phone:</strong> ${providerDetails.contacts.secondary.phone}</p>
                <p><strong>Email:</strong> ${providerDetails.contacts.secondary.email}</p>
            `;
       
        } else {
            contactInfo.innerHTML = `<p>No contact information available for ${providerName}.</p>`;
        }
    }
}

// Event listener to update services dropdown when an airline is selected
document.getElementById('airline').addEventListener('change', function () {
    const airlineName = this.value;
    const selectedAirline = data.airlines.find(a => a.name === airlineName);
    if (selectedAirline) {
        displayServicesForAirline(selectedAirline);
        document.getElementById('results').innerHTML = ''; // Clear previous results
        document.getElementById('contactInfo').innerHTML = ''; // Clear previous contact info
    }
});

// Event listener to search when a service is selected
document.getElementById('service').addEventListener('change', search);

// Event listener to search when a provider is selected
document.getElementById('provider').addEventListener('change', search);

// Reset functionality
function resetSearch() {
    document.getElementById('airline').selectedIndex = 0;
    document.getElementById('service').innerHTML = '<option value="">Select Service</option>'; // Reset service options
    document.getElementById('provider').selectedIndex = 0;
    document.getElementById('results').innerHTML = '';
    document.getElementById('contactInfo').innerHTML = '';
}

// Event listeners for search and reset buttons
document.getElementById('searchBtn').addEventListener('click', search);
document.getElementById('resetBtn').addEventListener('click', resetSearch);

// Initial population of options
populateOptions();

