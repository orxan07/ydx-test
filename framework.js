(function (global, factory, undefined) {
    'use strict';

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(global, undefined);
    }
    else {
        factory(global, undefined);
    }

})
(typeof window !== "undefined" ? window : this, function (window, undefined) {

    var document = window.document;

    function define() {

        function DOM(elem) {
            for (var i = 0; i < elem.length; i++) {
                this[i] = elem[i];
            }
            this.length = elem.length;
        }

        DOM.prototype.map = function (callback) {
            var res = [];
            for (var i = 0; i < this.length; i++) {
                res.push(callback.call(this, this[i], i));
            }
            return res;
        };

        DOM.prototype.forEach = function (callback) {
            this.map(callback);
            return this;
        };

        DOM.prototype.mapOne = function (callback) {
            var map = this.map(callback);
            return map.length > 1 ? map : map[0];
        };

        DOM.prototype.addClass = function (classes) {
            var className = "";
            if (typeof classes !== "string") {
                for (var i = 0; i < classes.length; i++) {
                    className += " " + classes[i];
                }
            } else {
                className = " " + classes;
            }
            return this.forEach(function (elem) {
                elem.className += className;
            });
        };

        DOM.prototype.text = function (text) {
            if (typeof text !== "undefined") {
                return this.forEach(function (elem) {
                    elem.innerText = text;
                });
            } else {
                return this.mapOne(function (elem) {
                    return elem.innerText;
                });
            }
        };
        DOM.prototype.html = function (html) {
            if (typeof html !== "undefined") {
                this.forEach(function (elem) {
                    elem.innerHTML = html;
                });
                return this;
            } else {
                return this.mapOne(function (elem) {
                    return elem.innerHTML;
                });
            }
        };
        DOM.prototype.attr = function (attr, val) {
            if (typeof val !== "undefined") {
                return this.forEach(function (elem) {
                    elem.setAttribute(attr, val);
                });
            } else {
                return this.mapOne(function (elem) {
                    return elem.getAttribute(attr);
                });
            }
        };


        return {
            find: function (selector) {
                var elem;
                if (typeof selector === "string") {
                    elem = document.querySelectorAll(selector);
                } else if (selector.length) {
                    elem = selector;
                } else {
                    elem = [selector];
                }
                return new DOM(elem);
            },
            create: function (args) {
                args = args || {};
                var tagName = args.tagName, attrs = args.attrs;
                var elem = new DOM([document.createElement(tagName)]);
                if (attrs) {
                    if (attrs.className) {
                        elem.addClass(attrs.className);
                        delete attrs.className;
                    }
                    if (attrs.text) {
                        elem.text(attrs.text);
                        delete attrs.text;
                    }
                    for (var key in attrs) {
                        if (attrs.hasOwnProperty(key)) {
                            elem.attr(key, attrs[key]);
                        }
                    }
                }
                return elem;
            }

        }
    }

    var framework = define();

    if (typeof(DOM) === 'undefined') {
        window.DOM = framework;
    }

    return framework; // for module.exports (Node.JS)
})
;

