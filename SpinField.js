//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2023 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file
//          in accordance with the terms of the license agreement accompanying it.
//
//==============================================================================

if (!nexacro.SpinField) 
{
    //==============================================================================
    // nexacro.SpinField (flexible)
    //==============================================================================
    nexacro.SpinField = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay) 
    {
        nexacro.TextField.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay);

        this._masktypeobj = new nexacro._EditMaskTypeNumber();

        this._FORMAT_TYPE = {
            ZERO: "9.9",
            NEAR_ZERO: "0.9",
            OUTER_ZERO: "9.9",
            OUTER_ZERO_WITH_COMMA: "9,999.9",
        };
    };

    var _pSpinField = nexacro._createPrototype(nexacro.TextField, nexacro.SpinField);
    nexacro.SpinField.prototype = _pSpinField;
    _pSpinField._type_name = "SpinField";

    _pSpinField._boxcontrol_socket = {
        instance_name: "SpinFieldBox",
        id: "box",
    };

    /* fixed prop */
    _pSpinField._p_usecharcount = false;

    /* default properties */
    _pSpinField._p_value = undefined;
    _pSpinField._p_format = "";
    _pSpinField._p_inputtype = "text";
    _pSpinField._p_max = 10000;
    _pSpinField._p_min = 0;
    _pSpinField._p_type = "normal";
    _pSpinField._p_increment = 1;
    _pSpinField._p_buttonsize = undefined;
    _pSpinField._p_buttontype = "default";
    _pSpinField._p_useleadingbutton = true;
    _pSpinField._p_usetrailingbutton = true;
    _pSpinField._p_displaycomma = false;

    _pSpinField._properties = [
        { name: "value" },
        { name: "text", readonly: true },
        { name: "format" },
        { name: "inputtype" },
        { name: "max" },
        { name: "min" },
        { name: "type" },
        { name: "increment" },
        { name: "buttonposition" },
        { name: "buttonsize" },
        { name: "locale" },
        { name: "visible" },
        { name: "buttontype" },
        { name: "displaycomma" },
    ];
    nexacro._defineProperties(_pSpinField, _pSpinField._properties);

    /* internal variable */
    _pSpinField._popuptype = nexacro._isTouchInteraction ? "mobile" : "normal";
    _pSpinField._input_type = "";
    _pSpinField._invalid_value = null;
    _pSpinField._masktypeobj = null;
    _pSpinField._is_repeat = true;
    _pSpinField._is_locale_control = true;

    _pSpinField._default_value = undefined;
    _pSpinField._default_text = "";
    _pSpinField._default_mask = "9.9";
    _pSpinField._default_commamask = "9,999.9";
    _pSpinField._want_arrow = true;
    _pSpinField._has_inputElement = true;

    /* event list */
    _pSpinField._event_list = {
        oneditclick: 1,
        onkeydown: 1,
        onkeyup: 1,
        onkillfocus: 1,
        onsetfocus: 1,
        ondrag: 1,
        ondragenter: 1,
        ondragleave: 1,
        ondragmove: 1,
        ondrop: 1,
        onlbuttondown: 1,
        onlbuttonup: 1,
        onrbuttondown: 1,
        onrbuttonup: 1,
        onmousedown: 1,
        onmouseup: 1,
        onmouseenter: 1,
        onmouseleave: 1,
        onmousemove: 1,
        onmove: 1,
        onsize: 1,
        canchange: 1,
        onchanged: 1,
        oninput: 1,
        onspin: 1,
        oncontextmenu: 1,
        ontouchstart: 1,
        ontouchmove: 1,
        ontouchend: 1,
        ondevicebuttonup: 1,
        oninvalid: 1,
    };

    /* accessibility */
    _pSpinField.accessibilityrole = "SpinField";

    //===============================================================
    // nexacro.SpinField : Create & Destroy & Update
    //===============================================================
    _pSpinField.on_create_contents = function () 
    {
        //var control = this.getElement();

        nexacro.TextField.prototype.on_create_contents.call(this);

        //var maskobj = this._masktypeobj;

        //var input_elem = (this._input_element = this._getInputElement());
    };

    _pSpinField.on_created_contents = function (win) 
    {
        this.on_apply_displaycomma(this._p_displaycomma);

        nexacro.TextField.prototype.on_created_contents.call(this, win);
    };

    _pSpinField.on_create_contents_command = function () 
    {
        this.on_apply_displaycomma(this._p_displaycomma);

        var str = "";

        str += nexacro.TextField.prototype.on_create_contents_command.call(this);

        return str;
    };

    _pSpinField.on_after_created_ext = function () 
    {
        nexacro.TextField.prototype.on_after_created_ext.call(this);

        this._setEventHandlerToSpinButtons(this._box);
        this._setEventHandlerToSpinButtons(this._box);

        this._setEventHandlerToCalendarEdit(this._box);
        this._setEventHandlerToCalendarEdit(this._box);
    };

    _pSpinField.on_destroy_contents = function () 
    {
        nexacro.TextField.prototype.on_destroy_contents.call(this);
    };

    //===============================================================
    // nexacro.SpinField : Properties
    //===============================================================

    _pSpinField.set_buttontype = function (v) 
    {
        var type_enum = ["default", "horizontal"];
        if (type_enum.indexOf(v) == -1) 
        {
            return;
        }

        if (this._p_buttontype != v) 
        {
            this._p_buttontype = v;

            this.on_apply_buttontype(v);
        }
    };

    _pSpinField.on_apply_buttontype = function (v) 
    {
        var _box = this._box;
        if (_box) 
        {
            if (v == "horizontal") 
            {
                // 1. initial property가 horizontal 일때 (default -> horizontal)
                // 2. default에서 horizontal 처리 (default -> horizontal)
                _box._remove_buttonbox();
            }
            else 
            {
                // 3. horizontal에서 default 처리 (horizontal -> default)
                if (!_box._container_elem) 
                {
                    _box._container_elem = new nexacro._ButtonBoxElement(this._control_element, false);
                    _box._container_elem.create(_box._window);
                    _box._create_buttonbox();
                }
            }

            _box._recalc_box();
            _box.on_change_containerRect(this._box.width, this._box.height);
        }
    };

    _pSpinField.set_displaycomma = function (v) 
    {
        v = nexacro._toBoolean(v);
        if (this._p_displaycomma != v) 
        {
            this._p_displaycomma = v;

            this.on_apply_displaycomma(v);
            this.on_apply_value(this._p_value);
            // this._setDefaultText();
        }
    };

    _pSpinField.on_apply_displaycomma = function (displaycomma) 
    {
        if (this._box) 
        {
            this._on_apply_format(this._getSpinFieldFormatType());
        }
    };

    _pSpinField._on_apply_format = function (mask) 
    {
        var maskobj = this._masktypeobj;
        if (maskobj && this._box) 
        {
            mask = mask ? mask.replace(/^\s\s*/, "") : "";
            maskobj.setMask(mask);

            this._box._on_apply_inputtype();
        }
    };

    _pSpinField.on_apply_contentheight = function () 
    {
        this._recalc_contents();
        if (this._box) 
        {
            this._box._recalc_box();
            this._box.on_change_containerRect();
        }
    };

    _pSpinField._getSpinFieldFormatType = function () 
    {
        return nexacro.Spin.prototype._getSpinFormatType.call(this);
    };

    _pSpinField._on_spin_up = function () 
    {
        if (this._p_readonly) 
        {
            return false;
        }

        var maskobj = this._masktypeobj;

        var increment = this._p_increment;
        var max = this._p_max;
        var min = this._p_min;
        var input = this._box._input_element;

        var pre_value = parseFloat(input.value);
        var pre_text = this._p_text;

        if (nexacro._isNull(pre_value) || isNaN(pre_value)) 
        {
            pre_value = 0;
        }

        var cur_value = nexacro.Spin.prototype._calcValue.call(this, pre_value, increment, true);

        if (this._p_circulation) 
        {
            if (increment >= 0) 
            {
                cur_value = cur_value > max ? min : cur_value;
            }
            else 
            {
                cur_value = cur_value < min ? max : cur_value;
            }
        }
        else 
        {
            cur_value = cur_value > max ? max : cur_value < min ? min : cur_value;
        }

        var cur_text = maskobj.applyMask(cur_value);

        if (!this.on_fire_onspin(this, pre_text, pre_value, cur_text, cur_value, true)) 
        {
            cur_value = pre_value;
        }

        this._p_value = cur_value;

        this.on_apply_value(cur_value);

        // this._updateButton();
    };

    _pSpinField._on_spin_down = function () 
    {
        if (this._p_readonly) 
        {
            return false;
        }

        var maskobj = this._masktypeobj;

        var increment = this._p_increment;
        var max = this._p_max;
        var min = this._p_min;
        var input = this._box._input_element;

        var pre_value = parseFloat(input.value);
        var pre_text = this._p_text;

        if (nexacro._isNull(pre_value) || isNaN(pre_value)) 
        {
            pre_value = 0;
        }

        var cur_value = nexacro.Spin.prototype._calcValue.call(this, pre_value, increment, false);

        if (this._p_circulation) 
        {
            if (increment >= 0) 
            {
                cur_value = cur_value < min ? max : cur_value;
            }
            else 
            {
                cur_value = cur_value > max ? min : cur_value;
            }
        }
        else 
        {
            cur_value = cur_value < min ? min : cur_value > max ? max : cur_value;
        }

        var cur_text = maskobj.applyMask(cur_value);

        if (!this.on_fire_onspin(this, pre_text, pre_value, cur_text, cur_value, false)) 
        {
            cur_value = pre_value;
        }

        this._p_value = cur_value;

        this.on_apply_value(cur_value);

        // this._updateButton();
    };

    _pSpinField.testfunction = function ()
    {
        return true
    }

    _pSpinField.on_fire_onspin = function (obj, pretext, prevalue, posttext, postvalue, isUp) 
    {
        return nexacro.Spin.prototype.on_fire_onspin.call(this, obj, pretext, prevalue, posttext, postvalue, isUp);
    };

    _pSpinField.on_fire_oninput = function () 
    {
        this._invalidStatus(false);
        this._validStatus(false);
        var input_element = this._getInputElement();
        var v = this._needChangeInputValue(input_element.value);
        // var go_next = false;

        if (this._p_autoskip && this._maxlen > 0 && v) 
        {
            if (!input_element.isComposing() && v.length >= this._maxlen) 
            {
                v = v.substr(0, this._maxlen);
                //    go_next = true;
            }
        }

        if (v != input_element.value) input_element.setElementValue(v);

        var check = this._checkInputValidate(v);

        if (check == false) 
        {
            this.on_invalid(false);

            if (this._p_inputtype == "number") this._p_value = this._p_text = "";
        }
        else if (check == true) this.on_valid(false);
        if (!this._maxlen || this._p_text.length <= this._maxlen) this._setCharCount(this._p_text.length, this._maxlen);

        var retn = true;
        if (this.oninput && this.oninput._has_handlers) 
        {
            var evt = new nexacro.InputEventInfo(this, "oninput");
            retn = this.oninput._fireEvent(this, evt);
        }

        //if (go_next)
        //    this._setFocusToNextComponent();

        return retn;
    };

    _pSpinField._setEventHandlerToSpinButtons = function (spinfieldbox) 
    {
        if (spinfieldbox) 
        {
            var spinupbutton = spinfieldbox._leadbutton;
            var spindownbutton = spinfieldbox._trailbutton;

            if (spinupbutton) 
            {
                spinupbutton._setEventHandler("onclick", this._on_upbutton_onclick, this);
            }

            if (spindownbutton) 
            {
                spindownbutton._setEventHandler("onclick", this._on_downbutton_onclick, this);
            }
        }
    };

    _pSpinField._on_upbutton_onclick = function (obj, e) 
    {
        this._on_spin_up();
    };

    _pSpinField._on_downbutton_onclick = function (obj, e) 
    {
        this._on_spin_down();
    };

    _pSpinField.set_value = function (v, internal) 
    {
        v = this._convertValueType(v);
        v = this._needChangeInputValue(v);

        var check = this._checkApplyValidate(v);

        if (check == false) 
        {
            this.on_invalid(true);
            v = "";
        }
        else if (check == true) 
        {
            this.on_valid(true);
        }
        else 
        {
            this._invalidStatus(false);
            this._validStatus(false);
        }

        if (this._p_value !== v) 
        {
            if (!this.applyto_bindSource("value", v)) 
            {
                return;
            }

            this._setValue(v, true);
        }
        else 
        {
            var input_elem = this._getInputElement();
            if (input_elem && input_elem.value != v) this._setValue(v, true);
        }
    };

    _pSpinField.on_apply_value = function (value) 
    {
        var input_elem = this._getInputElement();
        if (input_elem) 
        {
            var pos = input_elem.getElementCaretPos();
            var text = this._p_text;

            if (!typeof value == "number" || value == undefined) 
            {
                value = this._p_value ? this._p_text : this._p_value;
            }
            else 
            {
                value = value.toString();
            }

            var _form = this._getForm();
            var _cur_focus = _form ? _form.getFocus() : null;

            if (!this._onlydisplay) 
            {
                if (this._undostack) 
                {
                    if (pos && pos != -1) 
                    {
                        this._undostack.push(value, pos.begin, pos.end);
                    }
                    else 
                    {
                        this._undostack.push(value, 0, 0);
                    }
                }

                if (value == "") input_elem.value = null;

                input_elem.setElementValue(value);

                if (value != null) text = input_elem.getElementText();
            }
            else 
            {
                input_elem.input_elem.setElementText(value);
            }

            if (this._p_text != text) 
            {
                this._p_text = text;
            }

            this._updateAccessibilityLabel();
            this._default_value = this._p_value;
            this._default_text = this._p_text;

            pos = input_elem.getElementCaretPos();
            if (pos && pos != -1) 
            {
                this._caret_pos = pos;
            }
            else 
            {
                this._change_value = this._is_created ? true : false;
            }

            if (!this._isFocused()) this._setLabelFloating(this._isContainsText(), undefined, true);

            this._refreshLabel("value");
            this._setCharCount(this._p_text.length, this._maxlen);
        }
    };

    _pSpinField._checkApplyValidate = function (value, input_check) 
    {
        // 입력값을 validation 하는 spinfield 구체화 함수
        if (!value) 
        {
            if (input_check && this._p_inputtype == "number") 
            {
                if (this._input_element) 
                {
                    var validity = this._input_element._getValidity();
                    if (validity)
                        // html only
                        return validity.valid;
                    else return false; // Always return false if the value is falsy && input type number
                }
            }
            return -1;
        }
        trace("typeof(value) : ", typeof value);
        var numberpattern = /^[+-]?(\d+(\.\d*)?|\.\d+)$|[eE]/;
        if (numberpattern) 
        {
            numberpattern = new RegExp(numberpattern);
            if (!numberpattern.test(value)) return false;
        }

        var pattern = this._p_pattern;

        if (this._p_pattern) pattern = new RegExp(this._p_pattern);

        if (!pattern) return -1;

        if (pattern.test(value)) 
        {
            trace("test가 수행됨");
            if (this._p_inputtype == "number") return isNaN(Number(value)) == false && isFinite(Number(value)) == true;

            return true;
        }
        return false;
    };

    _pSpinField.on_apply_textAlign = function (halign) 
    {
        var input_elem = this._getInputElement();
        if (input_elem) 
        {
            input_elem.setElementTextAlign(halign);
        }
    };

    _pSpinField._on_edit_onkeydown = function (obj, e) 
    {
        switch (e.keycode) 
        {
            case nexacro.Event.KEY_UP:
                this._on_spin_up();
                break;
            case nexacro.Event.KEY_DOWN:
                this._on_spin_down();
                break;
        }
    };

    _pSpinField._setEventHandlerToCalendarEdit = function (box) 
    {
        if (box) 
        {
            box._setEventHandler("onkeydown", this._on_edit_onkeydown, this);
        }
    };

    _pSpinField.set_increment = function (v) 
    {
        if (isNaN((v = +v))) 
        {
            return;
        }

        if (this._p_increment != v) 
        {
            this._p_increment = v;
        }
    };

    //===============================================================
    // nexacro.SpinField : Methods
    //===============================================================

    //===============================================================
    // nexacro.SpinField : Logical Part
    //===============================================================

    //===============================================================
    // nexacro.SpinField : Events
    //===============================================================

    //===============================================================
    // nexacro.SpinFieldBox (flexible)
    //===============================================================
    nexacro.SpinFieldBox = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent) 
    {
        nexacro.TextFieldBox.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pSpinFieldBox = nexacro._createPrototype(nexacro.TextFieldBox, nexacro.SpinFieldBox);
    nexacro.SpinFieldBox.prototype = _pSpinFieldBox;

    _pSpinFieldBox._type_name = "SpinFieldBox";
    _pSpinFieldBox._use_beforeinput = true;

    _pSpinFieldBox._p_type = "number";
    _pSpinFieldBox._input_leadingspace = undefined;

    _pSpinFieldBox._is_locale_control = true;
    _pSpinFieldBox._is_editable_control = true;

    // _pSpinFieldBox._p_buttonsize = undefined;
    // _pSpinFieldBox._p_buttontype = undefined;

    // additional control
    _pSpinFieldBox._buttonleftbox = null;
    _pSpinFieldBox._buttonrightbox = null;

    //===============================================================
    // nexacro.SpinFieldBox : Override
    //===============================================================

    _pSpinFieldBox.on_create_contents = function () 
    {
        // _control_element
        // nexacro._Browser == "Runtime"
        // button type에 따라서 컨테이너 element를 만들어준다.
        if (this._p_parent._p_buttontype == "default") 
        {
            this._container_elem = new nexacro._ButtonBoxElement(this._control_element, false);
        }
        nexacro.TextFieldBox.prototype.on_create_contents.call(this);

        // 이전 버튼 컨트롤 로직
        // this._p_numberupbutton = new nexacro._SpinFieldSpinButtonControl("numberupbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
        // this._p_numberdownbutton = new nexacro._SpinFieldSpinButtonControl("numberdownbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);

        // if(this._p_numberupbutton)
        //     this._p_numberupbutton.createComponent();
        // if (this._p_numberdownbutton)
        //     this._p_numberdownbutton.createComponent();
    };

    _pSpinFieldBox.on_created_contents = function (win) 
    {
        this.on_apply_locale(this._getLocale());
        nexacro.TextFieldBox.prototype.on_created_contents.call(this, win);
        if (this._container_elem) 
        {
            this._container_elem.create(win);
        }
    };

    _pSpinFieldBox._updateLeadingButton = function (create_only) 
    {
        this._leading_button_id = "spinupbutton";
        if (this._p_parent._p_useleadingbutton && !this._leadbutton) 
        {
            var spinupbutton = (this._leadbutton = new nexacro.FieldBaseIconControl(this._leading_button_id, 0, 0, 0, 0, null, null, null, null, null, null, this));
            spinupbutton._firstchild = true; // node 순서를 맨 앞으로..

            if (!this._isFlexible()) spinupbutton._excluded_flex = true;

            spinupbutton.createComponent(create_only);

            if (this._isFlexible()) spinupbutton.set_flexgrow(0);
        }
    };

    _pSpinFieldBox._updateTrailingButton = function (create_only) 
    {
        this._trailing_button_id = "spindownbutton";
        if (this._p_parent._p_usetrailingbutton && !this._trailbutton) 
        {
            var spindownbutton = (this._trailbutton = new nexacro.FieldBaseIconControl(this._trailing_button_id, 0, 0, 0, 0, null, null, null, null, null, null, this));

            if (!this._isFlexible()) spindownbutton._excluded_flex = true;

            spindownbutton.createComponent(create_only);

            if (this._isFlexible()) spindownbutton.set_flexgrow(0);
        }
    };

    _pSpinFieldBox.on_create_contents_command = function () 
    {
        this.on_apply_locale(this._getLocale());
        //var _buttonbox  = this._container_elem;
        var str = "";

        if (this._p_parent._p_buttontype == "default" && this._container_elem) 
        {
            //_buttonbox.createCommand();
            if (this._prefixctrl) str += this._prefixctrl.createCommand();

            str += this._input_element.createCommand();

            if (this._postfixctrl) str += this._postfixctrl.createCommand();

            str += this._container_elem.createCommandStart();

            if (this._leadbutton) str += this._leadbutton.createCommand();

            if (this._trailbutton) str += this._trailbutton.createCommand();

            str += this._container_elem.createCommandEnd();
        }
        else 
        {
            if (this._leadbutton) str += this._leadbutton.createCommand();

            if (this._prefixctrl) str += this._prefixctrl.createCommand();

            str += this._input_element.createCommand();

            if (this._postfixctrl) str += this._postfixctrl.createCommand();

            if (this._trailbutton) str += this._trailbutton.createCommand();
        }
        return str;
    };

    _pSpinFieldBox.on_attach_contents_handle = function (win) 
    {
        nexacro.TextFieldBox.prototype.on_attach_contents_handle.call(this, win);

        // if (this._p_numberupbutton)
        // {
        //     this._p_numberupbutton.attachHandle(win);
        // }
        // if (this._p_numberdownbutton)
        // {
        //     this._p_numberdownbutton.attachHandle(win);
        // }
    };

    _pSpinFieldBox._remove_buttonbox = function () 
    {
        this._container_elem.destroy();
        this._container_elem = null;
        // var _win = this._getWindow();
        // this._p_numberupbutton._control_element.owner_elem = null;
        // this._p_numberdownbutton._control_element.owner_elem = null;

        // if(this._p_numberupbutton)
        // {
        //     this._p_numberupbutton.on_created(_win);
        //     this._p_numberupbutton._control_element.appendChildElement(owner_elem);

        //     if (this._container_elem)
        //     {
        //         //this._p_numberupbutton._control_element.appendChildElement(this._container_elem);
        //     }

        // }
        // if (this._p_numberdownbutton)
        // {
        //     this._p_numberdownbutton.on_created(_win);
        //     this._p_numberdownbutton._control_element.appendChildElement(owner_elem);

        //     if (this._container_elem)
        //     {
        //         //this._p_numberdownbutton._control_element.appendChildElement(this._container_elem);
        //     }
        // }
    };

    _pSpinFieldBox._create_buttonbox = function () 
    {
        var container_elem = this._container_elem;
        var _win = this._getWindow();
        if (container_elem) 
        {
            if (this._p_numberupbutton) 
            {
                this._p_numberupbutton.on_created(_win);
                if (this._container_elem) 
                {
                    // 코드 삽입 시 오류
                    //this._p_numberupbutton._control_element.appendChildElement(this._container_elem);
                }
            }
            if (this._p_numberdownbutton) 
            {
                this._p_numberdownbutton.on_created(_win);
                if (this._container_elem) 
                {
                    // 코드 삽입 시 오류
                    //this._p_numberdownbutton._control_element.appendChildElement(this._container_elem);
                }
            }
        }
    };

    _pSpinFieldBox._move_button = function (button, left, top, width, height) 
    {
        if (button) 
        {
            button.move(left, top, width, height, null, null);
        }
    };

    _pSpinFieldBox._recalc_box = function () 
    {
        if (this._control_element) 
        {
            var _box = {
                left: this._getClientLeft(),
                top: this._getClientTop(),
                width: this._getClientWidth(),
                height: this._getClientHeight(),
            };

            trace(_box.height);
            var buttonbox_elem = this._container_elem;
            var input_elem = this._input_element;
            var prefixtext = this._prefixctrl;
            var postfixtext = this._postfixctrl;

            var spinbuttonsize = this._p_iconbuttonsize ?? _box.height;
            var spinupbutton = this._leadbutton; // textfield 상속받는 leading button
            var spindownbutton = this._trailbutton; // textfield 상속받는 trailing button
            var buttontype = this._p_parent._p_buttontype;

            //text variable
            var prefix_width = 0,
                postfix_width = 0;
            var spinupbutton_width = 0,
                spindownbutton_width = 0;
            var pos_btn_right = _box.left + _box.width - spinbuttonsize;

            if (typeof spinbuttonsize == "number") 
            {
                spinupbutton_width = spindownbutton_width = spinbuttonsize;
            }
            else 
            {
                spinbuttonsize = spinbuttonsize.split(" ");
                spinupbutton_width = +spinbuttonsize[0];
                spindownbutton_width = spinbuttonsize[1] ? +spinbuttonsize[1] : spinbuttonsize;
            }

            if (buttonbox_elem) 
            {
                if (spinupbutton_width > 0) spinbuttonsize = spinupbutton_width;

                buttonbox_elem.setElementSize(spinbuttonsize, _box.height);
                buttonbox_elem.setElementPosition(pos_btn_right, 0);
            }

            if (spinupbutton && spindownbutton) 
            {
                var param_left;
                if (this._isFlexible()) 
                {
                    param_left = 0;
                }
                else 
                {
                    buttontype == "default" ? (param_left = _box.width - spinbuttonsize) : (param_left = 0);
                }
                this._recalc_spinbutton(param_left);
            }

            var f_label_height = this._p_parent.getFloatingLabelHeight();

            if (this._p_parent._p_labelposition == "inside") 
            {
                var border = this._getCurrentStyleBorder();
                var border_t = border ? border.top._width : 0;

                _box.top = f_label_height + border_t;
                _box.height -= _box.height;
            }

            if (prefixtext) 
            {
                var leadingspace = _box.left;
                if (buttontype == "horizontal") leadingspace += spinbuttonsize;

                prefix_width = prefixtext._on_getFitSize()[0];
                this._recalc_box_prefixtext(leadingspace);
            }

            if (postfixtext) 
            {
                var trailingspace = _box.width - spinbuttonsize;
                postfix_width = postfixtext._on_getFitSize()[0];
                this._recalc_box_postfixtext(trailingspace);
            }

            if (input_elem) 
            {
                var input_width = _box.width - prefix_width - postfix_width;
                var input_leadingspace = _box.left + prefix_width;
                this._recalc_box_inputelem(input_elem, input_width, input_leadingspace);
            }
        }
    };

    _pSpinFieldBox._recalc_box_icon = function () 
    {
        var iconsize = this._p_buttonsize;
        var _spinfieldbox_height = this.client_height;

        if (!iconsize) 
        {
            obj_iconsize.width = _spinfieldbox_height;
            obj_iconsize.height = _spinfieldbox_height;
        }
        else 
        {
            if (typeof iconsize == "number") 
            {
                obj_iconsize.width = obj_iconsize.height = iconsize;
            }
            else 
            {
                iconsize = iconsize.split(" ");
                obj_iconsize.width = +iconsize[0];
                obj_iconsize.height = iconsize[1] ? +iconsize[1] : _spinfieldbox_height;
            }
        }

        if (obj_iconsize.width > _spinfieldbox_width)
            // width over, second
            obj_iconsize.width = _spinfieldbox_width;
        if (obj_iconsize.height > _spinfieldbox_height)
            // height over, second
            obj_iconsize.height = _spinfieldbox_height;

        // icon size가 정해지면 icon size를 기준으로 leading, trailing icon size를 정한다.
        obj_leadingiconsize.width = obj_iconsize_width;
        obj_leadingiconsize.height = obj_iconsize.height;
        obj_trailingiconsize.width = obj_iconsize_width;
        obj_trailingiconsize.height = obj_iconsize.height;
    };

    _pSpinFieldBox._recalc_spinbutton = function (leadingspace) 
    {
        var spinbuttonsize = this._p_iconbuttonsize ?? this._getClientHeight();
        var spinupbutton = this._leadbutton;
        var spindownbutton = this._trailbutton;
        var box_width = this._getClientWidth();
        var box_height = this._getClientHeight();
        var btn_left;
        var btn_top;
        var btn_width;
        var btn_height;

        if (typeof spinbuttonsize == "number") 
        {
            btn_width = btn_height = spinbuttonsize;
        }
        else 
        {
            spinbuttonsize = spinbuttonsize.split(" ");
            btn_width = +spinbuttonsize[0];
            btn_height = spinbuttonsize[1] ? +spinbuttonsize[1] : spinbuttonsize;
        }

        btn_left = leadingspace;
        btn_top = 0;

        if (btn_left <= 0) 
        {
            if (btn_height > box_height) 
            {
                btn_height = box_height;
            }

            //horizontal
            spinupbutton.move(btn_left, btn_top, btn_width, btn_height, null, null);
            spindownbutton.move(box_width - btn_width, btn_top, btn_width, btn_height, null, null);
        }
        else 
        {
            if (btn_height > box_height) 
            {
                btn_height = box_height;
            }

            //default
            spinupbutton.move(btn_left, btn_top, btn_width, btn_height / 2, null, null);
            spindownbutton.move(btn_left, btn_height / 2, btn_width, btn_height / 2, null, null);
        }

        spinupbutton._initControlElementLayoutProps();
        spindownbutton._initControlElementLayoutProps();
    };

    _pSpinFieldBox._recalc_box_prefixtext = function (leadingspace) 
    {
        var prefixtext = this._prefixctrl;
        var text_left = leadingspace;
        var text_top = this._getClientTop();
        var text_width = prefixtext._on_getFitSize()[0];
        var text_height = this._getClientHeight();

        if (this._isFlexible()) 
        {
            prefixtext.padding = "0px 0px 0px 10px";
        }

        prefixtext.move(text_left, text_top, text_width, text_height);
        prefixtext._initControlElementLayoutProps();

        if (this._isFlexible()) prefixtext.getElement()._forceApplyPosTop(text_top);
    };

    _pSpinFieldBox._recalc_box_postfixtext = function (leadingspace) 
    {
        var postfixtext = this._postfixctrl;
        var text_top = this._getClientTop();
        var text_width = postfixtext._on_getFitSize()[0];
        var text_height = this._getClientHeight();
        var text_left = leadingspace - text_width;

        postfixtext.move(text_left, text_top, text_width, text_height);
        postfixtext._initControlElementLayoutProps();

        if (this._isFlexible()) postfixtext.getElement()._forceApplyPosTop(text_height);
    };

    _pSpinFieldBox._recalc_box_inputelem = function (input_elem, input_width, input_leadingspace) 
    {
        var input_elem_width;
        var input_elem_height = this._getClientHeight();
        var input_elem_left = input_leadingspace;
        var input_elem_top = this._getClientTop();
        var spinbuttonsize = this._p_parent._p_buttonsize ?? this._getClientHeight();
        var buttontype = this._p_parent._p_buttontype;

        if (buttontype == "horizontal") 
        {
            input_elem_width = input_width - 2 * spinbuttonsize;
        }
        else 
        {
            input_elem_width = input_width - 1 * spinbuttonsize;
        }

        this._input_leadingspace = input_elem_left;

        if (!this._isFlexible()) 
        {
            input_elem_left += buttontype == "horizontal" ? spinbuttonsize : 0;
        }

        input_elem.setElementSize(input_elem_width, input_elem_height);
        input_elem.setElementPosition(input_elem_left, input_elem_top);
    };

    _pSpinFieldBox._getWantLabelLeft = function () 
    {
        var left = -1;
        var spinbuttonsize = this._p_parent._p_buttonsize ?? this._getClientHeight();
        var paddingleft = 10;
        var buttontype = this._p_parent._p_buttontype;

        // TextField의 보정 값 계산 필요. spinField 구조변경 때문에 지움
        var prevalue = nexacro.TextFieldBox.prototype._getWantLabelLeft.call(this) - (buttontype == "default" ? spinbuttonsize : 0);

        left = paddingleft + prevalue + this._input_leadingspace;
        return left;
    };

    _pSpinFieldBox.on_change_containerRect = function (width, height) 
    {
        // todo : refact
        if (this._container_elem && this._control_element) 
        {
            this._recalc_box();
        }
        else if (this._p_parent._p_buttontype == "horizontal" && this._control_element) 
        {
            this._recalc_box();
        }
    };

    _pSpinFieldBox._getMaskObj = function () 
    {
        var maskobj = this._p_parent._masktypeobj;
        if (maskobj) 
        {
            return maskobj;
        }

        return null;
    };

    _pSpinFieldBox._on_apply_inputtype = function () 
    {
        var maskobj = this._getMaskObj();
        var input_elem = this._input_element;
        if (maskobj && input_elem) 
        {
            var mode = maskobj.getInputMode();

            if (!this._onlydisplay) input_elem.setElementInputType(mode, true);
        }
    };

    _pSpinFieldBox.on_apply_locale = function (locale) 
    {
        var maskobj = this._getMaskObj();
        if (maskobj) 
        {
            maskobj.setLocale(locale);
        }
    };

    _pSpinFieldBox._on_input_autoskip = nexacro._emptyFn;

    _pSpinFieldBox.on_keypress_basic_action = function (keycode, charcode, alt_key, ctrl_key) 
    {
        return nexacro.MaskEdit.prototype.on_keypress_basic_action.call(this, keycode, charcode, alt_key, ctrl_key);
    };

    _pSpinFieldBox.on_lbuttondown_default_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key) 
    {
        return this._p_parent.on_lbuttondown_default_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
    };

    _pSpinFieldBox.on_lbuttonup_default_action = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key) 
    {
        return this._p_parent.on_lbuttonup_default_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, refer_comp, meta_key);
    };

    _pSpinFieldBox.on_beforekeyinput_basic_action = function (
        value,
        status,
        begin,
        end,
        inputType, // IME를 막기위해 필요
    ) 
    {
        return nexacro.MaskEdit.prototype.on_beforekeyinput_basic_action.call(this, value, status, begin, end, inputType);
    };

    _pSpinFieldBox.on_fire_onclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key) 
    {
        return this._p_parent.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
    };

    _pSpinFieldBox._beforeinput_process_with_HTMLEvent = function (value, status, begin, end, inputType) 
    {
        return nexacro.MaskEdit.prototype._beforeinput_process_with_HTMLEvent.call(this, value, status, begin, end, inputType);
    };

    _pSpinFieldBox._beforeinput_process_with_NexacroInputEvent = function (value, status, begin, end) 
    {
        return nexacro.MaskEdit.prototype._beforeinput_process_with_NexacroInputEvent.call(this, value, status, begin, end);
    };

    // _pSpinFieldBox._update_down_button = function (create_only) {
    //     if (!this._p_numberdownbutton) {
    //         switch (this.id) {
    //             case 'buttonleftbox':
    //                 var numberdownbutton = this._p_numberdownbutton = new nexacro._SpinFieldSpinButtonControl("numberdownbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
    //                 numberdownbutton.createComponent(create_only);
    //                 break;
    //             case 'buttonrightbox':
    //             default:
    //                 if (this._p_parent._p_parent._p_buttontype == 'default') {
    //                     var numberdownbutton = this._p_numberdownbutton = new nexacro._SpinFieldSpinButtonControl("numberdownbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);
    //                     numberdownbutton.createComponent(create_only);
    //                 }
    //                 break;
    //         }
    //     }

    //     if (this._p_numberdownbutton) {
    //         switch (this.id) {
    //             case 'buttonleftbox':
    //                 if (this._p_parent._p_parent._p_buttontype == 'default') {
    //                     this.destroyNumberDownButton();
    //                 }
    //                 break;
    //             case 'buttonrightbox':
    //                 if (this._p_parent._p_parent._p_buttontype == 'horizontal') {
    //                     this.destroyNumberDownButton();
    //                 }
    //             default:
    //                 break;
    //         }
    //     }
    // }

    // _pSpinFieldBox.destroyNumberUpButton = function () {
    //     if (this._p_numberupbutton) {
    //         this._p_numberupbutton.destroy();
    //         this._p_numberupbutton = null;
    //     }
    // }

    // _pSpinFieldBox.destroyNumberDownButton = function () {
    //     if (this._p_numberdownbutton) {
    //         this._p_numberdownbutton.destroy();
    //         this._p_numberdownbutton = null;
    //     }
    // }

    //spin의 buttonposition에 따른 위치 변경함수
    // _pSpinFieldBox.recalcButton = function () {
    //     if(this._container_elem)
    //     {
    //         var buttoncontainer = this._container_elem;
    //         var container_w = buttoncontainer.width;
    //         var container_h = buttoncontainer.height;
    //         var spinbuttonsize = this._p_iconbuttonsize;
    //         var buttontype = this._p_parent._p_buttontype;
    //         var spinupbutton = this._p_numberupbutton
    //         var spindownbutton = this._p_numberdownbutton
    //         var spinbuttonbox_w, spinbuttonbox_h;

    //         if (!spinbuttonsize) {
    //             spinbuttonbox_w = container_h;
    //             spinbuttonbox_h = container_h;
    //         }
    //         switch (buttontype) {

    //             case 'horizontal':
    //                 if (spinupbutton) {
    //                     // spinupbutton.background = 'blue'
    //                     spinupbutton.move(0, 0, spinbuttonbox_w/2, spinbuttonbox_h, null, null);
    //                     spinupbutton._initControlElementLayoutProps();
    //                 }
    //                 if (spindownbutton) {
    //                     spindownbutton.move(0, 0, spinbuttonbox_w/2, spinbuttonbox_h, null, null);
    //                     spindownbutton._initControlElementLayoutProps();
    //                 }
    //                 break;
    //             case 'default':
    //             default:
    //                 if (spinupbutton) {
    //                     // spinupbutton.background = 'blue'
    //                     spinupbutton.move(0, 0, container_w, container_h / 2, null, null);
    //                 }
    //                 if (spindownbutton) {
    //                     // spindownbutton.background = 'red'
    //                     spindownbutton.move(0, 0, container_w, container_h / 2, null, null);
    //                 }
    //                 break;
    //         }
    //     }
    // }

    //===============================================================
    // nexacro.UpdownButtonControl
    //===============================================================

    nexacro._SpinFieldSpinButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent) 
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pSpinFieldSpinButtonControl = nexacro._createPrototype(nexacro.Button, nexacro._SpinFieldSpinButtonControl);
    nexacro._SpinFieldSpinButtonControl.prototype = _pSpinFieldSpinButtonControl;
    _pSpinFieldSpinButtonControl._type_name = "ButtonControl";
    _pSpinFieldSpinButtonControl._is_subcontrol = true;
    _pSpinFieldSpinButtonControl._is_focus_accept = false;

    delete _SpinFieldSpinButtonControl;
    delete _pSpinFieldBox;
    delete _pSpinField;
}
