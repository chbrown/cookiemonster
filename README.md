# cookiemonster

Client-side cookie handling.

Use like:

    import {CookieMonster} from 'cookiemonster';
    var cookies = new CookieMonster(document);
    var one_month_from_now = new Date(new Date().getTime() + 31*24*60*60*1000);
    cookies.set('screen_name', 'chbrown', {path: '/', expires: one_month_from_now});
    cookies.get('screen_name');


## API

* `CookieMonster#get(name: string): string`

   Get the string value of the cookie named `name`.
* `CookieMonster#set(name: string, value: string, options: CookieOptions): string`

   Set the string value of the cookie named `name` with the given options.
* `CookieMonster#del(name: string, options: CookieOptions): string`:

   Expire the cookie named `name`; set its value to the empty string and `expires` to the UNIX epoch.


## License

Copyright 2012-2015 Christopher Brown. [MIT Licensed](http://chbrown.github.io/licenses/MIT/#2012-2015).
