// START WRAPPER: The YUI.add wrapper is added by the build system, when you
// use Shifter to build your component from the raw source in this file
/*global YUI, alert, document*/
YUI.add("iframe-step", function (Y) {

    /* Any frequently used shortcuts, strings and constants */
    var Lang = Y.Lang,
        MODULE_ID = "iframe-step",
        _log;


    /**
     * A convenient alias method for Y.log(<msg>, "info", "module-dialog");
     *
     * @method _log
     * @private
     */
    _log = function (msg, type, module) {
        type = type || "info";
        module = module || MODULE_ID;
        Y.log(msg, type, module);
    };


    /* IframeStep class constructor */
    function IframeStep(config) {
        IframeStep.superclass.constructor.apply(this, arguments);
    }

    /*
     * Required NAME static field, to identify the Widget class and
     * used as an event prefix, to generate class names etc. (set to the
     * class name in camel case).
     */
    IframeStep.NAME = "iframestep";

    /*
     * The attribute configuration for the widget. This defines the core user facing state of the widget
     */
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

    /*
     * The HTML_PARSER static constant is used if the Widget supports progressive enhancement, and is
     * used to populate the configuration for the IframeStep instance from markup already on the page.
     */
    IframeStep.HTML_PARSER = {

        /*attrA: function (srcNode) {
            // If progressive enhancement is to be supported, return the value of "attrA" based on the contents of the srcNode
        }*/
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

    /* Templates for any markup the widget uses. Usually includes {} tokens, which are replaced through `Y.Lang.sub()` */
    IframeStep.MYNODE_TEMPLATE = "<div id={mynodeid}></div>";

    /* IframeStep extends the base Widget class */
    Y.extend(IframeStep, Y.Widget, {

        button: function (offset) {
            var that = this,
                nextNode,
                node,
                prevNode;
            node = that.get("contentBox");
            nextNode = node.all(".next-step");
            prevNode = node.all(".prev-step");
            if (that.get("frames").length - 1 === offset) {
                node.append('<button class="home">home</button>');
                nextNode.addClass(that.getClassName("enable"));
            } else {
                node.all(".home").addClass(that.getClassName("enable"));
                nextNode.removeClass(that.getClassName("enable"));
            }
            if (offset !== 0) {
                prevNode.removeClass(that.getClassName("enable"));
            } else {
                prevNode.addClass(that.getClassName("enable"));
            }
        },

        newPage: function (offset) {
            var that = this,
                url,
                node,
                itemNode;

            node = that.get("contentBox");
            url = that.get("frames")[offset].url;
            _log(url);
            itemNode = node.all("li").item(offset);
            itemNode.append('<iframe src="' + url + '"></iframe>');
            itemNode.addClass(that.getClassName("selected"));
            _log("tset:" + that.getAttrs("activeItem"));
            _log("tset-2:" + that.get("activeItem"));
            that.get("activeItem").removeClass(that.getClassName("selected")).addClass(that.getClassName("enable"));
            that._set("activeItem", itemNode);
            that.get("frames")[offset].rendered = true;
            _log("new : " + that.get("frames")[offset].rendered);
            _log("l:" + that.get("frames").length);
        },

        showPage: function (offset) {
            var that = this,
                node,
                itemNode;
            node = that.get("contentBox");
            itemNode = node.all("li").item(offset);
            that.get("activeItem").removeClass(that.getClassName("selected")).addClass(that.getClassName("enable"));
            itemNode.removeClass(that.getClassName("enable")).addClass(that.getClassName("selected"));
            that._set("activeItem", itemNode);
        },

        _move: function (isForward) {
            var that = this,
                rendered,
                nextNode,
                node,
                offset,
                prevNode;
            node = that.get("contentBox");
            offset = that.get("offset");
            offset = (isForward) ? offset + 1 : offset - 1;
            _log("click - " + offset);
            rendered = that.get("frames")[offset].rendered;
            _log(rendered);
            if (rendered) {
                that.showPage(offset);
            } else {
                that.newPage(offset);
            }
            //step button
            this.button(offset);
            that._set("offset", offset);
            _log("fin - " + that.get("offset"));
        },

        step: function (offset) {
            var that = this,
                rendered,
                nextNode,
                node,
                prevNode;
            node = that.get("contentBox");
            offset = Y.one("input[name=page]").get("value") - 1;
            if (offset >= that.get("frames").length || 0 > offset) {
                alert("no step");
                return true;
            }
            rendered = that.get("frames")[offset].rendered;
            _log(rendered);
            if (rendered) {
                that.showPage(offset);
            } else {
                that.newPage(offset);
            }
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
            /*
             * renderUI is part of the lifecycle introduced by the
             * Widget class. Widget's rendered method invokes:
             *
             *     renderUI()
             *     bindUI()
             *     syncUI()
             *
             * renderUI is intended to be used by the Widget subclass
             * to create or insert new elements into the DOM.
             */

             // this._mynode = Node.create(Y.Lang.sub(IframeStep.MYNODE_TEMPLATE, {mynodeid: this.get("id") + "_mynode"}));
            //_log(this.get("srcNode"));
            //node.all("a").item(0).addClass("step-hide");
            //node.one("ul").addClass("yui3-overlay-loading");
            //_log(this.get("offset"));
            //_log(this.get("frames"));
            //_log(this.get("frames")[0].url);
            //this.newPage(this.get("offset"));
            var that = this,
                url,
                node,
                offset,
                itemNode;
            node = that.get("contentBox");
            offset = that.get("offset");
            _log(that.get("frames")[offset]);
            url = that.get("frames")[offset].url;
            _log(url);
            itemNode = node.all("li").item(offset);
            itemNode.append('<iframe src="' + url + '"></iframe>');
            itemNode.addClass(that.getClassName("selected"));
            _log("tset:" + that.get("activeItem"));
            that._set("activeItem", itemNode);
            that.get("frames")[offset].rendered = true;
            _log("new : " + that.get("frames")[offset].rendered);
            node.append('<button class="prev-step yui3-iframestep-enable">prev</button>');
            node.append('<button class="next-step">next</button>');

        },

        bindUI : function () {
            /*
             * bindUI is intended to be used by the Widget subclass
             * to bind any event listeners which will drive the Widget UI.
             *
             * It will generally bind event listeners for attribute change
             * events, to update the state of the rendered UI in response
             * to attribute value changes, and also attach any DOM events,
             * to activate the UI.
             */

             // this.after("attrAChange", this._afterAttrAChange);
        },

        syncUI : function () {
            /*
             * syncUI is intended to be used by the Widget subclass to
             * update the UI to reflect the initial state of the widget,
             * after renderUI. From there, the event listeners we bound above
             * will take over.
             */

            // this._uiSetAttrA(this.get("attrA"));
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