define([], () => {
    class NumberUtils {
        constructor() { }

        numberWithCommas(numStr) {
            return numStr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }

        number_minus_obj(number, obj) {
            let obj_key_arr = Object.keys(obj)
            for (var i = 0; i < obj_key_arr.length; i++) {
                let obj_key = obj_key_arr[i]
                let obj_value = obj[obj_key]
                if (number >= obj_value) {
                    obj[obj_key] = 0
                    number -= obj_value
                } else if (number < obj_value) {
                    obj[obj_key] -= number
                    number = 0
                }
            }
            return { obj: obj, number: number }
        }
    }

    return NumberUtils
})
