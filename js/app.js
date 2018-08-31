// Global Variables
var Gmap, apiID, apiSecret;

function AVM() {
    var self = this;

    this.searchOption = ko.observable("");
    this.pins = [];

    // Function to populate info when pin is clicked
    this.popWin = function(pin, infowindow) {
        if (infowindow.marker != pin) {
            infowindow.setContent('');
            infowindow.marker = pin;
            // FS client
            apiID = "2G4BOAVMDDTBVKZOU0WI0IBXSQOCMDTIOWZCKXS4XO1RAC0R";
            apiSecret =
                "3UZMRJ1XEB1WDHZROFUCCIGDJCFMWPVRG5J4FFDWVDNHEV4K";
            // FS address
            var framework = 'https://api.foursquare.com/v2/venues/search?ll=' +
                pin.lat + ',' + pin.lng + '&client_id=' + apiID +
                '&client_secret=' + apiSecret + '&query=' + pin.title +
                '&v=20170708' + '&m=foursquare';
            // FS framework
            $.getJSON(framework).done(function(pin) {
                var response = pin.response.venues[0];
                self.road =response.location.formattedAddress[0];
                self.urbanarea = response.location.formattedAddress[1];
                self.state = response.location.formattedAddress[2];
                self.country = response.location.formattedAddress[3];
                self.category = response.categories[0].shortName;

                self.htmlFS =
                    '<h5 class="iw_subtitle">(' + self.category +
                    ')</h5>' + '<div>' +
                    '<h6 class="iw_address_title"> Address: </h6>' +
                    '<p class="iw_address">' + self.road + '</p>' +
                    '<p class="iw_address">' + self.urbanarea + '</p>' +
                    '<p class="iw_address">' + self.state + '</p>' +
                    '<p class="iw_address">' + self.country +
                    '</p>' + '</div>'+ '</div>';

                infowindow.setContent(self.htmlContent + self.htmlFS);
            }).fail(function() {
                alert(
                    "There was an issue loading the Foursquare API. Please refresh your page to try again."
                );
            });

            this.htmlContent = '<div>' + '<h4 class="iw_title">' + pin.title +
                '</h4>';

            infowindow.open(Gmap, pin);

            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    };

    this.popPin = function() {
        self.popWin(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };

    this.initiate = function() {
        var GmapCanvas = document.getElementById('map');
        var GmapOptions = {
            center: new google.maps.LatLng(22.507368, 88.337026),
            zoom: 14,
            styles: styles
        };
        // Creating a new map with center and zoom
        Gmap = new google.maps.Map(GmapCanvas, GmapOptions);

        // Set InfoWindow
        this.largeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < myLocations.length; i++) {
            this.pinName = myLocations[i].title;
            this.pinLatitude = myLocations[i].lat;
            this.pinLongitude = myLocations[i].lng;
            // pins
            this.marker = new google.maps.Marker({
                map: Gmap,
                position: {
                    lat: this.pinLatitude,
                    lng: this.pinLongitude
                },
                title: this.pinName,
                lat: this.pinLatitude,
                lng: this.pinLongitude,
                id: i,
                animation: google.maps.Animation.DROP
            });
            this.marker.setMap(Gmap);
            this.pins.push(this.marker);
            this.marker.addListener('click', self.popPin);
        }
    };

    this.initiate();

    // This block appends our locations to a list using data-bind
    // It also serves to make the filter work
    this.myLocationsFilter = ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.pins.length; i++) {
            var markerLocation = this.pins[i];
            if (markerLocation.title.toLowerCase().includes(this.searchOption()
                    .toLowerCase())) {
                result.push(markerLocation);
                this.pins[i].setVisible(true);
            } else {
                this.pins[i].setVisible(false);
            }
        }
        return result;
    }, this);
}

googleError = function googleError() {
    alert(
        'Oops. Google Maps did not load. Please refresh the page and try again!'
    );
};

function startApp() {
    ko.applyBindings(new AVM());
}