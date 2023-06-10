// Đối tượng
function Validator(options) {

    function getParent(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }

            element = element.parentElement
        }
    }

    var selectorRules = {};
    // Hàm thực hiện validate
    function validate(inputElement, rule) {

        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;
        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];
        // Lặp qua từng rules & kiểm tra
        for(var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default :
                    errorMessage = rules[i](inputElement.value);
            }
            if(errorMessage) break;
        }

        if(errorMessage) {
            errorElement.innerText = errorMessage
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }

        return !errorMessage;
    }

    // Xử ý khi người dùng nhập
    function checkInput(inputElement) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        errorElement.innerText = '';
        getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
    }

    // Lấy element của từng form cần validate
    var formElement = document.querySelector(options.form);
    if(formElement) {
        formElement.onsubmit = function(e) {
            e.preventDefault()
            
            var isFormValid = true;
            // lặp qua từng rule và validate luôn
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);
                
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false;
                }

            });
            var enableInputs = formElement.querySelectorAll('[name]' )//:not([disabled])')
          
            if(isFormValid) {
                // Trường hợp submit với javascript
                if (typeof options.onSubmit === 'function') {
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="'+input.name+'"]:checked').value;
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                values[input.name] = '';
                                    return values;
                                }
                                if(!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {})
                options.onSubmit(formValues);
                } 
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit();
                }
            } 
        }

        // Xử lí lặp qua mỗi rule
        options.rules.forEach(function(rule) {
            // Lưu lại các rules cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            }else {
                selectorRules[rule.selector] = [rule.test];
            }


            var inputElements = formElement.querySelectorAll(rule.selector);
            
            Array.from(inputElements).forEach(function (inputElement) {
                inputElement.onblur = function() {
                    validate(inputElement, rule);
                }

                // Xử lí trường hợp người dùng nhập vào input
                inputElement.oninput = function() {
                    checkInput(inputElement);
                }
            })

        })
    }
}


// Định nghĩa các rules
// Nguyên tắc của rules
// 1. Khi có lỗi => message lỗi
// 2. Khi hợp lệ => undefined
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            // Dùng khi không có dạng checked
            // return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
            // Dùng khi có dạng checked
            return value ? undefined : message || 'Vui lòng nhập trường này';
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message ||'Trường này phải là email'
        }
    }
}

Validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
           return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
           return value === getConfirmValue() ? undefined : message || "Giá trị nhập vào không chính xác"
        }
    }
}