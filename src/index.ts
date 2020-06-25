import { createMethod } from '@st-lib/private'
import { isNumberString } from '@st-lib/is'

enum attr {
	dateStyle = 'dateStyle',
	timeStyle = 'timeStyle',
	fractionalSecondDigits = 'fractionalSecondDigits',
	calendar = 'calendar',
	dayPeriod = 'dayPeriod',
	numberingSystem = 'numberingSystem',
	localeMatcher = 'localeMatcher',
	timeZone = 'timeZone',
	hour12 = 'hour12',
	hourCycle = 'hourCycle',
	formatMatcher = 'formatMatcher',
	weekday = 'weekday',
	era = 'era',
	year = 'year',
	month = 'month',
	day = 'day',
	hour = 'hour',
	minute = 'minute',
	second = 'second',
	timeZoneName = 'timeZoneName',
	value = 'value',
}

const textId = 'text'
const fallbackId = 'fallback'

const styleContent = `
:host {
	display: inline;
}
#${textId} {
	display: contents;
}
#${textId}:not(:empty) + #${fallbackId} {
	display: none;
}`.trim()

function getLang(root: HTMLElement): string | string[] {
	if (root.lang) return root.lang
	if (root.parentElement) return getLang(root.parentElement)
	return window.navigator.languages as string[]
}

const dateStyleAttr = createEnumAttr(attr.dateStyle, ['full', 'long', 'medium', 'short'])
const timeStyleAttr = createEnumAttr(attr.timeStyle, ['full', 'long', 'medium', 'short'])
const fractionalSecondDigitsAttr = createNumberAttr(attr.fractionalSecondDigits, { min: 0, max: 3 })
const calendarAttr = createEnumAttr(attr.calendar, ['buddhist', 'chinese', 'coptic', 'ethiopia', 'ethiopic', 'gregory', 'hebrew', 'indian', 'islamic', 'iso8601', 'japanese', 'persian', 'roc'])
const dayPeriodAttr = createEnumAttr(attr.dayPeriod, ['narrow', 'short', 'long'])
const numberingSystemAttr = createEnumAttr(attr.numberingSystem, ['arab', 'arabext', 'bali', 'beng', 'deva', 'fullwide', 'gujr', 'guru', 'hanidec', 'khmr', 'knda', 'laoo', 'latn', 'limb', 'mlym', 'mong', 'mymr', 'orya', 'tamldec', 'telu', 'thai', 'tibt'])
const localeMatcherAttr = createEnumAttr(attr.localeMatcher, ['lookup', 'best fit'])
const timeZoneAttr = createStringAttr(attr.timeZone)
const hour12Attr = createBooleanAttr(attr.hour12)
const hourCycleAttr = createEnumAttr(attr.hourCycle, ['h11', 'h12', 'h23', 'h24'])
const formatMatcherAttr = createEnumAttr(attr.formatMatcher, ['basic', 'best fit'])
const weekdayAttr = createEnumAttr(attr.weekday, ['long', 'short', 'narrow'])
const eraAttr = createEnumAttr(attr.era, ['long', 'short', 'narrow'])
const yearAttr = createEnumAttr(attr.year, ['numeric', '2-digit'])
const monthAttr = createEnumAttr(attr.month, ['long', 'short', 'narrow'])
const dayAttr = createEnumAttr(attr.day, ['numeric', '2-digit'])
const hourAttr = createEnumAttr(attr.hour, ['numeric', '2-digit'])
const minuteAttr = createEnumAttr(attr.minute, ['numeric', '2-digit'])
const secondAttr = createEnumAttr(attr.second, ['numeric', '2-digit'])
const timeZoneNameAttr = createEnumAttr(attr.timeZoneName, ['long', 'short'])
const valueAttr = createDateAttr(attr.value)

