#!/usr/bin/env python

'''A simple script for aggressively compressing javascript.

Supports the following compression:
 - Google Closure Compiler (through web API)
'''

def closure_compress(js):
    import httplib, urllib
    params = urllib.urlencode([
        ('js_code', js),
        ('compilation_level', 'ADVANCED_OPTIMIZATIONS'),
        ('output_format', 'text'),
        ('output_info', 'compiled_code'),
      ])
    headers = { "Content-type": "application/x-www-form-urlencoded" }

    conn = httplib.HTTPConnection('closure-compiler.appspot.com')
    conn.request('POST', '/compile', params, headers)
    response = conn.getresponse()
    data = response.read()
    conn.close

    return data

def main(argv):
    # TODO proper parameter handling (optparse or something)
    filename = argv[1]
    js = ''

    with open(filename) as f:
        js = f.read()

    print closure_compress(js)

if __name__ == '__main__':
    import sys
    main(sys.argv)
