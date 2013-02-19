/*global YUI, alert, document*/
YUI.add("iframe-step", function (Y) {

    var Lang = Y.Lang,
        MODULE_ID = "iframe-step",
        _log;

    _log = function (msg, type, module) {
        type = type || "info";
        module = module || MODULE_ID;
        Y.log(msg, type, module);
    };

    function IframeStep(config) {
        IframeStep.superclass.constructor.apply(this, arguments);
    }

    IframeStep.NAME = "iframestep";

    IframeStep.ATTRS = {
        frames : {
            value: {},
            validator: Y.Lang.isObject
        },
        offset : {
            value: 0,
            validator: Y.Lang.isNumber
        },
        activeItem : {
            value: null,
            readOnly: true
        }
    };

    IframeStep.HTML_PARSER = {

        frames: function (srcNode) {
            var frames = [];
            srcNode.all("li").each(function (el) {
                frames.push({
                    url         : el.one("a").get("href"),
                    title       : el.one("a").getHTML(),
                    rendered : false
                });
            });
            return frames;
        }
    };

    IframeStep.MYNODE_TEMPLATE = "<div id={mynodeid}></div>";

    Y.extend(IframeStep, Y.Widget, {

        /*button: function (offset) {
            if (offset === 0) {
                node.addClass("first");
            } else if (that.get("frames").length - 1 === offset) {
                node.replaceClass("first", "last").removeClass("interval");
            } else {
                node.removeClass("first").removeClass("last").addClass("interval");
            }
        },*/

        _move: function (isForward) {
            var that = this,
                rendered,
                node,
                offset,
                frames,
                url,
                itemNode;
            node = that.get("contentBox");
            offset = that.get("offset");
            frames = that.get("frames")[offset];
            if (Lang.isBoolean(isForward)) {
                offset = (isForward) ? offset + 1 : offset - 1;
                _log("offset is boolean. boolean = " + isForward);
            } else if (Lang.isNumber(isForward)) {
                _log("offset is number. offset = " + offset);
            }
            rendered = frames.rendered;
            itemNode = node.all("li").item(offset);
            that.get("activeItem").replaceClass(that.getClassName("selected"), that.getClassName("disable"));
            _log(rendered);
            if (rendered) {
                itemNode.replaceClass(that.getClassName("disable"), that.getClassName("selected"));
            } else {
                url = frames.url;
                _log(url);
                itemNode.append('<iframe src="' + url + '"></iframe>');
                itemNode.addClass(that.getClassName("selected"));
                frames.rendered = true;
            }
            that._set("activeItem", itemNode);
            //step button
            if (offset === 0) {
                node.addClass("first");
            } else if (that.get("frames").length - 1 === offset) {
                node.replaceClass("first", "last").removeClass("interval");
            } else {
                node.removeClass("first").removeClass("last").addClass("interval");
            }
            //this.button(offset);
            that._set("offset", offset);
            _log("fin - " + that.get("offset"));
        },

        step: function (offset) {
            var that = this,
                rendered,
                nextNode,
                node,
                itemNode,
                prevNode,
                url;
            node = that.get("contentBox");
            offset = Y.one("input[name=page]").get("value") - 1;
            if (offset >= that.get("frames").length || 0 > offset) {
                alert("no step");
                return true;
            }
            rendered = that.get("frames")[offset].rendered;
            itemNode = node.all("li").item(offset);
            that.get("activeItem").removeClass(that.getClassName("selected")).addClass(that.getClassName("disable"));
            _log(rendered);
            if (rendered) {
                itemNode.removeClass(that.getClassName("disable")).addClass(that.getClassName("selected"));
            } else {
                url = that.get("frames")[offset].url;
                _log(url);
                itemNode.append('<iframe src="' + url + '"></iframe>');
                itemNode.addClass(that.getClassName("selected"));
                that.get("frames")[offset].rendered = true;
            }
            that._set("activeItem", itemNode);
            //step button
            this.button(offset);
            that._set("offset", offset);
            _log("fin - " + that.get("offset"));
        },

        move: function () {
            _log("move");
            this.step();
            this.fire("change");
        },

        next: function () {
            _log("next");
            this._move(true);
            this.fire("change");
        },

        prev: function () {
            _log("prev");
            this._move(false);
            this.fire("change");
        },

        initializer: function () {
            /*
             * initializer is part of the lifecycle introduced by
             * the Base class. It is invoked during construction,
             * and can be used to setup instance specific state or publish events which
             * require special configuration (if they don't need custom configuration,
             * events are published lazily only if there are subscribers).
             *
             * It does not need to invoke the superclass initializer.
             * init() will call initializer() for all classes in the hierarchy.
             */
            _log("initializer");

        },

        destructor : function () {
            /*
             * destructor is part of the lifecycle introduced by
             * the Widget class. It is invoked during destruction,
             * and can be used to cleanup instance specific state.
             *
             * Anything under the boundingBox will be cleaned up by the Widget base class
             * We only need to clean up nodes/events attached outside of the bounding Box
             *
             * It does not need to invoke the superclass destructor.
             * destroy() will call initializer() for all classes in the hierarchy.
             */
        },

        renderUI : function () {
            _log("renderUI");
            var that = this,
                url,
                node,
                offset,
                itemNode,
                frames,
                i,
                steps;
            node = that.get("contentBox");
            offset = that.get("offset");
            frames = that.get("frames")[offset];
            _log(that.get("frames")[offset]);
            url = frames.url;
            _log(url);
            itemNode = node.all("li").item(offset);
            itemNode.append('<iframe src="' + url + '"></iframe>');
            itemNode.addClass(that.getClassName("selected"));
            _log("tset:" + that.get("activeItem"));
            that._set("activeItem", itemNode);
            frames.rendered = true;
            _log("new : " + that.get("frames")[offset].rendered);
            //node.append('<button class="prev-step yui3-iframestep-disable">prev</button>');
            //node.append('<button class="next-step">next</button>');
            node.append('<button>Prev</button><button>Next</button><button>End</button>');
            //node.all("button").item(0).addClass(that.getClassName("prev-step"));
            //node.all("button").item(1).addClass(that.getClassName("next-step"));
            //node.all("button").item(2).addClass(that.getClassName("end-step"));
            for (i = 0; 2 >= i; i++) {
                steps = ["prev-step", "next-step", "end-step"];
                node.all("button").item(i).addClass(that.getClassName(steps[i]));
            }
            //node.append('<button class="prev-step">prev</button><button class="next-step">next</button><button class="end-step">End</button>');

        },

        bindUI : function () {
            var that = this,
                node,
                nextNode,
                prevNode;
            node = that.get("contentBox");
            prevNode = node.one("." + that.getClassName("prev-step"));
            nextNode = node.one("." + that.getClassName("next-step"));
            prevNode.on("click", function (e) {
                that.prev();
            });
            nextNode.on("click", function (e) {
                that.next();
            });
        },

        syncUI : function () {
            //button UI
            _log("syncUI");
            var that = this,
                node,
                offset;
            node = that.get("contentBox");
            offset = that.get("offset");
            if (offset === 0) {
                node.addClass("first");
            } else if (that.get("frames").length - 1 === offset) {
                node.replaceClass("first", "last").removeClass("interval");
            } else {
                node.removeClass("first").removeClass("last").addClass("interval");
            }
        },

        // Beyond this point is the IframeStep specific application and rendering logic

        /* Attribute state supporting methods (see attribute config above) */

        _defAttrAVal : function () {
            // this.get("id") + "foo";
        },

        _setAttrA : function (attrVal, attrName) {
            // return attrVal.toUpperCase();
        },

        _getAttrA : function (attrVal, attrName) {
            // return attrVal.toUpperCase();
        },

        _validateAttrA : function (attrVal, attrName) {
            // return Lang.isString(attrVal);
        },

        /* Listeners, UI update methods */

        _afterAttrAChange : function (e) {
            /* Listens for changes in state, and asks for a UI update (controller). */

            // this._uiSetAttrA(e.newVal);
        },

        _uiSetAttrA : function (val) {
            /* Update the state of attrA in the UI (view) */

            // this._mynode.set("innerHTML", val);
        },

        _defMyEventFn : function (e) {
            // The default behavior for the "myEvent" event.
        }
    });

    Y.IframeStep = IframeStep;

}, "0.0.1", {requires: ["widget"]});