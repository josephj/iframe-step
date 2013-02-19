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
        activeItem : {
            value: null,
            readOnly: true
        },
        frames : {
            value: {},
            validator: Y.Lang.isObject
        },
        offset : {
            value: 0,
            validator: Y.Lang.isNumber
        }
    };

    IframeStep.HTML_PARSER = {

        frames: function (srcNode) {
            var frames = [];
            srcNode.all("li").each(function (el) {
                frames.push({
                    title       : el.one("a").getHTML(),
                    url         : el.one("a").get("href"),
                    rendered    : false
                });
            });
            return frames;
        }
    };

    IframeStep.MYNODE_TEMPLATE = "<div id={mynodeid}></div>";

    Y.extend(IframeStep, Y.Widget, {

        move: function (offset) {
            var that = this,
                frames,
                node,
                itemNode,
                rendered,
                url;

            offset = (Lang.isString(offset)) ? parseInt(offset, 10) : offset;
            if (Lang.isBoolean(offset)) {
                offset = (offset) ? that.get("offset") + 1 : that.get("offset") - 1;
                _log("offset is boolean. boolean = " + offset);
            } else if (Lang.isNumber(offset)) {
                _log("offset is number. offset = " + offset);
            }
            if (offset >= that.get("frames").length || 0 > offset) {
                alert("Steps is not exist!");
                return true;
            }
            _log("offset:" + offset);
            frames = that.get("frames")[offset];
            node = that.get("contentBox");
            itemNode = node.all("li").item(offset);
            rendered = frames.rendered;
            that.get("activeItem").replaceClass(that.getClassName("selected"), that.getClassName("disable"));
            _log("rendered : " + rendered);
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
            that._set("offset", offset);
            this.fire("change", {offset: offset});
        },

        next: function () {
            _log("next");
            this.move(true);
        },

        prev: function () {
            _log("prev");
            this.move(false);
        },

        initializer: function () {
            _log("initializer");
        },

        destructor : function () {

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
            if (offset >= that.get("frames").length || 0 > offset) {
                _log("Steps is not exist!Please reset offset.");
                return true;
            }
            frames = that.get("frames")[offset];
            url = frames.url;
            _log(url);
            itemNode = node.all("li").item(offset);
            itemNode.append('<iframe src="' + url + '"></iframe>');
            itemNode.addClass(that.getClassName("selected"));
            _log("activeItem:" + that.get("activeItem"));
            that._set("activeItem", itemNode);
            _log("rendered : " + that.get("frames")[offset].rendered);
            frames.rendered = true;
            node.append('<button>Prev</button><button>Next</button><button>End</button>');
            for (i = 0; 2 >= i; i++) {
                steps = ["prev-step", "next-step", "end-step"];
                node.all("button").item(i).addClass(that.getClassName(steps[i]));
            }
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

        _defAttrAVal : function () {

        },

        _setAttrA : function (attrVal, attrName) {

        },

        _getAttrA : function (attrVal, attrName) {

        },

        _validateAttrA : function (attrVal, attrName) {

        },

        _afterAttrAChange : function (e) {

        },

        _uiSetAttrA : function (val) {

        },

        _defMyEventFn : function (e) {

        }
    });

    Y.IframeStep = IframeStep;

}, "0.0.1", {requires: ["widget"]});