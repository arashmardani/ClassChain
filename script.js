// „ﬁœ«—œÂ? «Ê·?Â ‰ﬁ‘Â »œÊ‰ basemap (Å”ù“„?‰Â Œ«·?)
var map = L.map('map', {
    center: [32.4279, 53.6880], // „—ò“  ﬁ—?»? «?—«‰
    zoom: 5, // “Ê„ «Ê·?Â
    attributionControl: false // Õ–› attribution
});

// €?—›⁄«· ò—œ‰ basemap (Å”ù“„?‰Â)
map.removeControl(L.control.attribution());

// ·Êœ ›«?· GeoJSON (ir.json)
fetch('ir.json')
    .then(response => response.json())
    .then(data => {
        // «÷«›Â ò—œ‰ ·«?Â GeoJSON »Â ‰ﬁ‘Â
        L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: '#3388ff', // —‰ê „—“ «” «‰ùÂ«
                    weight: 2, // ÷Œ«„  „—“
                    fillOpacity: 0.5 // ‘›«›?  œ«Œ· «” «‰
                };
            },
            onEachFeature: function (feature, layer) {
                // —Ê?œ«œ ò·?ò —Ê? Â— «” «‰
                layer.on('click', function (e) {
                    // «” Œ—«Ã «ÿ·«⁄«  «“ properties «” «‰
                    var props = feature.properties;
                    var info = `
                        <h2>${props.name}</h2>
                        <p>ID: ${props.id}</p>
                        <p>„‰»⁄: ${props.source}</p>
                        <!-- «ê— «ÿ·«⁄«  »?‘ —? »ŒÊ«Â?œ° «?‰Ã« «÷«›Â ò‰?œ -->
                    `;
                    // ‰„«?‘ «ÿ·«⁄«  œ— Å‰·
                    document.getElementById('info-panel').innerHTML = info;
                });
            }
        }).addTo(map);
    })
    .catch(error => console.error('Œÿ« œ— ·Êœ GeoJSON:', error));