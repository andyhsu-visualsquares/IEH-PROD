/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['../lib/lodash'], (_) => {
    class TypeChecker {
        isString(value) {
            return typeof value === 'string'
        }

        isNumber(value) {
            return typeof value === 'number' && !isNaN(value)
        }

        isBoolean(value) {
            return typeof value === 'boolean'
        }

        isArray(value) {
            return Array.isArray(value)
        }

        isObject(value) {
            return typeof value === 'object' && value !== null && !Array.isArray(value)
        }

        isFunction(value) {
            return typeof value === 'function'
        }

        isDateString(value) {
            // Regular expression to match 'YYYY-MM-DD' pattern
            const datePattern = /^\d{4}-\d{2}-\d{2}$/
            return this.isString(value) && datePattern.test(value)
        }

        isDateTimeString(value) {
            // Regular expression to match 'YYYY-MM-DD HH:MM:SS' pattern
            const dateTimePattern = /^(\d{4}-\d{2}-\d{2} (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))$/
            return this.isString(value) && dateTimePattern.test(value)
        }

        checkTypes(typeChecks, acceptEmpty = true) {
            const results = []

            for (const item of typeChecks) {
                const { value, type, field } = item
                let isValid = false

                switch (type) {
                    case 'string':
                        isValid = acceptEmpty && _.isEmpty(value) ? true : this.isString(value)
                        break
                    case 'number':
                        isValid = acceptEmpty && _.isEmpty(value) ? true : this.isNumber(value)
                        break
                    case 'boolean':
                        isValid = this.isBoolean(value)
                        break
                    case 'array':
                        isValid = this.isArray(value)
                        break
                    case 'object':
                        isValid = this.isObject(value)
                        break
                    case 'function':
                        isValid = this.isFunction(value)
                        break
                    case 'date':
                        isValid = acceptEmpty && _.isEmpty(value) ? true : this.isDateString(value)
                        break
                    case 'dateTime':
                        isValid = acceptEmpty && _.isEmpty(value) ? true : this.isDateTimeString(value)
                        break
                }

                results.push({ value, type, isValid, field })
            }

            return results
        }
    }

    return TypeChecker
})
