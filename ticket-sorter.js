(function (global, factory, undefined) {
    'use strict';

    if (typeof module === "object" && typeof module.exports === "object") {

        module.exports = factory(global, undefined);
    } else {
        factory(global, undefined);
    }

})
(typeof window !== "undefined" ? window : this, function (global, undefined) {
    function Ticket() {
    }

    Ticket.prototype.setRoute = function (route) {
        this.from = route.from;
        this.to = route.to;
    };


    var TicketFactory = (function () {

        var TicketType = {
            BUS: 'bus',
            TRAIN: 'train',
            PLANE: 'plane',
            TAXI: 'taxi'
        };

        var BusTicket = new Ticket();
        var TrainTicket = new Ticket();
        var PlaneTicket = new Ticket();
        var TaxiTicket = new Ticket();

        BusTicket.init = function (ticketData) {
            var transport = ticketData.transport;

            this.setRoute(ticketData.route);
            this.type = transport.type;

            return this;
        };

        BusTicket.description = function () {
            return 'Take the bus from ' + this.from.displayName + ' to ' + this.to.displayName
                + '. No seatNumber assignment';
        };

        TaxiTicket.init = function (ticketData) {
            var transport = ticketData.transport;

            this.setRoute(ticketData.route);
            this.type = transport.type;
            this.companyName = transport.companyName;

            return this;
        };

        TaxiTicket.description = function () {
            return 'Take the ' + this.companyName + ' taxi from '
                + this.from.displayName
                + ' to ' + this.to.displayName;
        };

        TrainTicket.init = function (ticketData) {
            var transport = ticketData.transport;

            if (!transport.seatNumber)
                throw new Error('Please input train seatNumber number!');
            if (!transport.number)
                throw new Error('Please input train number!');

            this.setRoute(ticketData.route);

            this.type = transport.type;

            this.seatNumber = transport.seatNumber;

            this.number = transport.number;

            return this;
        };

        TrainTicket.description = function () {
            return 'Take train ' + this.number + ' from ' + this.from.displayName
                + ' to ' + this.to.displayName + '. Seat ' + this.seatNumber + '.';
        };

        PlaneTicket.init = function (ticketData) {

            var transport = ticketData.transport;

            if (!transport.seatNumber)
                throw new Error('Please input plane seatNumber number!');
            if (!transport.flight)
                throw new Error('Please input flight number!');
            if (!transport.gate)
                throw new Error('Please input gate number!');


            this.setRoute(ticketData.route);

            this.type = transport.type;
            this.seatNumber = transport.seatNumber;
            this.flight = transport.flight;
            this.gate = transport.gate;
            this.baggage = transport.baggage;

            return this;
        };

        PlaneTicket.description = function () {
            var bg = this.baggage;
            return 'From ' + this.from.displayName + ', take flight ' + this.flight
                + ' to ' + this.to.displayName + '. Gate ' + this.gate + '. Seat ' + this.seatNumber + '. ' +
                (!bg ? 'No information about baggage.' : (bg == 'auto') ?
                    'Baggage will be automatically transferred from your last leg.' :
                'Baggage drop at ticket counter ' + bg + '.');
        };

        function createTicket(ticketData) {
            var data = ticketData || {};
            var transportType = data.transport.type;

            if (!transportType)
                throw new Error('Transport type is not defined!');

            var ticket = null;

            switch (transportType.toLowerCase()) {
                case TicketType.BUS:
                    ticket = BusTicket;
                    break;
                case TicketType.PLANE:
                    ticket = PlaneTicket;
                    break;
                case TicketType.TRAIN:
                    ticket = TrainTicket;
                    break;
                case TicketType.TAXI:
                    ticket = TaxiTicket;
                    break;
                default:
                    throw new TypeError('Invalid transport type');
            }

            return Object.create(ticket).init(data);
        }

        return {
            createTicket: createTicket
        }
    })();

    var SorterModule = (function () {
        var makeHash = function () {
            var hash = '';
            for (var i = 0, l = arguments.length; i < l; i++) {
                hash += arguments[i] + '';
            }
            return hash;
        };
        var sortTickets = function (tickets) {
            // building the hash table
            var hashMapFrom = {};
            var hashMapTo = {};
            var ticketsCount = tickets.length;
            for (var i = 0; i < ticketsCount; i++) {
                var ticket = tickets[i];
                var fromHash = makeHash(ticket.from.lat, ticket.from.lon);
                var toHash = makeHash(ticket.to.lat, ticket.to.lon);

                hashMapFrom[fromHash] = ticket;
                hashMapTo[toHash] = ticket;
            }

            var firstTicket;
            //finding the first ticket
            for (var i = 0; i < ticketsCount; i++) {
                ticket = tickets[i];
                fromHash = makeHash(ticket.from.lat, ticket.from.lon);
                if (!hashMapTo[fromHash]) {
                    firstTicket = ticket;
                    break;
                }
            }

            tickets[0] = firstTicket;
            //sorting
            for (var i = 1; i < ticketsCount; i++) {
                var c = tickets[i - 1];
                toHash = makeHash(c.to.lat, c.to.lon);
                var ticket = hashMapFrom[toHash];
                if (!ticket)
                    throw new Error('Traveler\'s tickets must form one inseparable chain!');
                tickets[i] = ticket;
            }

            return tickets;
        };

        return {sortTickets: sortTickets}
    })();

    function define() {

        function TicketSorter() {
            this.tickets = [];
        }


        TicketSorter.prototype.sortTickets = function () {
            SorterModule.sortTickets(this.tickets);
        };

        TicketSorter.prototype.addTicket = function (ticket) {
            if (ticket instanceof Ticket) {
                this.tickets.push(ticket);
            } else {
                throw new TypeError('Invalid ticket type.');
            }
        };

        TicketSorter.prototype.displayRoute = function (callback) {
            var desc = [];

            for (var i = 0, l = this.tickets.length; i < l; i++) {
                desc.push(this.tickets[i].description());
            }

            callback(desc);
        };

        return {
            initTickets: function (tickets) {
                var ticketSorter = new TicketSorter();
                for (var i = 0, l = tickets.length; i < l; i++) {
                    var ticketData = tickets[i];
                    var ticket = TicketFactory.createTicket(ticketData);
                    ticketSorter.addTicket(ticket);
                }

                return ticketSorter;
            },
            createTicket: TicketFactory.createTicket,
        }
    }

    var api = define();

    if (typeof(TicketSorter) === 'undefined') {
        global.TicketSorter = api;
    }

    return api; // for module.exports (Node.JS)


});

