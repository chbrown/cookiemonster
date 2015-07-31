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

function defaults(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key) && target[key] === undefined) {
      target[key] = source[key];
    }
  }
}

export class CookieMonster {
  private cookie_strings: string[];

  /**
  Generally, this should be called like `new CookieMonster(document)`,
  where `document` is a DOM Document instance.

  If a second argument is given, any CookieMonster#set(...) calls will have its
  options merged with the defaultOptions argument.
  */
  constructor(private document: {cookie: string} = {cookie: ''},
              private defaultOptions?: CookieOptions) {
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
    defaults(options, this.defaultOptions);
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