function toLowerCase(inp: string | String) {
	return inp.toLowerCase()
}
function createBooleanAttr(name: string, falseValues: readonly string[] | null = null) {
	const caseInsensitiveFalseValues = null != falseValues ? falseValues.map(toLowerCase) : null
	return {
		get(target: Element, fallback: boolean = false) {
			const value = target.getAttribute(name)
			return null == value ? fallback : null == caseInsensitiveFalseValues || !caseInsensitiveFalseValues.includes(value.trim().toLowerCase())
		},
		set(target: Element, force: any) {
			target.toggleAttribute(name, force)
		}
	}
}
function createEnumAttr<T extends string>(name: string, values: readonly T[]): { get<F>(target: Element, fallback: F): T | F, set(target: Element, value: any): void } {
	const caseInsensitiveValues = values.map(toLowerCase)
	return {
		get<F>(target: Element, fallback: F): F | T {
			const value = target.getAttribute(name)
			if (null == value) return fallback
			const index = caseInsensitiveValues.indexOf(value.trim().toLowerCase())
			return ~index ? values[index] : fallback
		},
		set(target: Element, value: any) {
			if (typeof value === 'undefined') return
			if (null == value) target.removeAttribute(name)
			else target.setAttribute(name, value)
		}
	}
}
function createNumberAttr(name: string, options?: { min?: number, max?: number }) {
	return {
		get<F>(target: Element, fallback: F) {
			const value = target.getAttribute(name)
			if (null == value) return fallback
			let out = +value
			if (isNaN(out)) return fallback
			if (options) {
				const min = null == options.min ? null : +options.min
				const max = null == options.max ? null : +options.max
				if (null != min && !isNaN(min)) out = Math.max(out, min)
				if (null != max && !isNaN(max)) out = Math.min(out, max)
			}
			return out
		},
		set(target: Element, value: any) {
			if (typeof value === 'undefined') return
			if (null == value || isNaN(+value)) target.removeAttribute(name)
			else target.setAttribute(name, value)
		}
	}
}
function createDateAttr(name: string) {
	return {
		get<F>(target: Element, fallback: F) {
			const value = target.getAttribute(name)
			if (null == value) return fallback
			if (isNumberString(value)) return new Date(+value)
			const out = new Date(value)
			return isNaN(+out) ? fallback : out
		},
		set(target: Element, value: any) {
			if (typeof value === 'undefined') return
			if (null == value || isNaN(+value)) target.removeAttribute(name)
			else target.setAttribute(name, value)
		}
	}
}
function createStringAttr<T = string>(name: string, format?: (input: string) => T) {
	return {
		get<F>(target: Element, fallback: F) {
			const value = target.getAttribute(name)
			if (null == value) return fallback
			if (typeof format === 'function') return format(value)
			return value
		},
		set(target: Element, value: any) {
			if (typeof value === 'undefined') return
			if (null == value) target.removeAttribute(name)
			else target.setAttribute(name, value)
		}
	}
}

function getOptions(inp: Record<any, any>) {
	const o: Record<any, any> = {}
	// avoid property getter recalculation
	const {
		dateStyle,
		timeStyle,
		fractionalSecondDigits,
		calendar,
		dayPeriod,
		numberingSystem,
		localeMatcher,
		timeZone,
		hour12,
		hourCycle,
		formatMatcher,
		weekday,
		era,
		year,
		month,
		day,
		hour,
		minute,
		second,
		timeZoneName,
	} = inp
	if (null != dateStyle) o.dateStyle = dateStyle
	if (null != timeStyle) o.timeStyle = timeStyle
	if (null != fractionalSecondDigits) o.fractionalSecondDigits = fractionalSecondDigits
	if (null != calendar) o.calendar = calendar
	if (null != dayPeriod) o.dayPeriod = dayPeriod
	if (null != numberingSystem) o.numberingSystem = numberingSystem
	if (null != localeMatcher) o.localeMatcher = localeMatcher
	if (null != timeZone) o.timeZone = timeZone
	if (null != hour12) o.hour12 = hour12
	if (null != hourCycle) o.hourCycle = hourCycle
	if (null != formatMatcher) o.formatMatcher = formatMatcher
	if (null != weekday) o.weekday = weekday
	if (null != era) o.era = era
	if (null != year) o.year = year
	if (null != month) o.month = month
	if (null != day) o.day = day
	if (null != hour) o.hour = hour
	if (null != minute) o.minute = minute
	if (null != second) o.second = second
	if (null != timeZoneName) o.timeZoneName = timeZoneName
	return o
}

const observedAttributes = Object.values(attr).map(toLowerCase).concat('lang')
const numberFormattersMap: Record<string, Intl.DateTimeFormat> = {}

const [update, defineUpdate] = createMethod()

export class UIDateElement extends HTMLElement {
	static get observedAttributes() {
		return observedAttributes.slice()
	}

