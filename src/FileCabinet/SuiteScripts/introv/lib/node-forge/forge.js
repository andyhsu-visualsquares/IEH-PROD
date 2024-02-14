!(function (e, t) {
    'object' == typeof exports && 'object' == typeof module
        ? (module.exports = t())
        : 'function' == typeof define && define.amd
        ? define([], t)
        : 'object' == typeof exports
        ? (exports.forge = t())
        : (e.forge = t())
})(window, function () {
    return (function (e) {
        var t = {}
        function r(n) {
            if (t[n]) return t[n].exports
            var a = (t[n] = { i: n, l: !1, exports: {} })
            return e[n].call(a.exports, a, a.exports, r), (a.l = !0), a.exports
        }
        return (
            (r.m = e),
            (r.c = t),
            (r.d = function (e, t, n) {
                r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n })
            }),
            (r.r = function (e) {
                'undefined' != typeof Symbol &&
                    Symbol.toStringTag &&
                    Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
                    Object.defineProperty(e, '__esModule', { value: !0 })
            }),
            (r.t = function (e, t) {
                if ((1 & t && (e = r(e)), 8 & t)) return e
                if (4 & t && 'object' == typeof e && e && e.__esModule) return e
                var n = Object.create(null)
                if (
                    (r.r(n),
                    Object.defineProperty(n, 'default', { enumerable: !0, value: e }),
                    2 & t && 'string' != typeof e)
                )
                    for (var a in e)
                        r.d(
                            n,
                            a,
                            function (t) {
                                return e[t]
                            }.bind(null, a)
                        )
                return n
            }),
            (r.n = function (e) {
                var t =
                    e && e.__esModule
                        ? function () {
                              return e.default
                          }
                        : function () {
                              return e
                          }
                return r.d(t, 'a', t), t
            }),
            (r.o = function (e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            }),
            (r.p = ''),
            r((r.s = 34))
        )
    })([
        function (e, t) {
            e.exports = { options: { usePureJavaScript: !1 } }
        },
        function (e, t, r) {
            ;(function (t) {
                var n = r(0),
                    a = r(38),
                    i = (e.exports = n.util = n.util || {})
                function s(e) {
                    if (8 !== e && 16 !== e && 24 !== e && 32 !== e)
                        throw new Error('Only 8, 16, 24, or 32 bits supported: ' + e)
                }
                function o(e) {
                    if (((this.data = ''), (this.read = 0), 'string' == typeof e)) this.data = e
                    else if (i.isArrayBuffer(e) || i.isArrayBufferView(e))
                        if ('undefined' != typeof Buffer && e instanceof Buffer) this.data = e.toString('binary')
                        else {
                            var t = new Uint8Array(e)
                            try {
                                this.data = String.fromCharCode.apply(null, t)
                            } catch (e) {
                                for (var r = 0; r < t.length; ++r) this.putByte(t[r])
                            }
                        }
                    else
                        (e instanceof o ||
                            ('object' == typeof e && 'string' == typeof e.data && 'number' == typeof e.read)) &&
                            ((this.data = e.data), (this.read = e.read))
                    this._constructedStringLength = 0
                }
                !(function () {
                    if ('undefined' != typeof process && process.nextTick && !process.browser)
                        return (
                            (i.nextTick = process.nextTick),
                            void ('function' == typeof setImmediate
                                ? (i.setImmediate = setImmediate)
                                : (i.setImmediate = i.nextTick))
                        )
                    if ('function' == typeof setImmediate)
                        return (
                            (i.setImmediate = function () {
                                return setImmediate.apply(void 0, arguments)
                            }),
                            void (i.nextTick = function (e) {
                                return setImmediate(e)
                            })
                        )
                    if (
                        ((i.setImmediate = function (e) {
                            setTimeout(e, 0)
                        }),
                        'undefined' != typeof window && 'function' == typeof window.postMessage)
                    ) {
                        var e = 'forge.setImmediate',
                            t = []
                        ;(i.setImmediate = function (r) {
                            t.push(r), 1 === t.length && window.postMessage(e, '*')
                        }),
                            window.addEventListener(
                                'message',
                                function (r) {
                                    if (r.source === window && r.data === e) {
                                        r.stopPropagation()
                                        var n = t.slice()
                                        ;(t.length = 0),
                                            n.forEach(function (e) {
                                                e()
                                            })
                                    }
                                },
                                !0
                            )
                    }
                    if ('undefined' != typeof MutationObserver) {
                        var r = Date.now(),
                            n = !0,
                            a = document.createElement('div')
                        t = []
                        new MutationObserver(function () {
                            var e = t.slice()
                            ;(t.length = 0),
                                e.forEach(function (e) {
                                    e()
                                })
                        }).observe(a, { attributes: !0 })
                        var s = i.setImmediate
                        i.setImmediate = function (e) {
                            Date.now() - r > 15
                                ? ((r = Date.now()), s(e))
                                : (t.push(e), 1 === t.length && a.setAttribute('a', (n = !n)))
                        }
                    }
                    i.nextTick = i.setImmediate
                })(),
                    (i.isNodejs = 'undefined' != typeof process && process.versions && process.versions.node),
                    (i.globalScope = i.isNodejs ? t : 'undefined' == typeof self ? window : self),
                    (i.isArray =
                        Array.isArray ||
                        function (e) {
                            return '[object Array]' === Object.prototype.toString.call(e)
                        }),
                    (i.isArrayBuffer = function (e) {
                        return 'undefined' != typeof ArrayBuffer && e instanceof ArrayBuffer
                    }),
                    (i.isArrayBufferView = function (e) {
                        return e && i.isArrayBuffer(e.buffer) && void 0 !== e.byteLength
                    }),
                    (i.ByteBuffer = o),
                    (i.ByteStringBuffer = o)
                ;(i.ByteStringBuffer.prototype._optimizeConstructedString = function (e) {
                    ;(this._constructedStringLength += e),
                        this._constructedStringLength > 4096 &&
                            (this.data.substr(0, 1), (this._constructedStringLength = 0))
                }),
                    (i.ByteStringBuffer.prototype.length = function () {
                        return this.data.length - this.read
                    }),
                    (i.ByteStringBuffer.prototype.isEmpty = function () {
                        return this.length() <= 0
                    }),
                    (i.ByteStringBuffer.prototype.putByte = function (e) {
                        return this.putBytes(String.fromCharCode(e))
                    }),
                    (i.ByteStringBuffer.prototype.fillWithByte = function (e, t) {
                        e = String.fromCharCode(e)
                        for (var r = this.data; t > 0; ) 1 & t && (r += e), (t >>>= 1) > 0 && (e += e)
                        return (this.data = r), this._optimizeConstructedString(t), this
                    }),
                    (i.ByteStringBuffer.prototype.putBytes = function (e) {
                        return (this.data += e), this._optimizeConstructedString(e.length), this
                    }),
                    (i.ByteStringBuffer.prototype.putString = function (e) {
                        return this.putBytes(i.encodeUtf8(e))
                    }),
                    (i.ByteStringBuffer.prototype.putInt16 = function (e) {
                        return this.putBytes(String.fromCharCode((e >> 8) & 255) + String.fromCharCode(255 & e))
                    }),
                    (i.ByteStringBuffer.prototype.putInt24 = function (e) {
                        return this.putBytes(
                            String.fromCharCode((e >> 16) & 255) +
                                String.fromCharCode((e >> 8) & 255) +
                                String.fromCharCode(255 & e)
                        )
                    }),
                    (i.ByteStringBuffer.prototype.putInt32 = function (e) {
                        return this.putBytes(
                            String.fromCharCode((e >> 24) & 255) +
                                String.fromCharCode((e >> 16) & 255) +
                                String.fromCharCode((e >> 8) & 255) +
                                String.fromCharCode(255 & e)
                        )
                    }),
                    (i.ByteStringBuffer.prototype.putInt16Le = function (e) {
                        return this.putBytes(String.fromCharCode(255 & e) + String.fromCharCode((e >> 8) & 255))
                    }),
                    (i.ByteStringBuffer.prototype.putInt24Le = function (e) {
                        return this.putBytes(
                            String.fromCharCode(255 & e) +
                                String.fromCharCode((e >> 8) & 255) +
                                String.fromCharCode((e >> 16) & 255)
                        )
                    }),
                    (i.ByteStringBuffer.prototype.putInt32Le = function (e) {
                        return this.putBytes(
                            String.fromCharCode(255 & e) +
                                String.fromCharCode((e >> 8) & 255) +
                                String.fromCharCode((e >> 16) & 255) +
                                String.fromCharCode((e >> 24) & 255)
                        )
                    }),
                    (i.ByteStringBuffer.prototype.putInt = function (e, t) {
                        s(t)
                        var r = ''
                        do {
                            ;(t -= 8), (r += String.fromCharCode((e >> t) & 255))
                        } while (t > 0)
                        return this.putBytes(r)
                    }),
                    (i.ByteStringBuffer.prototype.putSignedInt = function (e, t) {
                        return e < 0 && (e += 2 << (t - 1)), this.putInt(e, t)
                    }),
                    (i.ByteStringBuffer.prototype.putBuffer = function (e) {
                        return this.putBytes(e.getBytes())
                    }),
                    (i.ByteStringBuffer.prototype.getByte = function () {
                        return this.data.charCodeAt(this.read++)
                    }),
                    (i.ByteStringBuffer.prototype.getInt16 = function () {
                        var e = (this.data.charCodeAt(this.read) << 8) ^ this.data.charCodeAt(this.read + 1)
                        return (this.read += 2), e
                    }),
                    (i.ByteStringBuffer.prototype.getInt24 = function () {
                        var e =
                            (this.data.charCodeAt(this.read) << 16) ^
                            (this.data.charCodeAt(this.read + 1) << 8) ^
                            this.data.charCodeAt(this.read + 2)
                        return (this.read += 3), e
                    }),
                    (i.ByteStringBuffer.prototype.getInt32 = function () {
                        var e =
                            (this.data.charCodeAt(this.read) << 24) ^
                            (this.data.charCodeAt(this.read + 1) << 16) ^
                            (this.data.charCodeAt(this.read + 2) << 8) ^
                            this.data.charCodeAt(this.read + 3)
                        return (this.read += 4), e
                    }),
                    (i.ByteStringBuffer.prototype.getInt16Le = function () {
                        var e = this.data.charCodeAt(this.read) ^ (this.data.charCodeAt(this.read + 1) << 8)
                        return (this.read += 2), e
                    }),
                    (i.ByteStringBuffer.prototype.getInt24Le = function () {
                        var e =
                            this.data.charCodeAt(this.read) ^
                            (this.data.charCodeAt(this.read + 1) << 8) ^
                            (this.data.charCodeAt(this.read + 2) << 16)
                        return (this.read += 3), e
                    }),
                    (i.ByteStringBuffer.prototype.getInt32Le = function () {
                        var e =
                            this.data.charCodeAt(this.read) ^
                            (this.data.charCodeAt(this.read + 1) << 8) ^
                            (this.data.charCodeAt(this.read + 2) << 16) ^
                            (this.data.charCodeAt(this.read + 3) << 24)
                        return (this.read += 4), e
                    }),
                    (i.ByteStringBuffer.prototype.getInt = function (e) {
                        s(e)
                        var t = 0
                        do {
                            ;(t = (t << 8) + this.data.charCodeAt(this.read++)), (e -= 8)
                        } while (e > 0)
                        return t
                    }),
                    (i.ByteStringBuffer.prototype.getSignedInt = function (e) {
                        var t = this.getInt(e),
                            r = 2 << (e - 2)
                        return t >= r && (t -= r << 1), t
                    }),
                    (i.ByteStringBuffer.prototype.getBytes = function (e) {
                        var t
                        return (
                            e
                                ? ((e = Math.min(this.length(), e)),
                                  (t = this.data.slice(this.read, this.read + e)),
                                  (this.read += e))
                                : 0 === e
                                ? (t = '')
                                : ((t = 0 === this.read ? this.data : this.data.slice(this.read)), this.clear()),
                            t
                        )
                    }),
                    (i.ByteStringBuffer.prototype.bytes = function (e) {
                        return void 0 === e ? this.data.slice(this.read) : this.data.slice(this.read, this.read + e)
                    }),
                    (i.ByteStringBuffer.prototype.at = function (e) {
                        return this.data.charCodeAt(this.read + e)
                    }),
                    (i.ByteStringBuffer.prototype.setAt = function (e, t) {
                        return (
                            (this.data =
                                this.data.substr(0, this.read + e) +
                                String.fromCharCode(t) +
                                this.data.substr(this.read + e + 1)),
                            this
                        )
                    }),
                    (i.ByteStringBuffer.prototype.last = function () {
                        return this.data.charCodeAt(this.data.length - 1)
                    }),
                    (i.ByteStringBuffer.prototype.copy = function () {
                        var e = i.createBuffer(this.data)
                        return (e.read = this.read), e
                    }),
                    (i.ByteStringBuffer.prototype.compact = function () {
                        return this.read > 0 && ((this.data = this.data.slice(this.read)), (this.read = 0)), this
                    }),
                    (i.ByteStringBuffer.prototype.clear = function () {
                        return (this.data = ''), (this.read = 0), this
                    }),
                    (i.ByteStringBuffer.prototype.truncate = function (e) {
                        var t = Math.max(0, this.length() - e)
                        return (this.data = this.data.substr(this.read, t)), (this.read = 0), this
                    }),
                    (i.ByteStringBuffer.prototype.toHex = function () {
                        for (var e = '', t = this.read; t < this.data.length; ++t) {
                            var r = this.data.charCodeAt(t)
                            r < 16 && (e += '0'), (e += r.toString(16))
                        }
                        return e
                    }),
                    (i.ByteStringBuffer.prototype.toString = function () {
                        return i.decodeUtf8(this.bytes())
                    }),
                    (i.DataBuffer = function (e, t) {
                        ;(t = t || {}), (this.read = t.readOffset || 0), (this.growSize = t.growSize || 1024)
                        var r = i.isArrayBuffer(e),
                            n = i.isArrayBufferView(e)
                        if (r || n)
                            return (
                                (this.data = r ? new DataView(e) : new DataView(e.buffer, e.byteOffset, e.byteLength)),
                                void (this.write = 'writeOffset' in t ? t.writeOffset : this.data.byteLength)
                            )
                        ;(this.data = new DataView(new ArrayBuffer(0))),
                            (this.write = 0),
                            null != e && this.putBytes(e),
                            'writeOffset' in t && (this.write = t.writeOffset)
                    }),
                    (i.DataBuffer.prototype.length = function () {
                        return this.write - this.read
                    }),
                    (i.DataBuffer.prototype.isEmpty = function () {
                        return this.length() <= 0
                    }),
                    (i.DataBuffer.prototype.accommodate = function (e, t) {
                        if (this.length() >= e) return this
                        t = Math.max(t || this.growSize, e)
                        var r = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength),
                            n = new Uint8Array(this.length() + t)
                        return n.set(r), (this.data = new DataView(n.buffer)), this
                    }),
                    (i.DataBuffer.prototype.putByte = function (e) {
                        return this.accommodate(1), this.data.setUint8(this.write++, e), this
                    }),
                    (i.DataBuffer.prototype.fillWithByte = function (e, t) {
                        this.accommodate(t)
                        for (var r = 0; r < t; ++r) this.data.setUint8(e)
                        return this
                    }),
                    (i.DataBuffer.prototype.putBytes = function (e, t) {
                        if (i.isArrayBufferView(e)) {
                            var r = (n = new Uint8Array(e.buffer, e.byteOffset, e.byteLength)).byteLength - n.byteOffset
                            return (
                                this.accommodate(r),
                                new Uint8Array(this.data.buffer, this.write).set(n),
                                (this.write += r),
                                this
                            )
                        }
                        if (i.isArrayBuffer(e)) {
                            var n = new Uint8Array(e)
                            return (
                                this.accommodate(n.byteLength),
                                new Uint8Array(this.data.buffer).set(n, this.write),
                                (this.write += n.byteLength),
                                this
                            )
                        }
                        if (
                            e instanceof i.DataBuffer ||
                            ('object' == typeof e &&
                                'number' == typeof e.read &&
                                'number' == typeof e.write &&
                                i.isArrayBufferView(e.data))
                        ) {
                            n = new Uint8Array(e.data.byteLength, e.read, e.length())
                            return (
                                this.accommodate(n.byteLength),
                                new Uint8Array(e.data.byteLength, this.write).set(n),
                                (this.write += n.byteLength),
                                this
                            )
                        }
                        if (
                            (e instanceof i.ByteStringBuffer && ((e = e.data), (t = 'binary')),
                            (t = t || 'binary'),
                            'string' == typeof e)
                        ) {
                            var a
                            if ('hex' === t)
                                return (
                                    this.accommodate(Math.ceil(e.length / 2)),
                                    (a = new Uint8Array(this.data.buffer, this.write)),
                                    (this.write += i.binary.hex.decode(e, a, this.write)),
                                    this
                                )
                            if ('base64' === t)
                                return (
                                    this.accommodate(3 * Math.ceil(e.length / 4)),
                                    (a = new Uint8Array(this.data.buffer, this.write)),
                                    (this.write += i.binary.base64.decode(e, a, this.write)),
                                    this
                                )
                            if (
                                ('utf8' === t && ((e = i.encodeUtf8(e)), (t = 'binary')), 'binary' === t || 'raw' === t)
                            )
                                return (
                                    this.accommodate(e.length),
                                    (a = new Uint8Array(this.data.buffer, this.write)),
                                    (this.write += i.binary.raw.decode(a)),
                                    this
                                )
                            if ('utf16' === t)
                                return (
                                    this.accommodate(2 * e.length),
                                    (a = new Uint16Array(this.data.buffer, this.write)),
                                    (this.write += i.text.utf16.encode(a)),
                                    this
                                )
                            throw new Error('Invalid encoding: ' + t)
                        }
                        throw Error('Invalid parameter: ' + e)
                    }),
                    (i.DataBuffer.prototype.putBuffer = function (e) {
                        return this.putBytes(e), e.clear(), this
                    }),
                    (i.DataBuffer.prototype.putString = function (e) {
                        return this.putBytes(e, 'utf16')
                    }),
                    (i.DataBuffer.prototype.putInt16 = function (e) {
                        return this.accommodate(2), this.data.setInt16(this.write, e), (this.write += 2), this
                    }),
                    (i.DataBuffer.prototype.putInt24 = function (e) {
                        return (
                            this.accommodate(3),
                            this.data.setInt16(this.write, (e >> 8) & 65535),
                            this.data.setInt8(this.write, (e >> 16) & 255),
                            (this.write += 3),
                            this
                        )
                    }),
                    (i.DataBuffer.prototype.putInt32 = function (e) {
                        return this.accommodate(4), this.data.setInt32(this.write, e), (this.write += 4), this
                    }),
                    (i.DataBuffer.prototype.putInt16Le = function (e) {
                        return this.accommodate(2), this.data.setInt16(this.write, e, !0), (this.write += 2), this
                    }),
                    (i.DataBuffer.prototype.putInt24Le = function (e) {
                        return (
                            this.accommodate(3),
                            this.data.setInt8(this.write, (e >> 16) & 255),
                            this.data.setInt16(this.write, (e >> 8) & 65535, !0),
                            (this.write += 3),
                            this
                        )
                    }),
                    (i.DataBuffer.prototype.putInt32Le = function (e) {
                        return this.accommodate(4), this.data.setInt32(this.write, e, !0), (this.write += 4), this
                    }),
                    (i.DataBuffer.prototype.putInt = function (e, t) {
                        s(t), this.accommodate(t / 8)
                        do {
                            ;(t -= 8), this.data.setInt8(this.write++, (e >> t) & 255)
                        } while (t > 0)
                        return this
                    }),
                    (i.DataBuffer.prototype.putSignedInt = function (e, t) {
                        return s(t), this.accommodate(t / 8), e < 0 && (e += 2 << (t - 1)), this.putInt(e, t)
                    }),
                    (i.DataBuffer.prototype.getByte = function () {
                        return this.data.getInt8(this.read++)
                    }),
                    (i.DataBuffer.prototype.getInt16 = function () {
                        var e = this.data.getInt16(this.read)
                        return (this.read += 2), e
                    }),
                    (i.DataBuffer.prototype.getInt24 = function () {
                        var e = (this.data.getInt16(this.read) << 8) ^ this.data.getInt8(this.read + 2)
                        return (this.read += 3), e
                    }),
                    (i.DataBuffer.prototype.getInt32 = function () {
                        var e = this.data.getInt32(this.read)
                        return (this.read += 4), e
                    }),
                    (i.DataBuffer.prototype.getInt16Le = function () {
                        var e = this.data.getInt16(this.read, !0)
                        return (this.read += 2), e
                    }),
                    (i.DataBuffer.prototype.getInt24Le = function () {
                        var e = this.data.getInt8(this.read) ^ (this.data.getInt16(this.read + 1, !0) << 8)
                        return (this.read += 3), e
                    }),
                    (i.DataBuffer.prototype.getInt32Le = function () {
                        var e = this.data.getInt32(this.read, !0)
                        return (this.read += 4), e
                    }),
                    (i.DataBuffer.prototype.getInt = function (e) {
                        s(e)
                        var t = 0
                        do {
                            ;(t = (t << 8) + this.data.getInt8(this.read++)), (e -= 8)
                        } while (e > 0)
                        return t
                    }),
                    (i.DataBuffer.prototype.getSignedInt = function (e) {
                        var t = this.getInt(e),
                            r = 2 << (e - 2)
                        return t >= r && (t -= r << 1), t
                    }),
                    (i.DataBuffer.prototype.getBytes = function (e) {
                        var t
                        return (
                            e
                                ? ((e = Math.min(this.length(), e)),
                                  (t = this.data.slice(this.read, this.read + e)),
                                  (this.read += e))
                                : 0 === e
                                ? (t = '')
                                : ((t = 0 === this.read ? this.data : this.data.slice(this.read)), this.clear()),
                            t
                        )
                    }),
                    (i.DataBuffer.prototype.bytes = function (e) {
                        return void 0 === e ? this.data.slice(this.read) : this.data.slice(this.read, this.read + e)
                    }),
                    (i.DataBuffer.prototype.at = function (e) {
                        return this.data.getUint8(this.read + e)
                    }),
                    (i.DataBuffer.prototype.setAt = function (e, t) {
                        return this.data.setUint8(e, t), this
                    }),
                    (i.DataBuffer.prototype.last = function () {
                        return this.data.getUint8(this.write - 1)
                    }),
                    (i.DataBuffer.prototype.copy = function () {
                        return new i.DataBuffer(this)
                    }),
                    (i.DataBuffer.prototype.compact = function () {
                        if (this.read > 0) {
                            var e = new Uint8Array(this.data.buffer, this.read),
                                t = new Uint8Array(e.byteLength)
                            t.set(e), (this.data = new DataView(t)), (this.write -= this.read), (this.read = 0)
                        }
                        return this
                    }),
                    (i.DataBuffer.prototype.clear = function () {
                        return (this.data = new DataView(new ArrayBuffer(0))), (this.read = this.write = 0), this
                    }),
                    (i.DataBuffer.prototype.truncate = function (e) {
                        return (
                            (this.write = Math.max(0, this.length() - e)),
                            (this.read = Math.min(this.read, this.write)),
                            this
                        )
                    }),
                    (i.DataBuffer.prototype.toHex = function () {
                        for (var e = '', t = this.read; t < this.data.byteLength; ++t) {
                            var r = this.data.getUint8(t)
                            r < 16 && (e += '0'), (e += r.toString(16))
                        }
                        return e
                    }),
                    (i.DataBuffer.prototype.toString = function (e) {
                        var t = new Uint8Array(this.data, this.read, this.length())
                        if ('binary' === (e = e || 'utf8') || 'raw' === e) return i.binary.raw.encode(t)
                        if ('hex' === e) return i.binary.hex.encode(t)
                        if ('base64' === e) return i.binary.base64.encode(t)
                        if ('utf8' === e) return i.text.utf8.decode(t)
                        if ('utf16' === e) return i.text.utf16.decode(t)
                        throw new Error('Invalid encoding: ' + e)
                    }),
                    (i.createBuffer = function (e, t) {
                        return (
                            (t = t || 'raw'), void 0 !== e && 'utf8' === t && (e = i.encodeUtf8(e)), new i.ByteBuffer(e)
                        )
                    }),
                    (i.fillString = function (e, t) {
                        for (var r = ''; t > 0; ) 1 & t && (r += e), (t >>>= 1) > 0 && (e += e)
                        return r
                    }),
                    (i.xorBytes = function (e, t, r) {
                        for (var n = '', a = '', i = '', s = 0, o = 0; r > 0; --r, ++s)
                            (a = e.charCodeAt(s) ^ t.charCodeAt(s)),
                                o >= 10 && ((n += i), (i = ''), (o = 0)),
                                (i += String.fromCharCode(a)),
                                ++o
                        return (n += i)
                    }),
                    (i.hexToBytes = function (e) {
                        var t = '',
                            r = 0
                        for (
                            !0 & e.length && ((r = 1), (t += String.fromCharCode(parseInt(e[0], 16))));
                            r < e.length;
                            r += 2
                        )
                            t += String.fromCharCode(parseInt(e.substr(r, 2), 16))
                        return t
                    }),
                    (i.bytesToHex = function (e) {
                        return i.createBuffer(e).toHex()
                    }),
                    (i.int32ToBytes = function (e) {
                        return (
                            String.fromCharCode((e >> 24) & 255) +
                            String.fromCharCode((e >> 16) & 255) +
                            String.fromCharCode((e >> 8) & 255) +
                            String.fromCharCode(255 & e)
                        )
                    })
                var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
                    u = [
                        62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2,
                        3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1,
                        -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
                        47, 48, 49, 50, 51,
                    ],
                    l = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
                ;(i.encode64 = function (e, t) {
                    for (var r, n, a, i = '', s = '', o = 0; o < e.length; )
                        (r = e.charCodeAt(o++)),
                            (n = e.charCodeAt(o++)),
                            (a = e.charCodeAt(o++)),
                            (i += c.charAt(r >> 2)),
                            (i += c.charAt(((3 & r) << 4) | (n >> 4))),
                            isNaN(n)
                                ? (i += '==')
                                : ((i += c.charAt(((15 & n) << 2) | (a >> 6))),
                                  (i += isNaN(a) ? '=' : c.charAt(63 & a))),
                            t && i.length > t && ((s += i.substr(0, t) + '\r\n'), (i = i.substr(t)))
                    return (s += i)
                }),
                    (i.decode64 = function (e) {
                        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, '')
                        for (var t, r, n, a, i = '', s = 0; s < e.length; )
                            (t = u[e.charCodeAt(s++) - 43]),
                                (r = u[e.charCodeAt(s++) - 43]),
                                (n = u[e.charCodeAt(s++) - 43]),
                                (a = u[e.charCodeAt(s++) - 43]),
                                (i += String.fromCharCode((t << 2) | (r >> 4))),
                                64 !== n &&
                                    ((i += String.fromCharCode(((15 & r) << 4) | (n >> 2))),
                                    64 !== a && (i += String.fromCharCode(((3 & n) << 6) | a)))
                        return i
                    }),
                    (i.encodeUtf8 = function (e) {
                        return unescape(encodeURIComponent(e))
                    }),
                    (i.decodeUtf8 = function (e) {
                        return decodeURIComponent(escape(e))
                    }),
                    (i.binary = {
                        raw: {},
                        hex: {},
                        base64: {},
                        base58: {},
                        baseN: { encode: a.encode, decode: a.decode },
                    }),
                    (i.binary.raw.encode = function (e) {
                        return String.fromCharCode.apply(null, e)
                    }),
                    (i.binary.raw.decode = function (e, t, r) {
                        var n = t
                        n || (n = new Uint8Array(e.length))
                        for (var a = (r = r || 0), i = 0; i < e.length; ++i) n[a++] = e.charCodeAt(i)
                        return t ? a - r : n
                    }),
                    (i.binary.hex.encode = i.bytesToHex),
                    (i.binary.hex.decode = function (e, t, r) {
                        var n = t
                        n || (n = new Uint8Array(Math.ceil(e.length / 2)))
                        var a = 0,
                            i = (r = r || 0)
                        for (1 & e.length && ((a = 1), (n[i++] = parseInt(e[0], 16))); a < e.length; a += 2)
                            n[i++] = parseInt(e.substr(a, 2), 16)
                        return t ? i - r : n
                    }),
                    (i.binary.base64.encode = function (e, t) {
                        for (var r, n, a, i = '', s = '', o = 0; o < e.byteLength; )
                            (r = e[o++]),
                                (n = e[o++]),
                                (a = e[o++]),
                                (i += c.charAt(r >> 2)),
                                (i += c.charAt(((3 & r) << 4) | (n >> 4))),
                                isNaN(n)
                                    ? (i += '==')
                                    : ((i += c.charAt(((15 & n) << 2) | (a >> 6))),
                                      (i += isNaN(a) ? '=' : c.charAt(63 & a))),
                                t && i.length > t && ((s += i.substr(0, t) + '\r\n'), (i = i.substr(t)))
                        return (s += i)
                    }),
                    (i.binary.base64.decode = function (e, t, r) {
                        var n,
                            a,
                            i,
                            s,
                            o = t
                        o || (o = new Uint8Array(3 * Math.ceil(e.length / 4))),
                            (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ''))
                        for (var c = 0, l = (r = r || 0); c < e.length; )
                            (n = u[e.charCodeAt(c++) - 43]),
                                (a = u[e.charCodeAt(c++) - 43]),
                                (i = u[e.charCodeAt(c++) - 43]),
                                (s = u[e.charCodeAt(c++) - 43]),
                                (o[l++] = (n << 2) | (a >> 4)),
                                64 !== i &&
                                    ((o[l++] = ((15 & a) << 4) | (i >> 2)), 64 !== s && (o[l++] = ((3 & i) << 6) | s))
                        return t ? l - r : o.subarray(0, l)
                    }),
                    (i.binary.base58.encode = function (e, t) {
                        return i.binary.baseN.encode(e, l, t)
                    }),
                    (i.binary.base58.decode = function (e, t) {
                        return i.binary.baseN.decode(e, l, t)
                    }),
                    (i.text = { utf8: {}, utf16: {} }),
                    (i.text.utf8.encode = function (e, t, r) {
                        e = i.encodeUtf8(e)
                        var n = t
                        n || (n = new Uint8Array(e.length))
                        for (var a = (r = r || 0), s = 0; s < e.length; ++s) n[a++] = e.charCodeAt(s)
                        return t ? a - r : n
                    }),
                    (i.text.utf8.decode = function (e) {
                        return i.decodeUtf8(String.fromCharCode.apply(null, e))
                    }),
                    (i.text.utf16.encode = function (e, t, r) {
                        var n = t
                        n || (n = new Uint8Array(2 * e.length))
                        for (var a = new Uint16Array(n.buffer), i = (r = r || 0), s = r, o = 0; o < e.length; ++o)
                            (a[s++] = e.charCodeAt(o)), (i += 2)
                        return t ? i - r : n
                    }),
                    (i.text.utf16.decode = function (e) {
                        return String.fromCharCode.apply(null, new Uint16Array(e.buffer))
                    }),
                    (i.deflate = function (e, t, r) {
                        if (((t = i.decode64(e.deflate(i.encode64(t)).rval)), r)) {
                            var n = 2
                            32 & t.charCodeAt(1) && (n = 6), (t = t.substring(n, t.length - 4))
                        }
                        return t
                    }),
                    (i.inflate = function (e, t, r) {
                        var n = e.inflate(i.encode64(t)).rval
                        return null === n ? null : i.decode64(n)
                    })
                var p = function (e, t, r) {
                        if (!e) throw new Error('WebStorage not available.')
                        var n
                        if (
                            (null === r
                                ? (n = e.removeItem(t))
                                : ((r = i.encode64(JSON.stringify(r))), (n = e.setItem(t, r))),
                            void 0 !== n && !0 !== n.rval)
                        ) {
                            var a = new Error(n.error.message)
                            throw ((a.id = n.error.id), (a.name = n.error.name), a)
                        }
                    },
                    f = function (e, t) {
                        if (!e) throw new Error('WebStorage not available.')
                        var r = e.getItem(t)
                        if (e.init)
                            if (null === r.rval) {
                                if (r.error) {
                                    var n = new Error(r.error.message)
                                    throw ((n.id = r.error.id), (n.name = r.error.name), n)
                                }
                                r = null
                            } else r = r.rval
                        return null !== r && (r = JSON.parse(i.decode64(r))), r
                    },
                    h = function (e, t, r, n) {
                        var a = f(e, t)
                        null === a && (a = {}), (a[r] = n), p(e, t, a)
                    },
                    d = function (e, t, r) {
                        var n = f(e, t)
                        return null !== n && (n = r in n ? n[r] : null), n
                    },
                    y = function (e, t, r) {
                        var n = f(e, t)
                        if (null !== n && r in n) {
                            delete n[r]
                            var a = !0
                            for (var i in n) {
                                a = !1
                                break
                            }
                            a && (n = null), p(e, t, n)
                        }
                    },
                    g = function (e, t) {
                        p(e, t, null)
                    },
                    v = function (e, t, r) {
                        var n,
                            a = null
                        void 0 === r && (r = ['web', 'flash'])
                        var i = !1,
                            s = null
                        for (var o in r) {
                            n = r[o]
                            try {
                                if ('flash' === n || 'both' === n) {
                                    if (null === t[0]) throw new Error('Flash local storage not available.')
                                    ;(a = e.apply(this, t)), (i = 'flash' === n)
                                }
                                ;('web' !== n && 'both' !== n) ||
                                    ((t[0] = localStorage), (a = e.apply(this, t)), (i = !0))
                            } catch (e) {
                                s = e
                            }
                            if (i) break
                        }
                        if (!i) throw s
                        return a
                    }
                ;(i.setItem = function (e, t, r, n, a) {
                    v(h, arguments, a)
                }),
                    (i.getItem = function (e, t, r, n) {
                        return v(d, arguments, n)
                    }),
                    (i.removeItem = function (e, t, r, n) {
                        v(y, arguments, n)
                    }),
                    (i.clearItems = function (e, t, r) {
                        v(g, arguments, r)
                    }),
                    (i.isEmpty = function (e) {
                        for (var t in e) if (e.hasOwnProperty(t)) return !1
                        return !0
                    }),
                    (i.format = function (e) {
                        for (var t, r, n = /%./g, a = 0, i = [], s = 0; (t = n.exec(e)); ) {
                            ;(r = e.substring(s, n.lastIndex - 2)).length > 0 && i.push(r), (s = n.lastIndex)
                            var o = t[0][1]
                            switch (o) {
                                case 's':
                                case 'o':
                                    a < arguments.length ? i.push(arguments[1 + a++]) : i.push('<?>')
                                    break
                                case '%':
                                    i.push('%')
                                    break
                                default:
                                    i.push('<%' + o + '?>')
                            }
                        }
                        return i.push(e.substring(s)), i.join('')
                    }),
                    (i.formatNumber = function (e, t, r, n) {
                        var a = e,
                            i = isNaN((t = Math.abs(t))) ? 2 : t,
                            s = void 0 === r ? ',' : r,
                            o = void 0 === n ? '.' : n,
                            c = a < 0 ? '-' : '',
                            u = parseInt((a = Math.abs(+a || 0).toFixed(i)), 10) + '',
                            l = u.length > 3 ? u.length % 3 : 0
                        return (
                            c +
                            (l ? u.substr(0, l) + o : '') +
                            u.substr(l).replace(/(\d{3})(?=\d)/g, '$1' + o) +
                            (i
                                ? s +
                                  Math.abs(a - u)
                                      .toFixed(i)
                                      .slice(2)
                                : '')
                        )
                    }),
                    (i.formatSize = function (e) {
                        return (e =
                            e >= 1073741824
                                ? i.formatNumber(e / 1073741824, 2, '.', '') + ' GiB'
                                : e >= 1048576
                                ? i.formatNumber(e / 1048576, 2, '.', '') + ' MiB'
                                : e >= 1024
                                ? i.formatNumber(e / 1024, 0) + ' KiB'
                                : i.formatNumber(e, 0) + ' bytes')
                    }),
                    (i.bytesFromIP = function (e) {
                        return -1 !== e.indexOf('.')
                            ? i.bytesFromIPv4(e)
                            : -1 !== e.indexOf(':')
                            ? i.bytesFromIPv6(e)
                            : null
                    }),
                    (i.bytesFromIPv4 = function (e) {
                        if (4 !== (e = e.split('.')).length) return null
                        for (var t = i.createBuffer(), r = 0; r < e.length; ++r) {
                            var n = parseInt(e[r], 10)
                            if (isNaN(n)) return null
                            t.putByte(n)
                        }
                        return t.getBytes()
                    }),
                    (i.bytesFromIPv6 = function (e) {
                        for (
                            var t = 0,
                                r =
                                    2 *
                                    (8 -
                                        (e = e.split(':').filter(function (e) {
                                            return 0 === e.length && ++t, !0
                                        })).length +
                                        t),
                                n = i.createBuffer(),
                                a = 0;
                            a < 8;
                            ++a
                        )
                            if (e[a] && 0 !== e[a].length) {
                                var s = i.hexToBytes(e[a])
                                s.length < 2 && n.putByte(0), n.putBytes(s)
                            } else n.fillWithByte(0, r), (r = 0)
                        return n.getBytes()
                    }),
                    (i.bytesToIP = function (e) {
                        return 4 === e.length ? i.bytesToIPv4(e) : 16 === e.length ? i.bytesToIPv6(e) : null
                    }),
                    (i.bytesToIPv4 = function (e) {
                        if (4 !== e.length) return null
                        for (var t = [], r = 0; r < e.length; ++r) t.push(e.charCodeAt(r))
                        return t.join('.')
                    }),
                    (i.bytesToIPv6 = function (e) {
                        if (16 !== e.length) return null
                        for (var t = [], r = [], n = 0, a = 0; a < e.length; a += 2) {
                            for (var s = i.bytesToHex(e[a] + e[a + 1]); '0' === s[0] && '0' !== s; ) s = s.substr(1)
                            if ('0' === s) {
                                var o = r[r.length - 1],
                                    c = t.length
                                o && c === o.end + 1
                                    ? ((o.end = c), o.end - o.start > r[n].end - r[n].start && (n = r.length - 1))
                                    : r.push({ start: c, end: c })
                            }
                            t.push(s)
                        }
                        if (r.length > 0) {
                            var u = r[n]
                            u.end - u.start > 0 &&
                                (t.splice(u.start, u.end - u.start + 1, ''),
                                0 === u.start && t.unshift(''),
                                7 === u.end && t.push(''))
                        }
                        return t.join(':')
                    }),
                    (i.estimateCores = function (e, t) {
                        if (('function' == typeof e && ((t = e), (e = {})), (e = e || {}), 'cores' in i && !e.update))
                            return t(null, i.cores)
                        if (
                            'undefined' != typeof navigator &&
                            'hardwareConcurrency' in navigator &&
                            navigator.hardwareConcurrency > 0
                        )
                            return (i.cores = navigator.hardwareConcurrency), t(null, i.cores)
                        if ('undefined' == typeof Worker) return (i.cores = 1), t(null, i.cores)
                        if ('undefined' == typeof Blob) return (i.cores = 2), t(null, i.cores)
                        var r = URL.createObjectURL(
                            new Blob(
                                [
                                    '(',
                                    function () {
                                        self.addEventListener('message', function (e) {
                                            for (var t = Date.now(), r = t + 4; Date.now() < r; );
                                            self.postMessage({ st: t, et: r })
                                        })
                                    }.toString(),
                                    ')()',
                                ],
                                { type: 'application/javascript' }
                            )
                        )
                        !(function e(n, a, s) {
                            if (0 === a) {
                                var o = Math.floor(
                                    n.reduce(function (e, t) {
                                        return e + t
                                    }, 0) / n.length
                                )
                                return (i.cores = Math.max(1, o)), URL.revokeObjectURL(r), t(null, i.cores)
                            }
                            !(function (e, t) {
                                for (var n = [], a = [], i = 0; i < e; ++i) {
                                    var s = new Worker(r)
                                    s.addEventListener('message', function (r) {
                                        if ((a.push(r.data), a.length === e)) {
                                            for (var i = 0; i < e; ++i) n[i].terminate()
                                            t(null, a)
                                        }
                                    }),
                                        n.push(s)
                                }
                                for (i = 0; i < e; ++i) n[i].postMessage(i)
                            })(s, function (t, r) {
                                n.push(
                                    (function (e, t) {
                                        for (var r = [], n = 0; n < e; ++n)
                                            for (var a = t[n], i = (r[n] = []), s = 0; s < e; ++s)
                                                if (n !== s) {
                                                    var o = t[s]
                                                    ;((a.st > o.st && a.st < o.et) || (o.st > a.st && o.st < a.et)) &&
                                                        i.push(s)
                                                }
                                        return r.reduce(function (e, t) {
                                            return Math.max(e, t.length)
                                        }, 0)
                                    })(s, r)
                                ),
                                    e(n, a - 1, s)
                            })
                        })([], 5, 16)
                    })
            }).call(this, r(37))
        },
        function (e, t, r) {
            var n = r(0)
            r(5),
                r(23),
                r(24),
                r(1),
                n.random && n.random.getBytes
                    ? (e.exports = n.random)
                    : (function (t) {
                          var r = {},
                              a = new Array(4),
                              i = n.util.createBuffer()
                          function s() {
                              var e = n.prng.create(r)
                              return (
                                  (e.getBytes = function (t, r) {
                                      return e.generate(t, r)
                                  }),
                                  (e.getBytesSync = function (t) {
                                      return e.generate(t)
                                  }),
                                  e
                              )
                          }
                          ;(r.formatKey = function (e) {
                              var t = n.util.createBuffer(e)
                              return (
                                  ((e = new Array(4))[0] = t.getInt32()),
                                  (e[1] = t.getInt32()),
                                  (e[2] = t.getInt32()),
                                  (e[3] = t.getInt32()),
                                  n.aes._expandKey(e, !1)
                              )
                          }),
                              (r.formatSeed = function (e) {
                                  var t = n.util.createBuffer(e)
                                  return (
                                      ((e = new Array(4))[0] = t.getInt32()),
                                      (e[1] = t.getInt32()),
                                      (e[2] = t.getInt32()),
                                      (e[3] = t.getInt32()),
                                      e
                                  )
                              }),
                              (r.cipher = function (e, t) {
                                  return (
                                      n.aes._updateBlock(e, t, a, !1),
                                      i.putInt32(a[0]),
                                      i.putInt32(a[1]),
                                      i.putInt32(a[2]),
                                      i.putInt32(a[3]),
                                      i.getBytes()
                                  )
                              }),
                              (r.increment = function (e) {
                                  return ++e[3], e
                              }),
                              (r.md = n.md.sha256)
                          var o = s(),
                              c = null,
                              u = n.util.globalScope,
                              l = u.crypto || u.msCrypto
                          if (
                              (l &&
                                  l.getRandomValues &&
                                  (c = function (e) {
                                      return l.getRandomValues(e)
                                  }),
                              n.options.usePureJavaScript || (!n.util.isNodejs && !c))
                          ) {
                              if (
                                  ('undefined' == typeof window || window.document,
                                  o.collectInt(+new Date(), 32),
                                  'undefined' != typeof navigator)
                              ) {
                                  var p = ''
                                  for (var f in navigator)
                                      try {
                                          'string' == typeof navigator[f] && (p += navigator[f])
                                      } catch (e) {}
                                  o.collect(p), (p = null)
                              }
                              t &&
                                  (t().mousemove(function (e) {
                                      o.collectInt(e.clientX, 16), o.collectInt(e.clientY, 16)
                                  }),
                                  t().keypress(function (e) {
                                      o.collectInt(e.charCode, 8)
                                  }))
                          }
                          if (n.random) for (var f in o) n.random[f] = o[f]
                          else n.random = o
                          ;(n.random.createInstance = s), (e.exports = n.random)
                      })('undefined' != typeof jQuery ? jQuery : null)
        },
        function (e, t, r) {
            var n = r(0)
            r(1), r(6)
            var a = (e.exports = n.asn1 = n.asn1 || {})
            function i(e, t, r) {
                if (r > t) {
                    var n = new Error('Too few bytes to parse DER.')
                    throw ((n.available = e.length()), (n.remaining = t), (n.requested = r), n)
                }
            }
            ;(a.Class = { UNIVERSAL: 0, APPLICATION: 64, CONTEXT_SPECIFIC: 128, PRIVATE: 192 }),
                (a.Type = {
                    NONE: 0,
                    BOOLEAN: 1,
                    INTEGER: 2,
                    BITSTRING: 3,
                    OCTETSTRING: 4,
                    NULL: 5,
                    OID: 6,
                    ODESC: 7,
                    EXTERNAL: 8,
                    REAL: 9,
                    ENUMERATED: 10,
                    EMBEDDED: 11,
                    UTF8: 12,
                    ROID: 13,
                    SEQUENCE: 16,
                    SET: 17,
                    PRINTABLESTRING: 19,
                    IA5STRING: 22,
                    UTCTIME: 23,
                    GENERALIZEDTIME: 24,
                    BMPSTRING: 30,
                }),
                (a.create = function (e, t, r, i, s) {
                    if (n.util.isArray(i)) {
                        for (var o = [], c = 0; c < i.length; ++c) void 0 !== i[c] && o.push(i[c])
                        i = o
                    }
                    var u = { tagClass: e, type: t, constructed: r, composed: r || n.util.isArray(i), value: i }
                    return (
                        s &&
                            'bitStringContents' in s &&
                            ((u.bitStringContents = s.bitStringContents), (u.original = a.copy(u))),
                        u
                    )
                }),
                (a.copy = function (e, t) {
                    var r
                    if (n.util.isArray(e)) {
                        r = []
                        for (var i = 0; i < e.length; ++i) r.push(a.copy(e[i], t))
                        return r
                    }
                    return 'string' == typeof e
                        ? e
                        : ((r = {
                              tagClass: e.tagClass,
                              type: e.type,
                              constructed: e.constructed,
                              composed: e.composed,
                              value: a.copy(e.value, t),
                          }),
                          t && !t.excludeBitStringContents && (r.bitStringContents = e.bitStringContents),
                          r)
                }),
                (a.equals = function (e, t, r) {
                    if (n.util.isArray(e)) {
                        if (!n.util.isArray(t)) return !1
                        if (e.length !== t.length) return !1
                        for (var i = 0; i < e.length; ++i) if (!a.equals(e[i], t[i])) return !1
                        return !0
                    }
                    if (typeof e != typeof t) return !1
                    if ('string' == typeof e) return e === t
                    var s =
                        e.tagClass === t.tagClass &&
                        e.type === t.type &&
                        e.constructed === t.constructed &&
                        e.composed === t.composed &&
                        a.equals(e.value, t.value)
                    return r && r.includeBitStringContents && (s = s && e.bitStringContents === t.bitStringContents), s
                }),
                (a.getBerValueLength = function (e) {
                    var t = e.getByte()
                    if (128 !== t) return 128 & t ? e.getInt((127 & t) << 3) : t
                })
            ;(a.fromDer = function (e, t) {
                void 0 === t && (t = { strict: !0, parseAllBytes: !0, decodeBitStrings: !0 }),
                    'boolean' == typeof t && (t = { strict: t, parseAllBytes: !0, decodeBitStrings: !0 }),
                    'strict' in t || (t.strict = !0),
                    'parseAllBytes' in t || (t.parseAllBytes = !0),
                    'decodeBitStrings' in t || (t.decodeBitStrings = !0),
                    'string' == typeof e && (e = n.util.createBuffer(e))
                var r = e.length(),
                    s = (function e(t, r, n, s) {
                        var o
                        i(t, r, 2)
                        var c = t.getByte()
                        r--
                        var u = 192 & c,
                            l = 31 & c
                        o = t.length()
                        var p,
                            f,
                            h = (function (e, t) {
                                var r = e.getByte()
                                if ((t--, 128 !== r)) {
                                    var n
                                    if (128 & r) {
                                        var a = 127 & r
                                        i(e, t, a), (n = e.getInt(a << 3))
                                    } else n = r
                                    if (n < 0) throw new Error('Negative length: ' + n)
                                    return n
                                }
                            })(t, r)
                        if (((r -= o - t.length()), void 0 !== h && h > r)) {
                            if (s.strict) {
                                var d = new Error('Too few bytes to read ASN.1 value.')
                                throw ((d.available = t.length()), (d.remaining = r), (d.requested = h), d)
                            }
                            h = r
                        }
                        var y = 32 == (32 & c)
                        if (y)
                            if (((p = []), void 0 === h))
                                for (;;) {
                                    if ((i(t, r, 2), t.bytes(2) === String.fromCharCode(0, 0))) {
                                        t.getBytes(2), (r -= 2)
                                        break
                                    }
                                    ;(o = t.length()), p.push(e(t, r, n + 1, s)), (r -= o - t.length())
                                }
                            else
                                for (; h > 0; )
                                    (o = t.length()),
                                        p.push(e(t, h, n + 1, s)),
                                        (r -= o - t.length()),
                                        (h -= o - t.length())
                        void 0 === p && u === a.Class.UNIVERSAL && l === a.Type.BITSTRING && (f = t.bytes(h))
                        if (
                            void 0 === p &&
                            s.decodeBitStrings &&
                            u === a.Class.UNIVERSAL &&
                            l === a.Type.BITSTRING &&
                            h > 1
                        ) {
                            var g = t.read,
                                v = r,
                                m = 0
                            if ((l === a.Type.BITSTRING && (i(t, r, 1), (m = t.getByte()), r--), 0 === m))
                                try {
                                    o = t.length()
                                    var C = e(t, r, n + 1, { strict: !0, decodeBitStrings: !0 }),
                                        E = o - t.length()
                                    ;(r -= E), l == a.Type.BITSTRING && E++
                                    var S = C.tagClass
                                    E !== h || (S !== a.Class.UNIVERSAL && S !== a.Class.CONTEXT_SPECIFIC) || (p = [C])
                                } catch (e) {}
                            void 0 === p && ((t.read = g), (r = v))
                        }
                        if (void 0 === p) {
                            if (void 0 === h) {
                                if (s.strict) throw new Error('Non-constructed ASN.1 object of indefinite length.')
                                h = r
                            }
                            if (l === a.Type.BMPSTRING)
                                for (p = ''; h > 0; h -= 2)
                                    i(t, r, 2), (p += String.fromCharCode(t.getInt16())), (r -= 2)
                            else (p = t.getBytes(h)), (r -= h)
                        }
                        var T = void 0 === f ? null : { bitStringContents: f }
                        return a.create(u, l, y, p, T)
                    })(e, e.length(), 0, t)
                if (t.parseAllBytes && 0 !== e.length()) {
                    var o = new Error('Unparsed DER bytes remain after ASN.1 parsing.')
                    throw ((o.byteCount = r), (o.remaining = e.length()), o)
                }
                return s
            }),
                (a.toDer = function (e) {
                    var t = n.util.createBuffer(),
                        r = e.tagClass | e.type,
                        i = n.util.createBuffer(),
                        s = !1
                    if (('bitStringContents' in e && ((s = !0), e.original && (s = a.equals(e, e.original))), s))
                        i.putBytes(e.bitStringContents)
                    else if (e.composed) {
                        e.constructed ? (r |= 32) : i.putByte(0)
                        for (var o = 0; o < e.value.length; ++o)
                            void 0 !== e.value[o] && i.putBuffer(a.toDer(e.value[o]))
                    } else if (e.type === a.Type.BMPSTRING)
                        for (o = 0; o < e.value.length; ++o) i.putInt16(e.value.charCodeAt(o))
                    else
                        e.type === a.Type.INTEGER &&
                        e.value.length > 1 &&
                        ((0 === e.value.charCodeAt(0) && 0 == (128 & e.value.charCodeAt(1))) ||
                            (255 === e.value.charCodeAt(0) && 128 == (128 & e.value.charCodeAt(1))))
                            ? i.putBytes(e.value.substr(1))
                            : i.putBytes(e.value)
                    if ((t.putByte(r), i.length() <= 127)) t.putByte(127 & i.length())
                    else {
                        var c = i.length(),
                            u = ''
                        do {
                            ;(u += String.fromCharCode(255 & c)), (c >>>= 8)
                        } while (c > 0)
                        t.putByte(128 | u.length)
                        for (o = u.length - 1; o >= 0; --o) t.putByte(u.charCodeAt(o))
                    }
                    return t.putBuffer(i), t
                }),
                (a.oidToDer = function (e) {
                    var t,
                        r,
                        a,
                        i,
                        s = e.split('.'),
                        o = n.util.createBuffer()
                    o.putByte(40 * parseInt(s[0], 10) + parseInt(s[1], 10))
                    for (var c = 2; c < s.length; ++c) {
                        ;(t = !0), (r = []), (a = parseInt(s[c], 10))
                        do {
                            ;(i = 127 & a), (a >>>= 7), t || (i |= 128), r.push(i), (t = !1)
                        } while (a > 0)
                        for (var u = r.length - 1; u >= 0; --u) o.putByte(r[u])
                    }
                    return o
                }),
                (a.derToOid = function (e) {
                    var t
                    'string' == typeof e && (e = n.util.createBuffer(e))
                    var r = e.getByte()
                    t = Math.floor(r / 40) + '.' + (r % 40)
                    for (var a = 0; e.length() > 0; )
                        (a <<= 7), 128 & (r = e.getByte()) ? (a += 127 & r) : ((t += '.' + (a + r)), (a = 0))
                    return t
                }),
                (a.utcTimeToDate = function (e) {
                    var t = new Date(),
                        r = parseInt(e.substr(0, 2), 10)
                    r = r >= 50 ? 1900 + r : 2e3 + r
                    var n = parseInt(e.substr(2, 2), 10) - 1,
                        a = parseInt(e.substr(4, 2), 10),
                        i = parseInt(e.substr(6, 2), 10),
                        s = parseInt(e.substr(8, 2), 10),
                        o = 0
                    if (e.length > 11) {
                        var c = e.charAt(10),
                            u = 10
                        '+' !== c && '-' !== c && ((o = parseInt(e.substr(10, 2), 10)), (u += 2))
                    }
                    if (
                        (t.setUTCFullYear(r, n, a),
                        t.setUTCHours(i, s, o, 0),
                        u && ('+' === (c = e.charAt(u)) || '-' === c))
                    ) {
                        var l = 60 * parseInt(e.substr(u + 1, 2), 10) + parseInt(e.substr(u + 4, 2), 10)
                        ;(l *= 6e4), '+' === c ? t.setTime(+t - l) : t.setTime(+t + l)
                    }
                    return t
                }),
                (a.generalizedTimeToDate = function (e) {
                    var t = new Date(),
                        r = parseInt(e.substr(0, 4), 10),
                        n = parseInt(e.substr(4, 2), 10) - 1,
                        a = parseInt(e.substr(6, 2), 10),
                        i = parseInt(e.substr(8, 2), 10),
                        s = parseInt(e.substr(10, 2), 10),
                        o = parseInt(e.substr(12, 2), 10),
                        c = 0,
                        u = 0,
                        l = !1
                    'Z' === e.charAt(e.length - 1) && (l = !0)
                    var p = e.length - 5,
                        f = e.charAt(p)
                    ;('+' !== f && '-' !== f) ||
                        ((u = 60 * parseInt(e.substr(p + 1, 2), 10) + parseInt(e.substr(p + 4, 2), 10)),
                        (u *= 6e4),
                        '+' === f && (u *= -1),
                        (l = !0))
                    return (
                        '.' === e.charAt(14) && (c = 1e3 * parseFloat(e.substr(14), 10)),
                        l
                            ? (t.setUTCFullYear(r, n, a), t.setUTCHours(i, s, o, c), t.setTime(+t + u))
                            : (t.setFullYear(r, n, a), t.setHours(i, s, o, c)),
                        t
                    )
                }),
                (a.dateToUtcTime = function (e) {
                    if ('string' == typeof e) return e
                    var t = '',
                        r = []
                    r.push(('' + e.getUTCFullYear()).substr(2)),
                        r.push('' + (e.getUTCMonth() + 1)),
                        r.push('' + e.getUTCDate()),
                        r.push('' + e.getUTCHours()),
                        r.push('' + e.getUTCMinutes()),
                        r.push('' + e.getUTCSeconds())
                    for (var n = 0; n < r.length; ++n) r[n].length < 2 && (t += '0'), (t += r[n])
                    return (t += 'Z')
                }),
                (a.dateToGeneralizedTime = function (e) {
                    if ('string' == typeof e) return e
                    var t = '',
                        r = []
                    r.push('' + e.getUTCFullYear()),
                        r.push('' + (e.getUTCMonth() + 1)),
                        r.push('' + e.getUTCDate()),
                        r.push('' + e.getUTCHours()),
                        r.push('' + e.getUTCMinutes()),
                        r.push('' + e.getUTCSeconds())
                    for (var n = 0; n < r.length; ++n) r[n].length < 2 && (t += '0'), (t += r[n])
                    return (t += 'Z')
                }),
                (a.integerToDer = function (e) {
                    var t = n.util.createBuffer()
                    if (e >= -128 && e < 128) return t.putSignedInt(e, 8)
                    if (e >= -32768 && e < 32768) return t.putSignedInt(e, 16)
                    if (e >= -8388608 && e < 8388608) return t.putSignedInt(e, 24)
                    if (e >= -2147483648 && e < 2147483648) return t.putSignedInt(e, 32)
                    var r = new Error('Integer too large; max is 32-bits.')
                    throw ((r.integer = e), r)
                }),
                (a.derToInteger = function (e) {
                    'string' == typeof e && (e = n.util.createBuffer(e))
                    var t = 8 * e.length()
                    if (t > 32) throw new Error('Integer too large; max is 32-bits.')
                    return e.getSignedInt(t)
                }),
                (a.validate = function (e, t, r, i) {
                    var s = !1
                    if (
                        (e.tagClass !== t.tagClass && void 0 !== t.tagClass) ||
                        (e.type !== t.type && void 0 !== t.type)
                    )
                        i &&
                            (e.tagClass !== t.tagClass &&
                                i.push(
                                    '[' + t.name + '] Expected tag class "' + t.tagClass + '", got "' + e.tagClass + '"'
                                ),
                            e.type !== t.type &&
                                i.push('[' + t.name + '] Expected type "' + t.type + '", got "' + e.type + '"'))
                    else if (e.constructed === t.constructed || void 0 === t.constructed) {
                        if (((s = !0), t.value && n.util.isArray(t.value)))
                            for (var o = 0, c = 0; s && c < t.value.length; ++c)
                                (s = t.value[c].optional || !1),
                                    e.value[o] &&
                                        ((s = a.validate(e.value[o], t.value[c], r, i))
                                            ? ++o
                                            : t.value[c].optional && (s = !0)),
                                    !s &&
                                        i &&
                                        i.push(
                                            '[' +
                                                t.name +
                                                '] Tag class "' +
                                                t.tagClass +
                                                '", type "' +
                                                t.type +
                                                '" expected value length "' +
                                                t.value.length +
                                                '", got "' +
                                                e.value.length +
                                                '"'
                                        )
                        if (s && r)
                            if (
                                (t.capture && (r[t.capture] = e.value),
                                t.captureAsn1 && (r[t.captureAsn1] = e),
                                t.captureBitStringContents &&
                                    'bitStringContents' in e &&
                                    (r[t.captureBitStringContents] = e.bitStringContents),
                                t.captureBitStringValue && 'bitStringContents' in e)
                            )
                                if (e.bitStringContents.length < 2) r[t.captureBitStringValue] = ''
                                else {
                                    if (0 !== e.bitStringContents.charCodeAt(0))
                                        throw new Error('captureBitStringValue only supported for zero unused bits')
                                    r[t.captureBitStringValue] = e.bitStringContents.slice(1)
                                }
                    } else
                        i &&
                            i.push(
                                '[' +
                                    t.name +
                                    '] Expected constructed "' +
                                    t.constructed +
                                    '", got "' +
                                    e.constructed +
                                    '"'
                            )
                    return s
                })
            var s = /[^\\u0000-\\u00ff]/
            a.prettyPrint = function (e, t, r) {
                var i = ''
                ;(r = r || 2), (t = t || 0) > 0 && (i += '\n')
                for (var o = '', c = 0; c < t * r; ++c) o += ' '
                switch (((i += o + 'Tag: '), e.tagClass)) {
                    case a.Class.UNIVERSAL:
                        i += 'Universal:'
                        break
                    case a.Class.APPLICATION:
                        i += 'Application:'
                        break
                    case a.Class.CONTEXT_SPECIFIC:
                        i += 'Context-Specific:'
                        break
                    case a.Class.PRIVATE:
                        i += 'Private:'
                }
                if (e.tagClass === a.Class.UNIVERSAL)
                    switch (((i += e.type), e.type)) {
                        case a.Type.NONE:
                            i += ' (None)'
                            break
                        case a.Type.BOOLEAN:
                            i += ' (Boolean)'
                            break
                        case a.Type.INTEGER:
                            i += ' (Integer)'
                            break
                        case a.Type.BITSTRING:
                            i += ' (Bit string)'
                            break
                        case a.Type.OCTETSTRING:
                            i += ' (Octet string)'
                            break
                        case a.Type.NULL:
                            i += ' (Null)'
                            break
                        case a.Type.OID:
                            i += ' (Object Identifier)'
                            break
                        case a.Type.ODESC:
                            i += ' (Object Descriptor)'
                            break
                        case a.Type.EXTERNAL:
                            i += ' (External or Instance of)'
                            break
                        case a.Type.REAL:
                            i += ' (Real)'
                            break
                        case a.Type.ENUMERATED:
                            i += ' (Enumerated)'
                            break
                        case a.Type.EMBEDDED:
                            i += ' (Embedded PDV)'
                            break
                        case a.Type.UTF8:
                            i += ' (UTF8)'
                            break
                        case a.Type.ROID:
                            i += ' (Relative Object Identifier)'
                            break
                        case a.Type.SEQUENCE:
                            i += ' (Sequence)'
                            break
                        case a.Type.SET:
                            i += ' (Set)'
                            break
                        case a.Type.PRINTABLESTRING:
                            i += ' (Printable String)'
                            break
                        case a.Type.IA5String:
                            i += ' (IA5String (ASCII))'
                            break
                        case a.Type.UTCTIME:
                            i += ' (UTC time)'
                            break
                        case a.Type.GENERALIZEDTIME:
                            i += ' (Generalized time)'
                            break
                        case a.Type.BMPSTRING:
                            i += ' (BMP String)'
                    }
                else i += e.type
                if (((i += '\n'), (i += o + 'Constructed: ' + e.constructed + '\n'), e.composed)) {
                    var u = 0,
                        l = ''
                    for (c = 0; c < e.value.length; ++c)
                        void 0 !== e.value[c] &&
                            ((u += 1), (l += a.prettyPrint(e.value[c], t + 1, r)), c + 1 < e.value.length && (l += ','))
                    i += o + 'Sub values: ' + u + l
                } else {
                    if (((i += o + 'Value: '), e.type === a.Type.OID)) {
                        var p = a.derToOid(e.value)
                        ;(i += p), n.pki && n.pki.oids && p in n.pki.oids && (i += ' (' + n.pki.oids[p] + ') ')
                    }
                    if (e.type === a.Type.INTEGER)
                        try {
                            i += a.derToInteger(e.value)
                        } catch (t) {
                            i += '0x' + n.util.bytesToHex(e.value)
                        }
                    else if (e.type === a.Type.BITSTRING) {
                        if (
                            (e.value.length > 1 ? (i += '0x' + n.util.bytesToHex(e.value.slice(1))) : (i += '(none)'),
                            e.value.length > 0)
                        ) {
                            var f = e.value.charCodeAt(0)
                            1 == f ? (i += ' (1 unused bit shown)') : f > 1 && (i += ' (' + f + ' unused bits shown)')
                        }
                    } else if (e.type === a.Type.OCTETSTRING)
                        s.test(e.value) || (i += '(' + e.value + ') '), (i += '0x' + n.util.bytesToHex(e.value))
                    else if (e.type === a.Type.UTF8)
                        try {
                            i += n.util.decodeUtf8(e.value)
                        } catch (t) {
                            if ('URI malformed' !== t.message) throw t
                            i += '0x' + n.util.bytesToHex(e.value) + ' (malformed UTF8)'
                        }
                    else
                        e.type === a.Type.PRINTABLESTRING || e.type === a.Type.IA5String
                            ? (i += e.value)
                            : s.test(e.value)
                            ? (i += '0x' + n.util.bytesToHex(e.value))
                            : 0 === e.value.length
                            ? (i += '[null]')
                            : (i += e.value)
                }
                return i
            }
        },
        function (e, t, r) {
            var n = r(0)
            ;(e.exports = n.md = n.md || {}), (n.md.algorithms = n.md.algorithms || {})
        },
        function (e, t, r) {
            var n = r(0)
            function a(e, t) {
                n.cipher.registerAlgorithm(e, function () {
                    return new n.aes.Algorithm(e, t)
                })
            }
            r(14),
                r(20),
                r(1),
                (e.exports = n.aes = n.aes || {}),
                (n.aes.startEncrypting = function (e, t, r, n) {
                    var a = d({ key: e, output: r, decrypt: !1, mode: n })
                    return a.start(t), a
                }),
                (n.aes.createEncryptionCipher = function (e, t) {
                    return d({ key: e, output: null, decrypt: !1, mode: t })
                }),
                (n.aes.startDecrypting = function (e, t, r, n) {
                    var a = d({ key: e, output: r, decrypt: !0, mode: n })
                    return a.start(t), a
                }),
                (n.aes.createDecryptionCipher = function (e, t) {
                    return d({ key: e, output: null, decrypt: !0, mode: t })
                }),
                (n.aes.Algorithm = function (e, t) {
                    l || p()
                    var r = this
                    ;(r.name = e),
                        (r.mode = new t({
                            blockSize: 16,
                            cipher: {
                                encrypt: function (e, t) {
                                    return h(r._w, e, t, !1)
                                },
                                decrypt: function (e, t) {
                                    return h(r._w, e, t, !0)
                                },
                            },
                        })),
                        (r._init = !1)
                }),
                (n.aes.Algorithm.prototype.initialize = function (e) {
                    if (!this._init) {
                        var t,
                            r = e.key
                        if ('string' != typeof r || (16 !== r.length && 24 !== r.length && 32 !== r.length)) {
                            if (n.util.isArray(r) && (16 === r.length || 24 === r.length || 32 === r.length)) {
                                ;(t = r), (r = n.util.createBuffer())
                                for (var a = 0; a < t.length; ++a) r.putByte(t[a])
                            }
                        } else r = n.util.createBuffer(r)
                        if (!n.util.isArray(r)) {
                            ;(t = r), (r = [])
                            var i = t.length()
                            if (16 === i || 24 === i || 32 === i) {
                                i >>>= 2
                                for (a = 0; a < i; ++a) r.push(t.getInt32())
                            }
                        }
                        if (!n.util.isArray(r) || (4 !== r.length && 6 !== r.length && 8 !== r.length))
                            throw new Error('Invalid key parameter.')
                        var s = this.mode.name,
                            o = -1 !== ['CFB', 'OFB', 'CTR', 'GCM'].indexOf(s)
                        ;(this._w = f(r, e.decrypt && !o)), (this._init = !0)
                    }
                }),
                (n.aes._expandKey = function (e, t) {
                    return l || p(), f(e, t)
                }),
                (n.aes._updateBlock = h),
                a('AES-ECB', n.cipher.modes.ecb),
                a('AES-CBC', n.cipher.modes.cbc),
                a('AES-CFB', n.cipher.modes.cfb),
                a('AES-OFB', n.cipher.modes.ofb),
                a('AES-CTR', n.cipher.modes.ctr),
                a('AES-GCM', n.cipher.modes.gcm)
            var i,
                s,
                o,
                c,
                u,
                l = !1
            function p() {
                ;(l = !0), (o = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54])
                for (var e = new Array(256), t = 0; t < 128; ++t) (e[t] = t << 1), (e[t + 128] = ((t + 128) << 1) ^ 283)
                ;(i = new Array(256)), (s = new Array(256)), (c = new Array(4)), (u = new Array(4))
                for (t = 0; t < 4; ++t) (c[t] = new Array(256)), (u[t] = new Array(256))
                var r,
                    n,
                    a,
                    p,
                    f,
                    h,
                    d,
                    y = 0,
                    g = 0
                for (t = 0; t < 256; ++t) {
                    ;(p = ((p = g ^ (g << 1) ^ (g << 2) ^ (g << 3) ^ (g << 4)) >> 8) ^ (255 & p) ^ 99),
                        (i[y] = p),
                        (s[p] = y),
                        (h = ((f = e[p]) << 24) ^ (p << 16) ^ (p << 8) ^ p ^ f),
                        (d =
                            (((r = e[y]) ^ (n = e[r]) ^ (a = e[n])) << 24) ^
                            ((y ^ a) << 16) ^
                            ((y ^ n ^ a) << 8) ^
                            y ^
                            r ^
                            a)
                    for (var v = 0; v < 4; ++v)
                        (c[v][y] = h), (u[v][p] = d), (h = (h << 24) | (h >>> 8)), (d = (d << 24) | (d >>> 8))
                    0 === y ? (y = g = 1) : ((y = r ^ e[e[e[r ^ a]]]), (g ^= e[e[g]]))
                }
            }
            function f(e, t) {
                for (var r, n = e.slice(0), a = 1, s = n.length, c = 4 * (s + 6 + 1), l = s; l < c; ++l)
                    (r = n[l - 1]),
                        l % s == 0
                            ? ((r =
                                  (i[(r >>> 16) & 255] << 24) ^
                                  (i[(r >>> 8) & 255] << 16) ^
                                  (i[255 & r] << 8) ^
                                  i[r >>> 24] ^
                                  (o[a] << 24)),
                              a++)
                            : s > 6 &&
                              l % s == 4 &&
                              (r =
                                  (i[r >>> 24] << 24) ^
                                  (i[(r >>> 16) & 255] << 16) ^
                                  (i[(r >>> 8) & 255] << 8) ^
                                  i[255 & r]),
                        (n[l] = n[l - s] ^ r)
                if (t) {
                    for (
                        var p,
                            f = u[0],
                            h = u[1],
                            d = u[2],
                            y = u[3],
                            g = n.slice(0),
                            v = ((l = 0), (c = n.length) - 4);
                        l < c;
                        l += 4, v -= 4
                    )
                        if (0 === l || l === c - 4)
                            (g[l] = n[v]), (g[l + 1] = n[v + 3]), (g[l + 2] = n[v + 2]), (g[l + 3] = n[v + 1])
                        else
                            for (var m = 0; m < 4; ++m)
                                (p = n[v + m]),
                                    (g[l + (3 & -m)] =
                                        f[i[p >>> 24]] ^ h[i[(p >>> 16) & 255]] ^ d[i[(p >>> 8) & 255]] ^ y[i[255 & p]])
                    n = g
                }
                return n
            }
            function h(e, t, r, n) {
                var a,
                    o,
                    l,
                    p,
                    f,
                    h,
                    d,
                    y,
                    g,
                    v,
                    m,
                    C,
                    E = e.length / 4 - 1
                n
                    ? ((a = u[0]), (o = u[1]), (l = u[2]), (p = u[3]), (f = s))
                    : ((a = c[0]), (o = c[1]), (l = c[2]), (p = c[3]), (f = i)),
                    (h = t[0] ^ e[0]),
                    (d = t[n ? 3 : 1] ^ e[1]),
                    (y = t[2] ^ e[2]),
                    (g = t[n ? 1 : 3] ^ e[3])
                for (var S = 3, T = 1; T < E; ++T)
                    (v = a[h >>> 24] ^ o[(d >>> 16) & 255] ^ l[(y >>> 8) & 255] ^ p[255 & g] ^ e[++S]),
                        (m = a[d >>> 24] ^ o[(y >>> 16) & 255] ^ l[(g >>> 8) & 255] ^ p[255 & h] ^ e[++S]),
                        (C = a[y >>> 24] ^ o[(g >>> 16) & 255] ^ l[(h >>> 8) & 255] ^ p[255 & d] ^ e[++S]),
                        (g = a[g >>> 24] ^ o[(h >>> 16) & 255] ^ l[(d >>> 8) & 255] ^ p[255 & y] ^ e[++S]),
                        (h = v),
                        (d = m),
                        (y = C)
                ;(r[0] =
                    (f[h >>> 24] << 24) ^
                    (f[(d >>> 16) & 255] << 16) ^
                    (f[(y >>> 8) & 255] << 8) ^
                    f[255 & g] ^
                    e[++S]),
                    (r[n ? 3 : 1] =
                        (f[d >>> 24] << 24) ^
                        (f[(y >>> 16) & 255] << 16) ^
                        (f[(g >>> 8) & 255] << 8) ^
                        f[255 & h] ^
                        e[++S]),
                    (r[2] =
                        (f[y >>> 24] << 24) ^
                        (f[(g >>> 16) & 255] << 16) ^
                        (f[(h >>> 8) & 255] << 8) ^
                        f[255 & d] ^
                        e[++S]),
                    (r[n ? 1 : 3] =
                        (f[g >>> 24] << 24) ^
                        (f[(h >>> 16) & 255] << 16) ^
                        (f[(d >>> 8) & 255] << 8) ^
                        f[255 & y] ^
                        e[++S])
            }
            function d(e) {
                var t,
                    r = 'AES-' + ((e = e || {}).mode || 'CBC').toUpperCase(),
                    a = (t = e.decrypt ? n.cipher.createDecipher(r, e.key) : n.cipher.createCipher(r, e.key)).start
                return (
                    (t.start = function (e, r) {
                        var i = null
                        r instanceof n.util.ByteBuffer && ((i = r), (r = {})),
                            ((r = r || {}).output = i),
                            (r.iv = e),
                            a.call(t, r)
                    }),
                    t
                )
            }
        },
        function (e, t, r) {
            var n = r(0)
            n.pki = n.pki || {}
            var a = (e.exports = n.pki.oids = n.oids = n.oids || {})
            function i(e, t) {
                ;(a[e] = t), (a[t] = e)
            }
            function s(e, t) {
                a[e] = t
            }
            i('1.2.840.113549.1.1.1', 'rsaEncryption'),
                i('1.2.840.113549.1.1.4', 'md5WithRSAEncryption'),
                i('1.2.840.113549.1.1.5', 'sha1WithRSAEncryption'),
                i('1.2.840.113549.1.1.7', 'RSAES-OAEP'),
                i('1.2.840.113549.1.1.8', 'mgf1'),
                i('1.2.840.113549.1.1.9', 'pSpecified'),
                i('1.2.840.113549.1.1.10', 'RSASSA-PSS'),
                i('1.2.840.113549.1.1.11', 'sha256WithRSAEncryption'),
                i('1.2.840.113549.1.1.12', 'sha384WithRSAEncryption'),
                i('1.2.840.113549.1.1.13', 'sha512WithRSAEncryption'),
                i('1.3.101.112', 'EdDSA25519'),
                i('1.2.840.10040.4.3', 'dsa-with-sha1'),
                i('1.3.14.3.2.7', 'desCBC'),
                i('1.3.14.3.2.26', 'sha1'),
                i('1.3.14.3.2.29', 'sha1WithRSASignature'),
                i('2.16.840.1.101.3.4.2.1', 'sha256'),
                i('2.16.840.1.101.3.4.2.2', 'sha384'),
                i('2.16.840.1.101.3.4.2.3', 'sha512'),
                i('2.16.840.1.101.3.4.2.4', 'sha224'),
                i('2.16.840.1.101.3.4.2.5', 'sha512-224'),
                i('2.16.840.1.101.3.4.2.6', 'sha512-256'),
                i('1.2.840.113549.2.2', 'md2'),
                i('1.2.840.113549.2.5', 'md5'),
                i('1.2.840.113549.1.7.1', 'data'),
                i('1.2.840.113549.1.7.2', 'signedData'),
                i('1.2.840.113549.1.7.3', 'envelopedData'),
                i('1.2.840.113549.1.7.4', 'signedAndEnvelopedData'),
                i('1.2.840.113549.1.7.5', 'digestedData'),
                i('1.2.840.113549.1.7.6', 'encryptedData'),
                i('1.2.840.113549.1.9.1', 'emailAddress'),
                i('1.2.840.113549.1.9.2', 'unstructuredName'),
                i('1.2.840.113549.1.9.3', 'contentType'),
                i('1.2.840.113549.1.9.4', 'messageDigest'),
                i('1.2.840.113549.1.9.5', 'signingTime'),
                i('1.2.840.113549.1.9.6', 'counterSignature'),
                i('1.2.840.113549.1.9.7', 'challengePassword'),
                i('1.2.840.113549.1.9.8', 'unstructuredAddress'),
                i('1.2.840.113549.1.9.14', 'extensionRequest'),
                i('1.2.840.113549.1.9.20', 'friendlyName'),
                i('1.2.840.113549.1.9.21', 'localKeyId'),
                i('1.2.840.113549.1.9.22.1', 'x509Certificate'),
                i('1.2.840.113549.1.12.10.1.1', 'keyBag'),
                i('1.2.840.113549.1.12.10.1.2', 'pkcs8ShroudedKeyBag'),
                i('1.2.840.113549.1.12.10.1.3', 'certBag'),
                i('1.2.840.113549.1.12.10.1.4', 'crlBag'),
                i('1.2.840.113549.1.12.10.1.5', 'secretBag'),
                i('1.2.840.113549.1.12.10.1.6', 'safeContentsBag'),
                i('1.2.840.113549.1.5.13', 'pkcs5PBES2'),
                i('1.2.840.113549.1.5.12', 'pkcs5PBKDF2'),
                i('1.2.840.113549.1.12.1.1', 'pbeWithSHAAnd128BitRC4'),
                i('1.2.840.113549.1.12.1.2', 'pbeWithSHAAnd40BitRC4'),
                i('1.2.840.113549.1.12.1.3', 'pbeWithSHAAnd3-KeyTripleDES-CBC'),
                i('1.2.840.113549.1.12.1.4', 'pbeWithSHAAnd2-KeyTripleDES-CBC'),
                i('1.2.840.113549.1.12.1.5', 'pbeWithSHAAnd128BitRC2-CBC'),
                i('1.2.840.113549.1.12.1.6', 'pbewithSHAAnd40BitRC2-CBC'),
                i('1.2.840.113549.2.7', 'hmacWithSHA1'),
                i('1.2.840.113549.2.8', 'hmacWithSHA224'),
                i('1.2.840.113549.2.9', 'hmacWithSHA256'),
                i('1.2.840.113549.2.10', 'hmacWithSHA384'),
                i('1.2.840.113549.2.11', 'hmacWithSHA512'),
                i('1.2.840.113549.3.7', 'des-EDE3-CBC'),
                i('2.16.840.1.101.3.4.1.2', 'aes128-CBC'),
                i('2.16.840.1.101.3.4.1.22', 'aes192-CBC'),
                i('2.16.840.1.101.3.4.1.42', 'aes256-CBC'),
                i('2.5.4.3', 'commonName'),
                i('2.5.4.4', 'surname'),
                i('2.5.4.5', 'serialNumber'),
                i('2.5.4.6', 'countryName'),
                i('2.5.4.7', 'localityName'),
                i('2.5.4.8', 'stateOrProvinceName'),
                i('2.5.4.9', 'streetAddress'),
                i('2.5.4.10', 'organizationName'),
                i('2.5.4.11', 'organizationalUnitName'),
                i('2.5.4.12', 'title'),
                i('2.5.4.13', 'description'),
                i('2.5.4.15', 'businessCategory'),
                i('2.5.4.17', 'postalCode'),
                i('2.5.4.42', 'givenName'),
                i('1.3.6.1.4.1.311.60.2.1.2', 'jurisdictionOfIncorporationStateOrProvinceName'),
                i('1.3.6.1.4.1.311.60.2.1.3', 'jurisdictionOfIncorporationCountryName'),
                i('2.16.840.1.113730.1.1', 'nsCertType'),
                i('2.16.840.1.113730.1.13', 'nsComment'),
                s('2.5.29.1', 'authorityKeyIdentifier'),
                s('2.5.29.2', 'keyAttributes'),
                s('2.5.29.3', 'certificatePolicies'),
                s('2.5.29.4', 'keyUsageRestriction'),
                s('2.5.29.5', 'policyMapping'),
                s('2.5.29.6', 'subtreesConstraint'),
                s('2.5.29.7', 'subjectAltName'),
                s('2.5.29.8', 'issuerAltName'),
                s('2.5.29.9', 'subjectDirectoryAttributes'),
                s('2.5.29.10', 'basicConstraints'),
                s('2.5.29.11', 'nameConstraints'),
                s('2.5.29.12', 'policyConstraints'),
                s('2.5.29.13', 'basicConstraints'),
                i('2.5.29.14', 'subjectKeyIdentifier'),
                i('2.5.29.15', 'keyUsage'),
                s('2.5.29.16', 'privateKeyUsagePeriod'),
                i('2.5.29.17', 'subjectAltName'),
                i('2.5.29.18', 'issuerAltName'),
                i('2.5.29.19', 'basicConstraints'),
                s('2.5.29.20', 'cRLNumber'),
                s('2.5.29.21', 'cRLReason'),
                s('2.5.29.22', 'expirationDate'),
                s('2.5.29.23', 'instructionCode'),
                s('2.5.29.24', 'invalidityDate'),
                s('2.5.29.25', 'cRLDistributionPoints'),
                s('2.5.29.26', 'issuingDistributionPoint'),
                s('2.5.29.27', 'deltaCRLIndicator'),
                s('2.5.29.28', 'issuingDistributionPoint'),
                s('2.5.29.29', 'certificateIssuer'),
                s('2.5.29.30', 'nameConstraints'),
                i('2.5.29.31', 'cRLDistributionPoints'),
                i('2.5.29.32', 'certificatePolicies'),
                s('2.5.29.33', 'policyMappings'),
                s('2.5.29.34', 'policyConstraints'),
                i('2.5.29.35', 'authorityKeyIdentifier'),
                s('2.5.29.36', 'policyConstraints'),
                i('2.5.29.37', 'extKeyUsage'),
                s('2.5.29.46', 'freshestCRL'),
                s('2.5.29.54', 'inhibitAnyPolicy'),
                i('1.3.6.1.4.1.11129.2.4.2', 'timestampList'),
                i('1.3.6.1.5.5.7.1.1', 'authorityInfoAccess'),
                i('1.3.6.1.5.5.7.3.1', 'serverAuth'),
                i('1.3.6.1.5.5.7.3.2', 'clientAuth'),
                i('1.3.6.1.5.5.7.3.3', 'codeSigning'),
                i('1.3.6.1.5.5.7.3.4', 'emailProtection'),
                i('1.3.6.1.5.5.7.3.8', 'timeStamping')
        },
        function (e, t, r) {
            var n = r(0)
            r(1)
            var a = (e.exports = n.pem = n.pem || {})
            function i(e) {
                for (
                    var t = e.name + ': ',
                        r = [],
                        n = function (e, t) {
                            return ' ' + t
                        },
                        a = 0;
                    a < e.values.length;
                    ++a
                )
                    r.push(e.values[a].replace(/^(\S+\r\n)/, n))
                t += r.join(',') + '\r\n'
                var i = 0,
                    s = -1
                for (a = 0; a < t.length; ++a, ++i)
                    if (i > 65 && -1 !== s) {
                        var o = t[s]
                        ',' === o
                            ? (++s, (t = t.substr(0, s) + '\r\n ' + t.substr(s)))
                            : (t = t.substr(0, s) + '\r\n' + o + t.substr(s + 1)),
                            (i = a - s - 1),
                            (s = -1),
                            ++a
                    } else (' ' !== t[a] && '\t' !== t[a] && ',' !== t[a]) || (s = a)
                return t
            }
            function s(e) {
                return e.replace(/^\s+/, '')
            }
            ;(a.encode = function (e, t) {
                t = t || {}
                var r,
                    a = '-----BEGIN ' + e.type + '-----\r\n'
                if (
                    (e.procType &&
                        (a += i((r = { name: 'Proc-Type', values: [String(e.procType.version), e.procType.type] }))),
                    e.contentDomain && (a += i((r = { name: 'Content-Domain', values: [e.contentDomain] }))),
                    e.dekInfo &&
                        ((r = { name: 'DEK-Info', values: [e.dekInfo.algorithm] }),
                        e.dekInfo.parameters && r.values.push(e.dekInfo.parameters),
                        (a += i(r))),
                    e.headers)
                )
                    for (var s = 0; s < e.headers.length; ++s) a += i(e.headers[s])
                return (
                    e.procType && (a += '\r\n'),
                    (a += n.util.encode64(e.body, t.maxline || 64) + '\r\n'),
                    (a += '-----END ' + e.type + '-----\r\n')
                )
            }),
                (a.decode = function (e) {
                    for (
                        var t,
                            r = [],
                            a =
                                /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g,
                            i = /([\x21-\x7e]+):\s*([\x21-\x7e\s^:]+)/,
                            o = /\r?\n/;
                        (t = a.exec(e));

                    ) {
                        var c = t[1]
                        'NEW CERTIFICATE REQUEST' === c && (c = 'CERTIFICATE REQUEST')
                        var u = {
                            type: c,
                            procType: null,
                            contentDomain: null,
                            dekInfo: null,
                            headers: [],
                            body: n.util.decode64(t[3]),
                        }
                        if ((r.push(u), t[2])) {
                            for (var l = t[2].split(o), p = 0; t && p < l.length; ) {
                                for (var f = l[p].replace(/\s+$/, ''), h = p + 1; h < l.length; ++h) {
                                    var d = l[h]
                                    if (!/\s/.test(d[0])) break
                                    ;(f += d), (p = h)
                                }
                                if ((t = f.match(i))) {
                                    for (
                                        var y = { name: t[1], values: [] }, g = t[2].split(','), v = 0;
                                        v < g.length;
                                        ++v
                                    )
                                        y.values.push(s(g[v]))
                                    if (u.procType)
                                        if (u.contentDomain || 'Content-Domain' !== y.name)
                                            if (u.dekInfo || 'DEK-Info' !== y.name) u.headers.push(y)
                                            else {
                                                if (0 === y.values.length)
                                                    throw new Error(
                                                        'Invalid PEM formatted message. The "DEK-Info" header must have at least one subfield.'
                                                    )
                                                u.dekInfo = { algorithm: g[0], parameters: g[1] || null }
                                            }
                                        else u.contentDomain = g[0] || ''
                                    else {
                                        if ('Proc-Type' !== y.name)
                                            throw new Error(
                                                'Invalid PEM formatted message. The first encapsulated header must be "Proc-Type".'
                                            )
                                        if (2 !== y.values.length)
                                            throw new Error(
                                                'Invalid PEM formatted message. The "Proc-Type" header must have two subfields.'
                                            )
                                        u.procType = { version: g[0], type: g[1] }
                                    }
                                }
                                ++p
                            }
                            if ('ENCRYPTED' === u.procType && !u.dekInfo)
                                throw new Error(
                                    'Invalid PEM formatted message. The "DEK-Info" header must be present if "Proc-Type" is "ENCRYPTED".'
                                )
                        }
                    }
                    if (0 === r.length) throw new Error('Invalid PEM formatted message.')
                    return r
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(4),
                r(1),
                ((e.exports = n.hmac = n.hmac || {}).create = function () {
                    var e = null,
                        t = null,
                        r = null,
                        a = null,
                        i = {
                            start: function (i, s) {
                                if (null !== i)
                                    if ('string' == typeof i) {
                                        if (!((i = i.toLowerCase()) in n.md.algorithms))
                                            throw new Error('Unknown hash algorithm "' + i + '"')
                                        t = n.md.algorithms[i].create()
                                    } else t = i
                                if (null === s) s = e
                                else {
                                    if ('string' == typeof s) s = n.util.createBuffer(s)
                                    else if (n.util.isArray(s)) {
                                        var o = s
                                        s = n.util.createBuffer()
                                        for (var c = 0; c < o.length; ++c) s.putByte(o[c])
                                    }
                                    var u = s.length()
                                    u > t.blockLength && (t.start(), t.update(s.bytes()), (s = t.digest())),
                                        (r = n.util.createBuffer()),
                                        (a = n.util.createBuffer()),
                                        (u = s.length())
                                    for (c = 0; c < u; ++c) {
                                        o = s.at(c)
                                        r.putByte(54 ^ o), a.putByte(92 ^ o)
                                    }
                                    if (u < t.blockLength)
                                        for (o = t.blockLength - u, c = 0; c < o; ++c) r.putByte(54), a.putByte(92)
                                    ;(e = s), (r = r.bytes()), (a = a.bytes())
                                }
                                t.start(), t.update(r)
                            },
                            update: function (e) {
                                t.update(e)
                            },
                            getMac: function () {
                                var e = t.digest().bytes()
                                return t.start(), t.update(a), t.update(e), t.digest()
                            },
                        }
                    return (i.digest = i.getMac), i
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(4), r(1)
            var a = (e.exports = n.sha1 = n.sha1 || {})
            ;(n.md.sha1 = n.md.algorithms.sha1 = a),
                (a.create = function () {
                    s ||
                        ((i = String.fromCharCode(128)), (i += n.util.fillString(String.fromCharCode(0), 64)), (s = !0))
                    var e = null,
                        t = n.util.createBuffer(),
                        r = new Array(80),
                        a = {
                            algorithm: 'sha1',
                            blockLength: 64,
                            digestLength: 20,
                            messageLength: 0,
                            fullMessageLength: null,
                            messageLengthSize: 8,
                            start: function () {
                                ;(a.messageLength = 0), (a.fullMessageLength = a.messageLength64 = [])
                                for (var r = a.messageLengthSize / 4, i = 0; i < r; ++i) a.fullMessageLength.push(0)
                                return (
                                    (t = n.util.createBuffer()),
                                    (e = {
                                        h0: 1732584193,
                                        h1: 4023233417,
                                        h2: 2562383102,
                                        h3: 271733878,
                                        h4: 3285377520,
                                    }),
                                    a
                                )
                            },
                        }
                    return (
                        a.start(),
                        (a.update = function (i, s) {
                            'utf8' === s && (i = n.util.encodeUtf8(i))
                            var c = i.length
                            ;(a.messageLength += c), (c = [(c / 4294967296) >>> 0, c >>> 0])
                            for (var u = a.fullMessageLength.length - 1; u >= 0; --u)
                                (a.fullMessageLength[u] += c[1]),
                                    (c[1] = c[0] + ((a.fullMessageLength[u] / 4294967296) >>> 0)),
                                    (a.fullMessageLength[u] = a.fullMessageLength[u] >>> 0),
                                    (c[0] = (c[1] / 4294967296) >>> 0)
                            return t.putBytes(i), o(e, r, t), (t.read > 2048 || 0 === t.length()) && t.compact(), a
                        }),
                        (a.digest = function () {
                            var s = n.util.createBuffer()
                            s.putBytes(t.bytes())
                            var c,
                                u =
                                    (a.fullMessageLength[a.fullMessageLength.length - 1] + a.messageLengthSize) &
                                    (a.blockLength - 1)
                            s.putBytes(i.substr(0, a.blockLength - u))
                            for (var l = 8 * a.fullMessageLength[0], p = 0; p < a.fullMessageLength.length - 1; ++p)
                                (l += ((c = 8 * a.fullMessageLength[p + 1]) / 4294967296) >>> 0),
                                    s.putInt32(l >>> 0),
                                    (l = c >>> 0)
                            s.putInt32(l)
                            var f = { h0: e.h0, h1: e.h1, h2: e.h2, h3: e.h3, h4: e.h4 }
                            o(f, r, s)
                            var h = n.util.createBuffer()
                            return (
                                h.putInt32(f.h0),
                                h.putInt32(f.h1),
                                h.putInt32(f.h2),
                                h.putInt32(f.h3),
                                h.putInt32(f.h4),
                                h
                            )
                        }),
                        a
                    )
                })
            var i = null,
                s = !1
            function o(e, t, r) {
                for (var n, a, i, s, o, c, u, l = r.length(); l >= 64; ) {
                    for (a = e.h0, i = e.h1, s = e.h2, o = e.h3, c = e.h4, u = 0; u < 16; ++u)
                        (n = r.getInt32()),
                            (t[u] = n),
                            (n = ((a << 5) | (a >>> 27)) + (o ^ (i & (s ^ o))) + c + 1518500249 + n),
                            (c = o),
                            (o = s),
                            (s = ((i << 30) | (i >>> 2)) >>> 0),
                            (i = a),
                            (a = n)
                    for (; u < 20; ++u)
                        (n = ((n = t[u - 3] ^ t[u - 8] ^ t[u - 14] ^ t[u - 16]) << 1) | (n >>> 31)),
                            (t[u] = n),
                            (n = ((a << 5) | (a >>> 27)) + (o ^ (i & (s ^ o))) + c + 1518500249 + n),
                            (c = o),
                            (o = s),
                            (s = ((i << 30) | (i >>> 2)) >>> 0),
                            (i = a),
                            (a = n)
                    for (; u < 32; ++u)
                        (n = ((n = t[u - 3] ^ t[u - 8] ^ t[u - 14] ^ t[u - 16]) << 1) | (n >>> 31)),
                            (t[u] = n),
                            (n = ((a << 5) | (a >>> 27)) + (i ^ s ^ o) + c + 1859775393 + n),
                            (c = o),
                            (o = s),
                            (s = ((i << 30) | (i >>> 2)) >>> 0),
                            (i = a),
                            (a = n)
                    for (; u < 40; ++u)
                        (n = ((n = t[u - 6] ^ t[u - 16] ^ t[u - 28] ^ t[u - 32]) << 2) | (n >>> 30)),
                            (t[u] = n),
                            (n = ((a << 5) | (a >>> 27)) + (i ^ s ^ o) + c + 1859775393 + n),
                            (c = o),
                            (o = s),
                            (s = ((i << 30) | (i >>> 2)) >>> 0),
                            (i = a),
                            (a = n)
                    for (; u < 60; ++u)
                        (n = ((n = t[u - 6] ^ t[u - 16] ^ t[u - 28] ^ t[u - 32]) << 2) | (n >>> 30)),
                            (t[u] = n),
                            (n = ((a << 5) | (a >>> 27)) + ((i & s) | (o & (i ^ s))) + c + 2400959708 + n),
                            (c = o),
                            (o = s),
                            (s = ((i << 30) | (i >>> 2)) >>> 0),
                            (i = a),
                            (a = n)
                    for (; u < 80; ++u)
                        (n = ((n = t[u - 6] ^ t[u - 16] ^ t[u - 28] ^ t[u - 32]) << 2) | (n >>> 30)),
                            (t[u] = n),
                            (n = ((a << 5) | (a >>> 27)) + (i ^ s ^ o) + c + 3395469782 + n),
                            (c = o),
                            (o = s),
                            (s = ((i << 30) | (i >>> 2)) >>> 0),
                            (i = a),
                            (a = n)
                    ;(e.h0 = (e.h0 + a) | 0),
                        (e.h1 = (e.h1 + i) | 0),
                        (e.h2 = (e.h2 + s) | 0),
                        (e.h3 = (e.h3 + o) | 0),
                        (e.h4 = (e.h4 + c) | 0),
                        (l -= 64)
                }
            }
        },
        function (e, t, r) {
            var n = r(0)
            r(3), r(8), r(15), r(7), r(21), r(2), r(9), r(1)
            var a = function (e, t, r, a) {
                    var i = n.util.createBuffer(),
                        s = e.length >> 1,
                        o = s + (1 & e.length),
                        c = e.substr(0, o),
                        u = e.substr(s, o),
                        l = n.util.createBuffer(),
                        p = n.hmac.create()
                    r = t + r
                    var f = Math.ceil(a / 16),
                        h = Math.ceil(a / 20)
                    p.start('MD5', c)
                    var d = n.util.createBuffer()
                    l.putBytes(r)
                    for (var y = 0; y < f; ++y)
                        p.start(null, null),
                            p.update(l.getBytes()),
                            l.putBuffer(p.digest()),
                            p.start(null, null),
                            p.update(l.bytes() + r),
                            d.putBuffer(p.digest())
                    p.start('SHA1', u)
                    var g = n.util.createBuffer()
                    l.clear(), l.putBytes(r)
                    for (y = 0; y < h; ++y)
                        p.start(null, null),
                            p.update(l.getBytes()),
                            l.putBuffer(p.digest()),
                            p.start(null, null),
                            p.update(l.bytes() + r),
                            g.putBuffer(p.digest())
                    return i.putBytes(n.util.xorBytes(d.getBytes(), g.getBytes(), a)), i
                },
                i = function (e, t, r) {
                    var a = !1
                    try {
                        var i = e.deflate(t.fragment.getBytes())
                        ;(t.fragment = n.util.createBuffer(i)), (t.length = i.length), (a = !0)
                    } catch (e) {}
                    return a
                },
                s = function (e, t, r) {
                    var a = !1
                    try {
                        var i = e.inflate(t.fragment.getBytes())
                        ;(t.fragment = n.util.createBuffer(i)), (t.length = i.length), (a = !0)
                    } catch (e) {}
                    return a
                },
                o = function (e, t) {
                    var r = 0
                    switch (t) {
                        case 1:
                            r = e.getByte()
                            break
                        case 2:
                            r = e.getInt16()
                            break
                        case 3:
                            r = e.getInt24()
                            break
                        case 4:
                            r = e.getInt32()
                    }
                    return n.util.createBuffer(e.getBytes(r))
                },
                c = function (e, t, r) {
                    e.putInt(r.length(), t << 3), e.putBuffer(r)
                },
                u = {
                    Versions: {
                        TLS_1_0: { major: 3, minor: 1 },
                        TLS_1_1: { major: 3, minor: 2 },
                        TLS_1_2: { major: 3, minor: 3 },
                    },
                }
            ;(u.SupportedVersions = [u.Versions.TLS_1_1, u.Versions.TLS_1_0]),
                (u.Version = u.SupportedVersions[0]),
                (u.MaxFragment = 15360),
                (u.ConnectionEnd = { server: 0, client: 1 }),
                (u.PRFAlgorithm = { tls_prf_sha256: 0 }),
                (u.BulkCipherAlgorithm = { none: null, rc4: 0, des3: 1, aes: 2 }),
                (u.CipherType = { stream: 0, block: 1, aead: 2 }),
                (u.MACAlgorithm = {
                    none: null,
                    hmac_md5: 0,
                    hmac_sha1: 1,
                    hmac_sha256: 2,
                    hmac_sha384: 3,
                    hmac_sha512: 4,
                }),
                (u.CompressionMethod = { none: 0, deflate: 1 }),
                (u.ContentType = {
                    change_cipher_spec: 20,
                    alert: 21,
                    handshake: 22,
                    application_data: 23,
                    heartbeat: 24,
                }),
                (u.HandshakeType = {
                    hello_request: 0,
                    client_hello: 1,
                    server_hello: 2,
                    certificate: 11,
                    server_key_exchange: 12,
                    certificate_request: 13,
                    server_hello_done: 14,
                    certificate_verify: 15,
                    client_key_exchange: 16,
                    finished: 20,
                }),
                (u.Alert = {}),
                (u.Alert.Level = { warning: 1, fatal: 2 }),
                (u.Alert.Description = {
                    close_notify: 0,
                    unexpected_message: 10,
                    bad_record_mac: 20,
                    decryption_failed: 21,
                    record_overflow: 22,
                    decompression_failure: 30,
                    handshake_failure: 40,
                    bad_certificate: 42,
                    unsupported_certificate: 43,
                    certificate_revoked: 44,
                    certificate_expired: 45,
                    certificate_unknown: 46,
                    illegal_parameter: 47,
                    unknown_ca: 48,
                    access_denied: 49,
                    decode_error: 50,
                    decrypt_error: 51,
                    export_restriction: 60,
                    protocol_version: 70,
                    insufficient_security: 71,
                    internal_error: 80,
                    user_canceled: 90,
                    no_renegotiation: 100,
                }),
                (u.HeartbeatMessageType = { heartbeat_request: 1, heartbeat_response: 2 }),
                (u.CipherSuites = {}),
                (u.getCipherSuite = function (e) {
                    var t = null
                    for (var r in u.CipherSuites) {
                        var n = u.CipherSuites[r]
                        if (n.id[0] === e.charCodeAt(0) && n.id[1] === e.charCodeAt(1)) {
                            t = n
                            break
                        }
                    }
                    return t
                }),
                (u.handleUnexpected = function (e, t) {
                    ;(!e.open && e.entity === u.ConnectionEnd.client) ||
                        e.error(e, {
                            message: 'Unexpected message. Received TLS record out of order.',
                            send: !0,
                            alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.unexpected_message },
                        })
                }),
                (u.handleHelloRequest = function (e, t, r) {
                    !e.handshaking &&
                        e.handshakes > 0 &&
                        (u.queue(
                            e,
                            u.createAlert(e, {
                                level: u.Alert.Level.warning,
                                description: u.Alert.Description.no_renegotiation,
                            })
                        ),
                        u.flush(e)),
                        e.process()
                }),
                (u.parseHelloMessage = function (e, t, r) {
                    var a = null,
                        i = e.entity === u.ConnectionEnd.client
                    if (r < 38)
                        e.error(e, {
                            message: i
                                ? 'Invalid ServerHello message. Message too short.'
                                : 'Invalid ClientHello message. Message too short.',
                            send: !0,
                            alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.illegal_parameter },
                        })
                    else {
                        var s = t.fragment,
                            c = s.length()
                        if (
                            ((a = {
                                version: { major: s.getByte(), minor: s.getByte() },
                                random: n.util.createBuffer(s.getBytes(32)),
                                session_id: o(s, 1),
                                extensions: [],
                            }),
                            i
                                ? ((a.cipher_suite = s.getBytes(2)), (a.compression_method = s.getByte()))
                                : ((a.cipher_suites = o(s, 2)), (a.compression_methods = o(s, 1))),
                            (c = r - (c - s.length())) > 0)
                        ) {
                            for (var l = o(s, 2); l.length() > 0; )
                                a.extensions.push({ type: [l.getByte(), l.getByte()], data: o(l, 2) })
                            if (!i)
                                for (var p = 0; p < a.extensions.length; ++p) {
                                    var f = a.extensions[p]
                                    if (0 === f.type[0] && 0 === f.type[1])
                                        for (var h = o(f.data, 2); h.length() > 0; ) {
                                            if (0 !== h.getByte()) break
                                            e.session.extensions.server_name.serverNameList.push(o(h, 2).getBytes())
                                        }
                                }
                        }
                        if (
                            e.session.version &&
                            (a.version.major !== e.session.version.major || a.version.minor !== e.session.version.minor)
                        )
                            return e.error(e, {
                                message: 'TLS version change is disallowed during renegotiation.',
                                send: !0,
                                alert: {
                                    level: u.Alert.Level.fatal,
                                    description: u.Alert.Description.protocol_version,
                                },
                            })
                        if (i) e.session.cipherSuite = u.getCipherSuite(a.cipher_suite)
                        else
                            for (
                                var d = n.util.createBuffer(a.cipher_suites.bytes());
                                d.length() > 0 &&
                                ((e.session.cipherSuite = u.getCipherSuite(d.getBytes(2))),
                                null === e.session.cipherSuite);

                            );
                        if (null === e.session.cipherSuite)
                            return e.error(e, {
                                message: 'No cipher suites in common.',
                                send: !0,
                                alert: {
                                    level: u.Alert.Level.fatal,
                                    description: u.Alert.Description.handshake_failure,
                                },
                                cipherSuite: n.util.bytesToHex(a.cipher_suite),
                            })
                        e.session.compressionMethod = i ? a.compression_method : u.CompressionMethod.none
                    }
                    return a
                }),
                (u.createSecurityParameters = function (e, t) {
                    var r = e.entity === u.ConnectionEnd.client,
                        n = t.random.bytes(),
                        a = r ? e.session.sp.client_random : n,
                        i = r ? n : u.createRandom().getBytes()
                    e.session.sp = {
                        entity: e.entity,
                        prf_algorithm: u.PRFAlgorithm.tls_prf_sha256,
                        bulk_cipher_algorithm: null,
                        cipher_type: null,
                        enc_key_length: null,
                        block_length: null,
                        fixed_iv_length: null,
                        record_iv_length: null,
                        mac_algorithm: null,
                        mac_length: null,
                        mac_key_length: null,
                        compression_algorithm: e.session.compressionMethod,
                        pre_master_secret: null,
                        master_secret: null,
                        client_random: a,
                        server_random: i,
                    }
                }),
                (u.handleServerHello = function (e, t, r) {
                    var n = u.parseHelloMessage(e, t, r)
                    if (!e.fail) {
                        if (!(n.version.minor <= e.version.minor))
                            return e.error(e, {
                                message: 'Incompatible TLS version.',
                                send: !0,
                                alert: {
                                    level: u.Alert.Level.fatal,
                                    description: u.Alert.Description.protocol_version,
                                },
                            })
                        ;(e.version.minor = n.version.minor), (e.session.version = e.version)
                        var a = n.session_id.bytes()
                        a.length > 0 && a === e.session.id
                            ? ((e.expect = d),
                              (e.session.resuming = !0),
                              (e.session.sp.server_random = n.random.bytes()))
                            : ((e.expect = l), (e.session.resuming = !1), u.createSecurityParameters(e, n)),
                            (e.session.id = a),
                            e.process()
                    }
                }),
                (u.handleClientHello = function (e, t, r) {
                    var a = u.parseHelloMessage(e, t, r)
                    if (!e.fail) {
                        var i = a.session_id.bytes(),
                            s = null
                        if (
                            (e.sessionCache &&
                                (null === (s = e.sessionCache.getSession(i))
                                    ? (i = '')
                                    : (s.version.major !== a.version.major || s.version.minor > a.version.minor) &&
                                      ((s = null), (i = ''))),
                            0 === i.length && (i = n.random.getBytes(32)),
                            (e.session.id = i),
                            (e.session.clientHelloVersion = a.version),
                            (e.session.sp = {}),
                            s)
                        )
                            (e.version = e.session.version = s.version), (e.session.sp = s.sp)
                        else {
                            for (
                                var o, c = 1;
                                c < u.SupportedVersions.length &&
                                !((o = u.SupportedVersions[c]).minor <= a.version.minor);
                                ++c
                            );
                            ;(e.version = { major: o.major, minor: o.minor }), (e.session.version = e.version)
                        }
                        null !== s
                            ? ((e.expect = S),
                              (e.session.resuming = !0),
                              (e.session.sp.client_random = a.random.bytes()))
                            : ((e.expect = !1 !== e.verifyClient ? m : C),
                              (e.session.resuming = !1),
                              u.createSecurityParameters(e, a)),
                            (e.open = !0),
                            u.queue(
                                e,
                                u.createRecord(e, { type: u.ContentType.handshake, data: u.createServerHello(e) })
                            ),
                            e.session.resuming
                                ? (u.queue(
                                      e,
                                      u.createRecord(e, {
                                          type: u.ContentType.change_cipher_spec,
                                          data: u.createChangeCipherSpec(),
                                      })
                                  ),
                                  (e.state.pending = u.createConnectionState(e)),
                                  (e.state.current.write = e.state.pending.write),
                                  u.queue(
                                      e,
                                      u.createRecord(e, { type: u.ContentType.handshake, data: u.createFinished(e) })
                                  ))
                                : (u.queue(
                                      e,
                                      u.createRecord(e, { type: u.ContentType.handshake, data: u.createCertificate(e) })
                                  ),
                                  e.fail ||
                                      (u.queue(
                                          e,
                                          u.createRecord(e, {
                                              type: u.ContentType.handshake,
                                              data: u.createServerKeyExchange(e),
                                          })
                                      ),
                                      !1 !== e.verifyClient &&
                                          u.queue(
                                              e,
                                              u.createRecord(e, {
                                                  type: u.ContentType.handshake,
                                                  data: u.createCertificateRequest(e),
                                              })
                                          ),
                                      u.queue(
                                          e,
                                          u.createRecord(e, {
                                              type: u.ContentType.handshake,
                                              data: u.createServerHelloDone(e),
                                          })
                                      ))),
                            u.flush(e),
                            e.process()
                    }
                }),
                (u.handleCertificate = function (e, t, r) {
                    if (r < 3)
                        return e.error(e, {
                            message: 'Invalid Certificate message. Message too short.',
                            send: !0,
                            alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.illegal_parameter },
                        })
                    var a,
                        i,
                        s = t.fragment,
                        c = { certificate_list: o(s, 3) },
                        l = []
                    try {
                        for (; c.certificate_list.length() > 0; )
                            (a = o(c.certificate_list, 3)),
                                (i = n.asn1.fromDer(a)),
                                (a = n.pki.certificateFromAsn1(i, !0)),
                                l.push(a)
                    } catch (t) {
                        return e.error(e, {
                            message: 'Could not parse certificate list.',
                            cause: t,
                            send: !0,
                            alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.bad_certificate },
                        })
                    }
                    var f = e.entity === u.ConnectionEnd.client
                    ;(!f && !0 !== e.verifyClient) || 0 !== l.length
                        ? 0 === l.length
                            ? (e.expect = f ? p : C)
                            : (f ? (e.session.serverCertificate = l[0]) : (e.session.clientCertificate = l[0]),
                              u.verifyCertificateChain(e, l) && (e.expect = f ? p : C))
                        : e.error(e, {
                              message: f ? 'No server certificate provided.' : 'No client certificate provided.',
                              send: !0,
                              alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.illegal_parameter },
                          }),
                        e.process()
                }),
                (u.handleServerKeyExchange = function (e, t, r) {
                    if (r > 0)
                        return e.error(e, {
                            message: 'Invalid key parameters. Only RSA is supported.',
                            send: !0,
                            alert: {
                                level: u.Alert.Level.fatal,
                                description: u.Alert.Description.unsupported_certificate,
                            },
                        })
                    ;(e.expect = f), e.process()
                }),
                (u.handleClientKeyExchange = function (e, t, r) {
                    if (r < 48)
                        return e.error(e, {
                            message: 'Invalid key parameters. Only RSA is supported.',
                            send: !0,
                            alert: {
                                level: u.Alert.Level.fatal,
                                description: u.Alert.Description.unsupported_certificate,
                            },
                        })
                    var a = t.fragment,
                        i = { enc_pre_master_secret: o(a, 2).getBytes() },
                        s = null
                    if (e.getPrivateKey)
                        try {
                            ;(s = e.getPrivateKey(e, e.session.serverCertificate)), (s = n.pki.privateKeyFromPem(s))
                        } catch (t) {
                            e.error(e, {
                                message: 'Could not get private key.',
                                cause: t,
                                send: !0,
                                alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.internal_error },
                            })
                        }
                    if (null === s)
                        return e.error(e, {
                            message: 'No private key set.',
                            send: !0,
                            alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.internal_error },
                        })
                    try {
                        var c = e.session.sp
                        c.pre_master_secret = s.decrypt(i.enc_pre_master_secret)
                        var l = e.session.clientHelloVersion
                        if (
                            l.major !== c.pre_master_secret.charCodeAt(0) ||
                            l.minor !== c.pre_master_secret.charCodeAt(1)
                        )
                            throw new Error('TLS version rollback attack detected.')
                    } catch (e) {
                        c.pre_master_secret = n.random.getBytes(48)
                    }
                    ;(e.expect = S), null !== e.session.clientCertificate && (e.expect = E), e.process()
                }),
                (u.handleCertificateRequest = function (e, t, r) {
                    if (r < 3)
                        return e.error(e, {
                            message: 'Invalid CertificateRequest. Message too short.',
                            send: !0,
                            alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.illegal_parameter },
                        })
                    var n = t.fragment,
                        a = { certificate_types: o(n, 1), certificate_authorities: o(n, 2) }
                    ;(e.session.certificateRequest = a), (e.expect = h), e.process()
                }),
                (u.handleCertificateVerify = function (e, t, r) {
                    if (r < 2)
                        return e.error(e, {
                            message: 'Invalid CertificateVerify. Message too short.',
                            send: !0,
                            alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.illegal_parameter },
                        })
                    var a = t.fragment
                    a.read -= 4
                    var i = a.bytes()
                    a.read += 4
                    var s = { signature: o(a, 2).getBytes() },
                        c = n.util.createBuffer()
                    c.putBuffer(e.session.md5.digest()), c.putBuffer(e.session.sha1.digest()), (c = c.getBytes())
                    try {
                        if (!e.session.clientCertificate.publicKey.verify(c, s.signature, 'NONE'))
                            throw new Error('CertificateVerify signature does not match.')
                        e.session.md5.update(i), e.session.sha1.update(i)
                    } catch (t) {
                        return e.error(e, {
                            message: 'Bad signature in CertificateVerify.',
                            send: !0,
                            alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.handshake_failure },
                        })
                    }
                    ;(e.expect = S), e.process()
                }),
                (u.handleServerHelloDone = function (e, t, r) {
                    if (r > 0)
                        return e.error(e, {
                            message: 'Invalid ServerHelloDone message. Invalid length.',
                            send: !0,
                            alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.record_overflow },
                        })
                    if (null === e.serverCertificate) {
                        var a = {
                                message: 'No server certificate provided. Not enough security.',
                                send: !0,
                                alert: {
                                    level: u.Alert.Level.fatal,
                                    description: u.Alert.Description.insufficient_security,
                                },
                            },
                            i = e.verify(e, a.alert.description, 0, [])
                        if (!0 !== i)
                            return (
                                (i || 0 === i) &&
                                    ('object' != typeof i || n.util.isArray(i)
                                        ? 'number' == typeof i && (a.alert.description = i)
                                        : (i.message && (a.message = i.message),
                                          i.alert && (a.alert.description = i.alert))),
                                e.error(e, a)
                            )
                    }
                    null !== e.session.certificateRequest &&
                        ((t = u.createRecord(e, { type: u.ContentType.handshake, data: u.createCertificate(e) })),
                        u.queue(e, t)),
                        (t = u.createRecord(e, { type: u.ContentType.handshake, data: u.createClientKeyExchange(e) })),
                        u.queue(e, t),
                        (e.expect = v)
                    var s = function (e, t) {
                        null !== e.session.certificateRequest &&
                            null !== e.session.clientCertificate &&
                            u.queue(
                                e,
                                u.createRecord(e, {
                                    type: u.ContentType.handshake,
                                    data: u.createCertificateVerify(e, t),
                                })
                            ),
                            u.queue(
                                e,
                                u.createRecord(e, {
                                    type: u.ContentType.change_cipher_spec,
                                    data: u.createChangeCipherSpec(),
                                })
                            ),
                            (e.state.pending = u.createConnectionState(e)),
                            (e.state.current.write = e.state.pending.write),
                            u.queue(e, u.createRecord(e, { type: u.ContentType.handshake, data: u.createFinished(e) })),
                            (e.expect = d),
                            u.flush(e),
                            e.process()
                    }
                    if (null === e.session.certificateRequest || null === e.session.clientCertificate) return s(e, null)
                    u.getClientSignature(e, s)
                }),
                (u.handleChangeCipherSpec = function (e, t) {
                    if (1 !== t.fragment.getByte())
                        return e.error(e, {
                            message: 'Invalid ChangeCipherSpec message received.',
                            send: !0,
                            alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.illegal_parameter },
                        })
                    var r = e.entity === u.ConnectionEnd.client
                    ;((e.session.resuming && r) || (!e.session.resuming && !r)) &&
                        (e.state.pending = u.createConnectionState(e)),
                        (e.state.current.read = e.state.pending.read),
                        ((!e.session.resuming && r) || (e.session.resuming && !r)) && (e.state.pending = null),
                        (e.expect = r ? y : T),
                        e.process()
                }),
                (u.handleFinished = function (e, t, r) {
                    var i = t.fragment
                    i.read -= 4
                    var s = i.bytes()
                    i.read += 4
                    var o = t.fragment.getBytes()
                    ;(i = n.util.createBuffer()).putBuffer(e.session.md5.digest()), i.putBuffer(e.session.sha1.digest())
                    var c = e.entity === u.ConnectionEnd.client,
                        l = c ? 'server finished' : 'client finished',
                        p = e.session.sp
                    if ((i = a(p.master_secret, l, i.getBytes(), 12)).getBytes() !== o)
                        return e.error(e, {
                            message: 'Invalid verify_data in Finished message.',
                            send: !0,
                            alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.decrypt_error },
                        })
                    e.session.md5.update(s),
                        e.session.sha1.update(s),
                        ((e.session.resuming && c) || (!e.session.resuming && !c)) &&
                            (u.queue(
                                e,
                                u.createRecord(e, {
                                    type: u.ContentType.change_cipher_spec,
                                    data: u.createChangeCipherSpec(),
                                })
                            ),
                            (e.state.current.write = e.state.pending.write),
                            (e.state.pending = null),
                            u.queue(
                                e,
                                u.createRecord(e, { type: u.ContentType.handshake, data: u.createFinished(e) })
                            )),
                        (e.expect = c ? g : I),
                        (e.handshaking = !1),
                        ++e.handshakes,
                        (e.peerCertificate = c ? e.session.serverCertificate : e.session.clientCertificate),
                        u.flush(e),
                        (e.isConnected = !0),
                        e.connected(e),
                        e.process()
                }),
                (u.handleAlert = function (e, t) {
                    var r,
                        n = t.fragment,
                        a = { level: n.getByte(), description: n.getByte() }
                    switch (a.description) {
                        case u.Alert.Description.close_notify:
                            r = 'Connection closed.'
                            break
                        case u.Alert.Description.unexpected_message:
                            r = 'Unexpected message.'
                            break
                        case u.Alert.Description.bad_record_mac:
                            r = 'Bad record MAC.'
                            break
                        case u.Alert.Description.decryption_failed:
                            r = 'Decryption failed.'
                            break
                        case u.Alert.Description.record_overflow:
                            r = 'Record overflow.'
                            break
                        case u.Alert.Description.decompression_failure:
                            r = 'Decompression failed.'
                            break
                        case u.Alert.Description.handshake_failure:
                            r = 'Handshake failure.'
                            break
                        case u.Alert.Description.bad_certificate:
                            r = 'Bad certificate.'
                            break
                        case u.Alert.Description.unsupported_certificate:
                            r = 'Unsupported certificate.'
                            break
                        case u.Alert.Description.certificate_revoked:
                            r = 'Certificate revoked.'
                            break
                        case u.Alert.Description.certificate_expired:
                            r = 'Certificate expired.'
                            break
                        case u.Alert.Description.certificate_unknown:
                            r = 'Certificate unknown.'
                            break
                        case u.Alert.Description.illegal_parameter:
                            r = 'Illegal parameter.'
                            break
                        case u.Alert.Description.unknown_ca:
                            r = 'Unknown certificate authority.'
                            break
                        case u.Alert.Description.access_denied:
                            r = 'Access denied.'
                            break
                        case u.Alert.Description.decode_error:
                            r = 'Decode error.'
                            break
                        case u.Alert.Description.decrypt_error:
                            r = 'Decrypt error.'
                            break
                        case u.Alert.Description.export_restriction:
                            r = 'Export restriction.'
                            break
                        case u.Alert.Description.protocol_version:
                            r = 'Unsupported protocol version.'
                            break
                        case u.Alert.Description.insufficient_security:
                            r = 'Insufficient security.'
                            break
                        case u.Alert.Description.internal_error:
                            r = 'Internal error.'
                            break
                        case u.Alert.Description.user_canceled:
                            r = 'User canceled.'
                            break
                        case u.Alert.Description.no_renegotiation:
                            r = 'Renegotiation not supported.'
                            break
                        default:
                            r = 'Unknown error.'
                    }
                    if (a.description === u.Alert.Description.close_notify) return e.close()
                    e.error(e, {
                        message: r,
                        send: !1,
                        origin: e.entity === u.ConnectionEnd.client ? 'server' : 'client',
                        alert: a,
                    }),
                        e.process()
                }),
                (u.handleHandshake = function (e, t) {
                    var r = t.fragment,
                        a = r.getByte(),
                        i = r.getInt24()
                    if (i > r.length())
                        return (e.fragmented = t), (t.fragment = n.util.createBuffer()), (r.read -= 4), e.process()
                    ;(e.fragmented = null), (r.read -= 4)
                    var s = r.bytes(i + 4)
                    ;(r.read += 4),
                        a in x[e.entity][e.expect]
                            ? (e.entity !== u.ConnectionEnd.server ||
                                  e.open ||
                                  e.fail ||
                                  ((e.handshaking = !0),
                                  (e.session = {
                                      version: null,
                                      extensions: { server_name: { serverNameList: [] } },
                                      cipherSuite: null,
                                      compressionMethod: null,
                                      serverCertificate: null,
                                      clientCertificate: null,
                                      md5: n.md.md5.create(),
                                      sha1: n.md.sha1.create(),
                                  })),
                              a !== u.HandshakeType.hello_request &&
                                  a !== u.HandshakeType.certificate_verify &&
                                  a !== u.HandshakeType.finished &&
                                  (e.session.md5.update(s), e.session.sha1.update(s)),
                              x[e.entity][e.expect][a](e, t, i))
                            : u.handleUnexpected(e, t)
                }),
                (u.handleApplicationData = function (e, t) {
                    e.data.putBuffer(t.fragment), e.dataReady(e), e.process()
                }),
                (u.handleHeartbeat = function (e, t) {
                    var r = t.fragment,
                        a = r.getByte(),
                        i = r.getInt16(),
                        s = r.getBytes(i)
                    if (a === u.HeartbeatMessageType.heartbeat_request) {
                        if (e.handshaking || i > s.length) return e.process()
                        u.queue(
                            e,
                            u.createRecord(e, {
                                type: u.ContentType.heartbeat,
                                data: u.createHeartbeat(u.HeartbeatMessageType.heartbeat_response, s),
                            })
                        ),
                            u.flush(e)
                    } else if (a === u.HeartbeatMessageType.heartbeat_response) {
                        if (s !== e.expectedHeartbeatPayload) return e.process()
                        e.heartbeatReceived && e.heartbeatReceived(e, n.util.createBuffer(s))
                    }
                    e.process()
                })
            var l = 1,
                p = 2,
                f = 3,
                h = 4,
                d = 5,
                y = 6,
                g = 7,
                v = 8,
                m = 1,
                C = 2,
                E = 3,
                S = 4,
                T = 5,
                I = 6,
                b = u.handleUnexpected,
                A = u.handleChangeCipherSpec,
                B = u.handleAlert,
                N = u.handleHandshake,
                k = u.handleApplicationData,
                w = u.handleHeartbeat,
                R = []
            ;(R[u.ConnectionEnd.client] = [
                [b, B, N, b, w],
                [b, B, N, b, w],
                [b, B, N, b, w],
                [b, B, N, b, w],
                [b, B, N, b, w],
                [A, B, b, b, w],
                [b, B, N, b, w],
                [b, B, N, k, w],
                [b, B, N, b, w],
            ]),
                (R[u.ConnectionEnd.server] = [
                    [b, B, N, b, w],
                    [b, B, N, b, w],
                    [b, B, N, b, w],
                    [b, B, N, b, w],
                    [A, B, b, b, w],
                    [b, B, N, b, w],
                    [b, B, N, k, w],
                    [b, B, N, b, w],
                ])
            var L = u.handleHelloRequest,
                _ = u.handleServerHello,
                U = u.handleCertificate,
                D = u.handleServerKeyExchange,
                P = u.handleCertificateRequest,
                V = u.handleServerHelloDone,
                O = u.handleFinished,
                x = []
            x[u.ConnectionEnd.client] = [
                [b, b, _, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b],
                [L, b, b, b, b, b, b, b, b, b, b, U, D, P, V, b, b, b, b, b, b],
                [L, b, b, b, b, b, b, b, b, b, b, b, D, P, V, b, b, b, b, b, b],
                [L, b, b, b, b, b, b, b, b, b, b, b, b, P, V, b, b, b, b, b, b],
                [L, b, b, b, b, b, b, b, b, b, b, b, b, b, V, b, b, b, b, b, b],
                [L, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b],
                [L, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, O],
                [L, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b],
                [L, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b],
            ]
            var K = u.handleClientHello,
                M = u.handleClientKeyExchange,
                F = u.handleCertificateVerify
            ;(x[u.ConnectionEnd.server] = [
                [b, K, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b],
                [b, b, b, b, b, b, b, b, b, b, b, U, b, b, b, b, b, b, b, b, b],
                [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, M, b, b, b, b],
                [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, F, b, b, b, b, b],
                [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b],
                [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, O],
                [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b],
                [b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b, b],
            ]),
                (u.generateKeys = function (e, t) {
                    var r = a,
                        n = t.client_random + t.server_random
                    e.session.resuming ||
                        ((t.master_secret = r(t.pre_master_secret, 'master secret', n, 48).bytes()),
                        (t.pre_master_secret = null)),
                        (n = t.server_random + t.client_random)
                    var i = 2 * t.mac_key_length + 2 * t.enc_key_length,
                        s = e.version.major === u.Versions.TLS_1_0.major && e.version.minor === u.Versions.TLS_1_0.minor
                    s && (i += 2 * t.fixed_iv_length)
                    var o = r(t.master_secret, 'key expansion', n, i),
                        c = {
                            client_write_MAC_key: o.getBytes(t.mac_key_length),
                            server_write_MAC_key: o.getBytes(t.mac_key_length),
                            client_write_key: o.getBytes(t.enc_key_length),
                            server_write_key: o.getBytes(t.enc_key_length),
                        }
                    return (
                        s &&
                            ((c.client_write_IV = o.getBytes(t.fixed_iv_length)),
                            (c.server_write_IV = o.getBytes(t.fixed_iv_length))),
                        c
                    )
                }),
                (u.createConnectionState = function (e) {
                    var t = e.entity === u.ConnectionEnd.client,
                        r = function () {
                            var e = {
                                sequenceNumber: [0, 0],
                                macKey: null,
                                macLength: 0,
                                macFunction: null,
                                cipherState: null,
                                cipherFunction: function (e) {
                                    return !0
                                },
                                compressionState: null,
                                compressFunction: function (e) {
                                    return !0
                                },
                                updateSequenceNumber: function () {
                                    4294967295 === e.sequenceNumber[1]
                                        ? ((e.sequenceNumber[1] = 0), ++e.sequenceNumber[0])
                                        : ++e.sequenceNumber[1]
                                },
                            }
                            return e
                        },
                        n = { read: r(), write: r() }
                    if (
                        ((n.read.update = function (e, t) {
                            return (
                                n.read.cipherFunction(t, n.read)
                                    ? n.read.compressFunction(e, t, n.read) ||
                                      e.error(e, {
                                          message: 'Could not decompress record.',
                                          send: !0,
                                          alert: {
                                              level: u.Alert.Level.fatal,
                                              description: u.Alert.Description.decompression_failure,
                                          },
                                      })
                                    : e.error(e, {
                                          message: 'Could not decrypt record or bad MAC.',
                                          send: !0,
                                          alert: {
                                              level: u.Alert.Level.fatal,
                                              description: u.Alert.Description.bad_record_mac,
                                          },
                                      }),
                                !e.fail
                            )
                        }),
                        (n.write.update = function (e, t) {
                            return (
                                n.write.compressFunction(e, t, n.write)
                                    ? n.write.cipherFunction(t, n.write) ||
                                      e.error(e, {
                                          message: 'Could not encrypt record.',
                                          send: !1,
                                          alert: {
                                              level: u.Alert.Level.fatal,
                                              description: u.Alert.Description.internal_error,
                                          },
                                      })
                                    : e.error(e, {
                                          message: 'Could not compress record.',
                                          send: !1,
                                          alert: {
                                              level: u.Alert.Level.fatal,
                                              description: u.Alert.Description.internal_error,
                                          },
                                      }),
                                !e.fail
                            )
                        }),
                        e.session)
                    ) {
                        var a = e.session.sp
                        switch (
                            (e.session.cipherSuite.initSecurityParameters(a),
                            (a.keys = u.generateKeys(e, a)),
                            (n.read.macKey = t ? a.keys.server_write_MAC_key : a.keys.client_write_MAC_key),
                            (n.write.macKey = t ? a.keys.client_write_MAC_key : a.keys.server_write_MAC_key),
                            e.session.cipherSuite.initConnectionState(n, e, a),
                            a.compression_algorithm)
                        ) {
                            case u.CompressionMethod.none:
                                break
                            case u.CompressionMethod.deflate:
                                ;(n.read.compressFunction = s), (n.write.compressFunction = i)
                                break
                            default:
                                throw new Error('Unsupported compression algorithm.')
                        }
                    }
                    return n
                }),
                (u.createRandom = function () {
                    var e = new Date(),
                        t = +e + 6e4 * e.getTimezoneOffset(),
                        r = n.util.createBuffer()
                    return r.putInt32(t), r.putBytes(n.random.getBytes(28)), r
                }),
                (u.createRecord = function (e, t) {
                    return t.data
                        ? {
                              type: t.type,
                              version: { major: e.version.major, minor: e.version.minor },
                              length: t.data.length(),
                              fragment: t.data,
                          }
                        : null
                }),
                (u.createAlert = function (e, t) {
                    var r = n.util.createBuffer()
                    return (
                        r.putByte(t.level),
                        r.putByte(t.description),
                        u.createRecord(e, { type: u.ContentType.alert, data: r })
                    )
                }),
                (u.createClientHello = function (e) {
                    e.session.clientHelloVersion = { major: e.version.major, minor: e.version.minor }
                    for (var t = n.util.createBuffer(), r = 0; r < e.cipherSuites.length; ++r) {
                        var a = e.cipherSuites[r]
                        t.putByte(a.id[0]), t.putByte(a.id[1])
                    }
                    var i = t.length(),
                        s = n.util.createBuffer()
                    s.putByte(u.CompressionMethod.none)
                    var o = s.length(),
                        l = n.util.createBuffer()
                    if (e.virtualHost) {
                        var p = n.util.createBuffer()
                        p.putByte(0), p.putByte(0)
                        var f = n.util.createBuffer()
                        f.putByte(0), c(f, 2, n.util.createBuffer(e.virtualHost))
                        var h = n.util.createBuffer()
                        c(h, 2, f), c(p, 2, h), l.putBuffer(p)
                    }
                    var d = l.length()
                    d > 0 && (d += 2)
                    var y = e.session.id,
                        g = y.length + 1 + 2 + 4 + 28 + 2 + i + 1 + o + d,
                        v = n.util.createBuffer()
                    return (
                        v.putByte(u.HandshakeType.client_hello),
                        v.putInt24(g),
                        v.putByte(e.version.major),
                        v.putByte(e.version.minor),
                        v.putBytes(e.session.sp.client_random),
                        c(v, 1, n.util.createBuffer(y)),
                        c(v, 2, t),
                        c(v, 1, s),
                        d > 0 && c(v, 2, l),
                        v
                    )
                }),
                (u.createServerHello = function (e) {
                    var t = e.session.id,
                        r = t.length + 1 + 2 + 4 + 28 + 2 + 1,
                        a = n.util.createBuffer()
                    return (
                        a.putByte(u.HandshakeType.server_hello),
                        a.putInt24(r),
                        a.putByte(e.version.major),
                        a.putByte(e.version.minor),
                        a.putBytes(e.session.sp.server_random),
                        c(a, 1, n.util.createBuffer(t)),
                        a.putByte(e.session.cipherSuite.id[0]),
                        a.putByte(e.session.cipherSuite.id[1]),
                        a.putByte(e.session.compressionMethod),
                        a
                    )
                }),
                (u.createCertificate = function (e) {
                    var t,
                        r = e.entity === u.ConnectionEnd.client,
                        a = null
                    e.getCertificate &&
                        ((t = r ? e.session.certificateRequest : e.session.extensions.server_name.serverNameList),
                        (a = e.getCertificate(e, t)))
                    var i = n.util.createBuffer()
                    if (null !== a)
                        try {
                            n.util.isArray(a) || (a = [a])
                            for (var s = null, o = 0; o < a.length; ++o) {
                                var l = n.pem.decode(a[o])[0]
                                if (
                                    'CERTIFICATE' !== l.type &&
                                    'X509 CERTIFICATE' !== l.type &&
                                    'TRUSTED CERTIFICATE' !== l.type
                                ) {
                                    var p = new Error(
                                        'Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".'
                                    )
                                    throw ((p.headerType = l.type), p)
                                }
                                if (l.procType && 'ENCRYPTED' === l.procType.type)
                                    throw new Error('Could not convert certificate from PEM; PEM is encrypted.')
                                var f = n.util.createBuffer(l.body)
                                null === s && (s = n.asn1.fromDer(f.bytes(), !1))
                                var h = n.util.createBuffer()
                                c(h, 3, f), i.putBuffer(h)
                            }
                            ;(a = n.pki.certificateFromAsn1(s)),
                                r ? (e.session.clientCertificate = a) : (e.session.serverCertificate = a)
                        } catch (t) {
                            return e.error(e, {
                                message: 'Could not send certificate list.',
                                cause: t,
                                send: !0,
                                alert: { level: u.Alert.Level.fatal, description: u.Alert.Description.bad_certificate },
                            })
                        }
                    var d = 3 + i.length(),
                        y = n.util.createBuffer()
                    return y.putByte(u.HandshakeType.certificate), y.putInt24(d), c(y, 3, i), y
                }),
                (u.createClientKeyExchange = function (e) {
                    var t = n.util.createBuffer()
                    t.putByte(e.session.clientHelloVersion.major),
                        t.putByte(e.session.clientHelloVersion.minor),
                        t.putBytes(n.random.getBytes(46))
                    var r = e.session.sp
                    r.pre_master_secret = t.getBytes()
                    var a = (t = e.session.serverCertificate.publicKey.encrypt(r.pre_master_secret)).length + 2,
                        i = n.util.createBuffer()
                    return (
                        i.putByte(u.HandshakeType.client_key_exchange),
                        i.putInt24(a),
                        i.putInt16(t.length),
                        i.putBytes(t),
                        i
                    )
                }),
                (u.createServerKeyExchange = function (e) {
                    var t = n.util.createBuffer()
                    return t
                }),
                (u.getClientSignature = function (e, t) {
                    var r = n.util.createBuffer()
                    r.putBuffer(e.session.md5.digest()),
                        r.putBuffer(e.session.sha1.digest()),
                        (r = r.getBytes()),
                        (e.getSignature =
                            e.getSignature ||
                            function (e, t, r) {
                                var a = null
                                if (e.getPrivateKey)
                                    try {
                                        ;(a = e.getPrivateKey(e, e.session.clientCertificate)),
                                            (a = n.pki.privateKeyFromPem(a))
                                    } catch (t) {
                                        e.error(e, {
                                            message: 'Could not get private key.',
                                            cause: t,
                                            send: !0,
                                            alert: {
                                                level: u.Alert.Level.fatal,
                                                description: u.Alert.Description.internal_error,
                                            },
                                        })
                                    }
                                null === a
                                    ? e.error(e, {
                                          message: 'No private key set.',
                                          send: !0,
                                          alert: {
                                              level: u.Alert.Level.fatal,
                                              description: u.Alert.Description.internal_error,
                                          },
                                      })
                                    : (t = a.sign(t, null)),
                                    r(e, t)
                            }),
                        e.getSignature(e, r, t)
                }),
                (u.createCertificateVerify = function (e, t) {
                    var r = t.length + 2,
                        a = n.util.createBuffer()
                    return (
                        a.putByte(u.HandshakeType.certificate_verify),
                        a.putInt24(r),
                        a.putInt16(t.length),
                        a.putBytes(t),
                        a
                    )
                }),
                (u.createCertificateRequest = function (e) {
                    var t = n.util.createBuffer()
                    t.putByte(1)
                    var r = n.util.createBuffer()
                    for (var a in e.caStore.certs) {
                        var i = e.caStore.certs[a],
                            s = n.pki.distinguishedNameToAsn1(i.subject),
                            o = n.asn1.toDer(s)
                        r.putInt16(o.length()), r.putBuffer(o)
                    }
                    var l = 1 + t.length() + 2 + r.length(),
                        p = n.util.createBuffer()
                    return p.putByte(u.HandshakeType.certificate_request), p.putInt24(l), c(p, 1, t), c(p, 2, r), p
                }),
                (u.createServerHelloDone = function (e) {
                    var t = n.util.createBuffer()
                    return t.putByte(u.HandshakeType.server_hello_done), t.putInt24(0), t
                }),
                (u.createChangeCipherSpec = function () {
                    var e = n.util.createBuffer()
                    return e.putByte(1), e
                }),
                (u.createFinished = function (e) {
                    var t = n.util.createBuffer()
                    t.putBuffer(e.session.md5.digest()), t.putBuffer(e.session.sha1.digest())
                    var r = e.entity === u.ConnectionEnd.client,
                        i = e.session.sp,
                        s = r ? 'client finished' : 'server finished'
                    t = a(i.master_secret, s, t.getBytes(), 12)
                    var o = n.util.createBuffer()
                    return o.putByte(u.HandshakeType.finished), o.putInt24(t.length()), o.putBuffer(t), o
                }),
                (u.createHeartbeat = function (e, t, r) {
                    void 0 === r && (r = t.length)
                    var a = n.util.createBuffer()
                    a.putByte(e), a.putInt16(r), a.putBytes(t)
                    var i = a.length(),
                        s = Math.max(16, i - r - 3)
                    return a.putBytes(n.random.getBytes(s)), a
                }),
                (u.queue = function (e, t) {
                    if (
                        t &&
                        (0 !== t.fragment.length() ||
                            (t.type !== u.ContentType.handshake &&
                                t.type !== u.ContentType.alert &&
                                t.type !== u.ContentType.change_cipher_spec))
                    ) {
                        if (t.type === u.ContentType.handshake) {
                            var r = t.fragment.bytes()
                            e.session.md5.update(r), e.session.sha1.update(r), (r = null)
                        }
                        var a
                        if (t.fragment.length() <= u.MaxFragment) a = [t]
                        else {
                            a = []
                            for (var i = t.fragment.bytes(); i.length > u.MaxFragment; )
                                a.push(
                                    u.createRecord(e, {
                                        type: t.type,
                                        data: n.util.createBuffer(i.slice(0, u.MaxFragment)),
                                    })
                                ),
                                    (i = i.slice(u.MaxFragment))
                            i.length > 0 && a.push(u.createRecord(e, { type: t.type, data: n.util.createBuffer(i) }))
                        }
                        for (var s = 0; s < a.length && !e.fail; ++s) {
                            var o = a[s]
                            e.state.current.write.update(e, o) && e.records.push(o)
                        }
                    }
                }),
                (u.flush = function (e) {
                    for (var t = 0; t < e.records.length; ++t) {
                        var r = e.records[t]
                        e.tlsData.putByte(r.type),
                            e.tlsData.putByte(r.version.major),
                            e.tlsData.putByte(r.version.minor),
                            e.tlsData.putInt16(r.fragment.length()),
                            e.tlsData.putBuffer(e.records[t].fragment)
                    }
                    return (e.records = []), e.tlsDataReady(e)
                })
            var q = function (e) {
                switch (e) {
                    case !0:
                        return !0
                    case n.pki.certificateError.bad_certificate:
                        return u.Alert.Description.bad_certificate
                    case n.pki.certificateError.unsupported_certificate:
                        return u.Alert.Description.unsupported_certificate
                    case n.pki.certificateError.certificate_revoked:
                        return u.Alert.Description.certificate_revoked
                    case n.pki.certificateError.certificate_expired:
                        return u.Alert.Description.certificate_expired
                    case n.pki.certificateError.certificate_unknown:
                        return u.Alert.Description.certificate_unknown
                    case n.pki.certificateError.unknown_ca:
                        return u.Alert.Description.unknown_ca
                    default:
                        return u.Alert.Description.bad_certificate
                }
            }
            for (var H in ((u.verifyCertificateChain = function (e, t) {
                try {
                    var r = {}
                    for (var a in e.verifyOptions) r[a] = e.verifyOptions[a]
                    ;(r.verify = function (t, r, a) {
                        q(t)
                        var i = e.verify(e, t, r, a)
                        if (!0 !== i) {
                            if ('object' == typeof i && !n.util.isArray(i)) {
                                var s = new Error('The application rejected the certificate.')
                                throw (
                                    ((s.send = !0),
                                    (s.alert = {
                                        level: u.Alert.Level.fatal,
                                        description: u.Alert.Description.bad_certificate,
                                    }),
                                    i.message && (s.message = i.message),
                                    i.alert && (s.alert.description = i.alert),
                                    s)
                                )
                            }
                            i !== t &&
                                (i = (function (e) {
                                    switch (e) {
                                        case !0:
                                            return !0
                                        case u.Alert.Description.bad_certificate:
                                            return n.pki.certificateError.bad_certificate
                                        case u.Alert.Description.unsupported_certificate:
                                            return n.pki.certificateError.unsupported_certificate
                                        case u.Alert.Description.certificate_revoked:
                                            return n.pki.certificateError.certificate_revoked
                                        case u.Alert.Description.certificate_expired:
                                            return n.pki.certificateError.certificate_expired
                                        case u.Alert.Description.certificate_unknown:
                                            return n.pki.certificateError.certificate_unknown
                                        case u.Alert.Description.unknown_ca:
                                            return n.pki.certificateError.unknown_ca
                                        default:
                                            return n.pki.certificateError.bad_certificate
                                    }
                                })(i))
                        }
                        return i
                    }),
                        n.pki.verifyCertificateChain(e.caStore, t, r)
                } catch (t) {
                    var i = t
                    ;('object' != typeof i || n.util.isArray(i)) &&
                        (i = { send: !0, alert: { level: u.Alert.Level.fatal, description: q(t) } }),
                        'send' in i || (i.send = !0),
                        'alert' in i || (i.alert = { level: u.Alert.Level.fatal, description: q(i.error) }),
                        e.error(e, i)
                }
                return !e.fail
            }),
            (u.createSessionCache = function (e, t) {
                var r = null
                if (e && e.getSession && e.setSession && e.order) r = e
                else {
                    for (var a in (((r = {}).cache = e || {}), (r.capacity = Math.max(t || 100, 1)), (r.order = []), e))
                        r.order.length <= t ? r.order.push(a) : delete e[a]
                    ;(r.getSession = function (e) {
                        var t = null,
                            a = null
                        if (
                            (e ? (a = n.util.bytesToHex(e)) : r.order.length > 0 && (a = r.order[0]),
                            null !== a && a in r.cache)
                        )
                            for (var i in ((t = r.cache[a]), delete r.cache[a], r.order))
                                if (r.order[i] === a) {
                                    r.order.splice(i, 1)
                                    break
                                }
                        return t
                    }),
                        (r.setSession = function (e, t) {
                            if (r.order.length === r.capacity) {
                                var a = r.order.shift()
                                delete r.cache[a]
                            }
                            a = n.util.bytesToHex(e)
                            r.order.push(a), (r.cache[a] = t)
                        })
                }
                return r
            }),
            (u.createConnection = function (e) {
                var t = null
                t = e.caStore
                    ? n.util.isArray(e.caStore)
                        ? n.pki.createCaStore(e.caStore)
                        : e.caStore
                    : n.pki.createCaStore()
                var r = e.cipherSuites || null
                if (null === r) for (var a in ((r = []), u.CipherSuites)) r.push(u.CipherSuites[a])
                var i = e.server ? u.ConnectionEnd.server : u.ConnectionEnd.client,
                    s = e.sessionCache ? u.createSessionCache(e.sessionCache) : null,
                    o = {
                        version: { major: u.Version.major, minor: u.Version.minor },
                        entity: i,
                        sessionId: e.sessionId,
                        caStore: t,
                        sessionCache: s,
                        cipherSuites: r,
                        connected: e.connected,
                        virtualHost: e.virtualHost || null,
                        verifyClient: e.verifyClient || !1,
                        verify:
                            e.verify ||
                            function (e, t, r, n) {
                                return t
                            },
                        verifyOptions: e.verifyOptions || {},
                        getCertificate: e.getCertificate || null,
                        getPrivateKey: e.getPrivateKey || null,
                        getSignature: e.getSignature || null,
                        input: n.util.createBuffer(),
                        tlsData: n.util.createBuffer(),
                        data: n.util.createBuffer(),
                        tlsDataReady: e.tlsDataReady,
                        dataReady: e.dataReady,
                        heartbeatReceived: e.heartbeatReceived,
                        closed: e.closed,
                        error: function (t, r) {
                            ;(r.origin = r.origin || (t.entity === u.ConnectionEnd.client ? 'client' : 'server')),
                                r.send && (u.queue(t, u.createAlert(t, r.alert)), u.flush(t))
                            var n = !1 !== r.fatal
                            n && (t.fail = !0), e.error(t, r), n && t.close(!1)
                        },
                        deflate: e.deflate || null,
                        inflate: e.inflate || null,
                        reset: function (e) {
                            ;(o.version = { major: u.Version.major, minor: u.Version.minor }),
                                (o.record = null),
                                (o.session = null),
                                (o.peerCertificate = null),
                                (o.state = { pending: null, current: null }),
                                (o.expect = (o.entity, u.ConnectionEnd.client, 0)),
                                (o.fragmented = null),
                                (o.records = []),
                                (o.open = !1),
                                (o.handshakes = 0),
                                (o.handshaking = !1),
                                (o.isConnected = !1),
                                (o.fail = !(e || void 0 === e)),
                                o.input.clear(),
                                o.tlsData.clear(),
                                o.data.clear(),
                                (o.state.current = u.createConnectionState(o))
                        },
                    }
                o.reset()
                return (
                    (o.handshake = function (e) {
                        if (o.entity !== u.ConnectionEnd.client)
                            o.error(o, { message: 'Cannot initiate handshake as a server.', fatal: !1 })
                        else if (o.handshaking) o.error(o, { message: 'Handshake already in progress.', fatal: !1 })
                        else {
                            o.fail && !o.open && 0 === o.handshakes && (o.fail = !1), (o.handshaking = !0)
                            var t = null
                            ;(e = e || '').length > 0 &&
                                (o.sessionCache && (t = o.sessionCache.getSession(e)), null === t && (e = '')),
                                0 === e.length &&
                                    o.sessionCache &&
                                    null !== (t = o.sessionCache.getSession()) &&
                                    (e = t.id),
                                (o.session = {
                                    id: e,
                                    version: null,
                                    cipherSuite: null,
                                    compressionMethod: null,
                                    serverCertificate: null,
                                    certificateRequest: null,
                                    clientCertificate: null,
                                    sp: {},
                                    md5: n.md.md5.create(),
                                    sha1: n.md.sha1.create(),
                                }),
                                t && ((o.version = t.version), (o.session.sp = t.sp)),
                                (o.session.sp.client_random = u.createRandom().getBytes()),
                                (o.open = !0),
                                u.queue(
                                    o,
                                    u.createRecord(o, { type: u.ContentType.handshake, data: u.createClientHello(o) })
                                ),
                                u.flush(o)
                        }
                    }),
                    (o.process = function (e) {
                        var t = 0
                        return (
                            e && o.input.putBytes(e),
                            o.fail ||
                                (null !== o.record &&
                                    o.record.ready &&
                                    o.record.fragment.isEmpty() &&
                                    (o.record = null),
                                null === o.record &&
                                    (t = (function (e) {
                                        var t = 0,
                                            r = e.input,
                                            a = r.length()
                                        if (a < 5) t = 5 - a
                                        else {
                                            e.record = {
                                                type: r.getByte(),
                                                version: { major: r.getByte(), minor: r.getByte() },
                                                length: r.getInt16(),
                                                fragment: n.util.createBuffer(),
                                                ready: !1,
                                            }
                                            var i = e.record.version.major === e.version.major
                                            i &&
                                                e.session &&
                                                e.session.version &&
                                                (i = e.record.version.minor === e.version.minor),
                                                i ||
                                                    e.error(e, {
                                                        message: 'Incompatible TLS version.',
                                                        send: !0,
                                                        alert: {
                                                            level: u.Alert.Level.fatal,
                                                            description: u.Alert.Description.protocol_version,
                                                        },
                                                    })
                                        }
                                        return t
                                    })(o)),
                                o.fail ||
                                    null === o.record ||
                                    o.record.ready ||
                                    (t = (function (e) {
                                        var t = 0,
                                            r = e.input,
                                            n = r.length()
                                        n < e.record.length
                                            ? (t = e.record.length - n)
                                            : (e.record.fragment.putBytes(r.getBytes(e.record.length)),
                                              r.compact(),
                                              e.state.current.read.update(e, e.record) &&
                                                  (null !== e.fragmented &&
                                                      (e.fragmented.type === e.record.type
                                                          ? (e.fragmented.fragment.putBuffer(e.record.fragment),
                                                            (e.record = e.fragmented))
                                                          : e.error(e, {
                                                                message: 'Invalid fragmented record.',
                                                                send: !0,
                                                                alert: {
                                                                    level: u.Alert.Level.fatal,
                                                                    description: u.Alert.Description.unexpected_message,
                                                                },
                                                            })),
                                                  (e.record.ready = !0)))
                                        return t
                                    })(o)),
                                !o.fail &&
                                    null !== o.record &&
                                    o.record.ready &&
                                    (function (e, t) {
                                        var r = t.type - u.ContentType.change_cipher_spec,
                                            n = R[e.entity][e.expect]
                                        r in n ? n[r](e, t) : u.handleUnexpected(e, t)
                                    })(o, o.record)),
                            t
                        )
                    }),
                    (o.prepare = function (e) {
                        return (
                            u.queue(
                                o,
                                u.createRecord(o, {
                                    type: u.ContentType.application_data,
                                    data: n.util.createBuffer(e),
                                })
                            ),
                            u.flush(o)
                        )
                    }),
                    (o.prepareHeartbeatRequest = function (e, t) {
                        return (
                            e instanceof n.util.ByteBuffer && (e = e.bytes()),
                            void 0 === t && (t = e.length),
                            (o.expectedHeartbeatPayload = e),
                            u.queue(
                                o,
                                u.createRecord(o, {
                                    type: u.ContentType.heartbeat,
                                    data: u.createHeartbeat(u.HeartbeatMessageType.heartbeat_request, e, t),
                                })
                            ),
                            u.flush(o)
                        )
                    }),
                    (o.close = function (e) {
                        if (!o.fail && o.sessionCache && o.session) {
                            var t = { id: o.session.id, version: o.session.version, sp: o.session.sp }
                            ;(t.sp.keys = null), o.sessionCache.setSession(t.id, t)
                        }
                        o.open &&
                            ((o.open = !1),
                            o.input.clear(),
                            (o.isConnected || o.handshaking) &&
                                ((o.isConnected = o.handshaking = !1),
                                u.queue(
                                    o,
                                    u.createAlert(o, {
                                        level: u.Alert.Level.warning,
                                        description: u.Alert.Description.close_notify,
                                    })
                                ),
                                u.flush(o)),
                            o.closed(o)),
                            o.reset(e)
                    }),
                    o
                )
            }),
            (e.exports = n.tls = n.tls || {}),
            u))
                'function' != typeof u[H] && (n.tls[H] = u[H])
            ;(n.tls.prf_tls1 = a),
                (n.tls.hmac_sha1 = function (e, t, r) {
                    var a = n.hmac.create()
                    a.start('SHA1', e)
                    var i = n.util.createBuffer()
                    return (
                        i.putInt32(t[0]),
                        i.putInt32(t[1]),
                        i.putByte(r.type),
                        i.putByte(r.version.major),
                        i.putByte(r.version.minor),
                        i.putInt16(r.length),
                        i.putBytes(r.fragment.bytes()),
                        a.update(i.getBytes()),
                        a.digest().getBytes()
                    )
                }),
                (n.tls.createSessionCache = u.createSessionCache),
                (n.tls.createConnection = u.createConnection)
        },
        function (e, t, r) {
            var n = r(0)
            function a(e, t) {
                n.cipher.registerAlgorithm(e, function () {
                    return new n.des.Algorithm(e, t)
                })
            }
            r(14),
                r(20),
                r(1),
                (e.exports = n.des = n.des || {}),
                (n.des.startEncrypting = function (e, t, r, n) {
                    var a = d({ key: e, output: r, decrypt: !1, mode: n || (null === t ? 'ECB' : 'CBC') })
                    return a.start(t), a
                }),
                (n.des.createEncryptionCipher = function (e, t) {
                    return d({ key: e, output: null, decrypt: !1, mode: t })
                }),
                (n.des.startDecrypting = function (e, t, r, n) {
                    var a = d({ key: e, output: r, decrypt: !0, mode: n || (null === t ? 'ECB' : 'CBC') })
                    return a.start(t), a
                }),
                (n.des.createDecryptionCipher = function (e, t) {
                    return d({ key: e, output: null, decrypt: !0, mode: t })
                }),
                (n.des.Algorithm = function (e, t) {
                    var r = this
                    ;(r.name = e),
                        (r.mode = new t({
                            blockSize: 8,
                            cipher: {
                                encrypt: function (e, t) {
                                    return h(r._keys, e, t, !1)
                                },
                                decrypt: function (e, t) {
                                    return h(r._keys, e, t, !0)
                                },
                            },
                        })),
                        (r._init = !1)
                }),
                (n.des.Algorithm.prototype.initialize = function (e) {
                    if (!this._init) {
                        var t = n.util.createBuffer(e.key)
                        if (0 === this.name.indexOf('3DES') && 24 !== t.length())
                            throw new Error('Invalid Triple-DES key size: ' + 8 * t.length())
                        ;(this._keys = (function (e) {
                            for (
                                var t,
                                    r = [
                                        0, 4, 536870912, 536870916, 65536, 65540, 536936448, 536936452, 512, 516,
                                        536871424, 536871428, 66048, 66052, 536936960, 536936964,
                                    ],
                                    n = [
                                        0, 1, 1048576, 1048577, 67108864, 67108865, 68157440, 68157441, 256, 257,
                                        1048832, 1048833, 67109120, 67109121, 68157696, 68157697,
                                    ],
                                    a = [
                                        0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272, 0, 8, 2048, 2056,
                                        16777216, 16777224, 16779264, 16779272,
                                    ],
                                    i = [
                                        0, 2097152, 134217728, 136314880, 8192, 2105344, 134225920, 136323072, 131072,
                                        2228224, 134348800, 136445952, 139264, 2236416, 134356992, 136454144,
                                    ],
                                    s = [
                                        0, 262144, 16, 262160, 0, 262144, 16, 262160, 4096, 266240, 4112, 266256, 4096,
                                        266240, 4112, 266256,
                                    ],
                                    o = [
                                        0, 1024, 32, 1056, 0, 1024, 32, 1056, 33554432, 33555456, 33554464, 33555488,
                                        33554432, 33555456, 33554464, 33555488,
                                    ],
                                    c = [
                                        0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746, 0, 268435456,
                                        524288, 268959744, 2, 268435458, 524290, 268959746,
                                    ],
                                    u = [
                                        0, 65536, 2048, 67584, 536870912, 536936448, 536872960, 536938496, 131072,
                                        196608, 133120, 198656, 537001984, 537067520, 537004032, 537069568,
                                    ],
                                    l = [
                                        0, 262144, 0, 262144, 2, 262146, 2, 262146, 33554432, 33816576, 33554432,
                                        33816576, 33554434, 33816578, 33554434, 33816578,
                                    ],
                                    p = [
                                        0, 268435456, 8, 268435464, 0, 268435456, 8, 268435464, 1024, 268436480, 1032,
                                        268436488, 1024, 268436480, 1032, 268436488,
                                    ],
                                    f = [
                                        0, 32, 0, 32, 1048576, 1048608, 1048576, 1048608, 8192, 8224, 8192, 8224,
                                        1056768, 1056800, 1056768, 1056800,
                                    ],
                                    h = [
                                        0, 16777216, 512, 16777728, 2097152, 18874368, 2097664, 18874880, 67108864,
                                        83886080, 67109376, 83886592, 69206016, 85983232, 69206528, 85983744,
                                    ],
                                    d = [
                                        0, 4096, 134217728, 134221824, 524288, 528384, 134742016, 134746112, 16, 4112,
                                        134217744, 134221840, 524304, 528400, 134742032, 134746128,
                                    ],
                                    y = [0, 4, 256, 260, 0, 4, 256, 260, 1, 5, 257, 261, 1, 5, 257, 261],
                                    g = e.length() > 8 ? 3 : 1,
                                    v = [],
                                    m = [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0],
                                    C = 0,
                                    E = 0;
                                E < g;
                                E++
                            ) {
                                var S = e.getInt32(),
                                    T = e.getInt32()
                                ;(S ^= (t = 252645135 & ((S >>> 4) ^ T)) << 4),
                                    (S ^= t = 65535 & (((T ^= t) >>> -16) ^ S)),
                                    (S ^= (t = 858993459 & ((S >>> 2) ^ (T ^= t << -16))) << 2),
                                    (S ^= t = 65535 & (((T ^= t) >>> -16) ^ S)),
                                    (S ^= (t = 1431655765 & ((S >>> 1) ^ (T ^= t << -16))) << 1),
                                    (S ^= t = 16711935 & (((T ^= t) >>> 8) ^ S)),
                                    (t =
                                        ((S ^= (t = 1431655765 & ((S >>> 1) ^ (T ^= t << 8))) << 1) << 8) |
                                        (((T ^= t) >>> 20) & 240)),
                                    (S = (T << 24) | ((T << 8) & 16711680) | ((T >>> 8) & 65280) | ((T >>> 24) & 240)),
                                    (T = t)
                                for (var I = 0; I < m.length; ++I) {
                                    m[I]
                                        ? ((S = (S << 2) | (S >>> 26)), (T = (T << 2) | (T >>> 26)))
                                        : ((S = (S << 1) | (S >>> 27)), (T = (T << 1) | (T >>> 27)))
                                    var b =
                                            r[(S &= -15) >>> 28] |
                                            n[(S >>> 24) & 15] |
                                            a[(S >>> 20) & 15] |
                                            i[(S >>> 16) & 15] |
                                            s[(S >>> 12) & 15] |
                                            o[(S >>> 8) & 15] |
                                            c[(S >>> 4) & 15],
                                        A =
                                            u[(T &= -15) >>> 28] |
                                            l[(T >>> 24) & 15] |
                                            p[(T >>> 20) & 15] |
                                            f[(T >>> 16) & 15] |
                                            h[(T >>> 12) & 15] |
                                            d[(T >>> 8) & 15] |
                                            y[(T >>> 4) & 15]
                                    ;(t = 65535 & ((A >>> 16) ^ b)), (v[C++] = b ^ t), (v[C++] = A ^ (t << 16))
                                }
                            }
                            return v
                        })(t)),
                            (this._init = !0)
                    }
                }),
                a('DES-ECB', n.cipher.modes.ecb),
                a('DES-CBC', n.cipher.modes.cbc),
                a('DES-CFB', n.cipher.modes.cfb),
                a('DES-OFB', n.cipher.modes.ofb),
                a('DES-CTR', n.cipher.modes.ctr),
                a('3DES-ECB', n.cipher.modes.ecb),
                a('3DES-CBC', n.cipher.modes.cbc),
                a('3DES-CFB', n.cipher.modes.cfb),
                a('3DES-OFB', n.cipher.modes.ofb),
                a('3DES-CTR', n.cipher.modes.ctr)
            var i = [
                    16843776, 0, 65536, 16843780, 16842756, 66564, 4, 65536, 1024, 16843776, 16843780, 1024, 16778244,
                    16842756, 16777216, 4, 1028, 16778240, 16778240, 66560, 66560, 16842752, 16842752, 16778244, 65540,
                    16777220, 16777220, 65540, 0, 1028, 66564, 16777216, 65536, 16843780, 4, 16842752, 16843776,
                    16777216, 16777216, 1024, 16842756, 65536, 66560, 16777220, 1024, 4, 16778244, 66564, 16843780,
                    65540, 16842752, 16778244, 16777220, 1028, 66564, 16843776, 1028, 16778240, 16778240, 0, 65540,
                    66560, 0, 16842756,
                ],
                s = [
                    -2146402272, -2147450880, 32768, 1081376, 1048576, 32, -2146435040, -2147450848, -2147483616,
                    -2146402272, -2146402304, -2147483648, -2147450880, 1048576, 32, -2146435040, 1081344, 1048608,
                    -2147450848, 0, -2147483648, 32768, 1081376, -2146435072, 1048608, -2147483616, 0, 1081344, 32800,
                    -2146402304, -2146435072, 32800, 0, 1081376, -2146435040, 1048576, -2147450848, -2146435072,
                    -2146402304, 32768, -2146435072, -2147450880, 32, -2146402272, 1081376, 32, 32768, -2147483648,
                    32800, -2146402304, 1048576, -2147483616, 1048608, -2147450848, -2147483616, 1048608, 1081344, 0,
                    -2147450880, 32800, -2147483648, -2146435040, -2146402272, 1081344,
                ],
                o = [
                    520, 134349312, 0, 134348808, 134218240, 0, 131592, 134218240, 131080, 134217736, 134217736, 131072,
                    134349320, 131080, 134348800, 520, 134217728, 8, 134349312, 512, 131584, 134348800, 134348808,
                    131592, 134218248, 131584, 131072, 134218248, 8, 134349320, 512, 134217728, 134349312, 134217728,
                    131080, 520, 131072, 134349312, 134218240, 0, 512, 131080, 134349320, 134218240, 134217736, 512, 0,
                    134348808, 134218248, 131072, 134217728, 134349320, 8, 131592, 131584, 134217736, 134348800,
                    134218248, 520, 134348800, 131592, 8, 134348808, 131584,
                ],
                c = [
                    8396801, 8321, 8321, 128, 8396928, 8388737, 8388609, 8193, 0, 8396800, 8396800, 8396929, 129, 0,
                    8388736, 8388609, 1, 8192, 8388608, 8396801, 128, 8388608, 8193, 8320, 8388737, 1, 8320, 8388736,
                    8192, 8396928, 8396929, 129, 8388736, 8388609, 8396800, 8396929, 129, 0, 0, 8396800, 8320, 8388736,
                    8388737, 1, 8396801, 8321, 8321, 128, 8396929, 129, 1, 8192, 8388609, 8193, 8396928, 8388737, 8193,
                    8320, 8388608, 8396801, 128, 8388608, 8192, 8396928,
                ],
                u = [
                    256, 34078976, 34078720, 1107296512, 524288, 256, 1073741824, 34078720, 1074266368, 524288,
                    33554688, 1074266368, 1107296512, 1107820544, 524544, 1073741824, 33554432, 1074266112, 1074266112,
                    0, 1073742080, 1107820800, 1107820800, 33554688, 1107820544, 1073742080, 0, 1107296256, 34078976,
                    33554432, 1107296256, 524544, 524288, 1107296512, 256, 33554432, 1073741824, 34078720, 1107296512,
                    1074266368, 33554688, 1073741824, 1107820544, 34078976, 1074266368, 256, 33554432, 1107820544,
                    1107820800, 524544, 1107296256, 1107820800, 34078720, 0, 1074266112, 1107296256, 524544, 33554688,
                    1073742080, 524288, 0, 1074266112, 34078976, 1073742080,
                ],
                l = [
                    536870928, 541065216, 16384, 541081616, 541065216, 16, 541081616, 4194304, 536887296, 4210704,
                    4194304, 536870928, 4194320, 536887296, 536870912, 16400, 0, 4194320, 536887312, 16384, 4210688,
                    536887312, 16, 541065232, 541065232, 0, 4210704, 541081600, 16400, 4210688, 541081600, 536870912,
                    536887296, 16, 541065232, 4210688, 541081616, 4194304, 16400, 536870928, 4194304, 536887296,
                    536870912, 16400, 536870928, 541081616, 4210688, 541065216, 4210704, 541081600, 0, 541065232, 16,
                    16384, 541065216, 4210704, 16384, 4194320, 536887312, 0, 541081600, 536870912, 4194320, 536887312,
                ],
                p = [
                    2097152, 69206018, 67110914, 0, 2048, 67110914, 2099202, 69208064, 69208066, 2097152, 0, 67108866,
                    2, 67108864, 69206018, 2050, 67110912, 2099202, 2097154, 67110912, 67108866, 69206016, 69208064,
                    2097154, 69206016, 2048, 2050, 69208066, 2099200, 2, 67108864, 2099200, 67108864, 2099200, 2097152,
                    67110914, 67110914, 69206018, 69206018, 2, 2097154, 67108864, 67110912, 2097152, 69208064, 2050,
                    2099202, 69208064, 2050, 67108866, 69208066, 69206016, 2099200, 0, 2, 69208066, 0, 2099202,
                    69206016, 2048, 67108866, 67110912, 2048, 2097154,
                ],
                f = [
                    268439616, 4096, 262144, 268701760, 268435456, 268439616, 64, 268435456, 262208, 268697600,
                    268701760, 266240, 268701696, 266304, 4096, 64, 268697600, 268435520, 268439552, 4160, 266240,
                    262208, 268697664, 268701696, 4160, 0, 0, 268697664, 268435520, 268439552, 266304, 262144, 266304,
                    262144, 268701696, 4096, 64, 268697664, 4096, 266304, 268439552, 64, 268435520, 268697600,
                    268697664, 268435456, 262144, 268439616, 0, 268701760, 262208, 268435520, 268697600, 268439552,
                    268439616, 0, 268701760, 266240, 266240, 4160, 4160, 262208, 268435456, 268701696,
                ]
            function h(e, t, r, n) {
                var a,
                    h,
                    d = 32 === e.length ? 3 : 9
                a =
                    3 === d
                        ? n
                            ? [30, -2, -2]
                            : [0, 32, 2]
                        : n
                        ? [94, 62, -2, 32, 64, 2, 30, -2, -2]
                        : [0, 32, 2, 62, 30, -2, 64, 96, 2]
                var y = t[0],
                    g = t[1]
                ;(y ^= (h = 252645135 & ((y >>> 4) ^ g)) << 4),
                    (y ^= (h = 65535 & ((y >>> 16) ^ (g ^= h))) << 16),
                    (y ^= h = 858993459 & (((g ^= h) >>> 2) ^ y)),
                    (y ^= h = 16711935 & (((g ^= h << 2) >>> 8) ^ y)),
                    (y = ((y ^= (h = 1431655765 & ((y >>> 1) ^ (g ^= h << 8))) << 1) << 1) | (y >>> 31)),
                    (g = ((g ^= h) << 1) | (g >>> 31))
                for (var v = 0; v < d; v += 3) {
                    for (var m = a[v + 1], C = a[v + 2], E = a[v]; E != m; E += C) {
                        var S = g ^ e[E],
                            T = ((g >>> 4) | (g << 28)) ^ e[E + 1]
                        ;(h = y),
                            (y = g),
                            (g =
                                h ^
                                (s[(S >>> 24) & 63] |
                                    c[(S >>> 16) & 63] |
                                    l[(S >>> 8) & 63] |
                                    f[63 & S] |
                                    i[(T >>> 24) & 63] |
                                    o[(T >>> 16) & 63] |
                                    u[(T >>> 8) & 63] |
                                    p[63 & T]))
                    }
                    ;(h = y), (y = g), (g = h)
                }
                ;(g = (g >>> 1) | (g << 31)),
                    (g ^= h = 1431655765 & (((y = (y >>> 1) | (y << 31)) >>> 1) ^ g)),
                    (g ^= (h = 16711935 & ((g >>> 8) ^ (y ^= h << 1))) << 8),
                    (g ^= (h = 858993459 & ((g >>> 2) ^ (y ^= h))) << 2),
                    (g ^= h = 65535 & (((y ^= h) >>> 16) ^ g)),
                    (g ^= h = 252645135 & (((y ^= h << 16) >>> 4) ^ g)),
                    (y ^= h << 4),
                    (r[0] = y),
                    (r[1] = g)
            }
            function d(e) {
                var t,
                    r = 'DES-' + ((e = e || {}).mode || 'CBC').toUpperCase(),
                    a = (t = e.decrypt ? n.cipher.createDecipher(r, e.key) : n.cipher.createCipher(r, e.key)).start
                return (
                    (t.start = function (e, r) {
                        var i = null
                        r instanceof n.util.ByteBuffer && ((i = r), (r = {})),
                            ((r = r || {}).output = i),
                            (r.iv = e),
                            a.call(t, r)
                    }),
                    t
                )
            }
        },
        function (e, t, r) {
            var n = r(0)
            if ((r(3), r(13), r(6), r(26), r(27), r(2), r(1), void 0 === a)) var a = n.jsbn.BigInteger
            var i = n.util.isNodejs ? r(17) : null,
                s = n.asn1,
                o = n.util
            ;(n.pki = n.pki || {}), (e.exports = n.pki.rsa = n.rsa = n.rsa || {})
            var c = n.pki,
                u = [6, 4, 2, 4, 2, 4, 6, 2],
                l = {
                    name: 'PrivateKeyInfo',
                    tagClass: s.Class.UNIVERSAL,
                    type: s.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'PrivateKeyInfo.version',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.INTEGER,
                            constructed: !1,
                            capture: 'privateKeyVersion',
                        },
                        {
                            name: 'PrivateKeyInfo.privateKeyAlgorithm',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.SEQUENCE,
                            constructed: !0,
                            value: [
                                {
                                    name: 'AlgorithmIdentifier.algorithm',
                                    tagClass: s.Class.UNIVERSAL,
                                    type: s.Type.OID,
                                    constructed: !1,
                                    capture: 'privateKeyOid',
                                },
                            ],
                        },
                        {
                            name: 'PrivateKeyInfo',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.OCTETSTRING,
                            constructed: !1,
                            capture: 'privateKey',
                        },
                    ],
                },
                p = {
                    name: 'RSAPrivateKey',
                    tagClass: s.Class.UNIVERSAL,
                    type: s.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'RSAPrivateKey.version',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.INTEGER,
                            constructed: !1,
                            capture: 'privateKeyVersion',
                        },
                        {
                            name: 'RSAPrivateKey.modulus',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.INTEGER,
                            constructed: !1,
                            capture: 'privateKeyModulus',
                        },
                        {
                            name: 'RSAPrivateKey.publicExponent',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.INTEGER,
                            constructed: !1,
                            capture: 'privateKeyPublicExponent',
                        },
                        {
                            name: 'RSAPrivateKey.privateExponent',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.INTEGER,
                            constructed: !1,
                            capture: 'privateKeyPrivateExponent',
                        },
                        {
                            name: 'RSAPrivateKey.prime1',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.INTEGER,
                            constructed: !1,
                            capture: 'privateKeyPrime1',
                        },
                        {
                            name: 'RSAPrivateKey.prime2',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.INTEGER,
                            constructed: !1,
                            capture: 'privateKeyPrime2',
                        },
                        {
                            name: 'RSAPrivateKey.exponent1',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.INTEGER,
                            constructed: !1,
                            capture: 'privateKeyExponent1',
                        },
                        {
                            name: 'RSAPrivateKey.exponent2',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.INTEGER,
                            constructed: !1,
                            capture: 'privateKeyExponent2',
                        },
                        {
                            name: 'RSAPrivateKey.coefficient',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.INTEGER,
                            constructed: !1,
                            capture: 'privateKeyCoefficient',
                        },
                    ],
                },
                f = {
                    name: 'RSAPublicKey',
                    tagClass: s.Class.UNIVERSAL,
                    type: s.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'RSAPublicKey.modulus',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.INTEGER,
                            constructed: !1,
                            capture: 'publicKeyModulus',
                        },
                        {
                            name: 'RSAPublicKey.exponent',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.INTEGER,
                            constructed: !1,
                            capture: 'publicKeyExponent',
                        },
                    ],
                },
                h = (n.pki.rsa.publicKeyValidator = {
                    name: 'SubjectPublicKeyInfo',
                    tagClass: s.Class.UNIVERSAL,
                    type: s.Type.SEQUENCE,
                    constructed: !0,
                    captureAsn1: 'subjectPublicKeyInfo',
                    value: [
                        {
                            name: 'SubjectPublicKeyInfo.AlgorithmIdentifier',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.SEQUENCE,
                            constructed: !0,
                            value: [
                                {
                                    name: 'AlgorithmIdentifier.algorithm',
                                    tagClass: s.Class.UNIVERSAL,
                                    type: s.Type.OID,
                                    constructed: !1,
                                    capture: 'publicKeyOid',
                                },
                            ],
                        },
                        {
                            name: 'SubjectPublicKeyInfo.subjectPublicKey',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.BITSTRING,
                            constructed: !1,
                            value: [
                                {
                                    name: 'SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey',
                                    tagClass: s.Class.UNIVERSAL,
                                    type: s.Type.SEQUENCE,
                                    constructed: !0,
                                    optional: !0,
                                    captureAsn1: 'rsaPublicKey',
                                },
                            ],
                        },
                    ],
                }),
                d = {
                    name: 'DigestInfo',
                    tagClass: s.Class.UNIVERSAL,
                    type: s.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'DigestInfo.DigestAlgorithm',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.SEQUENCE,
                            constructed: !0,
                            value: [
                                {
                                    name: 'DigestInfo.DigestAlgorithm.algorithmIdentifier',
                                    tagClass: s.Class.UNIVERSAL,
                                    type: s.Type.OID,
                                    constructed: !1,
                                    capture: 'algorithmIdentifier',
                                },
                                {
                                    name: 'DigestInfo.DigestAlgorithm.parameters',
                                    tagClass: s.Class.UNIVERSAL,
                                    type: s.Type.NULL,
                                    capture: 'parameters',
                                    optional: !0,
                                    constructed: !1,
                                },
                            ],
                        },
                        {
                            name: 'DigestInfo.digest',
                            tagClass: s.Class.UNIVERSAL,
                            type: s.Type.OCTETSTRING,
                            constructed: !1,
                            capture: 'digest',
                        },
                    ],
                },
                y = function (e) {
                    var t
                    if (!(e.algorithm in c.oids)) {
                        var r = new Error('Unknown message digest algorithm.')
                        throw ((r.algorithm = e.algorithm), r)
                    }
                    t = c.oids[e.algorithm]
                    var n = s.oidToDer(t).getBytes(),
                        a = s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, []),
                        i = s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, [])
                    i.value.push(s.create(s.Class.UNIVERSAL, s.Type.OID, !1, n)),
                        i.value.push(s.create(s.Class.UNIVERSAL, s.Type.NULL, !1, ''))
                    var o = s.create(s.Class.UNIVERSAL, s.Type.OCTETSTRING, !1, e.digest().getBytes())
                    return a.value.push(i), a.value.push(o), s.toDer(a).getBytes()
                },
                g = function (e, t, r) {
                    if (r) return e.modPow(t.e, t.n)
                    if (!t.p || !t.q) return e.modPow(t.d, t.n)
                    var i
                    t.dP || (t.dP = t.d.mod(t.p.subtract(a.ONE))),
                        t.dQ || (t.dQ = t.d.mod(t.q.subtract(a.ONE))),
                        t.qInv || (t.qInv = t.q.modInverse(t.p))
                    do {
                        i = new a(n.util.bytesToHex(n.random.getBytes(t.n.bitLength() / 8)), 16)
                    } while (i.compareTo(t.n) >= 0 || !i.gcd(t.n).equals(a.ONE))
                    for (
                        var s = (e = e.multiply(i.modPow(t.e, t.n)).mod(t.n)).mod(t.p).modPow(t.dP, t.p),
                            o = e.mod(t.q).modPow(t.dQ, t.q);
                        s.compareTo(o) < 0;

                    )
                        s = s.add(t.p)
                    var c = s.subtract(o).multiply(t.qInv).mod(t.p).multiply(t.q).add(o)
                    return (c = c.multiply(i.modInverse(t.n)).mod(t.n))
                }
            function v(e, t, r) {
                var a = n.util.createBuffer(),
                    i = Math.ceil(t.n.bitLength() / 8)
                if (e.length > i - 11) {
                    var s = new Error('Message is too long for PKCS#1 v1.5 padding.')
                    throw ((s.length = e.length), (s.max = i - 11), s)
                }
                a.putByte(0), a.putByte(r)
                var o,
                    c = i - 3 - e.length
                if (0 === r || 1 === r) {
                    o = 0 === r ? 0 : 255
                    for (var u = 0; u < c; ++u) a.putByte(o)
                } else
                    for (; c > 0; ) {
                        var l = 0,
                            p = n.random.getBytes(c)
                        for (u = 0; u < c; ++u) 0 === (o = p.charCodeAt(u)) ? ++l : a.putByte(o)
                        c = l
                    }
                return a.putByte(0), a.putBytes(e), a
            }
            function m(e, t, r, a) {
                var i = Math.ceil(t.n.bitLength() / 8),
                    s = n.util.createBuffer(e),
                    o = s.getByte(),
                    c = s.getByte()
                if (0 !== o || (r && 0 !== c && 1 !== c) || (!r && 2 != c) || (r && 0 === c && void 0 === a))
                    throw new Error('Encryption block is invalid.')
                var u = 0
                if (0 === c) {
                    u = i - 3 - a
                    for (var l = 0; l < u; ++l) if (0 !== s.getByte()) throw new Error('Encryption block is invalid.')
                } else if (1 === c)
                    for (u = 0; s.length() > 1; ) {
                        if (255 !== s.getByte()) {
                            --s.read
                            break
                        }
                        ++u
                    }
                else if (2 === c)
                    for (u = 0; s.length() > 1; ) {
                        if (0 === s.getByte()) {
                            --s.read
                            break
                        }
                        ++u
                    }
                if (0 !== s.getByte() || u !== i - 3 - s.length()) throw new Error('Encryption block is invalid.')
                return s.getBytes()
            }
            function C(e, t, r) {
                'function' == typeof t && ((r = t), (t = {}))
                var i = {
                    algorithm: {
                        name: (t = t || {}).algorithm || 'PRIMEINC',
                        options: { workers: t.workers || 2, workLoad: t.workLoad || 100, workerScript: t.workerScript },
                    },
                }
                function s() {
                    o(e.pBits, function (t, n) {
                        return t ? r(t) : ((e.p = n), null !== e.q ? u(t, e.q) : void o(e.qBits, u))
                    })
                }
                function o(e, t) {
                    n.prime.generateProbablePrime(e, i, t)
                }
                function u(t, n) {
                    if (t) return r(t)
                    if (((e.q = n), e.p.compareTo(e.q) < 0)) {
                        var i = e.p
                        ;(e.p = e.q), (e.q = i)
                    }
                    if (0 !== e.p.subtract(a.ONE).gcd(e.e).compareTo(a.ONE)) return (e.p = null), void s()
                    if (0 !== e.q.subtract(a.ONE).gcd(e.e).compareTo(a.ONE)) return (e.q = null), void o(e.qBits, u)
                    if (
                        ((e.p1 = e.p.subtract(a.ONE)),
                        (e.q1 = e.q.subtract(a.ONE)),
                        (e.phi = e.p1.multiply(e.q1)),
                        0 !== e.phi.gcd(e.e).compareTo(a.ONE))
                    )
                        return (e.p = e.q = null), void s()
                    if (((e.n = e.p.multiply(e.q)), e.n.bitLength() !== e.bits)) return (e.q = null), void o(e.qBits, u)
                    var l = e.e.modInverse(e.phi)
                    ;(e.keys = {
                        privateKey: c.rsa.setPrivateKey(
                            e.n,
                            e.e,
                            l,
                            e.p,
                            e.q,
                            l.mod(e.p1),
                            l.mod(e.q1),
                            e.q.modInverse(e.p)
                        ),
                        publicKey: c.rsa.setPublicKey(e.n, e.e),
                    }),
                        r(null, e.keys)
                }
                'prng' in t && (i.prng = t.prng), s()
            }
            function E(e) {
                var t = e.toString(16)
                t[0] >= '8' && (t = '00' + t)
                var r = n.util.hexToBytes(t)
                return r.length > 1 &&
                    ((0 === r.charCodeAt(0) && 0 == (128 & r.charCodeAt(1))) ||
                        (255 === r.charCodeAt(0) && 128 == (128 & r.charCodeAt(1))))
                    ? r.substr(1)
                    : r
            }
            function S(e) {
                return e <= 100
                    ? 27
                    : e <= 150
                    ? 18
                    : e <= 200
                    ? 15
                    : e <= 250
                    ? 12
                    : e <= 300
                    ? 9
                    : e <= 350
                    ? 8
                    : e <= 400
                    ? 7
                    : e <= 500
                    ? 6
                    : e <= 600
                    ? 5
                    : e <= 800
                    ? 4
                    : e <= 1250
                    ? 3
                    : 2
            }
            function T(e) {
                return n.util.isNodejs && 'function' == typeof i[e]
            }
            function I(e) {
                return (
                    void 0 !== o.globalScope &&
                    'object' == typeof o.globalScope.crypto &&
                    'object' == typeof o.globalScope.crypto.subtle &&
                    'function' == typeof o.globalScope.crypto.subtle[e]
                )
            }
            function b(e) {
                return (
                    void 0 !== o.globalScope &&
                    'object' == typeof o.globalScope.msCrypto &&
                    'object' == typeof o.globalScope.msCrypto.subtle &&
                    'function' == typeof o.globalScope.msCrypto.subtle[e]
                )
            }
            function A(e) {
                for (var t = n.util.hexToBytes(e.toString(16)), r = new Uint8Array(t.length), a = 0; a < t.length; ++a)
                    r[a] = t.charCodeAt(a)
                return r
            }
            ;(c.rsa.encrypt = function (e, t, r) {
                var i,
                    s = r,
                    o = Math.ceil(t.n.bitLength() / 8)
                !1 !== r && !0 !== r ? ((s = 2 === r), (i = v(e, t, r))) : (i = n.util.createBuffer()).putBytes(e)
                for (
                    var c = new a(i.toHex(), 16),
                        u = g(c, t, s).toString(16),
                        l = n.util.createBuffer(),
                        p = o - Math.ceil(u.length / 2);
                    p > 0;

                )
                    l.putByte(0), --p
                return l.putBytes(n.util.hexToBytes(u)), l.getBytes()
            }),
                (c.rsa.decrypt = function (e, t, r, i) {
                    var s = Math.ceil(t.n.bitLength() / 8)
                    if (e.length !== s) {
                        var o = new Error('Encrypted message length is invalid.')
                        throw ((o.length = e.length), (o.expected = s), o)
                    }
                    var c = new a(n.util.createBuffer(e).toHex(), 16)
                    if (c.compareTo(t.n) >= 0) throw new Error('Encrypted message is invalid.')
                    for (
                        var u = g(c, t, r).toString(16), l = n.util.createBuffer(), p = s - Math.ceil(u.length / 2);
                        p > 0;

                    )
                        l.putByte(0), --p
                    return l.putBytes(n.util.hexToBytes(u)), !1 !== i ? m(l.getBytes(), t, r) : l.getBytes()
                }),
                (c.rsa.createKeyPairGenerationState = function (e, t, r) {
                    'string' == typeof e && (e = parseInt(e, 10)), (e = e || 2048)
                    var i,
                        s = (r = r || {}).prng || n.random,
                        o = {
                            nextBytes: function (e) {
                                for (var t = s.getBytesSync(e.length), r = 0; r < e.length; ++r) e[r] = t.charCodeAt(r)
                            },
                        },
                        c = r.algorithm || 'PRIMEINC'
                    if ('PRIMEINC' !== c) throw new Error('Invalid key generation algorithm: ' + c)
                    return (
                        (i = {
                            algorithm: c,
                            state: 0,
                            bits: e,
                            rng: o,
                            eInt: t || 65537,
                            e: new a(null),
                            p: null,
                            q: null,
                            qBits: e >> 1,
                            pBits: e - (e >> 1),
                            pqState: 0,
                            num: null,
                            keys: null,
                        }).e.fromInt(i.eInt),
                        i
                    )
                }),
                (c.rsa.stepKeyPairGenerationState = function (e, t) {
                    'algorithm' in e || (e.algorithm = 'PRIMEINC')
                    var r = new a(null)
                    r.fromInt(30)
                    for (
                        var n,
                            i = 0,
                            s = function (e, t) {
                                return e | t
                            },
                            o = +new Date(),
                            l = 0;
                        null === e.keys && (t <= 0 || l < t);

                    ) {
                        if (0 === e.state) {
                            var p = null === e.p ? e.pBits : e.qBits,
                                f = p - 1
                            0 === e.pqState
                                ? ((e.num = new a(p, e.rng)),
                                  e.num.testBit(f) || e.num.bitwiseTo(a.ONE.shiftLeft(f), s, e.num),
                                  e.num.dAddOffset(31 - e.num.mod(r).byteValue(), 0),
                                  (i = 0),
                                  ++e.pqState)
                                : 1 === e.pqState
                                ? e.num.bitLength() > p
                                    ? (e.pqState = 0)
                                    : e.num.isProbablePrime(S(e.num.bitLength()))
                                    ? ++e.pqState
                                    : e.num.dAddOffset(u[i++ % 8], 0)
                                : 2 === e.pqState
                                ? (e.pqState = 0 === e.num.subtract(a.ONE).gcd(e.e).compareTo(a.ONE) ? 3 : 0)
                                : 3 === e.pqState &&
                                  ((e.pqState = 0),
                                  null === e.p ? (e.p = e.num) : (e.q = e.num),
                                  null !== e.p && null !== e.q && ++e.state,
                                  (e.num = null))
                        } else if (1 === e.state)
                            e.p.compareTo(e.q) < 0 && ((e.num = e.p), (e.p = e.q), (e.q = e.num)), ++e.state
                        else if (2 === e.state)
                            (e.p1 = e.p.subtract(a.ONE)),
                                (e.q1 = e.q.subtract(a.ONE)),
                                (e.phi = e.p1.multiply(e.q1)),
                                ++e.state
                        else if (3 === e.state)
                            0 === e.phi.gcd(e.e).compareTo(a.ONE)
                                ? ++e.state
                                : ((e.p = null), (e.q = null), (e.state = 0))
                        else if (4 === e.state)
                            (e.n = e.p.multiply(e.q)),
                                e.n.bitLength() === e.bits ? ++e.state : ((e.q = null), (e.state = 0))
                        else if (5 === e.state) {
                            var h = e.e.modInverse(e.phi)
                            e.keys = {
                                privateKey: c.rsa.setPrivateKey(
                                    e.n,
                                    e.e,
                                    h,
                                    e.p,
                                    e.q,
                                    h.mod(e.p1),
                                    h.mod(e.q1),
                                    e.q.modInverse(e.p)
                                ),
                                publicKey: c.rsa.setPublicKey(e.n, e.e),
                            }
                        }
                        ;(l += (n = +new Date()) - o), (o = n)
                    }
                    return null !== e.keys
                }),
                (c.rsa.generateKeyPair = function (e, t, r, a) {
                    if (
                        (1 === arguments.length
                            ? 'object' == typeof e
                                ? ((r = e), (e = void 0))
                                : 'function' == typeof e && ((a = e), (e = void 0))
                            : 2 === arguments.length
                            ? 'number' == typeof e
                                ? 'function' == typeof t
                                    ? ((a = t), (t = void 0))
                                    : 'number' != typeof t && ((r = t), (t = void 0))
                                : ((r = e), (a = t), (e = void 0), (t = void 0))
                            : 3 === arguments.length &&
                              ('number' == typeof t
                                  ? 'function' == typeof r && ((a = r), (r = void 0))
                                  : ((a = r), (r = t), (t = void 0))),
                        (r = r || {}),
                        void 0 === e && (e = r.bits || 2048),
                        void 0 === t && (t = r.e || 65537),
                        !n.options.usePureJavaScript && !r.prng && e >= 256 && e <= 16384 && (65537 === t || 3 === t))
                    )
                        if (a) {
                            if (T('generateKeyPair'))
                                return i.generateKeyPair(
                                    'rsa',
                                    {
                                        modulusLength: e,
                                        publicExponent: t,
                                        publicKeyEncoding: { type: 'spki', format: 'pem' },
                                        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
                                    },
                                    function (e, t, r) {
                                        if (e) return a(e)
                                        a(null, {
                                            privateKey: c.privateKeyFromPem(r),
                                            publicKey: c.publicKeyFromPem(t),
                                        })
                                    }
                                )
                            if (I('generateKey') && I('exportKey'))
                                return o.globalScope.crypto.subtle
                                    .generateKey(
                                        {
                                            name: 'RSASSA-PKCS1-v1_5',
                                            modulusLength: e,
                                            publicExponent: A(t),
                                            hash: { name: 'SHA-256' },
                                        },
                                        !0,
                                        ['sign', 'verify']
                                    )
                                    .then(function (e) {
                                        return o.globalScope.crypto.subtle.exportKey('pkcs8', e.privateKey)
                                    })
                                    .then(void 0, function (e) {
                                        a(e)
                                    })
                                    .then(function (e) {
                                        if (e) {
                                            var t = c.privateKeyFromAsn1(s.fromDer(n.util.createBuffer(e)))
                                            a(null, { privateKey: t, publicKey: c.setRsaPublicKey(t.n, t.e) })
                                        }
                                    })
                            if (b('generateKey') && b('exportKey')) {
                                var u = o.globalScope.msCrypto.subtle.generateKey(
                                    {
                                        name: 'RSASSA-PKCS1-v1_5',
                                        modulusLength: e,
                                        publicExponent: A(t),
                                        hash: { name: 'SHA-256' },
                                    },
                                    !0,
                                    ['sign', 'verify']
                                )
                                return (
                                    (u.oncomplete = function (e) {
                                        var t = e.target.result,
                                            r = o.globalScope.msCrypto.subtle.exportKey('pkcs8', t.privateKey)
                                        ;(r.oncomplete = function (e) {
                                            var t = e.target.result,
                                                r = c.privateKeyFromAsn1(s.fromDer(n.util.createBuffer(t)))
                                            a(null, { privateKey: r, publicKey: c.setRsaPublicKey(r.n, r.e) })
                                        }),
                                            (r.onerror = function (e) {
                                                a(e)
                                            })
                                    }),
                                    void (u.onerror = function (e) {
                                        a(e)
                                    })
                                )
                            }
                        } else if (T('generateKeyPairSync')) {
                            var l = i.generateKeyPairSync('rsa', {
                                modulusLength: e,
                                publicExponent: t,
                                publicKeyEncoding: { type: 'spki', format: 'pem' },
                                privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
                            })
                            return {
                                privateKey: c.privateKeyFromPem(l.privateKey),
                                publicKey: c.publicKeyFromPem(l.publicKey),
                            }
                        }
                    var p = c.rsa.createKeyPairGenerationState(e, t, r)
                    if (!a) return c.rsa.stepKeyPairGenerationState(p, 0), p.keys
                    C(p, r, a)
                }),
                (c.setRsaPublicKey = c.rsa.setPublicKey =
                    function (e, t) {
                        var r = {
                            n: e,
                            e: t,
                            encrypt: function (e, t, a) {
                                if (
                                    ('string' == typeof t
                                        ? (t = t.toUpperCase())
                                        : void 0 === t && (t = 'RSAES-PKCS1-V1_5'),
                                    'RSAES-PKCS1-V1_5' === t)
                                )
                                    t = {
                                        encode: function (e, t, r) {
                                            return v(e, t, 2).getBytes()
                                        },
                                    }
                                else if ('RSA-OAEP' === t || 'RSAES-OAEP' === t)
                                    t = {
                                        encode: function (e, t) {
                                            return n.pkcs1.encode_rsa_oaep(t, e, a)
                                        },
                                    }
                                else if (-1 !== ['RAW', 'NONE', 'NULL', null].indexOf(t))
                                    t = {
                                        encode: function (e) {
                                            return e
                                        },
                                    }
                                else if ('string' == typeof t)
                                    throw new Error('Unsupported encryption scheme: "' + t + '".')
                                var i = t.encode(e, r, !0)
                                return c.rsa.encrypt(i, r, !0)
                            },
                            verify: function (e, t, a, i) {
                                'string' == typeof a
                                    ? (a = a.toUpperCase())
                                    : void 0 === a && (a = 'RSASSA-PKCS1-V1_5'),
                                    void 0 === i && (i = { _parseAllDigestBytes: !0 }),
                                    '_parseAllDigestBytes' in i || (i._parseAllDigestBytes = !0),
                                    'RSASSA-PKCS1-V1_5' === a
                                        ? (a = {
                                              verify: function (e, t) {
                                                  t = m(t, r, !0)
                                                  var a = s.fromDer(t, { parseAllBytes: i._parseAllDigestBytes }),
                                                      o = {},
                                                      c = []
                                                  if (!s.validate(a, d, o, c))
                                                      throw (
                                                          (((u = new Error(
                                                              'ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value.'
                                                          )).errors = c),
                                                          u)
                                                      )
                                                  var u,
                                                      l = s.derToOid(o.algorithmIdentifier)
                                                  if (
                                                      l !== n.oids.md2 &&
                                                      l !== n.oids.md5 &&
                                                      l !== n.oids.sha1 &&
                                                      l !== n.oids.sha224 &&
                                                      l !== n.oids.sha256 &&
                                                      l !== n.oids.sha384 &&
                                                      l !== n.oids.sha512 &&
                                                      l !== n.oids['sha512-224'] &&
                                                      l !== n.oids['sha512-256']
                                                  )
                                                      throw (
                                                          (((u = new Error(
                                                              'Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier.'
                                                          )).oid = l),
                                                          u)
                                                      )
                                                  if ((l === n.oids.md2 || l === n.oids.md5) && !('parameters' in o))
                                                      throw new Error(
                                                          'ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value. Missing algorithm identifer NULL parameters.'
                                                      )
                                                  return e === o.digest
                                              },
                                          })
                                        : ('NONE' !== a && 'NULL' !== a && null !== a) ||
                                          (a = {
                                              verify: function (e, t) {
                                                  return e === (t = m(t, r, !0))
                                              },
                                          })
                                var o = c.rsa.decrypt(t, r, !0, !1)
                                return a.verify(e, o, r.n.bitLength())
                            },
                        }
                        return r
                    }),
                (c.setRsaPrivateKey = c.rsa.setPrivateKey =
                    function (e, t, r, a, i, s, o, u) {
                        var l = {
                            n: e,
                            e: t,
                            d: r,
                            p: a,
                            q: i,
                            dP: s,
                            dQ: o,
                            qInv: u,
                            decrypt: function (e, t, r) {
                                'string' == typeof t ? (t = t.toUpperCase()) : void 0 === t && (t = 'RSAES-PKCS1-V1_5')
                                var a = c.rsa.decrypt(e, l, !1, !1)
                                if ('RSAES-PKCS1-V1_5' === t) t = { decode: m }
                                else if ('RSA-OAEP' === t || 'RSAES-OAEP' === t)
                                    t = {
                                        decode: function (e, t) {
                                            return n.pkcs1.decode_rsa_oaep(t, e, r)
                                        },
                                    }
                                else {
                                    if (-1 === ['RAW', 'NONE', 'NULL', null].indexOf(t))
                                        throw new Error('Unsupported encryption scheme: "' + t + '".')
                                    t = {
                                        decode: function (e) {
                                            return e
                                        },
                                    }
                                }
                                return t.decode(a, l, !1)
                            },
                            sign: function (e, t) {
                                var r = !1
                                'string' == typeof t && (t = t.toUpperCase()),
                                    void 0 === t || 'RSASSA-PKCS1-V1_5' === t
                                        ? ((t = { encode: y }), (r = 1))
                                        : ('NONE' !== t && 'NULL' !== t && null !== t) ||
                                          ((t = {
                                              encode: function () {
                                                  return e
                                              },
                                          }),
                                          (r = 1))
                                var n = t.encode(e, l.n.bitLength())
                                return c.rsa.encrypt(n, l, r)
                            },
                        }
                        return l
                    }),
                (c.wrapRsaPrivateKey = function (e) {
                    return s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, [
                        s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, s.integerToDer(0).getBytes()),
                        s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, [
                            s.create(s.Class.UNIVERSAL, s.Type.OID, !1, s.oidToDer(c.oids.rsaEncryption).getBytes()),
                            s.create(s.Class.UNIVERSAL, s.Type.NULL, !1, ''),
                        ]),
                        s.create(s.Class.UNIVERSAL, s.Type.OCTETSTRING, !1, s.toDer(e).getBytes()),
                    ])
                }),
                (c.privateKeyFromAsn1 = function (e) {
                    var t,
                        r,
                        i,
                        o,
                        u,
                        f,
                        h,
                        d,
                        y = {},
                        g = []
                    if (
                        (s.validate(e, l, y, g) && (e = s.fromDer(n.util.createBuffer(y.privateKey))),
                        (y = {}),
                        (g = []),
                        !s.validate(e, p, y, g))
                    ) {
                        var v = new Error('Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.')
                        throw ((v.errors = g), v)
                    }
                    return (
                        (t = n.util.createBuffer(y.privateKeyModulus).toHex()),
                        (r = n.util.createBuffer(y.privateKeyPublicExponent).toHex()),
                        (i = n.util.createBuffer(y.privateKeyPrivateExponent).toHex()),
                        (o = n.util.createBuffer(y.privateKeyPrime1).toHex()),
                        (u = n.util.createBuffer(y.privateKeyPrime2).toHex()),
                        (f = n.util.createBuffer(y.privateKeyExponent1).toHex()),
                        (h = n.util.createBuffer(y.privateKeyExponent2).toHex()),
                        (d = n.util.createBuffer(y.privateKeyCoefficient).toHex()),
                        c.setRsaPrivateKey(
                            new a(t, 16),
                            new a(r, 16),
                            new a(i, 16),
                            new a(o, 16),
                            new a(u, 16),
                            new a(f, 16),
                            new a(h, 16),
                            new a(d, 16)
                        )
                    )
                }),
                (c.privateKeyToAsn1 = c.privateKeyToRSAPrivateKey =
                    function (e) {
                        return s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, [
                            s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, s.integerToDer(0).getBytes()),
                            s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, E(e.n)),
                            s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, E(e.e)),
                            s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, E(e.d)),
                            s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, E(e.p)),
                            s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, E(e.q)),
                            s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, E(e.dP)),
                            s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, E(e.dQ)),
                            s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, E(e.qInv)),
                        ])
                    }),
                (c.publicKeyFromAsn1 = function (e) {
                    var t = {},
                        r = []
                    if (s.validate(e, h, t, r)) {
                        var i,
                            o = s.derToOid(t.publicKeyOid)
                        if (o !== c.oids.rsaEncryption)
                            throw (((i = new Error('Cannot read public key. Unknown OID.')).oid = o), i)
                        e = t.rsaPublicKey
                    }
                    if (((r = []), !s.validate(e, f, t, r)))
                        throw (
                            (((i = new Error(
                                'Cannot read public key. ASN.1 object does not contain an RSAPublicKey.'
                            )).errors = r),
                            i)
                        )
                    var u = n.util.createBuffer(t.publicKeyModulus).toHex(),
                        l = n.util.createBuffer(t.publicKeyExponent).toHex()
                    return c.setRsaPublicKey(new a(u, 16), new a(l, 16))
                }),
                (c.publicKeyToAsn1 = c.publicKeyToSubjectPublicKeyInfo =
                    function (e) {
                        return s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, [
                            s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, [
                                s.create(
                                    s.Class.UNIVERSAL,
                                    s.Type.OID,
                                    !1,
                                    s.oidToDer(c.oids.rsaEncryption).getBytes()
                                ),
                                s.create(s.Class.UNIVERSAL, s.Type.NULL, !1, ''),
                            ]),
                            s.create(s.Class.UNIVERSAL, s.Type.BITSTRING, !1, [c.publicKeyToRSAPublicKey(e)]),
                        ])
                    }),
                (c.publicKeyToRSAPublicKey = function (e) {
                    return s.create(s.Class.UNIVERSAL, s.Type.SEQUENCE, !0, [
                        s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, E(e.n)),
                        s.create(s.Class.UNIVERSAL, s.Type.INTEGER, !1, E(e.e)),
                    ])
                })
        },
        function (e, t, r) {
            var n,
                a = r(0)
            e.exports = a.jsbn = a.jsbn || {}
            function i(e, t, r) {
                ;(this.data = []),
                    null != e &&
                        ('number' == typeof e
                            ? this.fromNumber(e, t, r)
                            : null == t && 'string' != typeof e
                            ? this.fromString(e, 256)
                            : this.fromString(e, t))
            }
            function s() {
                return new i(null)
            }
            function o(e, t, r, n, a, i) {
                for (var s = 16383 & t, o = t >> 14; --i >= 0; ) {
                    var c = 16383 & this.data[e],
                        u = this.data[e++] >> 14,
                        l = o * c + u * s
                    ;(a = ((c = s * c + ((16383 & l) << 14) + r.data[n] + a) >> 28) + (l >> 14) + o * u),
                        (r.data[n++] = 268435455 & c)
                }
                return a
            }
            ;(a.jsbn.BigInteger = i),
                'undefined' == typeof navigator
                    ? ((i.prototype.am = o), (n = 28))
                    : 'Microsoft Internet Explorer' == navigator.appName
                    ? ((i.prototype.am = function (e, t, r, n, a, i) {
                          for (var s = 32767 & t, o = t >> 15; --i >= 0; ) {
                              var c = 32767 & this.data[e],
                                  u = this.data[e++] >> 15,
                                  l = o * c + u * s
                              ;(a =
                                  ((c = s * c + ((32767 & l) << 15) + r.data[n] + (1073741823 & a)) >>> 30) +
                                  (l >>> 15) +
                                  o * u +
                                  (a >>> 30)),
                                  (r.data[n++] = 1073741823 & c)
                          }
                          return a
                      }),
                      (n = 30))
                    : 'Netscape' != navigator.appName
                    ? ((i.prototype.am = function (e, t, r, n, a, i) {
                          for (; --i >= 0; ) {
                              var s = t * this.data[e++] + r.data[n] + a
                              ;(a = Math.floor(s / 67108864)), (r.data[n++] = 67108863 & s)
                          }
                          return a
                      }),
                      (n = 26))
                    : ((i.prototype.am = o), (n = 28)),
                (i.prototype.DB = n),
                (i.prototype.DM = (1 << n) - 1),
                (i.prototype.DV = 1 << n)
            ;(i.prototype.FV = Math.pow(2, 52)), (i.prototype.F1 = 52 - n), (i.prototype.F2 = 2 * n - 52)
            var c,
                u,
                l = new Array()
            for (c = '0'.charCodeAt(0), u = 0; u <= 9; ++u) l[c++] = u
            for (c = 'a'.charCodeAt(0), u = 10; u < 36; ++u) l[c++] = u
            for (c = 'A'.charCodeAt(0), u = 10; u < 36; ++u) l[c++] = u
            function p(e) {
                return '0123456789abcdefghijklmnopqrstuvwxyz'.charAt(e)
            }
            function f(e, t) {
                var r = l[e.charCodeAt(t)]
                return null == r ? -1 : r
            }
            function h(e) {
                var t = s()
                return t.fromInt(e), t
            }
            function d(e) {
                var t,
                    r = 1
                return (
                    0 != (t = e >>> 16) && ((e = t), (r += 16)),
                    0 != (t = e >> 8) && ((e = t), (r += 8)),
                    0 != (t = e >> 4) && ((e = t), (r += 4)),
                    0 != (t = e >> 2) && ((e = t), (r += 2)),
                    0 != (t = e >> 1) && ((e = t), (r += 1)),
                    r
                )
            }
            function y(e) {
                this.m = e
            }
            function g(e) {
                ;(this.m = e),
                    (this.mp = e.invDigit()),
                    (this.mpl = 32767 & this.mp),
                    (this.mph = this.mp >> 15),
                    (this.um = (1 << (e.DB - 15)) - 1),
                    (this.mt2 = 2 * e.t)
            }
            function v(e, t) {
                return e & t
            }
            function m(e, t) {
                return e | t
            }
            function C(e, t) {
                return e ^ t
            }
            function E(e, t) {
                return e & ~t
            }
            function S(e) {
                if (0 == e) return -1
                var t = 0
                return (
                    0 == (65535 & e) && ((e >>= 16), (t += 16)),
                    0 == (255 & e) && ((e >>= 8), (t += 8)),
                    0 == (15 & e) && ((e >>= 4), (t += 4)),
                    0 == (3 & e) && ((e >>= 2), (t += 2)),
                    0 == (1 & e) && ++t,
                    t
                )
            }
            function T(e) {
                for (var t = 0; 0 != e; ) (e &= e - 1), ++t
                return t
            }
            function I() {}
            function b(e) {
                return e
            }
            function A(e) {
                ;(this.r2 = s()),
                    (this.q3 = s()),
                    i.ONE.dlShiftTo(2 * e.t, this.r2),
                    (this.mu = this.r2.divide(e)),
                    (this.m = e)
            }
            ;(y.prototype.convert = function (e) {
                return e.s < 0 || e.compareTo(this.m) >= 0 ? e.mod(this.m) : e
            }),
                (y.prototype.revert = function (e) {
                    return e
                }),
                (y.prototype.reduce = function (e) {
                    e.divRemTo(this.m, null, e)
                }),
                (y.prototype.mulTo = function (e, t, r) {
                    e.multiplyTo(t, r), this.reduce(r)
                }),
                (y.prototype.sqrTo = function (e, t) {
                    e.squareTo(t), this.reduce(t)
                }),
                (g.prototype.convert = function (e) {
                    var t = s()
                    return (
                        e.abs().dlShiftTo(this.m.t, t),
                        t.divRemTo(this.m, null, t),
                        e.s < 0 && t.compareTo(i.ZERO) > 0 && this.m.subTo(t, t),
                        t
                    )
                }),
                (g.prototype.revert = function (e) {
                    var t = s()
                    return e.copyTo(t), this.reduce(t), t
                }),
                (g.prototype.reduce = function (e) {
                    for (; e.t <= this.mt2; ) e.data[e.t++] = 0
                    for (var t = 0; t < this.m.t; ++t) {
                        var r = 32767 & e.data[t],
                            n =
                                (r * this.mpl + (((r * this.mph + (e.data[t] >> 15) * this.mpl) & this.um) << 15)) &
                                e.DM
                        for (r = t + this.m.t, e.data[r] += this.m.am(0, n, e, t, 0, this.m.t); e.data[r] >= e.DV; )
                            (e.data[r] -= e.DV), e.data[++r]++
                    }
                    e.clamp(), e.drShiftTo(this.m.t, e), e.compareTo(this.m) >= 0 && e.subTo(this.m, e)
                }),
                (g.prototype.mulTo = function (e, t, r) {
                    e.multiplyTo(t, r), this.reduce(r)
                }),
                (g.prototype.sqrTo = function (e, t) {
                    e.squareTo(t), this.reduce(t)
                }),
                (i.prototype.copyTo = function (e) {
                    for (var t = this.t - 1; t >= 0; --t) e.data[t] = this.data[t]
                    ;(e.t = this.t), (e.s = this.s)
                }),
                (i.prototype.fromInt = function (e) {
                    ;(this.t = 1),
                        (this.s = e < 0 ? -1 : 0),
                        e > 0 ? (this.data[0] = e) : e < -1 ? (this.data[0] = e + this.DV) : (this.t = 0)
                }),
                (i.prototype.fromString = function (e, t) {
                    var r
                    if (16 == t) r = 4
                    else if (8 == t) r = 3
                    else if (256 == t) r = 8
                    else if (2 == t) r = 1
                    else if (32 == t) r = 5
                    else {
                        if (4 != t) return void this.fromRadix(e, t)
                        r = 2
                    }
                    ;(this.t = 0), (this.s = 0)
                    for (var n = e.length, a = !1, s = 0; --n >= 0; ) {
                        var o = 8 == r ? 255 & e[n] : f(e, n)
                        o < 0
                            ? '-' == e.charAt(n) && (a = !0)
                            : ((a = !1),
                              0 == s
                                  ? (this.data[this.t++] = o)
                                  : s + r > this.DB
                                  ? ((this.data[this.t - 1] |= (o & ((1 << (this.DB - s)) - 1)) << s),
                                    (this.data[this.t++] = o >> (this.DB - s)))
                                  : (this.data[this.t - 1] |= o << s),
                              (s += r) >= this.DB && (s -= this.DB))
                    }
                    8 == r &&
                        0 != (128 & e[0]) &&
                        ((this.s = -1), s > 0 && (this.data[this.t - 1] |= ((1 << (this.DB - s)) - 1) << s)),
                        this.clamp(),
                        a && i.ZERO.subTo(this, this)
                }),
                (i.prototype.clamp = function () {
                    for (var e = this.s & this.DM; this.t > 0 && this.data[this.t - 1] == e; ) --this.t
                }),
                (i.prototype.dlShiftTo = function (e, t) {
                    var r
                    for (r = this.t - 1; r >= 0; --r) t.data[r + e] = this.data[r]
                    for (r = e - 1; r >= 0; --r) t.data[r] = 0
                    ;(t.t = this.t + e), (t.s = this.s)
                }),
                (i.prototype.drShiftTo = function (e, t) {
                    for (var r = e; r < this.t; ++r) t.data[r - e] = this.data[r]
                    ;(t.t = Math.max(this.t - e, 0)), (t.s = this.s)
                }),
                (i.prototype.lShiftTo = function (e, t) {
                    var r,
                        n = e % this.DB,
                        a = this.DB - n,
                        i = (1 << a) - 1,
                        s = Math.floor(e / this.DB),
                        o = (this.s << n) & this.DM
                    for (r = this.t - 1; r >= 0; --r)
                        (t.data[r + s + 1] = (this.data[r] >> a) | o), (o = (this.data[r] & i) << n)
                    for (r = s - 1; r >= 0; --r) t.data[r] = 0
                    ;(t.data[s] = o), (t.t = this.t + s + 1), (t.s = this.s), t.clamp()
                }),
                (i.prototype.rShiftTo = function (e, t) {
                    t.s = this.s
                    var r = Math.floor(e / this.DB)
                    if (r >= this.t) t.t = 0
                    else {
                        var n = e % this.DB,
                            a = this.DB - n,
                            i = (1 << n) - 1
                        t.data[0] = this.data[r] >> n
                        for (var s = r + 1; s < this.t; ++s)
                            (t.data[s - r - 1] |= (this.data[s] & i) << a), (t.data[s - r] = this.data[s] >> n)
                        n > 0 && (t.data[this.t - r - 1] |= (this.s & i) << a), (t.t = this.t - r), t.clamp()
                    }
                }),
                (i.prototype.subTo = function (e, t) {
                    for (var r = 0, n = 0, a = Math.min(e.t, this.t); r < a; )
                        (n += this.data[r] - e.data[r]), (t.data[r++] = n & this.DM), (n >>= this.DB)
                    if (e.t < this.t) {
                        for (n -= e.s; r < this.t; ) (n += this.data[r]), (t.data[r++] = n & this.DM), (n >>= this.DB)
                        n += this.s
                    } else {
                        for (n += this.s; r < e.t; ) (n -= e.data[r]), (t.data[r++] = n & this.DM), (n >>= this.DB)
                        n -= e.s
                    }
                    ;(t.s = n < 0 ? -1 : 0),
                        n < -1 ? (t.data[r++] = this.DV + n) : n > 0 && (t.data[r++] = n),
                        (t.t = r),
                        t.clamp()
                }),
                (i.prototype.multiplyTo = function (e, t) {
                    var r = this.abs(),
                        n = e.abs(),
                        a = r.t
                    for (t.t = a + n.t; --a >= 0; ) t.data[a] = 0
                    for (a = 0; a < n.t; ++a) t.data[a + r.t] = r.am(0, n.data[a], t, a, 0, r.t)
                    ;(t.s = 0), t.clamp(), this.s != e.s && i.ZERO.subTo(t, t)
                }),
                (i.prototype.squareTo = function (e) {
                    for (var t = this.abs(), r = (e.t = 2 * t.t); --r >= 0; ) e.data[r] = 0
                    for (r = 0; r < t.t - 1; ++r) {
                        var n = t.am(r, t.data[r], e, 2 * r, 0, 1)
                        ;(e.data[r + t.t] += t.am(r + 1, 2 * t.data[r], e, 2 * r + 1, n, t.t - r - 1)) >= t.DV &&
                            ((e.data[r + t.t] -= t.DV), (e.data[r + t.t + 1] = 1))
                    }
                    e.t > 0 && (e.data[e.t - 1] += t.am(r, t.data[r], e, 2 * r, 0, 1)), (e.s = 0), e.clamp()
                }),
                (i.prototype.divRemTo = function (e, t, r) {
                    var n = e.abs()
                    if (!(n.t <= 0)) {
                        var a = this.abs()
                        if (a.t < n.t) return null != t && t.fromInt(0), void (null != r && this.copyTo(r))
                        null == r && (r = s())
                        var o = s(),
                            c = this.s,
                            u = e.s,
                            l = this.DB - d(n.data[n.t - 1])
                        l > 0 ? (n.lShiftTo(l, o), a.lShiftTo(l, r)) : (n.copyTo(o), a.copyTo(r))
                        var p = o.t,
                            f = o.data[p - 1]
                        if (0 != f) {
                            var h = f * (1 << this.F1) + (p > 1 ? o.data[p - 2] >> this.F2 : 0),
                                y = this.FV / h,
                                g = (1 << this.F1) / h,
                                v = 1 << this.F2,
                                m = r.t,
                                C = m - p,
                                E = null == t ? s() : t
                            for (
                                o.dlShiftTo(C, E),
                                    r.compareTo(E) >= 0 && ((r.data[r.t++] = 1), r.subTo(E, r)),
                                    i.ONE.dlShiftTo(p, E),
                                    E.subTo(o, o);
                                o.t < p;

                            )
                                o.data[o.t++] = 0
                            for (; --C >= 0; ) {
                                var S = r.data[--m] == f ? this.DM : Math.floor(r.data[m] * y + (r.data[m - 1] + v) * g)
                                if ((r.data[m] += o.am(0, S, r, C, 0, p)) < S)
                                    for (o.dlShiftTo(C, E), r.subTo(E, r); r.data[m] < --S; ) r.subTo(E, r)
                            }
                            null != t && (r.drShiftTo(p, t), c != u && i.ZERO.subTo(t, t)),
                                (r.t = p),
                                r.clamp(),
                                l > 0 && r.rShiftTo(l, r),
                                c < 0 && i.ZERO.subTo(r, r)
                        }
                    }
                }),
                (i.prototype.invDigit = function () {
                    if (this.t < 1) return 0
                    var e = this.data[0]
                    if (0 == (1 & e)) return 0
                    var t = 3 & e
                    return (t =
                        ((t =
                            ((t = ((t = (t * (2 - (15 & e) * t)) & 15) * (2 - (255 & e) * t)) & 255) *
                                (2 - (((65535 & e) * t) & 65535))) &
                            65535) *
                            (2 - ((e * t) % this.DV))) %
                        this.DV) > 0
                        ? this.DV - t
                        : -t
                }),
                (i.prototype.isEven = function () {
                    return 0 == (this.t > 0 ? 1 & this.data[0] : this.s)
                }),
                (i.prototype.exp = function (e, t) {
                    if (e > 4294967295 || e < 1) return i.ONE
                    var r = s(),
                        n = s(),
                        a = t.convert(this),
                        o = d(e) - 1
                    for (a.copyTo(r); --o >= 0; )
                        if ((t.sqrTo(r, n), (e & (1 << o)) > 0)) t.mulTo(n, a, r)
                        else {
                            var c = r
                            ;(r = n), (n = c)
                        }
                    return t.revert(r)
                }),
                (i.prototype.toString = function (e) {
                    if (this.s < 0) return '-' + this.negate().toString(e)
                    var t
                    if (16 == e) t = 4
                    else if (8 == e) t = 3
                    else if (2 == e) t = 1
                    else if (32 == e) t = 5
                    else {
                        if (4 != e) return this.toRadix(e)
                        t = 2
                    }
                    var r,
                        n = (1 << t) - 1,
                        a = !1,
                        i = '',
                        s = this.t,
                        o = this.DB - ((s * this.DB) % t)
                    if (s-- > 0)
                        for (o < this.DB && (r = this.data[s] >> o) > 0 && ((a = !0), (i = p(r))); s >= 0; )
                            o < t
                                ? ((r = (this.data[s] & ((1 << o) - 1)) << (t - o)),
                                  (r |= this.data[--s] >> (o += this.DB - t)))
                                : ((r = (this.data[s] >> (o -= t)) & n), o <= 0 && ((o += this.DB), --s)),
                                r > 0 && (a = !0),
                                a && (i += p(r))
                    return a ? i : '0'
                }),
                (i.prototype.negate = function () {
                    var e = s()
                    return i.ZERO.subTo(this, e), e
                }),
                (i.prototype.abs = function () {
                    return this.s < 0 ? this.negate() : this
                }),
                (i.prototype.compareTo = function (e) {
                    var t = this.s - e.s
                    if (0 != t) return t
                    var r = this.t
                    if (0 != (t = r - e.t)) return this.s < 0 ? -t : t
                    for (; --r >= 0; ) if (0 != (t = this.data[r] - e.data[r])) return t
                    return 0
                }),
                (i.prototype.bitLength = function () {
                    return this.t <= 0 ? 0 : this.DB * (this.t - 1) + d(this.data[this.t - 1] ^ (this.s & this.DM))
                }),
                (i.prototype.mod = function (e) {
                    var t = s()
                    return this.abs().divRemTo(e, null, t), this.s < 0 && t.compareTo(i.ZERO) > 0 && e.subTo(t, t), t
                }),
                (i.prototype.modPowInt = function (e, t) {
                    var r
                    return (r = e < 256 || t.isEven() ? new y(t) : new g(t)), this.exp(e, r)
                }),
                (i.ZERO = h(0)),
                (i.ONE = h(1)),
                (I.prototype.convert = b),
                (I.prototype.revert = b),
                (I.prototype.mulTo = function (e, t, r) {
                    e.multiplyTo(t, r)
                }),
                (I.prototype.sqrTo = function (e, t) {
                    e.squareTo(t)
                }),
                (A.prototype.convert = function (e) {
                    if (e.s < 0 || e.t > 2 * this.m.t) return e.mod(this.m)
                    if (e.compareTo(this.m) < 0) return e
                    var t = s()
                    return e.copyTo(t), this.reduce(t), t
                }),
                (A.prototype.revert = function (e) {
                    return e
                }),
                (A.prototype.reduce = function (e) {
                    for (
                        e.drShiftTo(this.m.t - 1, this.r2),
                            e.t > this.m.t + 1 && ((e.t = this.m.t + 1), e.clamp()),
                            this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
                            this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
                        e.compareTo(this.r2) < 0;

                    )
                        e.dAddOffset(1, this.m.t + 1)
                    for (e.subTo(this.r2, e); e.compareTo(this.m) >= 0; ) e.subTo(this.m, e)
                }),
                (A.prototype.mulTo = function (e, t, r) {
                    e.multiplyTo(t, r), this.reduce(r)
                }),
                (A.prototype.sqrTo = function (e, t) {
                    e.squareTo(t), this.reduce(t)
                })
            var B = [
                    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101,
                    103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199,
                    211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
                    331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443,
                    449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509,
                ],
                N = (1 << 26) / B[B.length - 1]
            ;(i.prototype.chunkSize = function (e) {
                return Math.floor((Math.LN2 * this.DB) / Math.log(e))
            }),
                (i.prototype.toRadix = function (e) {
                    if ((null == e && (e = 10), 0 == this.signum() || e < 2 || e > 36)) return '0'
                    var t = this.chunkSize(e),
                        r = Math.pow(e, t),
                        n = h(r),
                        a = s(),
                        i = s(),
                        o = ''
                    for (this.divRemTo(n, a, i); a.signum() > 0; )
                        (o = (r + i.intValue()).toString(e).substr(1) + o), a.divRemTo(n, a, i)
                    return i.intValue().toString(e) + o
                }),
                (i.prototype.fromRadix = function (e, t) {
                    this.fromInt(0), null == t && (t = 10)
                    for (
                        var r = this.chunkSize(t), n = Math.pow(t, r), a = !1, s = 0, o = 0, c = 0;
                        c < e.length;
                        ++c
                    ) {
                        var u = f(e, c)
                        u < 0
                            ? '-' == e.charAt(c) && 0 == this.signum() && (a = !0)
                            : ((o = t * o + u),
                              ++s >= r && (this.dMultiply(n), this.dAddOffset(o, 0), (s = 0), (o = 0)))
                    }
                    s > 0 && (this.dMultiply(Math.pow(t, s)), this.dAddOffset(o, 0)), a && i.ZERO.subTo(this, this)
                }),
                (i.prototype.fromNumber = function (e, t, r) {
                    if ('number' == typeof t)
                        if (e < 2) this.fromInt(1)
                        else
                            for (
                                this.fromNumber(e, r),
                                    this.testBit(e - 1) || this.bitwiseTo(i.ONE.shiftLeft(e - 1), m, this),
                                    this.isEven() && this.dAddOffset(1, 0);
                                !this.isProbablePrime(t);

                            )
                                this.dAddOffset(2, 0), this.bitLength() > e && this.subTo(i.ONE.shiftLeft(e - 1), this)
                    else {
                        var n = new Array(),
                            a = 7 & e
                        ;(n.length = 1 + (e >> 3)),
                            t.nextBytes(n),
                            a > 0 ? (n[0] &= (1 << a) - 1) : (n[0] = 0),
                            this.fromString(n, 256)
                    }
                }),
                (i.prototype.bitwiseTo = function (e, t, r) {
                    var n,
                        a,
                        i = Math.min(e.t, this.t)
                    for (n = 0; n < i; ++n) r.data[n] = t(this.data[n], e.data[n])
                    if (e.t < this.t) {
                        for (a = e.s & this.DM, n = i; n < this.t; ++n) r.data[n] = t(this.data[n], a)
                        r.t = this.t
                    } else {
                        for (a = this.s & this.DM, n = i; n < e.t; ++n) r.data[n] = t(a, e.data[n])
                        r.t = e.t
                    }
                    ;(r.s = t(this.s, e.s)), r.clamp()
                }),
                (i.prototype.changeBit = function (e, t) {
                    var r = i.ONE.shiftLeft(e)
                    return this.bitwiseTo(r, t, r), r
                }),
                (i.prototype.addTo = function (e, t) {
                    for (var r = 0, n = 0, a = Math.min(e.t, this.t); r < a; )
                        (n += this.data[r] + e.data[r]), (t.data[r++] = n & this.DM), (n >>= this.DB)
                    if (e.t < this.t) {
                        for (n += e.s; r < this.t; ) (n += this.data[r]), (t.data[r++] = n & this.DM), (n >>= this.DB)
                        n += this.s
                    } else {
                        for (n += this.s; r < e.t; ) (n += e.data[r]), (t.data[r++] = n & this.DM), (n >>= this.DB)
                        n += e.s
                    }
                    ;(t.s = n < 0 ? -1 : 0),
                        n > 0 ? (t.data[r++] = n) : n < -1 && (t.data[r++] = this.DV + n),
                        (t.t = r),
                        t.clamp()
                }),
                (i.prototype.dMultiply = function (e) {
                    ;(this.data[this.t] = this.am(0, e - 1, this, 0, 0, this.t)), ++this.t, this.clamp()
                }),
                (i.prototype.dAddOffset = function (e, t) {
                    if (0 != e) {
                        for (; this.t <= t; ) this.data[this.t++] = 0
                        for (this.data[t] += e; this.data[t] >= this.DV; )
                            (this.data[t] -= this.DV), ++t >= this.t && (this.data[this.t++] = 0), ++this.data[t]
                    }
                }),
                (i.prototype.multiplyLowerTo = function (e, t, r) {
                    var n,
                        a = Math.min(this.t + e.t, t)
                    for (r.s = 0, r.t = a; a > 0; ) r.data[--a] = 0
                    for (n = r.t - this.t; a < n; ++a) r.data[a + this.t] = this.am(0, e.data[a], r, a, 0, this.t)
                    for (n = Math.min(e.t, t); a < n; ++a) this.am(0, e.data[a], r, a, 0, t - a)
                    r.clamp()
                }),
                (i.prototype.multiplyUpperTo = function (e, t, r) {
                    --t
                    var n = (r.t = this.t + e.t - t)
                    for (r.s = 0; --n >= 0; ) r.data[n] = 0
                    for (n = Math.max(t - this.t, 0); n < e.t; ++n)
                        r.data[this.t + n - t] = this.am(t - n, e.data[n], r, 0, 0, this.t + n - t)
                    r.clamp(), r.drShiftTo(1, r)
                }),
                (i.prototype.modInt = function (e) {
                    if (e <= 0) return 0
                    var t = this.DV % e,
                        r = this.s < 0 ? e - 1 : 0
                    if (this.t > 0)
                        if (0 == t) r = this.data[0] % e
                        else for (var n = this.t - 1; n >= 0; --n) r = (t * r + this.data[n]) % e
                    return r
                }),
                (i.prototype.millerRabin = function (e) {
                    var t = this.subtract(i.ONE),
                        r = t.getLowestSetBit()
                    if (r <= 0) return !1
                    for (
                        var n,
                            a = t.shiftRight(r),
                            s = {
                                nextBytes: function (e) {
                                    for (var t = 0; t < e.length; ++t) e[t] = Math.floor(256 * Math.random())
                                },
                            },
                            o = 0;
                        o < e;
                        ++o
                    ) {
                        do {
                            n = new i(this.bitLength(), s)
                        } while (n.compareTo(i.ONE) <= 0 || n.compareTo(t) >= 0)
                        var c = n.modPow(a, this)
                        if (0 != c.compareTo(i.ONE) && 0 != c.compareTo(t)) {
                            for (var u = 1; u++ < r && 0 != c.compareTo(t); )
                                if (0 == (c = c.modPowInt(2, this)).compareTo(i.ONE)) return !1
                            if (0 != c.compareTo(t)) return !1
                        }
                    }
                    return !0
                }),
                (i.prototype.clone = function () {
                    var e = s()
                    return this.copyTo(e), e
                }),
                (i.prototype.intValue = function () {
                    if (this.s < 0) {
                        if (1 == this.t) return this.data[0] - this.DV
                        if (0 == this.t) return -1
                    } else {
                        if (1 == this.t) return this.data[0]
                        if (0 == this.t) return 0
                    }
                    return ((this.data[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this.data[0]
                }),
                (i.prototype.byteValue = function () {
                    return 0 == this.t ? this.s : (this.data[0] << 24) >> 24
                }),
                (i.prototype.shortValue = function () {
                    return 0 == this.t ? this.s : (this.data[0] << 16) >> 16
                }),
                (i.prototype.signum = function () {
                    return this.s < 0 ? -1 : this.t <= 0 || (1 == this.t && this.data[0] <= 0) ? 0 : 1
                }),
                (i.prototype.toByteArray = function () {
                    var e = this.t,
                        t = new Array()
                    t[0] = this.s
                    var r,
                        n = this.DB - ((e * this.DB) % 8),
                        a = 0
                    if (e-- > 0)
                        for (
                            n < this.DB &&
                            (r = this.data[e] >> n) != (this.s & this.DM) >> n &&
                            (t[a++] = r | (this.s << (this.DB - n)));
                            e >= 0;

                        )
                            n < 8
                                ? ((r = (this.data[e] & ((1 << n) - 1)) << (8 - n)),
                                  (r |= this.data[--e] >> (n += this.DB - 8)))
                                : ((r = (this.data[e] >> (n -= 8)) & 255), n <= 0 && ((n += this.DB), --e)),
                                0 != (128 & r) && (r |= -256),
                                0 == a && (128 & this.s) != (128 & r) && ++a,
                                (a > 0 || r != this.s) && (t[a++] = r)
                    return t
                }),
                (i.prototype.equals = function (e) {
                    return 0 == this.compareTo(e)
                }),
                (i.prototype.min = function (e) {
                    return this.compareTo(e) < 0 ? this : e
                }),
                (i.prototype.max = function (e) {
                    return this.compareTo(e) > 0 ? this : e
                }),
                (i.prototype.and = function (e) {
                    var t = s()
                    return this.bitwiseTo(e, v, t), t
                }),
                (i.prototype.or = function (e) {
                    var t = s()
                    return this.bitwiseTo(e, m, t), t
                }),
                (i.prototype.xor = function (e) {
                    var t = s()
                    return this.bitwiseTo(e, C, t), t
                }),
                (i.prototype.andNot = function (e) {
                    var t = s()
                    return this.bitwiseTo(e, E, t), t
                }),
                (i.prototype.not = function () {
                    for (var e = s(), t = 0; t < this.t; ++t) e.data[t] = this.DM & ~this.data[t]
                    return (e.t = this.t), (e.s = ~this.s), e
                }),
                (i.prototype.shiftLeft = function (e) {
                    var t = s()
                    return e < 0 ? this.rShiftTo(-e, t) : this.lShiftTo(e, t), t
                }),
                (i.prototype.shiftRight = function (e) {
                    var t = s()
                    return e < 0 ? this.lShiftTo(-e, t) : this.rShiftTo(e, t), t
                }),
                (i.prototype.getLowestSetBit = function () {
                    for (var e = 0; e < this.t; ++e) if (0 != this.data[e]) return e * this.DB + S(this.data[e])
                    return this.s < 0 ? this.t * this.DB : -1
                }),
                (i.prototype.bitCount = function () {
                    for (var e = 0, t = this.s & this.DM, r = 0; r < this.t; ++r) e += T(this.data[r] ^ t)
                    return e
                }),
                (i.prototype.testBit = function (e) {
                    var t = Math.floor(e / this.DB)
                    return t >= this.t ? 0 != this.s : 0 != (this.data[t] & (1 << e % this.DB))
                }),
                (i.prototype.setBit = function (e) {
                    return this.changeBit(e, m)
                }),
                (i.prototype.clearBit = function (e) {
                    return this.changeBit(e, E)
                }),
                (i.prototype.flipBit = function (e) {
                    return this.changeBit(e, C)
                }),
                (i.prototype.add = function (e) {
                    var t = s()
                    return this.addTo(e, t), t
                }),
                (i.prototype.subtract = function (e) {
                    var t = s()
                    return this.subTo(e, t), t
                }),
                (i.prototype.multiply = function (e) {
                    var t = s()
                    return this.multiplyTo(e, t), t
                }),
                (i.prototype.divide = function (e) {
                    var t = s()
                    return this.divRemTo(e, t, null), t
                }),
                (i.prototype.remainder = function (e) {
                    var t = s()
                    return this.divRemTo(e, null, t), t
                }),
                (i.prototype.divideAndRemainder = function (e) {
                    var t = s(),
                        r = s()
                    return this.divRemTo(e, t, r), new Array(t, r)
                }),
                (i.prototype.modPow = function (e, t) {
                    var r,
                        n,
                        a = e.bitLength(),
                        i = h(1)
                    if (a <= 0) return i
                    ;(r = a < 18 ? 1 : a < 48 ? 3 : a < 144 ? 4 : a < 768 ? 5 : 6),
                        (n = a < 8 ? new y(t) : t.isEven() ? new A(t) : new g(t))
                    var o = new Array(),
                        c = 3,
                        u = r - 1,
                        l = (1 << r) - 1
                    if (((o[1] = n.convert(this)), r > 1)) {
                        var p = s()
                        for (n.sqrTo(o[1], p); c <= l; ) (o[c] = s()), n.mulTo(p, o[c - 2], o[c]), (c += 2)
                    }
                    var f,
                        v,
                        m = e.t - 1,
                        C = !0,
                        E = s()
                    for (a = d(e.data[m]) - 1; m >= 0; ) {
                        for (
                            a >= u
                                ? (f = (e.data[m] >> (a - u)) & l)
                                : ((f = (e.data[m] & ((1 << (a + 1)) - 1)) << (u - a)),
                                  m > 0 && (f |= e.data[m - 1] >> (this.DB + a - u))),
                                c = r;
                            0 == (1 & f);

                        )
                            (f >>= 1), --c
                        if (((a -= c) < 0 && ((a += this.DB), --m), C)) o[f].copyTo(i), (C = !1)
                        else {
                            for (; c > 1; ) n.sqrTo(i, E), n.sqrTo(E, i), (c -= 2)
                            c > 0 ? n.sqrTo(i, E) : ((v = i), (i = E), (E = v)), n.mulTo(E, o[f], i)
                        }
                        for (; m >= 0 && 0 == (e.data[m] & (1 << a)); )
                            n.sqrTo(i, E), (v = i), (i = E), (E = v), --a < 0 && ((a = this.DB - 1), --m)
                    }
                    return n.revert(i)
                }),
                (i.prototype.modInverse = function (e) {
                    var t = e.isEven()
                    if ((this.isEven() && t) || 0 == e.signum()) return i.ZERO
                    for (
                        var r = e.clone(), n = this.clone(), a = h(1), s = h(0), o = h(0), c = h(1);
                        0 != r.signum();

                    ) {
                        for (; r.isEven(); )
                            r.rShiftTo(1, r),
                                t
                                    ? ((a.isEven() && s.isEven()) || (a.addTo(this, a), s.subTo(e, s)),
                                      a.rShiftTo(1, a))
                                    : s.isEven() || s.subTo(e, s),
                                s.rShiftTo(1, s)
                        for (; n.isEven(); )
                            n.rShiftTo(1, n),
                                t
                                    ? ((o.isEven() && c.isEven()) || (o.addTo(this, o), c.subTo(e, c)),
                                      o.rShiftTo(1, o))
                                    : c.isEven() || c.subTo(e, c),
                                c.rShiftTo(1, c)
                        r.compareTo(n) >= 0
                            ? (r.subTo(n, r), t && a.subTo(o, a), s.subTo(c, s))
                            : (n.subTo(r, n), t && o.subTo(a, o), c.subTo(s, c))
                    }
                    return 0 != n.compareTo(i.ONE)
                        ? i.ZERO
                        : c.compareTo(e) >= 0
                        ? c.subtract(e)
                        : c.signum() < 0
                        ? (c.addTo(e, c), c.signum() < 0 ? c.add(e) : c)
                        : c
                }),
                (i.prototype.pow = function (e) {
                    return this.exp(e, new I())
                }),
                (i.prototype.gcd = function (e) {
                    var t = this.s < 0 ? this.negate() : this.clone(),
                        r = e.s < 0 ? e.negate() : e.clone()
                    if (t.compareTo(r) < 0) {
                        var n = t
                        ;(t = r), (r = n)
                    }
                    var a = t.getLowestSetBit(),
                        i = r.getLowestSetBit()
                    if (i < 0) return t
                    for (a < i && (i = a), i > 0 && (t.rShiftTo(i, t), r.rShiftTo(i, r)); t.signum() > 0; )
                        (a = t.getLowestSetBit()) > 0 && t.rShiftTo(a, t),
                            (a = r.getLowestSetBit()) > 0 && r.rShiftTo(a, r),
                            t.compareTo(r) >= 0 ? (t.subTo(r, t), t.rShiftTo(1, t)) : (r.subTo(t, r), r.rShiftTo(1, r))
                    return i > 0 && r.lShiftTo(i, r), r
                }),
                (i.prototype.isProbablePrime = function (e) {
                    var t,
                        r = this.abs()
                    if (1 == r.t && r.data[0] <= B[B.length - 1]) {
                        for (t = 0; t < B.length; ++t) if (r.data[0] == B[t]) return !0
                        return !1
                    }
                    if (r.isEven()) return !1
                    for (t = 1; t < B.length; ) {
                        for (var n = B[t], a = t + 1; a < B.length && n < N; ) n *= B[a++]
                        for (n = r.modInt(n); t < a; ) if (n % B[t++] == 0) return !1
                    }
                    return r.millerRabin(e)
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(1),
                (e.exports = n.cipher = n.cipher || {}),
                (n.cipher.algorithms = n.cipher.algorithms || {}),
                (n.cipher.createCipher = function (e, t) {
                    var r = e
                    if (('string' == typeof r && (r = n.cipher.getAlgorithm(r)) && (r = r()), !r))
                        throw new Error('Unsupported algorithm: ' + e)
                    return new n.cipher.BlockCipher({ algorithm: r, key: t, decrypt: !1 })
                }),
                (n.cipher.createDecipher = function (e, t) {
                    var r = e
                    if (('string' == typeof r && (r = n.cipher.getAlgorithm(r)) && (r = r()), !r))
                        throw new Error('Unsupported algorithm: ' + e)
                    return new n.cipher.BlockCipher({ algorithm: r, key: t, decrypt: !0 })
                }),
                (n.cipher.registerAlgorithm = function (e, t) {
                    ;(e = e.toUpperCase()), (n.cipher.algorithms[e] = t)
                }),
                (n.cipher.getAlgorithm = function (e) {
                    return (e = e.toUpperCase()) in n.cipher.algorithms ? n.cipher.algorithms[e] : null
                })
            var a = (n.cipher.BlockCipher = function (e) {
                ;(this.algorithm = e.algorithm),
                    (this.mode = this.algorithm.mode),
                    (this.blockSize = this.mode.blockSize),
                    (this._finish = !1),
                    (this._input = null),
                    (this.output = null),
                    (this._op = e.decrypt ? this.mode.decrypt : this.mode.encrypt),
                    (this._decrypt = e.decrypt),
                    this.algorithm.initialize(e)
            })
            ;(a.prototype.start = function (e) {
                e = e || {}
                var t = {}
                for (var r in e) t[r] = e[r]
                ;(t.decrypt = this._decrypt),
                    (this._finish = !1),
                    (this._input = n.util.createBuffer()),
                    (this.output = e.output || n.util.createBuffer()),
                    this.mode.start(t)
            }),
                (a.prototype.update = function (e) {
                    for (
                        e && this._input.putBuffer(e);
                        !this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish;

                    );
                    this._input.compact()
                }),
                (a.prototype.finish = function (e) {
                    !e ||
                        ('ECB' !== this.mode.name && 'CBC' !== this.mode.name) ||
                        ((this.mode.pad = function (t) {
                            return e(this.blockSize, t, !1)
                        }),
                        (this.mode.unpad = function (t) {
                            return e(this.blockSize, t, !0)
                        }))
                    var t = {}
                    return (
                        (t.decrypt = this._decrypt),
                        (t.overflow = this._input.length() % this.blockSize),
                        !(!this._decrypt && this.mode.pad && !this.mode.pad(this._input, t)) &&
                            ((this._finish = !0),
                            this.update(),
                            !(this._decrypt && this.mode.unpad && !this.mode.unpad(this.output, t)) &&
                                !(this.mode.afterFinish && !this.mode.afterFinish(this.output, t)))
                    )
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(4), r(1)
            var a = (e.exports = n.md5 = n.md5 || {})
            ;(n.md.md5 = n.md.algorithms.md5 = a),
                (a.create = function () {
                    u ||
                        (function () {
                            ;(i = String.fromCharCode(128)),
                                (i += n.util.fillString(String.fromCharCode(0), 64)),
                                (s = [
                                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 1, 6, 11, 0, 5, 10, 15, 4, 9,
                                    14, 3, 8, 13, 2, 7, 12, 5, 8, 11, 14, 1, 4, 7, 10, 13, 0, 3, 6, 9, 12, 15, 2, 0, 7,
                                    14, 5, 12, 3, 10, 1, 8, 15, 6, 13, 4, 11, 2, 9,
                                ]),
                                (o = [
                                    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14,
                                    20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11,
                                    16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
                                ]),
                                (c = new Array(64))
                            for (var e = 0; e < 64; ++e) c[e] = Math.floor(4294967296 * Math.abs(Math.sin(e + 1)))
                            u = !0
                        })()
                    var e = null,
                        t = n.util.createBuffer(),
                        r = new Array(16),
                        a = {
                            algorithm: 'md5',
                            blockLength: 64,
                            digestLength: 16,
                            messageLength: 0,
                            fullMessageLength: null,
                            messageLengthSize: 8,
                            start: function () {
                                ;(a.messageLength = 0), (a.fullMessageLength = a.messageLength64 = [])
                                for (var r = a.messageLengthSize / 4, i = 0; i < r; ++i) a.fullMessageLength.push(0)
                                return (
                                    (t = n.util.createBuffer()),
                                    (e = { h0: 1732584193, h1: 4023233417, h2: 2562383102, h3: 271733878 }),
                                    a
                                )
                            },
                        }
                    return (
                        a.start(),
                        (a.update = function (i, s) {
                            'utf8' === s && (i = n.util.encodeUtf8(i))
                            var o = i.length
                            ;(a.messageLength += o), (o = [(o / 4294967296) >>> 0, o >>> 0])
                            for (var c = a.fullMessageLength.length - 1; c >= 0; --c)
                                (a.fullMessageLength[c] += o[1]),
                                    (o[1] = o[0] + ((a.fullMessageLength[c] / 4294967296) >>> 0)),
                                    (a.fullMessageLength[c] = a.fullMessageLength[c] >>> 0),
                                    (o[0] = (o[1] / 4294967296) >>> 0)
                            return t.putBytes(i), l(e, r, t), (t.read > 2048 || 0 === t.length()) && t.compact(), a
                        }),
                        (a.digest = function () {
                            var s = n.util.createBuffer()
                            s.putBytes(t.bytes())
                            var o =
                                (a.fullMessageLength[a.fullMessageLength.length - 1] + a.messageLengthSize) &
                                (a.blockLength - 1)
                            s.putBytes(i.substr(0, a.blockLength - o))
                            for (var c, u = 0, p = a.fullMessageLength.length - 1; p >= 0; --p)
                                (u = ((c = 8 * a.fullMessageLength[p] + u) / 4294967296) >>> 0), s.putInt32Le(c >>> 0)
                            var f = { h0: e.h0, h1: e.h1, h2: e.h2, h3: e.h3 }
                            l(f, r, s)
                            var h = n.util.createBuffer()
                            return h.putInt32Le(f.h0), h.putInt32Le(f.h1), h.putInt32Le(f.h2), h.putInt32Le(f.h3), h
                        }),
                        a
                    )
                })
            var i = null,
                s = null,
                o = null,
                c = null,
                u = !1
            function l(e, t, r) {
                for (var n, a, i, u, l, p, f, h = r.length(); h >= 64; ) {
                    for (a = e.h0, i = e.h1, u = e.h2, l = e.h3, f = 0; f < 16; ++f)
                        (t[f] = r.getInt32Le()),
                            (n = a + (l ^ (i & (u ^ l))) + c[f] + t[f]),
                            (a = l),
                            (l = u),
                            (u = i),
                            (i += (n << (p = o[f])) | (n >>> (32 - p)))
                    for (; f < 32; ++f)
                        (n = a + (u ^ (l & (i ^ u))) + c[f] + t[s[f]]),
                            (a = l),
                            (l = u),
                            (u = i),
                            (i += (n << (p = o[f])) | (n >>> (32 - p)))
                    for (; f < 48; ++f)
                        (n = a + (i ^ u ^ l) + c[f] + t[s[f]]),
                            (a = l),
                            (l = u),
                            (u = i),
                            (i += (n << (p = o[f])) | (n >>> (32 - p)))
                    for (; f < 64; ++f)
                        (n = a + (u ^ (i | ~l)) + c[f] + t[s[f]]),
                            (a = l),
                            (l = u),
                            (u = i),
                            (i += (n << (p = o[f])) | (n >>> (32 - p)))
                    ;(e.h0 = (e.h0 + a) | 0),
                        (e.h1 = (e.h1 + i) | 0),
                        (e.h2 = (e.h2 + u) | 0),
                        (e.h3 = (e.h3 + l) | 0),
                        (h -= 64)
                }
            }
        },
        function (e, t, r) {
            var n = r(0)
            r(8), r(4), r(1)
            var a,
                i = (n.pkcs5 = n.pkcs5 || {})
            n.util.isNodejs && !n.options.usePureJavaScript && (a = r(17)),
                (e.exports =
                    n.pbkdf2 =
                    i.pbkdf2 =
                        function (e, t, r, i, s, o) {
                            if (
                                ('function' == typeof s && ((o = s), (s = null)),
                                n.util.isNodejs &&
                                    !n.options.usePureJavaScript &&
                                    a.pbkdf2 &&
                                    (null === s || 'object' != typeof s) &&
                                    (a.pbkdf2Sync.length > 4 || !s || 'sha1' === s))
                            )
                                return (
                                    'string' != typeof s && (s = 'sha1'),
                                    (e = Buffer.from(e, 'binary')),
                                    (t = Buffer.from(t, 'binary')),
                                    o
                                        ? 4 === a.pbkdf2Sync.length
                                            ? a.pbkdf2(e, t, r, i, function (e, t) {
                                                  if (e) return o(e)
                                                  o(null, t.toString('binary'))
                                              })
                                            : a.pbkdf2(e, t, r, i, s, function (e, t) {
                                                  if (e) return o(e)
                                                  o(null, t.toString('binary'))
                                              })
                                        : 4 === a.pbkdf2Sync.length
                                        ? a.pbkdf2Sync(e, t, r, i).toString('binary')
                                        : a.pbkdf2Sync(e, t, r, i, s).toString('binary')
                                )
                            if ((null == s && (s = 'sha1'), 'string' == typeof s)) {
                                if (!(s in n.md.algorithms)) throw new Error('Unknown hash algorithm: ' + s)
                                s = n.md[s].create()
                            }
                            var c = s.digestLength
                            if (i > 4294967295 * c) {
                                var u = new Error('Derived key is too long.')
                                if (o) return o(u)
                                throw u
                            }
                            var l = Math.ceil(i / c),
                                p = i - (l - 1) * c,
                                f = n.hmac.create()
                            f.start(s, e)
                            var h,
                                d,
                                y,
                                g = ''
                            if (!o) {
                                for (var v = 1; v <= l; ++v) {
                                    f.start(null, null),
                                        f.update(t),
                                        f.update(n.util.int32ToBytes(v)),
                                        (h = y = f.digest().getBytes())
                                    for (var m = 2; m <= r; ++m)
                                        f.start(null, null),
                                            f.update(y),
                                            (d = f.digest().getBytes()),
                                            (h = n.util.xorBytes(h, d, c)),
                                            (y = d)
                                    g += v < l ? h : h.substr(0, p)
                                }
                                return g
                            }
                            v = 1
                            function C() {
                                if (v > l) return o(null, g)
                                f.start(null, null),
                                    f.update(t),
                                    f.update(n.util.int32ToBytes(v)),
                                    (h = y = f.digest().getBytes()),
                                    (m = 2),
                                    E()
                            }
                            function E() {
                                if (m <= r)
                                    return (
                                        f.start(null, null),
                                        f.update(y),
                                        (d = f.digest().getBytes()),
                                        (h = n.util.xorBytes(h, d, c)),
                                        (y = d),
                                        ++m,
                                        n.util.setImmediate(E)
                                    )
                                ;(g += v < l ? h : h.substr(0, p)), ++v, C()
                            }
                            C()
                        })
        },
        function (e, t) {},
        function (e, t, r) {
            var n = r(0)
            r(5), r(3), r(11), r(4), r(40), r(6), r(7), r(19), r(12), r(1)
            var a = n.asn1,
                i = (e.exports = n.pki = n.pki || {}),
                s = i.oids,
                o = {}
            ;(o.CN = s.commonName),
                (o.commonName = 'CN'),
                (o.C = s.countryName),
                (o.countryName = 'C'),
                (o.L = s.localityName),
                (o.localityName = 'L'),
                (o.ST = s.stateOrProvinceName),
                (o.stateOrProvinceName = 'ST'),
                (o.O = s.organizationName),
                (o.organizationName = 'O'),
                (o.OU = s.organizationalUnitName),
                (o.organizationalUnitName = 'OU'),
                (o.E = s.emailAddress),
                (o.emailAddress = 'E')
            var c = n.pki.rsa.publicKeyValidator,
                u = {
                    name: 'Certificate',
                    tagClass: a.Class.UNIVERSAL,
                    type: a.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'Certificate.TBSCertificate',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.SEQUENCE,
                            constructed: !0,
                            captureAsn1: 'tbsCertificate',
                            value: [
                                {
                                    name: 'Certificate.TBSCertificate.version',
                                    tagClass: a.Class.CONTEXT_SPECIFIC,
                                    type: 0,
                                    constructed: !0,
                                    optional: !0,
                                    value: [
                                        {
                                            name: 'Certificate.TBSCertificate.version.integer',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.INTEGER,
                                            constructed: !1,
                                            capture: 'certVersion',
                                        },
                                    ],
                                },
                                {
                                    name: 'Certificate.TBSCertificate.serialNumber',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.INTEGER,
                                    constructed: !1,
                                    capture: 'certSerialNumber',
                                },
                                {
                                    name: 'Certificate.TBSCertificate.signature',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.SEQUENCE,
                                    constructed: !0,
                                    value: [
                                        {
                                            name: 'Certificate.TBSCertificate.signature.algorithm',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.OID,
                                            constructed: !1,
                                            capture: 'certinfoSignatureOid',
                                        },
                                        {
                                            name: 'Certificate.TBSCertificate.signature.parameters',
                                            tagClass: a.Class.UNIVERSAL,
                                            optional: !0,
                                            captureAsn1: 'certinfoSignatureParams',
                                        },
                                    ],
                                },
                                {
                                    name: 'Certificate.TBSCertificate.issuer',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.SEQUENCE,
                                    constructed: !0,
                                    captureAsn1: 'certIssuer',
                                },
                                {
                                    name: 'Certificate.TBSCertificate.validity',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.SEQUENCE,
                                    constructed: !0,
                                    value: [
                                        {
                                            name: 'Certificate.TBSCertificate.validity.notBefore (utc)',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.UTCTIME,
                                            constructed: !1,
                                            optional: !0,
                                            capture: 'certValidity1UTCTime',
                                        },
                                        {
                                            name: 'Certificate.TBSCertificate.validity.notBefore (generalized)',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.GENERALIZEDTIME,
                                            constructed: !1,
                                            optional: !0,
                                            capture: 'certValidity2GeneralizedTime',
                                        },
                                        {
                                            name: 'Certificate.TBSCertificate.validity.notAfter (utc)',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.UTCTIME,
                                            constructed: !1,
                                            optional: !0,
                                            capture: 'certValidity3UTCTime',
                                        },
                                        {
                                            name: 'Certificate.TBSCertificate.validity.notAfter (generalized)',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.GENERALIZEDTIME,
                                            constructed: !1,
                                            optional: !0,
                                            capture: 'certValidity4GeneralizedTime',
                                        },
                                    ],
                                },
                                {
                                    name: 'Certificate.TBSCertificate.subject',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.SEQUENCE,
                                    constructed: !0,
                                    captureAsn1: 'certSubject',
                                },
                                c,
                                {
                                    name: 'Certificate.TBSCertificate.issuerUniqueID',
                                    tagClass: a.Class.CONTEXT_SPECIFIC,
                                    type: 1,
                                    constructed: !0,
                                    optional: !0,
                                    value: [
                                        {
                                            name: 'Certificate.TBSCertificate.issuerUniqueID.id',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.BITSTRING,
                                            constructed: !1,
                                            captureBitStringValue: 'certIssuerUniqueId',
                                        },
                                    ],
                                },
                                {
                                    name: 'Certificate.TBSCertificate.subjectUniqueID',
                                    tagClass: a.Class.CONTEXT_SPECIFIC,
                                    type: 2,
                                    constructed: !0,
                                    optional: !0,
                                    value: [
                                        {
                                            name: 'Certificate.TBSCertificate.subjectUniqueID.id',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.BITSTRING,
                                            constructed: !1,
                                            captureBitStringValue: 'certSubjectUniqueId',
                                        },
                                    ],
                                },
                                {
                                    name: 'Certificate.TBSCertificate.extensions',
                                    tagClass: a.Class.CONTEXT_SPECIFIC,
                                    type: 3,
                                    constructed: !0,
                                    captureAsn1: 'certExtensions',
                                    optional: !0,
                                },
                            ],
                        },
                        {
                            name: 'Certificate.signatureAlgorithm',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.SEQUENCE,
                            constructed: !0,
                            value: [
                                {
                                    name: 'Certificate.signatureAlgorithm.algorithm',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.OID,
                                    constructed: !1,
                                    capture: 'certSignatureOid',
                                },
                                {
                                    name: 'Certificate.TBSCertificate.signature.parameters',
                                    tagClass: a.Class.UNIVERSAL,
                                    optional: !0,
                                    captureAsn1: 'certSignatureParams',
                                },
                            ],
                        },
                        {
                            name: 'Certificate.signatureValue',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.BITSTRING,
                            constructed: !1,
                            captureBitStringValue: 'certSignature',
                        },
                    ],
                },
                l = {
                    name: 'rsapss',
                    tagClass: a.Class.UNIVERSAL,
                    type: a.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'rsapss.hashAlgorithm',
                            tagClass: a.Class.CONTEXT_SPECIFIC,
                            type: 0,
                            constructed: !0,
                            value: [
                                {
                                    name: 'rsapss.hashAlgorithm.AlgorithmIdentifier',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Class.SEQUENCE,
                                    constructed: !0,
                                    optional: !0,
                                    value: [
                                        {
                                            name: 'rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.OID,
                                            constructed: !1,
                                            capture: 'hashOid',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: 'rsapss.maskGenAlgorithm',
                            tagClass: a.Class.CONTEXT_SPECIFIC,
                            type: 1,
                            constructed: !0,
                            value: [
                                {
                                    name: 'rsapss.maskGenAlgorithm.AlgorithmIdentifier',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Class.SEQUENCE,
                                    constructed: !0,
                                    optional: !0,
                                    value: [
                                        {
                                            name: 'rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.OID,
                                            constructed: !1,
                                            capture: 'maskGenOid',
                                        },
                                        {
                                            name: 'rsapss.maskGenAlgorithm.AlgorithmIdentifier.params',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.SEQUENCE,
                                            constructed: !0,
                                            value: [
                                                {
                                                    name: 'rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm',
                                                    tagClass: a.Class.UNIVERSAL,
                                                    type: a.Type.OID,
                                                    constructed: !1,
                                                    capture: 'maskGenHashOid',
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: 'rsapss.saltLength',
                            tagClass: a.Class.CONTEXT_SPECIFIC,
                            type: 2,
                            optional: !0,
                            value: [
                                {
                                    name: 'rsapss.saltLength.saltLength',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Class.INTEGER,
                                    constructed: !1,
                                    capture: 'saltLength',
                                },
                            ],
                        },
                        {
                            name: 'rsapss.trailerField',
                            tagClass: a.Class.CONTEXT_SPECIFIC,
                            type: 3,
                            optional: !0,
                            value: [
                                {
                                    name: 'rsapss.trailer.trailer',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Class.INTEGER,
                                    constructed: !1,
                                    capture: 'trailer',
                                },
                            ],
                        },
                    ],
                },
                p = {
                    name: 'CertificationRequestInfo',
                    tagClass: a.Class.UNIVERSAL,
                    type: a.Type.SEQUENCE,
                    constructed: !0,
                    captureAsn1: 'certificationRequestInfo',
                    value: [
                        {
                            name: 'CertificationRequestInfo.integer',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.INTEGER,
                            constructed: !1,
                            capture: 'certificationRequestInfoVersion',
                        },
                        {
                            name: 'CertificationRequestInfo.subject',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.SEQUENCE,
                            constructed: !0,
                            captureAsn1: 'certificationRequestInfoSubject',
                        },
                        c,
                        {
                            name: 'CertificationRequestInfo.attributes',
                            tagClass: a.Class.CONTEXT_SPECIFIC,
                            type: 0,
                            constructed: !0,
                            optional: !0,
                            capture: 'certificationRequestInfoAttributes',
                            value: [
                                {
                                    name: 'CertificationRequestInfo.attributes',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.SEQUENCE,
                                    constructed: !0,
                                    value: [
                                        {
                                            name: 'CertificationRequestInfo.attributes.type',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.OID,
                                            constructed: !1,
                                        },
                                        {
                                            name: 'CertificationRequestInfo.attributes.value',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.SET,
                                            constructed: !0,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                f = {
                    name: 'CertificationRequest',
                    tagClass: a.Class.UNIVERSAL,
                    type: a.Type.SEQUENCE,
                    constructed: !0,
                    captureAsn1: 'csr',
                    value: [
                        p,
                        {
                            name: 'CertificationRequest.signatureAlgorithm',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.SEQUENCE,
                            constructed: !0,
                            value: [
                                {
                                    name: 'CertificationRequest.signatureAlgorithm.algorithm',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.OID,
                                    constructed: !1,
                                    capture: 'csrSignatureOid',
                                },
                                {
                                    name: 'CertificationRequest.signatureAlgorithm.parameters',
                                    tagClass: a.Class.UNIVERSAL,
                                    optional: !0,
                                    captureAsn1: 'csrSignatureParams',
                                },
                            ],
                        },
                        {
                            name: 'CertificationRequest.signature',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.BITSTRING,
                            constructed: !1,
                            captureBitStringValue: 'csrSignature',
                        },
                    ],
                }
            function h(e, t) {
                'string' == typeof t && (t = { shortName: t })
                for (var r, n = null, a = 0; null === n && a < e.attributes.length; ++a)
                    (r = e.attributes[a]),
                        ((t.type && t.type === r.type) ||
                            (t.name && t.name === r.name) ||
                            (t.shortName && t.shortName === r.shortName)) &&
                            (n = r)
                return n
            }
            ;(i.RDNAttributesAsArray = function (e, t) {
                for (var r, n, i, c = [], u = 0; u < e.value.length; ++u) {
                    r = e.value[u]
                    for (var l = 0; l < r.value.length; ++l)
                        (i = {}),
                            (n = r.value[l]),
                            (i.type = a.derToOid(n.value[0].value)),
                            (i.value = n.value[1].value),
                            (i.valueTagClass = n.value[1].type),
                            i.type in s && ((i.name = s[i.type]), i.name in o && (i.shortName = o[i.name])),
                            t && (t.update(i.type), t.update(i.value)),
                            c.push(i)
                }
                return c
            }),
                (i.CRIAttributesAsArray = function (e) {
                    for (var t = [], r = 0; r < e.length; ++r)
                        for (
                            var n = e[r], c = a.derToOid(n.value[0].value), u = n.value[1].value, l = 0;
                            l < u.length;
                            ++l
                        ) {
                            var p = {}
                            if (
                                ((p.type = c),
                                (p.value = u[l].value),
                                (p.valueTagClass = u[l].type),
                                p.type in s && ((p.name = s[p.type]), p.name in o && (p.shortName = o[p.name])),
                                p.type === s.extensionRequest)
                            ) {
                                p.extensions = []
                                for (var f = 0; f < p.value.length; ++f)
                                    p.extensions.push(i.certificateExtensionFromAsn1(p.value[f]))
                            }
                            t.push(p)
                        }
                    return t
                })
            var d = function (e, t, r) {
                    var n = {}
                    if (e !== s['RSASSA-PSS']) return n
                    r &&
                        (n = {
                            hash: { algorithmOid: s.sha1 },
                            mgf: { algorithmOid: s.mgf1, hash: { algorithmOid: s.sha1 } },
                            saltLength: 20,
                        })
                    var i = {},
                        o = []
                    if (!a.validate(t, l, i, o)) {
                        var c = new Error('Cannot read RSASSA-PSS parameter block.')
                        throw ((c.errors = o), c)
                    }
                    return (
                        void 0 !== i.hashOid &&
                            ((n.hash = n.hash || {}), (n.hash.algorithmOid = a.derToOid(i.hashOid))),
                        void 0 !== i.maskGenOid &&
                            ((n.mgf = n.mgf || {}),
                            (n.mgf.algorithmOid = a.derToOid(i.maskGenOid)),
                            (n.mgf.hash = n.mgf.hash || {}),
                            (n.mgf.hash.algorithmOid = a.derToOid(i.maskGenHashOid))),
                        void 0 !== i.saltLength && (n.saltLength = i.saltLength.charCodeAt(0)),
                        n
                    )
                },
                y = function (e) {
                    switch (s[e.signatureOid]) {
                        case 'sha1WithRSAEncryption':
                        case 'sha1WithRSASignature':
                            return n.md.sha1.create()
                        case 'md5WithRSAEncryption':
                            return n.md.md5.create()
                        case 'sha256WithRSAEncryption':
                            return n.md.sha256.create()
                        case 'sha384WithRSAEncryption':
                            return n.md.sha384.create()
                        case 'sha512WithRSAEncryption':
                            return n.md.sha512.create()
                        case 'RSASSA-PSS':
                            return n.md.sha256.create()
                        default:
                            var t = new Error('Could not compute ' + e.type + ' digest. Unknown signature OID.')
                            throw ((t.signatureOid = e.signatureOid), t)
                    }
                },
                g = function (e) {
                    var t,
                        r = e.certificate
                    switch (r.signatureOid) {
                        case s.sha1WithRSAEncryption:
                        case s.sha1WithRSASignature:
                            break
                        case s['RSASSA-PSS']:
                            var a, i, o
                            if (void 0 === (a = s[r.signatureParameters.mgf.hash.algorithmOid]) || void 0 === n.md[a])
                                throw (
                                    (((o = new Error('Unsupported MGF hash function.')).oid =
                                        r.signatureParameters.mgf.hash.algorithmOid),
                                    (o.name = a),
                                    o)
                                )
                            if (void 0 === (i = s[r.signatureParameters.mgf.algorithmOid]) || void 0 === n.mgf[i])
                                throw (
                                    (((o = new Error('Unsupported MGF function.')).oid =
                                        r.signatureParameters.mgf.algorithmOid),
                                    (o.name = i),
                                    o)
                                )
                            if (
                                ((i = n.mgf[i].create(n.md[a].create())),
                                void 0 === (a = s[r.signatureParameters.hash.algorithmOid]) || void 0 === n.md[a])
                            )
                                throw (
                                    (((o = new Error('Unsupported RSASSA-PSS hash function.')).oid =
                                        r.signatureParameters.hash.algorithmOid),
                                    (o.name = a),
                                    o)
                                )
                            t = n.pss.create(n.md[a].create(), i, r.signatureParameters.saltLength)
                    }
                    return r.publicKey.verify(e.md.digest().getBytes(), e.signature, t)
                }
            function v(e) {
                for (
                    var t, r, i = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, []), s = e.attributes, o = 0;
                    o < s.length;
                    ++o
                ) {
                    var c = (t = s[o]).value,
                        u = a.Type.PRINTABLESTRING
                    'valueTagClass' in t && (u = t.valueTagClass) === a.Type.UTF8 && (c = n.util.encodeUtf8(c)),
                        (r = a.create(a.Class.UNIVERSAL, a.Type.SET, !0, [
                            a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(t.type).getBytes()),
                                a.create(a.Class.UNIVERSAL, u, !1, c),
                            ]),
                        ])),
                        i.value.push(r)
                }
                return i
            }
            function m(e) {
                for (var t, r = 0; r < e.length; ++r) {
                    if (
                        (void 0 === (t = e[r]).name &&
                            (t.type && t.type in i.oids
                                ? (t.name = i.oids[t.type])
                                : t.shortName && t.shortName in o && (t.name = i.oids[o[t.shortName]])),
                        void 0 === t.type)
                    ) {
                        if (!t.name || !(t.name in i.oids))
                            throw (((c = new Error('Attribute type not specified.')).attribute = t), c)
                        t.type = i.oids[t.name]
                    }
                    if (
                        (void 0 === t.shortName && t.name && t.name in o && (t.shortName = o[t.name]),
                        t.type === s.extensionRequest &&
                            ((t.valueConstructed = !0), (t.valueTagClass = a.Type.SEQUENCE), !t.value && t.extensions))
                    ) {
                        t.value = []
                        for (var n = 0; n < t.extensions.length; ++n)
                            t.value.push(i.certificateExtensionToAsn1(C(t.extensions[n])))
                    }
                    var c
                    if (void 0 === t.value) throw (((c = new Error('Attribute value not specified.')).attribute = t), c)
                }
            }
            function C(e, t) {
                if (
                    ((t = t || {}),
                    void 0 === e.name && e.id && e.id in i.oids && (e.name = i.oids[e.id]),
                    void 0 === e.id)
                ) {
                    if (!e.name || !(e.name in i.oids))
                        throw (((S = new Error('Extension ID not specified.')).extension = e), S)
                    e.id = i.oids[e.name]
                }
                if (void 0 !== e.value) return e
                if ('keyUsage' === e.name) {
                    var r = 0,
                        o = 0,
                        c = 0
                    e.digitalSignature && ((o |= 128), (r = 7)),
                        e.nonRepudiation && ((o |= 64), (r = 6)),
                        e.keyEncipherment && ((o |= 32), (r = 5)),
                        e.dataEncipherment && ((o |= 16), (r = 4)),
                        e.keyAgreement && ((o |= 8), (r = 3)),
                        e.keyCertSign && ((o |= 4), (r = 2)),
                        e.cRLSign && ((o |= 2), (r = 1)),
                        e.encipherOnly && ((o |= 1), (r = 0)),
                        e.decipherOnly && ((c |= 128), (r = 7))
                    var u = String.fromCharCode(r)
                    0 !== c
                        ? (u += String.fromCharCode(o) + String.fromCharCode(c))
                        : 0 !== o && (u += String.fromCharCode(o)),
                        (e.value = a.create(a.Class.UNIVERSAL, a.Type.BITSTRING, !1, u))
                } else if ('basicConstraints' === e.name)
                    (e.value = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [])),
                        e.cA &&
                            e.value.value.push(
                                a.create(a.Class.UNIVERSAL, a.Type.BOOLEAN, !1, String.fromCharCode(255))
                            ),
                        'pathLenConstraint' in e &&
                            e.value.value.push(
                                a.create(
                                    a.Class.UNIVERSAL,
                                    a.Type.INTEGER,
                                    !1,
                                    a.integerToDer(e.pathLenConstraint).getBytes()
                                )
                            )
                else if ('extKeyUsage' === e.name) {
                    e.value = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [])
                    var l = e.value.value
                    for (var p in e)
                        !0 === e[p] &&
                            (p in s
                                ? l.push(a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(s[p]).getBytes()))
                                : -1 !== p.indexOf('.') &&
                                  l.push(a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(p).getBytes())))
                } else if ('nsCertType' === e.name) {
                    ;(r = 0), (o = 0)
                    e.client && ((o |= 128), (r = 7)),
                        e.server && ((o |= 64), (r = 6)),
                        e.email && ((o |= 32), (r = 5)),
                        e.objsign && ((o |= 16), (r = 4)),
                        e.reserved && ((o |= 8), (r = 3)),
                        e.sslCA && ((o |= 4), (r = 2)),
                        e.emailCA && ((o |= 2), (r = 1)),
                        e.objCA && ((o |= 1), (r = 0))
                    u = String.fromCharCode(r)
                    0 !== o && (u += String.fromCharCode(o)),
                        (e.value = a.create(a.Class.UNIVERSAL, a.Type.BITSTRING, !1, u))
                } else if ('subjectAltName' === e.name || 'issuerAltName' === e.name) {
                    e.value = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [])
                    for (var f = 0; f < e.altNames.length; ++f) {
                        u = (m = e.altNames[f]).value
                        if (7 === m.type && m.ip) {
                            if (null === (u = n.util.bytesFromIP(m.ip)))
                                throw (
                                    (((S = new Error(
                                        'Extension "ip" value is not a valid IPv4 or IPv6 address.'
                                    )).extension = e),
                                    S)
                                )
                        } else 8 === m.type && (u = m.oid ? a.oidToDer(a.oidToDer(m.oid)) : a.oidToDer(u))
                        e.value.value.push(a.create(a.Class.CONTEXT_SPECIFIC, m.type, !1, u))
                    }
                } else if ('nsComment' === e.name && t.cert) {
                    if (!/^[\x00-\x7F]*$/.test(e.comment) || e.comment.length < 1 || e.comment.length > 128)
                        throw new Error('Invalid "nsComment" content.')
                    e.value = a.create(a.Class.UNIVERSAL, a.Type.IA5STRING, !1, e.comment)
                } else if ('subjectKeyIdentifier' === e.name && t.cert) {
                    var h = t.cert.generateSubjectKeyIdentifier()
                    ;(e.subjectKeyIdentifier = h.toHex()),
                        (e.value = a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, h.getBytes()))
                } else if ('authorityKeyIdentifier' === e.name && t.cert) {
                    e.value = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [])
                    l = e.value.value
                    if (e.keyIdentifier) {
                        var d =
                            !0 === e.keyIdentifier ? t.cert.generateSubjectKeyIdentifier().getBytes() : e.keyIdentifier
                        l.push(a.create(a.Class.CONTEXT_SPECIFIC, 0, !1, d))
                    }
                    if (e.authorityCertIssuer) {
                        var y = [
                            a.create(a.Class.CONTEXT_SPECIFIC, 4, !0, [
                                v(!0 === e.authorityCertIssuer ? t.cert.issuer : e.authorityCertIssuer),
                            ]),
                        ]
                        l.push(a.create(a.Class.CONTEXT_SPECIFIC, 1, !0, y))
                    }
                    if (e.serialNumber) {
                        var g = n.util.hexToBytes(!0 === e.serialNumber ? t.cert.serialNumber : e.serialNumber)
                        l.push(a.create(a.Class.CONTEXT_SPECIFIC, 2, !1, g))
                    }
                } else if ('cRLDistributionPoints' === e.name) {
                    e.value = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [])
                    l = e.value.value
                    var m,
                        C = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, []),
                        E = a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [])
                    for (f = 0; f < e.altNames.length; ++f) {
                        u = (m = e.altNames[f]).value
                        if (7 === m.type && m.ip) {
                            if (null === (u = n.util.bytesFromIP(m.ip)))
                                throw (
                                    (((S = new Error(
                                        'Extension "ip" value is not a valid IPv4 or IPv6 address.'
                                    )).extension = e),
                                    S)
                                )
                        } else 8 === m.type && (u = m.oid ? a.oidToDer(a.oidToDer(m.oid)) : a.oidToDer(u))
                        E.value.push(a.create(a.Class.CONTEXT_SPECIFIC, m.type, !1, u))
                    }
                    C.value.push(a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [E])), l.push(C)
                }
                var S
                if (void 0 === e.value) throw (((S = new Error('Extension value not specified.')).extension = e), S)
                return e
            }
            function E(e, t) {
                switch (e) {
                    case s['RSASSA-PSS']:
                        var r = []
                        return (
                            void 0 !== t.hash.algorithmOid &&
                                r.push(
                                    a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [
                                        a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                            a.create(
                                                a.Class.UNIVERSAL,
                                                a.Type.OID,
                                                !1,
                                                a.oidToDer(t.hash.algorithmOid).getBytes()
                                            ),
                                            a.create(a.Class.UNIVERSAL, a.Type.NULL, !1, ''),
                                        ]),
                                    ])
                                ),
                            void 0 !== t.mgf.algorithmOid &&
                                r.push(
                                    a.create(a.Class.CONTEXT_SPECIFIC, 1, !0, [
                                        a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                            a.create(
                                                a.Class.UNIVERSAL,
                                                a.Type.OID,
                                                !1,
                                                a.oidToDer(t.mgf.algorithmOid).getBytes()
                                            ),
                                            a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                                a.create(
                                                    a.Class.UNIVERSAL,
                                                    a.Type.OID,
                                                    !1,
                                                    a.oidToDer(t.mgf.hash.algorithmOid).getBytes()
                                                ),
                                                a.create(a.Class.UNIVERSAL, a.Type.NULL, !1, ''),
                                            ]),
                                        ]),
                                    ])
                                ),
                            void 0 !== t.saltLength &&
                                r.push(
                                    a.create(a.Class.CONTEXT_SPECIFIC, 2, !0, [
                                        a.create(
                                            a.Class.UNIVERSAL,
                                            a.Type.INTEGER,
                                            !1,
                                            a.integerToDer(t.saltLength).getBytes()
                                        ),
                                    ])
                                ),
                            a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, r)
                        )
                    default:
                        return a.create(a.Class.UNIVERSAL, a.Type.NULL, !1, '')
                }
            }
            function S(e) {
                var t = a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [])
                if (0 === e.attributes.length) return t
                for (var r = e.attributes, i = 0; i < r.length; ++i) {
                    var s = r[i],
                        o = s.value,
                        c = a.Type.UTF8
                    'valueTagClass' in s && (c = s.valueTagClass), c === a.Type.UTF8 && (o = n.util.encodeUtf8(o))
                    var u = !1
                    'valueConstructed' in s && (u = s.valueConstructed)
                    var l = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                        a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(s.type).getBytes()),
                        a.create(a.Class.UNIVERSAL, a.Type.SET, !0, [a.create(a.Class.UNIVERSAL, c, u, o)]),
                    ])
                    t.value.push(l)
                }
                return t
            }
            ;(i.certificateFromPem = function (e, t, r) {
                var s = n.pem.decode(e)[0]
                if ('CERTIFICATE' !== s.type && 'X509 CERTIFICATE' !== s.type && 'TRUSTED CERTIFICATE' !== s.type) {
                    var o = new Error(
                        'Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".'
                    )
                    throw ((o.headerType = s.type), o)
                }
                if (s.procType && 'ENCRYPTED' === s.procType.type)
                    throw new Error('Could not convert certificate from PEM; PEM is encrypted.')
                var c = a.fromDer(s.body, r)
                return i.certificateFromAsn1(c, t)
            }),
                (i.certificateToPem = function (e, t) {
                    var r = { type: 'CERTIFICATE', body: a.toDer(i.certificateToAsn1(e)).getBytes() }
                    return n.pem.encode(r, { maxline: t })
                }),
                (i.publicKeyFromPem = function (e) {
                    var t = n.pem.decode(e)[0]
                    if ('PUBLIC KEY' !== t.type && 'RSA PUBLIC KEY' !== t.type) {
                        var r = new Error(
                            'Could not convert public key from PEM; PEM header type is not "PUBLIC KEY" or "RSA PUBLIC KEY".'
                        )
                        throw ((r.headerType = t.type), r)
                    }
                    if (t.procType && 'ENCRYPTED' === t.procType.type)
                        throw new Error('Could not convert public key from PEM; PEM is encrypted.')
                    var s = a.fromDer(t.body)
                    return i.publicKeyFromAsn1(s)
                }),
                (i.publicKeyToPem = function (e, t) {
                    var r = { type: 'PUBLIC KEY', body: a.toDer(i.publicKeyToAsn1(e)).getBytes() }
                    return n.pem.encode(r, { maxline: t })
                }),
                (i.publicKeyToRSAPublicKeyPem = function (e, t) {
                    var r = { type: 'RSA PUBLIC KEY', body: a.toDer(i.publicKeyToRSAPublicKey(e)).getBytes() }
                    return n.pem.encode(r, { maxline: t })
                }),
                (i.getPublicKeyFingerprint = function (e, t) {
                    var r,
                        s = (t = t || {}).md || n.md.sha1.create()
                    switch (t.type || 'RSAPublicKey') {
                        case 'RSAPublicKey':
                            r = a.toDer(i.publicKeyToRSAPublicKey(e)).getBytes()
                            break
                        case 'SubjectPublicKeyInfo':
                            r = a.toDer(i.publicKeyToAsn1(e)).getBytes()
                            break
                        default:
                            throw new Error('Unknown fingerprint type "' + t.type + '".')
                    }
                    s.start(), s.update(r)
                    var o = s.digest()
                    if ('hex' === t.encoding) {
                        var c = o.toHex()
                        return t.delimiter ? c.match(/.{2}/g).join(t.delimiter) : c
                    }
                    if ('binary' === t.encoding) return o.getBytes()
                    if (t.encoding) throw new Error('Unknown encoding "' + t.encoding + '".')
                    return o
                }),
                (i.certificationRequestFromPem = function (e, t, r) {
                    var s = n.pem.decode(e)[0]
                    if ('CERTIFICATE REQUEST' !== s.type) {
                        var o = new Error(
                            'Could not convert certification request from PEM; PEM header type is not "CERTIFICATE REQUEST".'
                        )
                        throw ((o.headerType = s.type), o)
                    }
                    if (s.procType && 'ENCRYPTED' === s.procType.type)
                        throw new Error('Could not convert certification request from PEM; PEM is encrypted.')
                    var c = a.fromDer(s.body, r)
                    return i.certificationRequestFromAsn1(c, t)
                }),
                (i.certificationRequestToPem = function (e, t) {
                    var r = { type: 'CERTIFICATE REQUEST', body: a.toDer(i.certificationRequestToAsn1(e)).getBytes() }
                    return n.pem.encode(r, { maxline: t })
                }),
                (i.createCertificate = function () {
                    var e = { version: 2, serialNumber: '00', signatureOid: null, signature: null, siginfo: {} }
                    return (
                        (e.siginfo.algorithmOid = null),
                        (e.validity = {}),
                        (e.validity.notBefore = new Date()),
                        (e.validity.notAfter = new Date()),
                        (e.issuer = {}),
                        (e.issuer.getField = function (t) {
                            return h(e.issuer, t)
                        }),
                        (e.issuer.addField = function (t) {
                            m([t]), e.issuer.attributes.push(t)
                        }),
                        (e.issuer.attributes = []),
                        (e.issuer.hash = null),
                        (e.subject = {}),
                        (e.subject.getField = function (t) {
                            return h(e.subject, t)
                        }),
                        (e.subject.addField = function (t) {
                            m([t]), e.subject.attributes.push(t)
                        }),
                        (e.subject.attributes = []),
                        (e.subject.hash = null),
                        (e.extensions = []),
                        (e.publicKey = null),
                        (e.md = null),
                        (e.setSubject = function (t, r) {
                            m(t),
                                (e.subject.attributes = t),
                                delete e.subject.uniqueId,
                                r && (e.subject.uniqueId = r),
                                (e.subject.hash = null)
                        }),
                        (e.setIssuer = function (t, r) {
                            m(t),
                                (e.issuer.attributes = t),
                                delete e.issuer.uniqueId,
                                r && (e.issuer.uniqueId = r),
                                (e.issuer.hash = null)
                        }),
                        (e.setExtensions = function (t) {
                            for (var r = 0; r < t.length; ++r) C(t[r], { cert: e })
                            e.extensions = t
                        }),
                        (e.getExtension = function (t) {
                            'string' == typeof t && (t = { name: t })
                            for (var r, n = null, a = 0; null === n && a < e.extensions.length; ++a)
                                (r = e.extensions[a]),
                                    ((t.id && r.id === t.id) || (t.name && r.name === t.name)) && (n = r)
                            return n
                        }),
                        (e.sign = function (t, r) {
                            e.md = r || n.md.sha1.create()
                            var o = s[e.md.algorithm + 'WithRSAEncryption']
                            if (!o) {
                                var c = new Error(
                                    'Could not compute certificate digest. Unknown message digest algorithm OID.'
                                )
                                throw ((c.algorithm = e.md.algorithm), c)
                            }
                            ;(e.signatureOid = e.siginfo.algorithmOid = o), (e.tbsCertificate = i.getTBSCertificate(e))
                            var u = a.toDer(e.tbsCertificate)
                            e.md.update(u.getBytes()), (e.signature = t.sign(e.md))
                        }),
                        (e.verify = function (t) {
                            var r = !1
                            if (!e.issued(t)) {
                                var n = t.issuer,
                                    s = e.subject,
                                    o = new Error(
                                        "The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject."
                                    )
                                throw ((o.expectedIssuer = s.attributes), (o.actualIssuer = n.attributes), o)
                            }
                            var c = t.md
                            if (null === c) {
                                c = y({ signatureOid: t.signatureOid, type: 'certificate' })
                                var u = t.tbsCertificate || i.getTBSCertificate(t),
                                    l = a.toDer(u)
                                c.update(l.getBytes())
                            }
                            return null !== c && (r = g({ certificate: e, md: c, signature: t.signature })), r
                        }),
                        (e.isIssuer = function (t) {
                            var r = !1,
                                n = e.issuer,
                                a = t.subject
                            if (n.hash && a.hash) r = n.hash === a.hash
                            else if (n.attributes.length === a.attributes.length) {
                                var i, s
                                r = !0
                                for (var o = 0; r && o < n.attributes.length; ++o)
                                    (i = n.attributes[o]),
                                        (s = a.attributes[o]),
                                        (i.type === s.type && i.value === s.value) || (r = !1)
                            }
                            return r
                        }),
                        (e.issued = function (t) {
                            return t.isIssuer(e)
                        }),
                        (e.generateSubjectKeyIdentifier = function () {
                            return i.getPublicKeyFingerprint(e.publicKey, { type: 'RSAPublicKey' })
                        }),
                        (e.verifySubjectKeyIdentifier = function () {
                            for (var t = s.subjectKeyIdentifier, r = 0; r < e.extensions.length; ++r) {
                                var a = e.extensions[r]
                                if (a.id === t) {
                                    var i = e.generateSubjectKeyIdentifier().getBytes()
                                    return n.util.hexToBytes(a.subjectKeyIdentifier) === i
                                }
                            }
                            return !1
                        }),
                        e
                    )
                }),
                (i.certificateFromAsn1 = function (e, t) {
                    var r = {},
                        s = []
                    if (!a.validate(e, u, r, s)) {
                        var o = new Error('Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate.')
                        throw ((o.errors = s), o)
                    }
                    if (a.derToOid(r.publicKeyOid) !== i.oids.rsaEncryption)
                        throw new Error('Cannot read public key. OID is not RSA.')
                    var c = i.createCertificate()
                    c.version = r.certVersion ? r.certVersion.charCodeAt(0) : 0
                    var l = n.util.createBuffer(r.certSerialNumber)
                    ;(c.serialNumber = l.toHex()),
                        (c.signatureOid = n.asn1.derToOid(r.certSignatureOid)),
                        (c.signatureParameters = d(c.signatureOid, r.certSignatureParams, !0)),
                        (c.siginfo.algorithmOid = n.asn1.derToOid(r.certinfoSignatureOid)),
                        (c.siginfo.parameters = d(c.siginfo.algorithmOid, r.certinfoSignatureParams, !1)),
                        (c.signature = r.certSignature)
                    var p = []
                    if (
                        (void 0 !== r.certValidity1UTCTime && p.push(a.utcTimeToDate(r.certValidity1UTCTime)),
                        void 0 !== r.certValidity2GeneralizedTime &&
                            p.push(a.generalizedTimeToDate(r.certValidity2GeneralizedTime)),
                        void 0 !== r.certValidity3UTCTime && p.push(a.utcTimeToDate(r.certValidity3UTCTime)),
                        void 0 !== r.certValidity4GeneralizedTime &&
                            p.push(a.generalizedTimeToDate(r.certValidity4GeneralizedTime)),
                        p.length > 2)
                    )
                        throw new Error(
                            'Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate.'
                        )
                    if (p.length < 2)
                        throw new Error(
                            'Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime.'
                        )
                    if (
                        ((c.validity.notBefore = p[0]),
                        (c.validity.notAfter = p[1]),
                        (c.tbsCertificate = r.tbsCertificate),
                        t)
                    ) {
                        c.md = y({ signatureOid: c.signatureOid, type: 'certificate' })
                        var f = a.toDer(c.tbsCertificate)
                        c.md.update(f.getBytes())
                    }
                    var g = n.md.sha1.create(),
                        v = a.toDer(r.certIssuer)
                    g.update(v.getBytes()),
                        (c.issuer.getField = function (e) {
                            return h(c.issuer, e)
                        }),
                        (c.issuer.addField = function (e) {
                            m([e]), c.issuer.attributes.push(e)
                        }),
                        (c.issuer.attributes = i.RDNAttributesAsArray(r.certIssuer)),
                        r.certIssuerUniqueId && (c.issuer.uniqueId = r.certIssuerUniqueId),
                        (c.issuer.hash = g.digest().toHex())
                    var C = n.md.sha1.create(),
                        E = a.toDer(r.certSubject)
                    return (
                        C.update(E.getBytes()),
                        (c.subject.getField = function (e) {
                            return h(c.subject, e)
                        }),
                        (c.subject.addField = function (e) {
                            m([e]), c.subject.attributes.push(e)
                        }),
                        (c.subject.attributes = i.RDNAttributesAsArray(r.certSubject)),
                        r.certSubjectUniqueId && (c.subject.uniqueId = r.certSubjectUniqueId),
                        (c.subject.hash = C.digest().toHex()),
                        r.certExtensions
                            ? (c.extensions = i.certificateExtensionsFromAsn1(r.certExtensions))
                            : (c.extensions = []),
                        (c.publicKey = i.publicKeyFromAsn1(r.subjectPublicKeyInfo)),
                        c
                    )
                }),
                (i.certificateExtensionsFromAsn1 = function (e) {
                    for (var t = [], r = 0; r < e.value.length; ++r)
                        for (var n = e.value[r], a = 0; a < n.value.length; ++a)
                            t.push(i.certificateExtensionFromAsn1(n.value[a]))
                    return t
                }),
                (i.certificateExtensionFromAsn1 = function (e) {
                    var t = {}
                    if (
                        ((t.id = a.derToOid(e.value[0].value)),
                        (t.critical = !1),
                        e.value[1].type === a.Type.BOOLEAN
                            ? ((t.critical = 0 !== e.value[1].value.charCodeAt(0)), (t.value = e.value[2].value))
                            : (t.value = e.value[1].value),
                        t.id in s)
                    )
                        if (((t.name = s[t.id]), 'keyUsage' === t.name)) {
                            var r = 0,
                                i = 0
                            ;(c = a.fromDer(t.value)).value.length > 1 &&
                                ((r = c.value.charCodeAt(1)), (i = c.value.length > 2 ? c.value.charCodeAt(2) : 0)),
                                (t.digitalSignature = 128 == (128 & r)),
                                (t.nonRepudiation = 64 == (64 & r)),
                                (t.keyEncipherment = 32 == (32 & r)),
                                (t.dataEncipherment = 16 == (16 & r)),
                                (t.keyAgreement = 8 == (8 & r)),
                                (t.keyCertSign = 4 == (4 & r)),
                                (t.cRLSign = 2 == (2 & r)),
                                (t.encipherOnly = 1 == (1 & r)),
                                (t.decipherOnly = 128 == (128 & i))
                        } else if ('basicConstraints' === t.name) {
                            ;(c = a.fromDer(t.value)).value.length > 0 && c.value[0].type === a.Type.BOOLEAN
                                ? (t.cA = 0 !== c.value[0].value.charCodeAt(0))
                                : (t.cA = !1)
                            var o = null
                            c.value.length > 0 && c.value[0].type === a.Type.INTEGER
                                ? (o = c.value[0].value)
                                : c.value.length > 1 && (o = c.value[1].value),
                                null !== o && (t.pathLenConstraint = a.derToInteger(o))
                        } else if ('extKeyUsage' === t.name)
                            for (var c = a.fromDer(t.value), u = 0; u < c.value.length; ++u) {
                                var l = a.derToOid(c.value[u].value)
                                l in s ? (t[s[l]] = !0) : (t[l] = !0)
                            }
                        else if ('nsCertType' === t.name) {
                            r = 0
                            ;(c = a.fromDer(t.value)).value.length > 1 && (r = c.value.charCodeAt(1)),
                                (t.client = 128 == (128 & r)),
                                (t.server = 64 == (64 & r)),
                                (t.email = 32 == (32 & r)),
                                (t.objsign = 16 == (16 & r)),
                                (t.reserved = 8 == (8 & r)),
                                (t.sslCA = 4 == (4 & r)),
                                (t.emailCA = 2 == (2 & r)),
                                (t.objCA = 1 == (1 & r))
                        } else if ('subjectAltName' === t.name || 'issuerAltName' === t.name) {
                            var p
                            t.altNames = []
                            c = a.fromDer(t.value)
                            for (var f = 0; f < c.value.length; ++f) {
                                var h = { type: (p = c.value[f]).type, value: p.value }
                                switch ((t.altNames.push(h), p.type)) {
                                    case 1:
                                    case 2:
                                    case 6:
                                        break
                                    case 7:
                                        h.ip = n.util.bytesToIP(p.value)
                                        break
                                    case 8:
                                        h.oid = a.derToOid(p.value)
                                }
                            }
                        } else if ('subjectKeyIdentifier' === t.name) {
                            c = a.fromDer(t.value)
                            t.subjectKeyIdentifier = n.util.bytesToHex(c.value)
                        }
                    return t
                }),
                (i.certificationRequestFromAsn1 = function (e, t) {
                    var r = {},
                        s = []
                    if (!a.validate(e, f, r, s)) {
                        var o = new Error(
                            'Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest.'
                        )
                        throw ((o.errors = s), o)
                    }
                    if (a.derToOid(r.publicKeyOid) !== i.oids.rsaEncryption)
                        throw new Error('Cannot read public key. OID is not RSA.')
                    var c = i.createCertificationRequest()
                    if (
                        ((c.version = r.csrVersion ? r.csrVersion.charCodeAt(0) : 0),
                        (c.signatureOid = n.asn1.derToOid(r.csrSignatureOid)),
                        (c.signatureParameters = d(c.signatureOid, r.csrSignatureParams, !0)),
                        (c.siginfo.algorithmOid = n.asn1.derToOid(r.csrSignatureOid)),
                        (c.siginfo.parameters = d(c.siginfo.algorithmOid, r.csrSignatureParams, !1)),
                        (c.signature = r.csrSignature),
                        (c.certificationRequestInfo = r.certificationRequestInfo),
                        t)
                    ) {
                        c.md = y({ signatureOid: c.signatureOid, type: 'certification request' })
                        var u = a.toDer(c.certificationRequestInfo)
                        c.md.update(u.getBytes())
                    }
                    var l = n.md.sha1.create()
                    return (
                        (c.subject.getField = function (e) {
                            return h(c.subject, e)
                        }),
                        (c.subject.addField = function (e) {
                            m([e]), c.subject.attributes.push(e)
                        }),
                        (c.subject.attributes = i.RDNAttributesAsArray(r.certificationRequestInfoSubject, l)),
                        (c.subject.hash = l.digest().toHex()),
                        (c.publicKey = i.publicKeyFromAsn1(r.subjectPublicKeyInfo)),
                        (c.getAttribute = function (e) {
                            return h(c, e)
                        }),
                        (c.addAttribute = function (e) {
                            m([e]), c.attributes.push(e)
                        }),
                        (c.attributes = i.CRIAttributesAsArray(r.certificationRequestInfoAttributes || [])),
                        c
                    )
                }),
                (i.createCertificationRequest = function () {
                    var e = { version: 0, signatureOid: null, signature: null, siginfo: {} }
                    return (
                        (e.siginfo.algorithmOid = null),
                        (e.subject = {}),
                        (e.subject.getField = function (t) {
                            return h(e.subject, t)
                        }),
                        (e.subject.addField = function (t) {
                            m([t]), e.subject.attributes.push(t)
                        }),
                        (e.subject.attributes = []),
                        (e.subject.hash = null),
                        (e.publicKey = null),
                        (e.attributes = []),
                        (e.getAttribute = function (t) {
                            return h(e, t)
                        }),
                        (e.addAttribute = function (t) {
                            m([t]), e.attributes.push(t)
                        }),
                        (e.md = null),
                        (e.setSubject = function (t) {
                            m(t), (e.subject.attributes = t), (e.subject.hash = null)
                        }),
                        (e.setAttributes = function (t) {
                            m(t), (e.attributes = t)
                        }),
                        (e.sign = function (t, r) {
                            e.md = r || n.md.sha1.create()
                            var o = s[e.md.algorithm + 'WithRSAEncryption']
                            if (!o) {
                                var c = new Error(
                                    'Could not compute certification request digest. Unknown message digest algorithm OID.'
                                )
                                throw ((c.algorithm = e.md.algorithm), c)
                            }
                            ;(e.signatureOid = e.siginfo.algorithmOid = o),
                                (e.certificationRequestInfo = i.getCertificationRequestInfo(e))
                            var u = a.toDer(e.certificationRequestInfo)
                            e.md.update(u.getBytes()), (e.signature = t.sign(e.md))
                        }),
                        (e.verify = function () {
                            var t = !1,
                                r = e.md
                            if (null === r) {
                                r = y({ signatureOid: e.signatureOid, type: 'certification request' })
                                var n = e.certificationRequestInfo || i.getCertificationRequestInfo(e),
                                    s = a.toDer(n)
                                r.update(s.getBytes())
                            }
                            return null !== r && (t = g({ certificate: e, md: r, signature: e.signature })), t
                        }),
                        e
                    )
                })
            var T = new Date('1950-01-01T00:00:00Z'),
                I = new Date('2050-01-01T00:00:00Z')
            function b(e) {
                return e >= T && e < I
                    ? a.create(a.Class.UNIVERSAL, a.Type.UTCTIME, !1, a.dateToUtcTime(e))
                    : a.create(a.Class.UNIVERSAL, a.Type.GENERALIZEDTIME, !1, a.dateToGeneralizedTime(e))
            }
            ;(i.getTBSCertificate = function (e) {
                var t = b(e.validity.notBefore),
                    r = b(e.validity.notAfter),
                    s = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                        a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [
                            a.create(a.Class.UNIVERSAL, a.Type.INTEGER, !1, a.integerToDer(e.version).getBytes()),
                        ]),
                        a.create(a.Class.UNIVERSAL, a.Type.INTEGER, !1, n.util.hexToBytes(e.serialNumber)),
                        a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                            a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(e.siginfo.algorithmOid).getBytes()),
                            E(e.siginfo.algorithmOid, e.siginfo.parameters),
                        ]),
                        v(e.issuer),
                        a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [t, r]),
                        v(e.subject),
                        i.publicKeyToAsn1(e.publicKey),
                    ])
                return (
                    e.issuer.uniqueId &&
                        s.value.push(
                            a.create(a.Class.CONTEXT_SPECIFIC, 1, !0, [
                                a.create(
                                    a.Class.UNIVERSAL,
                                    a.Type.BITSTRING,
                                    !1,
                                    String.fromCharCode(0) + e.issuer.uniqueId
                                ),
                            ])
                        ),
                    e.subject.uniqueId &&
                        s.value.push(
                            a.create(a.Class.CONTEXT_SPECIFIC, 2, !0, [
                                a.create(
                                    a.Class.UNIVERSAL,
                                    a.Type.BITSTRING,
                                    !1,
                                    String.fromCharCode(0) + e.subject.uniqueId
                                ),
                            ])
                        ),
                    e.extensions.length > 0 && s.value.push(i.certificateExtensionsToAsn1(e.extensions)),
                    s
                )
            }),
                (i.getCertificationRequestInfo = function (e) {
                    return a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                        a.create(a.Class.UNIVERSAL, a.Type.INTEGER, !1, a.integerToDer(e.version).getBytes()),
                        v(e.subject),
                        i.publicKeyToAsn1(e.publicKey),
                        S(e),
                    ])
                }),
                (i.distinguishedNameToAsn1 = function (e) {
                    return v(e)
                }),
                (i.certificateToAsn1 = function (e) {
                    var t = e.tbsCertificate || i.getTBSCertificate(e)
                    return a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                        t,
                        a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                            a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(e.signatureOid).getBytes()),
                            E(e.signatureOid, e.signatureParameters),
                        ]),
                        a.create(a.Class.UNIVERSAL, a.Type.BITSTRING, !1, String.fromCharCode(0) + e.signature),
                    ])
                }),
                (i.certificateExtensionsToAsn1 = function (e) {
                    var t = a.create(a.Class.CONTEXT_SPECIFIC, 3, !0, []),
                        r = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [])
                    t.value.push(r)
                    for (var n = 0; n < e.length; ++n) r.value.push(i.certificateExtensionToAsn1(e[n]))
                    return t
                }),
                (i.certificateExtensionToAsn1 = function (e) {
                    var t = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [])
                    t.value.push(a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(e.id).getBytes())),
                        e.critical &&
                            t.value.push(a.create(a.Class.UNIVERSAL, a.Type.BOOLEAN, !1, String.fromCharCode(255)))
                    var r = e.value
                    return (
                        'string' != typeof e.value && (r = a.toDer(r).getBytes()),
                        t.value.push(a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, r)),
                        t
                    )
                }),
                (i.certificationRequestToAsn1 = function (e) {
                    var t = e.certificationRequestInfo || i.getCertificationRequestInfo(e)
                    return a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                        t,
                        a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                            a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(e.signatureOid).getBytes()),
                            E(e.signatureOid, e.signatureParameters),
                        ]),
                        a.create(a.Class.UNIVERSAL, a.Type.BITSTRING, !1, String.fromCharCode(0) + e.signature),
                    ])
                }),
                (i.createCaStore = function (e) {
                    var t = { certs: {} }
                    function r(e) {
                        return s(e), t.certs[e.hash] || null
                    }
                    function s(e) {
                        if (!e.hash) {
                            var t = n.md.sha1.create()
                            ;(e.attributes = i.RDNAttributesAsArray(v(e), t)), (e.hash = t.digest().toHex())
                        }
                    }
                    if (
                        ((t.getIssuer = function (e) {
                            return r(e.issuer)
                        }),
                        (t.addCertificate = function (e) {
                            if (
                                ('string' == typeof e && (e = n.pki.certificateFromPem(e)),
                                s(e.subject),
                                !t.hasCertificate(e))
                            )
                                if (e.subject.hash in t.certs) {
                                    var r = t.certs[e.subject.hash]
                                    n.util.isArray(r) || (r = [r]), r.push(e), (t.certs[e.subject.hash] = r)
                                } else t.certs[e.subject.hash] = e
                        }),
                        (t.hasCertificate = function (e) {
                            'string' == typeof e && (e = n.pki.certificateFromPem(e))
                            var t = r(e.subject)
                            if (!t) return !1
                            n.util.isArray(t) || (t = [t])
                            for (var s = a.toDer(i.certificateToAsn1(e)).getBytes(), o = 0; o < t.length; ++o) {
                                if (s === a.toDer(i.certificateToAsn1(t[o])).getBytes()) return !0
                            }
                            return !1
                        }),
                        (t.listAllCertificates = function () {
                            var e = []
                            for (var r in t.certs)
                                if (t.certs.hasOwnProperty(r)) {
                                    var a = t.certs[r]
                                    if (n.util.isArray(a)) for (var i = 0; i < a.length; ++i) e.push(a[i])
                                    else e.push(a)
                                }
                            return e
                        }),
                        (t.removeCertificate = function (e) {
                            var o
                            if (
                                ('string' == typeof e && (e = n.pki.certificateFromPem(e)),
                                s(e.subject),
                                !t.hasCertificate(e))
                            )
                                return null
                            var c = r(e.subject)
                            if (!n.util.isArray(c))
                                return (o = t.certs[e.subject.hash]), delete t.certs[e.subject.hash], o
                            for (var u = a.toDer(i.certificateToAsn1(e)).getBytes(), l = 0; l < c.length; ++l) {
                                u === a.toDer(i.certificateToAsn1(c[l])).getBytes() && ((o = c[l]), c.splice(l, 1))
                            }
                            return 0 === c.length && delete t.certs[e.subject.hash], o
                        }),
                        e)
                    )
                        for (var o = 0; o < e.length; ++o) {
                            var c = e[o]
                            t.addCertificate(c)
                        }
                    return t
                }),
                (i.certificateError = {
                    bad_certificate: 'forge.pki.BadCertificate',
                    unsupported_certificate: 'forge.pki.UnsupportedCertificate',
                    certificate_revoked: 'forge.pki.CertificateRevoked',
                    certificate_expired: 'forge.pki.CertificateExpired',
                    certificate_unknown: 'forge.pki.CertificateUnknown',
                    unknown_ca: 'forge.pki.UnknownCertificateAuthority',
                }),
                (i.verifyCertificateChain = function (e, t, r) {
                    'function' == typeof r && (r = { verify: r }), (r = r || {})
                    var a = (t = t.slice(0)).slice(0),
                        s = r.validityCheckDate
                    void 0 === s && (s = new Date())
                    var o = !0,
                        c = null,
                        u = 0
                    do {
                        var l = t.shift(),
                            p = null,
                            f = !1
                        if (
                            (s &&
                                (s < l.validity.notBefore || s > l.validity.notAfter) &&
                                (c = {
                                    message: 'Certificate is not valid yet or has expired.',
                                    error: i.certificateError.certificate_expired,
                                    notBefore: l.validity.notBefore,
                                    notAfter: l.validity.notAfter,
                                    now: s,
                                }),
                            null === c)
                        ) {
                            if ((null === (p = t[0] || e.getIssuer(l)) && l.isIssuer(l) && ((f = !0), (p = l)), p)) {
                                var h = p
                                n.util.isArray(h) || (h = [h])
                                for (var d = !1; !d && h.length > 0; ) {
                                    p = h.shift()
                                    try {
                                        d = p.verify(l)
                                    } catch (e) {}
                                }
                                d ||
                                    (c = {
                                        message: 'Certificate signature is invalid.',
                                        error: i.certificateError.bad_certificate,
                                    })
                            }
                            null !== c ||
                                (p && !f) ||
                                e.hasCertificate(l) ||
                                (c = { message: 'Certificate is not trusted.', error: i.certificateError.unknown_ca })
                        }
                        if (
                            (null === c &&
                                p &&
                                !l.isIssuer(p) &&
                                (c = {
                                    message: 'Certificate issuer is invalid.',
                                    error: i.certificateError.bad_certificate,
                                }),
                            null === c)
                        )
                            for (
                                var y = { keyUsage: !0, basicConstraints: !0 }, g = 0;
                                null === c && g < l.extensions.length;
                                ++g
                            ) {
                                var v = l.extensions[g]
                                v.critical &&
                                    !(v.name in y) &&
                                    (c = {
                                        message: 'Certificate has an unsupported critical extension.',
                                        error: i.certificateError.unsupported_certificate,
                                    })
                            }
                        if (null === c && (!o || (0 === t.length && (!p || f)))) {
                            var m = l.getExtension('basicConstraints'),
                                C = l.getExtension('keyUsage')
                            if (
                                (null !== C &&
                                    ((C.keyCertSign && null !== m) ||
                                        (c = {
                                            message:
                                                "Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.",
                                            error: i.certificateError.bad_certificate,
                                        })),
                                null !== c ||
                                    null === m ||
                                    m.cA ||
                                    (c = {
                                        message: 'Certificate basicConstraints indicates the certificate is not a CA.',
                                        error: i.certificateError.bad_certificate,
                                    }),
                                null === c && null !== C && 'pathLenConstraint' in m)
                            )
                                u - 1 > m.pathLenConstraint &&
                                    (c = {
                                        message: 'Certificate basicConstraints pathLenConstraint violated.',
                                        error: i.certificateError.bad_certificate,
                                    })
                        }
                        var E = null === c || c.error,
                            S = r.verify ? r.verify(E, u, a) : E
                        if (!0 !== S)
                            throw (
                                (!0 === E &&
                                    (c = {
                                        message: 'The application rejected the certificate.',
                                        error: i.certificateError.bad_certificate,
                                    }),
                                (S || 0 === S) &&
                                    ('object' != typeof S || n.util.isArray(S)
                                        ? 'string' == typeof S && (c.error = S)
                                        : (S.message && (c.message = S.message), S.error && (c.error = S.error))),
                                c)
                            )
                        ;(c = null), (o = !1), ++u
                    } while (t.length > 0)
                    return !0
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(2),
                r(1),
                ((e.exports = n.pss = n.pss || {}).create = function (e) {
                    3 === arguments.length && (e = { md: arguments[0], mgf: arguments[1], saltLength: arguments[2] })
                    var t,
                        r = e.md,
                        a = e.mgf,
                        i = r.digestLength,
                        s = e.salt || null
                    if (('string' == typeof s && (s = n.util.createBuffer(s)), 'saltLength' in e)) t = e.saltLength
                    else {
                        if (null === s) throw new Error('Salt length not specified or specific salt not given.')
                        t = s.length()
                    }
                    if (null !== s && s.length() !== t)
                        throw new Error('Given salt length does not match length of given salt.')
                    var o = e.prng || n.random,
                        c = {
                            encode: function (e, c) {
                                var u,
                                    l,
                                    p = c - 1,
                                    f = Math.ceil(p / 8),
                                    h = e.digest().getBytes()
                                if (f < i + t + 2) throw new Error('Message is too long to encrypt.')
                                l = null === s ? o.getBytesSync(t) : s.bytes()
                                var d = new n.util.ByteBuffer()
                                d.fillWithByte(0, 8), d.putBytes(h), d.putBytes(l), r.start(), r.update(d.getBytes())
                                var y = r.digest().getBytes(),
                                    g = new n.util.ByteBuffer()
                                g.fillWithByte(0, f - t - i - 2), g.putByte(1), g.putBytes(l)
                                var v = g.getBytes(),
                                    m = f - i - 1,
                                    C = a.generate(y, m),
                                    E = ''
                                for (u = 0; u < m; u++) E += String.fromCharCode(v.charCodeAt(u) ^ C.charCodeAt(u))
                                var S = (65280 >> (8 * f - p)) & 255
                                return (
                                    (E = String.fromCharCode(E.charCodeAt(0) & ~S) + E.substr(1)) +
                                    y +
                                    String.fromCharCode(188)
                                )
                            },
                            verify: function (e, s, o) {
                                var c,
                                    u = o - 1,
                                    l = Math.ceil(u / 8)
                                if (((s = s.substr(-l)), l < i + t + 2))
                                    throw new Error('Inconsistent parameters to PSS signature verification.')
                                if (188 !== s.charCodeAt(l - 1))
                                    throw new Error('Encoded message does not end in 0xBC.')
                                var p = l - i - 1,
                                    f = s.substr(0, p),
                                    h = s.substr(p, i),
                                    d = (65280 >> (8 * l - u)) & 255
                                if (0 != (f.charCodeAt(0) & d))
                                    throw new Error('Bits beyond keysize not zero as expected.')
                                var y = a.generate(h, p),
                                    g = ''
                                for (c = 0; c < p; c++) g += String.fromCharCode(f.charCodeAt(c) ^ y.charCodeAt(c))
                                g = String.fromCharCode(g.charCodeAt(0) & ~d) + g.substr(1)
                                var v = l - i - t - 2
                                for (c = 0; c < v; c++)
                                    if (0 !== g.charCodeAt(c)) throw new Error('Leftmost octets not zero as expected')
                                if (1 !== g.charCodeAt(v))
                                    throw new Error('Inconsistent PSS signature, 0x01 marker not found')
                                var m = g.substr(-t),
                                    C = new n.util.ByteBuffer()
                                return (
                                    C.fillWithByte(0, 8),
                                    C.putBytes(e),
                                    C.putBytes(m),
                                    r.start(),
                                    r.update(C.getBytes()),
                                    h === r.digest().getBytes()
                                )
                            },
                        }
                    return c
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(1), (n.cipher = n.cipher || {})
            var a = (e.exports = n.cipher.modes = n.cipher.modes || {})
            function i(e, t) {
                if (('string' == typeof e && (e = n.util.createBuffer(e)), n.util.isArray(e) && e.length > 4)) {
                    var r = e
                    e = n.util.createBuffer()
                    for (var a = 0; a < r.length; ++a) e.putByte(r[a])
                }
                if (e.length() < t)
                    throw new Error('Invalid IV length; got ' + e.length() + ' bytes and expected ' + t + ' bytes.')
                if (!n.util.isArray(e)) {
                    var i = [],
                        s = t / 4
                    for (a = 0; a < s; ++a) i.push(e.getInt32())
                    e = i
                }
                return e
            }
            function s(e) {
                e[e.length - 1] = (e[e.length - 1] + 1) & 4294967295
            }
            function o(e) {
                return [(e / 4294967296) | 0, 4294967295 & e]
            }
            ;(a.ecb = function (e) {
                ;(e = e || {}),
                    (this.name = 'ECB'),
                    (this.cipher = e.cipher),
                    (this.blockSize = e.blockSize || 16),
                    (this._ints = this.blockSize / 4),
                    (this._inBlock = new Array(this._ints)),
                    (this._outBlock = new Array(this._ints))
            }),
                (a.ecb.prototype.start = function (e) {}),
                (a.ecb.prototype.encrypt = function (e, t, r) {
                    if (e.length() < this.blockSize && !(r && e.length() > 0)) return !0
                    for (var n = 0; n < this._ints; ++n) this._inBlock[n] = e.getInt32()
                    this.cipher.encrypt(this._inBlock, this._outBlock)
                    for (n = 0; n < this._ints; ++n) t.putInt32(this._outBlock[n])
                }),
                (a.ecb.prototype.decrypt = function (e, t, r) {
                    if (e.length() < this.blockSize && !(r && e.length() > 0)) return !0
                    for (var n = 0; n < this._ints; ++n) this._inBlock[n] = e.getInt32()
                    this.cipher.decrypt(this._inBlock, this._outBlock)
                    for (n = 0; n < this._ints; ++n) t.putInt32(this._outBlock[n])
                }),
                (a.ecb.prototype.pad = function (e, t) {
                    var r = e.length() === this.blockSize ? this.blockSize : this.blockSize - e.length()
                    return e.fillWithByte(r, r), !0
                }),
                (a.ecb.prototype.unpad = function (e, t) {
                    if (t.overflow > 0) return !1
                    var r = e.length(),
                        n = e.at(r - 1)
                    return !(n > this.blockSize << 2) && (e.truncate(n), !0)
                }),
                (a.cbc = function (e) {
                    ;(e = e || {}),
                        (this.name = 'CBC'),
                        (this.cipher = e.cipher),
                        (this.blockSize = e.blockSize || 16),
                        (this._ints = this.blockSize / 4),
                        (this._inBlock = new Array(this._ints)),
                        (this._outBlock = new Array(this._ints))
                }),
                (a.cbc.prototype.start = function (e) {
                    if (null === e.iv) {
                        if (!this._prev) throw new Error('Invalid IV parameter.')
                        this._iv = this._prev.slice(0)
                    } else {
                        if (!('iv' in e)) throw new Error('Invalid IV parameter.')
                        ;(this._iv = i(e.iv, this.blockSize)), (this._prev = this._iv.slice(0))
                    }
                }),
                (a.cbc.prototype.encrypt = function (e, t, r) {
                    if (e.length() < this.blockSize && !(r && e.length() > 0)) return !0
                    for (var n = 0; n < this._ints; ++n) this._inBlock[n] = this._prev[n] ^ e.getInt32()
                    this.cipher.encrypt(this._inBlock, this._outBlock)
                    for (n = 0; n < this._ints; ++n) t.putInt32(this._outBlock[n])
                    this._prev = this._outBlock
                }),
                (a.cbc.prototype.decrypt = function (e, t, r) {
                    if (e.length() < this.blockSize && !(r && e.length() > 0)) return !0
                    for (var n = 0; n < this._ints; ++n) this._inBlock[n] = e.getInt32()
                    this.cipher.decrypt(this._inBlock, this._outBlock)
                    for (n = 0; n < this._ints; ++n) t.putInt32(this._prev[n] ^ this._outBlock[n])
                    this._prev = this._inBlock.slice(0)
                }),
                (a.cbc.prototype.pad = function (e, t) {
                    var r = e.length() === this.blockSize ? this.blockSize : this.blockSize - e.length()
                    return e.fillWithByte(r, r), !0
                }),
                (a.cbc.prototype.unpad = function (e, t) {
                    if (t.overflow > 0) return !1
                    var r = e.length(),
                        n = e.at(r - 1)
                    return !(n > this.blockSize << 2) && (e.truncate(n), !0)
                }),
                (a.cfb = function (e) {
                    ;(e = e || {}),
                        (this.name = 'CFB'),
                        (this.cipher = e.cipher),
                        (this.blockSize = e.blockSize || 16),
                        (this._ints = this.blockSize / 4),
                        (this._inBlock = null),
                        (this._outBlock = new Array(this._ints)),
                        (this._partialBlock = new Array(this._ints)),
                        (this._partialOutput = n.util.createBuffer()),
                        (this._partialBytes = 0)
                }),
                (a.cfb.prototype.start = function (e) {
                    if (!('iv' in e)) throw new Error('Invalid IV parameter.')
                    ;(this._iv = i(e.iv, this.blockSize)), (this._inBlock = this._iv.slice(0)), (this._partialBytes = 0)
                }),
                (a.cfb.prototype.encrypt = function (e, t, r) {
                    var n = e.length()
                    if (0 === n) return !0
                    if (
                        (this.cipher.encrypt(this._inBlock, this._outBlock),
                        0 === this._partialBytes && n >= this.blockSize)
                    )
                        for (var a = 0; a < this._ints; ++a)
                            (this._inBlock[a] = e.getInt32() ^ this._outBlock[a]), t.putInt32(this._inBlock[a])
                    else {
                        var i = (this.blockSize - n) % this.blockSize
                        i > 0 && (i = this.blockSize - i), this._partialOutput.clear()
                        for (a = 0; a < this._ints; ++a)
                            (this._partialBlock[a] = e.getInt32() ^ this._outBlock[a]),
                                this._partialOutput.putInt32(this._partialBlock[a])
                        if (i > 0) e.read -= this.blockSize
                        else for (a = 0; a < this._ints; ++a) this._inBlock[a] = this._partialBlock[a]
                        if ((this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes), i > 0 && !r))
                            return (
                                t.putBytes(this._partialOutput.getBytes(i - this._partialBytes)),
                                (this._partialBytes = i),
                                !0
                            )
                        t.putBytes(this._partialOutput.getBytes(n - this._partialBytes)), (this._partialBytes = 0)
                    }
                }),
                (a.cfb.prototype.decrypt = function (e, t, r) {
                    var n = e.length()
                    if (0 === n) return !0
                    if (
                        (this.cipher.encrypt(this._inBlock, this._outBlock),
                        0 === this._partialBytes && n >= this.blockSize)
                    )
                        for (var a = 0; a < this._ints; ++a)
                            (this._inBlock[a] = e.getInt32()), t.putInt32(this._inBlock[a] ^ this._outBlock[a])
                    else {
                        var i = (this.blockSize - n) % this.blockSize
                        i > 0 && (i = this.blockSize - i), this._partialOutput.clear()
                        for (a = 0; a < this._ints; ++a)
                            (this._partialBlock[a] = e.getInt32()),
                                this._partialOutput.putInt32(this._partialBlock[a] ^ this._outBlock[a])
                        if (i > 0) e.read -= this.blockSize
                        else for (a = 0; a < this._ints; ++a) this._inBlock[a] = this._partialBlock[a]
                        if ((this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes), i > 0 && !r))
                            return (
                                t.putBytes(this._partialOutput.getBytes(i - this._partialBytes)),
                                (this._partialBytes = i),
                                !0
                            )
                        t.putBytes(this._partialOutput.getBytes(n - this._partialBytes)), (this._partialBytes = 0)
                    }
                }),
                (a.ofb = function (e) {
                    ;(e = e || {}),
                        (this.name = 'OFB'),
                        (this.cipher = e.cipher),
                        (this.blockSize = e.blockSize || 16),
                        (this._ints = this.blockSize / 4),
                        (this._inBlock = null),
                        (this._outBlock = new Array(this._ints)),
                        (this._partialOutput = n.util.createBuffer()),
                        (this._partialBytes = 0)
                }),
                (a.ofb.prototype.start = function (e) {
                    if (!('iv' in e)) throw new Error('Invalid IV parameter.')
                    ;(this._iv = i(e.iv, this.blockSize)), (this._inBlock = this._iv.slice(0)), (this._partialBytes = 0)
                }),
                (a.ofb.prototype.encrypt = function (e, t, r) {
                    var n = e.length()
                    if (0 === e.length()) return !0
                    if (
                        (this.cipher.encrypt(this._inBlock, this._outBlock),
                        0 === this._partialBytes && n >= this.blockSize)
                    )
                        for (var a = 0; a < this._ints; ++a)
                            t.putInt32(e.getInt32() ^ this._outBlock[a]), (this._inBlock[a] = this._outBlock[a])
                    else {
                        var i = (this.blockSize - n) % this.blockSize
                        i > 0 && (i = this.blockSize - i), this._partialOutput.clear()
                        for (a = 0; a < this._ints; ++a) this._partialOutput.putInt32(e.getInt32() ^ this._outBlock[a])
                        if (i > 0) e.read -= this.blockSize
                        else for (a = 0; a < this._ints; ++a) this._inBlock[a] = this._outBlock[a]
                        if ((this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes), i > 0 && !r))
                            return (
                                t.putBytes(this._partialOutput.getBytes(i - this._partialBytes)),
                                (this._partialBytes = i),
                                !0
                            )
                        t.putBytes(this._partialOutput.getBytes(n - this._partialBytes)), (this._partialBytes = 0)
                    }
                }),
                (a.ofb.prototype.decrypt = a.ofb.prototype.encrypt),
                (a.ctr = function (e) {
                    ;(e = e || {}),
                        (this.name = 'CTR'),
                        (this.cipher = e.cipher),
                        (this.blockSize = e.blockSize || 16),
                        (this._ints = this.blockSize / 4),
                        (this._inBlock = null),
                        (this._outBlock = new Array(this._ints)),
                        (this._partialOutput = n.util.createBuffer()),
                        (this._partialBytes = 0)
                }),
                (a.ctr.prototype.start = function (e) {
                    if (!('iv' in e)) throw new Error('Invalid IV parameter.')
                    ;(this._iv = i(e.iv, this.blockSize)), (this._inBlock = this._iv.slice(0)), (this._partialBytes = 0)
                }),
                (a.ctr.prototype.encrypt = function (e, t, r) {
                    var n = e.length()
                    if (0 === n) return !0
                    if (
                        (this.cipher.encrypt(this._inBlock, this._outBlock),
                        0 === this._partialBytes && n >= this.blockSize)
                    )
                        for (var a = 0; a < this._ints; ++a) t.putInt32(e.getInt32() ^ this._outBlock[a])
                    else {
                        var i = (this.blockSize - n) % this.blockSize
                        i > 0 && (i = this.blockSize - i), this._partialOutput.clear()
                        for (a = 0; a < this._ints; ++a) this._partialOutput.putInt32(e.getInt32() ^ this._outBlock[a])
                        if (
                            (i > 0 && (e.read -= this.blockSize),
                            this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes),
                            i > 0 && !r)
                        )
                            return (
                                t.putBytes(this._partialOutput.getBytes(i - this._partialBytes)),
                                (this._partialBytes = i),
                                !0
                            )
                        t.putBytes(this._partialOutput.getBytes(n - this._partialBytes)), (this._partialBytes = 0)
                    }
                    s(this._inBlock)
                }),
                (a.ctr.prototype.decrypt = a.ctr.prototype.encrypt),
                (a.gcm = function (e) {
                    ;(e = e || {}),
                        (this.name = 'GCM'),
                        (this.cipher = e.cipher),
                        (this.blockSize = e.blockSize || 16),
                        (this._ints = this.blockSize / 4),
                        (this._inBlock = new Array(this._ints)),
                        (this._outBlock = new Array(this._ints)),
                        (this._partialOutput = n.util.createBuffer()),
                        (this._partialBytes = 0),
                        (this._R = 3774873600)
                }),
                (a.gcm.prototype.start = function (e) {
                    if (!('iv' in e)) throw new Error('Invalid IV parameter.')
                    var t,
                        r = n.util.createBuffer(e.iv)
                    if (
                        ((this._cipherLength = 0),
                        (t = 'additionalData' in e ? n.util.createBuffer(e.additionalData) : n.util.createBuffer()),
                        (this._tagLength = 'tagLength' in e ? e.tagLength : 128),
                        (this._tag = null),
                        e.decrypt &&
                            ((this._tag = n.util.createBuffer(e.tag).getBytes()),
                            this._tag.length !== this._tagLength / 8))
                    )
                        throw new Error('Authentication tag does not match tag length.')
                    ;(this._hashBlock = new Array(this._ints)),
                        (this.tag = null),
                        (this._hashSubkey = new Array(this._ints)),
                        this.cipher.encrypt([0, 0, 0, 0], this._hashSubkey),
                        (this.componentBits = 4),
                        (this._m = this.generateHashTable(this._hashSubkey, this.componentBits))
                    var a = r.length()
                    if (12 === a) this._j0 = [r.getInt32(), r.getInt32(), r.getInt32(), 1]
                    else {
                        for (this._j0 = [0, 0, 0, 0]; r.length() > 0; )
                            this._j0 = this.ghash(this._hashSubkey, this._j0, [
                                r.getInt32(),
                                r.getInt32(),
                                r.getInt32(),
                                r.getInt32(),
                            ])
                        this._j0 = this.ghash(this._hashSubkey, this._j0, [0, 0].concat(o(8 * a)))
                    }
                    ;(this._inBlock = this._j0.slice(0)),
                        s(this._inBlock),
                        (this._partialBytes = 0),
                        (t = n.util.createBuffer(t)),
                        (this._aDataLength = o(8 * t.length()))
                    var i = t.length() % this.blockSize
                    for (i && t.fillWithByte(0, this.blockSize - i), this._s = [0, 0, 0, 0]; t.length() > 0; )
                        this._s = this.ghash(this._hashSubkey, this._s, [
                            t.getInt32(),
                            t.getInt32(),
                            t.getInt32(),
                            t.getInt32(),
                        ])
                }),
                (a.gcm.prototype.encrypt = function (e, t, r) {
                    var n = e.length()
                    if (0 === n) return !0
                    if (
                        (this.cipher.encrypt(this._inBlock, this._outBlock),
                        0 === this._partialBytes && n >= this.blockSize)
                    ) {
                        for (var a = 0; a < this._ints; ++a) t.putInt32((this._outBlock[a] ^= e.getInt32()))
                        this._cipherLength += this.blockSize
                    } else {
                        var i = (this.blockSize - n) % this.blockSize
                        i > 0 && (i = this.blockSize - i), this._partialOutput.clear()
                        for (a = 0; a < this._ints; ++a) this._partialOutput.putInt32(e.getInt32() ^ this._outBlock[a])
                        if (i <= 0 || r) {
                            if (r) {
                                var o = n % this.blockSize
                                ;(this._cipherLength += o), this._partialOutput.truncate(this.blockSize - o)
                            } else this._cipherLength += this.blockSize
                            for (a = 0; a < this._ints; ++a) this._outBlock[a] = this._partialOutput.getInt32()
                            this._partialOutput.read -= this.blockSize
                        }
                        if ((this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes), i > 0 && !r))
                            return (
                                (e.read -= this.blockSize),
                                t.putBytes(this._partialOutput.getBytes(i - this._partialBytes)),
                                (this._partialBytes = i),
                                !0
                            )
                        t.putBytes(this._partialOutput.getBytes(n - this._partialBytes)), (this._partialBytes = 0)
                    }
                    ;(this._s = this.ghash(this._hashSubkey, this._s, this._outBlock)), s(this._inBlock)
                }),
                (a.gcm.prototype.decrypt = function (e, t, r) {
                    var n = e.length()
                    if (n < this.blockSize && !(r && n > 0)) return !0
                    this.cipher.encrypt(this._inBlock, this._outBlock),
                        s(this._inBlock),
                        (this._hashBlock[0] = e.getInt32()),
                        (this._hashBlock[1] = e.getInt32()),
                        (this._hashBlock[2] = e.getInt32()),
                        (this._hashBlock[3] = e.getInt32()),
                        (this._s = this.ghash(this._hashSubkey, this._s, this._hashBlock))
                    for (var a = 0; a < this._ints; ++a) t.putInt32(this._outBlock[a] ^ this._hashBlock[a])
                    n < this.blockSize
                        ? (this._cipherLength += n % this.blockSize)
                        : (this._cipherLength += this.blockSize)
                }),
                (a.gcm.prototype.afterFinish = function (e, t) {
                    var r = !0
                    t.decrypt && t.overflow && e.truncate(this.blockSize - t.overflow),
                        (this.tag = n.util.createBuffer())
                    var a = this._aDataLength.concat(o(8 * this._cipherLength))
                    this._s = this.ghash(this._hashSubkey, this._s, a)
                    var i = []
                    this.cipher.encrypt(this._j0, i)
                    for (var s = 0; s < this._ints; ++s) this.tag.putInt32(this._s[s] ^ i[s])
                    return (
                        this.tag.truncate(this.tag.length() % (this._tagLength / 8)),
                        t.decrypt && this.tag.bytes() !== this._tag && (r = !1),
                        r
                    )
                }),
                (a.gcm.prototype.multiply = function (e, t) {
                    for (var r = [0, 0, 0, 0], n = t.slice(0), a = 0; a < 128; ++a) {
                        e[(a / 32) | 0] & (1 << (31 - (a % 32))) &&
                            ((r[0] ^= n[0]), (r[1] ^= n[1]), (r[2] ^= n[2]), (r[3] ^= n[3])),
                            this.pow(n, n)
                    }
                    return r
                }),
                (a.gcm.prototype.pow = function (e, t) {
                    for (var r = 1 & e[3], n = 3; n > 0; --n) t[n] = (e[n] >>> 1) | ((1 & e[n - 1]) << 31)
                    ;(t[0] = e[0] >>> 1), r && (t[0] ^= this._R)
                }),
                (a.gcm.prototype.tableMultiply = function (e) {
                    for (var t = [0, 0, 0, 0], r = 0; r < 32; ++r) {
                        var n = (e[(r / 8) | 0] >>> (4 * (7 - (r % 8)))) & 15,
                            a = this._m[r][n]
                        ;(t[0] ^= a[0]), (t[1] ^= a[1]), (t[2] ^= a[2]), (t[3] ^= a[3])
                    }
                    return t
                }),
                (a.gcm.prototype.ghash = function (e, t, r) {
                    return (t[0] ^= r[0]), (t[1] ^= r[1]), (t[2] ^= r[2]), (t[3] ^= r[3]), this.tableMultiply(t)
                }),
                (a.gcm.prototype.generateHashTable = function (e, t) {
                    for (var r = 8 / t, n = 4 * r, a = 16 * r, i = new Array(a), s = 0; s < a; ++s) {
                        var o = [0, 0, 0, 0],
                            c = (n - 1 - (s % n)) * t
                        ;(o[(s / n) | 0] = (1 << (t - 1)) << c),
                            (i[s] = this.generateSubHashTable(this.multiply(o, e), t))
                    }
                    return i
                }),
                (a.gcm.prototype.generateSubHashTable = function (e, t) {
                    var r = 1 << t,
                        n = r >>> 1,
                        a = new Array(r)
                    a[n] = e.slice(0)
                    for (var i = n >>> 1; i > 0; ) this.pow(a[2 * i], (a[i] = [])), (i >>= 1)
                    for (i = 2; i < n; ) {
                        for (var s = 1; s < i; ++s) {
                            var o = a[i],
                                c = a[s]
                            a[i + s] = [o[0] ^ c[0], o[1] ^ c[1], o[2] ^ c[2], o[3] ^ c[3]]
                        }
                        i *= 2
                    }
                    for (a[0] = [0, 0, 0, 0], i = n + 1; i < r; ++i) {
                        var u = a[i ^ n]
                        a[i] = [e[0] ^ u[0], e[1] ^ u[1], e[2] ^ u[2], e[3] ^ u[3]]
                    }
                    return a
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(3), r(6), r(22), r(7), r(16), r(28), r(19), r(12), r(1), r(18)
            var a = n.asn1,
                i = (e.exports = n.pki = n.pki || {})
            ;(i.pemToDer = function (e) {
                var t = n.pem.decode(e)[0]
                if (t.procType && 'ENCRYPTED' === t.procType.type)
                    throw new Error('Could not convert PEM to DER; PEM is encrypted.')
                return n.util.createBuffer(t.body)
            }),
                (i.privateKeyFromPem = function (e) {
                    var t = n.pem.decode(e)[0]
                    if ('PRIVATE KEY' !== t.type && 'RSA PRIVATE KEY' !== t.type) {
                        var r = new Error(
                            'Could not convert private key from PEM; PEM header type is not "PRIVATE KEY" or "RSA PRIVATE KEY".'
                        )
                        throw ((r.headerType = t.type), r)
                    }
                    if (t.procType && 'ENCRYPTED' === t.procType.type)
                        throw new Error('Could not convert private key from PEM; PEM is encrypted.')
                    var s = a.fromDer(t.body)
                    return i.privateKeyFromAsn1(s)
                }),
                (i.privateKeyToPem = function (e, t) {
                    var r = { type: 'RSA PRIVATE KEY', body: a.toDer(i.privateKeyToAsn1(e)).getBytes() }
                    return n.pem.encode(r, { maxline: t })
                }),
                (i.privateKeyInfoToPem = function (e, t) {
                    var r = { type: 'PRIVATE KEY', body: a.toDer(e).getBytes() }
                    return n.pem.encode(r, { maxline: t })
                })
        },
        function (e, t, r) {
            var n = r(0)
            if ((r(5), r(3), r(11), r(4), r(6), r(16), r(7), r(2), r(25), r(12), r(1), void 0 === a))
                var a = n.jsbn.BigInteger
            var i = n.asn1,
                s = (n.pki = n.pki || {})
            e.exports = s.pbe = n.pbe = n.pbe || {}
            var o = s.oids,
                c = {
                    name: 'EncryptedPrivateKeyInfo',
                    tagClass: i.Class.UNIVERSAL,
                    type: i.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'EncryptedPrivateKeyInfo.encryptionAlgorithm',
                            tagClass: i.Class.UNIVERSAL,
                            type: i.Type.SEQUENCE,
                            constructed: !0,
                            value: [
                                {
                                    name: 'AlgorithmIdentifier.algorithm',
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.OID,
                                    constructed: !1,
                                    capture: 'encryptionOid',
                                },
                                {
                                    name: 'AlgorithmIdentifier.parameters',
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.SEQUENCE,
                                    constructed: !0,
                                    captureAsn1: 'encryptionParams',
                                },
                            ],
                        },
                        {
                            name: 'EncryptedPrivateKeyInfo.encryptedData',
                            tagClass: i.Class.UNIVERSAL,
                            type: i.Type.OCTETSTRING,
                            constructed: !1,
                            capture: 'encryptedData',
                        },
                    ],
                },
                u = {
                    name: 'PBES2Algorithms',
                    tagClass: i.Class.UNIVERSAL,
                    type: i.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'PBES2Algorithms.keyDerivationFunc',
                            tagClass: i.Class.UNIVERSAL,
                            type: i.Type.SEQUENCE,
                            constructed: !0,
                            value: [
                                {
                                    name: 'PBES2Algorithms.keyDerivationFunc.oid',
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.OID,
                                    constructed: !1,
                                    capture: 'kdfOid',
                                },
                                {
                                    name: 'PBES2Algorithms.params',
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.SEQUENCE,
                                    constructed: !0,
                                    value: [
                                        {
                                            name: 'PBES2Algorithms.params.salt',
                                            tagClass: i.Class.UNIVERSAL,
                                            type: i.Type.OCTETSTRING,
                                            constructed: !1,
                                            capture: 'kdfSalt',
                                        },
                                        {
                                            name: 'PBES2Algorithms.params.iterationCount',
                                            tagClass: i.Class.UNIVERSAL,
                                            type: i.Type.INTEGER,
                                            constructed: !1,
                                            capture: 'kdfIterationCount',
                                        },
                                        {
                                            name: 'PBES2Algorithms.params.keyLength',
                                            tagClass: i.Class.UNIVERSAL,
                                            type: i.Type.INTEGER,
                                            constructed: !1,
                                            optional: !0,
                                            capture: 'keyLength',
                                        },
                                        {
                                            name: 'PBES2Algorithms.params.prf',
                                            tagClass: i.Class.UNIVERSAL,
                                            type: i.Type.SEQUENCE,
                                            constructed: !0,
                                            optional: !0,
                                            value: [
                                                {
                                                    name: 'PBES2Algorithms.params.prf.algorithm',
                                                    tagClass: i.Class.UNIVERSAL,
                                                    type: i.Type.OID,
                                                    constructed: !1,
                                                    capture: 'prfOid',
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: 'PBES2Algorithms.encryptionScheme',
                            tagClass: i.Class.UNIVERSAL,
                            type: i.Type.SEQUENCE,
                            constructed: !0,
                            value: [
                                {
                                    name: 'PBES2Algorithms.encryptionScheme.oid',
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.OID,
                                    constructed: !1,
                                    capture: 'encOid',
                                },
                                {
                                    name: 'PBES2Algorithms.encryptionScheme.iv',
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.OCTETSTRING,
                                    constructed: !1,
                                    capture: 'encIv',
                                },
                            ],
                        },
                    ],
                },
                l = {
                    name: 'pkcs-12PbeParams',
                    tagClass: i.Class.UNIVERSAL,
                    type: i.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'pkcs-12PbeParams.salt',
                            tagClass: i.Class.UNIVERSAL,
                            type: i.Type.OCTETSTRING,
                            constructed: !1,
                            capture: 'salt',
                        },
                        {
                            name: 'pkcs-12PbeParams.iterations',
                            tagClass: i.Class.UNIVERSAL,
                            type: i.Type.INTEGER,
                            constructed: !1,
                            capture: 'iterations',
                        },
                    ],
                }
            function p(e, t) {
                return e.start().update(t).digest().getBytes()
            }
            function f(e) {
                var t
                if (e) {
                    if (!(t = s.oids[i.derToOid(e)])) {
                        var r = new Error('Unsupported PRF OID.')
                        throw (
                            ((r.oid = e),
                            (r.supported = [
                                'hmacWithSHA1',
                                'hmacWithSHA224',
                                'hmacWithSHA256',
                                'hmacWithSHA384',
                                'hmacWithSHA512',
                            ]),
                            r)
                        )
                    }
                } else t = 'hmacWithSHA1'
                return h(t)
            }
            function h(e) {
                var t = n.md
                switch (e) {
                    case 'hmacWithSHA224':
                        t = n.md.sha512
                    case 'hmacWithSHA1':
                    case 'hmacWithSHA256':
                    case 'hmacWithSHA384':
                    case 'hmacWithSHA512':
                        e = e.substr(8).toLowerCase()
                        break
                    default:
                        var r = new Error('Unsupported PRF algorithm.')
                        throw (
                            ((r.algorithm = e),
                            (r.supported = [
                                'hmacWithSHA1',
                                'hmacWithSHA224',
                                'hmacWithSHA256',
                                'hmacWithSHA384',
                                'hmacWithSHA512',
                            ]),
                            r)
                        )
                }
                if (!t || !(e in t)) throw new Error('Unknown hash algorithm: ' + e)
                return t[e].create()
            }
            ;(s.encryptPrivateKeyInfo = function (e, t, r) {
                ;((r = r || {}).saltSize = r.saltSize || 8),
                    (r.count = r.count || 2048),
                    (r.algorithm = r.algorithm || 'aes128'),
                    (r.prfAlgorithm = r.prfAlgorithm || 'sha1')
                var a,
                    c,
                    u,
                    l = n.random.getBytesSync(r.saltSize),
                    p = r.count,
                    f = i.integerToDer(p)
                if (0 === r.algorithm.indexOf('aes') || 'des' === r.algorithm) {
                    var d, y, g
                    switch (r.algorithm) {
                        case 'aes128':
                            ;(a = 16), (d = 16), (y = o['aes128-CBC']), (g = n.aes.createEncryptionCipher)
                            break
                        case 'aes192':
                            ;(a = 24), (d = 16), (y = o['aes192-CBC']), (g = n.aes.createEncryptionCipher)
                            break
                        case 'aes256':
                            ;(a = 32), (d = 16), (y = o['aes256-CBC']), (g = n.aes.createEncryptionCipher)
                            break
                        case 'des':
                            ;(a = 8), (d = 8), (y = o.desCBC), (g = n.des.createEncryptionCipher)
                            break
                        default:
                            throw (
                                (((T = new Error(
                                    'Cannot encrypt private key. Unknown encryption algorithm.'
                                )).algorithm = r.algorithm),
                                T)
                            )
                    }
                    var v = 'hmacWith' + r.prfAlgorithm.toUpperCase(),
                        m = h(v),
                        C = n.pkcs5.pbkdf2(t, l, p, a, m),
                        E = n.random.getBytesSync(d)
                    ;(I = g(C)).start(E), I.update(i.toDer(e)), I.finish(), (u = I.output.getBytes())
                    var S = (function (e, t, r, a) {
                        var o = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [
                            i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, e),
                            i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, t.getBytes()),
                        ])
                        'hmacWithSHA1' !== a &&
                            o.value.push(
                                i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, n.util.hexToBytes(r.toString(16))),
                                i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [
                                    i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(s.oids[a]).getBytes()),
                                    i.create(i.Class.UNIVERSAL, i.Type.NULL, !1, ''),
                                ])
                            )
                        return o
                    })(l, f, a, v)
                    c = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [
                        i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(o.pkcs5PBES2).getBytes()),
                        i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [
                            i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [
                                i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(o.pkcs5PBKDF2).getBytes()),
                                S,
                            ]),
                            i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [
                                i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(y).getBytes()),
                                i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, E),
                            ]),
                        ]),
                    ])
                } else {
                    var T
                    if ('3des' !== r.algorithm)
                        throw (
                            (((T = new Error('Cannot encrypt private key. Unknown encryption algorithm.')).algorithm =
                                r.algorithm),
                            T)
                        )
                    a = 24
                    var I,
                        b = new n.util.ByteBuffer(l)
                    ;(C = s.pbe.generatePkcs12Key(t, b, 1, p, a)), (E = s.pbe.generatePkcs12Key(t, b, 2, p, a))
                    ;(I = n.des.createEncryptionCipher(C)).start(E),
                        I.update(i.toDer(e)),
                        I.finish(),
                        (u = I.output.getBytes()),
                        (c = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [
                            i.create(
                                i.Class.UNIVERSAL,
                                i.Type.OID,
                                !1,
                                i.oidToDer(o['pbeWithSHAAnd3-KeyTripleDES-CBC']).getBytes()
                            ),
                            i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [
                                i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, l),
                                i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, f.getBytes()),
                            ]),
                        ]))
                }
                return i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [
                    c,
                    i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, u),
                ])
            }),
                (s.decryptPrivateKeyInfo = function (e, t) {
                    var r = null,
                        a = {},
                        o = []
                    if (!i.validate(e, c, a, o)) {
                        var u = new Error(
                            'Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.'
                        )
                        throw ((u.errors = o), u)
                    }
                    var l = i.derToOid(a.encryptionOid),
                        p = s.pbe.getCipher(l, a.encryptionParams, t),
                        f = n.util.createBuffer(a.encryptedData)
                    return p.update(f), p.finish() && (r = i.fromDer(p.output)), r
                }),
                (s.encryptedPrivateKeyToPem = function (e, t) {
                    var r = { type: 'ENCRYPTED PRIVATE KEY', body: i.toDer(e).getBytes() }
                    return n.pem.encode(r, { maxline: t })
                }),
                (s.encryptedPrivateKeyFromPem = function (e) {
                    var t = n.pem.decode(e)[0]
                    if ('ENCRYPTED PRIVATE KEY' !== t.type) {
                        var r = new Error(
                            'Could not convert encrypted private key from PEM; PEM header type is "ENCRYPTED PRIVATE KEY".'
                        )
                        throw ((r.headerType = t.type), r)
                    }
                    if (t.procType && 'ENCRYPTED' === t.procType.type)
                        throw new Error('Could not convert encrypted private key from PEM; PEM is encrypted.')
                    return i.fromDer(t.body)
                }),
                (s.encryptRsaPrivateKey = function (e, t, r) {
                    if (!(r = r || {}).legacy) {
                        var a = s.wrapRsaPrivateKey(s.privateKeyToAsn1(e))
                        return (a = s.encryptPrivateKeyInfo(a, t, r)), s.encryptedPrivateKeyToPem(a)
                    }
                    var o, c, u, l
                    switch (r.algorithm) {
                        case 'aes128':
                            ;(o = 'AES-128-CBC'),
                                (u = 16),
                                (c = n.random.getBytesSync(16)),
                                (l = n.aes.createEncryptionCipher)
                            break
                        case 'aes192':
                            ;(o = 'AES-192-CBC'),
                                (u = 24),
                                (c = n.random.getBytesSync(16)),
                                (l = n.aes.createEncryptionCipher)
                            break
                        case 'aes256':
                            ;(o = 'AES-256-CBC'),
                                (u = 32),
                                (c = n.random.getBytesSync(16)),
                                (l = n.aes.createEncryptionCipher)
                            break
                        case '3des':
                            ;(o = 'DES-EDE3-CBC'),
                                (u = 24),
                                (c = n.random.getBytesSync(8)),
                                (l = n.des.createEncryptionCipher)
                            break
                        case 'des':
                            ;(o = 'DES-CBC'),
                                (u = 8),
                                (c = n.random.getBytesSync(8)),
                                (l = n.des.createEncryptionCipher)
                            break
                        default:
                            var p = new Error(
                                'Could not encrypt RSA private key; unsupported encryption algorithm "' +
                                    r.algorithm +
                                    '".'
                            )
                            throw ((p.algorithm = r.algorithm), p)
                    }
                    var f = l(n.pbe.opensslDeriveBytes(t, c.substr(0, 8), u))
                    f.start(c), f.update(i.toDer(s.privateKeyToAsn1(e))), f.finish()
                    var h = {
                        type: 'RSA PRIVATE KEY',
                        procType: { version: '4', type: 'ENCRYPTED' },
                        dekInfo: { algorithm: o, parameters: n.util.bytesToHex(c).toUpperCase() },
                        body: f.output.getBytes(),
                    }
                    return n.pem.encode(h)
                }),
                (s.decryptRsaPrivateKey = function (e, t) {
                    var r = null,
                        a = n.pem.decode(e)[0]
                    if ('ENCRYPTED PRIVATE KEY' !== a.type && 'PRIVATE KEY' !== a.type && 'RSA PRIVATE KEY' !== a.type)
                        throw (
                            (((u = new Error(
                                'Could not convert private key from PEM; PEM header type is not "ENCRYPTED PRIVATE KEY", "PRIVATE KEY", or "RSA PRIVATE KEY".'
                            )).headerType = u),
                            u)
                        )
                    if (a.procType && 'ENCRYPTED' === a.procType.type) {
                        var o, c
                        switch (a.dekInfo.algorithm) {
                            case 'DES-CBC':
                                ;(o = 8), (c = n.des.createDecryptionCipher)
                                break
                            case 'DES-EDE3-CBC':
                                ;(o = 24), (c = n.des.createDecryptionCipher)
                                break
                            case 'AES-128-CBC':
                                ;(o = 16), (c = n.aes.createDecryptionCipher)
                                break
                            case 'AES-192-CBC':
                                ;(o = 24), (c = n.aes.createDecryptionCipher)
                                break
                            case 'AES-256-CBC':
                                ;(o = 32), (c = n.aes.createDecryptionCipher)
                                break
                            case 'RC2-40-CBC':
                                ;(o = 5),
                                    (c = function (e) {
                                        return n.rc2.createDecryptionCipher(e, 40)
                                    })
                                break
                            case 'RC2-64-CBC':
                                ;(o = 8),
                                    (c = function (e) {
                                        return n.rc2.createDecryptionCipher(e, 64)
                                    })
                                break
                            case 'RC2-128-CBC':
                                ;(o = 16),
                                    (c = function (e) {
                                        return n.rc2.createDecryptionCipher(e, 128)
                                    })
                                break
                            default:
                                var u
                                throw (
                                    (((u = new Error(
                                        'Could not decrypt private key; unsupported encryption algorithm "' +
                                            a.dekInfo.algorithm +
                                            '".'
                                    )).algorithm = a.dekInfo.algorithm),
                                    u)
                                )
                        }
                        var l = n.util.hexToBytes(a.dekInfo.parameters),
                            p = c(n.pbe.opensslDeriveBytes(t, l.substr(0, 8), o))
                        if ((p.start(l), p.update(n.util.createBuffer(a.body)), !p.finish())) return r
                        r = p.output.getBytes()
                    } else r = a.body
                    return (
                        null !==
                            (r =
                                'ENCRYPTED PRIVATE KEY' === a.type
                                    ? s.decryptPrivateKeyInfo(i.fromDer(r), t)
                                    : i.fromDer(r)) && (r = s.privateKeyFromAsn1(r)),
                        r
                    )
                }),
                (s.pbe.generatePkcs12Key = function (e, t, r, a, i, s) {
                    var o, c
                    if (null == s) {
                        if (!('sha1' in n.md)) throw new Error('"sha1" hash algorithm unavailable.')
                        s = n.md.sha1.create()
                    }
                    var u = s.digestLength,
                        l = s.blockLength,
                        p = new n.util.ByteBuffer(),
                        f = new n.util.ByteBuffer()
                    if (null != e) {
                        for (c = 0; c < e.length; c++) f.putInt16(e.charCodeAt(c))
                        f.putInt16(0)
                    }
                    var h = f.length(),
                        d = t.length(),
                        y = new n.util.ByteBuffer()
                    y.fillWithByte(r, l)
                    var g = l * Math.ceil(d / l),
                        v = new n.util.ByteBuffer()
                    for (c = 0; c < g; c++) v.putByte(t.at(c % d))
                    var m = l * Math.ceil(h / l),
                        C = new n.util.ByteBuffer()
                    for (c = 0; c < m; c++) C.putByte(f.at(c % h))
                    var E = v
                    E.putBuffer(C)
                    for (var S = Math.ceil(i / u), T = 1; T <= S; T++) {
                        var I = new n.util.ByteBuffer()
                        I.putBytes(y.bytes()), I.putBytes(E.bytes())
                        for (var b = 0; b < a; b++) s.start(), s.update(I.getBytes()), (I = s.digest())
                        var A = new n.util.ByteBuffer()
                        for (c = 0; c < l; c++) A.putByte(I.at(c % u))
                        var B = Math.ceil(d / l) + Math.ceil(h / l),
                            N = new n.util.ByteBuffer()
                        for (o = 0; o < B; o++) {
                            var k = new n.util.ByteBuffer(E.getBytes(l)),
                                w = 511
                            for (c = A.length() - 1; c >= 0; c--)
                                (w >>= 8), (w += A.at(c) + k.at(c)), k.setAt(c, 255 & w)
                            N.putBuffer(k)
                        }
                        ;(E = N), p.putBuffer(I)
                    }
                    return p.truncate(p.length() - i), p
                }),
                (s.pbe.getCipher = function (e, t, r) {
                    switch (e) {
                        case s.oids.pkcs5PBES2:
                            return s.pbe.getCipherForPBES2(e, t, r)
                        case s.oids['pbeWithSHAAnd3-KeyTripleDES-CBC']:
                        case s.oids['pbewithSHAAnd40BitRC2-CBC']:
                            return s.pbe.getCipherForPKCS12PBE(e, t, r)
                        default:
                            var n = new Error('Cannot read encrypted PBE data block. Unsupported OID.')
                            throw (
                                ((n.oid = e),
                                (n.supportedOids = [
                                    'pkcs5PBES2',
                                    'pbeWithSHAAnd3-KeyTripleDES-CBC',
                                    'pbewithSHAAnd40BitRC2-CBC',
                                ]),
                                n)
                            )
                    }
                }),
                (s.pbe.getCipherForPBES2 = function (e, t, r) {
                    var a,
                        o = {},
                        c = []
                    if (!i.validate(t, u, o, c))
                        throw (
                            (((a = new Error(
                                'Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.'
                            )).errors = c),
                            a)
                        )
                    if ((e = i.derToOid(o.kdfOid)) !== s.oids.pkcs5PBKDF2)
                        throw (
                            (((a = new Error(
                                'Cannot read encrypted private key. Unsupported key derivation function OID.'
                            )).oid = e),
                            (a.supportedOids = ['pkcs5PBKDF2']),
                            a)
                        )
                    if (
                        (e = i.derToOid(o.encOid)) !== s.oids['aes128-CBC'] &&
                        e !== s.oids['aes192-CBC'] &&
                        e !== s.oids['aes256-CBC'] &&
                        e !== s.oids['des-EDE3-CBC'] &&
                        e !== s.oids.desCBC
                    )
                        throw (
                            (((a = new Error(
                                'Cannot read encrypted private key. Unsupported encryption scheme OID.'
                            )).oid = e),
                            (a.supportedOids = ['aes128-CBC', 'aes192-CBC', 'aes256-CBC', 'des-EDE3-CBC', 'desCBC']),
                            a)
                        )
                    var l,
                        p,
                        h = o.kdfSalt,
                        d = n.util.createBuffer(o.kdfIterationCount)
                    switch (((d = d.getInt(d.length() << 3)), s.oids[e])) {
                        case 'aes128-CBC':
                            ;(l = 16), (p = n.aes.createDecryptionCipher)
                            break
                        case 'aes192-CBC':
                            ;(l = 24), (p = n.aes.createDecryptionCipher)
                            break
                        case 'aes256-CBC':
                            ;(l = 32), (p = n.aes.createDecryptionCipher)
                            break
                        case 'des-EDE3-CBC':
                            ;(l = 24), (p = n.des.createDecryptionCipher)
                            break
                        case 'desCBC':
                            ;(l = 8), (p = n.des.createDecryptionCipher)
                    }
                    var y = f(o.prfOid),
                        g = n.pkcs5.pbkdf2(r, h, d, l, y),
                        v = o.encIv,
                        m = p(g)
                    return m.start(v), m
                }),
                (s.pbe.getCipherForPKCS12PBE = function (e, t, r) {
                    var a = {},
                        o = []
                    if (!i.validate(t, l, a, o))
                        throw (
                            (((y = new Error(
                                'Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.'
                            )).errors = o),
                            y)
                        )
                    var c,
                        u,
                        p,
                        h = n.util.createBuffer(a.salt),
                        d = n.util.createBuffer(a.iterations)
                    switch (((d = d.getInt(d.length() << 3)), e)) {
                        case s.oids['pbeWithSHAAnd3-KeyTripleDES-CBC']:
                            ;(c = 24), (u = 8), (p = n.des.startDecrypting)
                            break
                        case s.oids['pbewithSHAAnd40BitRC2-CBC']:
                            ;(c = 5),
                                (u = 8),
                                (p = function (e, t) {
                                    var r = n.rc2.createDecryptionCipher(e, 40)
                                    return r.start(t, null), r
                                })
                            break
                        default:
                            var y
                            throw (
                                (((y = new Error('Cannot read PKCS #12 PBE data block. Unsupported OID.')).oid = e), y)
                            )
                    }
                    var g = f(a.prfOid),
                        v = s.pbe.generatePkcs12Key(r, h, 1, d, c, g)
                    return g.start(), p(v, s.pbe.generatePkcs12Key(r, h, 2, d, u, g))
                }),
                (s.pbe.opensslDeriveBytes = function (e, t, r, a) {
                    if (null == a) {
                        if (!('md5' in n.md)) throw new Error('"md5" hash algorithm unavailable.')
                        a = n.md.md5.create()
                    }
                    null === t && (t = '')
                    for (var i = [p(a, e + t)], s = 16, o = 1; s < r; ++o, s += 16) i.push(p(a, i[o - 1] + e + t))
                    return i.join('').substr(0, r)
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(4), r(1)
            var a = (e.exports = n.sha256 = n.sha256 || {})
            ;(n.md.sha256 = n.md.algorithms.sha256 = a),
                (a.create = function () {
                    s ||
                        ((i = String.fromCharCode(128)),
                        (i += n.util.fillString(String.fromCharCode(0), 64)),
                        (o = [
                            1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748,
                            2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206,
                            2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122,
                            1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891,
                            3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700,
                            1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771,
                            3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877,
                            958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452,
                            2361852424, 2428436474, 2756734187, 3204031479, 3329325298,
                        ]),
                        (s = !0))
                    var e = null,
                        t = n.util.createBuffer(),
                        r = new Array(64),
                        a = {
                            algorithm: 'sha256',
                            blockLength: 64,
                            digestLength: 32,
                            messageLength: 0,
                            fullMessageLength: null,
                            messageLengthSize: 8,
                            start: function () {
                                ;(a.messageLength = 0), (a.fullMessageLength = a.messageLength64 = [])
                                for (var r = a.messageLengthSize / 4, i = 0; i < r; ++i) a.fullMessageLength.push(0)
                                return (
                                    (t = n.util.createBuffer()),
                                    (e = {
                                        h0: 1779033703,
                                        h1: 3144134277,
                                        h2: 1013904242,
                                        h3: 2773480762,
                                        h4: 1359893119,
                                        h5: 2600822924,
                                        h6: 528734635,
                                        h7: 1541459225,
                                    }),
                                    a
                                )
                            },
                        }
                    return (
                        a.start(),
                        (a.update = function (i, s) {
                            'utf8' === s && (i = n.util.encodeUtf8(i))
                            var o = i.length
                            ;(a.messageLength += o), (o = [(o / 4294967296) >>> 0, o >>> 0])
                            for (var u = a.fullMessageLength.length - 1; u >= 0; --u)
                                (a.fullMessageLength[u] += o[1]),
                                    (o[1] = o[0] + ((a.fullMessageLength[u] / 4294967296) >>> 0)),
                                    (a.fullMessageLength[u] = a.fullMessageLength[u] >>> 0),
                                    (o[0] = (o[1] / 4294967296) >>> 0)
                            return t.putBytes(i), c(e, r, t), (t.read > 2048 || 0 === t.length()) && t.compact(), a
                        }),
                        (a.digest = function () {
                            var s = n.util.createBuffer()
                            s.putBytes(t.bytes())
                            var o,
                                u =
                                    (a.fullMessageLength[a.fullMessageLength.length - 1] + a.messageLengthSize) &
                                    (a.blockLength - 1)
                            s.putBytes(i.substr(0, a.blockLength - u))
                            for (var l = 8 * a.fullMessageLength[0], p = 0; p < a.fullMessageLength.length - 1; ++p)
                                (l += ((o = 8 * a.fullMessageLength[p + 1]) / 4294967296) >>> 0),
                                    s.putInt32(l >>> 0),
                                    (l = o >>> 0)
                            s.putInt32(l)
                            var f = { h0: e.h0, h1: e.h1, h2: e.h2, h3: e.h3, h4: e.h4, h5: e.h5, h6: e.h6, h7: e.h7 }
                            c(f, r, s)
                            var h = n.util.createBuffer()
                            return (
                                h.putInt32(f.h0),
                                h.putInt32(f.h1),
                                h.putInt32(f.h2),
                                h.putInt32(f.h3),
                                h.putInt32(f.h4),
                                h.putInt32(f.h5),
                                h.putInt32(f.h6),
                                h.putInt32(f.h7),
                                h
                            )
                        }),
                        a
                    )
                })
            var i = null,
                s = !1,
                o = null
            function c(e, t, r) {
                for (var n, a, i, s, c, u, l, p, f, h, d, y, g, v = r.length(); v >= 64; ) {
                    for (c = 0; c < 16; ++c) t[c] = r.getInt32()
                    for (; c < 64; ++c)
                        (n = (((n = t[c - 2]) >>> 17) | (n << 15)) ^ ((n >>> 19) | (n << 13)) ^ (n >>> 10)),
                            (a = (((a = t[c - 15]) >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3)),
                            (t[c] = (n + t[c - 7] + a + t[c - 16]) | 0)
                    for (
                        u = e.h0, l = e.h1, p = e.h2, f = e.h3, h = e.h4, d = e.h5, y = e.h6, g = e.h7, c = 0;
                        c < 64;
                        ++c
                    )
                        (i = ((u >>> 2) | (u << 30)) ^ ((u >>> 13) | (u << 19)) ^ ((u >>> 22) | (u << 10))),
                            (s = (u & l) | (p & (u ^ l))),
                            (n =
                                g +
                                (((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7))) +
                                (y ^ (h & (d ^ y))) +
                                o[c] +
                                t[c]),
                            (g = y),
                            (y = d),
                            (d = h),
                            (h = (f + n) >>> 0),
                            (f = p),
                            (p = l),
                            (l = u),
                            (u = (n + (a = i + s)) >>> 0)
                    ;(e.h0 = (e.h0 + u) | 0),
                        (e.h1 = (e.h1 + l) | 0),
                        (e.h2 = (e.h2 + p) | 0),
                        (e.h3 = (e.h3 + f) | 0),
                        (e.h4 = (e.h4 + h) | 0),
                        (e.h5 = (e.h5 + d) | 0),
                        (e.h6 = (e.h6 + y) | 0),
                        (e.h7 = (e.h7 + g) | 0),
                        (v -= 64)
                }
            }
        },
        function (e, t, r) {
            var n = r(0)
            r(1)
            var a = null
            !n.util.isNodejs || n.options.usePureJavaScript || process.versions['node-webkit'] || (a = r(17)),
                ((e.exports = n.prng = n.prng || {}).create = function (e) {
                    for (
                        var t = {
                                plugin: e,
                                key: null,
                                seed: null,
                                time: null,
                                reseeds: 0,
                                generated: 0,
                                keyBytes: '',
                            },
                            r = e.md,
                            i = new Array(32),
                            s = 0;
                        s < 32;
                        ++s
                    )
                        i[s] = r.create()
                    function o() {
                        if (t.pools[0].messageLength >= 32) return c()
                        var e = (32 - t.pools[0].messageLength) << 5
                        t.collect(t.seedFileSync(e)), c()
                    }
                    function c() {
                        t.reseeds = 4294967295 === t.reseeds ? 0 : t.reseeds + 1
                        var e = t.plugin.md.create()
                        e.update(t.keyBytes)
                        for (var r = 1, n = 0; n < 32; ++n)
                            t.reseeds % r == 0 && (e.update(t.pools[n].digest().getBytes()), t.pools[n].start()),
                                (r <<= 1)
                        ;(t.keyBytes = e.digest().getBytes()), e.start(), e.update(t.keyBytes)
                        var a = e.digest().getBytes()
                        ;(t.key = t.plugin.formatKey(t.keyBytes)), (t.seed = t.plugin.formatSeed(a)), (t.generated = 0)
                    }
                    function u(e) {
                        var t = null,
                            r = n.util.globalScope,
                            a = r.crypto || r.msCrypto
                        a &&
                            a.getRandomValues &&
                            (t = function (e) {
                                return a.getRandomValues(e)
                            })
                        var i = n.util.createBuffer()
                        if (t)
                            for (; i.length() < e; ) {
                                var s = Math.max(1, Math.min(e - i.length(), 65536) / 4),
                                    o = new Uint32Array(Math.floor(s))
                                try {
                                    t(o)
                                    for (var c = 0; c < o.length; ++c) i.putInt32(o[c])
                                } catch (e) {
                                    if (!('undefined' != typeof QuotaExceededError && e instanceof QuotaExceededError))
                                        throw e
                                }
                            }
                        if (i.length() < e)
                            for (var u, l, p, f = Math.floor(65536 * Math.random()); i.length() < e; ) {
                                ;(l = 16807 * (65535 & f)),
                                    (l += (32767 & (u = 16807 * (f >> 16))) << 16),
                                    (f = 4294967295 & (l = (2147483647 & (l += u >> 15)) + (l >> 31)))
                                for (c = 0; c < 3; ++c)
                                    (p = f >>> (c << 3)), (p ^= Math.floor(256 * Math.random())), i.putByte(255 & p)
                            }
                        return i.getBytes(e)
                    }
                    return (
                        (t.pools = i),
                        (t.pool = 0),
                        (t.generate = function (e, r) {
                            if (!r) return t.generateSync(e)
                            var a = t.plugin.cipher,
                                i = t.plugin.increment,
                                s = t.plugin.formatKey,
                                o = t.plugin.formatSeed,
                                u = n.util.createBuffer()
                            ;(t.key = null),
                                (function l(p) {
                                    if (p) return r(p)
                                    if (u.length() >= e) return r(null, u.getBytes(e))
                                    t.generated > 1048575 && (t.key = null)
                                    if (null === t.key)
                                        return n.util.nextTick(function () {
                                            !(function (e) {
                                                if (t.pools[0].messageLength >= 32) return c(), e()
                                                var r = (32 - t.pools[0].messageLength) << 5
                                                t.seedFile(r, function (r, n) {
                                                    if (r) return e(r)
                                                    t.collect(n), c(), e()
                                                })
                                            })(l)
                                        })
                                    var f = a(t.key, t.seed)
                                    ;(t.generated += f.length),
                                        u.putBytes(f),
                                        (t.key = s(a(t.key, i(t.seed)))),
                                        (t.seed = o(a(t.key, t.seed))),
                                        n.util.setImmediate(l)
                                })()
                        }),
                        (t.generateSync = function (e) {
                            var r = t.plugin.cipher,
                                a = t.plugin.increment,
                                i = t.plugin.formatKey,
                                s = t.plugin.formatSeed
                            t.key = null
                            for (var c = n.util.createBuffer(); c.length() < e; ) {
                                t.generated > 1048575 && (t.key = null), null === t.key && o()
                                var u = r(t.key, t.seed)
                                ;(t.generated += u.length),
                                    c.putBytes(u),
                                    (t.key = i(r(t.key, a(t.seed)))),
                                    (t.seed = s(r(t.key, t.seed)))
                            }
                            return c.getBytes(e)
                        }),
                        a
                            ? ((t.seedFile = function (e, t) {
                                  a.randomBytes(e, function (e, r) {
                                      if (e) return t(e)
                                      t(null, r.toString())
                                  })
                              }),
                              (t.seedFileSync = function (e) {
                                  return a.randomBytes(e).toString()
                              }))
                            : ((t.seedFile = function (e, t) {
                                  try {
                                      t(null, u(e))
                                  } catch (e) {
                                      t(e)
                                  }
                              }),
                              (t.seedFileSync = u)),
                        (t.collect = function (e) {
                            for (var r = e.length, n = 0; n < r; ++n)
                                t.pools[t.pool].update(e.substr(n, 1)), (t.pool = 31 === t.pool ? 0 : t.pool + 1)
                        }),
                        (t.collectInt = function (e, r) {
                            for (var n = '', a = 0; a < r; a += 8) n += String.fromCharCode((e >> a) & 255)
                            t.collect(n)
                        }),
                        (t.registerWorker = function (e) {
                            if (e === self)
                                t.seedFile = function (e, t) {
                                    self.addEventListener('message', function e(r) {
                                        var n = r.data
                                        n.forge &&
                                            n.forge.prng &&
                                            (self.removeEventListener('message', e),
                                            t(n.forge.prng.err, n.forge.prng.bytes))
                                    }),
                                        self.postMessage({ forge: { prng: { needed: e } } })
                                }
                            else {
                                e.addEventListener('message', function (r) {
                                    var n = r.data
                                    n.forge &&
                                        n.forge.prng &&
                                        t.seedFile(n.forge.prng.needed, function (t, r) {
                                            e.postMessage({ forge: { prng: { err: t, bytes: r } } })
                                        })
                                })
                            }
                        }),
                        t
                    )
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(1)
            var a = [
                    217, 120, 249, 196, 25, 221, 181, 237, 40, 233, 253, 121, 74, 160, 216, 157, 198, 126, 55, 131, 43,
                    118, 83, 142, 98, 76, 100, 136, 68, 139, 251, 162, 23, 154, 89, 245, 135, 179, 79, 19, 97, 69, 109,
                    141, 9, 129, 125, 50, 189, 143, 64, 235, 134, 183, 123, 11, 240, 149, 33, 34, 92, 107, 78, 130, 84,
                    214, 101, 147, 206, 96, 178, 28, 115, 86, 192, 20, 167, 140, 241, 220, 18, 117, 202, 31, 59, 190,
                    228, 209, 66, 61, 212, 48, 163, 60, 182, 38, 111, 191, 14, 218, 70, 105, 7, 87, 39, 242, 29, 155,
                    188, 148, 67, 3, 248, 17, 199, 246, 144, 239, 62, 231, 6, 195, 213, 47, 200, 102, 30, 215, 8, 232,
                    234, 222, 128, 82, 238, 247, 132, 170, 114, 172, 53, 77, 106, 42, 150, 26, 210, 113, 90, 21, 73,
                    116, 75, 159, 208, 94, 4, 24, 164, 236, 194, 224, 65, 110, 15, 81, 203, 204, 36, 145, 175, 80, 161,
                    244, 112, 57, 153, 124, 58, 133, 35, 184, 180, 122, 252, 2, 54, 91, 37, 85, 151, 49, 45, 93, 250,
                    152, 227, 138, 146, 174, 5, 223, 41, 16, 103, 108, 186, 201, 211, 0, 230, 207, 225, 158, 168, 44,
                    99, 22, 1, 63, 88, 226, 137, 169, 13, 56, 52, 27, 171, 51, 255, 176, 187, 72, 12, 95, 185, 177, 205,
                    46, 197, 243, 219, 71, 229, 165, 156, 119, 10, 166, 32, 104, 254, 127, 193, 173,
                ],
                i = [1, 2, 3, 5],
                s = function (e, t) {
                    return ((e << t) & 65535) | ((65535 & e) >> (16 - t))
                },
                o = function (e, t) {
                    return ((65535 & e) >> t) | ((e << (16 - t)) & 65535)
                }
            ;(e.exports = n.rc2 = n.rc2 || {}),
                (n.rc2.expandKey = function (e, t) {
                    'string' == typeof e && (e = n.util.createBuffer(e)), (t = t || 128)
                    var r,
                        i = e,
                        s = e.length(),
                        o = t,
                        c = Math.ceil(o / 8),
                        u = 255 >> (7 & o)
                    for (r = s; r < 128; r++) i.putByte(a[(i.at(r - 1) + i.at(r - s)) & 255])
                    for (i.setAt(128 - c, a[i.at(128 - c) & u]), r = 127 - c; r >= 0; r--)
                        i.setAt(r, a[i.at(r + 1) ^ i.at(r + c)])
                    return i
                })
            var c = function (e, t, r) {
                var a,
                    c,
                    u,
                    l,
                    p = !1,
                    f = null,
                    h = null,
                    d = null,
                    y = []
                for (e = n.rc2.expandKey(e, t), u = 0; u < 64; u++) y.push(e.getInt16Le())
                r
                    ? ((a = function (e) {
                          for (u = 0; u < 4; u++)
                              (e[u] += y[l] + (e[(u + 3) % 4] & e[(u + 2) % 4]) + (~e[(u + 3) % 4] & e[(u + 1) % 4])),
                                  (e[u] = s(e[u], i[u])),
                                  l++
                      }),
                      (c = function (e) {
                          for (u = 0; u < 4; u++) e[u] += y[63 & e[(u + 3) % 4]]
                      }))
                    : ((a = function (e) {
                          for (u = 3; u >= 0; u--)
                              (e[u] = o(e[u], i[u])),
                                  (e[u] -=
                                      y[l] + (e[(u + 3) % 4] & e[(u + 2) % 4]) + (~e[(u + 3) % 4] & e[(u + 1) % 4])),
                                  l--
                      }),
                      (c = function (e) {
                          for (u = 3; u >= 0; u--) e[u] -= y[63 & e[(u + 3) % 4]]
                      }))
                var g = function (e) {
                        var t = []
                        for (u = 0; u < 4; u++) {
                            var n = f.getInt16Le()
                            null !== d && (r ? (n ^= d.getInt16Le()) : d.putInt16Le(n)), t.push(65535 & n)
                        }
                        l = r ? 0 : 63
                        for (var a = 0; a < e.length; a++) for (var i = 0; i < e[a][0]; i++) e[a][1](t)
                        for (u = 0; u < 4; u++)
                            null !== d && (r ? d.putInt16Le(t[u]) : (t[u] ^= d.getInt16Le())), h.putInt16Le(t[u])
                    },
                    v = null
                return (v = {
                    start: function (e, t) {
                        e && 'string' == typeof e && (e = n.util.createBuffer(e)),
                            (p = !1),
                            (f = n.util.createBuffer()),
                            (h = t || new n.util.createBuffer()),
                            (d = e),
                            (v.output = h)
                    },
                    update: function (e) {
                        for (p || f.putBuffer(e); f.length() >= 8; )
                            g([
                                [5, a],
                                [1, c],
                                [6, a],
                                [1, c],
                                [5, a],
                            ])
                    },
                    finish: function (e) {
                        var t = !0
                        if (r)
                            if (e) t = e(8, f, !r)
                            else {
                                var n = 8 === f.length() ? 8 : 8 - f.length()
                                f.fillWithByte(n, n)
                            }
                        if ((t && ((p = !0), v.update()), !r && (t = 0 === f.length())))
                            if (e) t = e(8, h, !r)
                            else {
                                var a = h.length(),
                                    i = h.at(a - 1)
                                i > a ? (t = !1) : h.truncate(i)
                            }
                        return t
                    },
                })
            }
            ;(n.rc2.startEncrypting = function (e, t, r) {
                var a = n.rc2.createEncryptionCipher(e, 128)
                return a.start(t, r), a
            }),
                (n.rc2.createEncryptionCipher = function (e, t) {
                    return c(e, t, !0)
                }),
                (n.rc2.startDecrypting = function (e, t, r) {
                    var a = n.rc2.createDecryptionCipher(e, 128)
                    return a.start(t, r), a
                }),
                (n.rc2.createDecryptionCipher = function (e, t) {
                    return c(e, t, !1)
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(1), r(2), r(9)
            var a = (e.exports = n.pkcs1 = n.pkcs1 || {})
            function i(e, t, r) {
                r || (r = n.md.sha1.create())
                for (var a = '', i = Math.ceil(t / r.digestLength), s = 0; s < i; ++s) {
                    var o = String.fromCharCode((s >> 24) & 255, (s >> 16) & 255, (s >> 8) & 255, 255 & s)
                    r.start(), r.update(e + o), (a += r.digest().getBytes())
                }
                return a.substring(0, t)
            }
            ;(a.encode_rsa_oaep = function (e, t, r) {
                var a, s, o, c
                'string' == typeof r
                    ? ((a = r), (s = arguments[3] || void 0), (o = arguments[4] || void 0))
                    : r &&
                      ((a = r.label || void 0),
                      (s = r.seed || void 0),
                      (o = r.md || void 0),
                      r.mgf1 && r.mgf1.md && (c = r.mgf1.md)),
                    o ? o.start() : (o = n.md.sha1.create()),
                    c || (c = o)
                var u = Math.ceil(e.n.bitLength() / 8),
                    l = u - 2 * o.digestLength - 2
                if (t.length > l)
                    throw (
                        (((g = new Error('RSAES-OAEP input message length is too long.')).length = t.length),
                        (g.maxLength = l),
                        g)
                    )
                a || (a = ''), o.update(a, 'raw')
                for (var p = o.digest(), f = '', h = l - t.length, d = 0; d < h; d++) f += '\0'
                var y = p.getBytes() + f + '' + t
                if (s) {
                    if (s.length !== o.digestLength) {
                        var g
                        throw (
                            (((g = new Error(
                                'Invalid RSAES-OAEP seed. The seed length must match the digest length.'
                            )).seedLength = s.length),
                            (g.digestLength = o.digestLength),
                            g)
                        )
                    }
                } else s = n.random.getBytes(o.digestLength)
                var v = i(s, u - o.digestLength - 1, c),
                    m = n.util.xorBytes(y, v, y.length),
                    C = i(m, o.digestLength, c),
                    E = n.util.xorBytes(s, C, s.length)
                return '\0' + E + m
            }),
                (a.decode_rsa_oaep = function (e, t, r) {
                    var a, s, o
                    'string' == typeof r
                        ? ((a = r), (s = arguments[3] || void 0))
                        : r && ((a = r.label || void 0), (s = r.md || void 0), r.mgf1 && r.mgf1.md && (o = r.mgf1.md))
                    var c = Math.ceil(e.n.bitLength() / 8)
                    if (t.length !== c)
                        throw (
                            (((m = new Error('RSAES-OAEP encoded message length is invalid.')).length = t.length),
                            (m.expectedLength = c),
                            m)
                        )
                    if ((void 0 === s ? (s = n.md.sha1.create()) : s.start(), o || (o = s), c < 2 * s.digestLength + 2))
                        throw new Error('RSAES-OAEP key is too short for the hash function.')
                    a || (a = ''), s.update(a, 'raw')
                    for (
                        var u = s.digest().getBytes(),
                            l = t.charAt(0),
                            p = t.substring(1, s.digestLength + 1),
                            f = t.substring(1 + s.digestLength),
                            h = i(f, s.digestLength, o),
                            d = n.util.xorBytes(p, h, p.length),
                            y = i(d, c - s.digestLength - 1, o),
                            g = n.util.xorBytes(f, y, f.length),
                            v = g.substring(0, s.digestLength),
                            m = '\0' !== l,
                            C = 0;
                        C < s.digestLength;
                        ++C
                    )
                        m |= u.charAt(C) !== v.charAt(C)
                    for (var E = 1, S = s.digestLength, T = s.digestLength; T < g.length; T++) {
                        var I = g.charCodeAt(T),
                            b = (1 & I) ^ 1,
                            A = E ? 65534 : 0
                        ;(m |= I & A), (S += E &= b)
                    }
                    if (m || 1 !== g.charCodeAt(S)) throw new Error('Invalid RSAES-OAEP padding.')
                    return g.substring(S + 1)
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(1),
                r(13),
                r(2),
                (function () {
                    if (n.prime) e.exports = n.prime
                    else {
                        var t = (e.exports = n.prime = n.prime || {}),
                            r = n.jsbn.BigInteger,
                            a = [6, 4, 2, 4, 2, 4, 6, 2],
                            i = new r(null)
                        i.fromInt(30)
                        var s = function (e, t) {
                            return e | t
                        }
                        t.generateProbablePrime = function (e, t, a) {
                            'function' == typeof t && ((a = t), (t = {}))
                            var i = (t = t || {}).algorithm || 'PRIMEINC'
                            'string' == typeof i && (i = { name: i }), (i.options = i.options || {})
                            var s = t.prng || n.random,
                                u = {
                                    nextBytes: function (e) {
                                        for (var t = s.getBytesSync(e.length), r = 0; r < e.length; ++r)
                                            e[r] = t.charCodeAt(r)
                                    },
                                }
                            if ('PRIMEINC' === i.name)
                                return (function (e, t, a, i) {
                                    if ('workers' in a)
                                        return (function (e, t, a, i) {
                                            if ('undefined' == typeof Worker) return o(e, t, a, i)
                                            var s = c(e, t),
                                                u = a.workers,
                                                l = a.workLoad || 100,
                                                p = (30 * l) / 8,
                                                f = a.workerScript || 'forge/prime.worker.js'
                                            if (-1 === u)
                                                return n.util.estimateCores(function (e, t) {
                                                    e && (t = 2), (u = t - 1), h()
                                                })
                                            function h() {
                                                u = Math.max(1, u)
                                                for (var n = [], a = 0; a < u; ++a) n[a] = new Worker(f)
                                                for (a = 0; a < u; ++a) n[a].addEventListener('message', h)
                                                var o = !1
                                                function h(a) {
                                                    if (!o) {
                                                        0
                                                        var u = a.data
                                                        if (u.found) {
                                                            for (var f = 0; f < n.length; ++f) n[f].terminate()
                                                            return (o = !0), i(null, new r(u.prime, 16))
                                                        }
                                                        s.bitLength() > e && (s = c(e, t))
                                                        var h = s.toString(16)
                                                        a.target.postMessage({ hex: h, workLoad: l }),
                                                            s.dAddOffset(p, 0)
                                                    }
                                                }
                                            }
                                            h()
                                        })(e, t, a, i)
                                    return o(e, t, a, i)
                                })(e, u, i.options, a)
                            throw new Error('Invalid prime generation algorithm: ' + i.name)
                        }
                    }
                    function o(e, t, r, i) {
                        var s = c(e, t),
                            o = (function (e) {
                                return e <= 100
                                    ? 27
                                    : e <= 150
                                    ? 18
                                    : e <= 200
                                    ? 15
                                    : e <= 250
                                    ? 12
                                    : e <= 300
                                    ? 9
                                    : e <= 350
                                    ? 8
                                    : e <= 400
                                    ? 7
                                    : e <= 500
                                    ? 6
                                    : e <= 600
                                    ? 5
                                    : e <= 800
                                    ? 4
                                    : e <= 1250
                                    ? 3
                                    : 2
                            })(s.bitLength())
                        'millerRabinTests' in r && (o = r.millerRabinTests)
                        var u = 10
                        'maxBlockTime' in r && (u = r.maxBlockTime),
                            (function e(t, r, i, s, o, u, l) {
                                var p = +new Date()
                                do {
                                    if ((t.bitLength() > r && (t = c(r, i)), t.isProbablePrime(o))) return l(null, t)
                                    t.dAddOffset(a[s++ % 8], 0)
                                } while (u < 0 || +new Date() - p < u)
                                n.util.setImmediate(function () {
                                    e(t, r, i, s, o, u, l)
                                })
                            })(s, e, t, 0, o, u, i)
                    }
                    function c(e, t) {
                        var n = new r(e, t),
                            a = e - 1
                        return (
                            n.testBit(a) || n.bitwiseTo(r.ONE.shiftLeft(a), s, n),
                            n.dAddOffset(31 - n.mod(i).byteValue(), 0),
                            n
                        )
                    }
                })()
        },
        function (e, t, r) {
            var n = r(0)
            r(3), r(8), r(6), r(29), r(22), r(2), r(12), r(9), r(1), r(18)
            var a = n.asn1,
                i = n.pki,
                s = (e.exports = n.pkcs12 = n.pkcs12 || {}),
                o = {
                    name: 'ContentInfo',
                    tagClass: a.Class.UNIVERSAL,
                    type: a.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'ContentInfo.contentType',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.OID,
                            constructed: !1,
                            capture: 'contentType',
                        },
                        {
                            name: 'ContentInfo.content',
                            tagClass: a.Class.CONTEXT_SPECIFIC,
                            constructed: !0,
                            captureAsn1: 'content',
                        },
                    ],
                },
                c = {
                    name: 'PFX',
                    tagClass: a.Class.UNIVERSAL,
                    type: a.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'PFX.version',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.INTEGER,
                            constructed: !1,
                            capture: 'version',
                        },
                        o,
                        {
                            name: 'PFX.macData',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.SEQUENCE,
                            constructed: !0,
                            optional: !0,
                            captureAsn1: 'mac',
                            value: [
                                {
                                    name: 'PFX.macData.mac',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.SEQUENCE,
                                    constructed: !0,
                                    value: [
                                        {
                                            name: 'PFX.macData.mac.digestAlgorithm',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.SEQUENCE,
                                            constructed: !0,
                                            value: [
                                                {
                                                    name: 'PFX.macData.mac.digestAlgorithm.algorithm',
                                                    tagClass: a.Class.UNIVERSAL,
                                                    type: a.Type.OID,
                                                    constructed: !1,
                                                    capture: 'macAlgorithm',
                                                },
                                                {
                                                    name: 'PFX.macData.mac.digestAlgorithm.parameters',
                                                    tagClass: a.Class.UNIVERSAL,
                                                    captureAsn1: 'macAlgorithmParameters',
                                                },
                                            ],
                                        },
                                        {
                                            name: 'PFX.macData.mac.digest',
                                            tagClass: a.Class.UNIVERSAL,
                                            type: a.Type.OCTETSTRING,
                                            constructed: !1,
                                            capture: 'macDigest',
                                        },
                                    ],
                                },
                                {
                                    name: 'PFX.macData.macSalt',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.OCTETSTRING,
                                    constructed: !1,
                                    capture: 'macSalt',
                                },
                                {
                                    name: 'PFX.macData.iterations',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.INTEGER,
                                    constructed: !1,
                                    optional: !0,
                                    capture: 'macIterations',
                                },
                            ],
                        },
                    ],
                },
                u = {
                    name: 'SafeBag',
                    tagClass: a.Class.UNIVERSAL,
                    type: a.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'SafeBag.bagId',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.OID,
                            constructed: !1,
                            capture: 'bagId',
                        },
                        {
                            name: 'SafeBag.bagValue',
                            tagClass: a.Class.CONTEXT_SPECIFIC,
                            constructed: !0,
                            captureAsn1: 'bagValue',
                        },
                        {
                            name: 'SafeBag.bagAttributes',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.SET,
                            constructed: !0,
                            optional: !0,
                            capture: 'bagAttributes',
                        },
                    ],
                },
                l = {
                    name: 'Attribute',
                    tagClass: a.Class.UNIVERSAL,
                    type: a.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'Attribute.attrId',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.OID,
                            constructed: !1,
                            capture: 'oid',
                        },
                        {
                            name: 'Attribute.attrValues',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.SET,
                            constructed: !0,
                            capture: 'values',
                        },
                    ],
                },
                p = {
                    name: 'CertBag',
                    tagClass: a.Class.UNIVERSAL,
                    type: a.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'CertBag.certId',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.OID,
                            constructed: !1,
                            capture: 'certId',
                        },
                        {
                            name: 'CertBag.certValue',
                            tagClass: a.Class.CONTEXT_SPECIFIC,
                            constructed: !0,
                            value: [
                                {
                                    name: 'CertBag.certValue[0]',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Class.OCTETSTRING,
                                    constructed: !1,
                                    capture: 'cert',
                                },
                            ],
                        },
                    ],
                }
            function f(e, t, r, n) {
                for (var a = [], i = 0; i < e.length; i++)
                    for (var s = 0; s < e[i].safeBags.length; s++) {
                        var o = e[i].safeBags[s]
                        ;(void 0 !== n && o.type !== n) ||
                            (null !== t
                                ? void 0 !== o.attributes[t] && o.attributes[t].indexOf(r) >= 0 && a.push(o)
                                : a.push(o))
                    }
                return a
            }
            function h(e) {
                if (e.composed || e.constructed) {
                    for (var t = n.util.createBuffer(), r = 0; r < e.value.length; ++r) t.putBytes(e.value[r].value)
                    ;(e.composed = e.constructed = !1), (e.value = t.getBytes())
                }
                return e
            }
            function d(e, t) {
                var r = {},
                    s = []
                if (!a.validate(e, n.pkcs7.asn1.encryptedDataValidator, r, s))
                    throw (((o = new Error('Cannot read EncryptedContentInfo.')).errors = s), o)
                var o,
                    c = a.derToOid(r.contentType)
                if (c !== i.oids.data)
                    throw (((o = new Error('PKCS#12 EncryptedContentInfo ContentType is not Data.')).oid = c), o)
                c = a.derToOid(r.encAlgorithm)
                var u = i.pbe.getCipher(c, r.encParameter, t),
                    l = h(r.encryptedContentAsn1),
                    p = n.util.createBuffer(l.value)
                if ((u.update(p), !u.finish())) throw new Error('Failed to decrypt PKCS#12 SafeContents.')
                return u.output.getBytes()
            }
            function y(e, t, r) {
                if (!t && 0 === e.length) return []
                if (
                    (e = a.fromDer(e, t)).tagClass !== a.Class.UNIVERSAL ||
                    e.type !== a.Type.SEQUENCE ||
                    !0 !== e.constructed
                )
                    throw new Error('PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.')
                for (var n = [], s = 0; s < e.value.length; s++) {
                    var o = e.value[s],
                        c = {},
                        l = []
                    if (!a.validate(o, u, c, l)) throw (((v = new Error('Cannot read SafeBag.')).errors = l), v)
                    var f,
                        h,
                        d = { type: a.derToOid(c.bagId), attributes: g(c.bagAttributes) }
                    n.push(d)
                    var y = c.bagValue.value[0]
                    switch (d.type) {
                        case i.oids.pkcs8ShroudedKeyBag:
                            if (null === (y = i.decryptPrivateKeyInfo(y, r)))
                                throw new Error('Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?')
                        case i.oids.keyBag:
                            try {
                                d.key = i.privateKeyFromAsn1(y)
                            } catch (e) {
                                ;(d.key = null), (d.asn1 = y)
                            }
                            continue
                        case i.oids.certBag:
                            ;(f = p),
                                (h = function () {
                                    if (a.derToOid(c.certId) !== i.oids.x509Certificate) {
                                        var e = new Error('Unsupported certificate type, only X.509 supported.')
                                        throw ((e.oid = a.derToOid(c.certId)), e)
                                    }
                                    var r = a.fromDer(c.cert, t)
                                    try {
                                        d.cert = i.certificateFromAsn1(r, !0)
                                    } catch (e) {
                                        ;(d.cert = null), (d.asn1 = r)
                                    }
                                })
                            break
                        default:
                            var v
                            throw (((v = new Error('Unsupported PKCS#12 SafeBag type.')).oid = d.type), v)
                    }
                    if (void 0 !== f && !a.validate(y, f, c, l))
                        throw (((v = new Error('Cannot read PKCS#12 ' + f.name)).errors = l), v)
                    h()
                }
                return n
            }
            function g(e) {
                var t = {}
                if (void 0 !== e)
                    for (var r = 0; r < e.length; ++r) {
                        var n = {},
                            s = []
                        if (!a.validate(e[r], l, n, s)) {
                            var o = new Error('Cannot read PKCS#12 BagAttribute.')
                            throw ((o.errors = s), o)
                        }
                        var c = a.derToOid(n.oid)
                        if (void 0 !== i.oids[c]) {
                            t[i.oids[c]] = []
                            for (var u = 0; u < n.values.length; ++u) t[i.oids[c]].push(n.values[u].value)
                        }
                    }
                return t
            }
            ;(s.pkcs12FromAsn1 = function (e, t, r) {
                'string' == typeof t ? ((r = t), (t = !0)) : void 0 === t && (t = !0)
                var u = {}
                if (!a.validate(e, c, u, []))
                    throw (
                        (((l = new Error('Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.')).errors = l),
                        l)
                    )
                var l,
                    p = {
                        version: u.version.charCodeAt(0),
                        safeContents: [],
                        getBags: function (e) {
                            var t,
                                r = {}
                            return (
                                'localKeyId' in e
                                    ? (t = e.localKeyId)
                                    : 'localKeyIdHex' in e && (t = n.util.hexToBytes(e.localKeyIdHex)),
                                void 0 === t &&
                                    !('friendlyName' in e) &&
                                    'bagType' in e &&
                                    (r[e.bagType] = f(p.safeContents, null, null, e.bagType)),
                                void 0 !== t && (r.localKeyId = f(p.safeContents, 'localKeyId', t, e.bagType)),
                                'friendlyName' in e &&
                                    (r.friendlyName = f(p.safeContents, 'friendlyName', e.friendlyName, e.bagType)),
                                r
                            )
                        },
                        getBagsByFriendlyName: function (e, t) {
                            return f(p.safeContents, 'friendlyName', e, t)
                        },
                        getBagsByLocalKeyId: function (e, t) {
                            return f(p.safeContents, 'localKeyId', e, t)
                        },
                    }
                if (3 !== u.version.charCodeAt(0))
                    throw (
                        (((l = new Error('PKCS#12 PFX of version other than 3 not supported.')).version =
                            u.version.charCodeAt(0)),
                        l)
                    )
                if (a.derToOid(u.contentType) !== i.oids.data)
                    throw (
                        (((l = new Error('Only PKCS#12 PFX in password integrity mode supported.')).oid = a.derToOid(
                            u.contentType
                        )),
                        l)
                    )
                var g = u.content.value[0]
                if (g.tagClass !== a.Class.UNIVERSAL || g.type !== a.Type.OCTETSTRING)
                    throw new Error('PKCS#12 authSafe content data is not an OCTET STRING.')
                if (((g = h(g)), u.mac)) {
                    var v = null,
                        m = 0,
                        C = a.derToOid(u.macAlgorithm)
                    switch (C) {
                        case i.oids.sha1:
                            ;(v = n.md.sha1.create()), (m = 20)
                            break
                        case i.oids.sha256:
                            ;(v = n.md.sha256.create()), (m = 32)
                            break
                        case i.oids.sha384:
                            ;(v = n.md.sha384.create()), (m = 48)
                            break
                        case i.oids.sha512:
                            ;(v = n.md.sha512.create()), (m = 64)
                            break
                        case i.oids.md5:
                            ;(v = n.md.md5.create()), (m = 16)
                    }
                    if (null === v) throw new Error('PKCS#12 uses unsupported MAC algorithm: ' + C)
                    var E = new n.util.ByteBuffer(u.macSalt),
                        S = 'macIterations' in u ? parseInt(n.util.bytesToHex(u.macIterations), 16) : 1,
                        T = s.generateKey(r, E, 3, S, m, v),
                        I = n.hmac.create()
                    if ((I.start(v, T), I.update(g.value), I.getMac().getBytes() !== u.macDigest))
                        throw new Error('PKCS#12 MAC could not be verified. Invalid password?')
                }
                return (
                    (function (e, t, r, n) {
                        if (
                            (t = a.fromDer(t, r)).tagClass !== a.Class.UNIVERSAL ||
                            t.type !== a.Type.SEQUENCE ||
                            !0 !== t.constructed
                        )
                            throw new Error('PKCS#12 AuthenticatedSafe expected to be a SEQUENCE OF ContentInfo')
                        for (var s = 0; s < t.value.length; s++) {
                            var c = t.value[s],
                                u = {},
                                l = []
                            if (!a.validate(c, o, u, l))
                                throw (((v = new Error('Cannot read ContentInfo.')).errors = l), v)
                            var p = { encrypted: !1 },
                                f = null,
                                g = u.content.value[0]
                            switch (a.derToOid(u.contentType)) {
                                case i.oids.data:
                                    if (g.tagClass !== a.Class.UNIVERSAL || g.type !== a.Type.OCTETSTRING)
                                        throw new Error('PKCS#12 SafeContents Data is not an OCTET STRING.')
                                    f = h(g).value
                                    break
                                case i.oids.encryptedData:
                                    ;(f = d(g, n)), (p.encrypted = !0)
                                    break
                                default:
                                    var v
                                    throw (
                                        (((v = new Error('Unsupported PKCS#12 contentType.')).contentType = a.derToOid(
                                            u.contentType
                                        )),
                                        v)
                                    )
                            }
                            ;(p.safeBags = y(f, r, n)), e.safeContents.push(p)
                        }
                    })(p, g.value, t, r),
                    p
                )
            }),
                (s.toPkcs12Asn1 = function (e, t, r, o) {
                    ;((o = o || {}).saltSize = o.saltSize || 8),
                        (o.count = o.count || 2048),
                        (o.algorithm = o.algorithm || o.encAlgorithm || 'aes128'),
                        'useMac' in o || (o.useMac = !0),
                        'localKeyId' in o || (o.localKeyId = null),
                        'generateLocalKeyId' in o || (o.generateLocalKeyId = !0)
                    var c,
                        u = o.localKeyId
                    if (null !== u) u = n.util.hexToBytes(u)
                    else if (o.generateLocalKeyId)
                        if (t) {
                            var l = n.util.isArray(t) ? t[0] : t
                            'string' == typeof l && (l = i.certificateFromPem(l)),
                                (N = n.md.sha1.create()).update(a.toDer(i.certificateToAsn1(l)).getBytes()),
                                (u = N.digest().getBytes())
                        } else u = n.random.getBytes(20)
                    var p = []
                    null !== u &&
                        p.push(
                            a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(i.oids.localKeyId).getBytes()),
                                a.create(a.Class.UNIVERSAL, a.Type.SET, !0, [
                                    a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, u),
                                ]),
                            ])
                        ),
                        'friendlyName' in o &&
                            p.push(
                                a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                    a.create(
                                        a.Class.UNIVERSAL,
                                        a.Type.OID,
                                        !1,
                                        a.oidToDer(i.oids.friendlyName).getBytes()
                                    ),
                                    a.create(a.Class.UNIVERSAL, a.Type.SET, !0, [
                                        a.create(a.Class.UNIVERSAL, a.Type.BMPSTRING, !1, o.friendlyName),
                                    ]),
                                ])
                            ),
                        p.length > 0 && (c = a.create(a.Class.UNIVERSAL, a.Type.SET, !0, p))
                    var f = [],
                        h = []
                    null !== t && (h = n.util.isArray(t) ? t : [t])
                    for (var d = [], y = 0; y < h.length; ++y) {
                        'string' == typeof (t = h[y]) && (t = i.certificateFromPem(t))
                        var g = 0 === y ? c : void 0,
                            v = i.certificateToAsn1(t),
                            m = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(i.oids.certBag).getBytes()),
                                a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [
                                    a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                        a.create(
                                            a.Class.UNIVERSAL,
                                            a.Type.OID,
                                            !1,
                                            a.oidToDer(i.oids.x509Certificate).getBytes()
                                        ),
                                        a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [
                                            a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, a.toDer(v).getBytes()),
                                        ]),
                                    ]),
                                ]),
                                g,
                            ])
                        d.push(m)
                    }
                    if (d.length > 0) {
                        var C = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, d),
                            E = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(i.oids.data).getBytes()),
                                a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [
                                    a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, a.toDer(C).getBytes()),
                                ]),
                            ])
                        f.push(E)
                    }
                    var S = null
                    if (null !== e) {
                        var T = i.wrapRsaPrivateKey(i.privateKeyToAsn1(e))
                        S =
                            null === r
                                ? a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                      a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(i.oids.keyBag).getBytes()),
                                      a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [T]),
                                      c,
                                  ])
                                : a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                      a.create(
                                          a.Class.UNIVERSAL,
                                          a.Type.OID,
                                          !1,
                                          a.oidToDer(i.oids.pkcs8ShroudedKeyBag).getBytes()
                                      ),
                                      a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [i.encryptPrivateKeyInfo(T, r, o)]),
                                      c,
                                  ])
                        var I = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [S]),
                            b = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(i.oids.data).getBytes()),
                                a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [
                                    a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, a.toDer(I).getBytes()),
                                ]),
                            ])
                        f.push(b)
                    }
                    var A,
                        B = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, f)
                    if (o.useMac) {
                        var N = n.md.sha1.create(),
                            k = new n.util.ByteBuffer(n.random.getBytes(o.saltSize)),
                            w = o.count,
                            R = ((e = s.generateKey(r, k, 3, w, 20)), n.hmac.create())
                        R.start(N, e), R.update(a.toDer(B).getBytes())
                        var L = R.getMac()
                        A = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                            a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                    a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(i.oids.sha1).getBytes()),
                                    a.create(a.Class.UNIVERSAL, a.Type.NULL, !1, ''),
                                ]),
                                a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, L.getBytes()),
                            ]),
                            a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, k.getBytes()),
                            a.create(a.Class.UNIVERSAL, a.Type.INTEGER, !1, a.integerToDer(w).getBytes()),
                        ])
                    }
                    return a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                        a.create(a.Class.UNIVERSAL, a.Type.INTEGER, !1, a.integerToDer(3).getBytes()),
                        a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                            a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(i.oids.data).getBytes()),
                            a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [
                                a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, a.toDer(B).getBytes()),
                            ]),
                        ]),
                        A,
                    ])
                }),
                (s.generateKey = n.pbe.generatePkcs12Key)
        },
        function (e, t, r) {
            var n = r(0)
            r(3), r(1)
            var a = n.asn1,
                i = (e.exports = n.pkcs7asn1 = n.pkcs7asn1 || {})
            ;(n.pkcs7 = n.pkcs7 || {}), (n.pkcs7.asn1 = i)
            var s = {
                name: 'ContentInfo',
                tagClass: a.Class.UNIVERSAL,
                type: a.Type.SEQUENCE,
                constructed: !0,
                value: [
                    {
                        name: 'ContentInfo.ContentType',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.OID,
                        constructed: !1,
                        capture: 'contentType',
                    },
                    {
                        name: 'ContentInfo.content',
                        tagClass: a.Class.CONTEXT_SPECIFIC,
                        type: 0,
                        constructed: !0,
                        optional: !0,
                        captureAsn1: 'content',
                    },
                ],
            }
            i.contentInfoValidator = s
            var o = {
                name: 'EncryptedContentInfo',
                tagClass: a.Class.UNIVERSAL,
                type: a.Type.SEQUENCE,
                constructed: !0,
                value: [
                    {
                        name: 'EncryptedContentInfo.contentType',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.OID,
                        constructed: !1,
                        capture: 'contentType',
                    },
                    {
                        name: 'EncryptedContentInfo.contentEncryptionAlgorithm',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.SEQUENCE,
                        constructed: !0,
                        value: [
                            {
                                name: 'EncryptedContentInfo.contentEncryptionAlgorithm.algorithm',
                                tagClass: a.Class.UNIVERSAL,
                                type: a.Type.OID,
                                constructed: !1,
                                capture: 'encAlgorithm',
                            },
                            {
                                name: 'EncryptedContentInfo.contentEncryptionAlgorithm.parameter',
                                tagClass: a.Class.UNIVERSAL,
                                captureAsn1: 'encParameter',
                            },
                        ],
                    },
                    {
                        name: 'EncryptedContentInfo.encryptedContent',
                        tagClass: a.Class.CONTEXT_SPECIFIC,
                        type: 0,
                        capture: 'encryptedContent',
                        captureAsn1: 'encryptedContentAsn1',
                    },
                ],
            }
            ;(i.envelopedDataValidator = {
                name: 'EnvelopedData',
                tagClass: a.Class.UNIVERSAL,
                type: a.Type.SEQUENCE,
                constructed: !0,
                value: [
                    {
                        name: 'EnvelopedData.Version',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.INTEGER,
                        constructed: !1,
                        capture: 'version',
                    },
                    {
                        name: 'EnvelopedData.RecipientInfos',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.SET,
                        constructed: !0,
                        captureAsn1: 'recipientInfos',
                    },
                ].concat(o),
            }),
                (i.encryptedDataValidator = {
                    name: 'EncryptedData',
                    tagClass: a.Class.UNIVERSAL,
                    type: a.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'EncryptedData.Version',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.INTEGER,
                            constructed: !1,
                            capture: 'version',
                        },
                    ].concat(o),
                })
            var c = {
                name: 'SignerInfo',
                tagClass: a.Class.UNIVERSAL,
                type: a.Type.SEQUENCE,
                constructed: !0,
                value: [
                    { name: 'SignerInfo.version', tagClass: a.Class.UNIVERSAL, type: a.Type.INTEGER, constructed: !1 },
                    {
                        name: 'SignerInfo.issuerAndSerialNumber',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.SEQUENCE,
                        constructed: !0,
                        value: [
                            {
                                name: 'SignerInfo.issuerAndSerialNumber.issuer',
                                tagClass: a.Class.UNIVERSAL,
                                type: a.Type.SEQUENCE,
                                constructed: !0,
                                captureAsn1: 'issuer',
                            },
                            {
                                name: 'SignerInfo.issuerAndSerialNumber.serialNumber',
                                tagClass: a.Class.UNIVERSAL,
                                type: a.Type.INTEGER,
                                constructed: !1,
                                capture: 'serial',
                            },
                        ],
                    },
                    {
                        name: 'SignerInfo.digestAlgorithm',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.SEQUENCE,
                        constructed: !0,
                        value: [
                            {
                                name: 'SignerInfo.digestAlgorithm.algorithm',
                                tagClass: a.Class.UNIVERSAL,
                                type: a.Type.OID,
                                constructed: !1,
                                capture: 'digestAlgorithm',
                            },
                            {
                                name: 'SignerInfo.digestAlgorithm.parameter',
                                tagClass: a.Class.UNIVERSAL,
                                constructed: !1,
                                captureAsn1: 'digestParameter',
                                optional: !0,
                            },
                        ],
                    },
                    {
                        name: 'SignerInfo.authenticatedAttributes',
                        tagClass: a.Class.CONTEXT_SPECIFIC,
                        type: 0,
                        constructed: !0,
                        optional: !0,
                        capture: 'authenticatedAttributes',
                    },
                    {
                        name: 'SignerInfo.digestEncryptionAlgorithm',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.SEQUENCE,
                        constructed: !0,
                        capture: 'signatureAlgorithm',
                    },
                    {
                        name: 'SignerInfo.encryptedDigest',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.OCTETSTRING,
                        constructed: !1,
                        capture: 'signature',
                    },
                    {
                        name: 'SignerInfo.unauthenticatedAttributes',
                        tagClass: a.Class.CONTEXT_SPECIFIC,
                        type: 1,
                        constructed: !0,
                        optional: !0,
                        capture: 'unauthenticatedAttributes',
                    },
                ],
            }
            ;(i.signedDataValidator = {
                name: 'SignedData',
                tagClass: a.Class.UNIVERSAL,
                type: a.Type.SEQUENCE,
                constructed: !0,
                value: [
                    {
                        name: 'SignedData.Version',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.INTEGER,
                        constructed: !1,
                        capture: 'version',
                    },
                    {
                        name: 'SignedData.DigestAlgorithms',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.SET,
                        constructed: !0,
                        captureAsn1: 'digestAlgorithms',
                    },
                    s,
                    {
                        name: 'SignedData.Certificates',
                        tagClass: a.Class.CONTEXT_SPECIFIC,
                        type: 0,
                        optional: !0,
                        captureAsn1: 'certificates',
                    },
                    {
                        name: 'SignedData.CertificateRevocationLists',
                        tagClass: a.Class.CONTEXT_SPECIFIC,
                        type: 1,
                        optional: !0,
                        captureAsn1: 'crls',
                    },
                    {
                        name: 'SignedData.SignerInfos',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.SET,
                        capture: 'signerInfos',
                        optional: !0,
                        value: [c],
                    },
                ],
            }),
                (i.recipientInfoValidator = {
                    name: 'RecipientInfo',
                    tagClass: a.Class.UNIVERSAL,
                    type: a.Type.SEQUENCE,
                    constructed: !0,
                    value: [
                        {
                            name: 'RecipientInfo.version',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.INTEGER,
                            constructed: !1,
                            capture: 'version',
                        },
                        {
                            name: 'RecipientInfo.issuerAndSerial',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.SEQUENCE,
                            constructed: !0,
                            value: [
                                {
                                    name: 'RecipientInfo.issuerAndSerial.issuer',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.SEQUENCE,
                                    constructed: !0,
                                    captureAsn1: 'issuer',
                                },
                                {
                                    name: 'RecipientInfo.issuerAndSerial.serialNumber',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.INTEGER,
                                    constructed: !1,
                                    capture: 'serial',
                                },
                            ],
                        },
                        {
                            name: 'RecipientInfo.keyEncryptionAlgorithm',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.SEQUENCE,
                            constructed: !0,
                            value: [
                                {
                                    name: 'RecipientInfo.keyEncryptionAlgorithm.algorithm',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.OID,
                                    constructed: !1,
                                    capture: 'encAlgorithm',
                                },
                                {
                                    name: 'RecipientInfo.keyEncryptionAlgorithm.parameter',
                                    tagClass: a.Class.UNIVERSAL,
                                    constructed: !1,
                                    captureAsn1: 'encParameter',
                                    optional: !0,
                                },
                            ],
                        },
                        {
                            name: 'RecipientInfo.encryptedKey',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.OCTETSTRING,
                            constructed: !1,
                            capture: 'encKey',
                        },
                    ],
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(1),
                (n.mgf = n.mgf || {}),
                ((e.exports = n.mgf.mgf1 = n.mgf1 = n.mgf1 || {}).create = function (e) {
                    return {
                        generate: function (t, r) {
                            for (
                                var a = new n.util.ByteBuffer(), i = Math.ceil(r / e.digestLength), s = 0;
                                s < i;
                                s++
                            ) {
                                var o = new n.util.ByteBuffer()
                                o.putInt32(s), e.start(), e.update(t + o.getBytes()), a.putBuffer(e.digest())
                            }
                            return a.truncate(a.length() - r), a.getBytes()
                        },
                    }
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(4), r(1)
            var a = (e.exports = n.sha512 = n.sha512 || {})
            n.md.sha512 = n.md.algorithms.sha512 = a
            var i = (n.sha384 = n.sha512.sha384 = n.sha512.sha384 || {})
            ;(i.create = function () {
                return a.create('SHA-384')
            }),
                (n.md.sha384 = n.md.algorithms.sha384 = i),
                (n.sha512.sha256 = n.sha512.sha256 || {
                    create: function () {
                        return a.create('SHA-512/256')
                    },
                }),
                (n.md['sha512/256'] = n.md.algorithms['sha512/256'] = n.sha512.sha256),
                (n.sha512.sha224 = n.sha512.sha224 || {
                    create: function () {
                        return a.create('SHA-512/224')
                    },
                }),
                (n.md['sha512/224'] = n.md.algorithms['sha512/224'] = n.sha512.sha224),
                (a.create = function (e) {
                    if (
                        (o ||
                            ((s = String.fromCharCode(128)),
                            (s += n.util.fillString(String.fromCharCode(0), 128)),
                            (c = [
                                [1116352408, 3609767458],
                                [1899447441, 602891725],
                                [3049323471, 3964484399],
                                [3921009573, 2173295548],
                                [961987163, 4081628472],
                                [1508970993, 3053834265],
                                [2453635748, 2937671579],
                                [2870763221, 3664609560],
                                [3624381080, 2734883394],
                                [310598401, 1164996542],
                                [607225278, 1323610764],
                                [1426881987, 3590304994],
                                [1925078388, 4068182383],
                                [2162078206, 991336113],
                                [2614888103, 633803317],
                                [3248222580, 3479774868],
                                [3835390401, 2666613458],
                                [4022224774, 944711139],
                                [264347078, 2341262773],
                                [604807628, 2007800933],
                                [770255983, 1495990901],
                                [1249150122, 1856431235],
                                [1555081692, 3175218132],
                                [1996064986, 2198950837],
                                [2554220882, 3999719339],
                                [2821834349, 766784016],
                                [2952996808, 2566594879],
                                [3210313671, 3203337956],
                                [3336571891, 1034457026],
                                [3584528711, 2466948901],
                                [113926993, 3758326383],
                                [338241895, 168717936],
                                [666307205, 1188179964],
                                [773529912, 1546045734],
                                [1294757372, 1522805485],
                                [1396182291, 2643833823],
                                [1695183700, 2343527390],
                                [1986661051, 1014477480],
                                [2177026350, 1206759142],
                                [2456956037, 344077627],
                                [2730485921, 1290863460],
                                [2820302411, 3158454273],
                                [3259730800, 3505952657],
                                [3345764771, 106217008],
                                [3516065817, 3606008344],
                                [3600352804, 1432725776],
                                [4094571909, 1467031594],
                                [275423344, 851169720],
                                [430227734, 3100823752],
                                [506948616, 1363258195],
                                [659060556, 3750685593],
                                [883997877, 3785050280],
                                [958139571, 3318307427],
                                [1322822218, 3812723403],
                                [1537002063, 2003034995],
                                [1747873779, 3602036899],
                                [1955562222, 1575990012],
                                [2024104815, 1125592928],
                                [2227730452, 2716904306],
                                [2361852424, 442776044],
                                [2428436474, 593698344],
                                [2756734187, 3733110249],
                                [3204031479, 2999351573],
                                [3329325298, 3815920427],
                                [3391569614, 3928383900],
                                [3515267271, 566280711],
                                [3940187606, 3454069534],
                                [4118630271, 4000239992],
                                [116418474, 1914138554],
                                [174292421, 2731055270],
                                [289380356, 3203993006],
                                [460393269, 320620315],
                                [685471733, 587496836],
                                [852142971, 1086792851],
                                [1017036298, 365543100],
                                [1126000580, 2618297676],
                                [1288033470, 3409855158],
                                [1501505948, 4234509866],
                                [1607167915, 987167468],
                                [1816402316, 1246189591],
                            ]),
                            ((u = {})['SHA-512'] = [
                                [1779033703, 4089235720],
                                [3144134277, 2227873595],
                                [1013904242, 4271175723],
                                [2773480762, 1595750129],
                                [1359893119, 2917565137],
                                [2600822924, 725511199],
                                [528734635, 4215389547],
                                [1541459225, 327033209],
                            ]),
                            (u['SHA-384'] = [
                                [3418070365, 3238371032],
                                [1654270250, 914150663],
                                [2438529370, 812702999],
                                [355462360, 4144912697],
                                [1731405415, 4290775857],
                                [2394180231, 1750603025],
                                [3675008525, 1694076839],
                                [1203062813, 3204075428],
                            ]),
                            (u['SHA-512/256'] = [
                                [573645204, 4230739756],
                                [2673172387, 3360449730],
                                [596883563, 1867755857],
                                [2520282905, 1497426621],
                                [2519219938, 2827943907],
                                [3193839141, 1401305490],
                                [721525244, 746961066],
                                [246885852, 2177182882],
                            ]),
                            (u['SHA-512/224'] = [
                                [2352822216, 424955298],
                                [1944164710, 2312950998],
                                [502970286, 855612546],
                                [1738396948, 1479516111],
                                [258812777, 2077511080],
                                [2011393907, 79989058],
                                [1067287976, 1780299464],
                                [286451373, 2446758561],
                            ]),
                            (o = !0)),
                        void 0 === e && (e = 'SHA-512'),
                        !(e in u))
                    )
                        throw new Error('Invalid SHA-512 algorithm: ' + e)
                    for (var t = u[e], r = null, a = n.util.createBuffer(), i = new Array(80), p = 0; p < 80; ++p)
                        i[p] = new Array(2)
                    var f = 64
                    switch (e) {
                        case 'SHA-384':
                            f = 48
                            break
                        case 'SHA-512/256':
                            f = 32
                            break
                        case 'SHA-512/224':
                            f = 28
                    }
                    var h = {
                        algorithm: e.replace('-', '').toLowerCase(),
                        blockLength: 128,
                        digestLength: f,
                        messageLength: 0,
                        fullMessageLength: null,
                        messageLengthSize: 16,
                        start: function () {
                            ;(h.messageLength = 0), (h.fullMessageLength = h.messageLength128 = [])
                            for (var e = h.messageLengthSize / 4, i = 0; i < e; ++i) h.fullMessageLength.push(0)
                            ;(a = n.util.createBuffer()), (r = new Array(t.length))
                            for (i = 0; i < t.length; ++i) r[i] = t[i].slice(0)
                            return h
                        },
                    }
                    return (
                        h.start(),
                        (h.update = function (e, t) {
                            'utf8' === t && (e = n.util.encodeUtf8(e))
                            var s = e.length
                            ;(h.messageLength += s), (s = [(s / 4294967296) >>> 0, s >>> 0])
                            for (var o = h.fullMessageLength.length - 1; o >= 0; --o)
                                (h.fullMessageLength[o] += s[1]),
                                    (s[1] = s[0] + ((h.fullMessageLength[o] / 4294967296) >>> 0)),
                                    (h.fullMessageLength[o] = h.fullMessageLength[o] >>> 0),
                                    (s[0] = (s[1] / 4294967296) >>> 0)
                            return a.putBytes(e), l(r, i, a), (a.read > 2048 || 0 === a.length()) && a.compact(), h
                        }),
                        (h.digest = function () {
                            var t = n.util.createBuffer()
                            t.putBytes(a.bytes())
                            var o,
                                c =
                                    (h.fullMessageLength[h.fullMessageLength.length - 1] + h.messageLengthSize) &
                                    (h.blockLength - 1)
                            t.putBytes(s.substr(0, h.blockLength - c))
                            for (var u = 8 * h.fullMessageLength[0], p = 0; p < h.fullMessageLength.length - 1; ++p)
                                (u += ((o = 8 * h.fullMessageLength[p + 1]) / 4294967296) >>> 0),
                                    t.putInt32(u >>> 0),
                                    (u = o >>> 0)
                            t.putInt32(u)
                            var f = new Array(r.length)
                            for (p = 0; p < r.length; ++p) f[p] = r[p].slice(0)
                            l(f, i, t)
                            var d,
                                y = n.util.createBuffer()
                            d = 'SHA-512' === e ? f.length : 'SHA-384' === e ? f.length - 2 : f.length - 4
                            for (p = 0; p < d; ++p)
                                y.putInt32(f[p][0]), (p === d - 1 && 'SHA-512/224' === e) || y.putInt32(f[p][1])
                            return y
                        }),
                        h
                    )
                })
            var s = null,
                o = !1,
                c = null,
                u = null
            function l(e, t, r) {
                for (
                    var n,
                        a,
                        i,
                        s,
                        o,
                        u,
                        l,
                        p,
                        f,
                        h,
                        d,
                        y,
                        g,
                        v,
                        m,
                        C,
                        E,
                        S,
                        T,
                        I,
                        b,
                        A,
                        B,
                        N,
                        k,
                        w,
                        R,
                        L,
                        _,
                        U,
                        D,
                        P,
                        V,
                        O = r.length();
                    O >= 128;

                ) {
                    for (R = 0; R < 16; ++R) (t[R][0] = r.getInt32() >>> 0), (t[R][1] = r.getInt32() >>> 0)
                    for (; R < 80; ++R)
                        (n =
                            ((((L = (U = t[R - 2])[0]) >>> 19) | ((_ = U[1]) << 13)) ^
                                ((_ >>> 29) | (L << 3)) ^
                                (L >>> 6)) >>>
                            0),
                            (a = (((L << 13) | (_ >>> 19)) ^ ((_ << 3) | (L >>> 29)) ^ ((L << 26) | (_ >>> 6))) >>> 0),
                            (i =
                                ((((L = (P = t[R - 15])[0]) >>> 1) | ((_ = P[1]) << 31)) ^
                                    ((L >>> 8) | (_ << 24)) ^
                                    (L >>> 7)) >>>
                                0),
                            (s = (((L << 31) | (_ >>> 1)) ^ ((L << 24) | (_ >>> 8)) ^ ((L << 25) | (_ >>> 7))) >>> 0),
                            (D = t[R - 7]),
                            (V = t[R - 16]),
                            (_ = a + D[1] + s + V[1]),
                            (t[R][0] = (n + D[0] + i + V[0] + ((_ / 4294967296) >>> 0)) >>> 0),
                            (t[R][1] = _ >>> 0)
                    for (
                        d = e[0][0],
                            y = e[0][1],
                            g = e[1][0],
                            v = e[1][1],
                            m = e[2][0],
                            C = e[2][1],
                            E = e[3][0],
                            S = e[3][1],
                            T = e[4][0],
                            I = e[4][1],
                            b = e[5][0],
                            A = e[5][1],
                            B = e[6][0],
                            N = e[6][1],
                            k = e[7][0],
                            w = e[7][1],
                            R = 0;
                        R < 80;
                        ++R
                    )
                        (l = (((T >>> 14) | (I << 18)) ^ ((T >>> 18) | (I << 14)) ^ ((I >>> 9) | (T << 23))) >>> 0),
                            (p = (B ^ (T & (b ^ B))) >>> 0),
                            (o = (((d >>> 28) | (y << 4)) ^ ((y >>> 2) | (d << 30)) ^ ((y >>> 7) | (d << 25))) >>> 0),
                            (u = (((d << 4) | (y >>> 28)) ^ ((y << 30) | (d >>> 2)) ^ ((y << 25) | (d >>> 7))) >>> 0),
                            (f = ((d & g) | (m & (d ^ g))) >>> 0),
                            (h = ((y & v) | (C & (y ^ v))) >>> 0),
                            (_ =
                                w +
                                ((((T << 18) | (I >>> 14)) ^ ((T << 14) | (I >>> 18)) ^ ((I << 23) | (T >>> 9))) >>>
                                    0) +
                                ((N ^ (I & (A ^ N))) >>> 0) +
                                c[R][1] +
                                t[R][1]),
                            (n = (k + l + p + c[R][0] + t[R][0] + ((_ / 4294967296) >>> 0)) >>> 0),
                            (a = _ >>> 0),
                            (i = (o + f + (((_ = u + h) / 4294967296) >>> 0)) >>> 0),
                            (s = _ >>> 0),
                            (k = B),
                            (w = N),
                            (B = b),
                            (N = A),
                            (b = T),
                            (A = I),
                            (T = (E + n + (((_ = S + a) / 4294967296) >>> 0)) >>> 0),
                            (I = _ >>> 0),
                            (E = m),
                            (S = C),
                            (m = g),
                            (C = v),
                            (g = d),
                            (v = y),
                            (d = (n + i + (((_ = a + s) / 4294967296) >>> 0)) >>> 0),
                            (y = _ >>> 0)
                    ;(_ = e[0][1] + y),
                        (e[0][0] = (e[0][0] + d + ((_ / 4294967296) >>> 0)) >>> 0),
                        (e[0][1] = _ >>> 0),
                        (_ = e[1][1] + v),
                        (e[1][0] = (e[1][0] + g + ((_ / 4294967296) >>> 0)) >>> 0),
                        (e[1][1] = _ >>> 0),
                        (_ = e[2][1] + C),
                        (e[2][0] = (e[2][0] + m + ((_ / 4294967296) >>> 0)) >>> 0),
                        (e[2][1] = _ >>> 0),
                        (_ = e[3][1] + S),
                        (e[3][0] = (e[3][0] + E + ((_ / 4294967296) >>> 0)) >>> 0),
                        (e[3][1] = _ >>> 0),
                        (_ = e[4][1] + I),
                        (e[4][0] = (e[4][0] + T + ((_ / 4294967296) >>> 0)) >>> 0),
                        (e[4][1] = _ >>> 0),
                        (_ = e[5][1] + A),
                        (e[5][0] = (e[5][0] + b + ((_ / 4294967296) >>> 0)) >>> 0),
                        (e[5][1] = _ >>> 0),
                        (_ = e[6][1] + N),
                        (e[6][0] = (e[6][0] + B + ((_ / 4294967296) >>> 0)) >>> 0),
                        (e[6][1] = _ >>> 0),
                        (_ = e[7][1] + w),
                        (e[7][0] = (e[7][0] + k + ((_ / 4294967296) >>> 0)) >>> 0),
                        (e[7][1] = _ >>> 0),
                        (O -= 128)
                }
            }
        },
        function (e, t, r) {
            var n = r(0)
            r(1)
            var a = (e.exports = n.net = n.net || {})
            ;(a.socketPools = {}),
                (a.createSocketPool = function (e) {
                    e.msie = e.msie || !1
                    var t = e.flashId,
                        r = document.getElementById(t)
                    r.init({ marshallExceptions: !e.msie })
                    var i = {
                        id: t,
                        flashApi: r,
                        sockets: {},
                        policyPort: e.policyPort || 0,
                        policyUrl: e.policyUrl || null,
                    }
                    ;(a.socketPools[t] = i),
                        !0 === e.msie
                            ? (i.handler = function (e) {
                                  if (e.id in i.sockets) {
                                      var t
                                      switch (e.type) {
                                          case 'connect':
                                              t = 'connected'
                                              break
                                          case 'close':
                                              t = 'closed'
                                              break
                                          case 'socketData':
                                              t = 'data'
                                              break
                                          default:
                                              t = 'error'
                                      }
                                      setTimeout(function () {
                                          i.sockets[e.id][t](e)
                                      }, 0)
                                  }
                              })
                            : (i.handler = function (e) {
                                  if (e.id in i.sockets) {
                                      var t
                                      switch (e.type) {
                                          case 'connect':
                                              t = 'connected'
                                              break
                                          case 'close':
                                              t = 'closed'
                                              break
                                          case 'socketData':
                                              t = 'data'
                                              break
                                          default:
                                              t = 'error'
                                      }
                                      i.sockets[e.id][t](e)
                                  }
                              })
                    var s = "forge.net.socketPools['" + t + "'].handler"
                    return (
                        r.subscribe('connect', s),
                        r.subscribe('close', s),
                        r.subscribe('socketData', s),
                        r.subscribe('ioError', s),
                        r.subscribe('securityError', s),
                        (i.destroy = function () {
                            for (var t in (delete a.socketPools[e.flashId], i.sockets)) i.sockets[t].destroy()
                            ;(i.sockets = {}), r.cleanup()
                        }),
                        (i.createSocket = function (e) {
                            e = e || {}
                            var t = r.create(),
                                a = {
                                    id: t,
                                    connected: e.connected || function (e) {},
                                    closed: e.closed || function (e) {},
                                    data: e.data || function (e) {},
                                    error: e.error || function (e) {},
                                    destroy: function () {
                                        r.destroy(t), delete i.sockets[t]
                                    },
                                    connect: function (e) {
                                        var n = e.policyUrl || null,
                                            a = 0
                                        null === n && 0 !== e.policyPort && (a = e.policyPort || i.policyPort),
                                            r.connect(t, e.host, e.port, a, n)
                                    },
                                    close: function () {
                                        r.close(t), a.closed({ id: a.id, type: 'close', bytesAvailable: 0 })
                                    },
                                    isConnected: function () {
                                        return r.isConnected(t)
                                    },
                                    send: function (e) {
                                        return r.send(t, n.util.encode64(e))
                                    },
                                    receive: function (e) {
                                        var a = r.receive(t, e).rval
                                        return null === a ? null : n.util.decode64(a)
                                    },
                                    bytesAvailable: function () {
                                        return r.getBytesAvailable(t)
                                    },
                                }
                            return (i.sockets[t] = a), a
                        }),
                        i
                    )
                }),
                (a.destroySocketPool = function (e) {
                    e.flashId in a.socketPools && a.socketPools[e.flashId].destroy()
                }),
                (a.createSocket = function (e) {
                    var t = null
                    e.flashId in a.socketPools && (t = a.socketPools[e.flashId].createSocket(e))
                    return t
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(10), r(1)
            var a = (e.exports = n.http = n.http || {}),
                i = function (e) {
                    return e.toLowerCase().replace(/(^.)|(-.)/g, function (e) {
                        return e.toUpperCase()
                    })
                },
                s = function (e) {
                    return 'forge.http.' + e.url.protocol.slice(0, -1) + '.' + e.url.hostname + '.' + e.url.port
                },
                o = function (e) {
                    if (e.persistCookies)
                        try {
                            var t = n.util.getItem(e.socketPool.flashApi, s(e), 'cookies')
                            e.cookies = t || {}
                        } catch (e) {}
                },
                c = function (e) {
                    if (e.persistCookies)
                        try {
                            n.util.setItem(e.socketPool.flashApi, s(e), 'cookies', e.cookies)
                        } catch (e) {}
                    o(e)
                },
                u = function (e, t) {
                    t.isConnected()
                        ? ((t.options.request.connectTime = +new Date()), t.connected({ type: 'connect', id: t.id }))
                        : ((t.options.request.connectTime = +new Date()),
                          t.connect({
                              host: e.url.hostname,
                              port: e.url.port,
                              policyPort: e.policyPort,
                              policyUrl: e.policyUrl,
                          }))
                },
                l = function (e, t) {
                    t.buffer.clear()
                    for (var r = null; null === r && e.requests.length > 0; )
                        (r = e.requests.shift()).request.aborted && (r = null)
                    null === r
                        ? (null !== t.options && (t.options = null), e.idle.push(t))
                        : ((t.retries = 1), (t.options = r), u(e, t))
                },
                p = function (e, t, r) {
                    ;(t.options = null),
                        (t.connected = function (r) {
                            if (null === t.options) l(e, t)
                            else {
                                var n = t.options.request
                                if (
                                    ((n.connectTime = +new Date() - n.connectTime),
                                    (r.socket = t),
                                    t.options.connected(r),
                                    n.aborted)
                                )
                                    t.close()
                                else {
                                    var a = n.toString()
                                    n.body && (a += n.body),
                                        (n.time = +new Date()),
                                        t.send(a),
                                        (n.time = +new Date() - n.time),
                                        (t.options.response.time = +new Date()),
                                        (t.sending = !0)
                                }
                            }
                        }),
                        (t.closed = function (r) {
                            if (t.sending)
                                (t.sending = !1),
                                    t.retries > 0
                                        ? (--t.retries, u(e, t))
                                        : t.error({
                                              id: t.id,
                                              type: 'ioError',
                                              message: 'Connection closed during send. Broken pipe.',
                                              bytesAvailable: 0,
                                          })
                            else {
                                var n = t.options.response
                                n.readBodyUntilClose &&
                                    ((n.time = +new Date() - n.time),
                                    (n.bodyReceived = !0),
                                    t.options.bodyReady({ request: t.options.request, response: n, socket: t })),
                                    t.options.closed(r),
                                    l(e, t)
                            }
                        }),
                        (t.data = function (r) {
                            if (((t.sending = !1), t.options.request.aborted)) t.close()
                            else {
                                var n = t.options.response,
                                    a = t.receive(r.bytesAvailable)
                                if (null !== a)
                                    if (
                                        (t.buffer.putBytes(a),
                                        n.headerReceived ||
                                            (n.readHeader(t.buffer),
                                            n.headerReceived &&
                                                t.options.headerReady({
                                                    request: t.options.request,
                                                    response: n,
                                                    socket: t,
                                                })),
                                        n.headerReceived && !n.bodyReceived && n.readBody(t.buffer),
                                        n.bodyReceived)
                                    )
                                        t.options.bodyReady({ request: t.options.request, response: n, socket: t }),
                                            -1 != (n.getField('Connection') || '').indexOf('close') ||
                                            ('HTTP/1.0' === n.version && null === n.getField('Keep-Alive'))
                                                ? t.close()
                                                : l(e, t)
                            }
                        }),
                        (t.error = function (e) {
                            t.options.error({
                                type: e.type,
                                message: e.message,
                                request: t.options.request,
                                response: t.options.response,
                                socket: t,
                            }),
                                t.close()
                        }),
                        r
                            ? (((t = n.tls.wrapSocket({
                                  sessionId: null,
                                  sessionCache: {},
                                  caStore: r.caStore,
                                  cipherSuites: r.cipherSuites,
                                  socket: t,
                                  virtualHost: r.virtualHost,
                                  verify: r.verify,
                                  getCertificate: r.getCertificate,
                                  getPrivateKey: r.getPrivateKey,
                                  getSignature: r.getSignature,
                                  deflate: r.deflate || null,
                                  inflate: r.inflate || null,
                              })).options = null),
                              (t.buffer = n.util.createBuffer()),
                              e.sockets.push(t),
                              r.prime
                                  ? t.connect({
                                        host: e.url.hostname,
                                        port: e.url.port,
                                        policyPort: e.policyPort,
                                        policyUrl: e.policyUrl,
                                    })
                                  : e.idle.push(t))
                            : ((t.buffer = n.util.createBuffer()), e.sockets.push(t), e.idle.push(t))
                },
                f = function (e) {
                    var t = !1
                    if (-1 !== e.maxAge) {
                        var r = y(new Date())
                        e.created + e.maxAge <= r && (t = !0)
                    }
                    return t
                }
            a.createClient = function (e) {
                var t,
                    r = null
                e.caCerts && (r = n.pki.createCaStore(e.caCerts)),
                    (e.url = e.url || window.location.protocol + '//' + window.location.host)
                try {
                    t = new URL(e.url)
                } catch (t) {
                    var i = new Error('Invalid url.')
                    throw ((i.details = { url: e.url }), i)
                }
                e.connections = e.connections || 1
                var l = e.socketPool,
                    h = {
                        url: t,
                        socketPool: l,
                        policyPort: e.policyPort,
                        policyUrl: e.policyUrl,
                        requests: [],
                        sockets: [],
                        idle: [],
                        secure: 'https:' === t.protocol,
                        cookies: {},
                        persistCookies: void 0 === e.persistCookies || e.persistCookies,
                    }
                o(h)
                var d = null
                h.secure &&
                    ((d = {
                        caStore: r,
                        cipherSuites: e.cipherSuites || null,
                        virtualHost: e.virtualHost || t.hostname,
                        verify:
                            e.verify ||
                            function (e, t, r, n) {
                                if (0 === r && !0 === t) {
                                    var a = n[r].subject.getField('CN')
                                    ;(null !== a && h.url.hostname === a.value) ||
                                        (t = { message: 'Certificate common name does not match url host.' })
                                }
                                return t
                            },
                        getCertificate: e.getCertificate || null,
                        getPrivateKey: e.getPrivateKey || null,
                        getSignature: e.getSignature || null,
                        prime: e.primeTlsSockets || !1,
                    }),
                    null !== l.flashApi &&
                        ((d.deflate = function (e) {
                            return n.util.deflate(l.flashApi, e, !0)
                        }),
                        (d.inflate = function (e) {
                            return n.util.inflate(l.flashApi, e, !0)
                        })))
                for (var g = 0; g < e.connections; ++g) p(h, l.createSocket(), d)
                return (
                    (h.send = function (e) {
                        null === e.request.getField('Host') && e.request.setField('Host', h.url.origin)
                        var t = {}
                        if (
                            ((t.request = e.request),
                            (t.connected = e.connected || function () {}),
                            (t.closed = e.close || function () {}),
                            (t.headerReady = function (t) {
                                !(function (e, t) {
                                    for (var r = t.getCookies(), n = 0; n < r.length; ++n)
                                        try {
                                            e.setCookie(r[n])
                                        } catch (e) {}
                                })(h, t.response),
                                    e.headerReady && e.headerReady(t)
                            }),
                            (t.bodyReady = e.bodyReady || function () {}),
                            (t.error = e.error || function () {}),
                            (t.response = a.createResponse()),
                            (t.response.time = 0),
                            (t.response.flashApi = h.socketPool.flashApi),
                            (t.request.flashApi = h.socketPool.flashApi),
                            (t.request.abort = function () {
                                ;(t.request.aborted = !0),
                                    (t.connected = function () {}),
                                    (t.closed = function () {}),
                                    (t.headerReady = function () {}),
                                    (t.bodyReady = function () {}),
                                    (t.error = function () {})
                            }),
                            (function (e, t) {
                                var r = [],
                                    n = (e.url, e.cookies)
                                for (var a in n) {
                                    var i = n[a]
                                    for (var s in i) {
                                        var o = i[s]
                                        f(o) ? r.push(o) : 0 === t.path.indexOf(o.path) && t.addCookie(o)
                                    }
                                }
                                for (var c = 0; c < r.length; ++c) {
                                    o = r[c]
                                    e.removeCookie(o.name, o.path)
                                }
                            })(h, t.request),
                            0 === h.idle.length)
                        )
                            h.requests.push(t)
                        else {
                            for (var r = null, n = h.idle.length, i = 0; null === r && i < n; ++i)
                                (r = h.idle[i]).isConnected() ? h.idle.splice(i, 1) : (r = null)
                            null === r && (r = h.idle.pop()), (r.options = t), u(h, r)
                        }
                    }),
                    (h.destroy = function () {
                        h.requests = []
                        for (var e = 0; e < h.sockets.length; ++e) h.sockets[e].close(), h.sockets[e].destroy()
                        ;(h.socketPool = null), (h.sockets = []), (h.idle = [])
                    }),
                    (h.setCookie = function (e) {
                        var t
                        if (void 0 !== e.name)
                            if (null === e.value || void 0 === e.value || '' === e.value)
                                t = h.removeCookie(e.name, e.path)
                            else {
                                var r
                                if (
                                    ((e.comment = e.comment || ''),
                                    (e.maxAge = e.maxAge || 0),
                                    (e.secure = void 0 === e.secure || e.secure),
                                    (e.httpOnly = e.httpOnly || !0),
                                    (e.path = e.path || '/'),
                                    (e.domain = e.domain || null),
                                    (e.version = e.version || null),
                                    (e.created = y(new Date())),
                                    e.secure !== h.secure)
                                )
                                    throw (
                                        (((r = new Error(
                                            'Http client url scheme is incompatible with cookie secure flag.'
                                        )).url = h.url),
                                        (r.cookie = e),
                                        r)
                                    )
                                if (!a.withinCookieDomain(h.url, e))
                                    throw (
                                        (((r = new Error(
                                            'Http client url scheme is incompatible with cookie secure flag.'
                                        )).url = h.url),
                                        (r.cookie = e),
                                        r)
                                    )
                                e.name in h.cookies || (h.cookies[e.name] = {}),
                                    (h.cookies[e.name][e.path] = e),
                                    (t = !0),
                                    c(h)
                            }
                        return t
                    }),
                    (h.getCookie = function (e, t) {
                        var r = null
                        if (e in h.cookies) {
                            var n = h.cookies[e]
                            if (t) t in n && (r = n[t])
                            else
                                for (var a in n) {
                                    r = n[a]
                                    break
                                }
                        }
                        return r
                    }),
                    (h.removeCookie = function (e, t) {
                        var r = !1
                        if (e in h.cookies)
                            if (t) {
                                if (t in h.cookies[e]) {
                                    ;(r = !0), delete h.cookies[e][t]
                                    var n = !0
                                    for (var a in h.cookies[e]) {
                                        n = !1
                                        break
                                    }
                                    n && delete h.cookies[e]
                                }
                            } else (r = !0), delete h.cookies[e]
                        return r && c(h), r
                    }),
                    (h.clearCookies = function () {
                        ;(h.cookies = {}),
                            (function (e) {
                                if (e.persistCookies)
                                    try {
                                        n.util.clearItems(e.socketPool.flashApi, s(e))
                                    } catch (e) {}
                            })(h)
                    }),
                    n.log && n.log.debug('forge.http', 'created client', e),
                    h
                )
            }
            var h = function (e) {
                    return e.replace(/^\s*/, '').replace(/\s*$/, '')
                },
                d = function () {
                    var e = {
                        fields: {},
                        setField: function (t, r) {
                            e.fields[i(t)] = [h('' + r)]
                        },
                        appendField: function (t, r) {
                            ;(t = i(t)) in e.fields || (e.fields[t] = []), e.fields[t].push(h('' + r))
                        },
                        getField: function (t, r) {
                            var n = null
                            return (t = i(t)) in e.fields && ((r = r || 0), (n = e.fields[t][r])), n
                        },
                    }
                    return e
                },
                y = function (e) {
                    e.getTimezoneOffset()
                    return Math.floor(+new Date() / 1e3)
                }
            ;(a.createRequest = function (e) {
                e = e || {}
                var t = d()
                ;(t.version = e.version || 'HTTP/1.1'),
                    (t.method = e.method || null),
                    (t.path = e.path || null),
                    (t.body = e.body || null),
                    (t.bodyDeflated = !1),
                    (t.flashApi = null)
                var r = e.headers || []
                n.util.isArray(r) || (r = [r])
                for (var a = 0; a < r.length; ++a) for (var i in r[a]) t.appendField(i, r[a][i])
                return (
                    (t.addCookie = function (e) {
                        var r = '',
                            n = t.getField('Cookie')
                        null !== n && (r = n + '; ')
                        y(new Date())
                        ;(r += e.name + '=' + e.value), t.setField('Cookie', r)
                    }),
                    (t.toString = function () {
                        null === t.getField('User-Agent') && t.setField('User-Agent', 'forge.http 1.0'),
                            null === t.getField('Accept') && t.setField('Accept', '*/*'),
                            null === t.getField('Connection') &&
                                (t.setField('Connection', 'keep-alive'), t.setField('Keep-Alive', '115')),
                            null !== t.flashApi &&
                                null === t.getField('Accept-Encoding') &&
                                t.setField('Accept-Encoding', 'deflate'),
                            null !== t.flashApi &&
                            null !== t.body &&
                            null === t.getField('Content-Encoding') &&
                            !t.bodyDeflated &&
                            t.body.length > 100
                                ? ((t.body = n.util.deflate(t.flashApi, t.body)),
                                  (t.bodyDeflated = !0),
                                  t.setField('Content-Encoding', 'deflate'),
                                  t.setField('Content-Length', t.body.length))
                                : null !== t.body && t.setField('Content-Length', t.body.length)
                        var e = t.method.toUpperCase() + ' ' + t.path + ' ' + t.version + '\r\n'
                        for (var r in t.fields)
                            for (var a = t.fields[r], i = 0; i < a.length; ++i) e += r + ': ' + a[i] + '\r\n'
                        return (e += '\r\n')
                    }),
                    t
                )
            }),
                (a.createResponse = function () {
                    var e = !0,
                        t = 0,
                        r = !1,
                        a = d()
                    ;(a.version = null),
                        (a.code = 0),
                        (a.message = null),
                        (a.body = null),
                        (a.headerReceived = !1),
                        (a.bodyReceived = !1),
                        (a.flashApi = null)
                    var i = function (e) {
                            var t = null,
                                r = e.data.indexOf('\r\n', e.read)
                            return -1 != r && ((t = e.getBytes(r - e.read)), e.getBytes(2)), t
                        },
                        s = function (e) {
                            var t = e.indexOf(':'),
                                r = e.substring(0, t++)
                            a.appendField(r, t < e.length ? e.substring(t) : '')
                        }
                    a.readHeader = function (t) {
                        for (var r = ''; !a.headerReceived && null !== r; )
                            if (null !== (r = i(t)))
                                if (e) {
                                    e = !1
                                    var n = r.split(' ')
                                    if (!(n.length >= 3)) {
                                        var o = new Error('Invalid http response header.')
                                        throw ((o.details = { line: r }), o)
                                    }
                                    ;(a.version = n[0]),
                                        (a.code = parseInt(n[1], 10)),
                                        (a.message = n.slice(2).join(' '))
                                } else 0 === r.length ? (a.headerReceived = !0) : s(r)
                        return a.headerReceived
                    }
                    return (
                        (a.readBody = function (e) {
                            var o = a.getField('Content-Length'),
                                c = a.getField('Transfer-Encoding')
                            if ((null !== o && (o = parseInt(o)), null !== o && o >= 0))
                                (a.body = a.body || ''),
                                    (a.body += e.getBytes(o)),
                                    (a.bodyReceived = a.body.length === o)
                            else if (null !== c) {
                                if (-1 == c.indexOf('chunked')) {
                                    var u = new Error('Unknown Transfer-Encoding.')
                                    throw ((u.details = { transferEncoding: c }), u)
                                }
                                ;(a.body = a.body || ''),
                                    (function (e) {
                                        for (var n = ''; null !== n && e.length() > 0; )
                                            if (t > 0) {
                                                if (t + 2 > e.length()) break
                                                ;(a.body += e.getBytes(t)), e.getBytes(2), (t = 0)
                                            } else if (r)
                                                for (n = i(e); null !== n; )
                                                    n.length > 0
                                                        ? (s(n), (n = i(e)))
                                                        : ((a.bodyReceived = !0), (n = null))
                                            else
                                                null !== (n = i(e)) &&
                                                    ((t = parseInt(n.split(';', 1)[0], 16)), (r = 0 === t))
                                        a.bodyReceived
                                    })(e)
                            } else
                                (null !== o && o < 0) || (null === o && null !== a.getField('Content-Type'))
                                    ? ((a.body = a.body || ''), (a.body += e.getBytes()), (a.readBodyUntilClose = !0))
                                    : ((a.body = null), (a.bodyReceived = !0))
                            return (
                                a.bodyReceived && (a.time = +new Date() - a.time),
                                null !== a.flashApi &&
                                    a.bodyReceived &&
                                    null !== a.body &&
                                    'deflate' === a.getField('Content-Encoding') &&
                                    (a.body = n.util.inflate(a.flashApi, a.body)),
                                a.bodyReceived
                            )
                        }),
                        (a.getCookies = function () {
                            var e = []
                            if ('Set-Cookie' in a.fields)
                                for (
                                    var t = a.fields['Set-Cookie'],
                                        r = +new Date() / 1e3,
                                        n = /\s*([^=]*)=?([^;]*)(;|$)/g,
                                        i = 0;
                                    i < t.length;
                                    ++i
                                ) {
                                    var s,
                                        o = t[i]
                                    n.lastIndex = 0
                                    var c = !0,
                                        u = {}
                                    do {
                                        if (null !== (s = n.exec(o))) {
                                            var l = h(s[1]),
                                                p = h(s[2])
                                            if (c) (u.name = l), (u.value = p), (c = !1)
                                            else
                                                switch ((l = l.toLowerCase())) {
                                                    case 'expires':
                                                        p = p.replace(/-/g, ' ')
                                                        var f = Date.parse(p) / 1e3
                                                        u.maxAge = Math.max(0, f - r)
                                                        break
                                                    case 'max-age':
                                                        u.maxAge = parseInt(p, 10)
                                                        break
                                                    case 'secure':
                                                        u.secure = !0
                                                        break
                                                    case 'httponly':
                                                        u.httpOnly = !0
                                                        break
                                                    default:
                                                        '' !== l && (u[l] = p)
                                                }
                                        }
                                    } while (null !== s && '' !== s[0])
                                    e.push(u)
                                }
                            return e
                        }),
                        (a.toString = function () {
                            var e = a.version + ' ' + a.code + ' ' + a.message + '\r\n'
                            for (var t in a.fields)
                                for (var r = a.fields[t], n = 0; n < r.length; ++n) e += t + ': ' + r[n] + '\r\n'
                            return (e += '\r\n')
                        }),
                        a
                    )
                }),
                (a.withinCookieDomain = function (e, t) {
                    var r = !1,
                        n = null === t || 'string' == typeof t ? t : t.domain
                    if (null === n) r = !0
                    else if ('.' === n.charAt(0)) {
                        'string' == typeof e && (e = new URL(e))
                        var a = '.' + e.hostname,
                            i = a.lastIndexOf(n)
                        ;-1 !== i && i + n.length === a.length && (r = !0)
                    }
                    return r
                })
        },
        function (e, t, r) {
            e.exports = r(35)
        },
        function (e, t, r) {
            ;(e.exports = r(0)), r(36), r(48), r(32), r(49), r(33), r(50)
        },
        function (e, t, r) {
            ;(e.exports = r(0)),
                r(5),
                r(39),
                r(3),
                r(14),
                r(11),
                r(41),
                r(8),
                r(43),
                r(44),
                r(45),
                r(30),
                r(16),
                r(7),
                r(26),
                r(28),
                r(46),
                r(21),
                r(27),
                r(24),
                r(19),
                r(2),
                r(25),
                r(47),
                r(10),
                r(1)
        },
        function (e, t) {
            var r
            r = (function () {
                return this
            })()
            try {
                r = r || new Function('return this')()
            } catch (e) {
                'object' == typeof window && (r = window)
            }
            e.exports = r
        },
        function (e, t) {
            var r = {}
            e.exports = r
            var n = {}
            ;(r.encode = function (e, t, r) {
                if ('string' != typeof t) throw new TypeError('"alphabet" must be a string.')
                if (void 0 !== r && 'number' != typeof r) throw new TypeError('"maxline" must be a number.')
                var n = ''
                if (e instanceof Uint8Array) {
                    var a = 0,
                        i = t.length,
                        s = t.charAt(0),
                        o = [0]
                    for (a = 0; a < e.length; ++a) {
                        for (var c = 0, u = e[a]; c < o.length; ++c) (u += o[c] << 8), (o[c] = u % i), (u = (u / i) | 0)
                        for (; u > 0; ) o.push(u % i), (u = (u / i) | 0)
                    }
                    for (a = 0; 0 === e[a] && a < e.length - 1; ++a) n += s
                    for (a = o.length - 1; a >= 0; --a) n += t[o[a]]
                } else
                    n = (function (e, t) {
                        var r = 0,
                            n = t.length,
                            a = t.charAt(0),
                            i = [0]
                        for (r = 0; r < e.length(); ++r) {
                            for (var s = 0, o = e.at(r); s < i.length; ++s)
                                (o += i[s] << 8), (i[s] = o % n), (o = (o / n) | 0)
                            for (; o > 0; ) i.push(o % n), (o = (o / n) | 0)
                        }
                        var c = ''
                        for (r = 0; 0 === e.at(r) && r < e.length() - 1; ++r) c += a
                        for (r = i.length - 1; r >= 0; --r) c += t[i[r]]
                        return c
                    })(e, t)
                if (r) {
                    var l = new RegExp('.{1,' + r + '}', 'g')
                    n = n.match(l).join('\r\n')
                }
                return n
            }),
                (r.decode = function (e, t) {
                    if ('string' != typeof e) throw new TypeError('"input" must be a string.')
                    if ('string' != typeof t) throw new TypeError('"alphabet" must be a string.')
                    var r = n[t]
                    if (!r) {
                        r = n[t] = []
                        for (var a = 0; a < t.length; ++a) r[t.charCodeAt(a)] = a
                    }
                    e = e.replace(/\s/g, '')
                    var i = t.length,
                        s = t.charAt(0),
                        o = [0]
                    for (a = 0; a < e.length; a++) {
                        var c = r[e.charCodeAt(a)]
                        if (void 0 === c) return
                        for (var u = 0, l = c; u < o.length; ++u) (l += o[u] * i), (o[u] = 255 & l), (l >>= 8)
                        for (; l > 0; ) o.push(255 & l), (l >>= 8)
                    }
                    for (var p = 0; e[p] === s && p < e.length - 1; ++p) o.push(0)
                    return 'undefined' != typeof Buffer ? Buffer.from(o.reverse()) : new Uint8Array(o.reverse())
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(5), r(10)
            var a = (e.exports = n.tls)
            function i(e, t, r) {
                var i = t.entity === n.tls.ConnectionEnd.client
                ;(e.read.cipherState = {
                    init: !1,
                    cipher: n.cipher.createDecipher('AES-CBC', i ? r.keys.server_write_key : r.keys.client_write_key),
                    iv: i ? r.keys.server_write_IV : r.keys.client_write_IV,
                }),
                    (e.write.cipherState = {
                        init: !1,
                        cipher: n.cipher.createCipher('AES-CBC', i ? r.keys.client_write_key : r.keys.server_write_key),
                        iv: i ? r.keys.client_write_IV : r.keys.server_write_IV,
                    }),
                    (e.read.cipherFunction = u),
                    (e.write.cipherFunction = s),
                    (e.read.macLength = e.write.macLength = r.mac_length),
                    (e.read.macFunction = e.write.macFunction = a.hmac_sha1)
            }
            function s(e, t) {
                var r,
                    i = !1,
                    s = t.macFunction(t.macKey, t.sequenceNumber, e)
                e.fragment.putBytes(s),
                    t.updateSequenceNumber(),
                    (r =
                        e.version.minor === a.Versions.TLS_1_0.minor
                            ? t.cipherState.init
                                ? null
                                : t.cipherState.iv
                            : n.random.getBytesSync(16)),
                    (t.cipherState.init = !0)
                var c = t.cipherState.cipher
                return (
                    c.start({ iv: r }),
                    e.version.minor >= a.Versions.TLS_1_1.minor && c.output.putBytes(r),
                    c.update(e.fragment),
                    c.finish(o) && ((e.fragment = c.output), (e.length = e.fragment.length()), (i = !0)),
                    i
                )
            }
            function o(e, t, r) {
                if (!r) {
                    var n = e - (t.length() % e)
                    t.fillWithByte(n - 1, n)
                }
                return !0
            }
            function c(e, t, r) {
                var n = !0
                if (r) {
                    for (var a = t.length(), i = t.last(), s = a - 1 - i; s < a - 1; ++s) n = n && t.at(s) == i
                    n && t.truncate(i + 1)
                }
                return n
            }
            function u(e, t) {
                var r,
                    i = !1
                ;(r =
                    e.version.minor === a.Versions.TLS_1_0.minor
                        ? t.cipherState.init
                            ? null
                            : t.cipherState.iv
                        : e.fragment.getBytes(16)),
                    (t.cipherState.init = !0)
                var s = t.cipherState.cipher
                s.start({ iv: r }), s.update(e.fragment), (i = s.finish(c))
                var o = t.macLength,
                    u = n.random.getBytesSync(o),
                    l = s.output.length()
                l >= o
                    ? ((e.fragment = s.output.getBytes(l - o)), (u = s.output.getBytes(o)))
                    : (e.fragment = s.output.getBytes()),
                    (e.fragment = n.util.createBuffer(e.fragment)),
                    (e.length = e.fragment.length())
                var p = t.macFunction(t.macKey, t.sequenceNumber, e)
                return (
                    t.updateSequenceNumber(),
                    (i =
                        (function (e, t, r) {
                            var a = n.hmac.create()
                            return (
                                a.start('SHA1', e),
                                a.update(t),
                                (t = a.digest().getBytes()),
                                a.start(null, null),
                                a.update(r),
                                (r = a.digest().getBytes()),
                                t === r
                            )
                        })(t.macKey, u, p) && i)
                )
            }
            ;(a.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA = {
                id: [0, 47],
                name: 'TLS_RSA_WITH_AES_128_CBC_SHA',
                initSecurityParameters: function (e) {
                    ;(e.bulk_cipher_algorithm = a.BulkCipherAlgorithm.aes),
                        (e.cipher_type = a.CipherType.block),
                        (e.enc_key_length = 16),
                        (e.block_length = 16),
                        (e.fixed_iv_length = 16),
                        (e.record_iv_length = 16),
                        (e.mac_algorithm = a.MACAlgorithm.hmac_sha1),
                        (e.mac_length = 20),
                        (e.mac_key_length = 20)
                },
                initConnectionState: i,
            }),
                (a.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA = {
                    id: [0, 53],
                    name: 'TLS_RSA_WITH_AES_256_CBC_SHA',
                    initSecurityParameters: function (e) {
                        ;(e.bulk_cipher_algorithm = a.BulkCipherAlgorithm.aes),
                            (e.cipher_type = a.CipherType.block),
                            (e.enc_key_length = 32),
                            (e.block_length = 16),
                            (e.fixed_iv_length = 16),
                            (e.record_iv_length = 16),
                            (e.mac_algorithm = a.MACAlgorithm.hmac_sha1),
                            (e.mac_length = 20),
                            (e.mac_key_length = 20)
                    },
                    initConnectionState: i,
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(30), (e.exports = n.mgf = n.mgf || {}), (n.mgf.mgf1 = n.mgf1)
        },
        function (e, t, r) {
            var n = r(0)
            r(13), r(2), r(31), r(1)
            var a = r(42),
                i = a.publicKeyValidator,
                s = a.privateKeyValidator
            if (void 0 === o) var o = n.jsbn.BigInteger
            var c = n.util.ByteBuffer,
                u = 'undefined' == typeof Buffer ? Uint8Array : Buffer
            ;(n.pki = n.pki || {}), (e.exports = n.pki.ed25519 = n.ed25519 = n.ed25519 || {})
            var l = n.ed25519
            function p(e) {
                var t = e.message
                if (t instanceof Uint8Array || t instanceof u) return t
                var r = e.encoding
                if (void 0 === t) {
                    if (!e.md) throw new TypeError('"options.message" or "options.md" not specified.')
                    ;(t = e.md.digest().getBytes()), (r = 'binary')
                }
                if ('string' == typeof t && !r) throw new TypeError('"options.encoding" must be "binary" or "utf8".')
                if ('string' == typeof t) {
                    if ('undefined' != typeof Buffer) return Buffer.from(t, r)
                    t = new c(t, r)
                } else if (!(t instanceof c))
                    throw new TypeError(
                        '"options.message" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a string with "options.encoding" specifying its encoding.'
                    )
                for (var n = new u(t.length()), a = 0; a < n.length; ++a) n[a] = t.at(a)
                return n
            }
            ;(l.constants = {}),
                (l.constants.PUBLIC_KEY_BYTE_LENGTH = 32),
                (l.constants.PRIVATE_KEY_BYTE_LENGTH = 64),
                (l.constants.SEED_BYTE_LENGTH = 32),
                (l.constants.SIGN_BYTE_LENGTH = 64),
                (l.constants.HASH_BYTE_LENGTH = 64),
                (l.generateKeyPair = function (e) {
                    var t = (e = e || {}).seed
                    if (void 0 === t) t = n.random.getBytesSync(l.constants.SEED_BYTE_LENGTH)
                    else if ('string' == typeof t) {
                        if (t.length !== l.constants.SEED_BYTE_LENGTH)
                            throw new TypeError('"seed" must be ' + l.constants.SEED_BYTE_LENGTH + ' bytes in length.')
                    } else if (!(t instanceof Uint8Array))
                        throw new TypeError('"seed" must be a node.js Buffer, Uint8Array, or a binary string.')
                    t = p({ message: t, encoding: 'binary' })
                    for (
                        var r = new u(l.constants.PUBLIC_KEY_BYTE_LENGTH),
                            a = new u(l.constants.PRIVATE_KEY_BYTE_LENGTH),
                            i = 0;
                        i < 32;
                        ++i
                    )
                        a[i] = t[i]
                    return (
                        (function (e, t) {
                            var r,
                                n = [P(), P(), P(), P()],
                                a = E(t, 32)
                            for (a[0] &= 248, a[31] &= 127, a[31] |= 64, L(n, a), A(e, n), r = 0; r < 32; ++r)
                                t[r + 32] = e[r]
                        })(r, a),
                        { publicKey: r, privateKey: a }
                    )
                }),
                (l.privateKeyFromAsn1 = function (e) {
                    var t = {},
                        r = []
                    if (!n.asn1.validate(e, s, t, r)) {
                        var a = new Error('Invalid Key.')
                        throw ((a.errors = r), a)
                    }
                    var i = n.asn1.derToOid(t.privateKeyOid),
                        o = n.oids.EdDSA25519
                    if (i !== o) throw new Error('Invalid OID "' + i + '"; OID must be "' + o + '".')
                    var c = t.privateKey
                    return { privateKeyBytes: p({ message: n.asn1.fromDer(c).value, encoding: 'binary' }) }
                }),
                (l.publicKeyFromAsn1 = function (e) {
                    var t = {},
                        r = []
                    if (!n.asn1.validate(e, i, t, r)) {
                        var a = new Error('Invalid Key.')
                        throw ((a.errors = r), a)
                    }
                    var s = n.asn1.derToOid(t.publicKeyOid),
                        o = n.oids.EdDSA25519
                    if (s !== o) throw new Error('Invalid OID "' + s + '"; OID must be "' + o + '".')
                    var c = t.ed25519PublicKey
                    if (c.length !== l.constants.PUBLIC_KEY_BYTE_LENGTH) throw new Error('Key length is invalid.')
                    return p({ message: c, encoding: 'binary' })
                }),
                (l.publicKeyFromPrivateKey = function (e) {
                    var t = p({ message: (e = e || {}).privateKey, encoding: 'binary' })
                    if (t.length !== l.constants.PRIVATE_KEY_BYTE_LENGTH)
                        throw new TypeError(
                            '"options.privateKey" must have a byte length of ' + l.constants.PRIVATE_KEY_BYTE_LENGTH
                        )
                    for (var r = new u(l.constants.PUBLIC_KEY_BYTE_LENGTH), n = 0; n < r.length; ++n) r[n] = t[32 + n]
                    return r
                }),
                (l.sign = function (e) {
                    var t = p((e = e || {})),
                        r = p({ message: e.privateKey, encoding: 'binary' })
                    if (r.length === l.constants.SEED_BYTE_LENGTH) r = l.generateKeyPair({ seed: r }).privateKey
                    else if (r.length !== l.constants.PRIVATE_KEY_BYTE_LENGTH)
                        throw new TypeError(
                            '"options.privateKey" must have a byte length of ' +
                                l.constants.SEED_BYTE_LENGTH +
                                ' or ' +
                                l.constants.PRIVATE_KEY_BYTE_LENGTH
                        )
                    var n = new u(l.constants.SIGN_BYTE_LENGTH + t.length)
                    !(function (e, t, r, n) {
                        var a,
                            i,
                            s = new Float64Array(64),
                            o = [P(), P(), P(), P()],
                            c = E(n, 32)
                        ;(c[0] &= 248), (c[31] &= 127), (c[31] |= 64)
                        var u = r + 64
                        for (a = 0; a < r; ++a) e[64 + a] = t[a]
                        for (a = 0; a < 32; ++a) e[32 + a] = c[32 + a]
                        var l = E(e.subarray(32), r + 32)
                        for (T(l), L(o, l), A(e, o), a = 32; a < 64; ++a) e[a] = n[a]
                        var p = E(e, r + 64)
                        for (T(p), a = 32; a < 64; ++a) s[a] = 0
                        for (a = 0; a < 32; ++a) s[a] = l[a]
                        for (a = 0; a < 32; ++a) for (i = 0; i < 32; i++) s[a + i] += p[a] * c[i]
                        S(e.subarray(32), s)
                    })(n, t, t.length, r)
                    for (var a = new u(l.constants.SIGN_BYTE_LENGTH), i = 0; i < a.length; ++i) a[i] = n[i]
                    return a
                }),
                (l.verify = function (e) {
                    var t = p((e = e || {}))
                    if (void 0 === e.signature)
                        throw new TypeError(
                            '"options.signature" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a binary string.'
                        )
                    var r = p({ message: e.signature, encoding: 'binary' })
                    if (r.length !== l.constants.SIGN_BYTE_LENGTH)
                        throw new TypeError(
                            '"options.signature" must have a byte length of ' + l.constants.SIGN_BYTE_LENGTH
                        )
                    var n = p({ message: e.publicKey, encoding: 'binary' })
                    if (n.length !== l.constants.PUBLIC_KEY_BYTE_LENGTH)
                        throw new TypeError(
                            '"options.publicKey" must have a byte length of ' + l.constants.PUBLIC_KEY_BYTE_LENGTH
                        )
                    var a,
                        i = new u(l.constants.SIGN_BYTE_LENGTH + t.length),
                        s = new u(l.constants.SIGN_BYTE_LENGTH + t.length)
                    for (a = 0; a < l.constants.SIGN_BYTE_LENGTH; ++a) i[a] = r[a]
                    for (a = 0; a < t.length; ++a) i[a + l.constants.SIGN_BYTE_LENGTH] = t[a]
                    return (
                        (function (e, t, r, n) {
                            var a,
                                i = new u(32),
                                s = [P(), P(), P(), P()],
                                o = [P(), P(), P(), P()]
                            if ((-1, r < 64)) return -1
                            if (
                                (function (e, t) {
                                    var r = P(),
                                        n = P(),
                                        a = P(),
                                        i = P(),
                                        s = P(),
                                        o = P(),
                                        c = P()
                                    _(e[2], h),
                                        (function (e, t) {
                                            var r
                                            for (r = 0; r < 16; ++r) e[r] = t[2 * r] + (t[2 * r + 1] << 8)
                                            e[15] &= 32767
                                        })(e[1], t),
                                        x(a, e[1]),
                                        K(i, a, d),
                                        O(a, a, e[2]),
                                        V(i, e[2], i),
                                        x(s, i),
                                        x(o, s),
                                        K(c, o, s),
                                        K(r, c, a),
                                        K(r, r, i),
                                        (function (e, t) {
                                            var r,
                                                n = P()
                                            for (r = 0; r < 16; ++r) n[r] = t[r]
                                            for (r = 250; r >= 0; --r) x(n, n), 1 !== r && K(n, n, t)
                                            for (r = 0; r < 16; ++r) e[r] = n[r]
                                        })(r, r),
                                        K(r, r, a),
                                        K(r, r, i),
                                        K(r, r, i),
                                        K(e[0], r, i),
                                        x(n, e[0]),
                                        K(n, n, i),
                                        N(n, a) && K(e[0], e[0], C)
                                    if ((x(n, e[0]), K(n, n, i), N(n, a))) return -1
                                    w(e[0]) === t[31] >> 7 && O(e[0], f, e[0])
                                    return K(e[3], e[0], e[1]), 0
                                })(o, n)
                            )
                                return -1
                            for (a = 0; a < r; ++a) e[a] = t[a]
                            for (a = 0; a < 32; ++a) e[a + 32] = n[a]
                            var c = E(e, r)
                            if ((T(c), R(s, o, c), L(o, t.subarray(32)), I(s, o), A(i, s), (r -= 64), k(t, 0, i, 0))) {
                                for (a = 0; a < r; ++a) e[a] = 0
                                return -1
                            }
                            for (a = 0; a < r; ++a) e[a] = t[a + 64]
                            return r
                        })(s, i, i.length, n) >= 0
                    )
                })
            var f = P(),
                h = P([1]),
                d = P([
                    30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886,
                    20995,
                ]),
                y = P([
                    61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772,
                    9222,
                ]),
                g = P([
                    54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590,
                    14035, 8553,
                ]),
                v = P([
                    26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214,
                    26214, 26214,
                ]),
                m = new Float64Array([
                    237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 16,
                ]),
                C = P([
                    41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344,
                    11139,
                ])
            function E(e, t) {
                var r = n.md.sha512.create(),
                    a = new c(e)
                r.update(a.getBytes(t), 'binary')
                var i = r.digest().getBytes()
                if ('undefined' != typeof Buffer) return Buffer.from(i, 'binary')
                for (var s = new u(l.constants.HASH_BYTE_LENGTH), o = 0; o < 64; ++o) s[o] = i.charCodeAt(o)
                return s
            }
            function S(e, t) {
                var r, n, a, i
                for (n = 63; n >= 32; --n) {
                    for (r = 0, a = n - 32, i = n - 12; a < i; ++a)
                        (t[a] += r - 16 * t[n] * m[a - (n - 32)]), (r = (t[a] + 128) >> 8), (t[a] -= 256 * r)
                    ;(t[a] += r), (t[n] = 0)
                }
                for (r = 0, a = 0; a < 32; ++a) (t[a] += r - (t[31] >> 4) * m[a]), (r = t[a] >> 8), (t[a] &= 255)
                for (a = 0; a < 32; ++a) t[a] -= r * m[a]
                for (n = 0; n < 32; ++n) (t[n + 1] += t[n] >> 8), (e[n] = 255 & t[n])
            }
            function T(e) {
                for (var t = new Float64Array(64), r = 0; r < 64; ++r) (t[r] = e[r]), (e[r] = 0)
                S(e, t)
            }
            function I(e, t) {
                var r = P(),
                    n = P(),
                    a = P(),
                    i = P(),
                    s = P(),
                    o = P(),
                    c = P(),
                    u = P(),
                    l = P()
                O(r, e[1], e[0]),
                    O(l, t[1], t[0]),
                    K(r, r, l),
                    V(n, e[0], e[1]),
                    V(l, t[0], t[1]),
                    K(n, n, l),
                    K(a, e[3], t[3]),
                    K(a, a, y),
                    K(i, e[2], t[2]),
                    V(i, i, i),
                    O(s, n, r),
                    O(o, i, a),
                    V(c, i, a),
                    V(u, n, r),
                    K(e[0], s, o),
                    K(e[1], u, c),
                    K(e[2], c, o),
                    K(e[3], s, u)
            }
            function b(e, t, r) {
                for (var n = 0; n < 4; ++n) D(e[n], t[n], r)
            }
            function A(e, t) {
                var r = P(),
                    n = P(),
                    a = P()
                !(function (e, t) {
                    var r,
                        n = P()
                    for (r = 0; r < 16; ++r) n[r] = t[r]
                    for (r = 253; r >= 0; --r) x(n, n), 2 !== r && 4 !== r && K(n, n, t)
                    for (r = 0; r < 16; ++r) e[r] = n[r]
                })(a, t[2]),
                    K(r, t[0], a),
                    K(n, t[1], a),
                    B(e, n),
                    (e[31] ^= w(r) << 7)
            }
            function B(e, t) {
                var r,
                    n,
                    a,
                    i = P(),
                    s = P()
                for (r = 0; r < 16; ++r) s[r] = t[r]
                for (U(s), U(s), U(s), n = 0; n < 2; ++n) {
                    for (i[0] = s[0] - 65517, r = 1; r < 15; ++r)
                        (i[r] = s[r] - 65535 - ((i[r - 1] >> 16) & 1)), (i[r - 1] &= 65535)
                    ;(i[15] = s[15] - 32767 - ((i[14] >> 16) & 1)),
                        (a = (i[15] >> 16) & 1),
                        (i[14] &= 65535),
                        D(s, i, 1 - a)
                }
                for (r = 0; r < 16; r++) (e[2 * r] = 255 & s[r]), (e[2 * r + 1] = s[r] >> 8)
            }
            function N(e, t) {
                var r = new u(32),
                    n = new u(32)
                return B(r, e), B(n, t), k(r, 0, n, 0)
            }
            function k(e, t, r, n) {
                return (function (e, t, r, n, a) {
                    var i,
                        s = 0
                    for (i = 0; i < a; ++i) s |= e[t + i] ^ r[n + i]
                    return (1 & ((s - 1) >>> 8)) - 1
                })(e, t, r, n, 32)
            }
            function w(e) {
                var t = new u(32)
                return B(t, e), 1 & t[0]
            }
            function R(e, t, r) {
                var n, a
                for (_(e[0], f), _(e[1], h), _(e[2], h), _(e[3], f), a = 255; a >= 0; --a)
                    b(e, t, (n = (r[(a / 8) | 0] >> (7 & a)) & 1)), I(t, e), I(e, e), b(e, t, n)
            }
            function L(e, t) {
                var r = [P(), P(), P(), P()]
                _(r[0], g), _(r[1], v), _(r[2], h), K(r[3], g, v), R(e, r, t)
            }
            function _(e, t) {
                var r
                for (r = 0; r < 16; r++) e[r] = 0 | t[r]
            }
            function U(e) {
                var t,
                    r,
                    n = 1
                for (t = 0; t < 16; ++t) (r = e[t] + n + 65535), (n = Math.floor(r / 65536)), (e[t] = r - 65536 * n)
                e[0] += n - 1 + 37 * (n - 1)
            }
            function D(e, t, r) {
                for (var n, a = ~(r - 1), i = 0; i < 16; ++i) (n = a & (e[i] ^ t[i])), (e[i] ^= n), (t[i] ^= n)
            }
            function P(e) {
                var t,
                    r = new Float64Array(16)
                if (e) for (t = 0; t < e.length; ++t) r[t] = e[t]
                return r
            }
            function V(e, t, r) {
                for (var n = 0; n < 16; ++n) e[n] = t[n] + r[n]
            }
            function O(e, t, r) {
                for (var n = 0; n < 16; ++n) e[n] = t[n] - r[n]
            }
            function x(e, t) {
                K(e, t, t)
            }
            function K(e, t, r) {
                var n,
                    a,
                    i = 0,
                    s = 0,
                    o = 0,
                    c = 0,
                    u = 0,
                    l = 0,
                    p = 0,
                    f = 0,
                    h = 0,
                    d = 0,
                    y = 0,
                    g = 0,
                    v = 0,
                    m = 0,
                    C = 0,
                    E = 0,
                    S = 0,
                    T = 0,
                    I = 0,
                    b = 0,
                    A = 0,
                    B = 0,
                    N = 0,
                    k = 0,
                    w = 0,
                    R = 0,
                    L = 0,
                    _ = 0,
                    U = 0,
                    D = 0,
                    P = 0,
                    V = r[0],
                    O = r[1],
                    x = r[2],
                    K = r[3],
                    M = r[4],
                    F = r[5],
                    q = r[6],
                    H = r[7],
                    j = r[8],
                    G = r[9],
                    Q = r[10],
                    z = r[11],
                    X = r[12],
                    Y = r[13],
                    W = r[14],
                    Z = r[15]
                ;(i += (n = t[0]) * V),
                    (s += n * O),
                    (o += n * x),
                    (c += n * K),
                    (u += n * M),
                    (l += n * F),
                    (p += n * q),
                    (f += n * H),
                    (h += n * j),
                    (d += n * G),
                    (y += n * Q),
                    (g += n * z),
                    (v += n * X),
                    (m += n * Y),
                    (C += n * W),
                    (E += n * Z),
                    (s += (n = t[1]) * V),
                    (o += n * O),
                    (c += n * x),
                    (u += n * K),
                    (l += n * M),
                    (p += n * F),
                    (f += n * q),
                    (h += n * H),
                    (d += n * j),
                    (y += n * G),
                    (g += n * Q),
                    (v += n * z),
                    (m += n * X),
                    (C += n * Y),
                    (E += n * W),
                    (S += n * Z),
                    (o += (n = t[2]) * V),
                    (c += n * O),
                    (u += n * x),
                    (l += n * K),
                    (p += n * M),
                    (f += n * F),
                    (h += n * q),
                    (d += n * H),
                    (y += n * j),
                    (g += n * G),
                    (v += n * Q),
                    (m += n * z),
                    (C += n * X),
                    (E += n * Y),
                    (S += n * W),
                    (T += n * Z),
                    (c += (n = t[3]) * V),
                    (u += n * O),
                    (l += n * x),
                    (p += n * K),
                    (f += n * M),
                    (h += n * F),
                    (d += n * q),
                    (y += n * H),
                    (g += n * j),
                    (v += n * G),
                    (m += n * Q),
                    (C += n * z),
                    (E += n * X),
                    (S += n * Y),
                    (T += n * W),
                    (I += n * Z),
                    (u += (n = t[4]) * V),
                    (l += n * O),
                    (p += n * x),
                    (f += n * K),
                    (h += n * M),
                    (d += n * F),
                    (y += n * q),
                    (g += n * H),
                    (v += n * j),
                    (m += n * G),
                    (C += n * Q),
                    (E += n * z),
                    (S += n * X),
                    (T += n * Y),
                    (I += n * W),
                    (b += n * Z),
                    (l += (n = t[5]) * V),
                    (p += n * O),
                    (f += n * x),
                    (h += n * K),
                    (d += n * M),
                    (y += n * F),
                    (g += n * q),
                    (v += n * H),
                    (m += n * j),
                    (C += n * G),
                    (E += n * Q),
                    (S += n * z),
                    (T += n * X),
                    (I += n * Y),
                    (b += n * W),
                    (A += n * Z),
                    (p += (n = t[6]) * V),
                    (f += n * O),
                    (h += n * x),
                    (d += n * K),
                    (y += n * M),
                    (g += n * F),
                    (v += n * q),
                    (m += n * H),
                    (C += n * j),
                    (E += n * G),
                    (S += n * Q),
                    (T += n * z),
                    (I += n * X),
                    (b += n * Y),
                    (A += n * W),
                    (B += n * Z),
                    (f += (n = t[7]) * V),
                    (h += n * O),
                    (d += n * x),
                    (y += n * K),
                    (g += n * M),
                    (v += n * F),
                    (m += n * q),
                    (C += n * H),
                    (E += n * j),
                    (S += n * G),
                    (T += n * Q),
                    (I += n * z),
                    (b += n * X),
                    (A += n * Y),
                    (B += n * W),
                    (N += n * Z),
                    (h += (n = t[8]) * V),
                    (d += n * O),
                    (y += n * x),
                    (g += n * K),
                    (v += n * M),
                    (m += n * F),
                    (C += n * q),
                    (E += n * H),
                    (S += n * j),
                    (T += n * G),
                    (I += n * Q),
                    (b += n * z),
                    (A += n * X),
                    (B += n * Y),
                    (N += n * W),
                    (k += n * Z),
                    (d += (n = t[9]) * V),
                    (y += n * O),
                    (g += n * x),
                    (v += n * K),
                    (m += n * M),
                    (C += n * F),
                    (E += n * q),
                    (S += n * H),
                    (T += n * j),
                    (I += n * G),
                    (b += n * Q),
                    (A += n * z),
                    (B += n * X),
                    (N += n * Y),
                    (k += n * W),
                    (w += n * Z),
                    (y += (n = t[10]) * V),
                    (g += n * O),
                    (v += n * x),
                    (m += n * K),
                    (C += n * M),
                    (E += n * F),
                    (S += n * q),
                    (T += n * H),
                    (I += n * j),
                    (b += n * G),
                    (A += n * Q),
                    (B += n * z),
                    (N += n * X),
                    (k += n * Y),
                    (w += n * W),
                    (R += n * Z),
                    (g += (n = t[11]) * V),
                    (v += n * O),
                    (m += n * x),
                    (C += n * K),
                    (E += n * M),
                    (S += n * F),
                    (T += n * q),
                    (I += n * H),
                    (b += n * j),
                    (A += n * G),
                    (B += n * Q),
                    (N += n * z),
                    (k += n * X),
                    (w += n * Y),
                    (R += n * W),
                    (L += n * Z),
                    (v += (n = t[12]) * V),
                    (m += n * O),
                    (C += n * x),
                    (E += n * K),
                    (S += n * M),
                    (T += n * F),
                    (I += n * q),
                    (b += n * H),
                    (A += n * j),
                    (B += n * G),
                    (N += n * Q),
                    (k += n * z),
                    (w += n * X),
                    (R += n * Y),
                    (L += n * W),
                    (_ += n * Z),
                    (m += (n = t[13]) * V),
                    (C += n * O),
                    (E += n * x),
                    (S += n * K),
                    (T += n * M),
                    (I += n * F),
                    (b += n * q),
                    (A += n * H),
                    (B += n * j),
                    (N += n * G),
                    (k += n * Q),
                    (w += n * z),
                    (R += n * X),
                    (L += n * Y),
                    (_ += n * W),
                    (U += n * Z),
                    (C += (n = t[14]) * V),
                    (E += n * O),
                    (S += n * x),
                    (T += n * K),
                    (I += n * M),
                    (b += n * F),
                    (A += n * q),
                    (B += n * H),
                    (N += n * j),
                    (k += n * G),
                    (w += n * Q),
                    (R += n * z),
                    (L += n * X),
                    (_ += n * Y),
                    (U += n * W),
                    (D += n * Z),
                    (E += (n = t[15]) * V),
                    (s += 38 * (T += n * x)),
                    (o += 38 * (I += n * K)),
                    (c += 38 * (b += n * M)),
                    (u += 38 * (A += n * F)),
                    (l += 38 * (B += n * q)),
                    (p += 38 * (N += n * H)),
                    (f += 38 * (k += n * j)),
                    (h += 38 * (w += n * G)),
                    (d += 38 * (R += n * Q)),
                    (y += 38 * (L += n * z)),
                    (g += 38 * (_ += n * X)),
                    (v += 38 * (U += n * Y)),
                    (m += 38 * (D += n * W)),
                    (C += 38 * (P += n * Z)),
                    (i = (n = (i += 38 * (S += n * O)) + (a = 1) + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (s = (n = s + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (o = (n = o + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (c = (n = c + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (u = (n = u + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (l = (n = l + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (p = (n = p + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (f = (n = f + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (h = (n = h + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (d = (n = d + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (y = (n = y + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (g = (n = g + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (v = (n = v + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (m = (n = m + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (C = (n = C + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (E = (n = E + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (i = (n = (i += a - 1 + 37 * (a - 1)) + (a = 1) + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (s = (n = s + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (o = (n = o + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (c = (n = c + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (u = (n = u + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (l = (n = l + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (p = (n = p + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (f = (n = f + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (h = (n = h + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (d = (n = d + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (y = (n = y + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (g = (n = g + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (v = (n = v + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (m = (n = m + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (C = (n = C + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (E = (n = E + a + 65535) - 65536 * (a = Math.floor(n / 65536))),
                    (i += a - 1 + 37 * (a - 1)),
                    (e[0] = i),
                    (e[1] = s),
                    (e[2] = o),
                    (e[3] = c),
                    (e[4] = u),
                    (e[5] = l),
                    (e[6] = p),
                    (e[7] = f),
                    (e[8] = h),
                    (e[9] = d),
                    (e[10] = y),
                    (e[11] = g),
                    (e[12] = v),
                    (e[13] = m),
                    (e[14] = C),
                    (e[15] = E)
            }
        },
        function (e, t, r) {
            var n = r(0)
            r(3)
            var a = n.asn1
            ;(t.privateKeyValidator = {
                name: 'PrivateKeyInfo',
                tagClass: a.Class.UNIVERSAL,
                type: a.Type.SEQUENCE,
                constructed: !0,
                value: [
                    {
                        name: 'PrivateKeyInfo.version',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.INTEGER,
                        constructed: !1,
                        capture: 'privateKeyVersion',
                    },
                    {
                        name: 'PrivateKeyInfo.privateKeyAlgorithm',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.SEQUENCE,
                        constructed: !0,
                        value: [
                            {
                                name: 'AlgorithmIdentifier.algorithm',
                                tagClass: a.Class.UNIVERSAL,
                                type: a.Type.OID,
                                constructed: !1,
                                capture: 'privateKeyOid',
                            },
                        ],
                    },
                    {
                        name: 'PrivateKeyInfo',
                        tagClass: a.Class.UNIVERSAL,
                        type: a.Type.OCTETSTRING,
                        constructed: !1,
                        capture: 'privateKey',
                    },
                ],
            }),
                (t.publicKeyValidator = {
                    name: 'SubjectPublicKeyInfo',
                    tagClass: a.Class.UNIVERSAL,
                    type: a.Type.SEQUENCE,
                    constructed: !0,
                    captureAsn1: 'subjectPublicKeyInfo',
                    value: [
                        {
                            name: 'SubjectPublicKeyInfo.AlgorithmIdentifier',
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.SEQUENCE,
                            constructed: !0,
                            value: [
                                {
                                    name: 'AlgorithmIdentifier.algorithm',
                                    tagClass: a.Class.UNIVERSAL,
                                    type: a.Type.OID,
                                    constructed: !1,
                                    capture: 'publicKeyOid',
                                },
                            ],
                        },
                        {
                            tagClass: a.Class.UNIVERSAL,
                            type: a.Type.BITSTRING,
                            constructed: !1,
                            composed: !0,
                            captureBitStringValue: 'ed25519PublicKey',
                        },
                    ],
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(1), r(2), r(13), (e.exports = n.kem = n.kem || {})
            var a = n.jsbn.BigInteger
            function i(e, t, r, a) {
                e.generate = function (e, i) {
                    for (
                        var s = new n.util.ByteBuffer(), o = Math.ceil(i / a) + r, c = new n.util.ByteBuffer(), u = r;
                        u < o;
                        ++u
                    ) {
                        c.putInt32(u), t.start(), t.update(e + c.getBytes())
                        var l = t.digest()
                        s.putBytes(l.getBytes(a))
                    }
                    return s.truncate(s.length() - i), s.getBytes()
                }
            }
            ;(n.kem.rsa = {}),
                (n.kem.rsa.create = function (e, t) {
                    var r = (t = t || {}).prng || n.random,
                        i = {
                            encrypt: function (t, i) {
                                var s,
                                    o = Math.ceil(t.n.bitLength() / 8)
                                do {
                                    s = new a(n.util.bytesToHex(r.getBytesSync(o)), 16).mod(t.n)
                                } while (s.compareTo(a.ONE) <= 0)
                                var c = o - (s = n.util.hexToBytes(s.toString(16))).length
                                return (
                                    c > 0 && (s = n.util.fillString(String.fromCharCode(0), c) + s),
                                    { encapsulation: t.encrypt(s, 'NONE'), key: e.generate(s, i) }
                                )
                            },
                            decrypt: function (t, r, n) {
                                var a = t.decrypt(r, 'NONE')
                                return e.generate(a, n)
                            },
                        }
                    return i
                }),
                (n.kem.kdf1 = function (e, t) {
                    i(this, e, 0, t || e.digestLength)
                }),
                (n.kem.kdf2 = function (e, t) {
                    i(this, e, 1, t || e.digestLength)
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(1),
                (e.exports = n.log = n.log || {}),
                (n.log.levels = ['none', 'error', 'warning', 'info', 'debug', 'verbose', 'max'])
            var a = {},
                i = [],
                s = null
            ;(n.log.LEVEL_LOCKED = 2), (n.log.NO_LEVEL_CHECK = 4), (n.log.INTERPOLATE = 8)
            for (var o = 0; o < n.log.levels.length; ++o) {
                var c = n.log.levels[o]
                a[c] = { index: o, name: c.toUpperCase() }
            }
            ;(n.log.logMessage = function (e) {
                for (var t = a[e.level].index, r = 0; r < i.length; ++r) {
                    var s = i[r]
                    if (s.flags & n.log.NO_LEVEL_CHECK) s.f(e)
                    else t <= a[s.level].index && s.f(s, e)
                }
            }),
                (n.log.prepareStandard = function (e) {
                    'standard' in e || (e.standard = a[e.level].name + ' [' + e.category + '] ' + e.message)
                }),
                (n.log.prepareFull = function (e) {
                    if (!('full' in e)) {
                        var t = [e.message]
                        ;(t = t.concat([] || !1)), (e.full = n.util.format.apply(this, t))
                    }
                }),
                (n.log.prepareStandardFull = function (e) {
                    'standardFull' in e || (n.log.prepareStandard(e), (e.standardFull = e.standard))
                })
            var u = ['error', 'warning', 'info', 'debug', 'verbose']
            for (o = 0; o < u.length; ++o)
                !(function (e) {
                    n.log[e] = function (t, r) {
                        var a = Array.prototype.slice.call(arguments).slice(2),
                            i = { timestamp: new Date(), level: e, category: t, message: r, arguments: a }
                        n.log.logMessage(i)
                    }
                })(u[o])
            if (
                ((n.log.makeLogger = function (e) {
                    var t = { flags: 0, f: e }
                    return n.log.setLevel(t, 'none'), t
                }),
                (n.log.setLevel = function (e, t) {
                    var r = !1
                    if (e && !(e.flags & n.log.LEVEL_LOCKED))
                        for (var a = 0; a < n.log.levels.length; ++a) {
                            if (t == n.log.levels[a]) {
                                ;(e.level = t), (r = !0)
                                break
                            }
                        }
                    return r
                }),
                (n.log.lock = function (e, t) {
                    void 0 === t || t ? (e.flags |= n.log.LEVEL_LOCKED) : (e.flags &= ~n.log.LEVEL_LOCKED)
                }),
                (n.log.addLogger = function (e) {
                    i.push(e)
                }),
                'undefined' != typeof console && 'log' in console)
            ) {
                var l
                if (console.error && console.warn && console.info && console.debug) {
                    var p = {
                            error: console.error,
                            warning: console.warn,
                            info: console.info,
                            debug: console.debug,
                            verbose: console.debug,
                        },
                        f = function (e, t) {
                            n.log.prepareStandard(t)
                            var r = p[t.level],
                                a = [t.standard]
                            ;(a = a.concat(t.arguments.slice())), r.apply(console, a)
                        }
                    l = n.log.makeLogger(f)
                } else {
                    f = function (e, t) {
                        n.log.prepareStandardFull(t), console.log(t.standardFull)
                    }
                    l = n.log.makeLogger(f)
                }
                n.log.setLevel(l, 'debug'), n.log.addLogger(l), (s = l)
            } else console = { log: function () {} }
            if (null !== s && 'undefined' != typeof window && window.location) {
                var h = new URL(window.location.href).searchParams
                if (
                    (h.has('console.level') && n.log.setLevel(s, h.get('console.level').slice(-1)[0]),
                    h.has('console.lock'))
                )
                    'true' == h.get('console.lock').slice(-1)[0] && n.log.lock(s)
            }
            n.log.consoleLogger = s
        },
        function (e, t, r) {
            ;(e.exports = r(4)), r(15), r(9), r(23), r(31)
        },
        function (e, t, r) {
            var n = r(0)
            r(5), r(3), r(11), r(6), r(7), r(29), r(2), r(1), r(18)
            var a = n.asn1,
                i = (e.exports = n.pkcs7 = n.pkcs7 || {})
            function s(e) {
                var t = {},
                    r = []
                if (!a.validate(e, i.asn1.recipientInfoValidator, t, r)) {
                    var s = new Error('Cannot read PKCS#7 RecipientInfo. ASN.1 object is not an PKCS#7 RecipientInfo.')
                    throw ((s.errors = r), s)
                }
                return {
                    version: t.version.charCodeAt(0),
                    issuer: n.pki.RDNAttributesAsArray(t.issuer),
                    serialNumber: n.util.createBuffer(t.serial).toHex(),
                    encryptedContent: {
                        algorithm: a.derToOid(t.encAlgorithm),
                        parameter: t.encParameter ? t.encParameter.value : void 0,
                        content: t.encKey,
                    },
                }
            }
            function o(e) {
                for (var t, r = [], i = 0; i < e.length; ++i)
                    r.push(
                        ((t = e[i]),
                        a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                            a.create(a.Class.UNIVERSAL, a.Type.INTEGER, !1, a.integerToDer(t.version).getBytes()),
                            a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                n.pki.distinguishedNameToAsn1({ attributes: t.issuer }),
                                a.create(a.Class.UNIVERSAL, a.Type.INTEGER, !1, n.util.hexToBytes(t.serialNumber)),
                            ]),
                            a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                a.create(
                                    a.Class.UNIVERSAL,
                                    a.Type.OID,
                                    !1,
                                    a.oidToDer(t.encryptedContent.algorithm).getBytes()
                                ),
                                a.create(a.Class.UNIVERSAL, a.Type.NULL, !1, ''),
                            ]),
                            a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, t.encryptedContent.content),
                        ]))
                    )
                return r
            }
            function c(e) {
                var t = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                    a.create(a.Class.UNIVERSAL, a.Type.INTEGER, !1, a.integerToDer(e.version).getBytes()),
                    a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                        n.pki.distinguishedNameToAsn1({ attributes: e.issuer }),
                        a.create(a.Class.UNIVERSAL, a.Type.INTEGER, !1, n.util.hexToBytes(e.serialNumber)),
                    ]),
                    a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                        a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(e.digestAlgorithm).getBytes()),
                        a.create(a.Class.UNIVERSAL, a.Type.NULL, !1, ''),
                    ]),
                ])
                if (
                    (e.authenticatedAttributesAsn1 && t.value.push(e.authenticatedAttributesAsn1),
                    t.value.push(
                        a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                            a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(e.signatureAlgorithm).getBytes()),
                            a.create(a.Class.UNIVERSAL, a.Type.NULL, !1, ''),
                        ])
                    ),
                    t.value.push(a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, e.signature)),
                    e.unauthenticatedAttributes.length > 0)
                ) {
                    for (
                        var r = a.create(a.Class.CONTEXT_SPECIFIC, 1, !0, []), i = 0;
                        i < e.unauthenticatedAttributes.length;
                        ++i
                    ) {
                        var s = e.unauthenticatedAttributes[i]
                        r.values.push(u(s))
                    }
                    t.value.push(r)
                }
                return t
            }
            function u(e) {
                var t
                if (e.type === n.pki.oids.contentType)
                    t = a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(e.value).getBytes())
                else if (e.type === n.pki.oids.messageDigest)
                    t = a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, e.value.bytes())
                else if (e.type === n.pki.oids.signingTime) {
                    var r = new Date('1950-01-01T00:00:00Z'),
                        i = new Date('2050-01-01T00:00:00Z'),
                        s = e.value
                    if ('string' == typeof s) {
                        var o = Date.parse(s)
                        s = isNaN(o) ? (13 === s.length ? a.utcTimeToDate(s) : a.generalizedTimeToDate(s)) : new Date(o)
                    }
                    t =
                        s >= r && s < i
                            ? a.create(a.Class.UNIVERSAL, a.Type.UTCTIME, !1, a.dateToUtcTime(s))
                            : a.create(a.Class.UNIVERSAL, a.Type.GENERALIZEDTIME, !1, a.dateToGeneralizedTime(s))
                }
                return a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                    a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(e.type).getBytes()),
                    a.create(a.Class.UNIVERSAL, a.Type.SET, !0, [t]),
                ])
            }
            function l(e, t, r) {
                var i = {}
                if (!a.validate(t, r, i, [])) {
                    var s = new Error('Cannot read PKCS#7 message. ASN.1 object is not a supported PKCS#7 message.')
                    throw ((s.errors = s), s)
                }
                if (a.derToOid(i.contentType) !== n.pki.oids.data)
                    throw new Error('Unsupported PKCS#7 message. Only wrapped ContentType Data supported.')
                if (i.encryptedContent) {
                    var o = ''
                    if (n.util.isArray(i.encryptedContent))
                        for (var c = 0; c < i.encryptedContent.length; ++c) {
                            if (i.encryptedContent[c].type !== a.Type.OCTETSTRING)
                                throw new Error(
                                    'Malformed PKCS#7 message, expecting encrypted content constructed of only OCTET STRING objects.'
                                )
                            o += i.encryptedContent[c].value
                        }
                    else o = i.encryptedContent
                    e.encryptedContent = {
                        algorithm: a.derToOid(i.encAlgorithm),
                        parameter: n.util.createBuffer(i.encParameter.value),
                        content: n.util.createBuffer(o),
                    }
                }
                if (i.content) {
                    o = ''
                    if (n.util.isArray(i.content))
                        for (c = 0; c < i.content.length; ++c) {
                            if (i.content[c].type !== a.Type.OCTETSTRING)
                                throw new Error(
                                    'Malformed PKCS#7 message, expecting content constructed of only OCTET STRING objects.'
                                )
                            o += i.content[c].value
                        }
                    else o = i.content
                    e.content = n.util.createBuffer(o)
                }
                return (e.version = i.version.charCodeAt(0)), (e.rawCapture = i), i
            }
            function p(e) {
                if (void 0 === e.encryptedContent.key) throw new Error('Symmetric key not available.')
                if (void 0 === e.content) {
                    var t
                    switch (e.encryptedContent.algorithm) {
                        case n.pki.oids['aes128-CBC']:
                        case n.pki.oids['aes192-CBC']:
                        case n.pki.oids['aes256-CBC']:
                            t = n.aes.createDecryptionCipher(e.encryptedContent.key)
                            break
                        case n.pki.oids.desCBC:
                        case n.pki.oids['des-EDE3-CBC']:
                            t = n.des.createDecryptionCipher(e.encryptedContent.key)
                            break
                        default:
                            throw new Error('Unsupported symmetric cipher, OID ' + e.encryptedContent.algorithm)
                    }
                    if ((t.start(e.encryptedContent.parameter), t.update(e.encryptedContent.content), !t.finish()))
                        throw new Error('Symmetric decryption failed.')
                    e.content = t.output
                }
            }
            ;(i.messageFromPem = function (e) {
                var t = n.pem.decode(e)[0]
                if ('PKCS7' !== t.type) {
                    var r = new Error('Could not convert PKCS#7 message from PEM; PEM header type is not "PKCS#7".')
                    throw ((r.headerType = t.type), r)
                }
                if (t.procType && 'ENCRYPTED' === t.procType.type)
                    throw new Error('Could not convert PKCS#7 message from PEM; PEM is encrypted.')
                var s = a.fromDer(t.body)
                return i.messageFromAsn1(s)
            }),
                (i.messageToPem = function (e, t) {
                    var r = { type: 'PKCS7', body: a.toDer(e.toAsn1()).getBytes() }
                    return n.pem.encode(r, { maxline: t })
                }),
                (i.messageFromAsn1 = function (e) {
                    var t = {},
                        r = []
                    if (!a.validate(e, i.asn1.contentInfoValidator, t, r)) {
                        var s = new Error('Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 ContentInfo.')
                        throw ((s.errors = r), s)
                    }
                    var o,
                        c = a.derToOid(t.contentType)
                    switch (c) {
                        case n.pki.oids.envelopedData:
                            o = i.createEnvelopedData()
                            break
                        case n.pki.oids.encryptedData:
                            o = i.createEncryptedData()
                            break
                        case n.pki.oids.signedData:
                            o = i.createSignedData()
                            break
                        default:
                            throw new Error(
                                'Cannot read PKCS#7 message. ContentType with OID ' + c + ' is not (yet) supported.'
                            )
                    }
                    return o.fromAsn1(t.content.value[0]), o
                }),
                (i.createSignedData = function () {
                    var e = null
                    return (e = {
                        type: n.pki.oids.signedData,
                        version: 1,
                        certificates: [],
                        crls: [],
                        signers: [],
                        digestAlgorithmIdentifiers: [],
                        contentInfo: null,
                        signerInfos: [],
                        fromAsn1: function (t) {
                            if (
                                (l(e, t, i.asn1.signedDataValidator),
                                (e.certificates = []),
                                (e.crls = []),
                                (e.digestAlgorithmIdentifiers = []),
                                (e.contentInfo = null),
                                (e.signerInfos = []),
                                e.rawCapture.certificates)
                            )
                                for (var r = e.rawCapture.certificates.value, a = 0; a < r.length; ++a)
                                    e.certificates.push(n.pki.certificateFromAsn1(r[a]))
                        },
                        toAsn1: function () {
                            e.contentInfo || e.sign()
                            for (var t = [], r = 0; r < e.certificates.length; ++r)
                                t.push(n.pki.certificateToAsn1(e.certificates[r]))
                            var i = [],
                                s = a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [
                                    a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                        a.create(
                                            a.Class.UNIVERSAL,
                                            a.Type.INTEGER,
                                            !1,
                                            a.integerToDer(e.version).getBytes()
                                        ),
                                        a.create(a.Class.UNIVERSAL, a.Type.SET, !0, e.digestAlgorithmIdentifiers),
                                        e.contentInfo,
                                    ]),
                                ])
                            return (
                                t.length > 0 && s.value[0].value.push(a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, t)),
                                i.length > 0 && s.value[0].value.push(a.create(a.Class.CONTEXT_SPECIFIC, 1, !0, i)),
                                s.value[0].value.push(a.create(a.Class.UNIVERSAL, a.Type.SET, !0, e.signerInfos)),
                                a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                    a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(e.type).getBytes()),
                                    s,
                                ])
                            )
                        },
                        addSigner: function (t) {
                            var r = t.issuer,
                                a = t.serialNumber
                            if (t.certificate) {
                                var i = t.certificate
                                'string' == typeof i && (i = n.pki.certificateFromPem(i)),
                                    (r = i.issuer.attributes),
                                    (a = i.serialNumber)
                            }
                            var s = t.key
                            if (!s) throw new Error('Could not add PKCS#7 signer; no private key specified.')
                            'string' == typeof s && (s = n.pki.privateKeyFromPem(s))
                            var o = t.digestAlgorithm || n.pki.oids.sha1
                            switch (o) {
                                case n.pki.oids.sha1:
                                case n.pki.oids.sha256:
                                case n.pki.oids.sha384:
                                case n.pki.oids.sha512:
                                case n.pki.oids.md5:
                                    break
                                default:
                                    throw new Error(
                                        'Could not add PKCS#7 signer; unknown message digest algorithm: ' + o
                                    )
                            }
                            var c = t.authenticatedAttributes || []
                            if (c.length > 0) {
                                for (var u = !1, l = !1, p = 0; p < c.length; ++p) {
                                    var f = c[p]
                                    if (u || f.type !== n.pki.oids.contentType) {
                                        if (l || f.type !== n.pki.oids.messageDigest);
                                        else if (((l = !0), u)) break
                                    } else if (((u = !0), l)) break
                                }
                                if (!u || !l)
                                    throw new Error(
                                        'Invalid signer.authenticatedAttributes. If signer.authenticatedAttributes is specified, then it must contain at least two attributes, PKCS #9 content-type and PKCS #9 message-digest.'
                                    )
                            }
                            e.signers.push({
                                key: s,
                                version: 1,
                                issuer: r,
                                serialNumber: a,
                                digestAlgorithm: o,
                                signatureAlgorithm: n.pki.oids.rsaEncryption,
                                signature: null,
                                authenticatedAttributes: c,
                                unauthenticatedAttributes: [],
                            })
                        },
                        sign: function (t) {
                            var r
                            ;((t = t || {}), 'object' != typeof e.content || null === e.contentInfo) &&
                                ((e.contentInfo = a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                    a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(n.pki.oids.data).getBytes()),
                                ])),
                                'content' in e &&
                                    (e.content instanceof n.util.ByteBuffer
                                        ? (r = e.content.bytes())
                                        : 'string' == typeof e.content && (r = n.util.encodeUtf8(e.content)),
                                    t.detached
                                        ? (e.detachedContent = a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, r))
                                        : e.contentInfo.value.push(
                                              a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [
                                                  a.create(a.Class.UNIVERSAL, a.Type.OCTETSTRING, !1, r),
                                              ])
                                          )))
                            0 !== e.signers.length &&
                                (function (t) {
                                    var r
                                    r = e.detachedContent ? e.detachedContent : (r = e.contentInfo.value[1]).value[0]
                                    if (!r)
                                        throw new Error('Could not sign PKCS#7 message; there is no content to sign.')
                                    var i = a.derToOid(e.contentInfo.value[0].value),
                                        s = a.toDer(r)
                                    for (var o in (s.getByte(), a.getBerValueLength(s), (s = s.getBytes()), t))
                                        t[o].start().update(s)
                                    for (var l = new Date(), p = 0; p < e.signers.length; ++p) {
                                        var f = e.signers[p]
                                        if (0 === f.authenticatedAttributes.length) {
                                            if (i !== n.pki.oids.data)
                                                throw new Error(
                                                    'Invalid signer; authenticatedAttributes must be present when the ContentInfo content type is not PKCS#7 Data.'
                                                )
                                        } else {
                                            f.authenticatedAttributesAsn1 = a.create(
                                                a.Class.CONTEXT_SPECIFIC,
                                                0,
                                                !0,
                                                []
                                            )
                                            for (
                                                var h = a.create(a.Class.UNIVERSAL, a.Type.SET, !0, []), d = 0;
                                                d < f.authenticatedAttributes.length;
                                                ++d
                                            ) {
                                                var y = f.authenticatedAttributes[d]
                                                y.type === n.pki.oids.messageDigest
                                                    ? (y.value = t[f.digestAlgorithm].digest())
                                                    : y.type === n.pki.oids.signingTime && (y.value || (y.value = l)),
                                                    h.value.push(u(y)),
                                                    f.authenticatedAttributesAsn1.value.push(u(y))
                                            }
                                            ;(s = a.toDer(h).getBytes()), f.md.start().update(s)
                                        }
                                        f.signature = f.key.sign(f.md, 'RSASSA-PKCS1-V1_5')
                                    }
                                    e.signerInfos = (function (e) {
                                        for (var t = [], r = 0; r < e.length; ++r) t.push(c(e[r]))
                                        return t
                                    })(e.signers)
                                })(
                                    (function () {
                                        for (var t = {}, r = 0; r < e.signers.length; ++r) {
                                            var i = e.signers[r]
                                            ;(s = i.digestAlgorithm) in t || (t[s] = n.md[n.pki.oids[s]].create()),
                                                0 === i.authenticatedAttributes.length
                                                    ? (i.md = t[s])
                                                    : (i.md = n.md[n.pki.oids[s]].create())
                                        }
                                        for (var s in ((e.digestAlgorithmIdentifiers = []), t))
                                            e.digestAlgorithmIdentifiers.push(
                                                a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                                    a.create(
                                                        a.Class.UNIVERSAL,
                                                        a.Type.OID,
                                                        !1,
                                                        a.oidToDer(s).getBytes()
                                                    ),
                                                    a.create(a.Class.UNIVERSAL, a.Type.NULL, !1, ''),
                                                ])
                                            )
                                        return t
                                    })()
                                )
                        },
                        verify: function () {
                            throw new Error('PKCS#7 signature verification not yet implemented.')
                        },
                        addCertificate: function (t) {
                            'string' == typeof t && (t = n.pki.certificateFromPem(t)), e.certificates.push(t)
                        },
                        addCertificateRevokationList: function (e) {
                            throw new Error('PKCS#7 CRL support not yet implemented.')
                        },
                    })
                }),
                (i.createEncryptedData = function () {
                    var e = null
                    return (e = {
                        type: n.pki.oids.encryptedData,
                        version: 0,
                        encryptedContent: { algorithm: n.pki.oids['aes256-CBC'] },
                        fromAsn1: function (t) {
                            l(e, t, i.asn1.encryptedDataValidator)
                        },
                        decrypt: function (t) {
                            void 0 !== t && (e.encryptedContent.key = t), p(e)
                        },
                    })
                }),
                (i.createEnvelopedData = function () {
                    var e = null
                    return (e = {
                        type: n.pki.oids.envelopedData,
                        version: 0,
                        recipients: [],
                        encryptedContent: { algorithm: n.pki.oids['aes256-CBC'] },
                        fromAsn1: function (t) {
                            var r = l(e, t, i.asn1.envelopedDataValidator)
                            e.recipients = (function (e) {
                                for (var t = [], r = 0; r < e.length; ++r) t.push(s(e[r]))
                                return t
                            })(r.recipientInfos.value)
                        },
                        toAsn1: function () {
                            return a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                a.create(a.Class.UNIVERSAL, a.Type.OID, !1, a.oidToDer(e.type).getBytes()),
                                a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [
                                    a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                        a.create(
                                            a.Class.UNIVERSAL,
                                            a.Type.INTEGER,
                                            !1,
                                            a.integerToDer(e.version).getBytes()
                                        ),
                                        a.create(a.Class.UNIVERSAL, a.Type.SET, !0, o(e.recipients)),
                                        a.create(
                                            a.Class.UNIVERSAL,
                                            a.Type.SEQUENCE,
                                            !0,
                                            ((t = e.encryptedContent),
                                            [
                                                a.create(
                                                    a.Class.UNIVERSAL,
                                                    a.Type.OID,
                                                    !1,
                                                    a.oidToDer(n.pki.oids.data).getBytes()
                                                ),
                                                a.create(a.Class.UNIVERSAL, a.Type.SEQUENCE, !0, [
                                                    a.create(
                                                        a.Class.UNIVERSAL,
                                                        a.Type.OID,
                                                        !1,
                                                        a.oidToDer(t.algorithm).getBytes()
                                                    ),
                                                    t.parameter
                                                        ? a.create(
                                                              a.Class.UNIVERSAL,
                                                              a.Type.OCTETSTRING,
                                                              !1,
                                                              t.parameter.getBytes()
                                                          )
                                                        : void 0,
                                                ]),
                                                a.create(a.Class.CONTEXT_SPECIFIC, 0, !0, [
                                                    a.create(
                                                        a.Class.UNIVERSAL,
                                                        a.Type.OCTETSTRING,
                                                        !1,
                                                        t.content.getBytes()
                                                    ),
                                                ]),
                                            ])
                                        ),
                                    ]),
                                ]),
                            ])
                            var t
                        },
                        findRecipient: function (t) {
                            for (var r = t.issuer.attributes, n = 0; n < e.recipients.length; ++n) {
                                var a = e.recipients[n],
                                    i = a.issuer
                                if (a.serialNumber === t.serialNumber && i.length === r.length) {
                                    for (var s = !0, o = 0; o < r.length; ++o)
                                        if (i[o].type !== r[o].type || i[o].value !== r[o].value) {
                                            s = !1
                                            break
                                        }
                                    if (s) return a
                                }
                            }
                            return null
                        },
                        decrypt: function (t, r) {
                            if (void 0 === e.encryptedContent.key && void 0 !== t && void 0 !== r)
                                switch (t.encryptedContent.algorithm) {
                                    case n.pki.oids.rsaEncryption:
                                    case n.pki.oids.desCBC:
                                        var a = r.decrypt(t.encryptedContent.content)
                                        e.encryptedContent.key = n.util.createBuffer(a)
                                        break
                                    default:
                                        throw new Error(
                                            'Unsupported asymmetric cipher, OID ' + t.encryptedContent.algorithm
                                        )
                                }
                            p(e)
                        },
                        addRecipient: function (t) {
                            e.recipients.push({
                                version: 0,
                                issuer: t.issuer.attributes,
                                serialNumber: t.serialNumber,
                                encryptedContent: { algorithm: n.pki.oids.rsaEncryption, key: t.publicKey },
                            })
                        },
                        encrypt: function (t, r) {
                            if (void 0 === e.encryptedContent.content) {
                                var a, i, s
                                switch (
                                    ((r = r || e.encryptedContent.algorithm), (t = t || e.encryptedContent.key), r)
                                ) {
                                    case n.pki.oids['aes128-CBC']:
                                        ;(a = 16), (i = 16), (s = n.aes.createEncryptionCipher)
                                        break
                                    case n.pki.oids['aes192-CBC']:
                                        ;(a = 24), (i = 16), (s = n.aes.createEncryptionCipher)
                                        break
                                    case n.pki.oids['aes256-CBC']:
                                        ;(a = 32), (i = 16), (s = n.aes.createEncryptionCipher)
                                        break
                                    case n.pki.oids['des-EDE3-CBC']:
                                        ;(a = 24), (i = 8), (s = n.des.createEncryptionCipher)
                                        break
                                    default:
                                        throw new Error('Unsupported symmetric cipher, OID ' + r)
                                }
                                if (void 0 === t) t = n.util.createBuffer(n.random.getBytes(a))
                                else if (t.length() != a)
                                    throw new Error(
                                        'Symmetric key has wrong length; got ' +
                                            t.length() +
                                            ' bytes, expected ' +
                                            a +
                                            '.'
                                    )
                                ;(e.encryptedContent.algorithm = r),
                                    (e.encryptedContent.key = t),
                                    (e.encryptedContent.parameter = n.util.createBuffer(n.random.getBytes(i)))
                                var o = s(t)
                                if ((o.start(e.encryptedContent.parameter.copy()), o.update(e.content), !o.finish()))
                                    throw new Error('Symmetric encryption failed.')
                                e.encryptedContent.content = o.output
                            }
                            for (var c = 0; c < e.recipients.length; ++c) {
                                var u = e.recipients[c]
                                if (void 0 === u.encryptedContent.content)
                                    switch (u.encryptedContent.algorithm) {
                                        case n.pki.oids.rsaEncryption:
                                            u.encryptedContent.content = u.encryptedContent.key.encrypt(
                                                e.encryptedContent.key.data
                                            )
                                            break
                                        default:
                                            throw new Error(
                                                'Unsupported asymmetric cipher, OID ' + u.encryptedContent.algorithm
                                            )
                                    }
                            }
                        },
                    })
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(5), r(8), r(15), r(9), r(1)
            var a = (e.exports = n.ssh = n.ssh || {})
            function i(e, t) {
                var r = t.toString(16)
                r[0] >= '8' && (r = '00' + r)
                var a = n.util.hexToBytes(r)
                e.putInt32(a.length), e.putBytes(a)
            }
            function s(e, t) {
                e.putInt32(t.length), e.putString(t)
            }
            function o() {
                for (var e = n.md.sha1.create(), t = arguments.length, r = 0; r < t; ++r) e.update(arguments[r])
                return e.digest()
            }
            ;(a.privateKeyToPutty = function (e, t, r) {
                var a = '' === (t = t || '') ? 'none' : 'aes256-cbc',
                    c = 'PuTTY-User-Key-File-2: ssh-rsa\r\n'
                ;(c += 'Encryption: ' + a + '\r\n'), (c += 'Comment: ' + (r = r || '') + '\r\n')
                var u = n.util.createBuffer()
                s(u, 'ssh-rsa'), i(u, e.e), i(u, e.n)
                var l = n.util.encode64(u.bytes(), 64),
                    p = Math.floor(l.length / 66) + 1
                ;(c += 'Public-Lines: ' + p + '\r\n'), (c += l)
                var f,
                    h = n.util.createBuffer()
                if ((i(h, e.d), i(h, e.p), i(h, e.q), i(h, e.qInv), t)) {
                    var d = h.length() + 16 - 1
                    d -= d % 16
                    var y = o(h.bytes())
                    y.truncate(y.length() - d + h.length()), h.putBuffer(y)
                    var g = n.util.createBuffer()
                    g.putBuffer(o('\0\0\0\0', t)), g.putBuffer(o('\0\0\0', t))
                    var v = n.aes.createEncryptionCipher(g.truncate(8), 'CBC')
                    v.start(n.util.createBuffer().fillWithByte(0, 16)), v.update(h.copy()), v.finish()
                    var m = v.output
                    m.truncate(16), (f = n.util.encode64(m.bytes(), 64))
                } else f = n.util.encode64(h.bytes(), 64)
                ;(c += '\r\nPrivate-Lines: ' + (p = Math.floor(f.length / 66) + 1) + '\r\n'), (c += f)
                var C = o('putty-private-key-file-mac-key', t),
                    E = n.util.createBuffer()
                s(E, 'ssh-rsa'),
                    s(E, a),
                    s(E, r),
                    E.putInt32(u.length()),
                    E.putBuffer(u),
                    E.putInt32(h.length()),
                    E.putBuffer(h)
                var S = n.hmac.create()
                return S.start('sha1', C), S.update(E.bytes()), (c += '\r\nPrivate-MAC: ' + S.digest().toHex() + '\r\n')
            }),
                (a.publicKeyToOpenSSH = function (e, t) {
                    t = t || ''
                    var r = n.util.createBuffer()
                    return s(r, 'ssh-rsa'), i(r, e.e), i(r, e.n), 'ssh-rsa ' + n.util.encode64(r.bytes()) + ' ' + t
                }),
                (a.privateKeyToOpenSSH = function (e, t) {
                    return t
                        ? n.pki.encryptRsaPrivateKey(e, t, { legacy: !0, algorithm: 'aes128' })
                        : n.pki.privateKeyToPem(e)
                }),
                (a.getPublicKeyFingerprint = function (e, t) {
                    var r = (t = t || {}).md || n.md.md5.create(),
                        a = n.util.createBuffer()
                    s(a, 'ssh-rsa'), i(a, e.e), i(a, e.n), r.start(), r.update(a.getBytes())
                    var o = r.digest()
                    if ('hex' === t.encoding) {
                        var c = o.toHex()
                        return t.delimiter ? c.match(/.{2}/g).join(t.delimiter) : c
                    }
                    if ('binary' === t.encoding) return o.getBytes()
                    if (t.encoding) throw new Error('Unknown encoding "' + t.encoding + '".')
                    return o
                })
        },
        function (e, t, r) {
            var n,
                a,
                i,
                s = r(0),
                o = (e.exports = s.form = s.form || {})
            ;(n = jQuery),
                (a = /([^\[]*?)\[(.*?)\]/g),
                (i = function (e, t, r, i) {
                    for (var s = [], o = 0; o < t.length; ++o) {
                        var c = t[o]
                        if (-1 !== c.indexOf('[') && -1 === c.indexOf(']') && o < t.length - 1)
                            do {
                                c += '.' + t[++o]
                            } while (o < t.length - 1 && -1 === t[o].indexOf(']'))
                        s.push(c)
                    }
                    ;(t = s),
                        (s = []),
                        n.each(t, function (e, t) {
                            s = s.concat(
                                (function (e) {
                                    for (var t, r = []; (t = a.exec(e)); )
                                        t[1].length > 0 && r.push(t[1]), t.length >= 2 && r.push(t[2])
                                    return 0 === r.length && r.push(e), r
                                })(t)
                            )
                        }),
                        (t = s),
                        n.each(t, function (a, s) {
                            if ((i && 0 !== s.length && s in i && (s = i[s]), 0 === s.length && (s = e.length), e[s]))
                                a == t.length - 1 ? (n.isArray(e[s]) || (e[s] = [e[s]]), e[s].push(r)) : (e = e[s])
                            else if (a == t.length - 1) e[s] = r
                            else {
                                var o = t[a + 1]
                                if (0 === o.length) e[s] = []
                                else {
                                    var c = o - 0 == o && o.length > 0
                                    e[s] = c ? [] : {}
                                }
                                e = e[s]
                            }
                        })
                }),
                (o.serialize = function (e, t, r) {
                    var a = {}
                    return (
                        (t = t || '.'),
                        n.each(e.serializeArray(), function () {
                            i(a, this.name.split(t), this.value || '', r)
                        }),
                        a
                    )
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(10),
                (n.tls.wrapSocket = function (e) {
                    var t = e.socket,
                        r = {
                            id: t.id,
                            connected: t.connected || function (e) {},
                            closed: t.closed || function (e) {},
                            data: t.data || function (e) {},
                            error: t.error || function (e) {},
                        },
                        a = n.tls.createConnection({
                            server: !1,
                            sessionId: e.sessionId || null,
                            caStore: e.caStore || [],
                            sessionCache: e.sessionCache || null,
                            cipherSuites: e.cipherSuites || null,
                            virtualHost: e.virtualHost,
                            verify: e.verify,
                            getCertificate: e.getCertificate,
                            getPrivateKey: e.getPrivateKey,
                            getSignature: e.getSignature,
                            deflate: e.deflate,
                            inflate: e.inflate,
                            connected: function (e) {
                                1 === e.handshakes &&
                                    r.connected({ id: t.id, type: 'connect', bytesAvailable: e.data.length() })
                            },
                            tlsDataReady: function (e) {
                                return t.send(e.tlsData.getBytes())
                            },
                            dataReady: function (e) {
                                r.data({ id: t.id, type: 'socketData', bytesAvailable: e.data.length() })
                            },
                            closed: function (e) {
                                t.close()
                            },
                            error: function (e, n) {
                                r.error({
                                    id: t.id,
                                    type: 'tlsError',
                                    message: n.message,
                                    bytesAvailable: 0,
                                    error: n,
                                }),
                                    t.close()
                            },
                        })
                    ;(t.connected = function (t) {
                        a.handshake(e.sessionId)
                    }),
                        (t.closed = function (e) {
                            a.open &&
                                a.handshaking &&
                                r.error({
                                    id: t.id,
                                    type: 'ioError',
                                    message: 'Connection closed during handshake.',
                                    bytesAvailable: 0,
                                }),
                                a.close(),
                                r.closed({ id: t.id, type: 'close', bytesAvailable: 0 })
                        }),
                        (t.error = function (e) {
                            r.error({ id: t.id, type: e.type, message: e.message, bytesAvailable: 0 }), a.close()
                        })
                    var i = 0
                    return (
                        (t.data = function (e) {
                            if (a.open) {
                                if (e.bytesAvailable >= i) {
                                    var r = Math.max(e.bytesAvailable, i),
                                        n = t.receive(r)
                                    null !== n && (i = a.process(n))
                                }
                            } else t.receive(e.bytesAvailable)
                        }),
                        (r.destroy = function () {
                            t.destroy()
                        }),
                        (r.setSessionCache = function (e) {
                            a.sessionCache = tls.createSessionCache(e)
                        }),
                        (r.connect = function (e) {
                            t.connect(e)
                        }),
                        (r.close = function () {
                            a.close()
                        }),
                        (r.isConnected = function () {
                            return a.isConnected && t.isConnected()
                        }),
                        (r.send = function (e) {
                            return a.prepare(e)
                        }),
                        (r.receive = function (e) {
                            return a.data.getBytes(e)
                        }),
                        (r.bytesAvailable = function () {
                            return a.data.length()
                        }),
                        r
                    )
                })
        },
        function (e, t, r) {
            var n = r(0)
            r(32), r(33)
            var a,
                i,
                s,
                o,
                c,
                u,
                l,
                p,
                f,
                h,
                d = (e.exports = n.xhr = n.xhr || {})
            ;(a = jQuery),
                (i = 'forge.xhr'),
                (s = null),
                (o = 0),
                (c = null),
                (u = null),
                (l = {}),
                (p = 10),
                (f = n.net),
                (h = n.http),
                (d.init = function (e) {
                    n.log.debug(i, 'initializing', e),
                        (o = e.policyPort || o),
                        (c = e.policyUrl || c),
                        (p = e.connections || p),
                        (s = f.createSocketPool({
                            flashId: e.flashId,
                            policyPort: o,
                            policyUrl: c,
                            msie: e.msie || !1,
                        })),
                        (u = h.createClient({
                            url: e.url || window.location.protocol + '//' + window.location.host,
                            socketPool: s,
                            policyPort: o,
                            policyUrl: c,
                            connections: e.connections || p,
                            caCerts: e.caCerts,
                            cipherSuites: e.cipherSuites,
                            persistCookies: e.persistCookies || !0,
                            primeTlsSockets: e.primeTlsSockets || !1,
                            verify: e.verify,
                            getCertificate: e.getCertificate,
                            getPrivateKey: e.getPrivateKey,
                            getSignature: e.getSignature,
                        })),
                        (l[u.url.origin] = u),
                        n.log.debug(i, 'ready')
                }),
                (d.cleanup = function () {
                    for (var e in l) l[e].destroy()
                    ;(l = {}), (u = null), s.destroy(), (s = null)
                }),
                (d.setCookie = function (e) {
                    if (((e.maxAge = e.maxAge || -1), e.domain))
                        for (var t in l) {
                            var r = l[t]
                            h.withinCookieDomain(r.url, e) && r.secure === e.secure && r.setCookie(e)
                        }
                    else u.setCookie(e)
                }),
                (d.getCookie = function (e, t, r) {
                    var a = null
                    if (r)
                        for (var i in l) {
                            var s = l[i]
                            if (h.withinCookieDomain(s.url, r)) {
                                var o = s.getCookie(e, t)
                                null !== o && (null === a ? (a = o) : n.util.isArray(a) ? a.push(o) : (a = [a, o]))
                            }
                        }
                    else a = u.getCookie(e, t)
                    return a
                }),
                (d.removeCookie = function (e, t, r) {
                    var n = !1
                    if (r)
                        for (var a in l) {
                            var i = l[a]
                            h.withinCookieDomain(i.url, r) && i.removeCookie(e, t) && (n = !0)
                        }
                    else n = u.removeCookie(e, t)
                    return n
                }),
                (d.create = function (e) {
                    e = a.extend(
                        {
                            logWarningOnError: !0,
                            verbose: !1,
                            logError: function () {},
                            logWarning: function () {},
                            logDebug: function () {},
                            logVerbose: function () {},
                            url: null,
                        },
                        e || {}
                    )
                    var t = {
                            client: null,
                            request: null,
                            response: null,
                            asynchronous: !0,
                            sendFlag: !1,
                            errorFlag: !1,
                        },
                        r = {
                            error: e.logError || n.log.error,
                            warning: e.logWarning || n.log.warning,
                            debug: e.logDebug || n.log.debug,
                            verbose: e.logVerbose || n.log.verbose,
                        },
                        f = {
                            onreadystatechange: null,
                            readyState: 0,
                            responseText: '',
                            responseXML: null,
                            status: 0,
                            statusText: '',
                        }
                    if (null === e.url) t.client = u
                    else {
                        var d
                        try {
                            d = new URL(e.url)
                        } catch (t) {
                            new Error('Invalid url.').details = { url: e.url }
                        }
                        d.origin in l
                            ? (t.client = l[d.origin])
                            : ((t.client = h.createClient({
                                  url: e.url,
                                  socketPool: s,
                                  policyPort: e.policyPort || o,
                                  policyUrl: e.policyUrl || c,
                                  connections: e.connections || p,
                                  caCerts: e.caCerts,
                                  cipherSuites: e.cipherSuites,
                                  persistCookies: e.persistCookies || !0,
                                  primeTlsSockets: e.primeTlsSockets || !1,
                                  verify: e.verify,
                                  getCertificate: e.getCertificate,
                                  getPrivateKey: e.getPrivateKey,
                                  getSignature: e.getSignature,
                              })),
                              (l[d.origin] = t.client))
                    }
                    return (
                        (f.open = function (e, r, n, a, i) {
                            switch (e) {
                                case 'DELETE':
                                case 'GET':
                                case 'HEAD':
                                case 'OPTIONS':
                                case 'PATCH':
                                case 'POST':
                                case 'PUT':
                                    break
                                case 'CONNECT':
                                case 'TRACE':
                                case 'TRACK':
                                    throw new Error('CONNECT, TRACE and TRACK methods are disallowed')
                                default:
                                    throw new Error('Invalid method: ' + e)
                            }
                            ;(t.sendFlag = !1),
                                (f.responseText = ''),
                                (f.responseXML = null),
                                (f.status = 0),
                                (f.statusText = ''),
                                (t.request = h.createRequest({ method: e, path: r })),
                                (f.readyState = 1),
                                f.onreadystatechange && f.onreadystatechange()
                        }),
                        (f.setRequestHeader = function (e, r) {
                            if (1 != f.readyState || t.sendFlag) throw new Error('XHR not open or sending')
                            t.request.setField(e, r)
                        }),
                        (f.send = function (e) {
                            if (1 != f.readyState || t.sendFlag) throw new Error('XHR not open or sending')
                            if (e && 'GET' !== t.request.method && 'HEAD' !== t.request.method)
                                if ('undefined' != typeof XMLSerializer)
                                    if (e instanceof Document) {
                                        var n = new XMLSerializer()
                                        t.request.body = n.serializeToString(e)
                                    } else t.request.body = e
                                else void 0 !== e.xml ? (t.request.body = e.xml) : (t.request.body = e)
                            ;(t.errorFlag = !1), (t.sendFlag = !0), f.onreadystatechange && f.onreadystatechange()
                            var a = {}
                            ;(a.request = t.request),
                                (a.headerReady = function (e) {
                                    ;(f.cookies = t.client.cookies),
                                        (f.readyState = 2),
                                        (f.status = e.response.code),
                                        (f.statusText = e.response.message),
                                        (t.response = e.response),
                                        f.onreadystatechange && f.onreadystatechange(),
                                        t.response.aborted ||
                                            ((f.readyState = 3), f.onreadystatechange && f.onreadystatechange())
                                }),
                                (a.bodyReady = function (e) {
                                    f.readyState = 4
                                    var n = e.response.getField('Content-Type')
                                    if (
                                        n &&
                                        (0 === n.indexOf('text/xml') ||
                                            0 === n.indexOf('application/xml') ||
                                            -1 !== n.indexOf('+xml'))
                                    )
                                        try {
                                            var s = new ActiveXObject('MicrosoftXMLDOM')
                                            ;(s.async = !1), s.loadXML(e.response.body), (f.responseXML = s)
                                        } catch (e) {
                                            var o = new DOMParser()
                                            f.responseXML = o.parseFromString(e.body, 'text/xml')
                                        }
                                    var c = 0
                                    null !== e.response.body &&
                                        ((f.responseText = e.response.body), (c = e.response.body.length))
                                    var u = t.request,
                                        l =
                                            u.method +
                                            ' ' +
                                            u.path +
                                            ' ' +
                                            f.status +
                                            ' ' +
                                            f.statusText +
                                            ' ' +
                                            c +
                                            'B ' +
                                            (e.request.connectTime + e.request.time + e.response.time) +
                                            'ms'
                                    a.verbose
                                        ? (f.status >= 400 && a.logWarningOnError ? r.warning : r.verbose)(
                                              i,
                                              l,
                                              e,
                                              e.response.body ? '\n' + e.response.body : '\nNo content'
                                          )
                                        : (f.status >= 400 && a.logWarningOnError ? r.warning : r.debug)(i, l),
                                        f.onreadystatechange && f.onreadystatechange()
                                }),
                                (a.error = function (e) {
                                    var n = t.request
                                    r.error(i, n.method + ' ' + n.path, e),
                                        (f.responseText = ''),
                                        (f.responseXML = null),
                                        (t.errorFlag = !0),
                                        (f.status = 0),
                                        (f.statusText = ''),
                                        (f.readyState = 4),
                                        f.onreadystatechange && f.onreadystatechange()
                                }),
                                t.client.send(a)
                        }),
                        (f.abort = function () {
                            t.request.abort(),
                                (f.responseText = ''),
                                (f.responseXML = null),
                                (t.errorFlag = !0),
                                (f.status = 0),
                                (f.statusText = ''),
                                (t.request = null),
                                (t.response = null),
                                4 === f.readyState ||
                                    0 === f.readyState ||
                                    (1 === f.readyState && !t.sendFlag) ||
                                    ((f.readyState = 4),
                                    (t.sendFlag = !1),
                                    f.onreadystatechange && f.onreadystatechange()),
                                (f.readyState = 0)
                        }),
                        (f.getAllResponseHeaders = function () {
                            var e = ''
                            if (null !== t.response) {
                                var r = t.response.fields
                                a.each(r, function (t, r) {
                                    a.each(r, function (r, n) {
                                        e += t + ': ' + n + '\r\n'
                                    })
                                })
                            }
                            return e
                        }),
                        (f.getResponseHeader = function (e) {
                            var r = null
                            return (
                                null !== t.response &&
                                    e in t.response.fields &&
                                    ((r = t.response.fields[e]), n.util.isArray(r) && (r = r.join())),
                                r
                            )
                        }),
                        f
                    )
                })
        },
    ])
})
//# sourceMappingURL=forge.all.min.js.map
