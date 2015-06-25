export interface CookieOptions {
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
}

export interface Cookie extends CookieOptions {
  name: string;
  value: string;
}

export class CookieMonster {
  private cookie_strings: string[];

  /**
  Generally, this should be called like `new CookieMonster(document.cookie)`,
  where `document` is a DOM Document instance.
  */
  constructor(private document: {cookie: string} = {cookie: ''}) {
    this.cookie_strings = document.cookie.split(/\s*;\s*/);
  }

  /**
  Get a single cookie by name.
  */
  get(name: string) {
    var prefix = name + '=';
    for (var i = 0, cookie_string: string; (cookie_string = this.cookie_strings[i]); i++) {
      if (cookie_string.slice(0, prefix.length) == prefix) {
        var cookie_value = cookie_string.slice(prefix.length);
        return decodeURIComponent(cookie_value);
      }
    }
  }

  /**
  Set a single cookie by name with the given value and options.

  Returns the added cookie string.
  */
  set(name: string, value: string, options: CookieOptions = {}) {
    var pairs: Array<[string, string] | [string]> = [[encodeURIComponent(name), encodeURIComponent(value)]];
    if (options.expires !== undefined) {
      if (options.expires instanceof Date) {
        pairs.push(['expires', options.expires.toUTCString()]);
      }
      else {
        // TypeScript should be able to infer that, if expires is either a Date
        // or a string, and it's not a Date, it's a string. But it doesn't yet.
        pairs.push(['expires', <string><any>options.expires]);
      }
    }
    if (options.path !== undefined) {
      pairs.push(['path', options.path]);
    }
    if (options.domain !== undefined) {
      pairs.push(['domain', options.domain]);
    }
    if (options.secure !== undefined) {
      pairs.push(['secure']);
    }
    var cookie_string = pairs.map(pair => pair.join('=')).join('; ');
    this.document.cookie = cookie_string;
    return cookie_string;
  }

  /**
  Since delete is a keyword in Javascript, we'll leave it alone and use `del` instead.

  This deletes cookies by immediately expiring them, i.e., by setting the
  `expires` value to the UNIX epoch, i.e., 'Thu, 01 Jan 1970 00:00:00 GMT'.

  Returns the result of calling this.set(...), which is a string.
  */
  del(name: string, options: CookieOptions = {}) {
    //
    options.expires = new Date(0);
    return this.set(name, '', options);
  }
}