	constructor() {
		super()
		const shadow = this.attachShadow({ mode: 'closed' })
		const formatted = document.createElement('span')
		formatted.id = textId
		const fallback = document.createElement('slot')
		fallback.id = fallbackId
		const style = document.createElement('style')
		style.innerHTML = styleContent
		shadow.append(
			style,
			formatted,
			fallback,
		)
		const update = () => {
			try {
				const {
					value,
				} = this
				if (null == value) {
					if ('' !== formatted.textContent && null != formatted.textContent) formatted.textContent = null
					return
				}
				const options = getOptions(this)
				const locales = getLang(this)
				const optionsHashCode = JSON.stringify([locales, options])
				let textContent: string
				if (optionsHashCode in numberFormattersMap) {
					textContent = numberFormattersMap[optionsHashCode].format(value)
				} else {
					const dateTimeFormat = new Intl.DateTimeFormat(locales, options)
					textContent = dateTimeFormat.format(value)
					numberFormattersMap[optionsHashCode] = dateTimeFormat
				}
				if (textContent !== formatted.textContent) formatted.textContent = textContent
			} catch (e) {
				console.error(e)
				if ('' !== formatted.textContent && null != formatted.textContent) formatted.textContent = null
			}
		}
		defineUpdate(this, update)
	}
	get dateStyle() {
		return dateStyleAttr.get(this, null)
	}
	set dateStyle(inp) {
		dateStyleAttr.set(this, inp)
	}
	get timeStyle() {
		return timeStyleAttr.get(this, null)
	}
	set timeStyle(inp) {
		timeStyleAttr.set(this, inp)
	}
	get fractionalSecondDigits() {
		return fractionalSecondDigitsAttr.get(this, null)
	}
	set fractionalSecondDigits(inp) {
		fractionalSecondDigitsAttr.set(this, inp)
	}
	get calendar() {
		return calendarAttr.get(this, null)
	}
	set calendar(inp) {
		calendarAttr.set(this, inp)
	}
	get dayPeriod() {
		return dayPeriodAttr.get(this, null)
	}
	set dayPeriod(inp) {
		dayPeriodAttr.set(this, inp)
	}
	get numberingSystem() {
		return numberingSystemAttr.get(this, null)
	}
	set numberingSystem(inp) {
		numberingSystemAttr.set(this, inp)
	}
	get localeMatcher() {
		return localeMatcherAttr.get(this, null)
	}
	set localeMatcher(inp) {
		localeMatcherAttr.set(this, inp)
	}
	get timeZone() {
		return timeZoneAttr.get(this, null)
	}
	set timeZone(inp) {
		timeZoneAttr.set(this, inp)
	}
	get hour12() {
		return hour12Attr.get(this)
	}
	set hour12(inp) {
		hour12Attr.set(this, inp)
	}
	get hourCycle() {
		return hourCycleAttr.get(this, null)
	}
	set hourCycle(inp) {
		hourCycleAttr.set(this, inp)
	}
	get formatMatcher() {
		return formatMatcherAttr.get(this, null)
	}
	set formatMatcher(inp) {
		formatMatcherAttr.set(this, inp)
	}
	get weekday() {
		return weekdayAttr.get(this, null)
	}
	set weekday(inp) {
		weekdayAttr.set(this, inp)
	}
	get era() {
		return eraAttr.get(this, null)
	}
	set era(inp) {
		eraAttr.set(this, inp)
	}
	get year() {
		return yearAttr.get(this, null)
	}
	set year(inp) {
		yearAttr.set(this, inp)
	}
	get month() {
		return monthAttr.get(this, null)
	}
	set month(inp) {
		monthAttr.set(this, inp)
	}
	get day() {
		return dayAttr.get(this, null)
	}
	set day(inp) {
		dayAttr.set(this, inp)
	}
	get hour() {
		return hourAttr.get(this, null)
	}
	set hour(inp) {
		hourAttr.set(this, inp)
	}
	get minute() {
		return minuteAttr.get(this, null)
	}
	set minute(inp) {
		minuteAttr.set(this, inp)
	}
	get second() {
		return secondAttr.get(this, null)
	}
	set second(inp) {
		secondAttr.set(this, inp)
	}
	get timeZoneName() {
		return timeZoneNameAttr.get(this, null)
	}
	set timeZoneName(inp) {
		timeZoneNameAttr.set(this, inp)
	}
	get value() {
		return valueAttr.get(this, null)
	}
	set value(inp) {
		valueAttr.set(this, inp)
	}

	attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
		name = name.toLowerCase()
		if (observedAttributes.includes(name) && oldValue !== newValue) update(this)
	}

	connectedCallback() {
		update(this)
	}
}

export default UIDateElement
