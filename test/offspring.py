#!/usr/bin/python2.7
import json,httplib
connection = httplib.HTTPSConnection('api.parse.com', 443)
connection.connect()
connection.request('POST', '/1/functions/offspring', json.dumps({
       "nodeId": "knyT2U8Atn"
     }), {
       "X-Parse-Application-Id": "uHud4AZfcs17eXowYDY2eOmQiH8a9EPJv4NDwhMo",
       "X-Parse-REST-API-Key": "w4EGf0JWDF8qZFxgsGc8hgAYYlestB5DcNEY244h",
       "Content-Type": "application/json"
     })
result = json.loads(connection.getresponse().read())
print json.dumps(result, indent=2)


