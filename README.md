# Custom element for declarative formatting of dates.

See [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).

> `UIDateElement#innerHTML` is used as a fallback if the value cannot be formatted.

```ts
// client.js
import UIDateElement from '@st-lib/ui-date-element'

window.customElements.define('ui-date', UIDateElement)
```

CDN links:
* `https://unpkg.com/@st-lib/ui-date-element/dist/index.js`
	```html
	<script crossorigin src="https://unpkg.com/@st-lib/ui-date-element/dist/index.js"></script>
	```
* `https://unpkg.com/@st-lib/ui-date-element/dist/index.min.js`
	```html
	<script crossorigin src="https://unpkg.com/@st-lib/ui-date-element/dist/index.min.js"></script>
	```

```html
<!-- iso date format -->
<ui-date value="2020-06-25T14:51:46.428Z" dateStyle="full" timeStyle='medium'>
	Friday, June 26, 2020 at 12:51:46 AM
</ui-date>
<!-- utc date format -->
<ui-date value="Thu, 25 Jun 2020 14:51:46 GMT" dateStyle="full" timeStyle='medium'>
	Friday, June 26, 2020 at 12:51:46 AM
</ui-date>
<!-- Date#getTime() -->
<ui-date value="1593096706428" dateStyle="full" timeStyle='medium'>
	Friday, June 26, 2020 at 12:51:46 AM
</ui-date>
<!-- specify another language -->
<ui-date value="2020-06-25T14:51:46.428Z" dateStyle="full" timeStyle='medium' lang='ru'>
	пятница, 26 июня 2020 г., 00:51:46
</ui-date>
<!-- invalid value is ignored -->
<ui-date value="the_****_is_lie">
	cake
</ui-date>
```
