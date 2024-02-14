/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/config', 'N/format', '../lib/Time/moment'], (config, format, moment) => {
    class DateUtils {
        constructor() {
            const userPreferences = config.load({ type: config.Type.USER_PREFERENCES, isDynamic: true })
            this.dateFormat = userPreferences.getValue({ fieldId: 'DATEFORMAT' })
            this.timeFormat = userPreferences.getValue({ fieldId: 'TIMEFORMAT' })
            this.dateTimeFormat = `${this.dateFormat} ${this.timeFormat}`

            this.inputDateFormat = 'YYYY-MM-DD'
            this.inputDateTimeFormat = 'YYYY-MM-DD HH:mm:ss'
        }

        getNetsuiteDateFormat() {
            return this.dateFormat
        }

        dateStringToInputFormat(dateString) {
            return dateString ? moment(dateString, this.dateTimeFormat).format(this.inputDateFormat) : ''
        }

        dateTimeStringToInputFormat(dateTimeString) {
            return dateTimeString ? moment(dateTimeString, this.dateTimeFormat).format(this.inputDateTimeFormat) : ''
        }

        dateStringToNetsuite(dateString) {
            log.debug("date", dateString)
            log.debug("ENDDATE", moment(dateString, this.inputDateFormat).format(this.dateFormat))
            return dateString ? moment(dateString, this.inputDateFormat).format(this.dateFormat) : ''
        }

        dateTimeStringToNetsuite(dateTimeString) {
            return dateTimeString ? moment(dateTimeString, this.inputDateTimeFormat).format(this.dateTimeFormat) : ''
        }

        convertDateTimeStringToNSDateString(dateTimeString) {
            return dateTimeString ? moment(dateTimeString, this.inputDateTimeFormat).format(this.dateFormat) : ''
        }

        isSameOrAfterFromToday(dateString, dateFormat = this.inputDateFormat) {
            return moment(dateString, dateFormat).isSameOrAfter(moment(), 'day')
        }

        getTodayInputFormat() {
            return moment().format(this.inputDateFormat)
        }
        getTodayDateTimeInputFormat() {
            return moment().format(this.inputDateTimeFormat)
        }

        get18MonthsFromTodayInputFormat() {
            return moment().add(18, 'months').format(this.inputDateFormat)
        }

        getMonthEndOfDate(
            date = this.getTodayNetsuiteFormat().date,
            { inputFormat = this.dateFormat, outputFormat = this.dateFormat } = {}
        ) {
            return moment(date, inputFormat).endOf('month').format(outputFormat)
        }

        getMonthStartOfDate(
            date = this.getTodayNetsuiteFormat().date,
            { inputFormat = this.dateFormat, outputFormat = this.dateFormat } = {}
        ) {
            return moment(date, inputFormat).startOf('month').format(outputFormat)
        }

        getStartDateforCalculateCumulativeAmountNetsuiteFormat(spendingPeriod, effectiveTo) {
            log.debug("effectiveTo", effectiveTo)
            if (effectiveTo) {

                return moment(effectiveTo, this.inputDateFormat)
                    .add(-spendingPeriod, 'months')
                    .add(1, 'days')
                    .format(this.dateFormat)
            } else {
                return moment()
                    .add(-spendingPeriod, 'months')
                    .add(1, 'days')
                    .format(this.dateFormat)
            }
        }

        getTodayNetsuiteFormat() {
            const formattedDate = format.format({
                value: new Date(),
                type: format.Type.DATETIME,
                timezone: format.Timezone.ASIA_HONG_KONG,
            })
            const [date] = formattedDate.split(' ')
            return { date, dateTime: formattedDate }
        }

        /**
         * Get the difference between two dates in days
         * If date1 > date2, the result will be positive
         * If date1 < date2, the result will be negative
         *
         * @param date1
         * @param date2
         * @param unit
         * @returns {number}
         */
        diffDate(date1, date2, unit = 'days') {
            return moment(date1, this.inputDateFormat).diff(moment(date2, this.inputDateFormat), unit)
        }

        transformDate(date, { value, unit }, { inputFormat, outputFormat }) {
            return moment(date, inputFormat).add(value, unit).format(outputFormat)
        }
    }

    return DateUtils
})
