var tickets = [
    {
        route: {
            from: {
                lon: 35.50,
                lat: 75.75,
                displayName: 'New York airport'
            },
            to: {
                lon: 48.60,
                lat: 2.30,
                displayName: 'Paris airport'
            }
        },
        transport: {
            type: 'plane',
            flight: '3322',
            gate: '7D',
            seatNumber: '6A',
            baggage: 'auto',
        }
    },
    {
        route: {
            from: {
                lon: 25.50,
                lat: 36.3,
                displayName: 'Texas training station'
            },
            to: {
                lon: 35.50,
                lat: 75.75,
                displayName: 'New York airport'
            }
        },
        transport: {
            type: 'train',
            seatNumber: '56B',
            number: '666'
        }
    },
    {
        route: {
            from: {
                lon: 20.80,
                lat: 90.00,
                displayName: 'Berlin airport'
            },
            to: {
                lon: 55.75,
                lat: 37.10,
                displayName: 'Moscow Vnukovo airport'
            }

        },
        transport: {
            type: 'plane',
            flight: 'AE321',
            gate: '10',
            seatNumber: '1F',
            baggage: '1',
        }
    },
    {
        route: {
            from: {
                lon: 48.60,
                lat: 2.30,
                displayName: 'Paris airport'
            },
            to: {
                lon: 20.80,
                lat: 90.00,
                displayName: 'Berlin airport'
            }
        },
        transport: {
            type: 'bus'
        }
    },
];

var ticketSorter = TicketSorter.initTickets(tickets);

var ticketToYandex = {
    route: {
        to: {
            lon: 37.58,
            lat: 55.73,
            displayName: 'Yandex Moscow Office'
        },
        from: {
            lon: 55.75,
            lat: 37.10,
            displayName: 'Moscow Vnukovo airport'
        }

    },
    transport: {
        type: 'taxi',
        companyName: 'Yandex'
    }


};

var ticket = TicketSorter.createTicket(ticketToYandex);

ticketSorter.addTicket(ticket);

ticketSorter.sortTickets();

ticketSorter.displayRoute(function (desc) {
    var el = DOM.find("#routeDesc");
    var msg = '';
    for (var i = 0; i < desc.length; i++) {
        msg += desc[i] + '<br>';
    }
    el.html(msg);
});