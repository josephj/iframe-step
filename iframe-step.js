/*global YUI, alert, document*/
YUI.add("iframe-step", function (Y) {

    "use strict";

    var Lang = Y.Lang, // Y.Lang shortcut.
        //=================
        // Constants
        //=================
        MODULE_NAME = "iframestep", // For CSS namespace.
        MODULE_ID   = "iframe-step",
        CSS_CLASSES, // Used CSS class names.
        //=================
        // Private Methods
        //=================
        _getClassName,
        _log;


    _log = function (msg, type, module) {
        type = type || "info";
        module = module || MODULE_ID;
        Y.log(msg, type, module);
    };

    _getClassName = function (className) {
        return Y.ClassNameManager.getClassName(MODULE_NAME, className);
    };

    CSS_CLASSES = {
        "buttons"       : _getClassName("buttons"),
        "first"         : _getClassName("first"),
        "last"          : _getClassName("last"),
        "loading"       : _getClassName("loading"),
        "item"          : _getClassName("item"),
        "item-selected" : _getClassName("item-selected"),
        "next-button"   : _getClassName("next-button"),
        "prev-button"   : _getClassName("prev-button"),
        "end-button"    : _getClassName("end-button")
    };

    /**
     * @class IframeStep
     */
    function IframeStep(config) {
        IframeStep.superclass.constructor.apply(this, arguments);
    }

    IframeStep.NAME = MODULE_NAME;
    IframeStep.ATTRS = {
        /**
         * Frames data collection.
         *
         * @attribute frames
         * @type {Object}
         */
        frames : {
            value: [],
            validator: Y.Lang.isObject
        },
        /**
         * Current offset.
         *
         * @attribute offset
         * @type {Number}
         * @default 0
         */
        offset : {
            value: 0,
            validator: function (value) {
                _log("offset validator is executed.");
                var that = this;
                return that._validateOffset(value);
            }
        },
        /**
         * The amount of iframes.
         *
         * @attribute offset
         * @type {Number}
         * @readOnly
         */
        total: {
            getter: function () {
                var that = this;
                return that.get("frames").length;
            },
            readOnly: true
        }
    };

    IframeStep.HTML_PARSER = {
        frames: function (srcNode) {
            var frames = [];
            srcNode.all("li").each(function (el) {
                frames.push({
                    title    : el.one("a").getHTML(),
                    url      : el.one("a").get("href"),
                    rendered : false
                });
            });
            return frames;
        }
    };

    Y.extend(IframeStep, Y.Widget, {
        //=================
        // Event Handlers
        //=================
        _uiSetOffset: function (offset) {
            _log("_uiSetOffset() is executed.");
            var that = this,
                node = that.get("boundingBox"),
                activeItem = node.one("." + CSS_CLASSES["item-selected"]),
                frames = that.get("frames"),
                frame = frames[offset],
                frameNode,
                itemNode = node.all("." + CSS_CLASSES.item).item(offset);

            // Deals with CSS classes of boundingBox.
            node.removeClass(CSS_CLASSES.first + "|" + CSS_CLASSES.last);
            if (offset === 0) {
                node.addClass(CSS_CLASSES.first);
            } else if (offset === frames.length - 1) {
                node.addClass(CSS_CLASSES.last);
            }

            // Renders a new iframe if it doesn't exist.
            if (!frame.rendered) {
                frameNode = Y.Node.create('<iframe src="' + frame.url + '"></iframe>');
                itemNode.append(frameNode);
                node.addClass(CSS_CLASSES.loading);
                frameNode.once("load", function (e) {
                    node.removeClass(CSS_CLASSES.loading);
                });
                frame.rendered = true;
            }

            // Provides appropriate class name to curren item.
            activeItem = node.one("." + CSS_CLASSES["item-selected"]);
            if (activeItem) {
                activeItem.removeClass(CSS_CLASSES["item-selected"]);
            }
            itemNode.addClass(CSS_CLASSES["item-selected"]);
        },
        /**
         * Handles offsetChange event.
         * It deals with CSS classes on boundingBox.
         *
         * @method _afterOffsetChange
         * @private
         * @param e {Y.Event} Event instance.
         */
        _afterOffsetChange : function (e) {
            _log("_afterOffsetChange() is executed.");
            var that = this;
            that._uiSetOffset(e.newVal);
        },
        //=================
        // Private Methods
        //=================
        /**
         * Validates if the provided offset is valid.
         *
         * @method _validateOffset
         * @private
         * @return {Boolean} false if it's illegal.
         */
        _validateOffset: function (offset) {
            _log("_validateOffset() is executed.");
            var that = this;
            if (!Lang.isNumber(offset)) {
                return false;
            }
            if (offset >= that.get("frames").length || offset < 0) {
                _log("The offset attribute value (" + offset + ") is not valid.");
                return false;
            }
            return true;
        },
        //===================
        // Protected Methods
        //===================
       /**
         * Creates the DOM structure for the IframeStep.
         *
         * @method renderUI
         * @protected
         */
        renderUI: function () {
            _log("renderUI() is executed.");
            var that = this,
                node;

            // Appends buttons.
            node = that.get("contentBox");
            node.all("li").addClass(CSS_CLASSES.item);
            node.append([
                '<div class="' + CSS_CLASSES.buttons + '">',
                '    <button class="yui3-button ' + CSS_CLASSES["prev-button"] + '">Prev</button>',
                '    <button class="yui3-button ' + CSS_CLASSES["next-button"] + '">Next</button>',
                '    <button class="yui3-button ' + CSS_CLASSES["end-button"] + '">End</button>',
                '<div>'
            ].join(""));
        },
        /**
         * Binds button interaction.
         *
         * @method bindUI
         * @protected
         */
        bindUI : function () {
            _log("bindUI() is executed.");
            var that = this,
                node;

            node = that.get("contentBox");
            node.one("." + CSS_CLASSES["prev-button"]).on("click", that.prev, that);
            node.one("." + CSS_CLASSES["next-button"]).on("click", that.next, that);
            node.one("." + CSS_CLASSES["end-button"]).on("click", function (e) {
                var that = this;
                that.fire("end");
            }, that);

            that.after("offsetChange", that._afterOffsetChange);
        },
        /**
         * Synchronizes the DOM state with the attribute settings.
         *
         * @method syncUI
         * @protected
         */
        syncUI: function () {
            var that = this,
                offset = that.get("offset");

            that._uiSetOffset(offset);
        },
        //=================
        // Public Methods
        //=================
        /**
         * Switches to specific item.
         *
         * @method move
         * @public
         * @param offset {Boolean|Number} true if it switches to next iframe.
         *     false if it switches to previous iframe.
         *     You can also provide a number of offset to show a specific step.
         */
        move: function (offset) {
            _log("move(" + offset + ") is executed.");
            var that = this;

            // Converts and checks the offset argument.
            offset = (Lang.isString(offset)) ? parseInt(offset, 10) : offset;
            if (Lang.isBoolean(offset)) {
                offset = (offset) ? that.get("offset") + 1 : that.get("offset") - 1;
            }

             // This triggers the _afterOffsetChange event.
            that._set("offset", offset);
            return true;
        },
        /**
         * Moves to next item.
         *
         * @method next
         * @public
         */
        next: function () {
            _log("next() is executed.");
            var that = this;
            that.move(true);
        },
        /**
         * Moves to previous item.
         *
         * @method prev
         * @public
         */
        prev: function () {
            _log("prev() is executed.");
            var that = this;
            that.move(false);
        }
    });

    Y.IframeStep = IframeStep;

}, "0.0.1", {requires: ["widget"]});
