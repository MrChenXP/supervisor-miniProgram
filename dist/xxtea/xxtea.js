const base64Chars = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
  'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
  'w', 'x', 'y', 'z', '0', '1', '2', '3',
  '4', '5', '6', '7', '8', '9', '+', '/'
]

const END_OF_INPUT = -1

let reverseBase64Chars = []

for (var i = 0; i < base64Chars.length; i++) {
  reverseBase64Chars[base64Chars[i]] = i
}

let encodeBase64 = (str) => {
  let result = ''
  let inBuffer = new Array(3)
  let lineCount = 0
  let done = false

  let base64Str = str
  let base64Count = 0

  let readBase64 = () => {
    if (!base64Str) return END_OF_INPUT
    if (base64Count >= base64Str.length) return END_OF_INPUT
    var c = base64Str.charCodeAt(base64Count) & 0xff
    base64Count++
    return c
  }

  while (!done && (inBuffer[0] = readBase64()) !== END_OF_INPUT) {
    inBuffer[1] = readBase64()
    inBuffer[2] = readBase64()
    result += (base64Chars[inBuffer[0] >> 2])
    if (inBuffer[1] !== END_OF_INPUT) {
      result += (base64Chars[((inBuffer[0] << 4) & 0x30) | (inBuffer[1] >> 4)])
      if (inBuffer[2] !== END_OF_INPUT) {
        result += (base64Chars[((inBuffer[1] << 2) & 0x3c) | (inBuffer[2] >> 6)])
        result += (base64Chars[inBuffer[2] & 0x3F])
      } else {
        result += (base64Chars[((inBuffer[1] << 2) & 0x3c)])
        result += ('=')
        done = true
      }
    } else {
      result += (base64Chars[((inBuffer[0] << 4) & 0x30)])
      result += ('=')
      result += ('=')
      done = true
    }
    lineCount += 4
    if (lineCount >= 76) {
      result += ('\r\n')
      lineCount = 0
    }
  }
  return result
}

let xxteaEncrypt = (str, key) => {
  if (str === '') {
    return ''
  }
  var v = str2long(str, true)
  var k = str2long(key, false)
  if (k.length < 4) {
    k.length = 4
  }
  let n = v.length - 1
  let z = v[n]
  let y = v[0]
  let delta = 0x9E3779B9
  let mx
  let e
  let p
  let q = Math.floor(6 + 52 / (n + 1))
  let sum = 0
  while (q-- > 0) {
    sum = sum + delta & 0xffffffff
    e = sum >>> 2 & 3
    for (p = 0; p < n; p++) {
      y = v[p + 1]
      mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z)
      z = v[p] = v[p] + mx & 0xffffffff
    }
    y = v[0]
    mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z)
    z = v[n] = v[n] + mx & 0xffffffff
  }

  return long2str(v, false)
}

let str2long = (s, w) => {
  var len = s.length
  var v = []
  for (var i = 0; i < len; i += 4) {
    v[i >> 2] = s.charCodeAt(i) | s.charCodeAt(i + 1) << 8 | s.charCodeAt(i + 2) << 16 | s.charCodeAt(i + 3) << 24
  }
  if (w) {
    v[v.length] = len
  }
  return v
}

let long2str = (v, w) => {
  let vl = v.length
  let n = (vl - 1) << 2
  if (w) {
    var m = v[vl - 1]
    if ((m < n - 3) || (m > n)) return null
    n = m
  }
  for (var i = 0; i < vl; i++) {
    v[i] = String.fromCharCode(v[i] & 0xff,
      v[i] >>> 8 & 0xff,
      v[i] >>> 16 & 0xff,
      v[i] >>> 24 & 0xff)
  }
  if (w) {
    return v.join('').substring(0, n)
  } else {
    return v.join('')
  }
}

let decodeBase64 = (str) => {
    // setBase64Str(str);
    let result = "";
    let inBuffer = new Array(4);
    let done = false;
		
		let base64Str = str
		let base64Count = 0
		
		let readReverseBase64 = () => {   
		    if (!base64Str) return END_OF_INPUT;
		    while (true){      
		        if (base64Count >= base64Str.length) return END_OF_INPUT;
		        var nextCharacter = base64Str.charAt(base64Count);
		        base64Count++;
		        if (reverseBase64Chars[nextCharacter]){
		            return reverseBase64Chars[nextCharacter];
		        }
		        if (nextCharacter == 'A') return 0;
		    }
		    return END_OF_INPUT;
		}
		
		let ntos = (n) => {
				n=n.toString(16);
				if (n.length == 1) n="0"+n;
				n="%"+n;
				return unescape(n);
		}
		
    while (!done && (inBuffer[0] = readReverseBase64()) != END_OF_INPUT
        && (inBuffer[1] = readReverseBase64()) != END_OF_INPUT){
        inBuffer[2] = readReverseBase64();
        inBuffer[3] = readReverseBase64();
        result += ntos((((inBuffer[0] << 2) & 0xff)| inBuffer[1] >> 4));
        if (inBuffer[2] != END_OF_INPUT){
            result +=  ntos((((inBuffer[1] << 4) & 0xff)| inBuffer[2] >> 2));
            if (inBuffer[3] != END_OF_INPUT){
                result +=  ntos((((inBuffer[2] << 6)  & 0xff) | inBuffer[3]));
            } else {
                done = true;
            }
        } else {
            done = true;
        }
    }
    return result;
}

let xxtea_decrypt = (str, key) => {
    if (str == "") {
        return "";
    }
    let v = str2long(str, false);
    let k = str2long(key, false);
    if (k.length < 4) {
        k.length = 4;
    }
    let n = v.length - 1;
 
    let z = v[n - 1], y = v[0], delta = 0x9E3779B9;
    let mx, e, p, q = Math.floor(6 + 52 / (n + 1)), sum = q * delta & 0xffffffff;
    while (sum != 0) {
        e = sum >>> 2 & 3;
        for (p = n; p > 0; p--) {
            z = v[p - 1];
            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
            y = v[p] = v[p] - mx & 0xffffffff;
        }
        z = v[n];
        mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
        y = v[0] = v[0] - mx & 0xffffffff;
        sum = sum - delta & 0xffffffff;
    }
	return long2str(v, true);
}

let xxteaEncrypt64 = (str, key) => {
  return encodeBase64(xxteaEncrypt(str, key))
}

// let xxteaDecrypt64 = (str, key) => {
//   return decodeBase64(xxtea_decrypt(str, key));
// }

export {xxteaEncrypt64}

